import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  PhoneCall,
  Mic,
  MicOff,
  Flame,
  Activity,
  Shield,
  Car,
  Search,
  CloudRain,
  Zap,
  HeartHandshake,
  AlertCircle,
  Copy,
  Check,
  Share2,
  MapPin,
  Send,
  Sparkles,
  HelpCircle,
  Radio,
  ChevronRight,
  LifeBuoy,
  MessageSquare,
  Users,
} from 'lucide-react';
import {
  EmergencyCategory,
  SeverityLevel,
  AIClassificationResult,
  EmergencyService,
  SupportedLanguage,
  IncidentTimelineEvent,
  TrustedContact,
} from '../types';
import { UI_TRANSLATIONS } from '../data/translations';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
  trustedContacts: TrustedContact[];
  onAddTimelineEvent: (event: IncidentTimelineEvent) => void;
  onSelectCategoryFromHome?: EmergencyCategory;
  isDemoMode: boolean;
}

const CATEGORIES: { id: EmergencyCategory; label: string; icon: React.ReactNode; color: string }[] = [
  { id: 'MEDICAL', label: 'Medical Emergency', icon: <Activity className="w-5 h-5" />, color: 'bg-rose-500/20 text-rose-400 border-rose-500/40' },
  { id: 'FIRE_SMOKE', label: 'Fire / Smoke', icon: <Flame className="w-5 h-5" />, color: 'bg-amber-500/20 text-amber-400 border-amber-500/40' },
  { id: 'CRIME_DANGER', label: 'Crime / Threat', icon: <Shield className="w-5 h-5" />, color: 'bg-blue-500/20 text-blue-400 border-blue-500/40' },
  { id: 'ROAD_ACCIDENT', label: 'Road Accident', icon: <Car className="w-5 h-5" />, color: 'bg-orange-500/20 text-orange-400 border-orange-500/40' },
  { id: 'NATURAL_DISASTER', label: 'Flood / Disaster', icon: <CloudRain className="w-5 h-5" />, color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40' },
  { id: 'ELECTRICAL', label: 'Electrical Hazard', icon: <Zap className="w-5 h-5" />, color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40' },
  { id: 'MENTAL_HEALTH', label: 'Mental Health Crisis', icon: <LifeBuoy className="w-5 h-5" />, color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' },
  { id: 'DOMESTIC', label: 'Domestic Emergency', icon: <HeartHandshake className="w-5 h-5" />, color: 'bg-purple-500/20 text-purple-400 border-purple-500/40' },
  { id: 'MISSING_PERSON', label: 'Missing Person', icon: <Search className="w-5 h-5" />, color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40' },
  { id: 'ANIMAL_EMERGENCY', label: 'Animal Emergency', icon: <AlertCircle className="w-5 h-5" />, color: 'bg-lime-500/20 text-lime-400 border-lime-500/40' },
  { id: 'MEDICAL_ADVICE', label: 'Need Medical Advice', icon: <HelpCircle className="w-5 h-5" />, color: 'bg-teal-500/20 text-teal-400 border-teal-500/40' },
  { id: 'OTHER', label: 'Other Emergency', icon: <PhoneCall className="w-5 h-5" />, color: 'bg-slate-500/20 text-slate-400 border-slate-500/40' },
];

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  language,
  trustedContacts,
  onAddTimelineEvent,
  onSelectCategoryFromHome,
  isDemoMode,
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  const [selectedCategory, setSelectedCategory] = useState<EmergencyCategory | null>(
    onSelectCategoryFromHome || null
  );
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<(AIClassificationResult & { verified_contacts?: EmergencyService[] }) | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);
  const [notifiedStatus, setNotifiedStatus] = useState(false);

  // Recognition ref
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (onSelectCategoryFromHome) {
      setSelectedCategory(onSelectCategoryFromHome);
    }
  }, [onSelectCategoryFromHome]);

  useEffect(() => {
    if (isOpen) {
      onAddTimelineEvent({
        id: 'evt-' + Date.now(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        title: 'Emergency Assistance Interface Opened',
        type: 'STARTED',
      });
    }
  }, [isOpen]);

  // Voice recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setSpeechSupported(false);
      } else {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        // Match language
        const langMap: Record<SupportedLanguage, string> = {
          en: 'en-US',
          hi: 'hi-IN',
          ta: 'ta-IN',
          te: 'te-IN',
          ml: 'ml-IN',
          kn: 'kn-IN',
          bn: 'bn-IN',
          mr: 'mr-IN',
        };
        recognition.lang = langMap[language] || 'en-US';

        recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setInputText(transcript);
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          setIsListening(false);
          setSpeechError('Microphone audio not recognized or permission unavailable. Please type below.');
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [language]);

  const toggleListening = () => {
    if (!speechSupported || !recognitionRef.current) {
      setSpeechError('Voice speech recognition is not supported in this browser. Please type your description.');
      return;
    }
    setSpeechError(null);
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
        setIsListening(false);
      }
    }
  };

  const handleAnalyze = async (overrideText?: string, overrideCategory?: EmergencyCategory) => {
    const textToSubmit = overrideText !== undefined ? overrideText : inputText;
    const catToSubmit = overrideCategory !== undefined ? overrideCategory : selectedCategory;

    if (!textToSubmit.trim() && !catToSubmit) {
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToSubmit,
          categoryChoice: catToSubmit,
          language,
          answers,
        }),
      });

      if (!res.ok) {
        throw new Error('Classification request failed');
      }

      const data = await res.json();
      setResult(data);

      onAddTimelineEvent({
        id: 'evt-' + Date.now(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        title: `Classified as ${data.category} (${data.severity})`,
        description: `Recommended: ${data.recommended_service}`,
        type: 'CLASSIFIED',
      });
    } catch (err) {
      console.error('Error during classification:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Demo Scenarios loader
  const loadScenario = (scenario: { text: string; category: EmergencyCategory }) => {
    setInputText(scenario.text);
    setSelectedCategory(scenario.category);
    handleAnalyze(scenario.text, scenario.category);
  };

  // Copy Summary to clipboard
  const handleCopySummary = () => {
    if (!result) return;
    const summary = `🚨 [SOS CONNECT EMERGENCY SUMMARY]
Severity: ${result.severity}
Emergency Type: ${result.category}
Recommended Official Service: ${result.recommended_service}
Immediate Steps:
${result.immediate_actions.map((s, i) => `${i + 1}. ${s}`).join('\n')}

Information for Responder:
${result.required_information.map((info) => `- ${info}`).join('\n')}

Note: Generated via SOS Connect Emergency Response Guidance.`;

    navigator.clipboard.writeText(summary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);

    onAddTimelineEvent({
      id: 'evt-' + Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: 'Emergency Summary Copied',
      type: 'ACTION',
    });
  };

  // Web Share API
  const handleShareSummary = async () => {
    if (!result) return;
    const summary = `🚨 [SOS CONNECT EMERGENCY]
Severity: ${result.severity}
Type: ${result.category}
Recommended Official Service: ${result.recommended_service}
Primary Helpline: ${result.verified_contacts?.[0]?.official_phone || '112'}
Actions: ${result.immediate_actions[0] || 'Take immediate shelter'}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SOS Emergency Summary',
          text: summary,
        });
      } catch (err) {
        handleCopySummary();
      }
    } else {
      handleCopySummary();
    }
  };

  // Share Live Location
  const handleShareLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser');
      return;
    }
    setLocationStatus('Acquiring precise GPS coordinates...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
        const locMsg = `🚨 EMERGENCY LOCATION: ${latitude.toFixed(5)}, ${longitude.toFixed(5)} (Accuracy: ~${Math.round(accuracy)}m). Map: ${mapsLink}`;
        navigator.clipboard.writeText(locMsg);
        setLocationStatus(`GPS Copied! (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);

        onAddTimelineEvent({
          id: 'evt-' + Date.now(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          title: `Location Acquired (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
          type: 'LOCATION',
        });
      },
      (err) => {
        setLocationStatus('Unable to retrieve location. Please check browser permissions.');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Notify Trusted Contacts
  const handleNotifyContacts = async () => {
    if (trustedContacts.length === 0) {
      alert('No trusted contacts registered. You can add trusted contacts in "My Profile" at any time.');
      return;
    }

    try {
      const res = await fetch('/api/notify-contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contacts: trustedContacts,
          emergencyType: result?.category || selectedCategory || 'EMERGENCY',
          location: locationStatus || 'User requested emergency response',
        }),
      });
      if (res.ok) {
        setNotifiedStatus(true);
        setTimeout(() => setNotifiedStatus(false), 3000);
        onAddTimelineEvent({
          id: 'evt-' + Date.now(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          title: `Dispatched Alerts to ${trustedContacts.length} Trusted Contact(s)`,
          type: 'NOTIFIED',
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCallOfficial = (phone: string, serviceName: string) => {
    onAddTimelineEvent({
      id: 'evt-' + Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      title: `Placed Call to ${serviceName} (${phone})`,
      type: 'CONTACTED',
    });
    window.location.href = `tel:${phone}`;
  };

  if (!isOpen) return null;

  const primaryPhone =
    result?.verified_contacts?.[0]?.official_phone ||
    (selectedCategory === 'FIRE_SMOKE' ? '101' : selectedCategory === 'MEDICAL' ? '108' : selectedCategory === 'CRIME_DANGER' ? '100' : '112');
  const primaryServiceName =
    result?.verified_contacts?.[0]?.name || result?.recommended_service || 'Emergency Services (112)';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="emergency-dialog-title"
    >
      <div className="relative w-full max-w-2xl rounded-2xl border border-rose-600/50 bg-slate-900 shadow-2xl shadow-rose-950/80 text-slate-100 overflow-hidden my-auto">
        {/* Top Emergency Banner */}
        <div className="bg-rose-700 px-4 py-3 flex items-center justify-between text-white border-b border-rose-800">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-rose-200 animate-pulse" />
            <h2 id="emergency-dialog-title" className="font-extrabold text-base sm:text-lg tracking-tight">
              EMERGENCY ASSISTANCE INTERFACE
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-rose-200 hover:bg-rose-800 hover:text-white transition-colors"
            aria-label="Close emergency interface"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Demo Scenarios Quick Picker Bar */}
        {isDemoMode && (
          <div className="bg-amber-950/70 border-b border-amber-800/60 px-4 py-2 text-xs text-amber-200 flex flex-wrap items-center gap-2">
            <span className="font-bold flex items-center gap-1 text-amber-400">
              <Sparkles className="w-3.5 h-3.5" /> Demo Scenarios:
            </span>
            <button
              onClick={() =>
                loadScenario({
                  category: 'FIRE_SMOKE',
                  text: 'Dense black smoke filling 3rd floor corridor of residential apartment. Alarms sounding and people shouting.',
                })
              }
              className="bg-amber-900/60 hover:bg-amber-800 px-2 py-1 rounded text-amber-200 border border-amber-700/60"
            >
              1: Apartment Fire
            </button>
            <button
              onClick={() =>
                loadScenario({
                  category: 'ROAD_ACCIDENT',
                  text: 'Two-car highway collision with a motorcycle. A rider is unconscious on the tarmac with heavy bleeding from the leg.',
                })
              }
              className="bg-amber-900/60 hover:bg-amber-800 px-2 py-1 rounded text-amber-200 border border-amber-700/60"
            >
              2: Highway Collision & Bleeding
            </button>
            <button
              onClick={() =>
                loadScenario({
                  category: 'NATURAL_DISASTER',
                  text: 'Flash flood water entering ground floor rapidly. Electricity sparking nearby. Two elderly family members trapped inside.',
                })
              }
              className="bg-amber-900/60 hover:bg-amber-800 px-2 py-1 rounded text-amber-200 border border-amber-700/60"
            >
              3: Flash Flooding
            </button>
          </div>
        )}

        <div className="p-4 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Step 1: Input & Categories (Visible when no result or user wants to re-analyze) */}
          {!result ? (
            <>
              {/* Question Header */}
              <div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  {t.what_is_happening}
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  Select a category or describe what you see. We will immediately identify the verified official service and tell you what to do.
                </p>
              </div>

              {/* Large Visual Category Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        if (!inputText.trim()) {
                          handleAnalyze('', cat.id);
                        }
                      }}
                      className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between min-h-[78px] ${
                        isSelected
                          ? 'border-rose-500 bg-rose-950/60 text-white ring-2 ring-rose-500/50'
                          : 'border-slate-800 bg-slate-800/70 hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className={`p-1.5 rounded-lg border ${cat.color}`}>{cat.icon}</div>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />}
                      </div>
                      <span className="text-xs sm:text-sm font-semibold tracking-tight mt-2">{cat.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Voice & Text Input */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Or Describe in your words (Voice or Text):
                </label>
                <div className="relative">
                  <textarea
                    id="emergency-input-textarea"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={t.describe_emergency_placeholder}
                    rows={3}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3.5 pr-14 text-sm text-slate-100 placeholder-slate-500 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                  {/* Mic Button */}
                  <button
                    id="speech-recognition-btn"
                    onClick={toggleListening}
                    className={`absolute right-2.5 bottom-3 p-2 rounded-xl transition-all ${
                      isListening
                        ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-900'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                    title={isListening ? 'Stop listening' : 'Start voice input'}
                    aria-label="Voice input"
                  >
                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                </div>
                {isListening && (
                  <p className="text-xs text-rose-400 animate-pulse font-medium">
                    🎙️ Listening to your voice in real-time... Speak clearly.
                  </p>
                )}
                {speechError && <p className="text-xs text-amber-400">{speechError}</p>}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <button
                  id="submit-emergency-analyze-btn"
                  onClick={() => handleAnalyze()}
                  disabled={isLoading || (!inputText.trim() && !selectedCategory)}
                  className="flex-1 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 py-3 px-4 font-bold text-white text-sm sm:text-base tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-rose-950 transition-all"
                >
                  {isLoading ? (
                    <>
                      <Radio className="w-4 h-4 animate-spin" />
                      <span>{t.analyzing}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>{t.analyze_emergency}</span>
                    </>
                  )}
                </button>

                {/* Instant Call 112 directly if in a hurry */}
                <button
                  onClick={() => handleCallOfficial('112', 'Universal Emergency (112)')}
                  className="rounded-xl border border-rose-500/70 bg-slate-800 hover:bg-slate-700 py-3 px-4 font-bold text-rose-400 text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Direct Call 112</span>
                </button>
              </div>
            </>
          ) : (
            /* Step 2: Emergency Response Results View */
            <div className="space-y-5">
              {/* Top Primary Call-To-Action: HUGE CALL BUTTON */}
              <div className="rounded-2xl border-2 border-rose-600 bg-rose-950/70 p-4 sm:p-5 text-center shadow-xl shadow-rose-950/90">
                <span className="inline-block px-3 py-1 rounded-full bg-rose-600 text-white font-extrabold text-xs tracking-wider uppercase mb-2">
                  {result.severity} EMERGENCY — {result.urgency}
                </span>

                <h3 className="text-lg sm:text-xl font-bold text-white">
                  Recommended Service: <span className="text-rose-400">{primaryServiceName}</span>
                </h3>

                <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
                  Verified official emergency responder for this situation.
                </p>

                {/* The Big Call Button */}
                <button
                  id="primary-emergency-call-btn"
                  onClick={() => handleCallOfficial(primaryPhone, primaryServiceName)}
                  className="mt-4 w-full rounded-2xl bg-rose-600 hover:bg-rose-500 active:bg-rose-700 py-4 px-6 text-xl sm:text-2xl font-black text-white flex items-center justify-center gap-3 shadow-2xl shadow-rose-800 transition-all transform active:scale-98"
                >
                  <PhoneCall className="w-7 h-7 animate-bounce" />
                  <span>CALL {primaryPhone} NOW</span>
                </button>

                {/* Secondary Services (if multi-agency like fire + ambulance) */}
                {result.secondary_services && result.secondary_services.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-rose-800/60 flex flex-wrap items-center justify-center gap-2 text-xs text-rose-200">
                    <span className="font-semibold text-slate-300">Coordinated Dispatch:</span>
                    {result.secondary_services.map((sec, idx) => (
                      <span key={idx} className="bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700">
                        {sec}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions Row: Share Location & Notify Contacts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  id="emergency-share-location-btn"
                  onClick={handleShareLocation}
                  className="rounded-xl border border-slate-700 bg-slate-800/90 hover:bg-slate-700 p-3 text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 transition-colors"
                >
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>{locationStatus || 'Copy GPS Location Link'}</span>
                </button>

                <button
                  id="emergency-notify-contacts-btn"
                  onClick={handleNotifyContacts}
                  className="rounded-xl border border-slate-700 bg-slate-800/90 hover:bg-slate-700 p-3 text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 transition-colors"
                >
                  <Users className="w-4 h-4 text-rose-400" />
                  <span>
                    {notifiedStatus
                      ? 'Alert Sent to Contacts!'
                      : `Notify Trusted Contacts (${trustedContacts.length})`}
                  </span>
                </button>
              </div>

              {/* Immediate Safe Actions Checklist */}
              <div className="rounded-xl border border-slate-800 bg-slate-800/60 p-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <Shield className="w-4 h-4 text-rose-400" />
                    {t.immediate_actions} (While Waiting)
                  </h4>
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Official Protocol</span>
                </div>
                <ul className="mt-3 space-y-2.5 text-xs sm:text-sm text-slate-200">
                  {result.immediate_actions.map((act, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-rose-600/30 border border-rose-500/50 text-rose-300 text-xs font-bold flex items-center justify-center mt-0.5">
                        {i + 1}
                      </span>
                      <span className="leading-snug">{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Information to Tell Responder */}
              <div className="rounded-xl border border-slate-800 bg-slate-800/60 p-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-amber-400" />
                    {t.information_to_tell_responder}
                  </h4>
                  <button
                    onClick={handleCopySummary}
                    className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 font-medium"
                  >
                    {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSummary ? 'Copied' : 'Copy All'}</span>
                  </button>
                </div>
                <ul className="mt-3 space-y-1.5 text-xs sm:text-sm text-slate-300">
                  {result.required_information.map((info, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span>{info}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Smart Clarification Questions (if present) */}
              {result.smart_questions && result.smart_questions.length > 0 && (
                <div className="rounded-xl border border-blue-900/60 bg-blue-950/30 p-3.5 text-xs text-blue-200">
                  <span className="font-bold block text-blue-300 mb-1.5 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5" /> Key Dispatch Questions:
                  </span>
                  <ul className="space-y-1 pl-4 list-disc text-blue-300/90">
                    {result.smart_questions.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Disclaimer */}
              <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                {result.disclaimer || t.disclaimer}
              </p>

              {/* Bottom Actions: Share & Re-evaluate */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <button
                  onClick={() => setResult(null)}
                  className="text-xs text-slate-400 hover:text-white underline font-medium"
                >
                  ← Ask Another Question / Change Details
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={handleShareSummary}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-200 hover:bg-slate-700"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{t.share_summary}</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
