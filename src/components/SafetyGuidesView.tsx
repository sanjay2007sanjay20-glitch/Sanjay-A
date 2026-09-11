import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  AlertTriangle,
  CheckCircle2,
  Shield,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { SAFETY_GUIDES } from '../data/safetyGuides';
import { SafetyGuide } from '../types';

export const SafetyGuidesView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [expandedGuideId, setExpandedGuideId] = useState<string | null>(SAFETY_GUIDES[0].id);

  const filteredGuides = SAFETY_GUIDES.filter((guide) => {
    if (selectedCategory !== 'ALL' && guide.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inTitle = guide.title.toLowerCase().includes(q);
      const inSummary = guide.summary.toLowerCase().includes(q);
      const inSteps = guide.steps.some((s) => s.title.toLowerCase().includes(q) || s.detail.toLowerCase().includes(q));
      return inTitle || inSummary || inSteps;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-6">
      {/* Title & Metadata */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase bg-rose-950 text-rose-400 border border-rose-800">
            Authoritative Guides
          </span>
          <span className="text-xs text-slate-400">Red Cross & NDMA Protocols</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1.5 font-['Space_Grotesk']">
          Emergency Safety Guides
        </h1>
        <p className="text-sm text-slate-300 mt-1 max-w-2xl">
          Verified, evidence-based instructions for high-stakes emergencies while waiting for first responders.
        </p>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            id="safety-guides-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides (e.g., bleeding, fire, flood, CPR, shock)..."
            className="w-full rounded-xl border border-slate-700 bg-slate-900 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:border-rose-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'ALL', label: 'All Topics' },
            { id: 'FIRE_SMOKE', label: 'Fire & Smoke' },
            { id: 'ROAD_ACCIDENT', label: 'Road Accidents' },
            { id: 'MEDICAL', label: 'Medical & Bleeding' },
            { id: 'NATURAL_DISASTER', label: 'Floods & Quakes' },
            { id: 'ELECTRICAL', label: 'Electrical' },
            { id: 'MENTAL_HEALTH', label: 'Mental Health' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                selectedCategory === tab.id
                  ? 'bg-rose-600 text-white border-rose-500 shadow-sm'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Guides Accordion List */}
      <div className="space-y-3.5">
        {filteredGuides.map((guide) => {
          const isExpanded = expandedGuideId === guide.id;
          return (
            <div
              key={guide.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-md transition-all"
            >
              <button
                onClick={() => setExpandedGuideId(isExpanded ? null : guide.id)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-850/60 transition-colors"
                aria-expanded={isExpanded}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-rose-400 border border-slate-700">
                      {guide.category}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      Reviewed: {guide.last_reviewed}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mt-1">{guide.title}</h3>
                  <p className="text-xs text-slate-300 mt-1">{guide.summary}</p>
                </div>
                <div className="p-2 rounded-xl bg-slate-800 text-slate-300">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-5 sm:px-6 sm:pb-6 border-t border-slate-800 pt-4 space-y-4 animate-fade-in">
                  <div className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                    <Shield className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Authoritative Source: {guide.source}</span>
                  </div>

                  <div className="space-y-3">
                    {guide.steps.map((step) => (
                      <div
                        key={step.order}
                        className="rounded-xl border border-slate-800/80 bg-slate-950/70 p-3.5 space-y-1.5"
                      >
                        <div className="flex items-center gap-2 font-bold text-sm text-white">
                          <span className="w-5 h-5 rounded-full bg-rose-600/30 text-rose-300 text-xs flex items-center justify-center border border-rose-500/40">
                            {step.order}
                          </span>
                          <span>{step.title}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-300 pl-7 leading-relaxed">{step.detail}</p>
                        {step.warning && (
                          <div className="ml-7 mt-2 p-2.5 rounded-lg bg-amber-950/50 border border-amber-800/60 text-xs text-amber-200 flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <span>
                              <strong>Warning:</strong> {step.warning}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
