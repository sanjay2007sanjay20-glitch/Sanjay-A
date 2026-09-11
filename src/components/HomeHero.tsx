import React from 'react';
import {
  ShieldAlert,
  PhoneCall,
  Activity,
  Flame,
  Shield,
  Car,
  Search,
  CloudRain,
  Zap,
  HeartHandshake,
  AlertCircle,
  HelpCircle,
  LifeBuoy,
  Radio,
  ArrowRight,
  Compass,
  CheckCircle2,
  Sparkles,
  Lock,
} from 'lucide-react';
import { EmergencyCategory, SupportedLanguage } from '../types';
import { UI_TRANSLATIONS } from '../data/translations';

interface HomeHeroProps {
  language: SupportedLanguage;
  onOpenEmergencyModal: (category?: EmergencyCategory) => void;
  onNavigateToServices: () => void;
  onNavigateToSos: () => void;
  onNavigateToNearby: () => void;
  isDemoMode: boolean;
}

const QUICK_ACTIONS: {
  id: EmergencyCategory;
  title: string;
  badge: string;
  phone: string;
  icon: React.ReactNode;
  borderHover: string;
  iconBg: string;
}[] = [
  {
    id: 'MEDICAL',
    title: 'Medical Emergency',
    badge: 'Ambulance',
    phone: '108',
    icon: <Activity className="w-5 h-5 text-rose-400" />,
    borderHover: 'hover:border-rose-500',
    iconBg: 'bg-rose-500/10 border-rose-500/20',
  },
  {
    id: 'FIRE_SMOKE',
    title: 'Fire & Rescue',
    badge: 'Fire Department',
    phone: '101',
    icon: <Flame className="w-5 h-5 text-amber-400" />,
    borderHover: 'hover:border-amber-500',
    iconBg: 'bg-amber-500/10 border-amber-500/20',
  },
  {
    id: 'CRIME_DANGER',
    title: 'Crime & Security',
    badge: 'Police Control',
    phone: '100',
    icon: <Shield className="w-5 h-5 text-blue-400" />,
    borderHover: 'hover:border-blue-500',
    iconBg: 'bg-blue-500/10 border-blue-500/20',
  },
  {
    id: 'ROAD_ACCIDENT',
    title: 'Road Accident',
    badge: 'Highway Trauma',
    phone: '1033',
    icon: <Car className="w-5 h-5 text-orange-400" />,
    borderHover: 'hover:border-orange-500',
    iconBg: 'bg-orange-500/10 border-orange-500/20',
  },
  {
    id: 'NATURAL_DISASTER',
    title: 'Disaster & Flood',
    badge: 'NDRF Command',
    phone: '1078',
    icon: <CloudRain className="w-5 h-5 text-cyan-400" />,
    borderHover: 'hover:border-cyan-500',
    iconBg: 'bg-cyan-500/10 border-cyan-500/20',
  },
  {
    id: 'DOMESTIC',
    title: 'Women Helpline',
    badge: 'Confidential 24/7',
    phone: '1091',
    icon: <HeartHandshake className="w-5 h-5 text-purple-400" />,
    borderHover: 'hover:border-purple-500',
    iconBg: 'bg-purple-500/10 border-purple-500/20',
  },
  {
    id: 'MISSING_PERSON',
    title: 'Child Protection',
    badge: 'CHILDLINE',
    phone: '1098',
    icon: <Search className="w-5 h-5 text-indigo-400" />,
    borderHover: 'hover:border-indigo-500',
    iconBg: 'bg-indigo-500/10 border-indigo-500/20',
  },
  {
    id: 'MENTAL_HEALTH',
    title: 'Mental Health Crisis',
    badge: 'Tele-MANAS',
    phone: '14416',
    icon: <LifeBuoy className="w-5 h-5 text-emerald-400" />,
    borderHover: 'hover:border-emerald-500',
    iconBg: 'bg-emerald-500/10 border-emerald-500/20',
  },
  {
    id: 'ELECTRICAL',
    title: 'Electrical Hazard',
    badge: 'DISCOM Feeder',
    phone: '1912',
    icon: <Zap className="w-5 h-5 text-yellow-400" />,
    borderHover: 'hover:border-yellow-500',
    iconBg: 'bg-yellow-500/10 border-yellow-500/20',
  },
  {
    id: 'ANIMAL_EMERGENCY',
    title: 'Animal & Wildlife',
    badge: 'Emergency Rescue',
    phone: '1800-103-3450',
    icon: <AlertCircle className="w-5 h-5 text-lime-400" />,
    borderHover: 'hover:border-lime-500',
    iconBg: 'bg-lime-500/10 border-lime-500/20',
  },
  {
    id: 'MEDICAL_ADVICE',
    title: 'Poison Control / Advice',
    badge: 'AIIMS NPIC',
    phone: '1800-116-117',
    icon: <HelpCircle className="w-5 h-5 text-teal-400" />,
    borderHover: 'hover:border-teal-500',
    iconBg: 'bg-teal-500/10 border-teal-500/20',
  },
  {
    id: 'OTHER',
    title: 'Universal Emergency',
    badge: 'Unified Helpline',
    phone: '112',
    icon: <PhoneCall className="w-5 h-5 text-rose-400" />,
    borderHover: 'hover:border-rose-500',
    iconBg: 'bg-rose-500/10 border-rose-500/20',
  },
];

export const HomeHero: React.FC<HomeHeroProps> = ({
  language,
  onOpenEmergencyModal,
  onNavigateToServices,
  onNavigateToSos,
  onNavigateToNearby,
  isDemoMode,
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  return (
    <div className="space-y-12 pb-12 animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-10 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border-b border-slate-800 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          {/* Header Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-800/80 text-rose-400 text-xs font-bold tracking-wide uppercase">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>AI-Guided Emergency Response Assistance</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.15] font-['Space_Grotesk']">
            Facing an emergency?
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-rose-500 to-amber-400">
              Get the right official help now.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Instant classification, verified official dispatch numbers, and immediate safe steps to protect lives before responders arrive.
          </p>

          {/* Primary CTA Button (Visually Dominant) */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-xl mx-auto">
            <button
              id="hero-primary-sos-btn"
              onClick={() => onOpenEmergencyModal()}
              className="w-full sm:w-auto flex-1 rounded-2xl bg-rose-600 hover:bg-rose-500 active:bg-rose-700 py-4 px-8 text-lg sm:text-xl font-black text-white flex items-center justify-center gap-3 shadow-2xl shadow-rose-950/90 border border-rose-500/60 transition-all transform active:scale-98"
            >
              <Radio className="w-6 h-6 animate-ping" />
              <span>{t.i_need_emergency_help}</span>
            </button>

            <button
              id="hero-one-tap-sos-btn"
              onClick={onNavigateToSos}
              className="w-full sm:w-auto rounded-2xl border border-slate-700 bg-slate-800/90 hover:bg-slate-700 py-4 px-6 text-sm sm:text-base font-bold text-slate-200 flex items-center justify-center gap-2 transition-colors"
            >
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <span>{t.one_tap_sos}</span>
            </button>
          </div>

          <div className="pt-2">
            <button
              onClick={onNavigateToServices}
              className="text-xs sm:text-sm font-semibold text-slate-400 hover:text-white inline-flex items-center gap-1.5 transition-colors underline underline-offset-4"
            >
              <span>{t.explore_emergency_services}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Quick Emergency Actions Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-['Space_Grotesk']">
              Immediate Emergency Services
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Select your situation for tailored official helplines and immediate life-safety actions.
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono">12 Verified Sectors</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {QUICK_ACTIONS.map((item) => (
            <button
              key={item.id}
              onClick={() => onOpenEmergencyModal(item.id)}
              className={`text-left rounded-2xl border border-slate-800 bg-slate-900/80 p-4 transition-all hover:bg-slate-850 shadow-md ${item.borderHover} group flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-xl border ${item.iconBg}`}>{item.icon}</div>
                  <span className="text-xs font-mono font-bold text-rose-400 group-hover:text-rose-300">
                    {item.phone}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white mt-3 group-hover:text-rose-400 transition-colors">
                  {item.title}
                </h3>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>{item.badge}</span>
                <span className="font-semibold text-rose-400 flex items-center gap-0.5">
                  Action <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* How SOS Connect Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-['Space_Grotesk']">
              How SOS Connect Reduces Response Time
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Designed for high-stress situations with low cognitive load and zero unnecessary steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                step: '01',
                title: 'Describe or Tap',
                desc: 'Speak using voice or tap your emergency category. No typing required in acute stress.',
              },
              {
                step: '02',
                title: 'Instant Classification',
                desc: 'Server-side AI instantly identifies severity, agency coordination, and priority dispatcher.',
              },
              {
                step: '03',
                title: 'Call Verified Services',
                desc: 'Large 1-tap call button connected to official national and regional emergency lines.',
              },
              {
                step: '04',
                title: 'Safe Steps & Information',
                desc: 'Follow immediate life-safety steps and read our generated summary directly to the dispatcher.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-2 relative"
              >
                <div className="text-2xl font-black font-mono text-rose-500/80">{item.step}</div>
                <h3 className="text-sm font-bold text-white">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prominent Mandatory Safety Disclaimer Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-rose-900/40 bg-rose-950/30 p-4 sm:p-5 flex items-start gap-3.5">
          <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-slate-300 space-y-1">
            <h4 className="font-bold text-white">Emergency Services Notice</h4>
            <p className="leading-relaxed text-slate-300">
              {t.disclaimer}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
