import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Navigation,
  PhoneCall,
  ShieldCheck,
  Building,
  Activity,
  Flame,
  Shield,
  HeartHandshake,
  Compass,
  ExternalLink,
  Share2,
  Check,
  AlertTriangle,
  LocateFixed,
} from 'lucide-react';
import { EmergencyService } from '../types';
import { INITIAL_EMERGENCY_SERVICES } from '../data/emergencyServices';

interface NearbyHelpViewProps {
  onCallService: (phone: string, serviceName: string) => void;
}

export const NearbyHelpView: React.FC<NearbyHelpViewProps> = ({ onCallService }) => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [facilities, setFacilities] = useState<EmergencyService[]>([]);
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [copiedLocation, setCopiedLocation] = useState(false);

  // Default coordinate if user is indoors or testing (Chennai Central Coordinates)
  const defaultCoords = { lat: 13.0827, lng: 80.2707, accuracy: 25 };

  useEffect(() => {
    requestUserLocation();
  }, []);

  const requestUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      computeDistances(defaultCoords.lat, defaultCoords.lng);
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: Math.round(pos.coords.accuracy),
        };
        setUserLocation(coords);
        setIsLocating(false);
        computeDistances(coords.lat, coords.lng);
      },
      (err) => {
        setIsLocating(false);
        setLocationError('Location permission was denied or timed out. Showing central regional facilities.');
        // Use default coordinates so user still sees functional distance calculation and radar
        setUserLocation(defaultCoords);
        computeDistances(defaultCoords.lat, defaultCoords.lng);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const computeDistances = (uLat: number, uLng: number) => {
    // Haversine formula
    const calculated = INITIAL_EMERGENCY_SERVICES.filter((s) => s.lat && s.lng).map((s) => {
      const R = 6371; // km
      const dLat = (((s.lat || 0) - uLat) * Math.PI) / 180;
      const dLon = (((s.lng || 0) - uLng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((uLat * Math.PI) / 180) *
          Math.cos(((s.lat || 0) * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance_km = Math.round(R * c * 10) / 10;
      return { ...s, distance_km };
    });

    calculated.sort((a, b) => (a.distance_km ?? 999) - (b.distance_km ?? 999));
    setFacilities(calculated);
  };

  const handleShareLocation = () => {
    const lat = userLocation?.lat || defaultCoords.lat;
    const lng = userLocation?.lng || defaultCoords.lng;
    const mapsLink = `https://www.google.com/maps?q=${lat},${lng}`;
    const text = `🚨 MY EMERGENCY LOCATION: Lat ${lat.toFixed(5)}, Lng ${lng.toFixed(5)} (±${userLocation?.accuracy || 25}m). Map: ${mapsLink}`;
    navigator.clipboard.writeText(text);
    setCopiedLocation(true);
    setTimeout(() => setCopiedLocation(false), 2500);
  };

  const filteredFacilities = facilities.filter((f) => {
    if (selectedFilter === 'ALL') return true;
    if (selectedFilter === 'HOSPITAL') return f.category === 'MEDICAL';
    if (selectedFilter === 'POLICE') return f.category === 'CRIME_DANGER';
    if (selectedFilter === 'FIRE') return f.category === 'FIRE_SMOKE';
    if (selectedFilter === 'DISASTER') return f.category === 'NATURAL_DISASTER';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-6">
      {/* Page Title & Location Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase bg-rose-950 text-rose-400 border border-rose-800">
              Proximity Navigator
            </span>
            <span className="text-xs text-slate-400">Nearest Emergency Infrastructure</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1.5 font-['Space_Grotesk']">
            Nearby Emergency Facilities
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Calculated straight-line proximity to verified 24/7 trauma hospitals, police divisions, and fire commands.
          </p>
        </div>

        {/* Location Action Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="refresh-gps-location-btn"
            onClick={requestUserLocation}
            disabled={isLocating}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
          >
            <LocateFixed className={`w-4 h-4 text-emerald-400 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Acquiring GPS...' : 'Refresh GPS Location'}</span>
          </button>

          <button
            id="share-current-location-btn"
            onClick={handleShareLocation}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-sm transition-all"
          >
            {copiedLocation ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            <span>{copiedLocation ? 'Coordinates Copied!' : 'Share My GPS Link'}</span>
          </button>
        </div>
      </div>

      {/* GPS Status Banner */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center text-emerald-400 shrink-0">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>
                Lat: {userLocation?.lat.toFixed(4) || '13.0827'}° N, Lng: {userLocation?.lng.toFixed(4) || '80.2707'}° E
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                Accuracy: ±{userLocation?.accuracy || 25}m
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {locationError || 'Active high-precision device geolocation lock.'}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> Official Verified
          </span>
          <span className="flex items-center gap-1 text-amber-400 font-semibold">
            <AlertTriangle className="w-3.5 h-3.5" /> Community Resource
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'ALL', label: 'All Nearby' },
          { id: 'HOSPITAL', label: 'Hospitals & Blood Banks' },
          { id: 'POLICE', label: 'Police Stations' },
          { id: 'FIRE', label: 'Fire & Rescue' },
          { id: 'DISASTER', label: 'Evacuation Shelters' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedFilter(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              selectedFilter === tab.id
                ? 'bg-rose-600 text-white border-rose-500 shadow-sm'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Facilities List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFacilities.map((fac) => (
          <div
            key={fac.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md group"
          >
            <div>
              {/* Header: Distance & Status Badge */}
              <div className="flex items-center justify-between pb-2">
                <span className="text-sm font-extrabold text-rose-400 flex items-center gap-1">
                  <Navigation className="w-3.5 h-3.5 text-rose-500" />
                  {fac.distance_km} km away
                </span>

                {fac.is_official ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-700">
                    <ShieldCheck className="w-3 h-3" /> VERIFIED OFFICIAL
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-700">
                    <AlertTriangle className="w-3 h-3" /> COMMUNITY RESOURCE
                  </span>
                )}
              </div>

              {/* Title & Organization */}
              <h3 className="text-base font-bold text-white group-hover:text-rose-400 transition-colors leading-snug">
                {fac.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-medium">{fac.organization}</p>

              {/* Address */}
              {fac.address && (
                <div className="mt-2.5 flex items-start gap-1.5 text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{fac.address}</span>
                </div>
              )}

              {/* Description */}
              <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-2">
                {fac.description}
              </p>
            </div>

            {/* Bottom Controls */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2">
              <button
                id={`call-nearby-${fac.id}-btn`}
                onClick={() => onCallService(fac.official_phone, fac.name)}
                className="flex-1 rounded-xl bg-rose-600 hover:bg-rose-500 active:bg-rose-700 py-2.5 px-3 text-xs font-bold text-white flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call {fac.official_phone}</span>
              </button>

              {fac.lat && fac.lng && (
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${fac.lat},${fac.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 px-3 py-2.5 text-xs font-semibold text-slate-200 flex items-center gap-1 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Directions</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
