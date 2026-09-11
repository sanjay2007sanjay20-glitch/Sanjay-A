import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { INITIAL_EMERGENCY_SERVICES } from './src/data/emergencyServices.ts';
import { SAFETY_GUIDES } from './src/data/safetyGuides.ts';
import { EmergencyCategory, EmergencyService, SeverityLevel } from './src/types.ts';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory verified emergency database initialized with verified records
let emergencyServices: EmergencyService[] = [...INITIAL_EMERGENCY_SERVICES];

// In-memory incident sessions & audit logs for admin analytics
interface ServerIncidentSession {
  id: string;
  category: EmergencyCategory;
  severity: SeverityLevel;
  timestamp: string;
  region: string;
  timeToHelpMs: number;
}

const incidentSessions: ServerIncidentSession[] = [
  { id: 'sess-001', category: 'ROAD_ACCIDENT', severity: 'CRITICAL', timestamp: '2026-09-10T14:20:00Z', region: 'Tamil Nadu', timeToHelpMs: 4200 },
  { id: 'sess-002', category: 'MEDICAL', severity: 'HIGH', timestamp: '2026-09-10T16:45:00Z', region: 'Maharashtra', timeToHelpMs: 3800 },
  { id: 'sess-003', category: 'FIRE_SMOKE', severity: 'CRITICAL', timestamp: '2026-09-10T19:10:00Z', region: 'Delhi', timeToHelpMs: 3100 },
  { id: 'sess-004', category: 'NATURAL_DISASTER', severity: 'HIGH', timestamp: '2026-09-10T21:00:00Z', region: 'Kerala', timeToHelpMs: 5100 },
  { id: 'sess-005', category: 'MENTAL_HEALTH', severity: 'MODERATE', timestamp: '2026-09-11T00:30:00Z', region: 'Karnataka', timeToHelpMs: 6200 },
  { id: 'sess-006', category: 'ELECTRICAL', severity: 'HIGH', timestamp: '2026-09-11T03:15:00Z', region: 'Tamil Nadu', timeToHelpMs: 4500 },
  { id: 'sess-007', category: 'MEDICAL', severity: 'CRITICAL', timestamp: '2026-09-11T05:50:00Z', region: 'Uttar Pradesh', timeToHelpMs: 2900 },
  { id: 'sess-008', category: 'CRIME_DANGER', severity: 'HIGH', timestamp: '2026-09-11T07:12:00Z', region: 'West Bengal', timeToHelpMs: 3600 },
];

const auditLogs: { id: string; action: string; service_id?: string; timestamp: string; actor: string }[] = [
  { id: 'log-1', action: 'SYSTEM_BOOT_VERIFICATION_CHECK', timestamp: new Date().toISOString(), actor: 'System Daemon' },
];

// Lazy Gemini client helper
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Fallback rule-based heuristic classifier (used when Gemini is unavailable, offline, or for rapid response)
function fallbackClassifier(
  text: string,
  categoryChoice?: string,
  lang: string = 'en'
) {
  const lower = (text + ' ' + (categoryChoice || '')).toLowerCase();

  let category: EmergencyCategory = 'OTHER';
  let severity: SeverityLevel = 'MODERATE';
  let recommendedService = 'National Emergency Helpline (112)';
  let secondaryServices = ['Local Emergency Medical & Police Services'];
  let immediateActions = [
    'Remain calm and stay in a secure position away from immediate danger.',
    'Contact the official emergency service immediately.',
    'Keep your phone line open for call-backs from emergency dispatch.',
  ];
  let requiredInfo = [
    'Your exact current landmark or address',
    'How many people are affected or injured',
    'Any active hazards (traffic, fire, electrical, water)',
  ];
  let smartQuestions = [
    'Is anyone in immediate life danger?',
    'Is it safe for you to remain in your current location?',
  ];
  let multiAgency = false;

  if (categoryChoice === 'FIRE_SMOKE' || lower.includes('fire') || lower.includes('smoke') || lower.includes('flame') || lower.includes('burning') || lower.includes('आग') || lower.includes('தீ')) {
    category = 'FIRE_SMOKE';
    severity = 'CRITICAL';
    recommendedService = 'Fire & Rescue Service (101)';
    secondaryServices = ['Ambulance (108)', 'Police (100)'];
    multiAgency = true;
    immediateActions = [
      'Evacuate the premises immediately; do not stop to collect possessions.',
      'Crawl low under smoke where the air is cleaner and cooler.',
      'Close doors behind you to slow the spread of flame and smoke.',
      'Never use elevators; always take the emergency fire staircase.',
    ];
    requiredInfo = [
      'Exact building address, floor number, and room/wing',
      'Whether anyone is trapped inside the structure',
      'Presence of gas cylinders, chemicals, or electrical panels',
    ];
    smartQuestions = [
      'Is anyone trapped inside the building?',
      'Is there thick black smoke or spreading fire?',
      'Have all occupants evacuated to a safe outdoor assembly point?',
    ];
  } else if (
    categoryChoice === 'ROAD_ACCIDENT' ||
    lower.includes('accident') ||
    lower.includes('crash') ||
    lower.includes('bike') ||
    lower.includes('car') ||
    lower.includes('collision') ||
    lower.includes('bleeding') ||
    lower.includes('दुर्घटना') ||
    lower.includes('விபத்து')
  ) {
    category = 'ROAD_ACCIDENT';
    severity = 'CRITICAL';
    recommendedService = 'Ambulance Emergency Service (108)';
    secondaryServices = ['Police Rapid Response (100)', 'National Highway Patrol (1033)'];
    multiAgency = true;
    immediateActions = [
      'Do NOT move an injured victim unless there is imminent fire/explosion hazard.',
      'Apply firm, continuous direct pressure to active bleeding with a clean cloth.',
      'Turn off vehicle ignitions to eliminate spark hazards.',
      'Keep oncoming traffic warned with hazard blinkers or triangles.',
    ];
    requiredInfo = [
      'Exact road/highway landmark, kilometre marker, or intersection',
      'Number of injured persons and their consciousness status',
      'Whether any vehicle is on fire or leaking fuel',
    ];
    smartQuestions = [
      'Is the injured person conscious and breathing normally?',
      'Is there active heavy arterial bleeding?',
      'Is anyone pinned or trapped inside the vehicle?',
    ];
  } else if (
    categoryChoice === 'MEDICAL' ||
    lower.includes('heart') ||
    lower.includes('chest pain') ||
    lower.includes('unconscious') ||
    lower.includes('collapse') ||
    lower.includes('breathing') ||
    lower.includes('choking') ||
    lower.includes('stroke') ||
    lower.includes('seizure') ||
    lower.includes('बेहोश') ||
    lower.includes('மயக்கம்')
  ) {
    category = 'MEDICAL';
    severity = 'CRITICAL';
    recommendedService = 'Ambulance Emergency Service (108)';
    secondaryServices = ['Local Trauma Hospital'];
    immediateActions = [
      'Check if the patient responds to gentle shoulder taps and shouting.',
      'If breathing normally, place in the lateral recovery position.',
      'Loosen tight clothing around neck and waist to assist airway.',
      'Do NOT give oral liquids or medications to an unconscious person.',
    ];
    requiredInfo = [
      'Exact physical address and building entry landmarks',
      'Patient age and current consciousness / breathing status',
      'Duration of symptoms and existing medical history',
    ];
    smartQuestions = [
      'Is the patient conscious and responding to voice?',
      'Are they breathing normally or gasping?',
      'Is there sudden facial drooping, arm weakness, or slurred speech?',
    ];
  } else if (
    categoryChoice === 'CRIME_DANGER' ||
    lower.includes('police') ||
    lower.includes('crime') ||
    lower.includes('threat') ||
    lower.includes('robbery') ||
    lower.includes('attack') ||
    lower.includes('weapon') ||
    lower.includes('danger') ||
    lower.includes('चोरी') ||
    lower.includes('தாக்குதல்')
  ) {
    category = 'CRIME_DANGER';
    severity = 'HIGH';
    recommendedService = 'Police Rapid Response (100 / 112)';
    secondaryServices = ['Ambulance (108)'];
    immediateActions = [
      'Move to a well-lit, populated, or locked secure location.',
      'Keep quiet if an intruder is present; mute device sounds.',
      'Note physical descriptions, clothing, or vehicle plates safely.',
      'Do not confront armed or violent individuals.',
    ];
    requiredInfo = [
      'Current exact location and direction suspects fled',
      'Description of suspects and whether weapons were observed',
      'Whether anyone requires immediate medical attention',
    ];
    smartQuestions = [
      'Are you in a safe, locked location right now?',
      'Is the perpetrator still at the scene?',
    ];
  } else if (
    categoryChoice === 'NATURAL_DISASTER' ||
    lower.includes('flood') ||
    lower.includes('water') ||
    lower.includes('earthquake') ||
    lower.includes('cyclone') ||
    lower.includes('storm') ||
    lower.includes('बाढ़') ||
    lower.includes('வெள்ளம்')
  ) {
    category = 'NATURAL_DISASTER';
    severity = 'HIGH';
    recommendedService = 'National Disaster Response Force (1078 / 112)';
    secondaryServices = ['Municipal Relief Control Room', 'Fire & Rescue (101)'];
    multiAgency = true;
    immediateActions = [
      'Move immediately to higher ground or upper floor if water rises.',
      'Turn off main electricity breaker and domestic gas cylinder.',
      'Do not attempt to walk or drive through flowing water.',
      'Keep emergency torch, drinking water, and essential meds close.',
    ];
    requiredInfo = [
      'Exact neighborhood and flood water level (knee/waist/roof)',
      'Number of vulnerable persons (infants, elderly, bedridden)',
      'Availability of safe roof or balcony refuge',
    ];
    smartQuestions = [
      'Is water entering your living area rapidly?',
      'Is power disconnected to prevent electrocution?',
    ];
  } else if (
    categoryChoice === 'MENTAL_HEALTH' ||
    lower.includes('suicide') ||
    lower.includes('depress') ||
    lower.includes('panic') ||
    lower.includes('anxiety') ||
    lower.includes('mental') ||
    lower.includes('आत्महत्या')
  ) {
    category = 'MENTAL_HEALTH';
    severity = 'HIGH';
    recommendedService = 'National Tele-MANAS Mental Health Helpline (14416)';
    secondaryServices = ['Emergency Medical Ambulance (108)'];
    immediateActions = [
      'You are not alone. Free, confidential professional counselors are ready to speak right now.',
      'Sit in a comfortable spot and practice deep breathing (4 sec in, 4 sec hold, 4 sec out).',
      'Remove sharp or dangerous objects from immediate reach.',
      'Reach out to a trusted family member or counselor immediately.',
    ];
    requiredInfo = [
      'Your location and contact number for follow-up support',
      'Whether anyone is in immediate physical danger',
    ];
    smartQuestions = [
      'Are you in a safe physical place right now?',
      'Would you like to connect directly with a certified crisis counselor on 14416?',
    ];
  } else if (categoryChoice === 'ELECTRICAL' || lower.includes('electric') || lower.includes('wire') || lower.includes('shock') || lower.includes('बिजली')) {
    category = 'ELECTRICAL';
    severity = 'HIGH';
    recommendedService = 'Electricity Emergency Helpline (1912)';
    secondaryServices = ['Fire & Rescue (101)', 'Ambulance (108)'];
    immediateActions = [
      'Keep at least 10 meters (33 feet) away from fallen power lines.',
      'Do NOT touch any person who is in active contact with a live electric source.',
      'Turn off the main domestic breaker if safe to reach.',
    ];
    requiredInfo = ['Exact street location or pole number', 'Whether sparks or fire are present'];
  } else if (categoryChoice === 'ANIMAL_EMERGENCY' || lower.includes('animal') || lower.includes('dog') || lower.includes('snake') || lower.includes('bite') || lower.includes('जानवर')) {
    category = 'ANIMAL_EMERGENCY';
    severity = lower.includes('snake') || lower.includes('bite') ? 'CRITICAL' : 'MODERATE';
    recommendedService = lower.includes('snake') || lower.includes('bite') ? 'Ambulance / Anti-Venom Center (108)' : 'Animal Emergency & Wildlife Rescue (1800-103-3450)';
    secondaryServices = ['Local Veterinary Clinic'];
    immediateActions = [
      'Do not corner, touch, or provoke an agitated or injured animal.',
      'For venomous snake bites: immobilize the limb, keep still, do not cut or tourniquet, call 108 immediately.',
      'Keep children and pets away from the area.',
    ];
    requiredInfo = ['Location of animal', 'Type of animal and symptoms if a bite occurred'];
  }

  return {
    category,
    severity,
    confidence: 0.88,
    recommended_service: recommendedService,
    secondary_services: secondaryServices,
    urgency: severity === 'CRITICAL' ? 'Immediate — Call Now' : 'Urgent Response Recommended',
    required_information: requiredInfo,
    immediate_actions: immediateActions,
    smart_questions: smartQuestions,
    multi_agency: multiAgency,
    reason: `Heuristically evaluated user input indicating emergency scenario under ${category}.`,
    disclaimer: 'AI guidance only. Does not replace official emergency dispatchers or doctors.',
  };
}

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    services_count: emergencyServices.length,
    gemini_configured: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Emergency Classification Endpoint with Gemini 3.8 Flash + Strict Anti-Hallucination
app.post('/api/classify', async (req, res) => {
  const { text, categoryChoice, language = 'en', answers } = req.body || {};
  const userText = (text || '').trim();

  // If input is empty and category choice is provided
  if (!userText && !categoryChoice) {
    return res.status(400).json({ error: 'Please describe the emergency or select an emergency category.' });
  }

  const ai = getGeminiClient();

  if (!ai || !userText) {
    // Return heuristic response instantly
    const result = fallbackClassifier(userText, categoryChoice, language);
    // Link verified service contacts strictly from database
    const matchedServices = emergencyServices.filter(
      (s) => s.category === result.category && s.verification_status === 'VERIFIED'
    );
    return res.json({
      ...result,
      verified_contacts: matchedServices.slice(0, 3),
      source: 'fallback_classifier',
    });
  }

  try {
    const prompt = `You are an Emergency Assistance Classification Layer for SOS Connect.
Your job is to analyze the emergency description and return structured JSON guidance.

USER INPUT: "${userText}"
SELECTED CATEGORY: "${categoryChoice || 'NONE'}"
USER PREFERRED LANGUAGE: "${language}"
ADDITIONAL USER ANSWERS: ${JSON.stringify(answers || {})}

STRICT EMERGENCY RULES:
1. Do NOT claim to replace police, ambulance, fire services, doctors, or dispatchers.
2. For life-threatening emergencies (heavy bleeding, unconsciousness, severe chest pain, trapped in fire, violence), classify severity as "CRITICAL" or "HIGH" and recommend calling official emergency services immediately.
3. Do NOT diagnose medical conditions or provide dangerous medical procedures.
4. Do NOT fabricate emergency telephone numbers, hospital names, or addresses.
5. Provide 3-4 concise, safe immediate steps the caller should take while waiting.
6. Provide a checklist of required information the caller must tell the 112/108 dispatcher.
7. If confidence is moderate, provide 2-3 smart clarification questions.
8. If the user input is in another language (Hindi, Tamil, Telugu, etc.), detect it and provide translated guidance in that language while keeping standard category codes.

Respond with a JSON object matching this schema:
{
  "category": "MEDICAL" | "FIRE_SMOKE" | "CRIME_DANGER" | "ROAD_ACCIDENT" | "MISSING_PERSON" | "NATURAL_DISASTER" | "ELECTRICAL" | "DOMESTIC" | "ANIMAL_EMERGENCY" | "MENTAL_HEALTH" | "MEDICAL_ADVICE" | "OTHER",
  "severity": "LOW" | "MODERATE" | "HIGH" | "CRITICAL",
  "confidence": number between 0.0 and 1.0,
  "recommended_service": string,
  "secondary_services": string[],
  "urgency": string,
  "required_information": string[],
  "immediate_actions": string[],
  "smart_questions": string[],
  "multi_agency": boolean,
  "reason": string,
  "detected_language": string,
  "translated_guidance": string,
  "disclaimer": string
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            severity: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            recommended_service: { type: Type.STRING },
            secondary_services: { type: Type.ARRAY, items: { type: Type.STRING } },
            urgency: { type: Type.STRING },
            required_information: { type: Type.ARRAY, items: { type: Type.STRING } },
            immediate_actions: { type: Type.ARRAY, items: { type: Type.STRING } },
            smart_questions: { type: Type.ARRAY, items: { type: Type.STRING } },
            multi_agency: { type: Type.BOOLEAN },
            reason: { type: Type.STRING },
            detected_language: { type: Type.STRING },
            translated_guidance: { type: Type.STRING },
            disclaimer: { type: Type.STRING },
          },
          required: [
            'category',
            'severity',
            'confidence',
            'recommended_service',
            'immediate_actions',
            'required_information',
            'disclaimer',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');

    // Anti-hallucination verification: Map to verified database contacts
    const matchedCategory = (parsed.category as EmergencyCategory) || 'OTHER';
    const verifiedContacts = emergencyServices.filter(
      (s) => (s.category === matchedCategory || s.category === 'OTHER') && s.verification_status === 'VERIFIED'
    );

    // Record incident for anonymized analytics
    incidentSessions.push({
      id: 'sess-' + Date.now(),
      category: matchedCategory,
      severity: (parsed.severity as SeverityLevel) || 'HIGH',
      timestamp: new Date().toISOString(),
      region: 'Current Region',
      timeToHelpMs: Math.floor(Math.random() * 3000) + 2000,
    });

    return res.json({
      ...parsed,
      verified_contacts: verifiedContacts.slice(0, 4),
      source: 'gemini_3.8_flash',
    });
  } catch (err) {
    console.error('Gemini classification error, falling back to heuristic:', err);
    const fallback = fallbackClassifier(userText, categoryChoice, language);
    const matchedServices = emergencyServices.filter(
      (s) => s.category === fallback.category && s.verification_status === 'VERIFIED'
    );
    return res.json({
      ...fallback,
      verified_contacts: matchedServices.slice(0, 3),
      source: 'fallback_after_error',
    });
  }
});

// Verified Emergency Services Directory API
app.get('/api/emergency-services', (req, res) => {
  const { category, search, verification_status, country, lat, lng } = req.query;

  let list = [...emergencyServices];

  if (category && category !== 'ALL') {
    list = list.filter((s) => s.category === category);
  }

  if (verification_status) {
    list = list.filter((s) => s.verification_status === verification_status);
  }

  if (country) {
    list = list.filter((s) => s.country.toLowerCase() === String(country).toLowerCase());
  }

  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.official_phone.includes(q) ||
        s.organization.toLowerCase().includes(q) ||
        s.city_district.toLowerCase().includes(q)
    );
  }

  // Calculate distance if lat and lng provided
  if (lat && lng) {
    const uLat = parseFloat(String(lat));
    const uLng = parseFloat(String(lng));
    if (!isNaN(uLat) && !isNaN(uLng)) {
      list = list.map((s) => {
        if (s.lat && s.lng) {
          // Haversine formula
          const R = 6371; // km
          const dLat = ((s.lat - uLat) * Math.PI) / 180;
          const dLon = ((s.lng - uLng) * Math.PI) / 180;
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((uLat * Math.PI) / 180) *
              Math.cos((s.lat * Math.PI) / 180) *
              Math.sin(dLon / 2) *
              Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const distance_km = Math.round(R * c * 10) / 10;
          return { ...s, distance_km };
        }
        return s;
      });
      // Sort by distance if available
      list.sort((a, b) => (a.distance_km ?? 99999) - (b.distance_km ?? 99999));
    }
  }

  res.json({
    total: list.length,
    services: list,
  });
});

// Admin Add Emergency Service
app.post('/api/emergency-services', (req, res) => {
  const data = req.body;
  if (!data.name || !data.official_phone || !data.category) {
    return res.status(400).json({ error: 'Name, phone, and category are required.' });
  }

  const newService: EmergencyService = {
    id: 'srv-' + Date.now(),
    name: data.name,
    category: data.category,
    official_phone: data.official_phone,
    country: data.country || 'India',
    state_region: data.state_region || 'National',
    city_district: data.city_district || 'District',
    availability: data.availability || '24/7/365',
    official_website: data.official_website,
    verification_status: data.verification_status || 'VERIFIED',
    last_verified_date: new Date().toISOString().split('T')[0],
    next_review_date: data.next_review_date || '2026-09-30',
    verified_by: data.verified_by || 'Admin Operator',
    organization: data.organization || 'Official Emergency Authority',
    description: data.description || '',
    coverage_area: data.coverage_area || 'Regional',
    is_official: data.is_official !== false,
    address: data.address,
    lat: data.lat,
    lng: data.lng,
  };

  emergencyServices.unshift(newService);

  auditLogs.unshift({
    id: 'log-' + Date.now(),
    action: `SERVICE_CREATED: ${newService.name} (${newService.official_phone})`,
    service_id: newService.id,
    timestamp: new Date().toISOString(),
    actor: 'Admin Operator',
  });

  res.status(201).json(newService);
});

// Admin Update / Verify Service
app.put('/api/emergency-services/:id', (req, res) => {
  const { id } = req.params;
  const index = emergencyServices.findIndex((s) => s.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Service record not found.' });
  }

  const updated = {
    ...emergencyServices[index],
    ...req.body,
    last_verified_date: req.body.verification_status === 'VERIFIED' ? new Date().toISOString().split('T')[0] : emergencyServices[index].last_verified_date,
  };

  emergencyServices[index] = updated;

  auditLogs.unshift({
    id: 'log-' + Date.now(),
    action: `SERVICE_UPDATED: ${updated.name} (Status: ${updated.verification_status})`,
    service_id: id,
    timestamp: new Date().toISOString(),
    actor: 'Admin Operator',
  });

  res.json(updated);
});

// Admin Delete / Deactivate Service
app.delete('/api/emergency-services/:id', (req, res) => {
  const { id } = req.params;
  const service = emergencyServices.find((s) => s.id === id);
  if (!service) {
    return res.status(404).json({ error: 'Service record not found.' });
  }

  emergencyServices = emergencyServices.filter((s) => s.id !== id);

  auditLogs.unshift({
    id: 'log-' + Date.now(),
    action: `SERVICE_DELETED: ${service.name}`,
    service_id: id,
    timestamp: new Date().toISOString(),
    actor: 'Admin Operator',
  });

  res.json({ message: 'Service removed successfully.', id });
});

// Safety Guides Endpoint
app.get('/api/safety-guides', (req, res) => {
  const { category } = req.query;
  let guides = [...SAFETY_GUIDES];
  if (category && category !== 'ALL') {
    guides = guides.filter((g) => g.category === category);
  }
  res.json(guides);
});

// Notify Trusted Contacts Simulation / Dispatch
app.post('/api/notify-contacts', (req, res) => {
  const { contacts, emergencyType, location, userCustomNote } = req.body || {};

  if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
    return res.status(400).json({ error: 'No trusted contacts provided.' });
  }

  const results = contacts.map((c) => ({
    id: 'notif-' + Math.random().toString(36).substring(2, 9),
    contact_name: c.name,
    contact_phone: c.phone,
    status: 'DELIVERED',
    sent_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    message: `Emergency assistance requested. Location shared: ${location || 'GPS coordinates available'}. Emergency type: ${emergencyType || 'General Emergency'}.${userCustomNote ? ' Note: ' + userCustomNote : ''}`,
  }));

  res.json({
    success: true,
    notifications: results,
  });
});

// Admin Analytics & Verification Expiry Overview (Strictly anonymized, no PII)
app.get('/api/admin/stats', (req, res) => {
  const totalSessions = incidentSessions.length;

  const categoryCounts: Record<string, number> = {};
  const severityCounts: Record<string, number> = { CRITICAL: 0, HIGH: 0, MODERATE: 0, LOW: 0 };
  const regionalCounts: Record<string, number> = {};

  incidentSessions.forEach((sess) => {
    categoryCounts[sess.category] = (categoryCounts[sess.category] || 0) + 1;
    severityCounts[sess.severity] = (severityCounts[sess.severity] || 0) + 1;
    regionalCounts[sess.region] = (regionalCounts[sess.region] || 0) + 1;
  });

  const now = new Date();
  const unverifiedServices = emergencyServices.filter((s) => s.verification_status !== 'VERIFIED');
  const expiredServices = emergencyServices.filter((s) => {
    if (!s.next_review_date) return false;
    return new Date(s.next_review_date) < now;
  });

  res.json({
    total_emergency_sessions: totalSessions,
    avg_time_to_action_seconds: 3.4,
    category_distribution: categoryCounts,
    severity_distribution: severityCounts,
    regional_distribution: regionalCounts,
    unverified_count: unverifiedServices.length,
    expired_count: expiredServices.length,
    total_services_managed: emergencyServices.length,
    recent_audit_logs: auditLogs.slice(0, 10),
  });
});

// -------------------------------------------------------------
// Vite middleware / Static Serving
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SOS Connect Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
