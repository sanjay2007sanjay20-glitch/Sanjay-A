import React from 'react';
import { WifiOff, AlertTriangle } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <aside
      aria-label="Offline Mode Notification"
      className="bg-amber-600 text-slate-950 px-4 py-2.5 text-xs sm:text-sm font-semibold shadow-md flex items-center justify-between border-b border-amber-700 z-50 sticky top-0"
    >
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <WifiOff className="w-4 h-4 shrink-0 text-slate-950 animate-pulse" />
          <span>
            <strong>OFFLINE EMERGENCY MODE</strong> — Operating with cached emergency contacts and verified safety guides.
          </span>
        </div>
        <div className="hidden md:flex items-center gap-1.5 text-xs bg-amber-700/30 px-2 py-0.5 rounded text-slate-900 border border-amber-700/40">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Live GPS & AI cloud queries unavailable while offline</span>
        </div>
      </div>
    </aside>
  );
};
