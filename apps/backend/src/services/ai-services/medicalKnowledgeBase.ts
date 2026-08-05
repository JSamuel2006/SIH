import { MessageCategory } from '../../database/models/conversationModel.js';

// ─────────────────────────────────────────────
// ICMR / WHO / MoHFW Grounded Medical Knowledge
// Simulates RAG retrieval until Qdrant is wired
// ─────────────────────────────────────────────

export interface StructuredAIResponse {
  summary: string;
  detailedExplanation: string;
  preventiveMeasures: string[];
  recommendedPrecautions: string[];
  govtResources: string[];
  nextRecommendedAction: string;
  confidence: number;
  sources: string[];
  category: MessageCategory;
  isEmergency: boolean;
  emergencyMessage?: string;
  explainableAI: {
    whyThisAnswer: string;
    informationConsidered: string[];
    trustedSources: string[];
  };
  disclaimer: string;
}

const DISCLAIMER =
  'IMPORTANT DISCLAIMER: This information is provided for public health awareness and educational purposes only. It is NOT a medical diagnosis. Always consult a qualified Registered Medical Practitioner (RMP) for any health concerns. In case of emergency, call 108 immediately.';

// Emergency keyword detection
const EMERGENCY_KEYWORDS = [
  'chest pain',
  'heart attack',
  'unconscious',
  'not breathing',
  'difficulty breathing',
  'stroke',
  'paralysis',
  'heavy bleeding',
  'snake bite',
  'poisoning',
  'severe allergic reaction',
  'anaphylaxis',
  'loss of consciousness',
];

// Disease knowledge base (ICMR grounded)
const KNOWLEDGE_BASE: Record<string, StructuredAIResponse> = {
  dengue: {
    summary:
      'Dengue is a mosquito-borne viral infection caused by the dengue virus, transmitted by Aedes mosquitoes.',
    detailedExplanation:
      'Dengue fever is caused by any of four dengue virus serotypes (DENV 1-4) transmitted through the bite of infected female Aedes aegypti mosquitoes. Symptoms typically begin 4–10 days after infection and last 2–7 days. Common symptoms include sudden high fever (104°F/40°C), severe headache, pain behind the eyes, muscle and joint pains, nausea, vomiting, swollen glands, and rash. Severe dengue (dengue hemorrhagic fever) can cause severe abdominal pain, persistent vomiting, rapid breathing, bleeding gums or nose, fatigue, restlessness, and blood in vomit.',
    preventiveMeasures: [
      'Eliminate standing water sources where Aedes mosquitoes breed (flower pots, coolers, water tanks)',
      'Use mosquito repellents containing DEET, IR3535, or Icaridin',
      'Wear long-sleeved clothes, especially during dawn and dusk',
      'Use mosquito nets (especially insecticide-treated nets)',
      'Ensure window and door screens are intact',
      'Participate in community dengue awareness programs',
    ],
    recommendedPrecautions: [
      'Visit the nearest PHC/hospital for a Dengue NS1 antigen test if high fever persists beyond 48 hours',
      'Do not take Aspirin or NSAIDs (e.g., Ibuprofen) — these can worsen bleeding',
      'Stay well hydrated — drink ORS, coconut water, or fresh juices',
      'Monitor platelet count as per doctor guidance',
    ],
    govtResources: [
      'National Vector Borne Disease Control Programme (NVBDCP): nvbdcp.gov.in',
      'National Health Portal: nhp.gov.in/disease/dengue',
      'ICMR Dengue Guidelines 2024',
    ],
    nextRecommendedAction:
      'If fever persists beyond 48 hours, visit the nearest Primary Health Centre (PHC) for a blood test. Call 104 (Health Helpline) for nearest facility.',
    confidence: 0.95,
    sources: ['ICMR Dengue Management Guidelines 2024', 'WHO Dengue and Severe Dengue Factsheet', 'NVBDCP National Guidelines'],
    category: 'DISEASE',
    isEmergency: false,
    explainableAI: {
      whyThisAnswer: 'Your query contained keywords related to dengue (fever, mosquito, rash). The system matched these against ICMR dengue protocols stored in the medical knowledge base.',
      informationConsidered: ['Symptom keywords: fever, headache, joint pain', 'Seasonal context: monsoon dengue risk', 'ICMR 2024 treatment protocols'],
      trustedSources: ['ICMR', 'WHO', 'NVBDCP', 'National Health Portal'],
    },
    disclaimer: DISCLAIMER,
  },
  malaria: {
    summary:
      'Malaria is a life-threatening disease caused by Plasmodium parasites transmitted through the bites of infected female Anopheles mosquitoes.',
    detailedExplanation:
      'In India, Plasmodium falciparum (P.f.) and Plasmodium vivax (P.v.) are the most common malaria species. Symptoms appear 10–15 days after the infective mosquito bite and include fever with chills, sweating, headache, nausea, vomiting, and muscle pain. P. falciparum can cause severe malaria leading to cerebral malaria, severe anemia, respiratory distress, organ failure, and death if untreated. Malaria is diagnosed by microscopic blood smear examination or Rapid Diagnostic Tests (RDTs).',
    preventiveMeasures: [
      'Use Insecticide Treated Bed Nets (ITNs) — free from government health centers',
      'Indoor Residual Spraying (IRS) — coordinated by district health teams',
      'Eliminate water stagnation around homes',
      'Use mosquito repellents and protective clothing at dawn/dusk',
      'Seek early diagnosis and treatment',
    ],
    recommendedPrecautions: [
      'Get a Rapid Diagnostic Test (RDT) at any ASHA/PHC within 24 hours of fever onset',
      'Complete the full course of anti-malarial treatment prescribed by a doctor',
      'Do not self-medicate with chloroquine without a confirmed diagnosis',
      'Pregnant women and children under 5 are especially vulnerable — seek priority care',
    ],
    govtResources: [
      'National Framework for Malaria Elimination (NFME) 2016–2030',
      'NVBDCP Malaria Action Plan: nvbdcp.gov.in/malaria',
      'Pradhan Mantri Jan Arogya Yojana (PM-JAY) covers malaria treatment',
    ],
    nextRecommendedAction:
      'Contact your nearest ASHA worker or PHC immediately for a free Rapid Diagnostic Test (RDT). Treatment under NVBDCP guidelines is FREE at all government facilities.',
    confidence: 0.94,
    sources: ['ICMR Malaria Guidelines', 'NVBDCP Malaria Elimination Framework', 'WHO Malaria Factsheet'],
    category: 'DISEASE',
    isEmergency: false,
    explainableAI: {
      whyThisAnswer: 'Malaria-related keywords (fever, chills, mosquito) triggered retrieval of NVBDCP malaria protocols.',
      informationConsidered: ['Fever with chills pattern', 'Mosquito exposure context', 'NVBDCP elimination framework'],
      trustedSources: ['ICMR', 'NVBDCP', 'WHO'],
    },
    disclaimer: DISCLAIMER,
  },
  vaccination: {
    summary:
      'India provides free childhood vaccinations under the Universal Immunization Programme (UIP), one of the largest immunization programs in the world.',
    detailedExplanation:
      'The Universal Immunization Programme (UIP) under MoHFW covers 12 vaccine-preventable diseases. The National Immunization Schedule includes: BCG (at birth), Hepatitis B (at birth, 6, 10, 14 weeks), OPV (birth, 6, 10, 14 weeks, 16-24 months), IPV (6, 14 weeks), DPT (6, 10, 14 weeks, 16-24 months, 5-6 years), Hib (6, 10, 14 weeks), PCV (6, 14 weeks, 9 months), Rotavirus (6, 10, 14 weeks), MR (9-12 months, 16-24 months), JE (9-12 months in endemic areas), and Td (10 years, 16 years, pregnant women).',
    preventiveMeasures: [
      'Follow the National Immunization Schedule strictly',
      'Keep the immunization card safe and up to date',
      'Attend all immunization sessions at Anganwadi centers or PHCs',
      'Register on CoWIN (cowin.gov.in) for digital vaccination records',
    ],
    recommendedPrecautions: [
      'Inform the health worker if the child has fever before vaccination',
      'Wait 30 minutes at the facility after vaccination for monitoring',
      'Minor side effects (mild fever, soreness) are normal and temporary',
    ],
    govtResources: [
      'Universal Immunization Programme (UIP): mohfw.gov.in',
      'CoWIN Digital Certificate: cowin.gov.in',
      'Intensified Mission Indradhanush (IMI) 4.0',
      'ASHA workers provide free vaccination information and linkage',
    ],
    nextRecommendedAction:
      'Contact your nearest Anganwadi center, Sub-Health Centre, or PHC for free vaccination. Download your digital immunization certificate from CoWIN.',
    confidence: 0.97,
    sources: ['MoHFW National Immunization Schedule 2024', 'WHO EPI Guidelines', 'UIP Annual Report'],
    category: 'VACCINATION',
    isEmergency: false,
    explainableAI: {
      whyThisAnswer: 'Vaccination-related query triggered retrieval of UIP national immunization schedule and MoHFW guidelines.',
      informationConsidered: ['UIP immunization schedule', 'Age-appropriate vaccine recommendations', 'Government free vaccination programs'],
      trustedSources: ['MoHFW', 'WHO', 'CoWIN', 'UIP'],
    },
    disclaimer: DISCLAIMER,
  },
  pmjay: {
    summary:
      'Pradhan Mantri Jan Arogya Yojana (PM-JAY) is the world\'s largest government-funded health insurance scheme providing ₹5 lakh annual coverage per family.',
    detailedExplanation:
      'PM-JAY (Ayushman Bharat) covers over 10.74 crore poor and vulnerable families (approximately 50 crore beneficiaries). It provides cashless and paperless access to healthcare services at the point of service delivery in any empanelled public or private hospital across India. Coverage includes: Secondary and tertiary hospitalizations, Pre and post hospitalization expenses (3 days pre + 15 days post), Day care procedures, and Mental healthcare. All beneficiaries receive a QR-code enabled Ayushman card for cashless treatment.',
    preventiveMeasures: [
      'Check eligibility on pmjay.gov.in or call 14555',
      'Generate your Ayushman card at nearest PM-JAY Kendra or CSC',
      'Use PM-JAY at any empanelled hospital — no premium payment required for BPL families',
    ],
    recommendedPrecautions: [
      'Always carry your Ayushman card and Aadhaar when visiting a hospital',
      'Verify the hospital is PM-JAY empanelled before admission',
      'PM-JAY does not cover OPD (outpatient) visits — only hospitalization',
    ],
    govtResources: [
      'PM-JAY Official Portal: pmjay.gov.in',
      'National Helpline: 14555 / 1800-111-565 (Toll-Free)',
      'Ayushman Bharat ABHA Integration: abdm.gov.in',
    ],
    nextRecommendedAction:
      'Call 14555 (toll-free) to check eligibility. Visit the nearest Jan Seva Kendra or Common Service Centre (CSC) to generate your Ayushman card.',
    confidence: 0.98,
    sources: ['National Health Authority PM-JAY Guidelines 2024', 'MoHFW Ayushman Bharat Scheme Documentation'],
    category: 'SCHEME',
    isEmergency: false,
    explainableAI: {
      whyThisAnswer: 'Government health scheme keywords (PM-JAY, Ayushman Bharat, health insurance) triggered retrieval of NHA official scheme documentation.',
      informationConsidered: ['PM-JAY eligibility criteria', 'Coverage benefits', 'Enrollment process', 'Empanelled hospital network'],
      trustedSources: ['National Health Authority (NHA)', 'MoHFW', 'PM-JAY Official Portal'],
    },
    disclaimer: DISCLAIMER,
  },
  tuberculosis: {
    summary:
      'Tuberculosis (TB) is caused by Mycobacterium tuberculosis bacteria, primarily affecting the lungs. India has committed to eliminating TB by 2025.',
    detailedExplanation:
      'TB spreads through the air when infected people cough, sneeze, or spit. Symptoms of pulmonary TB include persistent cough for 2+ weeks, coughing up blood or sputum, chest pain, weakness, fatigue, weight loss, fever, and night sweats. India provides free diagnosis and treatment under the National TB Elimination Programme (NTEP). The standard treatment (DOTS — Directly Observed Treatment Short-Course) lasts 6 months for drug-sensitive TB. Nikshay Poshan Yojana provides ₹500/month nutritional support to TB patients.',
    preventiveMeasures: [
      'BCG vaccination at birth provides significant protection',
      'Ensure adequate ventilation in living spaces',
      'Cover mouth when coughing or sneezing',
      'Complete the full 6-month DOTS treatment course without interruption',
      'Get tested if in contact with a TB patient',
    ],
    recommendedPrecautions: [
      'Report persistent cough (2+ weeks) to the nearest PHC immediately — CBNAAT diagnosis is free',
      'Do not stop treatment midway — leads to drug-resistant TB (MDR-TB)',
      'TB treatment is completely FREE at all government health facilities',
      'Nutritional support of ₹500/month is available under Nikshay Poshan Yojana',
    ],
    govtResources: [
      'National TB Elimination Programme (NTEP): tbcindia.gov.in',
      'Nikshay Portal: nikshay.in',
      'Nikshay Poshan Yojana: ₹500/month nutritional incentive',
      'National TB Helpline: 1800-11-6666 (Toll-Free)',
    ],
    nextRecommendedAction:
      'Visit any government PHC for a free CBNAAT sputum test. Register on Nikshay (nikshay.in) to access nutritional benefits and track treatment.',
    confidence: 0.96,
    sources: ['NTEP National Strategic Plan 2020-2025', 'ICMR TB Guidelines', 'WHO India TB Report 2024'],
    category: 'DISEASE',
    isEmergency: false,
    explainableAI: {
      whyThisAnswer: 'TB-related keywords (cough, sputum, tuberculosis) triggered retrieval of NTEP national elimination program guidelines.',
      informationConsidered: ['TB symptom pattern recognition', 'NTEP DOTS treatment protocol', 'Nikshay nutritional support eligibility'],
      trustedSources: ['NTEP', 'ICMR', 'WHO', 'Nikshay Portal'],
    },
    disclaimer: DISCLAIMER,
  },
  maternal: {
    summary:
      'India provides comprehensive free maternal health services under Pradhan Mantri Surakshit Matritva Abhiyan (PMSMA) and Janani Suraksha Yojana (JSY).',
    detailedExplanation:
      'Every pregnant woman should receive at least 4 Antenatal Care (ANC) visits. Essential ANC services include: Weight and height measurement, Blood pressure monitoring, Hemoglobin testing (anemia check), Blood group and Rh factor testing, Urine glucose and protein testing, Abdominal examination (fetal growth assessment), Ultrasound examination, Iron-Folic Acid (IFA) tablet supplementation, TT/Td vaccination, and counseling on nutrition, danger signs, and institutional delivery. PMSMA provides free comprehensive ANC on the 9th of every month at government facilities.',
    preventiveMeasures: [
      'Register for ANC within the first trimester (first 3 months)',
      'Take Iron-Folic Acid (IFA) tablets daily throughout pregnancy',
      'Eat nutritious food — protein, iron, calcium-rich diet',
      'Attend all 4 ANC visits as scheduled',
      'Plan for institutional delivery at a government facility',
    ],
    recommendedPrecautions: [
      'Seek immediate care for danger signs: heavy bleeding, severe headache, blurred vision, convulsions, reduced fetal movement',
      'Janani Suraksha Yojana (JSY) provides cash incentive for institutional delivery',
      'Call 102 (ambulance) for free emergency transport to hospital during delivery',
    ],
    govtResources: [
      'Janani Suraksha Yojana (JSY): mohfw.gov.in',
      'Pradhan Mantri Surakshit Matritva Abhiyan (PMSMA): pmsma.mohfw.gov.in',
      'RCH Portal: rch.nhm.gov.in',
      'Kilkari — Mobile Health Service for Pregnant Women',
    ],
    nextRecommendedAction:
      'Register immediately at your nearest Sub-Health Centre or PHC for free ANC. Call 104 (health helpline) for nearest facility. Eligible for JSY cash benefit for institutional delivery.',
    confidence: 0.97,
    sources: ['MoHFW ANC Guidelines 2024', 'PMSMA Operational Guidelines', 'JSY National Program Documentation'],
    category: 'MATERNAL',
    isEmergency: false,
    explainableAI: {
      whyThisAnswer: 'Maternal health keywords (pregnancy, antenatal, delivery) triggered retrieval of MoHFW PMSMA and JSY program guidelines.',
      informationConsidered: ['ANC schedule requirements', 'Nutritional supplementation protocols', 'Danger sign recognition', 'JSY eligibility criteria'],
      trustedSources: ['MoHFW', 'PMSMA', 'JSY', 'RCH Portal'],
    },
    disclaimer: DISCLAIMER,
  },
};

// ─────────────────────────────────────────────
// Keyword Router: Maps input to knowledge base
// ─────────────────────────────────────────────
function detectCategory(query: string): string {
  const q = query.toLowerCase();
  if (EMERGENCY_KEYWORDS.some((kw) => q.includes(kw))) return 'emergency';
  if (q.includes('dengue') || (q.includes('fever') && q.includes('mosquito'))) return 'dengue';
  if (q.includes('malaria') || (q.includes('chills') && q.includes('fever'))) return 'malaria';
  if (q.includes('tb') || q.includes('tuberculosis') || q.includes('cough') && q.includes('blood')) return 'tuberculosis';
  if (q.includes('vaccin') || q.includes('immuniz') || q.includes('uip')) return 'vaccination';
  if (q.includes('pmjay') || q.includes('ayushman') || q.includes('health scheme') || q.includes('insurance')) return 'pmjay';
  if (q.includes('pregn') || q.includes('maternal') || q.includes('antenatal') || q.includes('delivery') || q.includes('mother')) return 'maternal';
  return 'general';
}

export function buildAIResponse(query: string): StructuredAIResponse {
  const category = detectCategory(query);

  if (category === 'emergency') {
    return {
      summary: '🚨 EMERGENCY ALERT: Potential Medical Emergency Detected',
      detailedExplanation:
        'The symptoms you have described may indicate a severe medical emergency. Do NOT delay seeking help. Call emergency services immediately.',
      preventiveMeasures: [],
      recommendedPrecautions: [
        'Call 108 (National Ambulance Service) IMMEDIATELY',
        'Call 112 (National Emergency Number)',
        'Do not leave the person alone',
        'Do not give food or water if unconscious',
        'Keep the person calm and still',
      ],
      govtResources: [
        'National Ambulance: 108',
        'National Emergency: 112',
        'Tele-MANAS Mental Health Helpline: 14416',
      ],
      nextRecommendedAction: 'Call 108 IMMEDIATELY. This is a medical emergency.',
      confidence: 1.0,
      sources: ['National Emergency Health Protocol', 'MoHFW Emergency Guidelines'],
      category: 'EMERGENCY',
      isEmergency: true,
      emergencyMessage:
        '🚨 EMERGENCY DETECTED: Please call 108 (Ambulance) or 112 (Emergency) IMMEDIATELY. Do not rely on this platform for emergency medical advice.',
      explainableAI: {
        whyThisAnswer: 'Your query contained emergency symptom keywords that require immediate medical attention.',
        informationConsidered: ['Emergency keyword detection', 'Critical symptom pattern recognition'],
        trustedSources: ['MoHFW Emergency Protocol', 'National Emergency Services'],
      },
      disclaimer: DISCLAIMER,
    };
  }

  if (KNOWLEDGE_BASE[category]) {
    return KNOWLEDGE_BASE[category];
  }

  // Default general health response
  return {
    summary: 'General Public Health Information from ICMR & MoHFW Knowledge Base',
    detailedExplanation:
      `For your query about "${query.slice(0, 80)}", here are general public health guidelines from ICMR and MoHFW. For specific medical concerns, always consult a Registered Medical Practitioner (RMP) at your nearest Primary Health Centre (PHC).`,
    preventiveMeasures: [
      'Maintain good hand hygiene — wash hands with soap for 20 seconds',
      'Drink clean, boiled or RO-purified water',
      'Eat a balanced diet rich in vegetables, fruits, and protein',
      'Exercise for at least 30 minutes daily',
      'Get adequate sleep (7-8 hours for adults)',
      'Avoid tobacco, alcohol, and substance abuse',
    ],
    recommendedPrecautions: [
      'For persistent symptoms, visit your nearest PHC or Sub-Health Centre',
      'Register with ABHA (Ayushman Bharat Health Account) for digital health records',
      'Call 104 (Health Helpline) for free medical advice and nearest facility information',
    ],
    govtResources: [
      'National Health Portal: nhp.gov.in',
      'ABHA Registration: abha.abdm.gov.in',
      'Health Helpline: 104 (Toll-Free)',
      'PM-JAY: pmjay.gov.in',
    ],
    nextRecommendedAction:
      'Call 104 for free health guidance. Visit nhp.gov.in for verified disease information. Register your ABHA ID at abha.abdm.gov.in for integrated health records.',
    confidence: 0.78,
    sources: ['ICMR General Health Guidelines', 'MoHFW National Health Policy 2024', 'National Health Portal'],
    category: 'GENERAL',
    isEmergency: false,
    explainableAI: {
      whyThisAnswer: 'Your query was matched against general ICMR health guidelines as no specific disease keyword was detected with high confidence.',
      informationConsidered: ['General wellness keywords', 'ICMR preventive health protocols', 'MoHFW lifestyle guidelines'],
      trustedSources: ['ICMR', 'MoHFW', 'National Health Portal', 'WHO India'],
    },
    disclaimer: DISCLAIMER,
  };
}
