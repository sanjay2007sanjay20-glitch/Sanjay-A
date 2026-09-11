import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { OfflineIndicator } from './components/OfflineIndicator';
import { HomeHero } from './components/HomeHero';
import { ServicesDirectory } from './components/ServicesDirectory';
import { SafetyGuidesView } from './components/SafetyGuidesView';
import { NearbyHelpView } from './components/NearbyHelpView';
import { AdminDashboard } from './components/AdminDashboard';
import { OneTapSosView } from './components/OneTapSosView';
import { EmergencyModal } from './components/EmergencyModal';
import { UserProfileModal } from './components/UserProfileModal';
import { Footer } from './components/Footer';
import {
  EmergencyCategory,
  EmergencyProfile,
  IncidentTimelineEvent,
  SupportedLanguage,
  TrustedContact,
} from './types';

const DEFAULT_PROFILE: EmergencyProfile = {
  name: 'Demo User',
  preferred_language: 'en',
  blood_group: 'O+',
  emergency_contact_name: 'Emergency Next-of-Kin',
  emergency_contact_phone: '+91 9876543210',
  important_allergies: 'Penicillin',
  important_medical_info: 'Mild asthma (keeps rescue inhaler)',
  accessibility_needs: 'None',
};

const DEFAULT_CONTACTS: TrustedContact[] = [
  {
    id: 'tc-demo-1',
    name: 'Family Emergency Contact',
    phone: '+91 9876543210',
    relationship: 'Family',
    notify_on_sos: true,
  },
  {
    id: 'tc-demo-2',
    name: 'Close Friend / Neighbor',
    phone: '+91 9812345678',
    relationship: 'Friend',
    notify_on_sos: true,
  },
];

export default function App() {
  const [currentTab, setCurrentTab] = useState<
    'home' | 'emergency' | 'services' | 'guides' | 'nearby' | 'admin' | 'sos'
  >('home');

  const [language, setLanguage] = useState<SupportedLanguage>(() => {
    return (localStorage.getItem('sos_connect_lang') as SupportedLanguage) || 'en';
  });

  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [modalCategory, setModalCategory] = useState<EmergencyCategory | undefined>(undefined);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const [profile, setProfile] = useState<EmergencyProfile>(() => {
    const saved = localStorage.getItem('sos_connect_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  const [trustedContacts, setTrustedContacts] = useState<TrustedContact[]>(() => {
    const saved = localStorage.getItem('sos_connect_contacts');
    return saved ? JSON.parse(saved) : DEFAULT_CONTACTS;
  });

  const [timelineEvents, setTimelineEvents] = useState<IncidentTimelineEvent[]>(() => {
    const saved = localStorage.getItem('sos_connect_timeline');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist language
  useEffect(() => {
    localStorage.setItem('sos_connect_lang', language);
  }, [language]);

  // Persist profile
  const handleSaveProfile = (newProfile: EmergencyProfile) => {
    setProfile(newProfile);
    localStorage.setItem('sos_connect_profile', JSON.stringify(newProfile));
  };

  // Persist contacts
  const handleUpdateContacts = (newContacts: TrustedContact[]) => {
    setTrustedContacts(newContacts);
    localStorage.setItem('sos_connect_contacts', JSON.stringify(newContacts));
  };

  // Add timeline event
  const handleAddTimelineEvent = (event: IncidentTimelineEvent) => {
    setTimelineEvents((prev) => {
      const updated = [event, ...prev].slice(0, 50);
      localStorage.setItem('sos_connect_timeline', JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearTimeline = () => {
    setTimelineEvents([]);
    localStorage.removeItem('sos_connect_timeline');
  };

  const handleOpenEmergency = (category?: EmergencyCategory) => {
    setModalCategory(category);
    setIsEmergencyModalOpen(true);
  };

  const handleCallService = (phone: string, serviceName: string) => {
    handleAddTimelineEvent({
      id: 'evt-' + Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      title: `Call dialed: ${serviceName} (${phone})`,
      type: 'CONTACTED',
    });
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-600 selection:text-white">
      {/* Offline Status Warning Banner */}
      <OfflineIndicator />

      {/* Main Header (Hidden when One-Tap SOS is active for zero distraction) */}
      {currentTab !== 'sos' && (
        <Header
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          language={language}
          setLanguage={setLanguage}
          onOpenEmergencyModal={() => handleOpenEmergency()}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          isDemoMode={isDemoMode}
          setIsDemoMode={setIsDemoMode}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomeHero
            language={language}
            onOpenEmergencyModal={handleOpenEmergency}
            onNavigateToServices={() => setCurrentTab('services')}
            onNavigateToSos={() => setCurrentTab('sos')}
            onNavigateToNearby={() => setCurrentTab('nearby')}
            isDemoMode={isDemoMode}
          />
        )}

        {currentTab === 'services' && (
          <ServicesDirectory onCallService={handleCallService} />
        )}

        {currentTab === 'guides' && <SafetyGuidesView />}

        {currentTab === 'nearby' && (
          <NearbyHelpView onCallService={handleCallService} />
        )}

        {currentTab === 'admin' && <AdminDashboard />}

        {currentTab === 'sos' && (
          <OneTapSosView
            language={language}
            trustedContacts={trustedContacts}
            onAddTimelineEvent={handleAddTimelineEvent}
            onExitSos={() => setCurrentTab('home')}
          />
        )}
      </main>

      {/* Primary Emergency Modal */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        language={language}
        trustedContacts={trustedContacts}
        onAddTimelineEvent={handleAddTimelineEvent}
        onSelectCategoryFromHome={modalCategory}
        isDemoMode={isDemoMode}
      />

      {/* User Profile & Emergency Card Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onSaveProfile={handleSaveProfile}
        trustedContacts={trustedContacts}
        onUpdateTrustedContacts={handleUpdateContacts}
        timelineEvents={timelineEvents}
        onClearTimeline={handleClearTimeline}
      />

      {/* Footer (Hidden when One-Tap SOS is active) */}
      {currentTab !== 'sos' && (
        <Footer language={language} onNavigate={(tab) => setCurrentTab(tab)} />
      )}
    </div>
  );
}
