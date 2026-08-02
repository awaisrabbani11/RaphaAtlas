import { Article } from '../types';

export const FEATURED_ARTICLES: Article[] = [
  {
    id: 'art-apob-lipids',
    slug: 'apob-cholesterol-lipid-biomarkers-decoded',
    title: 'ApoB, hs-CRP & Lipid Biomarkers Decoded: What Your Doctor Wants You to Know',
    subtitle: 'A comprehensive clinical breakdown of particle count vs. concentration, inflammation markers, and cardiovascular risk reduction.',
    pillar: 'MEDICAL',
    categoryTag: 'Lab Interpretation & Preventive Medicine',
    author: {
      name: 'Dr. Sarah Lin, MD',
      role: 'Chief Medical Officer & Preventive Cardiologist',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    },
    reviewer: {
      name: 'Dr. Robert Vance, FACC',
      title: 'Clinical Professor of Cardiovascular Medicine',
    },
    publishedAt: 'August 1, 2026',
    readTime: '7 min read',
    coverImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80',
    featured: true,
    trending: true,
    executiveSummary: 'Standard cholesterol panels measure total mass (LDL-C), but particle count (ApoB) and systemic vascular inflammation (hs-CRP) are far superior predictors of atherogenic plaque development. Learn how to interpret your lab reports and prepare smart questions for your physician.',
    keyTakeaways: [
      'ApoB measures the exact total number of atherogenic particles (LDL, VLDL, IDL) circulating in your bloodstream.',
      'High ApoB combined with elevated hs-CRP indicates active vascular endothelial inflammation and accelerated plaque risk.',
      'ApoB target for optimal cardiovascular longevity is generally <80 mg/dL (<60 mg/dL for high-risk individuals).',
      'Use the embedded AI Lab Result Simplifier below to paste your lab values and receive a plain-English breakdown instantly.',
    ],
    embeddedAiTool: {
      toolId: 'tool-jargon-apob',
      toolName: 'Embedded AI Lab Result & Biomarker Decoder',
      toolDescription: 'Paste your blood test lipid panel (ApoB, hs-CRP, LDL-C, Triglycerides) or doctor notes to get a personalized plain-English explanation and targeted questions for your next visit.',
      demoType: 'jargon_simplifier',
      inputPlaceholder: 'e.g., Serum ApoB: 125 mg/dL, hs-CRP: 2.8 mg/L, Total Cholesterol: 210 mg/dL',
      contextHint: '38yo male, family history of early CAD, sedentary desk job',
      presetQueries: [
        'Serum ApoB is 125 mg/dL and hs-CRP is 2.8 mg/L. What does this mean for my cardiovascular risk?',
        'LDL-C is 110 mg/dL but ApoB is 135 mg/dL (discordance). Why is my particle count higher?',
        'Triglycerides are 180 mg/dL and HDL is 38 mg/dL. Is this metabolic syndrome?',
      ],
    },
    sections: [
      {
        id: 'sec-1',
        heading: '1. Why Standard LDL-C Misses the Full Picture',
        content: `When you receive a standard lipid panel, the most commonly cited number is **LDL-C** (Low-Density Lipoprotein Cholesterol). However, LDL-C measures the *weight or mass* of cholesterol contained inside particles, rather than the *number of particles* carrying that cholesterol.

Imagine a highway filled with vehicles carrying passengers:
* **LDL-C** represents the total number of passengers.
* **ApoB** represents the total number of cars on the road.

Even if you have fewer passengers (normal LDL-C), if those passengers are spread across hundreds of tiny, dense cars (high ApoB particle count), traffic congestion and arterial wall collisions skyrocket. Every atherogenic particle carries exactly one molecule of Apolipoprotein B (ApoB). Thus, measuring ApoB provides a direct, highly accurate count of atherogenic danger.`,
        calloutBox: {
          type: 'evidence_summary',
          title: 'Clinical Evidence Summary (Mendelian Randomization Studies)',
          text: 'Large-scale genetic studies confirm that ApoB is discordantly predictive of cardiovascular events in up to 20% of patients whose LDL-C appears completely normal.',
        },
      },
      {
        id: 'sec-2',
        heading: '2. The Role of High-Sensitivity C-Reactive Protein (hs-CRP)',
        content: `Cholesterol particles alone cannot form dangerous arterial plaques without vascular inflammation. **hs-CRP** is a biomarker produced by the liver in response to systemic inflammation.

When ApoB particles penetrate the sub-endothelial layer of arterial walls, macrophages engulf them, becoming foam cells. If hs-CRP is elevated (>2.0 mg/L), this inflammatory environment accelerates macrophage activation and plaque instability.

### Biomarker Reference Ranges:
* **ApoB (Optimal):** < 80 mg/dL (High risk target: < 60 mg/dL)
* **hs-CRP (Optimal):** < 1.0 mg/L (Low vascular inflammation)
* **Triglyceride to HDL Ratio (Optimal):** < 2.0`,
        calloutBox: {
          type: 'clinical_note',
          title: 'Physician Consultation Checklist',
          text: 'If your ApoB is >100 mg/dL with hs-CRP >2.0 mg/L, ask your physician if a Coronary Artery Calcium (CAC) scan or soft plaque CT angiogram is appropriate.',
        },
      },
      {
        id: 'sec-3',
        heading: '3. Actionable Dietary & Lifestyle Protocols',
        content: `Lowering ApoB and vascular inflammation requires a dual approach:

1. **Reduce Saturated Fat:** Replacing saturated fats (butter, fatty red meats, coconut oil) with polyunsaturated and monounsaturated fats (extra virgin olive oil, avocado, wild salmon) downregulates hepatic ApoB synthesis and upregulates LDL receptor clearance.
2. **Increase Soluble Viscous Fiber:** Aim for 35–50g of daily fiber (psyllium husk, oats, legumes, chia seeds). Soluble fiber binds bile acids in the gut, forcing the liver to extract cholesterol from the bloodstream to produce new bile.
3. **Aerobic Zone 2 Exercise:** 150+ minutes per week of sustained low-intensity aerobic training improves insulin sensitivity and reduces inflammatory cytokines that elevate hs-CRP.`,
      },
    ],
    tags: ['ApoB', 'Cardiometabolic', 'Bloodwork', 'Preventive Health', 'Lipids'],
    relatedArticleIds: ['art-sleep-circadian', 'art-ring-dips-mobility'],
  },

  {
    id: 'art-sleep-circadian',
    slug: 'circadian-light-adenosine-deep-sleep-protocol',
    title: 'The Adenosine & Light Timing Protocol for 20% More Deep REM Sleep',
    subtitle: 'How morning photons, body temperature regulation, and adenosine management optimize sleep architecture and cellular recovery.',
    pillar: 'LIFESTYLE',
    categoryTag: 'Sleep Hygiene & Biohacking',
    author: {
      name: 'Dr. Alex Rivera, PhD',
      role: 'Neuroscientist & Sleep Physiology Researcher',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    reviewer: {
      name: 'Dr. Michael Breus, PhD',
      title: 'Board Certified Sleep Specialist',
    },
    publishedAt: 'July 28, 2026',
    readTime: '6 min read',
    coverImage: 'https://images.unsplash.com/photo-1511295742362-92c96b124e52?w=800&auto=format&fit=crop&q=80',
    featured: true,
    trending: true,
    executiveSummary: 'Deep Stage 3/4 slow-wave sleep and REM sleep are governed by two distinct biological mechanisms: System 1 (Adenosine sleep pressure) and System 2 (Circadian circadian pacemaker in the suprachiasmatic nucleus). Master light timing and temperature drops to dramatically improve your sleep score.',
    keyTakeaways: [
      'Viewing 10-15 minutes of direct morning sunlight within 30 minutes of waking triggers a healthy cortisol pulse and sets a 16-hour timer for nocturnal melatonin release.',
      'Caffeine works by blocking adenosine receptors in the brain; avoid caffeine within 9-10 hours of your target bedtime.',
      'Your core body temperature must drop by 1-2°F to initiate and sustain deep slow-wave sleep.',
      'Use the embedded AI Circadian Routine Generator below to build a customized sleep & wake stack based on your schedule.',
    ],
    embeddedAiTool: {
      toolId: 'tool-routine-sleep',
      toolName: 'Embedded AI Sleep & Circadian Routine Generator',
      toolDescription: 'Input your wake-up time, sleep goals, and caffeine habits to generate a custom morning light exposure, meal timing, and evening wind-down routine.',
      demoType: 'lifestyle_habit_planner',
      inputPlaceholder: 'e.g., Wake up at 6:30 AM, struggle with 3 AM awakenings, drink 2 cups of coffee',
      contextHint: 'Desk worker, high stress, target bedtime 10:30 PM',
      presetQueries: [
        'I wake up at 6:30 AM and drink coffee at 7 AM. How should I structure my sunlight exposure and caffeine cutoff?',
        'Night-shift nurse waking up at 4 PM wanting to maximize deep sleep and nocturnal alertness.',
        'I suffer from 3 AM awakenings and high evening cortisol. What is my ideal bedtime wind-down stack?',
      ],
    },
    sections: [
      {
        id: 'sec-1',
        heading: '1. The Two-Process Model of Sleep Regulation',
        content: `Human sleep quality is dictated by the precise interaction between **Process S** (Homeostatic Sleep Drive) and **Process C** (Circadian Rhythm).

* **Process S (Adenosine Accumulation):** From the moment you wake up, cellular activity accumulates a byproduct called **adenosine** in your neural tissue. As adenosine rises, you feel increasing "sleep pressure."
* **Process C (The Circadian Master Clock):** Located in the Suprachiasmatic Nucleus (SCN) of the hypothalamus, Process C dictates your 24-hour hormonal rhythms using light as its primary environmental signal (*zeitgeber*).

When Process S and Process C align seamlessly, sleep latency drops under 10 minutes and deep slow-wave sleep increases by over 20%.`,
        calloutBox: {
          type: 'protocol_step',
          title: 'The Morning Photon Protocol',
          text: 'Step 1: Go outside without sunglasses within 30 minutes of waking. Look toward the eastern sky for 10-15 minutes (cloudy days require 20 minutes). Never look directly at the sun.',
        },
      },
      {
        id: 'sec-2',
        heading: '2. Temperature Drops & Thermal Ergonomics',
        content: `In order for the brain to transition into deep stage 3 and 4 slow-wave sleep, your **core body temperature must decrease by approximately 1.5°C (2-3°F)**.

### Practical Temperature Hacks:
* **Bedroom Thermostat:** Set your bedroom temperature between 65°F–68°F (18°C–20°C).
* **Hot Shower/Sauna Before Bed:** Taking a warm bath or hot shower 90 minutes before sleep dilates blood vessels in your hands and feet (vasodilation), causing rapid heat loss from your core once you step out into cool air.
* **Late Night Meal Cutoff:** Stop eating heavy meals 3 hours before bed. Digestion generates metabolic thermogenesis, elevating core body temperature during critical early sleep cycles.`,
      },
    ],
    tags: ['Sleep', 'Circadian Rhythms', 'Adenosine', 'Biohacking', 'Recovery'],
    relatedArticleIds: ['art-apob-lipids', 'art-ring-dips-mobility'],
  },

  {
    id: 'art-ring-dips-mobility',
    slug: 'shoulder-extension-thoracic-mobility-ring-dips',
    title: 'Restoring Shoulder Extension & Scapular Stability for Heavy Ring Dips',
    subtitle: 'An evidence-backed prehab and biomechanical guide to prevent anterior shoulder impingement and build resilient joints.',
    pillar: 'FITNESS',
    categoryTag: 'Calisthenics & Injury Rehabilitation',
    author: {
      name: 'Dr. Marcus Vance, DPT',
      role: 'Doctor of Physical Therapy & Gymnastics Strength Coach',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    reviewer: {
      name: 'Elena Rostova, CSCS',
      title: 'Head Strength & Conditioning Specialist',
    },
    publishedAt: 'July 22, 2026',
    readTime: '8 min read',
    coverImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    featured: false,
    trending: true,
    executiveSummary: 'Gymnastics rings allow 3 degrees of rotational freedom, placing extreme demands on the bicipital tendon, subscapularis, and anterior glenohumeral joint capsule. Learn the 3-step thoracic extension and loaded shoulder mobility routine to eliminate joint pain.',
    keyTakeaways: [
      'Ring dips require at least 55–60 degrees of active shoulder extension combined with thoracic spine extension.',
      'Lack of thoracic mobility causes the scapula to dump forward into anterior tilt, pinching the long head of the biceps tendon.',
      'Incorporate German Hangs and Cuban Presses to build tendon stiffness and loaded flexibility.',
      'Use the embedded AI Workout & Mobility Coach below to generate a custom joint warm-up routine for your training session.',
    ],
    embeddedAiTool: {
      toolId: 'tool-coach-shoulder',
      toolName: 'Embedded AI Workout & Joint Mobility Coach',
      toolDescription: 'Select your target joint, current tightness, or movement goal (e.g., ring dips, handstand press, squat depth) to receive a custom exercise progression with video cues.',
      demoType: 'workout_mobility_coach',
      inputPlaceholder: 'e.g., Sharp front shoulder pain during bottom of dip, tight upper back',
      contextHint: 'Intermediate gymnast, 2 years lifting experience, no acute tear',
      presetQueries: [
        'Need a 10-minute warm-up for ring dips focusing on shoulder extension and scapular depression.',
        'Sharp pain in front of shoulder when lowering into deep chest dips. What prehab exercises should I do?',
        'How to progress from parallel bar dips to gymnastics ring dips without hurting my elbows or shoulders?',
      ],
    },
    sections: [
      {
        id: 'sec-1',
        heading: '1. The Biomechanics of Glenohumeral Instability on Rings',
        content: `Unlike stationary parallel bars, suspended gymnastics rings are inherently unstable. When lowering into a deep ring dip, the humerus moves into extreme **shoulder extension** while the rings attempt to drift outward into abduction.

If your thoracic spine is kyphotic (rounded upper back) and your chest is tight, your body cannot achieve true humeral extension. Instead, the shoulder blade tips forward into **anterior scapular tilt**, forcing the head of the humerus to shear forward into the anterior capsule and long head of the biceps tendon.`,
        calloutBox: {
          type: 'warning',
          title: 'Red Flag Warning Signs',
          text: 'If you experience sharp, catching pain or numbness radiating down the bicep during dip descent, stop immediately. Do not push through structural capsule pinching.',
        },
      },
      {
        id: 'sec-2',
        heading: '2. The 3-Step Prehab Protocol',
        content: `### Step 1: Loaded Thoracic Extension on Foam Roller (2 sets x 10 reps)
Place foam roller under mid-back, interlock fingers behind head, and arch upper back over roller while keeping ribs down.

### Step 2: German Hang Biceps Tendon Lengthening (3 sets x 20-30 sec hold)
Using low rings or stall bars, lower into a German hang with gentle feet support. Focus on opening chest and stretching the anterior shoulder capsule under light load.

### Step 3: Ring Turn-Out (RTO) Support Hold (3 sets x 20 sec)
At top of dip, rotate rings outward 45 degrees so palms face forward. Lock elbows completely and depress scapulae down toward hips.`,
      },
    ],
    tags: ['Calisthenics', 'Shoulder Health', 'Mobility', 'Rehab', 'Gymnastics'],
    relatedArticleIds: ['art-apob-lipids', 'art-symptom-triage-guide'],
  },

  {
    id: 'art-symptom-triage-guide',
    slug: 'symptom-triage-red-flags-doctor-questions-guide',
    title: 'How to Triage Symptoms & Prepare High-Impact Questions for Your Doctor',
    subtitle: 'A patient empowerment guide to understanding symptom urgency, avoiding cyberchondria, and getting the most out of 15-minute consultations.',
    pillar: 'MEDICAL',
    categoryTag: 'Patient Advocacy & Clinical Triage',
    author: {
      name: 'Dr. Elena Rostova, MD',
      role: 'Family Medicine & Emergency Triage Physician',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
    reviewer: {
      name: 'Dr. Sarah Lin, MD',
      title: 'Chief Medical Officer',
    },
    publishedAt: 'July 15, 2026',
    readTime: '5 min read',
    coverImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
    featured: false,
    trending: false,
    executiveSummary: 'Most physician visits are capped at 15-20 minutes. Learn how to structure your health history, categorize your symptoms into urgency tiers, and use our AI Symptom Contextualizer to draft clear, objective questions before entering the examination room.',
    keyTakeaways: [
      'Learn the 4 Triage Urgency Levels: Immediate Emergency (ER), Urgent Care (24h), Scheduled Visit (1-2 weeks), and Self-Care.',
      'Record your symptoms using the OPQRST framework: Onset, Provocation, Quality, Radiation, Severity, Time.',
      'Never rely on generic search engines that default to catastrophic rare diagnoses.',
      'Use the embedded AI Symptom & Triage Contextualizer below to organize your symptoms into a structured physician printout.',
    ],
    embeddedAiTool: {
      toolId: 'tool-symptom-triage',
      toolName: 'Embedded AI Symptom & Triage Contextualizer',
      toolDescription: 'Describe your current symptoms, onset timeline, and concerns to receive an educational urgency assessment and a 5-question checklist to take to your appointment.',
      demoType: 'symptom_contextualizer',
      inputPlaceholder: 'e.g., Dull aching pain in lower right abdomen for 24 hours, mild nausea, no fever',
      contextHint: 'Adult 42yo, no prior abdominal surgery',
      presetQueries: [
        'Dull lower right abdominal aching for 24 hours with mild loss of appetite.',
        'Sharp headache behind right eye after 10 hours of computer work and tight neck muscles.',
        'Mild knee swelling after jogging 5 miles on hard pavement with no acute pop sound.',
      ],
    },
    sections: [
      {
        id: 'sec-1',
        heading: '1. The OPQRST Method for Symptom Tracking',
        content: `When physicians evaluate symptoms, they mentalize them using a clinical acronym called **OPQRST**:

* **O - Onset:** Exactly when did it start? Was it sudden or gradual?
* **P - Provocation:** What makes it better or worse? (e.g., heat, rest, eating)
* **Q - Quality:** What does it feel like? (dull, sharp, burning, throbbing)
* **R - Radiation:** Does the pain travel anywhere else?
* **S - Severity:** Scale of 1 to 10.
* **T - Timing:** Is it constant, intermittent, or morning-only?

Preparing this data before your appointment saves 5-10 minutes of conversation, leaving more time for diagnostic planning and treatment decisions.`,
      },
    ],
    tags: ['Medical Knowledge', 'Patient Advocacy', 'Symptom Triage', 'Doctor Visit'],
    relatedArticleIds: ['art-apob-lipids', 'art-ring-dips-mobility'],
  },

  {
    id: 'art-metabolic-nutrition-glucose',
    slug: 'continuous-glucose-monitoring-metabolic-flexibility',
    title: 'Continuous Glucose Monitoring & Insulin Sensitivity: The Metabolic Energy Protocol',
    subtitle: 'Understanding postprandial glucose spikes, glycemic variability, and dietary fiber buffering for sustained energy.',
    pillar: 'LIFESTYLE',
    categoryTag: 'Metabolic Nutrition & CGM',
    author: {
      name: 'Dr. Alex Rivera, PhD',
      role: 'Metabolic Physiologist & Biohacking Researcher',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    reviewer: {
      name: 'Dr. Sarah Lin, MD',
      title: 'Chief Medical Officer',
    },
    publishedAt: 'July 10, 2026',
    readTime: '6 min read',
    coverImage: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop&q=80',
    featured: false,
    trending: false,
    executiveSummary: 'Continuous Glucose Monitors (CGMs) provide real-time insight into glycemic variability. Minimizing post-meal glucose spikes (>140 mg/dL) protects vascular endothelium and preserves mitochondrial flexibility.',
    keyTakeaways: [
      'Pair high-glycemic carbohydrates with soluble fiber and healthy fats to slow gastric emptying.',
      'A 10-minute post-meal walk accelerates GLUT4 receptor translocation independent of insulin.',
      'Avoid high-sugar meals before bed to prevent nocturnal hypoglycemia and sleep awakenings.',
    ],
    embeddedAiTool: {
      toolId: 'tool-routine-nutrition',
      toolName: 'Embedded AI Metabolic Meal Planner',
      toolDescription: 'Generate custom meal timing and macronutrient buffering protocols based on your activity schedule.',
      demoType: 'lifestyle_habit_planner',
      inputPlaceholder: 'e.g., Post-meal afternoon energy crashes after rice bowls',
      contextHint: 'Desk worker, 35yo, target stable blood glucose',
      presetQueries: [
        'How can I structure my lunch to avoid 2 PM energy slumps?',
        'Best pre-workout meal timing for steady energy during heavy lifting?',
      ],
    },
    sections: [
      {
        id: 'sec-1',
        heading: '1. Glycemic Variability vs Fasting Glucose',
        content: `While fasting blood glucose measures baseline insulin control, **glycemic variability** measures how sharply your blood sugar spikes and drops throughout the day. Rapid glucose swings promote oxidative stress and systemic inflammation.`,
      },
    ],
    tags: ['Metabolism', 'CGM', 'Nutrition', 'Insulin Sensitivity'],
    relatedArticleIds: ['art-sleep-circadian', 'art-apob-lipids'],
  },

  {
    id: 'art-vo2max-zone2-longevity',
    slug: 'zone-2-aerobic-base-vo2max-mitochondrial-longevity',
    title: 'Zone 2 Aerobic Base & VO2 Max Optimization for Mitochondrial Longevity',
    subtitle: 'Why low-intensity zone 2 cardio combined with high-intensity VO2 max intervals is the ultimate longevity prescription.',
    pillar: 'FITNESS',
    categoryTag: 'Cardiovascular Longevity & VO2 Max',
    author: {
      name: 'Dr. Marcus Vance, DPT',
      role: 'Doctor of Physical Therapy & Endurance Specialist',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    reviewer: {
      name: 'Elena Rostova, CSCS',
      title: 'Head Strength & Conditioning Specialist',
    },
    publishedAt: 'July 02, 2026',
    readTime: '7 min read',
    coverImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80',
    featured: false,
    trending: false,
    executiveSummary: 'VO2 Max is the single strongest independent predictor of all-cause mortality. Building mitochondrial density through 180+ weekly minutes of Zone 2 training creates the metabolic foundation for peak VO2 Max output.',
    keyTakeaways: [
      'Zone 2 is defined as the maximum exercise intensity where blood lactate remains under 2.0 mmol/L.',
      'VO2 Max intervals (4x4 protocol) expand stroke volume and maximal oxygen transport capacity.',
      'Train 80% of volume in Zone 2 and 20% in Zone 5 for optimal adaptations.',
    ],
    embeddedAiTool: {
      toolId: 'tool-coach-cardio',
      toolName: 'Embedded AI Zone 2 & VO2 Max Calculator',
      toolDescription: 'Calculate your target heart rate zones and weekly cardio distribution based on resting heart rate and age.',
      demoType: 'workout_mobility_coach',
      inputPlaceholder: 'e.g., Age 40, resting heart rate 62 bpm, goal to improve 5k time',
      contextHint: '40yo runner, building aerobic base',
      presetQueries: [
        'Calculate my Zone 2 target heart rate range for treadmill and cycling.',
        'How to structure a 4x4 VO2 Max interval session once per week.',
      ],
    },
    sections: [
      {
        id: 'sec-1',
        heading: '1. Mitochondrial Efficiency & Fat Oxidation',
        content: `Zone 2 exercise stimulates mitochondrial biogenesis—increasing both the size and number of mitochondria in skeletal muscle. This optimizes fat oxidation and spares glycogen during daily activity.`,
      },
    ],
    tags: ['VO2 Max', 'Zone 2', 'Longevity', 'Mitochondria', 'Fitness'],
    relatedArticleIds: ['art-ring-dips-mobility', 'art-apob-lipids'],
  },
];

