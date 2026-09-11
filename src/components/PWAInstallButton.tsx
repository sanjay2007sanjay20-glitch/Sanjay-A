import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        id="pwa-install-btn"
        onClick={install}
        className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400"
        title="Install SOS Connect for rapid emergency access"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          id="pwa-ios-install-btn"
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition-colors"
          title="Install SOS Connect on iOS"
        >
          <Smartphone className="w-3.5 h-3.5 text-slate-400" />
          <span>Install PWA</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl text-slate-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-rose-500" />
                  Install on iPhone / iPad
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="mt-4 text-sm text-slate-300 leading-relaxed">
                For instantaneous 1-tap emergency access directly from your home screen:
              </p>
              <ol className="mt-3 space-y-2 text-sm text-slate-300 list-decimal list-inside bg-slate-800/60 p-3.5 rounded-xl border border-slate-800">
                <li>Tap the <strong>Share</strong> button in Safari toolbar (the square with arrow).</li>
                <li>Scroll down and select <strong>Add to Home Screen</strong>.</li>
                <li>Tap <strong>Add</strong> in the top right.</li>
              </ol>
              <p className="mt-3 text-xs text-slate-400">
                Notice: PWA maintains cached emergency contacts offline but requires network or cellular for voice dialing.
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-slate-800 hover:bg-slate-700 py-2.5 text-sm font-semibold text-white transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
