import React from 'react';
import { ShieldAlert, Heart, Lock, Globe, ExternalLink } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { UI_TRANSLATIONS } from '../data/translations';

interface FooterProps {
  language: SupportedLanguage;
  onNavigate: (tab: 'home' | 'services' | 'guides' | 'nearby' | 'admin' | 'sos') => void;
}

export const Footer: React.FC<FooterProps> = ({ language, onNavigate }) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 text-xs py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2 text-white font-extrabold text-base tracking-tight font-['Space_Grotesk']">
              <div className="w-6 h-6 rounded-lg bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-500">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <span>SOS Connect</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              AI-assisted emergency navigation platform built to reduce cognitive load and connect distressed individuals with verified official emergency dispatchers.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400">
              <Lock className="w-3.5 h-3.5" />
              <span>Zero tracking • Offline capable PWA • Verified registry only</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">Emergency Resources</h4>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-white transition-colors">
                  Verified Directory
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('guides')} className="hover:text-white transition-colors">
                  Red Cross Safety Guides
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('nearby')} className="hover:text-white transition-colors">
                  Nearby Trauma & Stations
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('sos')} className="hover:text-rose-400 text-rose-400 font-semibold transition-colors">
                  One-Tap SOS Mode
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Governance & Help */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">Administration</h4>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => onNavigate('admin')} className="hover:text-white transition-colors">
                  Admin Dashboard
                </button>
              </li>
              <li>
                <a
                  href="https://112.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white inline-flex items-center gap-1 transition-colors"
                >
                  <span>112.gov.in (ERSS)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <span className="text-slate-500">Universal Dispatch: 112 / 911</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="pt-6 border-t border-slate-800/80 text-[11px] text-slate-500 leading-relaxed text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            © {new Date().getFullYear()} SOS Connect. Critical Emergency Warning: This application does not replace professional emergency services. In immediate danger, always call 112, 911, or local emergency services.
          </p>
          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-medium">v1.2 PWA Production-Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
