export type EmergencyCategory =
  | 'MEDICAL'
  | 'FIRE_SMOKE'
  | 'CRIME_DANGER'
  | 'ROAD_ACCIDENT'
  | 'MISSING_PERSON'
  | 'NATURAL_DISASTER'
  | 'ELECTRICAL'
  | 'DOMESTIC'
  | 'ANIMAL_EMERGENCY'
  | 'MENTAL_HEALTH'
  | 'MEDICAL_ADVICE'
  | 'OTHER';

export type SeverityLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type VerificationStatus = 'VERIFIED' | 'PENDING' | 'EXPIRED' | 'REJECTED';

export type UserRole = 'USER' | 'VERIFIED_OPERATOR' | 'ADMIN' | 'SUPER_ADMIN';

export type SupportedLanguage = 'en' | 'hi' | 'ta' | 'te' | 'ml' | 'kn' | 'bn' | 'mr';

export interface EmergencyService {
  id: string;
  name: string;
  category: EmergencyCategory;
  official_phone: string;
  country: string;
  state_region: string;
  city_district: string;
  availability: string;
  official_website?: string;
  verification_status: VerificationStatus;
  last_verified_date: string;
  next_review_date: string;
  verified_by: string;
  organization: string;
  description: string;
  coverage_area: string;
  is_official: boolean;
  address?: string;
  lat?: number;
  lng?: number;
  distance_km?: number;
  is_community_resource?: boolean;
}

export interface AIClassificationResult {
  category: EmergencyCategory;
  severity: SeverityLevel;
  confidence: number;
  recommended_service: string;
  secondary_services: string[];
  urgency: string;
  required_information: string[];
  immediate_actions: string[];
  smart_questions?: string[];
  multi_agency: boolean;
  reason: string;
  detected_language?: string;
  translated_guidance?: string;
  disclaimer: string;
}

export interface EmergencyProfile {
  name: string;
  preferred_language: SupportedLanguage;
  blood_group?: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  important_allergies?: string;
  important_medical_info?: string;
  accessibility_needs?: string;
  last_updated?: string;
}

export interface TrustedContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  notify_on_sos: boolean;
}

export interface IncidentTimelineEvent {
  id: string;
  time: string;
  title: string;
  description?: string;
  type: 'STARTED' | 'LOCATION' | 'CLASSIFIED' | 'CONTACTED' | 'NOTIFIED' | 'RESOLVED' | 'ACTION';
}

export interface EmergencySession {
  id: string;
  started_at: string;
  category?: EmergencyCategory;
  severity?: SeverityLevel;
  user_input?: string;
  location?: {
    lat: number;
    lng: number;
    accuracy?: number;
    address?: string;
  };
  actions_taken: string[];
  timeline: IncidentTimelineEvent[];
  summary?: string;
  status: 'ACTIVE' | 'RESOLVED' | 'CANCELLED';
}

export interface SafetyGuide {
  id: string;
  title: string;
  category: EmergencyCategory;
  summary: string;
  source: string;
  last_reviewed: string;
  steps: {
    order: number;
    title: string;
    detail: string;
    warning?: string;
  }[];
}

export interface NotificationStatusItem {
  id: string;
  contact_name: string;
  contact_phone: string;
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED';
  sent_at: string;
  message: string;
}
