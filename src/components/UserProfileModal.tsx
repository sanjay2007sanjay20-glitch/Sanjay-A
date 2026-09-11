import React, { useState } from 'react';
import {
  X,
  User,
  Heart,
  Phone,
  Shield,
  Trash2,
  Plus,
  Save,
  Clock,
  Check,
  AlertCircle,
  Users,
} from 'lucide-react';
import { EmergencyProfile, IncidentTimelineEvent, SupportedLanguage, TrustedContact } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: EmergencyProfile;
  onSaveProfile: (profile: EmergencyProfile) => void;
  trustedContacts: TrustedContact[];
  onUpdateTrustedContacts: (contacts: TrustedContact[]) => void;
  timelineEvents: IncidentTimelineEvent[];
  onClearTimeline: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  trustedContacts,
  onUpdateTrustedContacts,
  timelineEvents,
  onClearTimeline,
}) => {
  const [formData, setFormData] = useState<EmergencyProfile>({ ...profile });
  const [contacts, setContacts] = useState<TrustedContact[]>([...trustedContacts]);
  const [activeTab, setActiveTab] = useState<'profile' | 'contacts' | 'history'>('profile');
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRel, setNewContactRel] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveProfile(formData);
    onUpdateTrustedContacts(contacts);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleAddContact = () => {
    if (!newContactName.trim() || !newContactPhone.trim()) return;
    const newContact: TrustedContact = {
      id: 'tc-' + Date.now(),
      name: newContactName.trim(),
      phone: newContactPhone.trim(),
      relationship: newContactRel.trim() || 'Emergency Contact',
      notify_on_sos: true,
    };
    const updated = [...contacts, newContact];
    setContacts(updated);
    onUpdateTrustedContacts(updated);
    setNewContactName('');
    setNewContactPhone('');
    setNewContactRel('');
  };

  const handleRemoveContact = (id: string) => {
    const updated = contacts.filter((c) => c.id !== id);
    setContacts(updated);
    onUpdateTrustedContacts(updated);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl text-slate-100 overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-rose-400" />
            <h2 className="text-base sm:text-lg font-bold text-white">
              Personal Emergency Profile & Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
            aria-label="Close Profile"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-5">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'profile'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Emergency Card
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'contacts'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Trusted Contacts ({contacts.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'history'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Incident History ({timelineEvents.length})
          </button>
        </div>

        <div className="p-5 max-h-[70vh] overflow-y-auto space-y-4">
          {/* Tab 1: Emergency Profile Card */}
          {activeTab === 'profile' && (
            <div className="space-y-3.5 text-xs sm:text-sm">
              <p className="text-xs text-slate-400">
                This information is encrypted locally on your device. First responders can view it during medical dispatch.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-rose-500 focus:outline-none"
                    placeholder="e.g., Alex Morgan"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Blood Group</label>
                  <select
                    value={formData.blood_group || 'O+'}
                    onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-rose-500 focus:outline-none"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'].map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Primary Emergency Contact Name
                  </label>
                  <input
                    type="text"
                    value={formData.emergency_contact_name}
                    onChange={(e) => setFormData({ ...formData, emergency_contact_name: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-rose-500 focus:outline-none"
                    placeholder="e.g., Mom / Spouse"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Emergency Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.emergency_contact_phone}
                    onChange={(e) => setFormData({ ...formData, emergency_contact_phone: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-rose-500 focus:outline-none"
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Known Allergies (Penicillin, Latex, Peanuts, etc.)
                </label>
                <input
                  type="text"
                  value={formData.important_allergies || ''}
                  onChange={(e) => setFormData({ ...formData, important_allergies: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-rose-500 focus:outline-none"
                  placeholder="None or list allergies"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Important Medical Conditions (Diabetes, Cardiac, Asthma, Epilepsy)
                </label>
                <textarea
                  rows={2}
                  value={formData.important_medical_info || ''}
                  onChange={(e) => setFormData({ ...formData, important_medical_info: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-rose-500 focus:outline-none"
                  placeholder="Asthma inhaler user; pacemaker, etc."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Accessibility Needs (Wheelchair, Hearing-impaired, Speech-impaired)
                </label>
                <input
                  type="text"
                  value={formData.accessibility_needs || ''}
                  onChange={(e) => setFormData({ ...formData, accessibility_needs: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-rose-500 focus:outline-none"
                  placeholder="e.g., Hard of hearing, require text-based dispatch"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
                >
                  {savedSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
                  <span>{savedSuccess ? 'Saved to Device!' : 'Save Emergency Card'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: Trusted Contacts */}
          {activeTab === 'contacts' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                These contacts receive an instant SMS / WhatsApp location alert when you trigger "Notify Trusted Contacts" or One-Tap SOS.
              </p>

              {/* Add Contact Box */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-2.5">
                <span className="text-xs font-bold text-white block">Add New Trusted Contact</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    placeholder="Name"
                    className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-white"
                  />
                  <input
                    type="tel"
                    value={newContactPhone}
                    onChange={(e) => setNewContactPhone(e.target.value)}
                    placeholder="Phone (+91...)"
                    className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={newContactRel}
                    onChange={(e) => setNewContactRel(e.target.value)}
                    placeholder="Relationship"
                    className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <button
                  onClick={handleAddContact}
                  className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 py-2 text-xs font-bold text-slate-200"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Contact</span>
                </button>
              </div>

              {/* Contacts List */}
              <div className="space-y-2">
                {contacts.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/60"
                  >
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-2">
                        <span>{c.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                          {c.relationship}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">{c.phone}</div>
                    </div>
                    <button
                      onClick={() => handleRemoveContact(c.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800"
                      title="Remove contact"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {contacts.length === 0 && (
                  <p className="text-xs text-slate-500 text-center py-4">No trusted contacts added yet.</p>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Incident History */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs text-slate-400">Local emergency events timeline</span>
                {timelineEvents.length > 0 && (
                  <button
                    onClick={onClearTimeline}
                    className="text-xs text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear History</span>
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {timelineEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-3 rounded-xl border border-slate-800 bg-slate-950 text-xs flex items-start gap-2.5"
                  >
                    <Clock className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-200">
                        {evt.title}{' '}
                        <span className="text-[10px] font-mono text-slate-500 font-normal">({evt.time})</span>
                      </div>
                      {evt.description && (
                        <div className="text-slate-400 mt-0.5 text-[11px]">{evt.description}</div>
                      )}
                    </div>
                  </div>
                ))}

                {timelineEvents.length === 0 && (
                  <p className="text-xs text-slate-500 text-center py-6">
                    No emergency incidents or actions logged on this device.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
