import React, { useState, useEffect } from 'react';
import {
  Search,
  PhoneCall,
  ShieldCheck,
  Globe,
  Filter,
  Clock,
  MapPin,
  Building2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { EmergencyCategory, EmergencyService, VerificationStatus } from '../types';
import { INITIAL_EMERGENCY_SERVICES } from '../data/emergencyServices';

interface ServicesDirectoryProps {
  onCallService: (phone: string, serviceName: string) => void;
}

const CATEGORY_TABS: { id: string; label: string }[] = [
  { id: 'ALL', label: 'All Services' },
  { id: 'MEDICAL', label: 'Ambulance / Medical' },
  { id: 'FIRE_SMOKE', label: 'Fire & Rescue' },
  { id: 'CRIME_DANGER', label: 'Police & Security' },
  { id: 'NATURAL_DISASTER', label: 'Disaster Relief' },
  { id: 'DOMESTIC', label: 'Women & Child Safety' },
  { id: 'ROAD_ACCIDENT', label: 'Roadside & Highway' },
  { id: 'MENTAL_HEALTH', label: 'Mental Health' },
  { id: 'ELECTRICAL', label: 'Electrical Hazard' },
  { id: 'ANIMAL_EMERGENCY', label: 'Animal Rescue' },
  { id: 'OTHER', label: 'Universal 112' },
];

export const ServicesDirectory: React.FC<ServicesDirectoryProps> = ({ onCallService }) => {
  const [services, setServices] = useState<EmergencyService[]>(INITIAL_EMERGENCY_SERVICES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchServices();
  }, [selectedCategory, searchQuery, verifiedOnly]);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'ALL') params.append('category', selectedCategory);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      if (verifiedOnly) params.append('verification_status', 'VERIFIED');

      const res = await fetch(`/api/emergency-services?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setServices(data.services || INITIAL_EMERGENCY_SERVICES);
      }
    } catch (err) {
      console.warn('Using client-side service list fallback');
      // Filter locally for seamless offline functionality
      let filtered = [...INITIAL_EMERGENCY_SERVICES];
      if (selectedCategory !== 'ALL') {
        filtered = filtered.filter((s) => s.category === selectedCategory);
      }
      if (verifiedOnly) {
        filtered = filtered.filter((s) => s.verification_status === 'VERIFIED');
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.description.toLowerCase().includes(q) ||
            s.official_phone.includes(q)
        );
      }
      setServices(filtered);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-6">
      {/* Page Title & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase bg-emerald-950 text-emerald-400 border border-emerald-800">
              Verified Registry
            </span>
            <span className="text-xs text-slate-400">Strictly Admin-Audited Helplines</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1.5 font-['Space_Grotesk']">
            Emergency Services Directory
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Search verified, official public emergency dispatchers, specialized helplines, trauma centers, and disaster response teams.
          </p>
        </div>

        {/* Verified Only Toggle */}
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer select-none bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700">
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(e) => setVerifiedOnly(e.target.checked)}
            className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-700 bg-slate-900"
          />
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Show Official Verified Only</span>
        </label>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
        <input
          id="services-directory-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by emergency name, phone number, organization, or district..."
          className="w-full rounded-2xl border border-slate-700 bg-slate-900 pl-11 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 shadow-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-3 text-xs text-slate-400 hover:text-white bg-slate-800 px-2 py-1 rounded"
          >
            Clear
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id)}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              selectedCategory === tab.id
                ? 'bg-rose-600 text-white border-rose-500 shadow-sm'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md group"
          >
            <div>
              {/* Header Badge */}
              <div className="flex items-start justify-between gap-2 pb-2.5">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    service.verification_status === 'VERIFIED'
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-700/60'
                      : 'bg-amber-950/80 text-amber-400 border border-amber-700/60'
                  }`}
                >
                  <ShieldCheck className="w-3 h-3" />
                  {service.verification_status}
                </span>

                <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {service.availability}
                </span>
              </div>

              {/* Title & Organization */}
              <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-rose-400 transition-colors leading-snug">
                {service.name}
              </h3>
              <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-1 font-medium">
                <Building2 className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                <span>{service.organization}</span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 mt-2.5 leading-relaxed line-clamp-3">
                {service.description}
              </p>

              {/* Area & Verification Metadata */}
              <div className="mt-3.5 pt-3 border-t border-slate-800/80 space-y-1 text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                  <span className="truncate">Coverage: {service.coverage_area}</span>
                </div>
                <div className="text-[10px] text-slate-500">
                  Verified by {service.verified_by} • Last checked: {service.last_verified_date}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-5 pt-3 border-t border-slate-800 flex items-center gap-2">
              <button
                id={`call-service-${service.id}-btn`}
                onClick={() => onCallService(service.official_phone, service.name)}
                className="flex-1 rounded-xl bg-rose-600 hover:bg-rose-500 active:bg-rose-700 py-2.5 px-3 text-sm font-bold text-white flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call {service.official_phone}</span>
              </button>

              {service.official_website && (
                <a
                  href={service.official_website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Visit official authority portal"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {services.length === 0 && !isLoading && (
        <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800 p-6">
          <AlertCircle className="w-10 h-10 text-slate-500 mx-auto mb-2" />
          <h4 className="text-base font-bold text-slate-300">No emergency services found</h4>
          <p className="text-xs text-slate-400 mt-1">Try clearing filters or search terms.</p>
        </div>
      )}
    </div>
  );
};
