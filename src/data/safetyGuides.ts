import { SafetyGuide } from '../types';

export const SAFETY_GUIDES: SafetyGuide[] = [
  {
    id: 'guide-fire-evacuation',
    title: 'Building Fire & Heavy Smoke Safety',
    category: 'FIRE_SMOKE',
    summary: 'Immediate life-safety protocols during a structural fire or dense smoke condition.',
    source: 'National Fire Protection Association (NFPA) & Directorate General Fire Services',
    last_reviewed: '2026-02-15',
    steps: [
      {
        order: 1,
        title: 'Alert & Evacuate Immediately',
        detail: 'Shout to alert occupants. Leave the building without collecting personal belongings. Close doors behind you to slow flame progression.',
        warning: 'Never use elevators during a fire; always take the emergency fire stairs.'
      },
      {
        order: 2,
        title: 'Stay Low Under Smoke',
        detail: 'Toxic smoke and heated gases rise toward the ceiling. Crawl on your hands and knees where the air is cleanest and coolest (within 30–60 cm from the floor).',
      },
      {
        order: 3,
        title: 'Test Doors Before Opening',
        detail: 'Use the back of your hand to feel the door surface, door knob, and the gap around the frame. If it feels hot, do not open it—seek an alternate escape route.',
      },
      {
        order: 4,
        title: 'If Trapped in a Room',
        detail: 'Seal door cracks and vents with wet towels, blankets, or clothing to block smoke. Signal for help from a window using a flashlight or brightly colored cloth. Call 101 or 112 immediately.',
      },
      {
        order: 5,
        title: 'If Clothes Catch Fire: Stop, Drop, and Roll',
        detail: 'Do not run. Immediately stop, drop to the ground, cover your face with your hands, and roll back and forth until the flames are completely extinguished.',
      }
    ]
  },
  {
    id: 'guide-road-accident',
    title: 'Road Accident & Collision Safety',
    category: 'ROAD_ACCIDENT',
    summary: 'Safe protocols to prevent secondary collisions and protect injured victims before emergency responders arrive.',
    source: 'Ministry of Road Transport and Highways (MoRTH) & WHO Trauma Guidelines',
    last_reviewed: '2026-02-20',
    steps: [
      {
        order: 1,
        title: 'Secure the Scene First',
        detail: 'Park your vehicle safely away from the crash zone. Switch on hazard warning blinkers. Place reflective emergency warning triangles 50 meters back to warn oncoming traffic.',
        warning: 'Do not put yourself in the path of fast-moving highway traffic.'
      },
      {
        order: 2,
        title: 'Turn Off Ignitions & Prevent Fire',
        detail: 'Turn off the ignition keys of involved vehicles to eliminate spark hazards. Ensure nobody is smoking near potential fuel spills.',
      },
      {
        order: 3,
        title: 'Do NOT Move Seriously Injured Victims',
        detail: 'Unless there is immediate imminent danger of fire or explosion, leave the injured person exactly where they are. Moving a patient with suspected spinal or neck injury can cause permanent paralysis.',
      },
      {
        order: 4,
        title: 'Call 108 / 112 with Precise Road Details',
        detail: 'State highway number, milestone or landmark, direction of travel, number of vehicles involved, and approximate number of casualties.',
      }
    ]
  },
  {
    id: 'guide-severe-bleeding',
    title: 'Severe Bleeding First-Aid Response',
    category: 'MEDICAL',
    summary: 'Direct pressure techniques to stop critical blood loss before emergency medical services arrive.',
    source: 'International Federation of Red Cross (IFRC) First Aid Guidelines',
    last_reviewed: '2026-03-01',
    steps: [
      {
        order: 1,
        title: 'Apply Continuous Direct Pressure',
        detail: 'Take a sterile dressing, clean cloth, or your gloved hand and press firmly and directly onto the wound. Maintain firm, uninterrupted pressure.',
        warning: 'Do not remove an embedded object (such as a knife or piece of glass); pad around it to support it without pushing it in deeper.'
      },
      {
        order: 2,
        title: 'Do Not Lift the Cloth to Check',
        detail: 'Lifting the dressing breaks blood clotting. If blood soaks through, place another cloth or pad directly over the top and keep applying pressure.',
      },
      {
        order: 3,
        title: 'Position the Patient Comfortably',
        detail: 'Help the injured person lie flat on the ground. Keep them calm and warm with a coat or blanket to prevent hypothermia and shock.',
      },
      {
        order: 4,
        title: 'Monitor Consciousness & Airway',
        detail: 'Talk to the patient continuously. If they feel dizzy or weak, maintain pressure until the ambulance crew arrives.',
      }
    ]
  },
  {
    id: 'guide-unconscious-person',
    title: 'Unconscious Person & Airway Management',
    category: 'MEDICAL',
    summary: 'Recognizing unresponsiveness, checking breathing, and using the recovery position.',
    source: 'American Heart Association (AHA) & Resuscitation Council',
    last_reviewed: '2026-02-28',
    steps: [
      {
        order: 1,
        title: 'Check Responsiveness Safely',
        detail: 'Gently tap the shoulders and shout: "Are you okay?". If there is no response, immediately ask someone to call 108 or 112.',
      },
      {
        order: 2,
        title: 'Check for Normal Breathing',
        detail: 'Tilt the head back gently by lifting the chin to open the airway. Look at the chest, listen, and feel for normal breathing for no more than 10 seconds.',
        warning: 'Agonal gasps (irregular, loud gasping) are not normal breathing. If not breathing normally, begin CPR if trained.'
      },
      {
        order: 3,
        title: 'Recovery Position (If Breathing Normally)',
        detail: 'If they are unconscious but breathing normally, roll them onto their side in the recovery position with their top knee bent. This keeps their tongue from blocking the airway and prevents choking if they vomit.',
      },
      {
        order: 4,
        title: 'Never Give Liquids or Food',
        detail: 'Do not pour water into the mouth or attempt to give medicines to an unconscious person.',
      }
    ]
  },
  {
    id: 'guide-flood-safety',
    title: 'Flash Flood & Heavy Water Inflow Safety',
    category: 'NATURAL_DISASTER',
    summary: 'Immediate safety rules during sudden flash floods, urban inundation, or dam overflows.',
    source: 'National Disaster Management Authority (NDMA)',
    last_reviewed: '2026-01-20',
    steps: [
      {
        order: 1,
        title: 'Move to Higher Ground',
        detail: 'If water starts rising in your premises, move to the top floor or roof immediately with your emergency kit, phone, and medications.',
      },
      {
        order: 2,
        title: 'Turn Off Mains Power & Gas',
        detail: 'Shut off the main electricity breaker and cooking gas valve before water reaches sockets or appliances. Never touch electrical switches with wet hands or while standing in water.',
        warning: 'Water touching live wires creates severe electrocution danger.'
      },
      {
        order: 3,
        title: 'Never Walk or Drive Through Moving Water',
        detail: 'Just 15 cm (6 inches) of swiftly moving water can knock an adult down. 30 cm (1 foot) can float a car or motorcycle. "Turn Around, Don\'t Drown."',
      },
      {
        order: 4,
        title: 'Do Not Drink Tap Water',
        detail: 'Floodwaters contaminate municipal water lines. Use boiled or bottled water only.',
      }
    ]
  },
  {
    id: 'guide-earthquake-safety',
    title: 'Earthquake Shaking Safety (Drop, Cover, Hold On)',
    category: 'NATURAL_DISASTER',
    summary: 'Protection during active seismic tremors and safe post-quake building evacuation.',
    source: 'USGS & National Disaster Management Authority (NDMA)',
    last_reviewed: '2026-02-10',
    steps: [
      {
        order: 1,
        title: 'Drop, Cover, and Hold On',
        detail: 'Drop onto your hands and knees. Cover your head and neck under a sturdy table or desk. Hold on to your shelter until the shaking stops.',
        warning: 'Do not run outside while the ground is actively shaking; falling glass, masonry, and billboards are the primary cause of injury.'
      },
      {
        order: 2,
        title: 'Stay Away from Windows & Tall Furniture',
        detail: 'Keep clear of glass windows, mirrors, bookcases, heavy chandeliers, and hanging objects.',
      },
      {
        order: 3,
        title: 'After Shaking Stops: Evacuate Calmly',
        detail: 'Check yourself and others for injuries. Use stairs, not elevators. Watch out for downed power lines and damaged gas pipes outside.',
      }
    ]
  },
  {
    id: 'guide-electrical-hazard',
    title: 'Electrical Emergency & Downed Power Lines',
    category: 'ELECTRICAL',
    summary: 'Preventing electrocution from fallen power cables, submerged wires, or high-voltage sparks.',
    source: 'Central Electricity Authority & OSHA Electrical Safety Standard',
    last_reviewed: '2026-01-30',
    steps: [
      {
        order: 1,
        title: 'Maintain at Least 10 Meters (33 Feet) Distance',
        detail: 'Assume every downed line is energized and lethal. The ground around a fallen wire can become energized. Keep everyone well back.',
        warning: 'Never touch a person who is currently in contact with a live electrical wire or source.'
      },
      {
        order: 2,
        title: 'If a Wire Falls on Your Car',
        detail: 'Stay inside the vehicle. The rubber tires insulate you. Honk your horn and wait for power technicians to de-energize the line. Only exit if the vehicle catches fire—jump clear with both feet together without touching the car and ground at the same time.',
      },
      {
        order: 3,
        title: 'Shut Off the Main Breaker for Indoor Hazards',
        detail: 'If an appliance or outlet is smoking or sparking inside a building, cut power at the main distribution board if it is safe to reach.',
      },
      {
        order: 4,
        title: 'Call 1912 / 101 / 112',
        detail: 'Report the exact pole number or landmark location so the utility DISCOM can remotely trip the feeder.',
      }
    ]
  },
  {
    id: 'guide-mental-health-crisis',
    title: 'Mental Health Crisis & Panic De-escalation',
    category: 'MENTAL_HEALTH',
    summary: 'Compassionate grounding and supportive intervention for individuals experiencing acute psychological distress.',
    source: 'Tele-MANAS & WHO Psychological First Aid Guidelines',
    last_reviewed: '2026-03-05',
    steps: [
      {
        order: 1,
        title: 'Stay Calm, Present, and Non-Judgmental',
        detail: 'Speak in a soft, steady, and reassuring voice. Let the person know: "You are not alone, I am here with you right now, and we will get help together."',
      },
      {
        order: 2,
        title: 'Eliminate Immediate Hazards',
        detail: 'Gently remove potentially dangerous items from the immediate surroundings (sharp objects, medications, balcony access).',
        warning: 'If there is imminent risk of self-harm or violence, do not leave the person alone. Call 14416 (Tele-MANAS) or 112 immediately.'
      },
      {
        order: 3,
        title: 'Grounding Technique (5-4-3-2-1)',
        detail: 'Guide them to breathe slowly: inhale for 4 seconds, hold for 4, exhale for 4. Ask them to name 5 things they see, 4 things they can touch, 3 sounds they hear, 2 scents, and 1 positive thought.',
      },
      {
        order: 4,
        title: 'Connect to Tele-MANAS (14416)',
        detail: 'Tele-MANAS is free, confidential, available 24/7 in multiple Indian languages, and staffed by trained clinical counselors.',
      }
    ]
  }
];
