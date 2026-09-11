import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Activity,
  BarChart3,
  Users,
  Building,
  PhoneCall,
  X,
  FileText,
} from 'lucide-react';
import { EmergencyCategory, EmergencyService, UserRole, VerificationStatus } from '../types';
import { INITIAL_EMERGENCY_SERVICES } from '../data/emergencyServices';

export const AdminDashboard: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>('ADMIN');
  const [stats, setStats] = useState<any>(null);
  const [services, setServices] = useState<EmergencyService[]>(INITIAL_EMERGENCY_SERVICES);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<EmergencyService | null>(null);

  // New service form state
  const [formData, setFormData] = useState({
    name: '',
    category: 'MEDICAL' as EmergencyCategory,
    official_phone: '',
    country: 'India',
    state_region: 'National',
    city_district: 'Metro',
    organization: '',
    description: '',
    coverage_area: 'Pan-India',
    availability: '24/7/365',
    verification_status: 'VERIFIED' as VerificationStatus,
    official_website: '',
  });

  useEffect(() => {
    fetchStats();
    fetchServices();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.warn('Using local stats fallback');
      setStats({
        total_emergency_sessions: 8,
        avg_time_to_action_seconds: 3.4,
        category_distribution: { ROAD_ACCIDENT: 2, MEDICAL: 2, FIRE_SMOKE: 1, NATURAL_DISASTER: 1, MENTAL_HEALTH: 1, ELECTRICAL: 1 },
        severity_distribution: { CRITICAL: 4, HIGH: 3, MODERATE: 1, LOW: 0 },
        unverified_count: 1,
        expired_count: 0,
        total_services_managed: INITIAL_EMERGENCY_SERVICES.length,
        recent_audit_logs: [
          { id: 'log-1', action: 'SYSTEM_BOOT_VERIFICATION_CHECK', timestamp: new Date().toISOString(), actor: 'System Daemon' },
        ],
      });
    }
  };

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/emergency-services');
      if (res.ok) {
        const data = await res.json();
        setServices(data.services || INITIAL_EMERGENCY_SERVICES);
      }
    } catch (e) {
      setServices(INITIAL_EMERGENCY_SERVICES);
    }
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.official_phone) return;

    try {
      const res = await fetch('/api/emergency-services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsAddModalOpen(false);
        fetchServices();
        fetchStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuickVerify = async (service: EmergencyService) => {
    try {
      const res = await fetch(`/api/emergency-services/${service.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verification_status: 'VERIFIED',
          last_verified_date: new Date().toISOString().split('T')[0],
          next_review_date: '2026-10-01',
          verified_by: `${currentRole} Operator`,
        }),
      });
      if (res.ok) {
        fetchServices();
        fetchStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure you want to remove this emergency service record?')) return;
    try {
      const res = await fetch(`/api/emergency-services/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchServices();
        fetchStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-6">
      {/* Header & Role Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase bg-rose-950 text-rose-400 border border-rose-800">
              Admin & Dispatch Control
            </span>
            <span className="text-xs text-slate-400">Registry Governance & Safety Audit</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1.5 font-['Space_Grotesk']">
            Emergency Registry Administration
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Maintain verified public safety contact numbers, review expiration audits, and inspect emergency classification analytics.
          </p>
        </div>

        {/* Role Selector Pill */}
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 pl-2">Active Role:</span>
          {(['USER', 'VERIFIED_OPERATOR', 'ADMIN', 'SUPER_ADMIN'] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => setCurrentRole(r)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                currentRole === r
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {r.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Total Emergency Sessions</span>
            <Activity className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            {stats?.total_emergency_sessions || 8}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Aggregated incident events</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Avg Time to Action</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-2">
            {stats?.avg_time_to_action_seconds || 3.4}s
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Prompt to official call option</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Verified Helplines</span>
            <ShieldCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            {stats?.total_services_managed || services.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Active verified registries</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Pending Review</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-2">
            {stats?.unverified_count || 1}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Community submissions</p>
        </div>
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Severity Distribution */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-rose-400" />
            Emergency Severity Distribution
          </h3>
          <div className="space-y-2.5">
            {[
              { label: 'CRITICAL (Life-Threatening)', count: 4, color: 'bg-rose-600', text: 'text-rose-400' },
              { label: 'HIGH (Urgent Rescue)', count: 3, color: 'bg-amber-600', text: 'text-amber-400' },
              { label: 'MODERATE (First Aid / Hazard)', count: 1, color: 'bg-blue-600', text: 'text-blue-400' },
              { label: 'LOW (Advisory / Non-Critical)', count: 0, color: 'bg-slate-600', text: 'text-slate-400' },
            ].map((item) => (
              <div key={item.label} className="text-xs">
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-slate-300">{item.label}</span>
                  <span className={item.text}>{item.count} sessions</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full`}
                    style={{ width: `${(item.count / 8) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-emerald-400" />
            Top Emergency Categories
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { label: 'Road Accidents', count: 2 },
              { label: 'Medical Emergencies', count: 2 },
              { label: 'Fire & Smoke', count: 1 },
              { label: 'Flood & Disaster', count: 1 },
              { label: 'Mental Health', count: 1 },
              { label: 'Electrical Hazards', count: 1 },
            ].map((cat) => (
              <div key={cat.label} className="p-2.5 rounded-xl border border-slate-800 bg-slate-950/60 flex items-center justify-between">
                <span className="text-slate-300 truncate">{cat.label}</span>
                <span className="font-bold text-white font-mono">{cat.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services Management Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">Verified Services Registry</h3>
            <p className="text-xs text-slate-400">
              Only verified, official public numbers are served in live emergency guidance.
            </p>
          </div>

          {(currentRole === 'ADMIN' || currentRole === 'SUPER_ADMIN') && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Emergency Service</span>
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Service Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Official Phone</th>
                <th className="p-3">Status</th>
                <th className="p-3">Last Verified</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {services.map((s) => (
                <tr key={s.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="p-3 font-semibold text-white max-w-xs truncate">
                    <div>{s.name}</div>
                    <div className="text-[10px] text-slate-500 font-normal">{s.organization}</div>
                  </td>
                  <td className="p-3 font-mono text-slate-400">{s.category}</td>
                  <td className="p-3 font-bold text-rose-400 font-mono">{s.official_phone}</td>
                  <td className="p-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                        s.verification_status === 'VERIFIED'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}
                    >
                      {s.verification_status === 'VERIFIED' && <ShieldCheck className="w-3 h-3" />}
                      {s.verification_status}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400 font-mono text-[11px]">{s.last_verified_date}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-1.5">
                      {s.verification_status !== 'VERIFIED' && (
                        <button
                          onClick={() => handleQuickVerify(s)}
                          className="p-1 rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-800"
                          title="Mark Verified"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {(currentRole === 'ADMIN' || currentRole === 'SUPER_ADMIN') && (
                        <button
                          onClick={() => handleDeleteService(s.id)}
                          className="p-1 rounded bg-rose-950 hover:bg-rose-900 text-rose-400 border border-rose-800"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Service Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl text-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building className="w-5 h-5 text-rose-500" />
                Register Emergency Service
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateService} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Official Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Regional Trauma Ambulance Dispatch"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as EmergencyCategory })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                  >
                    {[
                      'MEDICAL',
                      'FIRE_SMOKE',
                      'CRIME_DANGER',
                      'ROAD_ACCIDENT',
                      'NATURAL_DISASTER',
                      'DOMESTIC',
                      'MISSING_PERSON',
                      'ELECTRICAL',
                      'MENTAL_HEALTH',
                      'ANIMAL_EMERGENCY',
                      'OTHER',
                    ].map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Official Telephone</label>
                  <input
                    type="text"
                    required
                    value={formData.official_phone}
                    onChange={(e) => setFormData({ ...formData, official_phone: e.target.value })}
                    placeholder="e.g., 108 or 044-..."
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Government Organization / Authority</label>
                <input
                  type="text"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  placeholder="e.g., Department of Health & Family Welfare"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Key services offered and emergency dispatch scope..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                >
                  Save & Audit Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
