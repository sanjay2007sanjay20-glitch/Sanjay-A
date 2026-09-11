import React, { useState } from 'react';
import {
  ShieldAlert,
  PhoneCall,
  BookOpen,
  MapPin,
  Settings,
  Globe,
  User,
  Menu,
  X,
  Radio,
  Sparkles,
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { SupportedLanguage } from '../types';
import { SUPPORTED_LANGUAGES, UI_TRANSLATIONS } from '../data/translations';

interface HeaderProps {
  currentTab: 'home' | 'emergency' | 'services' | 'guides' | 'nearby' | 'admin' | 'sos';
  setCurrentTab: (tab: 'home' | 'emergency' | 'services' | 'guides' | 'nearby' | 'admin' | 'sos') => void;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  onOpenEmergencyModal: () => void;
  onOpenProfile: () => void;
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  language,
  setLanguage,
  onOpenEmergencyModal,
  onOpenProfile,
  isDemoMode,
  setIsDemoMode,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;
  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  const handleNav = (tab: HeaderProps['currentTab']) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              id="brand-logo-btn"
              onClick={() => handleNav('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
              aria-label="SOS Connect Home"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-500 group-hover:bg-rose-600 group-hover:text-white transition-all shadow-sm shadow-rose-950">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white font-['Space_Grotesk']">
                    SOS Connect
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.2 text-[10px] font-bold uppercase rounded bg-rose-950/80 text-rose-400 border border-rose-800/60">
                    24/7
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block">Verified Emergency Navigation</p>
              </div>
            </button>

            {/* Demo Mode Badge / Toggle */}
            <button
              id="demo-mode-toggle"
              onClick={() => setIsDemoMode(!isDemoMode)}
              className={`hidden md:flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                isDemoMode
                  ? 'bg-amber-950/60 text-amber-300 border-amber-500/50 hover:bg-amber-900/60'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
              title="Click to toggle presentation / simulation demo mode"
            >
              <Radio className={`w-3.5 h-3.5 ${isDemoMode ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} />
              <span>{isDemoMode ? 'DEMO MODE ACTIVE' : 'DEMO MODE'}</span>
            </button>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-300">
            <button
              id="nav-home-btn"
              onClick={() => handleNav('home')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                currentTab === 'home' ? 'bg-slate-800 text-white font-semibold' : 'hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              Home
            </button>
            <button
              id="nav-services-btn"
              onClick={() => handleNav('services')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                currentTab === 'services' ? 'bg-slate-800 text-white font-semibold' : 'hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5 text-slate-400" />
              <span>Services</span>
            </button>
            <button
              id="nav-guides-btn"
              onClick={() => handleNav('guides')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                currentTab === 'guides' ? 'bg-slate-800 text-white font-semibold' : 'hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              <span>Safety Guides</span>
            </button>
            <button
              id="nav-nearby-btn"
              onClick={() => handleNav('nearby')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                currentTab === 'nearby' ? 'bg-slate-800 text-white font-semibold' : 'hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Nearby Help</span>
            </button>
            <button
              id="nav-admin-btn"
              onClick={() => handleNav('admin')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                currentTab === 'admin' ? 'bg-slate-800 text-white font-semibold' : 'hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <Settings className="w-3.5 h-3.5 text-slate-400" />
              <span>Admin</span>
            </button>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* PWA Install */}
            <PWAInstallButton />

            {/* Language Selector */}
            <div className="relative">
              <button
                id="language-selector-btn"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700/80 text-xs font-medium text-slate-200 transition-colors"
                aria-label="Select Language"
              >
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentLangObj.nativeName}</span>
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-700 bg-slate-800 p-1.5 shadow-xl z-50 animate-fade-in">
                  <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 border-b border-slate-700/60 mb-1">
                    Select Language
                  </div>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        language === lang.code
                          ? 'bg-rose-600 text-white font-semibold'
                          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      <span>{lang.nativeName}</span>
                      <span className="text-[10px] text-slate-400">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Profile Card */}
            <button
              id="user-profile-btn"
              onClick={onOpenProfile}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700/80 text-xs font-medium text-slate-200 transition-colors"
              title="Emergency Profile & Trusted Contacts"
            >
              <User className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">My Profile</span>
            </button>

            {/* Primary Emergency CTA Button */}
            <button
              id="header-sos-cta-btn"
              onClick={onOpenEmergencyModal}
              className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold tracking-wide shadow-md shadow-rose-950/60 transition-all border border-rose-500/50"
            >
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>{t.i_need_emergency_help}</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-900 px-4 pt-3 pb-5 space-y-2 animate-fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-semibold text-slate-400">Navigation</span>
            <button
              onClick={() => setIsDemoMode(!isDemoMode)}
              className="text-xs text-amber-400 flex items-center gap-1"
            >
              <Radio className="w-3 h-3" />
              {isDemoMode ? 'Demo Mode Active' : 'Enable Demo Mode'}
            </button>
          </div>
          <button
            onClick={() => handleNav('home')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
              currentTab === 'home' ? 'bg-slate-800 text-white' : 'text-slate-300'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNav('services')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
              currentTab === 'services' ? 'bg-slate-800 text-white' : 'text-slate-300'
            }`}
          >
            Services Directory
          </button>
          <button
            onClick={() => handleNav('guides')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
              currentTab === 'guides' ? 'bg-slate-800 text-white' : 'text-slate-300'
            }`}
          >
            Safety Guides
          </button>
          <button
            onClick={() => handleNav('nearby')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
              currentTab === 'nearby' ? 'bg-slate-800 text-white' : 'text-slate-300'
            }`}
          >
            Nearby Help
          </button>
          <button
            onClick={() => handleNav('admin')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
              currentTab === 'admin' ? 'bg-slate-800 text-white' : 'text-slate-300'
            }`}
          >
            Admin Dashboard
          </button>
          <div className="pt-2 border-t border-slate-800 flex gap-2">
            <button
              onClick={() => {
                handleNav('sos');
              }}
              className="w-full bg-rose-600 hover:bg-rose-500 py-2.5 rounded-xl text-center text-sm font-bold text-white shadow"
            >
              One-Tap SOS Mode
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
