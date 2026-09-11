import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  PhoneCall,
  MapPin,
  Users,
  XCircle,
  AlertTriangle,
  Radio,
  CheckCircle2,
  Copy,
} from 'lucide-react';
import { EmergencyCategory, IncidentTimelineEvent, SupportedLanguage, TrustedContact } from '../types';
import { UI_TRANSLATIONS } from '../data/translations';

interface OneTapSosViewProps {
  language: SupportedLanguage;
  trustedContacts: TrustedContact[];
  onAddTimelineEvent: (event: IncidentTimelineEvent) => void;
  onExitSos: () => void;
}

export const OneTapSosView: React.FC<OneTapSosViewProps> = ({
  language,
  trustedContacts,
  onAddTimelineEvent,
  onExitSos,
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  const [selectedEmergencyType, setSelectedEmergencyType] = useState<EmergencyCategory>('OTHER');
  const [locationCoords, setLocationCoords] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [notifiedContacts, setNotifiedContacts] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  useEffect(() => {
    onAddTimelineEvent({
      id: 'evt-' + Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      title: 'ONE-TAP SOS MODE ACTIVATED',
      type: 'STARTED',
    });

    // Automatically attempt to fetch GPS location in SOS mode
    acquireLocation();
  }, []);

  const acquireLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('GPS geolocation not supported');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocationCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: Math.round(pos.coords.accuracy),
        });
        setIsLocating(false);
        onAddTimelineEvent({
          id: 'evt-' + Date.now(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          title: `SOS GPS Acquired: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`,
          type: 'LOCATION',
        });
      },
      (err) => {
        setIsLocating(false);
        setLocationError('Please allow location permission in your browser.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const getEmergencyPhone = () => {
    switch (selectedEmergencyType) {
      case 'FIRE_SMOKE':
        return { number: '101', name: 'Fire & Rescue' };
      case 'MEDICAL':
      case 'ROAD_ACCIDENT':
        return { number: '108', name: 'Ambulance Emergency' };
      case 'CRIME_DANGER':
        return { number: '100', name: 'Police Rapid Response' };
      case 'DOMESTIC':
        return { number: '1091', name: 'Women Helpline' };
      case 'NATURAL_DISASTER':
        return { number: '1078', name: 'Disaster Relief NDRF' };
      case 'MENTAL_HEALTH':
        return { number: '14416', name: 'Mental Health Tele-MANAS' };
      default:
        return { number: '112', name: 'National Emergency Universal' };
    }
  };

  const currentService = getEmergencyPhone();

  const handleCall = () => {
    onAddTimelineEvent({
      id: 'evt-' + Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      title: `SOS Emergency Call: ${currentService.name} (${currentService.number})`,
      type: 'CONTACTED',
    });
    window.location.href = `tel:${currentService.number}`;
  };

  const handleShareLocation = () => {
    if (!locationCoords) {
      acquireLocation();
      return;
    }
    const mapsLink = `https://www.google.com/maps?q=${locationCoords.lat},${locationCoords.lng}`;
    const text = `🚨 SOS EMERGENCY ACTIVE! My Location: ${locationCoords.lat.toFixed(5)}, ${locationCoords.lng.toFixed(5)} (~${locationCoords.accuracy}m). Map: ${mapsLink}`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);

    onAddTimelineEvent({
      id: 'evt-' + Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: 'SOS Location Link Copied to Clipboard',
      type: 'ACTION',
    });
  };

  const handleNotifyTrusted = async () => {
    if (trustedContacts.length === 0) {
      alert('No trusted contacts configured. Please add contacts from "My Profile".');
      return;
    }
    const locText = locationCoords
      ? `https://www.google.com/maps?q=${locationCoords.lat},${locationCoords.lng}`
      : 'Location being acquired';

    try {
      await fetch('/api/notify-contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contacts: trustedContacts,
          emergencyType: selectedEmergencyType,
          location: locText,
          userCustomNote: 'One-Tap SOS initiated. Please respond or dispatch assistance.',
        }),
      });
      setNotifiedContacts(true);
      setTimeout(() => setNotifiedContacts(false), 3500);

      onAddTimelineEvent({
        id: 'evt-' + Date.now(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: `Dispatched SOS Broadcast to ${trustedContacts.length} Trusted Contacts`,
        type: 'NOTIFIED',
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleCancelSos = () => {
    onAddTimelineEvent({
      id: 'evt-' + Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: 'SOS Mode Stand-down / Deactivated',
      type: 'RESOLVED',
    });
    onExitSos();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="w-full max-w-xl bg-slate-900 border-2 border-rose-600 rounded-3xl p-5 sm:p-8 shadow-2xl shadow-rose-950 text-center space-y-6">
        {/* Pulsing Beacon Header */}
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-20 h-20 rounded-full bg-rose-600/30 border-2 border-rose-500 flex items-center justify-center text-rose-500 animate-pulse shadow-lg shadow-rose-900">
            <Radio className="w-10 h-10 animate-ping text-rose-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-rose-500 mt-2">
            {t.sos_active}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Minimalist high-contrast emergency control mode.
          </p>
        </div>

        {/* Emergency Type Selector */}
        <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-2xl text-left">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
            Select Specific Emergency:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {[
              { id: 'MEDICAL', label: 'Ambulance (108)' },
              { id: 'FIRE_SMOKE', label: 'Fire (101)' },
              { id: 'CRIME_DANGER', label: 'Police (100)' },
              { id: 'OTHER', label: 'Universal (112)' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedEmergencyType(item.id as EmergencyCategory)}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all ${
                  selectedEmergencyType === item.id
                    ? 'bg-rose-600 text-white border-rose-500'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Location Box */}
        <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl flex items-center justify-between text-left">
          <div className="flex items-center gap-2.5">
            <MapPin className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">
                {locationCoords
                  ? `Location: ${locationCoords.lat.toFixed(4)}, ${locationCoords.lng.toFixed(4)}`
                  : isLocating
                  ? 'Acquiring GPS coordinates...'
                  : 'GPS location pending'}
              </div>
              <div className="text-[11px] text-slate-400">
                {locationCoords ? `Accuracy: ±${locationCoords.accuracy} meters` : locationError || 'Automatic GPS lock active'}
              </div>
            </div>
          </div>
          <button
            onClick={acquireLocation}
            className="text-xs text-rose-400 hover:text-rose-300 underline font-semibold ml-2"
          >
            Refresh
          </button>
        </div>

        {/* Big Action Buttons */}
        <div className="space-y-3 pt-2">
          {/* Main Call Button */}
          <button
            id="sos-call-service-btn"
            onClick={handleCall}
            className="w-full bg-rose-600 hover:bg-rose-500 active:bg-rose-700 py-5 px-6 rounded-2xl text-2xl font-black text-white flex items-center justify-center gap-3 shadow-xl shadow-rose-900 transition-transform active:scale-98"
          >
            <PhoneCall className="w-7 h-7 animate-bounce" />
            <span>CALL {currentService.name} ({currentService.number})</span>
          </button>

          {/* Share Location Button */}
          <button
            id="sos-share-location-btn"
            onClick={handleShareLocation}
            className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 py-3.5 px-4 rounded-xl text-sm sm:text-base font-bold text-slate-100 flex items-center justify-center gap-2 transition-colors"
          >
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>{copiedLink ? 'Location Copied to Clipboard!' : 'Share My Live Location'}</span>
          </button>

          {/* Notify Trusted Contacts */}
          <button
            id="sos-notify-contacts-btn"
            onClick={handleNotifyTrusted}
            className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 py-3.5 px-4 rounded-xl text-sm sm:text-base font-bold text-slate-100 flex items-center justify-center gap-2 transition-colors"
          >
            <Users className="w-4 h-4 text-amber-400" />
            <span>
              {notifiedContacts
                ? 'Alert Dispatched to Contacts!'
                : `Notify Trusted Contacts (${trustedContacts.length})`}
            </span>
          </button>
        </div>

        {/* Safe Cancel Button */}
        <div className="pt-4 border-t border-slate-800">
          {!confirmCancel ? (
            <button
              onClick={() => setConfirmCancel(true)}
              className="text-xs text-slate-400 hover:text-rose-400 font-semibold flex items-center justify-center gap-1.5 mx-auto"
            >
              <XCircle className="w-4 h-4" />
              <span>{t.cancel_sos}</span>
            </button>
          ) : (
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
              <span className="text-xs text-slate-300">Are you sure you want to exit SOS mode?</span>
              <div className="flex gap-2">
                <button
                  onClick={handleCancelSos}
                  className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg"
                >
                  Yes, Exit SOS
                </button>
                <button
                  onClick={() => setConfirmCancel(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-2.5 py-1.5 rounded-lg"
                >
                  Stay
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
