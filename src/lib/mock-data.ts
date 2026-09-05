export interface DiagnosticTest {
  id: string
  name: string
  category: "Blood" | "Thyroid" | "Diabetes" | "Cardiology" | "Vitamins" | "Liver" | "Kidney"
  sampleType: "Blood (Serum)" | "EDTA Whole Blood" | "Urine (Spot)" | "Plasma (Sodium Fluoride)" | "EDTA Whole Blood + Plasma" | string
  parameterCount: number
  tat: string
  mrp: number
  price: number
  popular?: boolean
  description: string
  fastingRequired: boolean
  fastingHours?: number
  parameters: string[]
}

export interface HealthPackage {
  id: string
  name: string
  slug: string
  tagline: string
  badge?: string
  parameterCount: number
  tat: string
  mrp: number
  price: number
  popular?: boolean
  gender: "All" | "Male" | "Female" | "Senior Citizens"
  fastingRequired: boolean
  fastingHours: number
  includes: string[]
  idealFor: string
  testsIncluded: string[]
}

export interface LabLocation {
  id: string
  name: string
  address: string
  city: string
  pincode: string
  phone: string
  timings: string
  homeCollectionAvailable: boolean
}

export interface TimeSlot {
  id: string
  time: string
  available: boolean
  fastFilling?: boolean
}

export interface CRAReferralRecord {
  id: string
  referralCode: string
  customerName: string
  mobile: string
  email: string
  relationship: "Family" | "Friend" | "Corporate Contact" | "Neighbor" | "Client"
  referredDate: string
  packageOrdered: string
  orderCount: number
  totalSpend: number
  realizedRevenue: number
  craIncentiveRate: number // 30% for C1, 10% for C2
  incentiveAmount: number
  tier: "C1 Direct" | "C2 Sub-Agency"
  subAgencyName?: string
  status: "Lead Submitted" | "Contacted" | "Slot Booked" | "Sample Collected" | "Completed" | "Cancelled"
  quarterlyRetestDue?: string
  timeline: {
    title: string
    timestamp: string
    description: string
    done: boolean
  }[]
  notes?: string
}

import { CRA_TESTS, CRATestItem } from "./cra-tests"
export { CRA_TESTS, type CRATestItem }

export const DIAGNOSTIC_TESTS: DiagnosticTest[] = CRA_TESTS.map(t => {
  return {
    id: `test-${t.code.toLowerCase()}`,
    name: t.name,
    category: t.cat,
    sampleType: `${t.sample} (${t.technology})`,
    parameterCount: 1,
    tat: t.technology === "E.C.L.I.A" ? "6 Hours" : "4-8 Hours",
    mrp: t.catalogueRate,
    price: t.realizedRevenue,
    popular: ["H6", "HBA", "TSH", "VITDC", "VITB", "CHOL", "FBS", "PPBS", "SGPT", "SCRE"].includes(t.code),
    description: `Clinical diagnostic testing via ${t.technology} analyzer. Sample: ${t.sample}. Catalogue MRP ₹${t.catalogueRate} with 20% discount (Realized Price ₹${t.realizedRevenue}).`,
    fastingRequired: ["FBS", "INSFA", "CHOL", "HCHO", "TRIG", "LDL"].includes(t.code),
    fastingHours: ["FBS", "INSFA", "CHOL", "HCHO", "TRIG", "LDL"].includes(t.code) ? 10 : undefined,
    parameters: [t.name, `${t.technology} Standard`, `Sample: ${t.sample}`]
  }
})

export const HEALTH_PACKAGES: HealthPackage[] = [
  {
    id: "pkg-fullbody",
    name: "Full Body Wellness Panel",
    slug: "full-body-wellness-panel",
    tagline: "Comprehensive basic preventive checkup covering vital organs and blood health.",
    badge: "Most Popular",
    parameterCount: 62,
    tat: "12 Hours",
    mrp: 1000,
    price: 800, // 20% discount applied
    popular: true,
    gender: "All",
    fastingRequired: true,
    fastingHours: 10,
    idealFor: "Annual routine health evaluation for adults aged 18-45.",
    includes: ["Complete Blood Count (CBC)", "Fasting Blood Sugar", "Lipid Profile Basic", "Liver Function Basic", "Kidney Function Basic", "Urine Routine"],
    testsIncluded: ["CBC (28)", "Glucose Fasting (1)", "Lipid (5)", "LFT (6)", "KFT (4)", "Urine Routine (18)"]
  },
  {
    id: "pkg-women",
    name: "Women's Wellness Profile",
    slug: "womens-wellness-profile",
    tagline: "Hormone, thyroid, bone density, and nutrition panel tailored for women's vitality.",
    badge: "Specialized",
    parameterCount: 78,
    tat: "24 Hours",
    mrp: 1200,
    price: 960,
    popular: true,
    gender: "Female",
    fastingRequired: true,
    fastingHours: 10,
    idealFor: "Women of all age groups focusing on hormonal, metabolic, and bone health.",
    includes: ["Full Hemogram", "Thyroid Profile (TSH, Free T3, Free T4)", "Vitamin D3 & Calcium", "Serum Iron & Ferritin", "HbA1c & Fasting Glucose"],
    testsIncluded: ["Hemogram", "Thyroid Panel", "Vitamin D3/Calcium", "Iron Profile", "Metabolic Profile", "Urine Routine"]
  },
  {
    id: "pkg-master",
    name: "Comprehensive Master Health Profile",
    slug: "comprehensive-master-health-profile",
    tagline: "Our flagship diagnostic package covering vital organs, vitamins, and metabolic markers.",
    badge: "Flagship",
    parameterCount: 85,
    tat: "24 Hours",
    mrp: 3000,
    price: 2400,
    popular: true,
    gender: "All",
    fastingRequired: true,
    fastingHours: 12,
    idealFor: "Full-body preventive analysis recommended annually for adults aged 25+.",
    includes: [
      "Complete Hemogram with ESR (28 params)",
      "Comprehensive Lipid Profile (8 params)",
      "Liver Function Test - LFT (11 params)",
      "Kidney Function Test - KFT (8 params)",
      "Thyroid Profile Total T3, T4, TSH (3 params)",
      "HbA1c & Fasting Blood Sugar (3 params)",
      "Vitamin D3 & Vitamin B12 Levels (2 params)",
      "Serum Iron & Ferritin Profile (4 params)",
      "Complete Urine Examination (18 params)"
    ],
    testsIncluded: ["CBC", "Lipid Profile", "Liver Function", "Kidney Function", "Thyroid Profile", "HbA1c", "Vitamin D & B12", "Iron Studies", "Urine Microscopy"]
  },
  {
    id: "pkg-senior",
    name: "Senior Citizen Wellness Panel",
    slug: "senior-citizen-wellness-panel",
    tagline: "Tailored for senior vitality, bone mineral density, arthritis markers, and cardiac risk.",
    parameterCount: 92,
    tat: "24 Hours",
    mrp: 1400,
    price: 1120,
    popular: false,
    gender: "Senior Citizens",
    fastingRequired: true,
    fastingHours: 12,
    idealFor: "Seniors aged 55+ with focus on arthritis, cardiac, kidney, and bone health.",
    includes: ["All Master Health Inclusions", "hs-CRP (Cardiac Risk)", "Serum Calcium & Phosphorus", "Rheumatoid Factor", "Serum Uric Acid"],
    testsIncluded: ["Master Health (85)", "hs-CRP", "Bone Minerals", "RA Factor", "Uric Acid"]
  },
  {
    id: "pkg-diabetes",
    name: "Diabetes Screening & Care Panel",
    slug: "diabetes-screening-care",
    tagline: "HbA1c, average estimated glucose, and organ screening for diabetic management.",
    parameterCount: 45,
    tat: "8 Hours",
    mrp: 600,
    price: 480,
    popular: true,
    gender: "All",
    fastingRequired: true,
    fastingHours: 10,
    idealFor: "Individuals managing diabetes or with family history of diabetes.",
    includes: ["HbA1c Glycated Hemoglobin", "Average Blood Glucose", "Fasting Plasma Glucose", "Microalbuminuria Urine", "Serum Creatinine"],
    testsIncluded: ["HbA1c", "Fasting Blood Sugar", "Serum Creatinine", "Urine Albumin"]
  },
  {
    id: "pkg-heart",
    name: "Executive Heart & Cardiac Risk Profile",
    slug: "executive-heart-cardiac-risk",
    tagline: "Advanced lipid subfractions, Apolipoproteins, and inflammatory cardiac risk markers.",
    parameterCount: 58,
    tat: "24 Hours",
    mrp: 1500,
    price: 1200,
    popular: false,
    gender: "All",
    fastingRequired: true,
    fastingHours: 12,
    idealFor: "Executives and individuals with sedentary lifestyles or cardiac risk.",
    includes: ["Lipid Profile Extended", "hs-CRP", "Homocysteine", "Apolipoprotein A1 & B", "Liver & Kidney Screen"],
    testsIncluded: ["Extended Lipid", "hs-CRP", "Homocysteine", "Apo-B/A1 Ratio"]
  },
  {
    id: "pkg-thyroid",
    name: "Thyroid Complete Profile (T3, T4, TSH, Anti-TPO)",
    slug: "thyroid-complete-profile",
    tagline: "Evaluation of thyroid gland activity, hypothyroidism, and autoimmune Hashimoto markers.",
    parameterCount: 4,
    tat: "6 Hours",
    mrp: 500,
    price: 400,
    popular: false,
    gender: "All",
    fastingRequired: false,
    fastingHours: 0,
    idealFor: "Fatigue, unexplained weight changes, hair loss, and thyroid regulation.",
    includes: ["Total T3 (Triiodothyronine)", "Total T4 (Thyroxine)", "Ultrasensitive TSH (Thyroid Stimulating Hormone)"],
    testsIncluded: ["T3", "T4", "TSH"]
  },
  {
    id: "pkg-vitamins",
    name: "Vitamin Vitality Duo (D3 + B12)",
    slug: "vitamin-vitality-duo",
    tagline: "Essential energy and bone health vitamins critical for Indian dietary profiles.",
    parameterCount: 2,
    tat: "12 Hours",
    mrp: 1000,
    price: 800,
    popular: true,
    gender: "All",
    fastingRequired: false,
    fastingHours: 0,
    idealFor: "Fatigue, bone aches, neurological numbness, and vegetarian diets.",
    includes: ["Vitamin D Total (25-OH)", "Vitamin B12 (Cyanocobalamin)"],
    testsIncluded: ["Vitamin D3", "Vitamin B12"]
  },
  {
    id: "pkg-liver",
    name: "Liver Function & Detox Profile",
    slug: "liver-function-detox",
    tagline: "Enzyme evaluation for fatty liver, bilirubin balance, and protein synthesis.",
    parameterCount: 11,
    tat: "8 Hours",
    mrp: 600,
    price: 480,
    popular: false,
    gender: "All",
    fastingRequired: true,
    fastingHours: 8,
    idealFor: "Alcohol consumers, medication users, and digestive evaluations.",
    includes: ["SGOT / AST", "SGPT / ALT", "Total Bilirubin", "Direct & Indirect Bilirubin", "Alkaline Phosphatase", "Total Protein & Albumin"],
    testsIncluded: ["LFT (11)"]
  },
  {
    id: "pkg-kidney",
    name: "Renal Function & Electrolytes (KFT)",
    slug: "renal-function-electrolytes",
    tagline: "Filtration rate, serum creatinine, BUN, and vital electrolytes.",
    parameterCount: 8,
    tat: "8 Hours",
    mrp: 600,
    price: 480,
    popular: false,
    gender: "All",
    fastingRequired: true,
    fastingHours: 8,
    idealFor: "Hypertensive patients, hydration balance, and renal health.",
    includes: ["Serum Creatinine", "Blood Urea Nitrogen (BUN)", "Uric Acid", "Electrolytes (Sodium, Potassium, Chloride)"],
    testsIncluded: ["KFT (8)"]
  },
  {
    id: "pkg-fever",
    name: "Seasonal Fever & Infection Panel",
    slug: "seasonal-fever-infection",
    tagline: "Rapid differential diagnosis for viral fever, Dengue NS1, Typhoid, and Malaria.",
    parameterCount: 32,
    tat: "4 Hours",
    mrp: 800,
    price: 640,
    popular: false,
    gender: "All",
    fastingRequired: false,
    fastingHours: 0,
    idealFor: "Acute fever symptoms, chills, low platelets, and monsoon ailments.",
    includes: ["Complete Hemogram (CBC + Platelets)", "Dengue NS1 Antigen", "Typhoid Widal", "Malarial Antigen", "Urine Routine"],
    testsIncluded: ["CBC", "Dengue NS1", "Widal", "Malarial", "Urine"]
  },
  {
    id: "pkg-pre-employment",
    name: "Pre-Employment & Executive Health Check",
    slug: "pre-employment-executive-health",
    tagline: "Standard corporate joiner and annual medical fitness certification profile.",
    parameterCount: 52,
    tat: "12 Hours",
    mrp: 1200,
    price: 960,
    popular: false,
    gender: "All",
    fastingRequired: true,
    fastingHours: 10,
    idealFor: "Corporate joiners, fitness certification, and occupational health.",
    includes: ["Complete Blood Count", "Blood Glucose", "Blood Grouping & Rh Factor", "Lipid Screen", "Liver & Kidney Screen", "Urine Examination"],
    testsIncluded: ["CBC", "Blood Group", "Glucose", "Lipid", "LFT", "KFT", "Urine"]
  }
]

export const LAB_LOCATIONS: LabLocation[] = [
  {
    id: "loc-1",
    name: "AVMLabs Central Hub — Indiranagar",
    address: "100 Feet Road, HAL 2nd Stage, Indiranagar",
    city: "Bengaluru, Karnataka",
    pincode: "560038",
    phone: "+91 80 4912 8800",
    timings: "06:30 AM – 09:00 PM (All 7 Days)",
    homeCollectionAvailable: true
  },
  {
    id: "loc-2",
    name: "AVMLabs Center — Koramangala",
    address: "80 Feet Rd, 4th Block, Koramangala",
    city: "Bengaluru, Karnataka",
    pincode: "560034",
    phone: "+91 80 4912 8801",
    timings: "06:30 AM – 08:30 PM",
    homeCollectionAvailable: true
  },
  {
    id: "loc-3",
    name: "AVMLabs Center — Jayanagar",
    address: "9th Main, 4th Block, Jayanagar",
    city: "Bengaluru, Karnataka",
    pincode: "560011",
    phone: "+91 80 4912 8802",
    timings: "07:00 AM – 08:30 PM",
    homeCollectionAvailable: true
  },
  {
    id: "loc-4",
    name: "AVMLabs Diagnostic Centre — Whitefield",
    address: "ITPL Main Road, Prestige Ozone, Whitefield",
    city: "Bengaluru, Karnataka",
    pincode: "560066",
    phone: "+91 80 4912 8803",
    timings: "06:30 AM – 09:00 PM",
    homeCollectionAvailable: true
  }
]

export const AVAILABLE_TIME_SLOTS: TimeSlot[] = [
  { id: "slot-1", time: "06:30 AM – 07:30 AM", available: true, fastFilling: true },
  { id: "slot-2", time: "07:30 AM – 08:30 AM", available: true },
  { id: "slot-3", time: "08:30 AM – 09:30 AM", available: true, fastFilling: true },
  { id: "slot-4", time: "09:30 AM – 10:30 AM", available: true },
  { id: "slot-5", time: "10:30 AM – 11:30 AM", available: false }, // disabled slot
  { id: "slot-6", time: "11:30 AM – 12:30 PM", available: true },
  { id: "slot-7", time: "03:00 PM – 04:00 PM", available: true },
  { id: "slot-8", time: "05:00 PM – 06:00 PM", available: false } // disabled slot
]

export const MOCK_CRA_REFERRALS: CRAReferralRecord[] = [
  {
    id: "REF-1091",
    referralCode: "AVM-RAJ-789",
    customerName: "Sunil Sharma",
    mobile: "+91 98450 12345",
    email: "sunil.sharma@example.com",
    relationship: "Corporate Contact",
    referredDate: "2026-08-18",
    packageOrdered: "Comprehensive Master Health Profile",
    orderCount: 2,
    totalSpend: 4800,
    realizedRevenue: 4800,
    craIncentiveRate: 0.30,
    incentiveAmount: 1440,
    tier: "C1 Direct",
    status: "Completed",
    quarterlyRetestDue: "2026-11-18",
    notes: "Executive VP at Tech Corp. Scheduled annual full-body checkup for self and spouse.",
    timeline: [
      { title: "Lead Submitted", timestamp: "18 Aug 2026, 10:15 AM", description: "Lead logged via CRA Portal by Rajesh J.", done: true },
      { title: "AVMLabs Team Contacted", timestamp: "18 Aug 2026, 11:30 AM", description: "Counselor explained fasting guidelines & confirmed package.", done: true },
      { title: "Slot Booked & Home Collection", timestamp: "19 Aug 2026, 07:00 AM", description: "Trained phlebotomist collected blood & urine samples at home.", done: true },
      { title: "Lab Processing & Quality Check", timestamp: "19 Aug 2026, 04:00 PM", description: "Barcoded samples analyzed on Roche & Beckman automated analyzers.", done: true },
      { title: "Report Released & Incentive Credited", timestamp: "19 Aug 2026, 08:30 PM", description: "Digital report sent to patient. ₹1,440 credited to CRA Wallet.", done: true }
    ]
  },
  {
    id: "REF-1092",
    referralCode: "AVM-RAJ-789",
    customerName: "Meera Patel",
    mobile: "+91 98860 98765",
    email: "meera.patel@example.com",
    relationship: "Neighbor",
    referredDate: "2026-08-22",
    packageOrdered: "Women Advanced Wellness & Hormone Care",
    orderCount: 1,
    totalSpend: 2599,
    realizedRevenue: 2599,
    craIncentiveRate: 0.30,
    incentiveAmount: 779.7,
    tier: "C1 Direct",
    status: "Slot Booked",
    quarterlyRetestDue: "2026-11-22",
    notes: "Looking for hormonal and thyroid routine test.",
    timeline: [
      { title: "Lead Submitted", timestamp: "22 Aug 2026, 03:20 PM", description: "Lead created via CRA Portal.", done: true },
      { title: "Counseling Completed", timestamp: "22 Aug 2026, 04:45 PM", description: "Confirmed Women Wellness package.", done: true },
      { title: "Slot Booked", timestamp: "28 Aug 2026, 08:00 AM", description: "Home collection booked for Indiranagar.", done: true },
      { title: "Sample Collection", timestamp: "Upcoming", description: "Phlebotomist assigned: Ravi Kumar.", done: false },
      { title: "Report & Incentive", timestamp: "Pending", description: "Incentive ₹780 will be unlocked upon sample processing.", done: false }
    ]
  },
  {
    id: "REF-1093",
    referralCode: "AVM-RAJ-C2-01",
    customerName: "Dr. Arvind Hegde",
    mobile: "+91 97400 45678",
    email: "arvind.hegde@example.com",
    relationship: "Client",
    referredDate: "2026-08-24",
    packageOrdered: "Senior Citizen Special Care Package",
    orderCount: 1,
    totalSpend: 2999,
    realizedRevenue: 2999,
    craIncentiveRate: 0.10,
    incentiveAmount: 299.9,
    tier: "C2 Sub-Agency",
    subAgencyName: "Rohan Associates (C2)",
    status: "Sample Collected",
    quarterlyRetestDue: "2026-11-24",
    notes: "Referred through Rohan Associates. C1 gets 10% sub-agency override.",
    timeline: [
      { title: "Sub-Agency Referral Logged", timestamp: "24 Aug 2026, 09:10 AM", description: "Submitted by Rohan Associates (C2).", done: true },
      { title: "Slot Booked", timestamp: "25 Aug 2026, 11:00 AM", description: "Home collection confirmed.", done: true },
      { title: "Sample Collected", timestamp: "26 Aug 2026, 07:45 AM", description: "Sample received at Central Indiranagar Lab.", done: true },
      { title: "Report & 10% Override Payout", timestamp: "In Process", description: "₹300 passive incentive to C1 upon report sign-off.", done: false }
    ]
  },
  {
    id: "REF-1094",
    referralCode: "AVM-RAJ-789",
    customerName: "Kavita Ranganathan",
    mobile: "+91 99001 54321",
    email: "kavita.r@example.com",
    relationship: "Family",
    referredDate: "2026-08-25",
    packageOrdered: "Basic Wellness Checkup",
    orderCount: 1,
    totalSpend: 999,
    realizedRevenue: 999,
    craIncentiveRate: 0.30,
    incentiveAmount: 299.7,
    tier: "C1 Direct",
    status: "Completed",
    quarterlyRetestDue: "2026-11-25",
    notes: "Routine quarterly HbA1c & CBC screening.",
    timeline: [
      { title: "Lead Submitted", timestamp: "25 Aug 2026, 08:30 AM", description: "Direct referral by Rajesh J.", done: true },
      { title: "Visit Center Completed", timestamp: "25 Aug 2026, 10:15 AM", description: "Visited Jayanagar Center.", done: true },
      { title: "Report Released", timestamp: "25 Aug 2026, 06:00 PM", description: "All 45 parameters within normal biological limits.", done: true },
      { title: "Incentive Paid", timestamp: "25 Aug 2026, 07:00 PM", description: "₹300 credited to account.", done: true }
    ]
  },
  {
    id: "REF-1095",
    referralCode: "AVM-RAJ-789",
    customerName: "Vikram Sengupta",
    mobile: "+91 98455 67890",
    email: "vikram.s@example.com",
    relationship: "Friend",
    referredDate: "2026-08-26",
    packageOrdered: "Comprehensive Master Health Profile",
    orderCount: 0,
    totalSpend: 0,
    realizedRevenue: 0,
    craIncentiveRate: 0.30,
    incentiveAmount: 0,
    tier: "C1 Direct",
    status: "Lead Submitted",
    notes: "Requested weekend morning home collection for 3 family members.",
    timeline: [
      { title: "Lead Submitted", timestamp: "26 Aug 2026, 06:15 PM", description: "Lead queued for AVMLabs outreach desk.", done: true },
      { title: "Outreach in Progress", timestamp: "Pending", description: "Scheduled call on Aug 28.", done: false }
    ]
  }
]

export const MOCK_MONTHLY_PERFORMANCE = [
  { month: "Apr 2026", referrals: 14, rr: 32000, c1Incentive: 9600, c2Override: 1200 },
  { month: "May 2026", referrals: 19, rr: 45600, c1Incentive: 13680, c2Override: 1800 },
  { month: "Jun 2026", referrals: 24, rr: 58400, c1Incentive: 17520, c2Override: 2400 },
  { month: "Jul 2026", referrals: 31, rr: 74200, c1Incentive: 22260, c2Override: 3100 },
  { month: "Aug 2026", referrals: 42, rr: 84000, c1Incentive: 25200, c2Override: 4200 }
]
