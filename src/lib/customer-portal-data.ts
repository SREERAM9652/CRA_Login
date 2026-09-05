export interface LabTestParameter {
  name: string
  value: string
  unit: string
  refRange: string
  flag: "Normal" | "Optimal" | "High" | "Low" | "Critical"
  department?: string
}

export interface CustomerLabReport {
  id: string
  orderNumber: string
  patientName: string
  patientRelation: "Self" | "Wife" | "Father" | "Mother" | "Son" | "Daughter"
  patientAge: number
  patientGender: "Male" | "Female" | "Other"
  testTitle: string
  category: "Full Body" | "Biochemistry" | "Hematology" | "Thyroid & Hormones" | "Cardiology" | "Diabetes" | "Vitamins"
  date: string // YYYY-MM-DD for reliable sorting & filtering
  formattedDate: string
  status: "Verified & Ready" | "Abnormal Flag" | "Under Pathologist Review"
  labDoctor: string
  doctorRegNo: string
  fileSize: string
  summaryNotes: string
  parameters: LabTestParameter[]
  hasAbnormalFlag: boolean
}

export interface PhlebotomistInfo {
  name: string
  phone: string
  rating: number
  ridesCompleted: number
  vaccinationStatus: string
  eta: string
  collectionOtp: string
  avatarUrl?: string
}

export interface SpecimenTube {
  tube: string
  capColor: string
  type: string
  barcode: string
  status: "Collected" | "In Centrifuge" | "Analyzing" | "Verified"
}

export interface TestProgressionItem {
  testName: string
  department: string
  status: "Queued" | "In Analysis" | "Verified by Pathologist"
  resultNote?: string
}

export interface OrderTestingDetail {
  sampleBarcode: string
  tubesCollected: SpecimenTube[]
  temperatureCelsius: number
  coldChainCompliant: boolean
  labCenter: string
  receivedAtLab: string
  technicianName: string
  pathologistReviewer: string
  estimatedTat: string
  testsProgression: TestProgressionItem[]
}

export interface CustomerPortalOrder {
  id: string
  orderNumber: string
  patientName: string
  patientRelation: "Self" | "Wife" | "Father" | "Mother" | "Son" | "Daughter"
  patientAge: number
  patientGender: "Male" | "Female" | "Other"
  patientPhone: string
  bookingDate: string
  formattedBookingDate: string
  appointmentSlot: string
  collectionType: "Home Collection" | "AVMLabs Center Walk-in"
  collectionAddress: string
  profileName: string
  testCount: number
  testsList: string[]
  mrp: number
  discount: number
  collectionFee: number
  totalPayable: number
  paymentMethod: string
  paymentStatus: "Paid Online" | "Pay on Collection" | "Payment Pending"
  status: "Order Confirmed" | "Phlebotomist Assigned" | "Sample Collected" | "In Lab Analysis" | "Report Released" | "Cancelled"
  currentStep: number // 1 to 5
  estimatedReportTime: string
  phlebotomist?: PhlebotomistInfo
  testingDetail?: OrderTestingDetail
  reportId?: string
}

export const MOCK_CUSTOMER_REPORTS: CustomerLabReport[] = [
  {
    id: "AVM-REP-9041",
    orderNumber: "AVM-ORD-8821",
    patientName: "Suresh M.",
    patientRelation: "Self",
    patientAge: 42,
    patientGender: "Male",
    testTitle: "Comprehensive Master Health Profile (85 Parameters)",
    category: "Full Body",
    date: "2026-08-28",
    formattedDate: "28 Aug 2026",
    status: "Verified & Ready",
    labDoctor: "Dr. K. S. Reddy, MD (Pathology)",
    doctorRegNo: "KMC-48291",
    fileSize: "1.9 MB",
    hasAbnormalFlag: false,
    summaryNotes: "All vital hepatic, renal, lipid and blood counts are within normal reference ranges. Fasting glucose is optimal.",
    parameters: [
      { name: "Fasting Blood Sugar (FBS)", value: "92", unit: "mg/dL", refRange: "70 - 99", flag: "Optimal", department: "Biochemistry" },
      { name: "HbA1c (Glycated Hemoglobin)", value: "5.3", unit: "%", refRange: "< 5.7", flag: "Normal", department: "Biochemistry" },
      { name: "Estimated Average Glucose (eAG)", value: "105", unit: "mg/dL", refRange: "90 - 120", flag: "Normal", department: "Biochemistry" },
      { name: "Total Cholesterol", value: "178", unit: "mg/dL", refRange: "< 200", flag: "Normal", department: "Lipid Profile" },
      { name: "HDL Good Cholesterol", value: "54", unit: "mg/dL", refRange: "> 40", flag: "Optimal", department: "Lipid Profile" },
      { name: "LDL Bad Cholesterol", value: "104", unit: "mg/dL", refRange: "< 100", flag: "Normal", department: "Lipid Profile" },
      { name: "Triglycerides", value: "135", unit: "mg/dL", refRange: "< 150", flag: "Normal", department: "Lipid Profile" },
      { name: "Hemoglobin (Hb)", value: "14.8", unit: "g/dL", refRange: "13.0 - 17.0", flag: "Normal", department: "Hematology" },
      { name: "Total Leukocyte Count (WBC)", value: "6,800", unit: "/cumm", refRange: "4,000 - 10,000", flag: "Normal", department: "Hematology" },
      { name: "Platelet Count", value: "2.4", unit: "Lakhs/cumm", refRange: "1.5 - 4.5", flag: "Normal", department: "Hematology" },
      { name: "Serum Creatinine", value: "0.92", unit: "mg/dL", refRange: "0.7 - 1.2", flag: "Normal", department: "Renal Profile" },
      { name: "Blood Urea Nitrogen (BUN)", value: "14", unit: "mg/dL", refRange: "7 - 20", flag: "Normal", department: "Renal Profile" },
      { name: "SGPT / ALT (Liver Enzyme)", value: "28", unit: "U/L", refRange: "< 45", flag: "Normal", department: "Liver Profile" },
      { name: "SGOT / AST", value: "24", unit: "U/L", refRange: "< 40", flag: "Normal", department: "Liver Profile" }
    ]
  },
  {
    id: "AVM-REP-8912",
    orderNumber: "AVM-ORD-8710",
    patientName: "Ramesh M.",
    patientRelation: "Father",
    patientAge: 68,
    patientGender: "Male",
    testTitle: "Senior Citizen Cardiac & Diabetic Risk Panel",
    category: "Cardiology",
    date: "2026-08-15",
    formattedDate: "15 Aug 2026",
    status: "Abnormal Flag",
    labDoctor: "Dr. Ananya Sharma, MD (Biochemistry)",
    doctorRegNo: "KMC-61022",
    fileSize: "2.4 MB",
    hasAbnormalFlag: true,
    summaryNotes: "Slightly elevated Serum Uric Acid and borderline LDL Cholesterol noted. Physician consultation advised for dietary adjustments.",
    parameters: [
      { name: "Serum Uric Acid", value: "7.8", unit: "mg/dL", refRange: "3.5 - 7.2", flag: "High", department: "Biochemistry" },
      { name: "LDL Cholesterol", value: "138", unit: "mg/dL", refRange: "< 100", flag: "High", department: "Lipid Profile" },
      { name: "Total Cholesterol", value: "215", unit: "mg/dL", refRange: "< 200", flag: "High", department: "Lipid Profile" },
      { name: "Fasting Blood Sugar", value: "118", unit: "mg/dL", refRange: "70 - 99", flag: "High", department: "Diabetes" },
      { name: "HbA1c", value: "6.1", unit: "%", refRange: "< 5.7", flag: "High", department: "Diabetes" },
      { name: "Serum Creatinine", value: "1.1", unit: "mg/dL", refRange: "0.7 - 1.2", flag: "Normal", department: "Renal Profile" },
      { name: "High-Sensitivity CRP (hs-CRP)", value: "1.8", unit: "mg/L", refRange: "< 3.0", flag: "Normal", department: "Cardiology" }
    ]
  },
  {
    id: "AVM-REP-8650",
    orderNumber: "AVM-ORD-8422",
    patientName: "Priya S.",
    patientRelation: "Wife",
    patientAge: 38,
    patientGender: "Female",
    testTitle: "Thyroid & Hormone Complete Profile",
    category: "Thyroid & Hormones",
    date: "2026-07-22",
    formattedDate: "22 Jul 2026",
    status: "Verified & Ready",
    labDoctor: "Dr. K. S. Reddy, MD (Pathology)",
    doctorRegNo: "KMC-48291",
    fileSize: "1.4 MB",
    hasAbnormalFlag: false,
    summaryNotes: "Euthyroid state confirmed. TSH, Free T3 and Free T4 are balanced within optimal clinical ranges.",
    parameters: [
      { name: "TSH (Thyroid Stimulating Hormone)", value: "2.15", unit: "µIU/mL", refRange: "0.45 - 4.50", flag: "Optimal", department: "Endocrinology" },
      { name: "Free T3 (Triiodothyronine)", value: "3.2", unit: "pg/mL", refRange: "2.0 - 4.4", flag: "Normal", department: "Endocrinology" },
      { name: "Free T4 (Thyroxine)", value: "1.28", unit: "ng/dL", refRange: "0.8 - 1.8", flag: "Normal", department: "Endocrinology" },
      { name: "Anti-TPO Antibodies", value: "12", unit: "IU/mL", refRange: "< 34", flag: "Normal", department: "Immunology" }
    ]
  },
  {
    id: "AVM-REP-8410",
    orderNumber: "AVM-ORD-8119",
    patientName: "Lakshmi M.",
    patientRelation: "Mother",
    patientAge: 64,
    patientGender: "Female",
    testTitle: "Vitamin D3 (25-OH) & Vitamin B12 Duo",
    category: "Vitamins",
    date: "2026-06-10",
    formattedDate: "10 Jun 2026",
    status: "Abnormal Flag",
    labDoctor: "Dr. Ananya Sharma, MD (Biochemistry)",
    doctorRegNo: "KMC-61022",
    fileSize: "1.2 MB",
    hasAbnormalFlag: true,
    summaryNotes: "Severe Vitamin D deficiency detected (16.2 ng/mL). Vitamin B12 is at the lower boundary of normal. Weekly supplementation suggested.",
    parameters: [
      { name: "25-Hydroxy Vitamin D", value: "16.2", unit: "ng/mL", refRange: "30.0 - 100.0", flag: "Low", department: "Special Chemistry" },
      { name: "Vitamin B12 (Cyanocobalamin)", value: "218", unit: "pg/mL", refRange: "211 - 911", flag: "Normal", department: "Special Chemistry" },
      { name: "Serum Calcium", value: "9.1", unit: "mg/dL", refRange: "8.5 - 10.2", flag: "Normal", department: "Biochemistry" }
    ]
  },
  {
    id: "AVM-REP-8102",
    orderNumber: "AVM-ORD-7744",
    patientName: "Suresh M.",
    patientRelation: "Self",
    patientAge: 42,
    patientGender: "Male",
    testTitle: "Complete Blood Count (CBC) with ESR & Platelet Indices",
    category: "Hematology",
    date: "2026-05-18",
    formattedDate: "18 May 2026",
    status: "Verified & Ready",
    labDoctor: "Dr. K. S. Reddy, MD (Pathology)",
    doctorRegNo: "KMC-48291",
    fileSize: "1.5 MB",
    hasAbnormalFlag: false,
    summaryNotes: "CBC indices demonstrate normal erythropoiesis and healthy immune differential counts.",
    parameters: [
      { name: "Hemoglobin", value: "15.1", unit: "g/dL", refRange: "13.0 - 17.0", flag: "Normal", department: "Hematology" },
      { name: "RBC Count", value: "5.1", unit: "mill/cumm", refRange: "4.5 - 5.9", flag: "Normal", department: "Hematology" },
      { name: "PCV / Hematocrit", value: "45.2", unit: "%", refRange: "40.0 - 50.0", flag: "Normal", department: "Hematology" },
      { name: "WBC Count", value: "7,100", unit: "/cumm", refRange: "4,000 - 10,000", flag: "Normal", department: "Hematology" },
      { name: "Neutrophils", value: "62", unit: "%", refRange: "40 - 75", flag: "Normal", department: "Hematology" },
      { name: "Lymphocytes", value: "30", unit: "%", refRange: "20 - 45", flag: "Normal", department: "Hematology" },
      { name: "ESR (Erythrocyte Sed. Rate)", value: "8", unit: "mm/hr", refRange: "0 - 15", flag: "Normal", department: "Hematology" }
    ]
  },
  {
    id: "AVM-REP-7890",
    orderNumber: "AVM-ORD-7401",
    patientName: "Priya S.",
    patientRelation: "Wife",
    patientAge: 38,
    patientGender: "Female",
    testTitle: "Executive Women's Annual Wellness Profile",
    category: "Full Body",
    date: "2026-02-14",
    formattedDate: "14 Feb 2026",
    status: "Verified & Ready",
    labDoctor: "Dr. K. S. Reddy, MD (Pathology)",
    doctorRegNo: "KMC-48291",
    fileSize: "2.1 MB",
    hasAbnormalFlag: false,
    summaryNotes: "Normal health parameters across lipid, renal, liver and iron profile panels.",
    parameters: [
      { name: "Serum Ferritin (Iron Stores)", value: "48", unit: "ng/mL", refRange: "13 - 150", flag: "Optimal", department: "Biochemistry" },
      { name: "Serum Iron", value: "88", unit: "µg/dL", refRange: "60 - 170", flag: "Normal", department: "Biochemistry" },
      { name: "Hemoglobin", value: "13.4", unit: "g/dL", refRange: "12.0 - 15.0", flag: "Normal", department: "Hematology" },
      { name: "Fasting Blood Sugar", value: "88", unit: "mg/dL", refRange: "70 - 99", flag: "Optimal", department: "Biochemistry" }
    ]
  }
]

export const MOCK_CUSTOMER_ORDERS: CustomerPortalOrder[] = [
  {
    id: "ORD-9952",
    orderNumber: "AVM-ORD-9952",
    patientName: "Suresh M.",
    patientRelation: "Self",
    patientAge: 42,
    patientGender: "Male",
    patientPhone: "+91 98450 12345",
    bookingDate: "2026-09-05",
    formattedBookingDate: "05 Sep 2026 (Today)",
    appointmentSlot: "Today, 07:30 AM - 08:30 AM (Fasting)",
    collectionType: "Home Collection",
    collectionAddress: "#42, 12th Cross, HAL 2nd Stage, Indiranagar, Bengaluru - 560038",
    profileName: "Full Body Executive Wellness Panel (62 Parameters)",
    testCount: 62,
    testsList: [
      "Complete Blood Count (CBC 24 Params)",
      "Lipid Profile (9 Params)",
      "Liver Function Test (LFT 11 Params)",
      "Kidney Function Test (KFT 8 Params)",
      "Fasting Blood Sugar & HbA1c",
      "Thyroid Stimulating Hormone (TSH)"
    ],
    mrp: 1000,
    discount: 200,
    collectionFee: 0,
    totalPayable: 800,
    paymentMethod: "UPI (Google Pay)",
    paymentStatus: "Paid Online",
    status: "In Lab Analysis",
    currentStep: 4,
    estimatedReportTime: "Today by 06:30 PM",
    phlebotomist: {
      name: "Raju Kumar",
      phone: "+91 98860 34120",
      rating: 4.9,
      ridesCompleted: 1420,
      vaccinationStatus: "Double Vaccinated & Certified",
      eta: "Samples Delivered to Central Lab",
      collectionOtp: "4921"
    },
    testingDetail: {
      sampleBarcode: "AVM-BC-8910492",
      temperatureCelsius: 4.6,
      coldChainCompliant: true,
      labCenter: "AVMLabs Central Clinical Reference Lab, Indiranagar",
      receivedAtLab: "Today at 09:15 AM",
      technicianName: "Mohan Lal, Senior Lab Analyst",
      pathologistReviewer: "Dr. K. S. Reddy, MD (Pathology)",
      estimatedTat: "3 Hours Remaining",
      tubesCollected: [
        { tube: "EDTA Purple Cap (Whole Blood)", capColor: "bg-purple-600", type: "CBC & HbA1c", barcode: "BC-EDTA-991", status: "Analyzing" },
        { tube: "SST Gold Cap Gel Separator", capColor: "bg-amber-500", type: "Lipid, Liver, Kidney Panels", barcode: "BC-SST-992", status: "Analyzing" },
        { tube: "Grey Cap Sodium Fluoride", capColor: "bg-slate-400", type: "Fasting Blood Sugar", barcode: "BC-GLU-993", status: "Verified" }
      ],
      testsProgression: [
        { testName: "Fasting Blood Sugar (Glucose)", department: "Biochemistry", status: "Verified by Pathologist", resultNote: "92 mg/dL" },
        { testName: "Complete Blood Count (CBC)", department: "Hematology", status: "In Analysis", resultNote: "Cell counter scan completed" },
        { testName: "Lipid & Cholesterol Profile", department: "Biochemistry", status: "In Analysis", resultNote: "Assay run ongoing" },
        { testName: "Liver Function Test (LFT)", department: "Biochemistry", status: "In Analysis", resultNote: "Calibrating photometric run" },
        { testName: "Kidney Function Test (KFT)", department: "Biochemistry", status: "Queued", resultNote: "Batched for run 3" },
        { testName: "HbA1c Glycated Hemoglobin", department: "HPLC Special", status: "Queued", resultNote: "HPLC column queued" }
      ]
    }
  },
  {
    id: "ORD-9910",
    orderNumber: "AVM-ORD-9910",
    patientName: "Priya S.",
    patientRelation: "Wife",
    patientAge: 38,
    patientGender: "Female",
    patientPhone: "+91 98450 12345",
    bookingDate: "2026-09-06",
    formattedBookingDate: "Tomorrow, 06 Sep 2026",
    appointmentSlot: "Tomorrow, 08:00 AM - 09:00 AM",
    collectionType: "Home Collection",
    collectionAddress: "#42, 12th Cross, HAL 2nd Stage, Indiranagar, Bengaluru - 560038",
    profileName: "Women's Wellness Hormone & Bone Profile",
    testCount: 45,
    testsList: [
      "Thyroid Profile Total (T3, T4, TSH)",
      "Vitamin D3 & Vitamin B12",
      "Serum Calcium & Phosphorus",
      "Complete Hemogram (CBC)"
    ],
    mrp: 1200,
    discount: 240,
    collectionFee: 0,
    totalPayable: 960,
    paymentMethod: "Pay on Collection (Cash/UPI)",
    paymentStatus: "Pay on Collection",
    status: "Phlebotomist Assigned",
    currentStep: 2,
    estimatedReportTime: "Tomorrow by 07:00 PM",
    phlebotomist: {
      name: "Sandeep Varma",
      phone: "+91 97410 88231",
      rating: 4.8,
      ridesCompleted: 980,
      vaccinationStatus: "Certified Medical Phlebotomist",
      eta: "Arriving tomorrow at 08:00 AM",
      collectionOtp: "7820"
    }
  },
  {
    id: "ORD-8821",
    orderNumber: "AVM-ORD-8821",
    patientName: "Suresh M.",
    patientRelation: "Self",
    patientAge: 42,
    patientGender: "Male",
    patientPhone: "+91 98450 12345",
    bookingDate: "2026-08-28",
    formattedBookingDate: "28 Aug 2026",
    appointmentSlot: "28 Aug 2026, 07:00 AM - 08:00 AM",
    collectionType: "Home Collection",
    collectionAddress: "#42, 12th Cross, HAL 2nd Stage, Indiranagar, Bengaluru - 560038",
    profileName: "Comprehensive Master Health Profile (85 Parameters)",
    testCount: 85,
    testsList: [
      "Master Health Checkup (85 Parameters)",
      "Full Body Lipid & Heart Screening",
      "Renal & Hepatic Complete Panel"
    ],
    mrp: 1000,
    discount: 200,
    collectionFee: 0,
    totalPayable: 800,
    paymentMethod: "UPI (Google Pay)",
    paymentStatus: "Paid Online",
    status: "Report Released",
    currentStep: 5,
    estimatedReportTime: "Completed on 28 Aug 2026",
    reportId: "AVM-REP-9041",
    testingDetail: {
      sampleBarcode: "AVM-BC-7810129",
      temperatureCelsius: 4.2,
      coldChainCompliant: true,
      labCenter: "AVMLabs Central Clinical Reference Lab, Indiranagar",
      receivedAtLab: "28 Aug 2026 at 08:45 AM",
      technicianName: "Mohan Lal, Senior Lab Analyst",
      pathologistReviewer: "Dr. K. S. Reddy, MD (Pathology)",
      estimatedTat: "Completed",
      tubesCollected: [
        { tube: "EDTA Purple Cap", capColor: "bg-purple-600", type: "CBC & HbA1c", barcode: "BC-EDTA-881", status: "Verified" },
        { tube: "SST Gold Cap", capColor: "bg-amber-500", type: "Comprehensive Chemistry", barcode: "BC-SST-882", status: "Verified" }
      ],
      testsProgression: [
        { testName: "CBC (Hematology)", department: "Hematology", status: "Verified by Pathologist", resultNote: "Normal limits" },
        { testName: "Lipid Profile", department: "Biochemistry", status: "Verified by Pathologist", resultNote: "Optimal HDL" },
        { testName: "Liver Function Test", department: "Biochemistry", status: "Verified by Pathologist", resultNote: "Within range" }
      ]
    }
  },
  {
    id: "ORD-8710",
    orderNumber: "AVM-ORD-8710",
    patientName: "Ramesh M.",
    patientRelation: "Father",
    patientAge: 68,
    patientGender: "Male",
    patientPhone: "+91 98450 12345",
    bookingDate: "2026-08-15",
    formattedBookingDate: "15 Aug 2026",
    appointmentSlot: "15 Aug 2026, 08:30 AM - 09:30 AM",
    collectionType: "Home Collection",
    collectionAddress: "#42, 12th Cross, HAL 2nd Stage, Indiranagar, Bengaluru - 560038",
    profileName: "Senior Citizen Cardiac & Diabetic Risk Panel",
    testCount: 74,
    testsList: [
      "Cardiac Risk Panel (hs-CRP, Troponin, Lipid)",
      "Diabetes Extended (HbA1c, Fasting, PP)",
      "Renal Function with eGFR"
    ],
    mrp: 1800,
    discount: 360,
    collectionFee: 0,
    totalPayable: 1440,
    paymentMethod: "UPI (PhonePe)",
    paymentStatus: "Paid Online",
    status: "Report Released",
    currentStep: 5,
    estimatedReportTime: "Completed on 15 Aug 2026",
    reportId: "AVM-REP-8912"
  },
  {
    id: "ORD-8422",
    orderNumber: "AVM-ORD-8422",
    patientName: "Priya S.",
    patientRelation: "Wife",
    patientAge: 38,
    patientGender: "Female",
    patientPhone: "+91 98450 12345",
    bookingDate: "2026-07-22",
    formattedBookingDate: "22 Jul 2026",
    appointmentSlot: "22 Jul 2026, 09:00 AM - 10:00 AM",
    collectionType: "AVMLabs Center Walk-in",
    collectionAddress: "AVMLabs Diagnostic Center - Indiranagar Branch",
    profileName: "Thyroid & Hormone Complete Profile",
    testCount: 18,
    testsList: ["TSH, Free T3, Free T4, Anti-TPO"],
    mrp: 900,
    discount: 180,
    collectionFee: 0,
    totalPayable: 720,
    paymentMethod: "Credit Card (HDFC)",
    paymentStatus: "Paid Online",
    status: "Report Released",
    currentStep: 5,
    estimatedReportTime: "Completed on 22 Jul 2026",
    reportId: "AVM-REP-8650"
  }
]
