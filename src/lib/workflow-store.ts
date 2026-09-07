"use client"

import { useState, useEffect } from "react"
import {
  getAccountsFromJSON,
  getC1FromJSON,
  getC2ListFromJSON,
  getDefaultCustomerFromJSON,
  getBeneficiariesFromJSON,
  getPrescriptionsFromJSON,
  getOrgProfileFromJSON,
  findAccountByCredentials
} from "@/lib/data-service"

export interface CRAUser {
  id: string
  role: "c1" | "c2" | "customer"
  name: string
  mobile: string
  email: string
  code: string
  city?: string
  c1Id?: string // ID of parent / introducer
  c1Name?: string // Name of parent / introducer
  isConvertedFromCustomer?: boolean
  hasDualRole?: boolean
}

export interface LoginResult {
  success: boolean
  targetUrl: string
  role: "c1" | "c2" | "customer"
  accountName: string
  user: CRAUser | CustomerProfile
  message?: string
  error?: string
}

export interface Beneficiary {
  id: string
  fullName: string
  relation: "Self" | "Father" | "Mother" | "Wife" | "Husband" | "Son" | "Daughter" | "Brother" | "Sister" | "Friend" | "Other"
  age: number
  gender: "Male" | "Female" | "Other"
  address: string
  city: string
  pincode: string
  selectedTests: string[] // Test / Profile IDs
}

export interface PrescriptionRequest {
  id: string
  customerName: string
  mobile: string
  uploadedFileUrl?: string
  fileName?: string
  notes?: string
  requestedAt: string
  status: "Pending Review" | "Doctor Called" | "Order Created"
  recommendedTests?: string[]
}

export interface CustomerProfile {
  id: string
  name: string
  mobile: string
  email: string
  isReferred: boolean
  referralCode?: string
  referrerName?: string
  walletBalance: number
  cashbackEarned: number
  activeCoupons: string[]
  generatedReferralCode?: string
  hasGeneratedReferral?: boolean
  isConvertedToCRA?: boolean
  hasDualRole?: boolean
  craCode?: string
}

export interface CustomerOrder {
  id: string
  orderNumber: string
  customerName: string
  mobile: string
  email: string
  profileId: string
  profileName: string
  cataloguePrice: number // e.g. 1000
  discount: number       // e.g. 200 (20%)
  realizedRevenue: number // e.g. 800
  homeCollectionFee: number // e.g. 150
  totalPayable: number   // e.g. 950
  status: "Payment Pending" | "Paid" | "Sample Collected" | "Completed"
  createdByRole: "c1" | "c2" | "customer"
  creatorId: string
  creatorName: string
  c1Id?: string          // Parent C1/C2 if created by sub-partner
  c1Name?: string
  isFamilyMember?: boolean // True if booked for CRA's family: 20% customer discount + 30% CRA direct earning
  createdAt: string
  paidAt?: string
  paymentMethod?: string
  paymentType?: "Prepaid" | "Postpaid (Pay on Collection)"
  transactionId?: string
  collectionAddress?: string
  collectionSlot?: string
  beneficiariesSummary?: {
    name: string
    relation: string
    tests: string[]
  }[]
  mergedAddressApplied?: boolean
}

export interface WalletTransaction {
  id: string
  userId: string
  userRole: "c1" | "c2"
  orderId: string
  orderNumber: string
  customerName: string
  profileName?: string
  orderAmount?: number // RR e.g. 800
  realizedRevenue: number 
  incentiveRate: number // 0.30 for direct, 0.10 for override
  incentiveAmount: number // e.g. 240 or 80
  type: "Direct 30% Incentive" | "Second-Level Referral Bonus (10%)"
  date: string
  status: "Credited to Wallet" | "Pending Payment"
}

export interface LiveActivityEvent {
  id: string
  type: "new_referral" | "payment_received" | "sample_collected" | "incentive_credited"
  title: string
  subtitle: string
  amount?: number
  timestamp: string
  isLive?: boolean
}

// -------------------------------------------------------------
// CRA 'MAKE MY PROFILE' - CUSTOM HEALTH PROFILE BUNDLER
// -------------------------------------------------------------
export interface CRACustomProfile {
  id: string
  craId: string
  craName: string
  brandOrOrgName: string // e.g. "Yoga & Wellness Center"
  profileTitle: string   // e.g. "Yoga Complete Detox & Vitality Profile"
  description: string
  category: "Wellness & Preventive" | "Cardio-Diabetic" | "Women's Health" | "Senior Care" | "Custom Clinic Panel"
  selectedTestCodes: string[] // List of AVM Labs test codes included in this profile
  testNames: string[]
  totalMrp: number
  discountedPrice: number
  realizedRevenue: number
  directIncentive: number
  createdAt: string
  shareLink: string
}

export interface CRAOrgProfile {
  brandName: string // e.g. "Yoga & Wellness Center"
  diagnosticCenterName: string // e.g. "Yoga & Diagnostic Center"
  category: "Doctor / Clinic" | "Hospital" | "Yoga & Wellness" | "Gym / Fitness" | "Diagnostic Consultant" | "Corporate / Other"
  tagline: string
  address: string
  contactPhone: string
  isCustomProfileActive: boolean
}

export interface WalletWithdrawalRequest {
  id: string
  userId: string
  userName: string
  amount: number
  method: "Bank Transfer" | "UPI"
  bankDetails: {
    bankName: string
    accountNumber: string
    ifsc: string
    upiId?: string
  }
  requestedAt: string
  status: "Pending Processing" | "Approved & Disbursed"
}

// Confirmed Commercial Discount & CRA Incentive Policy
export const CRA_DISCOUNT_CONFIG = {
  customerDiscountPercent: 20, // 20% common per test for every customer & family member (no special extra offer)
  familyBookingOverridePercent: 10, // 10% override only for CRA on family bookings (since 20% customer discount is already given)
  directIncentivePercent: 30,  // 30% direct cash incentive on normal customer referrals
  teamOverridePercent: 10,    // 10% team override bonus on sub-partner sales
  isPendingConfirmation: false
}

export const DEFAULT_ORG_PROFILE: CRAOrgProfile = {
  brandName: "",
  diagnosticCenterName: "",
  category: "Doctor / Clinic",
  tagline: "Certified Diagnostic Collection Center (Powered by AVM Labs)",
  address: "",
  contactPhone: "",
  isCustomProfileActive: false
}

export const DEFAULT_CUSTOM_PROFILES: CRACustomProfile[] = [
  {
    id: "profile-yoga-vitality",
    craId: "C1-SREERAM",
    craName: "THURAKA SREERAM",
    brandOrOrgName: "Yoga & Wellness Center",
    profileTitle: "Yoga Complete Detox & Vitality Profile",
    description: "Curated diagnostic wellness panel designed for yoga practitioners to monitor metabolic rate, muscle recovery, cellular hydration and endocrine harmony.",
    category: "Wellness & Preventive",
    selectedTestCodes: ["H6", "FBS", "LIPID", "TSH", "VITD"],
    testNames: [
      "Complete Blood Count (CBC)",
      "Fasting Blood Sugar (FBS)",
      "Lipid Profile (Cholesterol & Triglycerides)",
      "Thyroid Stimulating Hormone (TSH)",
      "Vitamin D 25-Hydroxy"
    ],
    totalMrp: 2800,
    discountedPrice: 2240,
    realizedRevenue: 2240,
    directIncentive: 672,
    createdAt: "Yesterday",
    shareLink: "https://avmlabs.com/booking?ref=AVM-SREERAM-C1&profile=profile-yoga-vitality"
  },
  {
    id: "profile-cardio-care",
    craId: "C1-SREERAM",
    craName: "THURAKA SREERAM",
    brandOrOrgName: "Apex Heart & Life Care",
    profileTitle: "Executive Cardio-Vascular Risk Assessment",
    description: "Specialized clinical panel curated for executive lifestyle screening and cardiovascular health tracking.",
    category: "Cardio-Diabetic",
    selectedTestCodes: ["H6", "HBA1C", "LIPID", "KFT", "CRP"],
    testNames: [
      "Complete Blood Count (CBC)",
      "HbA1c Glycated Hemoglobin",
      "Lipid Profile Comprehensive",
      "Kidney Function Test (KFT)",
      "High Sensitivity CRP (hs-CRP)"
    ],
    totalMrp: 3400,
    discountedPrice: 2720,
    realizedRevenue: 2720,
    directIncentive: 816,
    createdAt: "3 days ago",
    shareLink: "https://avmlabs.com/booking?ref=AVM-SREERAM-C1&profile=profile-cardio-care"
  },
  {
    id: "profile-women-hormone",
    craId: "C1-SREERAM",
    craName: "THURAKA SREERAM",
    brandOrOrgName: "HerWellness Diagnostic Studio",
    profileTitle: "Women's Complete Vitality & Hormonal Screen",
    description: "Holistic screening panel covering iron stores, thyroid regulation, bone health minerals, and metabolic vitality for active women.",
    category: "Women's Health",
    selectedTestCodes: ["H6", "TSH", "VITD", "B12", "FERRITIN"],
    testNames: [
      "Complete Blood Count (CBC)",
      "Thyroid Stimulating Hormone (TSH)",
      "Vitamin D 25-Hydroxy",
      "Vitamin B12 Cyanocobalamin",
      "Serum Ferritin"
    ],
    totalMrp: 3100,
    discountedPrice: 2480,
    realizedRevenue: 2480,
    directIncentive: 744,
    createdAt: "4 days ago",
    shareLink: "https://avmlabs.com/booking?ref=AVM-SREERAM-C1&profile=profile-women-hormone"
  },
  {
    id: "profile-senior-care",
    craId: "C1-SREERAM",
    craName: "THURAKA SREERAM",
    brandOrOrgName: "Golden Years Elder Care Clinic",
    profileTitle: "Senior Citizen Comprehensive Health Scan",
    description: "Designed for geriatric wellness, checking renal filtration, hepatic enzymes, electrolyte balance, and glycemic control.",
    category: "Senior Care",
    selectedTestCodes: ["H6", "FBS", "HBA1C", "KFT", "LFT", "LIPID"],
    testNames: [
      "Complete Blood Count (CBC)",
      "Fasting Blood Sugar (FBS)",
      "HbA1c Glycated Hemoglobin",
      "Kidney Function Test (KFT)",
      "Liver Function Test (LFT)",
      "Lipid Profile Comprehensive"
    ],
    totalMrp: 4200,
    discountedPrice: 3360,
    realizedRevenue: 3360,
    directIncentive: 1008,
    createdAt: "5 days ago",
    shareLink: "https://avmlabs.com/booking?ref=AVM-SREERAM-C1&profile=profile-senior-care"
  },
  {
    id: "profile-diabetic-care",
    craId: "C1-SREERAM",
    craName: "THURAKA SREERAM",
    brandOrOrgName: "SugarCare Metabolic Center",
    profileTitle: "Target 360 Diabetic Glycemic Panel",
    description: "Targeted protocol for pre-diabetic and diabetic management, lipid risks, and micro-albuminuria markers.",
    category: "Cardio-Diabetic",
    selectedTestCodes: ["FBS", "PPBS", "HBA1C", "LIPID", "CREAT"],
    testNames: [
      "Fasting Blood Sugar (FBS)",
      "Post Prandial Blood Sugar (PPBS)",
      "HbA1c Glycated Hemoglobin",
      "Lipid Profile Comprehensive",
      "Serum Creatinine"
    ],
    totalMrp: 2600,
    discountedPrice: 2080,
    realizedRevenue: 2080,
    directIncentive: 624,
    createdAt: "1 week ago",
    shareLink: "https://avmlabs.com/booking?ref=AVM-SREERAM-C1&profile=profile-diabetic-care"
  }
]

export const SUDHEER_BENEFICIARIES: Beneficiary[] = [
  {
    id: "ben-sudheer-1",
    fullName: "Sudheer Reddy",
    relation: "Self",
    age: 38,
    gender: "Male",
    address: "#42, 12th Cross, HAL 2nd Stage, Indiranagar",
    city: "Bengaluru",
    pincode: "560038",
    selectedTests: ["test-H6", "test-CUA"]
  },
  {
    id: "ben-sudheer-2",
    fullName: "Ramanathan Reddy",
    relation: "Father",
    age: 68,
    gender: "Male",
    address: "#42, 12th Cross, HAL 2nd Stage, Indiranagar",
    city: "Bengaluru",
    pincode: "560038",
    selectedTests: ["pkg-diabetes"]
  },
  {
    id: "ben-sudheer-3",
    fullName: "Lakshmi Reddy",
    relation: "Mother",
    age: 63,
    gender: "Female",
    address: "#42, 12th Cross, HAL 2nd Stage, Indiranagar",
    city: "Bengaluru",
    pincode: "560038",
    selectedTests: ["pkg-senior"]
  },
  {
    id: "ben-sudheer-4",
    fullName: "Priya Reddy",
    relation: "Wife",
    age: 35,
    gender: "Female",
    address: "#42, 12th Cross, HAL 2nd Stage, Indiranagar",
    city: "Bengaluru",
    pincode: "560038",
    selectedTests: ["pkg-women"]
  }
]

export const SREERAM_BENEFICIARIES: Beneficiary[] = [
  {
    id: "ben-sreeram-1",
    fullName: "Thuraka Sreeram",
    relation: "Self",
    age: 42,
    gender: "Male",
    address: "#18, Green Glen Layout, Bellandur",
    city: "Hyderabad",
    pincode: "500081",
    selectedTests: ["test-H6", "test-CUA"]
  },
  {
    id: "ben-sreeram-2",
    fullName: "Venkata Subbaiah T.",
    relation: "Father",
    age: 72,
    gender: "Male",
    address: "#18, Green Glen Layout, Bellandur",
    city: "Hyderabad",
    pincode: "500081",
    selectedTests: ["pkg-senior"]
  },
  {
    id: "ben-sreeram-3",
    fullName: "Savitri T.",
    relation: "Mother",
    age: 67,
    gender: "Female",
    address: "#18, Green Glen Layout, Bellandur",
    city: "Hyderabad",
    pincode: "500081",
    selectedTests: ["pkg-diabetes"]
  },
  {
    id: "ben-sreeram-4",
    fullName: "Radhika T.",
    relation: "Wife",
    age: 38,
    gender: "Female",
    address: "#18, Green Glen Layout, Bellandur",
    city: "Hyderabad",
    pincode: "500081",
    selectedTests: ["pkg-women"]
  }
]

export const MAHENDRA_BENEFICIARIES: Beneficiary[] = [
  {
    id: "ben-mahendra-1",
    fullName: "Sai Mahendra",
    relation: "Self",
    age: 36,
    gender: "Male",
    address: "#88, Koregaon Park",
    city: "Pune",
    pincode: "411001",
    selectedTests: ["test-H6"]
  },
  {
    id: "ben-mahendra-2",
    fullName: "Venkatesh Rao",
    relation: "Father",
    age: 66,
    gender: "Male",
    address: "#88, Koregaon Park",
    city: "Pune",
    pincode: "411001",
    selectedTests: ["pkg-senior"]
  }
]

export const VISHNU_BENEFICIARIES: Beneficiary[] = [
  {
    id: "ben-vishnu-1",
    fullName: "Vishnu Vardhan",
    relation: "Self",
    age: 32,
    gender: "Male",
    address: "#45, MG Road",
    city: "Vijayawada",
    pincode: "520002",
    selectedTests: ["test-H6"]
  },
  {
    id: "ben-vishnu-2",
    fullName: "Srinivasa Rao",
    relation: "Father",
    age: 62,
    gender: "Male",
    address: "#45, MG Road",
    city: "Vijayawada",
    pincode: "520002",
    selectedTests: ["pkg-senior"]
  }
]

export function getPersonaBeneficiaries(user?: CRAUser | CustomerProfile | null): Beneficiary[] {
  if (!user) return DEFAULT_BENEFICIARIES
  const uId = (user.id || "").toLowerCase()
  const uName = (user.name || "").toLowerCase()

  if (uId.includes("sudheer") || uName.includes("sudheer")) {
    return SUDHEER_BENEFICIARIES
  }
  if (uId.includes("sreeram") || uName.includes("sreeram")) {
    return SREERAM_BENEFICIARIES
  }
  if (uId.includes("mahendra") || uName.includes("mahendra")) {
    return MAHENDRA_BENEFICIARIES
  }
  if (uId.includes("vishnu") || uName.includes("vishnu")) {
    return VISHNU_BENEFICIARIES
  }
  return DEFAULT_BENEFICIARIES
}
export interface SystemAccount {
  id: string
  role: "c1" | "c2" | "customer"
  personaKey: "sreeram" | "sudheer" | "mahendra" | "vishnu" | "customer"
  name: string
  roleTitle: string
  code: string
  mobile: string
  email: string
  password: string
  targetDashboard: string
  description: string
  badgeColor: string
  city?: string
  introducer?: {
    id: string
    name: string
    code: string
  } | null
  aliases?: string[]
}

// Dynamically loaded from JSON datasets (no hardcoding in file)
export const DEFAULT_BENEFICIARIES: Beneficiary[] = getBeneficiariesFromJSON() as Beneficiary[]
export const DEFAULT_PRESCRIPTIONS: PrescriptionRequest[] = getPrescriptionsFromJSON() as PrescriptionRequest[]
export const DEFAULT_CUSTOMER: CustomerProfile = getDefaultCustomerFromJSON() as CustomerProfile
export const DEFAULT_C1: CRAUser = getC1FromJSON() as CRAUser
export const DEFAULT_C2_LIST: CRAUser[] = getC2ListFromJSON() as CRAUser[]
export const SYSTEM_ACCOUNTS: SystemAccount[] = getAccountsFromJSON() as SystemAccount[]

export const ALL_DEMO_ACCOUNTS = [
  DEFAULT_C1,
  ...DEFAULT_C2_LIST
]

const DEFAULT_ORDERS: CustomerOrder[] = [
  // 1. Sudheer Reddy Referrals (Sudheer 30%, Sreeram 10%)
  {
    id: "ORD-8821",
    orderNumber: "AVM-8821",
    customerName: "Sunil Sharma",
    mobile: "+91 98450 99887",
    email: "sunil.sharma@example.com",
    profileId: "pkg-master",
    profileName: "Comprehensive Master Health Profile",
    cataloguePrice: 1000,
    discount: 200,
    realizedRevenue: 800,
    homeCollectionFee: 200,
    totalPayable: 1000,
    status: "Completed",
    createdByRole: "c2",
    creatorId: "C2-SUDHEER",
    creatorName: "SUDHEER REDDY",
    c1Id: "C1-SREERAM",
    c1Name: "THURAKA SREERAM",
    createdAt: "Just now",
    paidAt: "Just now",
    paymentMethod: "UPI (Google Pay)",
    transactionId: "UPI-TXN-99882104"
  },
  {
    id: "ORD-8822",
    orderNumber: "AVM-8822",
    customerName: "Farhan Ali",
    mobile: "+91 98110 77889",
    email: "farhan.ali@example.com",
    profileId: "pkg-master",
    profileName: "Comprehensive Master Health Checkup",
    cataloguePrice: 1000,
    discount: 200,
    realizedRevenue: 800,
    homeCollectionFee: 0,
    totalPayable: 800,
    status: "Completed",
    createdByRole: "c2",
    creatorId: "C2-SUDHEER",
    creatorName: "SUDHEER REDDY",
    c1Id: "C1-SREERAM",
    c1Name: "THURAKA SREERAM",
    createdAt: "30 mins ago",
    paidAt: "28 mins ago",
    paymentMethod: "UPI (PhonePe)",
    transactionId: "UPI-TXN-77881122"
  },
  {
    id: "ORD-8823",
    orderNumber: "AVM-8823",
    customerName: "Sneha Sen",
    mobile: "+91 98440 88990",
    email: "sneha.sen@example.com",
    profileId: "pkg-thyroid",
    profileName: "Thyroid & Hormone Complete Profile",
    cataloguePrice: 900,
    discount: 180,
    realizedRevenue: 720,
    homeCollectionFee: 0,
    totalPayable: 720,
    status: "Completed",
    createdByRole: "c2",
    creatorId: "C2-SUDHEER",
    creatorName: "SUDHEER REDDY",
    c1Id: "C1-SREERAM",
    c1Name: "THURAKA SREERAM",
    createdAt: "1 hour ago",
    paidAt: "50 mins ago",
    paymentMethod: "UPI (Paytm)",
    transactionId: "UPI-TXN-66554433"
  },

  // 2. Thuraka Sreeram Direct Referrals (Sreeram 30%)
  {
    id: "ORD-8820",
    orderNumber: "AVM-8820",
    customerName: "Anita Rao",
    mobile: "+91 98765 43210",
    email: "anita.rao@example.com",
    profileId: "pkg-women",
    profileName: "Women Advanced Wellness Profile",
    cataloguePrice: 1000,
    discount: 200,
    realizedRevenue: 800,
    homeCollectionFee: 200,
    totalPayable: 1000,
    status: "Completed",
    createdByRole: "c1",
    creatorId: "C1-SREERAM",
    creatorName: "THURAKA SREERAM",
    createdAt: "10 mins ago",
    paidAt: "5 mins ago",
    paymentMethod: "Credit Card (HDFC)",
    transactionId: "CARD-TXN-77441109"
  },
  {
    id: "ORD-8826",
    orderNumber: "AVM-8826",
    customerName: "Suresh Iyer",
    mobile: "+91 98450 11223",
    email: "suresh.iyer@example.com",
    profileId: "pkg-cardiac",
    profileName: "Executive Heart & Cardiac Risk",
    cataloguePrice: 2000,
    discount: 400,
    realizedRevenue: 1600,
    homeCollectionFee: 0,
    totalPayable: 1600,
    status: "Completed",
    createdByRole: "c1",
    creatorId: "C1-SREERAM",
    creatorName: "THURAKA SREERAM",
    createdAt: "2 hours ago",
    paidAt: "1 hour ago",
    paymentMethod: "NetBanking",
    transactionId: "NET-TXN-11223344"
  },

  // 3. Sai Mahendra Direct Referrals (Mahendra 30%, Sreeram 10%)
  {
    id: "ORD-8819",
    orderNumber: "AVM-8819",
    customerName: "Meena K.",
    mobile: "+91 98220 55441",
    email: "meena.k@example.com",
    profileId: "pkg-cardiac",
    profileName: "Executive Heart & Cardiac Risk",
    cataloguePrice: 2000,
    discount: 400,
    realizedRevenue: 1600,
    homeCollectionFee: 0,
    totalPayable: 1600,
    status: "Completed",
    createdByRole: "c2",
    creatorId: "C2-MAHENDRA",
    creatorName: "SAI MAHENDRA",
    c1Id: "C1-SREERAM",
    c1Name: "THURAKA SREERAM",
    createdAt: "25 mins ago",
    paidAt: "20 mins ago",
    paymentMethod: "UPI (PhonePe)",
    transactionId: "UPI-TXN-88291048"
  },
  {
    id: "ORD-8824",
    orderNumber: "AVM-8824",
    customerName: "Karan Joshi",
    mobile: "+91 98990 44556",
    email: "karan.joshi@example.com",
    profileId: "pkg-senior",
    profileName: "Senior Citizen Comprehensive Care",
    cataloguePrice: 1800,
    discount: 360,
    realizedRevenue: 1440,
    homeCollectionFee: 0,
    totalPayable: 1440,
    status: "Completed",
    createdByRole: "c2",
    creatorId: "C2-MAHENDRA",
    creatorName: "SAI MAHENDRA",
    c1Id: "C1-SREERAM",
    c1Name: "THURAKA SREERAM",
    createdAt: "3 hours ago",
    paidAt: "2 hours ago",
    paymentMethod: "Debit Card",
    transactionId: "DC-TXN-55443322"
  },

  // 4. Vishnu Vardhan Referrals (Vishnu 30%, Sai Mahendra 10%, Sreeram 0% - 2 level cap!)
  {
    id: "ORD-8818",
    orderNumber: "AVM-8818",
    customerName: "Divya Pillai",
    mobile: "+91 98330 22334",
    email: "divya.p@example.com",
    profileId: "pkg-diabetic",
    profileName: "Diabetic Comprehensive Management",
    cataloguePrice: 1200,
    discount: 240,
    realizedRevenue: 960,
    homeCollectionFee: 0,
    totalPayable: 960,
    status: "Completed",
    createdByRole: "c2",
    creatorId: "C2-VISHNU",
    creatorName: "VISHNU VARDHAN",
    c1Id: "C2-MAHENDRA",
    c1Name: "SAI MAHENDRA",
    createdAt: "1 hour ago",
    paidAt: "45 mins ago",
    paymentMethod: "NetBanking",
    transactionId: "NET-TXN-44991028"
  },
  {
    id: "ORD-8825",
    orderNumber: "AVM-8825",
    customerName: "Anand Rao",
    mobile: "+91 98660 11445",
    email: "anand.rao@example.com",
    profileId: "pkg-wellness",
    profileName: "Full Body Wellness Profile",
    cataloguePrice: 1000,
    discount: 200,
    realizedRevenue: 800,
    homeCollectionFee: 0,
    totalPayable: 800,
    status: "Completed",
    createdByRole: "c2",
    creatorId: "C2-VISHNU",
    creatorName: "VISHNU VARDHAN",
    c1Id: "C2-MAHENDRA",
    c1Name: "SAI MAHENDRA",
    createdAt: "4 hours ago",
    paidAt: "3 hours ago",
    paymentMethod: "UPI (Google Pay)",
    transactionId: "UPI-TXN-99001122"
  }
]

const DEFAULT_TRANSACTIONS: WalletTransaction[] = [
  // 1. VISHNU VARDHAN Direct Transactions (30% to Vishnu)
  {
    id: "TXN-VISHNU-01",
    userId: "C2-VISHNU",
    userRole: "c2",
    orderId: "ORD-8818",
    orderNumber: "AVM-8818",
    customerName: "Divya Pillai",
    realizedRevenue: 960,
    incentiveRate: 0.30,
    incentiveAmount: 288,
    type: "Direct 30% Incentive",
    date: "45 mins ago",
    status: "Credited to Wallet"
  },
  {
    id: "TXN-VISHNU-02",
    userId: "C2-VISHNU",
    userRole: "c2",
    orderId: "ORD-8825",
    orderNumber: "AVM-8825",
    customerName: "Anand Rao",
    realizedRevenue: 800,
    incentiveRate: 0.30,
    incentiveAmount: 240,
    type: "Direct 30% Incentive",
    date: "3 hours ago",
    status: "Credited to Wallet"
  },

  // 2. SAI MAHENDRA Transactions (30% Direct on own + 10% Override from Vishnu)
  {
    id: "TXN-MAH-01",
    userId: "C2-MAHENDRA",
    userRole: "c2",
    orderId: "ORD-8819",
    orderNumber: "AVM-8819",
    customerName: "Meena K.",
    realizedRevenue: 1600,
    incentiveRate: 0.30,
    incentiveAmount: 480,
    type: "Direct 30% Incentive",
    date: "20 mins ago",
    status: "Credited to Wallet"
  },
  {
    id: "TXN-MAH-02",
    userId: "C2-MAHENDRA",
    userRole: "c2",
    orderId: "ORD-8824",
    orderNumber: "AVM-8824",
    customerName: "Karan Joshi",
    realizedRevenue: 1440,
    incentiveRate: 0.30,
    incentiveAmount: 432,
    type: "Direct 30% Incentive",
    date: "2 hours ago",
    status: "Credited to Wallet"
  },
  {
    id: "TXN-MAH-03",
    userId: "C2-MAHENDRA",
    userRole: "c2",
    orderId: "ORD-8818",
    orderNumber: "AVM-8818",
    customerName: "Divya Pillai (via Vishnu)",
    realizedRevenue: 960,
    incentiveRate: 0.10,
    incentiveAmount: 96,
    type: "Second-Level Referral Bonus (10%)",
    date: "45 mins ago",
    status: "Credited to Wallet"
  },
  {
    id: "TXN-MAH-04",
    userId: "C2-MAHENDRA",
    userRole: "c2",
    orderId: "ORD-8825",
    orderNumber: "AVM-8825",
    customerName: "Anand Rao (via Vishnu)",
    realizedRevenue: 800,
    incentiveRate: 0.10,
    incentiveAmount: 80,
    type: "Second-Level Referral Bonus (10%)",
    date: "3 hours ago",
    status: "Credited to Wallet"
  },

  // 3. SUDHEER REDDY Direct Transactions (30% Direct)
  {
    id: "TXN-SUD-01",
    userId: "C2-SUDHEER",
    userRole: "c2",
    orderId: "ORD-8821",
    orderNumber: "AVM-8821",
    customerName: "Sunil Sharma",
    realizedRevenue: 800,
    incentiveRate: 0.30,
    incentiveAmount: 240,
    type: "Direct 30% Incentive",
    date: "Just now",
    status: "Credited to Wallet"
  },
  {
    id: "TXN-SUD-02",
    userId: "C2-SUDHEER",
    userRole: "c2",
    orderId: "ORD-8822",
    orderNumber: "AVM-8822",
    customerName: "Farhan Ali",
    realizedRevenue: 800,
    incentiveRate: 0.30,
    incentiveAmount: 240,
    type: "Direct 30% Incentive",
    date: "28 mins ago",
    status: "Credited to Wallet"
  },
  {
    id: "TXN-SUD-03",
    userId: "C2-SUDHEER",
    userRole: "c2",
    orderId: "ORD-8823",
    orderNumber: "AVM-8823",
    customerName: "Sneha Sen",
    realizedRevenue: 720,
    incentiveRate: 0.30,
    incentiveAmount: 216,
    type: "Direct 30% Incentive",
    date: "50 mins ago",
    status: "Credited to Wallet"
  },

  // 4. THURAKA SREERAM Transactions (7 Direct 30% + 5 Team 10% Overrides = 12 Transactions)
  // Direct Referrals (7)
  {
    id: "TXN-SREERAM-01",
    userId: "C1-SREERAM",
    userRole: "c1",
    orderId: "ORD-8820",
    orderNumber: "AVM-8820",
    customerName: "Anita Rao",
    realizedRevenue: 800,
    incentiveRate: 0.30,
    incentiveAmount: 240,
    type: "Direct 30% Incentive",
    date: "28 Aug 2026, 10:30 AM",
    status: "Credited to Wallet"
  },
  {
    id: "TXN-SREERAM-02",
    userId: "C1-SREERAM",
    userRole: "c1",
    orderId: "ORD-8826",
    orderNumber: "AVM-8826",
    customerName: "Suresh Iyer",
    realizedRevenue: 1600,
    incentiveRate: 0.30,
    incentiveAmount: 480,
    type: "Direct 30% Incentive",
    date: "28 Aug 2026, 09:15 AM",
    status: "Credited to Wallet"
  },
  {
    id: "TXN-SREERAM-03",
    userId: "C1-SREERAM",
    userRole: "c1",
    orderId: "ORD-8827",
    orderNumber: "AVM-8827",
    customerName: "Vikram Singhania",
    realizedRevenue: 1600,
    incentiveRate: 0.30,
    incentiveAmount: 480,
    type: "Direct 30% Incentive",
    date: "24 Aug 2026, 04:00 PM",
    status: "Credited to Wallet"
  },
  {
    id: "TXN-SREERAM-04",
    userId: "C1-SREERAM",
    userRole: "c1",
    orderId: "ORD-8828",
    orderNumber: "AVM-8828",
    customerName: "Amit Gupta",
    realizedRevenue: 800,
    incentiveRate: 0.30,
    incentiveAmount: 240,
    type: "Direct 30% Incentive",
    date: "22 Aug 2026, 01:20 PM",
    status: "Credited to Wallet"
  },
  {
    id: "TXN-SREERAM-05",
    userId: "C1-SREERAM",
    userRole: "c1",
    orderId: "ORD-8829",
    orderNumber: "AVM-8829",
    customerName: "Manish Deshmukh",
    realizedRevenue: 1600,
    incentiveRate: 0.30,
    incentiveAmount: 480,
    type: "Direct 30% Incentive",
    date: "19 Aug 2026, 02:45 PM",
    status: "Credited to Wallet"
  },
  {
    id: "TXN-SREERAM-06",
    userId: "C1-SREERAM",
    userRole: "c1",
    orderId: "ORD-8830",
    orderNumber: "AVM-8830",
    customerName: "Rahul Mehta",
    realizedRevenue: 800,
    incentiveRate: 0.30,
    incentiveAmount: 240,
    type: "Direct 30% Incentive",
    date: "18 Aug 2026, 11:20 AM",
    status: "Credited to Wallet"
  },
  {
    id: "TXN-SREERAM-07",
    userId: "C1-SREERAM",
    userRole: "c1",
    orderId: "ORD-8831",
    orderNumber: "AVM-8831",
    customerName: "Tarun Sharma",
    realizedRevenue: 960,
    incentiveRate: 0.30,
    incentiveAmount: 288,
    type: "Direct 30% Incentive",
    date: "16 Aug 2026, 03:15 PM",
    status: "Credited to Wallet"
  },
  // 10% Overrides from SUDHEER REDDY (3)
  {
    id: "TXN-SREERAM-08",
    userId: "C1-SREERAM",
    userRole: "c1",
    orderId: "ORD-8821",
    orderNumber: "AVM-8821",
    customerName: "Sunil Sharma (via Sudheer Reddy)",
    realizedRevenue: 800,
    incentiveRate: 0.10,
    incentiveAmount: 80,
    type: "Second-Level Referral Bonus (10%)",
    date: "28 Aug 2026, 11:30 AM",
    status: "Credited to Wallet"
  },
  {
    id: "TXN-SREERAM-09",
    userId: "C1-SREERAM",
    userRole: "c1",
    orderId: "ORD-8822",
    orderNumber: "AVM-8822",
    customerName: "Farhan Ali (via Sudheer Reddy)",
    realizedRevenue: 800,
    incentiveRate: 0.10,
    incentiveAmount: 80,
    type: "Second-Level Referral Bonus (10%)",
    date: "27 Aug 2026, 02:30 PM",
    status: "Credited to Wallet"
  },
  {
    id: "TXN-SREERAM-10",
    userId: "C1-SREERAM",
    userRole: "c1",
    orderId: "ORD-8823",
    orderNumber: "AVM-8823",
    customerName: "Sneha Sen (via Sudheer Reddy)",
    realizedRevenue: 720,
    incentiveRate: 0.10,
    incentiveAmount: 72,
    type: "Second-Level Referral Bonus (10%)",
    date: "23 Aug 2026, 10:15 AM",
    status: "Credited to Wallet"
  },
  // 10% Overrides from SAI MAHENDRA (2)
  {
    id: "TXN-SREERAM-11",
    userId: "C1-SREERAM",
    userRole: "c1",
    orderId: "ORD-8819",
    orderNumber: "AVM-8819",
    customerName: "Meena K. (via Sai Mahendra)",
    realizedRevenue: 1600,
    incentiveRate: 0.10,
    incentiveAmount: 160,
    type: "Second-Level Referral Bonus (10%)",
    date: "27 Aug 2026, 04:15 PM",
    status: "Credited to Wallet"
  },
  {
    id: "TXN-SREERAM-12",
    userId: "C1-SREERAM",
    userRole: "c1",
    orderId: "ORD-8824",
    orderNumber: "AVM-8824",
    customerName: "Karan Joshi (via Sai Mahendra)",
    realizedRevenue: 1440,
    incentiveRate: 0.10,
    incentiveAmount: 144,
    type: "Second-Level Referral Bonus (10%)",
    date: "25 Aug 2026, 05:00 PM",
    status: "Credited to Wallet"
  }
]

const DEFAULT_LIVE_EVENTS: LiveActivityEvent[] = [
  {
    id: "EVT-1",
    type: "new_referral",
    title: "New Booking via Vishnu (AVM-VISHNU-C2)",
    subtitle: "Divya Pillai booked Diabetic Management (RR ₹960)",
    timestamp: "45 mins ago",
    isLive: true
  },
  {
    id: "EVT-2",
    type: "incentive_credited",
    title: "₹480 Direct 30% Credited to Sai Mahendra",
    subtitle: "Meena K. completed Executive Heart Profile payment",
    amount: 480,
    timestamp: "20 mins ago",
    isLive: true
  },
  {
    id: "EVT-3",
    type: "incentive_credited",
    title: "₹240 Commission Credited to Sudheer Reddy",
    subtitle: "Sunil Sharma paid ₹1,000 for Master Health Checkup",
    amount: 240,
    timestamp: "Just now",
    isLive: true
  }
]

interface WorkflowState {
  currentUser: CRAUser
  c1: CRAUser
  c2List: CRAUser[]
  orders: CustomerOrder[]
  transactions: WalletTransaction[]
  liveEvents: LiveActivityEvent[]
  customer: CustomerProfile
  isCustomerLoggedIn: boolean
  beneficiaries: Beneficiary[]
  prescriptionRequests: PrescriptionRequest[]
  customProfiles: CRACustomProfile[]
  orgProfile: CRAOrgProfile
  withdrawalRequests: WalletWithdrawalRequest[]
}

const STORAGE_KEY = "avm_workflow_state_v10"

function loadState(): WorkflowState {
  if (typeof window === "undefined") {
    return {
      currentUser: DEFAULT_C1,
      c1: DEFAULT_C1,
      c2List: DEFAULT_C2_LIST,
      orders: DEFAULT_ORDERS,
      transactions: DEFAULT_TRANSACTIONS,
      liveEvents: DEFAULT_LIVE_EVENTS,
      customer: DEFAULT_CUSTOMER,
      isCustomerLoggedIn: false,
      beneficiaries: DEFAULT_BENEFICIARIES,
      prescriptionRequests: DEFAULT_PRESCRIPTIONS,
      customProfiles: DEFAULT_CUSTOM_PROFILES,
      orgProfile: DEFAULT_ORG_PROFILE,
      withdrawalRequests: []
    }
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      const parsed = JSON.parse(data)
      if (parsed.currentUser && parsed.c1 && parsed.c2List) {
        const loadedCustomer = parsed.customer || DEFAULT_CUSTOMER
        // Flowchart D -> E: If Referral Code not already generated, automatically generate it!
        if (!loadedCustomer.generatedReferralCode) {
          const clean = (loadedCustomer.name || "USER").replace(/[^A-Za-z]/g, "").slice(0, 6).toUpperCase() || "USER"
          loadedCustomer.generatedReferralCode = `REF-${clean}-10`
          loadedCustomer.hasGeneratedReferral = true
        }

        const rawBrand = (parsed.orgProfile?.brandName || "").replace(/XYZ\s*/gi, "").trim()
        const brand = rawBrand === "Yoga & Wellness Center" ? "" : rawBrand

        const sanitizedOrg = parsed.orgProfile ? {
          ...parsed.orgProfile,
          brandName: brand,
          diagnosticCenterName: (parsed.orgProfile.diagnosticCenterName || "").replace(/XYZ\s*/gi, "").trim()
        } : DEFAULT_ORG_PROFILE

        const sanitizedProfiles = (parsed.customProfiles || DEFAULT_CUSTOM_PROFILES).map((p: any) => ({
          ...p,
          brandOrOrgName: (p.brandOrOrgName || "Yoga & Wellness Center").replace(/XYZ\s*/gi, "").trim() || "Yoga & Wellness Center",
          profileTitle: (p.profileTitle || "").replace(/XYZ\s*/gi, "").trim()
        }))

        const loadedUser = parsed.currentUser || DEFAULT_C1
        let loadedBeneficiaries = parsed.beneficiaries || getPersonaBeneficiaries(loadedUser)
        
        // Reconcile beneficiaries with current user
        if (loadedUser && loadedUser.role !== "customer") {
          const selfBen = loadedBeneficiaries.find((b: Beneficiary) => b.relation === "Self")
          if (!selfBen || selfBen.fullName === "Suresh M." || (loadedUser.id === "C2-SUDHEER" && selfBen.fullName !== "Sudheer Reddy")) {
            loadedBeneficiaries = getPersonaBeneficiaries(loadedUser)
          }
        }

        return {
          ...parsed,
          customer: loadedCustomer,
          isCustomerLoggedIn: parsed.isCustomerLoggedIn ?? false,
          beneficiaries: loadedBeneficiaries,
          prescriptionRequests: parsed.prescriptionRequests || DEFAULT_PRESCRIPTIONS,
          customProfiles: sanitizedProfiles,
          orgProfile: sanitizedOrg,
          withdrawalRequests: parsed.withdrawalRequests || []
        }
      }
    }
  } catch (e) {
    console.error("Failed to load workflow state", e)
  }

  return {
    currentUser: DEFAULT_C1,
    c1: DEFAULT_C1,
    c2List: DEFAULT_C2_LIST,
    orders: DEFAULT_ORDERS,
    transactions: DEFAULT_TRANSACTIONS,
    liveEvents: DEFAULT_LIVE_EVENTS,
    customer: DEFAULT_CUSTOMER,
    isCustomerLoggedIn: false,
    beneficiaries: DEFAULT_BENEFICIARIES,
    prescriptionRequests: DEFAULT_PRESCRIPTIONS,
    customProfiles: DEFAULT_CUSTOM_PROFILES,
    orgProfile: DEFAULT_ORG_PROFILE,
    withdrawalRequests: []
  }
}

function saveState(state: WorkflowState) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (e) {
    console.error("Failed to save workflow state", e)
  }
}

let globalState: WorkflowState = loadState()
const listeners = new Set<(state: WorkflowState) => void>()

function updateGlobalState(newState: WorkflowState) {
  globalState = newState
  saveState(newState)
  listeners.forEach(fn => fn(globalState))
}

export function useWorkflowStore() {
  const [state, setState] = useState<WorkflowState>(() => {
    if (typeof window !== "undefined") {
      return globalState
    }
    return loadState()
  })

  useEffect(() => {
    // Sync with global singleton on mount
    setState(globalState)

    const handleStateChange = (nextState: WorkflowState) => {
      setState(nextState)
    }

    listeners.add(handleStateChange)

    // Self-healing: if current user is CRA (like Sudheer Reddy) and beneficiaries has Suresh M., heal immediately
    if (globalState.currentUser && globalState.currentUser.role !== "customer") {
      const selfBen = globalState.beneficiaries.find(b => b.relation === "Self")
      const isSudheer = globalState.currentUser.id === "C2-SUDHEER" || globalState.currentUser.name.toLowerCase().includes("sudheer")
      if (selfBen && (selfBen.fullName === "Suresh M." || (isSudheer && selfBen.fullName !== "Sudheer Reddy"))) {
        const healed = getPersonaBeneficiaries(globalState.currentUser)
        updateGlobalState({
          ...globalState,
          beneficiaries: healed
        })
      }
    }

    // Sync storage across browser tabs in real time
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue)
          globalState = parsed
          listeners.forEach(fn => fn(globalState))
        } catch (err) {
          console.error("Realtime sync error", err)
        }
      }
    }
    window.addEventListener("storage", handleStorageChange)

    return () => {
      listeners.delete(handleStateChange)
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  // Switch role between Sreeram (C1), Sudheer (C2), Sai Mahendra (C2), Vishnu (C2), and Customer
  const switchRole = (roleOrPersona: "c1" | "c2" | "customer" | "sreeram" | "sudheer" | "mahendra" | "vishnu", customC2Id?: string) => {
    let newUser: CRAUser

    if (roleOrPersona === "c1" || roleOrPersona === "sreeram") {
      newUser = DEFAULT_C1
    } else if (roleOrPersona === "sudheer") {
      newUser = DEFAULT_C2_LIST[0] // Sudheer Reddy
    } else if (roleOrPersona === "mahendra") {
      newUser = DEFAULT_C2_LIST[1] // Sai Mahendra
    } else if (roleOrPersona === "vishnu") {
      newUser = DEFAULT_C2_LIST[2] // Vishnu
    } else if (roleOrPersona === "c2") {
      if (customC2Id) {
        newUser = globalState.c2List.find(c => c.id === customC2Id) || DEFAULT_C2_LIST[0]
      } else {
        newUser = DEFAULT_C2_LIST[0]
      }
    } else {
      const prevCraUser = (globalState.currentUser?.role === "c1" || globalState.currentUser?.role === "c2") ? globalState.currentUser : null
      let updatedCustomer = globalState.customer
      if (prevCraUser) {
        const isSreeram = prevCraUser.id === "C1-SREERAM" || prevCraUser.name?.toUpperCase().includes("SREERAM") || !prevCraUser.c1Name
        const hasReferrer = isSreeram ? false : Boolean(prevCraUser.c1Name)
        const referrerName = hasReferrer ? prevCraUser.c1Name : undefined
        const referralCode = hasReferrer ? (prevCraUser.c1Id === "C1-SREERAM" ? "AVM-SREERAM-C1" : "AVM-MAHENDRA-C2") : undefined
        const clean = (prevCraUser.name || "USER").replace(/[^A-Za-z]/g, "").slice(0, 7).toUpperCase() || "USER"
        updatedCustomer = {
          ...globalState.customer,
          id: `CUST-${prevCraUser.id}`,
          name: prevCraUser.name,
          mobile: prevCraUser.mobile,
          email: prevCraUser.email,
          isReferred: hasReferrer,
          referrerName: referrerName,
          referralCode: referralCode,
          isConvertedToCRA: true,
          hasDualRole: true,
          craCode: prevCraUser.code,
          hasGeneratedReferral: true,
          generatedReferralCode: prevCraUser.code || `REF-${clean}-10`
        }
      }

      newUser = {
        id: updatedCustomer?.id || "CUST-981",
        role: "customer",
        name: updatedCustomer?.name || "Suresh M.",
        mobile: updatedCustomer?.mobile || "+91 98451 99881",
        email: updatedCustomer?.email || "suresh.m@example.com",
        code: updatedCustomer?.craCode || "CUST-SURESH",
        city: "Bengaluru",
        isConvertedFromCustomer: updatedCustomer?.isConvertedToCRA || false,
        hasDualRole: updatedCustomer?.hasDualRole || false
      }

      const newState: WorkflowState = {
        ...globalState,
        customer: updatedCustomer,
        currentUser: newUser,
        isCustomerLoggedIn: true
      }
      updateGlobalState(newState)
      return
    }

    const personaBeneficiaries = getPersonaBeneficiaries(newUser)
    const newState: WorkflowState = {
      ...globalState,
      currentUser: newUser,
      beneficiaries: personaBeneficiaries,
      isCustomerLoggedIn: false
    }
    updateGlobalState(newState)
  }

  // Beneficiary Management
  const addBeneficiary = (ben: Omit<Beneficiary, "id">) => {
    const newBen: Beneficiary = {
      ...ben,
      id: `ben-${Date.now().toString().slice(-4)}`
    }
    const newState = {
      ...globalState,
      beneficiaries: [...globalState.beneficiaries, newBen]
    }
    updateGlobalState(newState)
    return newBen
  }

  const updateBeneficiary = (id: string, updated: Partial<Beneficiary>) => {
    const newState = {
      ...globalState,
      beneficiaries: globalState.beneficiaries.map(b => b.id === id ? { ...b, ...updated } : b)
    }
    updateGlobalState(newState)
  }

  const removeBeneficiary = (id: string) => {
    const newState = {
      ...globalState,
      beneficiaries: globalState.beneficiaries.filter(b => b.id !== id)
    }
    updateGlobalState(newState)
  }

  // Prescription Upload & Callback Request
  const addPrescriptionRequest = (req: {
    customerName: string
    mobile: string
    fileName?: string
    notes?: string
  }) => {
    const newReq: PrescriptionRequest = {
      id: `RX-${Math.floor(100 + Math.random() * 900)}`,
      customerName: req.customerName,
      mobile: req.mobile,
      fileName: req.fileName || "Uploaded_Prescription.pdf",
      notes: req.notes || "Callback requested for doctor consultation",
      requestedAt: "Just now",
      status: "Pending Review",
      recommendedTests: ["Fasting Blood Sugar", "HbA1c", "Thyroid Profile (TSH)"]
    }
    const newState = {
      ...globalState,
      prescriptionRequests: [newReq, ...globalState.prescriptionRequests]
    }
    updateGlobalState(newState)
    return newReq
  }

  // Set customer referral status (Referred with 20% discount vs Regular)
  const setCustomerReferral = (isReferred: boolean, code?: string, referrerName?: string) => {
    const newState: WorkflowState = {
      ...globalState,
      customer: {
        ...globalState.customer,
        isReferred,
        referralCode: isReferred ? (code || "AVM-SREERAM-C1") : undefined,
        referrerName: isReferred ? (referrerName || "THURAKA SREERAM") : undefined
      }
    }
    updateGlobalState(newState)
  }

  // Customer Login / Logout State
  const loginCustomer = (profile?: Partial<CustomerProfile>) => {
    const rawCustomer: CustomerProfile = profile 
      ? { 
          ...globalState.customer, 
          ...profile,
          isReferred: profile.isReferred !== undefined ? profile.isReferred : globalState.customer.isReferred,
          referrerName: profile.referrerName !== undefined ? profile.referrerName : (profile.isReferred === false ? undefined : globalState.customer.referrerName),
          referralCode: profile.referralCode !== undefined ? profile.referralCode : (profile.isReferred === false ? undefined : globalState.customer.referralCode)
        } 
      : globalState.customer

    const cleanLetters = (rawCustomer.name || "USER").replace(/[^A-Za-z]/g, "").slice(0, 7).toUpperCase() || "USER"
    const autoRefCode = rawCustomer.generatedReferralCode || `REF-${cleanLetters}-10`
    const updatedCustomer: CustomerProfile = {
      ...rawCustomer,
      hasGeneratedReferral: true,
      generatedReferralCode: autoRefCode
    }

    const newCustomerUser: CRAUser = {
      id: updatedCustomer.id || "CUST-981",
      role: "customer",
      name: updatedCustomer.name || "Customer",
      mobile: updatedCustomer.mobile || "+91 98451 99881",
      email: updatedCustomer.email || "customer@example.com",
      code: updatedCustomer.craCode || `CUST-${cleanLetters}`,
      city: "Bengaluru",
      isConvertedFromCustomer: updatedCustomer.isConvertedToCRA || false,
      hasDualRole: updatedCustomer.hasDualRole || false
    }

    const newState: WorkflowState = {
      ...globalState,
      isCustomerLoggedIn: true,
      customer: updatedCustomer,
      currentUser: newCustomerUser
    }
    updateGlobalState(newState)
  }

  const logoutCustomer = () => {
    const newState: WorkflowState = {
      ...globalState,
      isCustomerLoggedIn: false
    }
    updateGlobalState(newState)
  }

  // Unified credential-based login: maps identifier and password to the correct user & dashboard
  const loginWithCredentials = (
    identifier: string,
    _password?: string,
    portalType: "customer" | "cra" = "customer"
  ): LoginResult => {
    const rawTrimmed = (identifier || "").trim()
    const cleanId = rawTrimmed.toLowerCase()
    const cleanDigits = rawTrimmed.replace(/[\s\-()]/g, "").replace(/^(\+91|91|0)/, "")

    if (!rawTrimmed) {
      return {
        success: false,
        targetUrl: portalType === "cra" ? "/login?role=cra" : "/login",
        role: "customer",
        accountName: "",
        user: globalState.currentUser,
        error: portalType === "cra"
          ? "Please enter your Mobile Number or CRA ID."
          : "Please enter your Mobile Number or Email ID."
      }
    }

    // =========================================================================
    // 1. CRA PARTNER PORTAL LOGIN (Strict role validation: Customers blocked)
    // =========================================================================
    if (portalType === "cra") {
      // Reject obvious customer identities
      const isKnownCustomer =
        cleanId === "suresh" ||
        cleanId === "suresh m" ||
        cleanId === "cust-suresh" ||
        cleanId === "cust-981" ||
        cleanId === "suresh.m@example.com" ||
        cleanId === "customer" ||
        cleanId === "patient"

      if (isKnownCustomer) {
        return {
          success: false,
          targetUrl: "/login?role=cra",
          role: "customer",
          accountName: "Customer Account",
          user: globalState.currentUser,
          error: "Access Denied: You do not have access to the CRA Partner Dashboard. Customer accounts cannot access the CRA Partner Portal. Please use Customer Login."
        }
      }

      // Check exact match in SYSTEM_ACCOUNTS for CRA Partners (C1 or C2)
      const matchedCraAccount = SYSTEM_ACCOUNTS.find((acc) => {
        if (acc.role !== "c1" && acc.role !== "c2") return false
        const codeMatch = acc.code.toLowerCase() === cleanId
        const emailMatch = acc.email.toLowerCase() === cleanId
        const mobileMatch = cleanDigits.length === 10 && acc.mobile.replace(/\D/g, "").slice(-10) === cleanDigits.slice(-10)
        const personaMatch = acc.personaKey === cleanId
        const idMatch = acc.id.toLowerCase() === cleanId
        const aliasMatch = acc.aliases?.some(
          (a) =>
            a.toLowerCase() === cleanId ||
            (cleanDigits.length === 10 && a.replace(/\D/g, "").slice(-10) === cleanDigits.slice(-10))
        )
        return codeMatch || emailMatch || mobileMatch || personaMatch || idMatch || aliasMatch
      })

      if (matchedCraAccount) {
        switchRole(matchedCraAccount.personaKey as any)
        return {
          success: true,
          targetUrl: "/cra/dashboard",
          role: matchedCraAccount.role,
          accountName: matchedCraAccount.name,
          user: globalState.currentUser,
          message: `Authenticated as ${matchedCraAccount.name} (${matchedCraAccount.roleTitle}). Opening Partner Dashboard...`
        }
      }

      // Check dynamic C2 list
      const matchedCustomC2 = globalState.c2List.find((c2) => {
        const idMatch = c2.id.toLowerCase() === cleanId
        const codeMatch = c2.code.toLowerCase() === cleanId
        const nameMatch = c2.name.toLowerCase() === cleanId
        const emailMatch = c2.email?.toLowerCase() === cleanId
        const mobileMatch = cleanDigits.length === 10 && c2.mobile.replace(/\D/g, "").slice(-10) === cleanDigits.slice(-10)
        return idMatch || codeMatch || nameMatch || emailMatch || mobileMatch
      })

      if (matchedCustomC2) {
        switchRole("c2", matchedCustomC2.id)
        return {
          success: true,
          targetUrl: "/cra/dashboard",
          role: "c2",
          accountName: matchedCustomC2.name,
          user: matchedCustomC2,
          message: `Welcome back, ${matchedCustomC2.name}! Opening Partner Dashboard...`
        }
      }

      // Check converted customer who earned CRA status via referral
      if (
        globalState.customer?.isConvertedToCRA &&
        ((cleanDigits.length === 10 && globalState.customer.mobile.replace(/\D/g, "").slice(-10) === cleanDigits.slice(-10)) ||
          globalState.customer.email?.toLowerCase() === cleanId ||
          globalState.customer.referralCode?.toLowerCase() === cleanId)
      ) {
        switchRole("c1")
        return {
          success: true,
          targetUrl: "/cra/dashboard",
          role: "c1",
          accountName: globalState.customer.name,
          user: globalState.currentUser,
          message: `Welcome back CRA Partner ${globalState.customer.name}! Opening Partner Dashboard...`
        }
      }

      // Check standard CRA pattern (e.g. AVM-XXXX-C1 or AVM-XXXX-C2)
      if (/^AVM-[A-Za-z0-9-]+$/i.test(rawTrimmed)) {
        switchRole("c1")
        return {
          success: true,
          targetUrl: "/cra/dashboard",
          role: "c1",
          accountName: globalState.c1.name,
          user: globalState.c1,
          message: `CRA Partner ID verified. Opening Partner Dashboard...`
        }
      }

      // If it doesn't match an authorized CRA partner, DENY ACCESS!
      return {
        success: false,
        targetUrl: "/login?role=cra",
        role: "customer",
        accountName: "",
        user: globalState.currentUser,
        error: "Access Denied: You do not have access to the CRA Partner Dashboard. Only authorized CRA Partners (C1/C2) can access this portal. Please use Customer Login."
      }
    }

    // =========================================================================
    // 2. CUSTOMER PORTAL LOGIN (Always opens Customer Dashboard)
    // =========================================================================

    // A. Check if a CRA Partner is logging into Customer Portal (Dual Role access)
    const matchedCraForCustomerPortal = SYSTEM_ACCOUNTS.find((acc) => {
      if (acc.role !== "c1" && acc.role !== "c2") return false
      const codeMatch = acc.code.toLowerCase() === cleanId
      const emailMatch = acc.email.toLowerCase() === cleanId
      const mobileMatch = cleanDigits.length === 10 && acc.mobile.replace(/\D/g, "").slice(-10) === cleanDigits.slice(-10)
      const personaMatch = acc.personaKey === cleanId
      const idMatch = acc.id.toLowerCase() === cleanId
      const aliasMatch = acc.aliases?.some(
        (a) =>
          a.toLowerCase() === cleanId ||
          (cleanDigits.length === 10 && a.replace(/\D/g, "").slice(-10) === cleanDigits.slice(-10))
      )
      return codeMatch || emailMatch || mobileMatch || personaMatch || idMatch || aliasMatch
    })

    if (matchedCraForCustomerPortal) {
      const craUser = globalState.c2List.find((c) => c.id === matchedCraForCustomerPortal.id) ||
        DEFAULT_C2_LIST.find((c) => c.id === matchedCraForCustomerPortal.id) ||
        (matchedCraForCustomerPortal.id === DEFAULT_C1.id ? DEFAULT_C1 : null)

      // C1 (Sreeram) is the root partner and has NO referrer
      const isSreeram = 
        matchedCraForCustomerPortal.id === "C1-SREERAM" ||
        matchedCraForCustomerPortal.personaKey === "sreeram" ||
        matchedCraForCustomerPortal.name.toUpperCase().includes("SREERAM") ||
        !craUser?.c1Name

      const hasReferrer = isSreeram ? false : Boolean(craUser && craUser.c1Name)
      const referrerName = hasReferrer ? craUser?.c1Name : undefined
      const referralCode = hasReferrer ? (craUser?.c1Id === "C1-SREERAM" ? "AVM-SREERAM-C1" : "AVM-MAHENDRA-C2") : undefined

      const cleanLetters = matchedCraForCustomerPortal.name.replace(/[^A-Za-z]/g, "").slice(0, 7).toUpperCase() || "USER"
      const autoRefCode = matchedCraForCustomerPortal.code || `REF-${cleanLetters}-10`

      const updatedCustomer: CustomerProfile = {
        ...globalState.customer,
        id: `CUST-${matchedCraForCustomerPortal.id}`,
        name: matchedCraForCustomerPortal.name,
        mobile: matchedCraForCustomerPortal.mobile.startsWith("+") ? matchedCraForCustomerPortal.mobile : `+91 ${matchedCraForCustomerPortal.mobile}`,
        email: matchedCraForCustomerPortal.email,
        isReferred: hasReferrer,
        referrerName: referrerName,
        referralCode: referralCode,
        isConvertedToCRA: true,
        hasDualRole: true,
        craCode: matchedCraForCustomerPortal.code,
        hasGeneratedReferral: true,
        generatedReferralCode: autoRefCode
      }

      const newCustomerUser: CRAUser = {
        id: updatedCustomer.id,
        role: "customer",
        name: updatedCustomer.name,
        mobile: updatedCustomer.mobile,
        email: updatedCustomer.email,
        code: updatedCustomer.craCode || "CUST-USER",
        city: "Bengaluru",
        isConvertedFromCustomer: true,
        hasDualRole: true
      }

      const newState: WorkflowState = {
        ...globalState,
        customer: updatedCustomer,
        currentUser: newCustomerUser,
        isCustomerLoggedIn: true
      }
      updateGlobalState(newState)

      return {
        success: true,
        targetUrl: "/customer/dashboard",
        role: "customer",
        accountName: matchedCraForCustomerPortal.name,
        user: updatedCustomer,
        message: `Welcome ${matchedCraForCustomerPortal.name}! Opening Customer Dashboard...`
      }
    }

    // B. Check if matched to configured customer account (e.g. Suresh M.)
    const matchedCustomer = SYSTEM_ACCOUNTS.find(
      (acc) =>
        acc.role === "customer" &&
        (acc.code.toLowerCase() === cleanId ||
          acc.email.toLowerCase() === cleanId ||
          (cleanDigits.length === 10 && acc.mobile.replace(/\D/g, "").slice(-10) === cleanDigits.slice(-10)) ||
          acc.id.toLowerCase() === cleanId ||
          acc.aliases?.some(
            (a) =>
              a.toLowerCase() === cleanId ||
              (cleanDigits.length === 10 && a.replace(/\D/g, "").slice(-10) === cleanDigits.slice(-10))
          ))
    )

    if (matchedCustomer) {
      const updatedCustomer: CustomerProfile = {
        ...globalState.customer,
        id: matchedCustomer.id,
        name: matchedCustomer.name,
        mobile: matchedCustomer.mobile.startsWith("+") ? matchedCustomer.mobile : `+91 ${matchedCustomer.mobile}`,
        email: matchedCustomer.email,
        isReferred: true,
        referrerName: "THURAKA SREERAM",
        referralCode: "AVM-SREERAM-C1",
        hasDualRole: false,
        isConvertedToCRA: false,
        hasGeneratedReferral: true,
        generatedReferralCode: "REF-SURESH-10"
      }

      const newCustomerUser: CRAUser = {
        id: updatedCustomer.id,
        role: "customer",
        name: updatedCustomer.name,
        mobile: updatedCustomer.mobile,
        email: updatedCustomer.email,
        code: "CUST-SURESH",
        city: "Bengaluru",
        isConvertedFromCustomer: false,
        hasDualRole: false
      }

      const newState: WorkflowState = {
        ...globalState,
        customer: updatedCustomer,
        currentUser: newCustomerUser,
        isCustomerLoggedIn: true
      }
      updateGlobalState(newState)

      return {
        success: true,
        targetUrl: "/customer/dashboard",
        role: "customer",
        accountName: matchedCustomer.name,
        user: updatedCustomer,
        message: `Welcome ${matchedCustomer.name}! Opening Customer Dashboard...`
      }
    }

    // C. Any customer email or mobile number
    const isSreeramEmail = cleanId.startsWith("sreeram") || cleanId.includes("sreeram")
    const customerDisplayName = isSreeramEmail
      ? "THURAKA SREERAM"
      : rawTrimmed.includes("@")
        ? rawTrimmed.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
        : cleanDigits.length === 10
          ? `Patient (${cleanDigits.slice(-4)})`
          : rawTrimmed

    const cleanLetters = (customerDisplayName || "USER").replace(/[^A-Za-z]/g, "").slice(0, 7).toUpperCase() || "USER"
    const autoRefCode = isSreeramEmail ? "AVM-SREERAM-C1" : `REF-${cleanLetters}-10`

    const updatedCustomer: CustomerProfile = {
      ...globalState.customer,
      id: isSreeramEmail ? "CUST-C1-SREERAM" : `CUST-${Date.now().toString().slice(-4)}`,
      name: customerDisplayName,
      mobile: cleanDigits.length === 10 ? `+91 ${cleanDigits}` : isSreeramEmail ? "+91 98450 12345" : "+91 98451 99881",
      email: rawTrimmed.includes("@") ? rawTrimmed : isSreeramEmail ? "sreeram.thuraka@avmlabs.com" : "customer@example.com",
      isReferred: false,
      referrerName: undefined,
      referralCode: undefined,
      hasDualRole: isSreeramEmail,
      isConvertedToCRA: isSreeramEmail,
      craCode: isSreeramEmail ? "AVM-SREERAM-C1" : undefined,
      hasGeneratedReferral: true,
      generatedReferralCode: autoRefCode
    }

    const newCustomerUser: CRAUser = {
      id: updatedCustomer.id,
      role: "customer",
      name: updatedCustomer.name,
      mobile: updatedCustomer.mobile,
      email: updatedCustomer.email,
      code: isSreeramEmail ? "AVM-SREERAM-C1" : `CUST-${cleanLetters}`,
      city: "Bengaluru",
      isConvertedFromCustomer: isSreeramEmail,
      hasDualRole: isSreeramEmail
    }

    const newState: WorkflowState = {
      ...globalState,
      customer: updatedCustomer,
      currentUser: newCustomerUser,
      isCustomerLoggedIn: true
    }
    updateGlobalState(newState)

    return {
      success: true,
      targetUrl: "/customer/dashboard",
      role: "customer",
      accountName: customerDisplayName,
      user: updatedCustomer,
      message: `Welcome ${customerDisplayName}! Opening Customer Dashboard...`
    }
  }

  const resetDemo = () => {
    const newState: WorkflowState = {
      currentUser: DEFAULT_C1,
      c1: DEFAULT_C1,
      c2List: DEFAULT_C2_LIST,
      orders: DEFAULT_ORDERS,
      transactions: DEFAULT_TRANSACTIONS,
      liveEvents: DEFAULT_LIVE_EVENTS,
      customer: DEFAULT_CUSTOMER,
      isCustomerLoggedIn: false,
      beneficiaries: DEFAULT_BENEFICIARIES,
      prescriptionRequests: DEFAULT_PRESCRIPTIONS,
      customProfiles: DEFAULT_CUSTOM_PROFILES,
      orgProfile: DEFAULT_ORG_PROFILE,
      withdrawalRequests: []
    }
    updateGlobalState(newState)
  }

  // Introduce a new Partner
  const introduceC2 = (data: { name: string; mobile: string; email: string; city?: string }) => {
    const newC2Id = `C2-${Date.now().toString().slice(-4)}`
    const shortCode = `AVM-${data.name.slice(0, 4).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`
    const newC2: CRAUser = {
      id: newC2Id,
      role: "c2",
      name: data.name,
      mobile: data.mobile,
      email: data.email,
      code: shortCode,
      city: data.city || "Hyderabad",
      c1Id: state.currentUser.id,
      c1Name: state.currentUser.name
    }

    const liveEvent: LiveActivityEvent = {
      id: `EVT-${Date.now()}`,
      type: "new_referral",
      title: "New Referral Partner Joined",
      subtitle: `${data.name} introduced by ${state.currentUser.name}`,
      timestamp: "Just now",
      isLive: true
    }

    const newState = {
      ...state,
      c2List: [newC2, ...state.c2List],
      liveEvents: [liveEvent, ...state.liveEvents.slice(0, 10)]
    }
    updateGlobalState(newState)
    return newC2
  }

  // Create a customer diagnostic test booking
  const createCustomerBooking = (data: {
    customerName: string
    mobile: string
    email: string
    profileId: string
    profileName: string
    cataloguePrice: number
    discount: number
    realizedRevenue: number
    homeCollectionFee: number
    totalPayable: number
    isFamilyMember?: boolean
    collectionAddress?: string
    collectionSlot?: string
    beneficiariesSummary?: {
      name: string
      relation: string
      tests: string[]
    }[]
  }) => {
    const orderNum = `AVM-${Math.floor(1000 + Math.random() * 9000)}`
    const orderId = `ORD-${Date.now().toString().slice(-5)}`

    const newOrder: CustomerOrder = {
      id: orderId,
      orderNumber: orderNum,
      customerName: data.customerName,
      mobile: data.mobile,
      email: data.email,
      profileId: data.profileId,
      profileName: data.profileName,
      cataloguePrice: data.cataloguePrice,
      discount: data.discount,
      realizedRevenue: data.realizedRevenue,
      homeCollectionFee: data.homeCollectionFee,
      totalPayable: data.totalPayable,
      status: "Payment Pending",
      isFamilyMember: data.isFamilyMember ?? false,
      collectionAddress: data.collectionAddress,
      collectionSlot: data.collectionSlot,
      beneficiariesSummary: data.beneficiariesSummary,
      createdByRole: state.currentUser.role === "c2" ? "c2" : "c1",
      creatorId: state.currentUser.id,
      creatorName: state.currentUser.name,
      c1Id: state.currentUser.role === "c2" ? (state.currentUser.c1Id || state.c1.id) : undefined,
      c1Name: state.currentUser.role === "c2" ? (state.currentUser.c1Name || state.c1.name) : undefined,
      createdAt: "Just now"
    }

    const liveEvent: LiveActivityEvent = {
      id: `EVT-${Date.now()}`,
      type: "new_referral",
      title: `New Test Booking: ${orderNum}`,
      subtitle: `${data.customerName} selected ${data.profileName} (₹${data.realizedRevenue} RR)`,
      timestamp: "Just now",
      isLive: true
    }

    const newState = {
      ...state,
      orders: [newOrder, ...state.orders],
      liveEvents: [liveEvent, ...state.liveEvents.slice(0, 10)]
    }
    updateGlobalState(newState)
    return newOrder
  }

  // Customer completes payment -> Automatically credit 30% / 10% incentives to Wallets in real time (strict 2-level cap)
  const payForOrder = (orderId: string, paymentMethod: string) => {
    const order = state.orders.find(o => o.id === orderId)
    if (!order) return null

    const paidTimestamp = "Just now"
    const txnId = `${paymentMethod.slice(0, 3).toUpperCase()}-TXN-${Math.floor(100000 + Math.random() * 900000)}`

    const updatedOrders = state.orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: "Paid" as const,
          paidAt: paidTimestamp,
          paymentMethod,
          transactionId: txnId
        }
      }
      return o
    })

    const newTransactions: WalletTransaction[] = []
    const rr = order.realizedRevenue // e.g. 800

    if (order.isFamilyMember) {
      // CRA Family booking: Customer gets standard 20% discount, CRA earns full 30% direct earning
      const directAmount = Math.round(rr * 0.30)
      newTransactions.push({
        id: `TXN-${Date.now()}-FAM`,
        userId: order.creatorId,
        userRole: order.createdByRole === "c2" ? "c2" : "c1",
        orderId: order.id,
        orderNumber: order.orderNumber,
        customerName: `${order.customerName} (Family Booking)`,
        realizedRevenue: rr,
        incentiveRate: 0.30,
        incentiveAmount: directAmount,
        type: "Direct 30% Incentive",
        date: paidTimestamp,
        status: "Credited to Wallet"
      })
    } else if (order.createdByRole === "c2") {
      // 1. Direct Referrer gets 30% of Realised Revenue
      const directAmount = Math.round(rr * 0.30)
      newTransactions.push({
        id: `TXN-${Date.now()}-DIR`,
        userId: order.creatorId,
        userRole: "c2",
        orderId: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        realizedRevenue: rr,
        incentiveRate: 0.30,
        incentiveAmount: directAmount,
        type: "Direct 30% Incentive",
        date: paidTimestamp,
        status: "Credited to Wallet"
      })

      // 2. Second-Level Introducer gets 10% override of Realised Revenue (if present)
      if (order.c1Id) {
        const overrideAmount = Math.round(rr * 0.10)
        newTransactions.push({
          id: `TXN-${Date.now()}-OVERRIDE`,
          userId: order.c1Id,
          userRole: "c1",
          orderId: order.id,
          orderNumber: order.orderNumber,
          customerName: `${order.customerName} (via ${order.creatorName})`,
          realizedRevenue: rr,
          incentiveRate: 0.10,
          incentiveAmount: overrideAmount,
          type: "Second-Level Referral Bonus (10%)",
          date: paidTimestamp,
          status: "Credited to Wallet"
        })
      }
    } else {
      // Direct Order by C1: Direct Referrer gets 30% of Realised Revenue
      const directAmount = Math.round(rr * 0.30)
      newTransactions.push({
        id: `TXN-${Date.now()}-C1`,
        userId: order.creatorId,
        userRole: "c1",
        orderId: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        realizedRevenue: rr,
        incentiveRate: 0.30,
        incentiveAmount: directAmount,
        type: "Direct 30% Incentive",
        date: paidTimestamp,
        status: "Credited to Wallet"
      })
    }

    const liveEvent: LiveActivityEvent = {
      id: `EVT-${Date.now()}`,
      type: "incentive_credited",
      title: `₹${Math.round(rr * 0.30)} Commission Credited!`,
      subtitle: `${order.customerName} paid ₹${order.totalPayable} (${paymentMethod})`,
      amount: Math.round(rr * 0.30),
      timestamp: "Just now",
      isLive: true
    }

    const newState = {
      ...state,
      orders: updatedOrders,
      transactions: [...newTransactions, ...state.transactions],
      liveEvents: [liveEvent, ...state.liveEvents.slice(0, 10)]
    }
    updateGlobalState(newState)
    return updatedOrders.find(o => o.id === orderId)
  }

  // Get Wallet Details for a specific user ID
  const getUserWallet = (userId: string) => {
    const userTxns = state.transactions.filter(t => t.userId === userId)
    const directTxns = userTxns.filter(t => t.type === "Direct 30% Incentive")
    const overrideTxns = userTxns.filter(t => t.type === "Second-Level Referral Bonus (10%)")

    const directIncentive = directTxns.reduce((sum, t) => sum + t.incentiveAmount, 0)
    const overrideIncentive = overrideTxns.reduce((sum, t) => sum + t.incentiveAmount, 0)
    const totalIncentive = directIncentive + overrideIncentive
    const totalRealizedRevenue = userTxns.reduce((sum, t) => sum + t.realizedRevenue, 0)

    return {
      directIncentive,
      overrideIncentive,
      totalIncentive,
      totalRealizedRevenue,
      transactions: userTxns
    }
  }

  // Simulate a live customer referral happening in real-time
  const simulateLiveReferral = () => {
    const randomTests = [
      { name: "Full Body Wellness Profile", rr: 800 },
      { name: "Executive Heart & Cardiac Risk", rr: 1600 },
      { name: "Women Advanced Wellness Profile", rr: 1200 },
      { name: "Comprehensive Master Health Profile", rr: 800 },
      { name: "Diabetic Comprehensive Management", rr: 960 }
    ]
    const randomNames = ["Vikram Malhotra", "Sneha Roy", "Anand Rao", "Pooja Hegde", "Arjun Nair", "Divya Pillai"]
    const chosenTest = randomTests[Math.floor(Math.random() * randomTests.length)]
    const chosenName = randomNames[Math.floor(Math.random() * randomNames.length)]

    const newOrder = createCustomerBooking({
      customerName: chosenName,
      mobile: `+91 ${Math.floor(90000 + Math.random() * 90000)} ${Math.floor(10000 + Math.random() * 90000)}`,
      email: `${chosenName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      profileId: "pkg-wellness",
      profileName: chosenTest.name,
      cataloguePrice: chosenTest.rr / 0.8,
      discount: (chosenTest.rr / 0.8) * 0.2,
      realizedRevenue: chosenTest.rr,
      homeCollectionFee: 0,
      totalPayable: chosenTest.rr
    })

    // Simulate instant online payment
    setTimeout(() => {
      payForOrder(newOrder.id, "UPI (PhonePe)")
    }, 600)

    return newOrder
  }

  // Create a Custom Diagnostic Profile (Make My Profile)
  const createCustomProfile = (data: {
    brandOrOrgName: string
    profileTitle: string
    description: string
    category: "Wellness & Preventive" | "Cardio-Diabetic" | "Women's Health" | "Senior Care" | "Custom Clinic Panel"
    selectedTestCodes: string[]
    testNames: string[]
    totalMrp: number
    discountedPrice: number
    realizedRevenue: number
    directIncentive: number
  }) => {
    const profileId = `profile-${Date.now().toString().slice(-6)}`
    const newProfile: CRACustomProfile = {
      id: profileId,
      craId: state.currentUser.id,
      craName: state.currentUser.name,
      brandOrOrgName: data.brandOrOrgName,
      profileTitle: data.profileTitle,
      description: data.description,
      category: data.category,
      selectedTestCodes: data.selectedTestCodes,
      testNames: data.testNames,
      totalMrp: data.totalMrp,
      discountedPrice: data.discountedPrice,
      realizedRevenue: data.realizedRevenue,
      directIncentive: data.directIncentive,
      createdAt: "Just now",
      shareLink: typeof window !== "undefined"
        ? `${window.location.origin}/booking?ref=${state.currentUser.code}&profile=${profileId}`
        : `https://avmlabs.com/booking?ref=${state.currentUser.code}&profile=${profileId}`
    }

    const liveEvent: LiveActivityEvent = {
      id: `EVT-${Date.now()}`,
      type: "new_referral",
      title: "New Custom Profile Created",
      subtitle: `"${data.profileTitle}" published by ${state.currentUser.name}`,
      timestamp: "Just now",
      isLive: true
    }

    const newState = {
      ...state,
      customProfiles: [newProfile, ...state.customProfiles],
      liveEvents: [liveEvent, ...state.liveEvents.slice(0, 10)]
    }
    updateGlobalState(newState)
    return newProfile
  }

  const deleteCustomProfile = (profileId: string) => {
    const newState = {
      ...state,
      customProfiles: state.customProfiles.filter(p => p.id !== profileId)
    }
    updateGlobalState(newState)
  }

  const updateOrgProfile = (orgData: Partial<CRAOrgProfile>) => {
    const updated = { ...state.orgProfile, ...orgData }
    const newState = {
      ...state,
      orgProfile: updated
    }
    updateGlobalState(newState)
  }

  // Request Wallet Withdrawal (Encash to Bank)
  const requestWalletWithdrawal = (data: {
    amount: number
    method: "Bank Transfer" | "UPI"
    bankDetails: {
      bankName: string
      accountNumber: string
      ifsc: string
      upiId?: string
    }
  }) => {
    const req: WalletWithdrawalRequest = {
      id: `WD-${Date.now().toString().slice(-6)}`,
      userId: state.currentUser.id,
      userName: state.currentUser.name,
      amount: data.amount,
      method: data.method,
      bankDetails: data.bankDetails,
      requestedAt: "Just now",
      status: "Pending Processing"
    }

    const newState = {
      ...state,
      withdrawalRequests: [req, ...state.withdrawalRequests]
    }
    updateGlobalState(newState)
    return req
  }

  // Generate Customer Referral Code (Flowchart D -> H)
  const generateCustomerReferralCode = () => {
    const customerName = state.customer?.name || "Suresh M."
    const cleanLetters = customerName.replace(/[^A-Za-z]/g, "").slice(0, 4).toUpperCase() || "USER"
    const refCode = `REF-${cleanLetters}-10`

    const updatedCustomer: CustomerProfile = {
      ...state.customer,
      hasGeneratedReferral: true,
      generatedReferralCode: refCode
    }

    const newState: WorkflowState = {
      ...state,
      customer: updatedCustomer
    }
    updateGlobalState(newState)
    return refCode
  }

  // Upgrade / Convert Normal Customer to Active CRA Partner (Flowchart W -> X -> Y -> Z -> AB -> AC)
  const convertCustomerToCRA = (orderAmount: number = 1000) => {
    const customerName = state.customer?.name || "Suresh M."
    const cleanLetters = customerName.replace(/[^A-Za-z]/g, "").slice(0, 4).toUpperCase() || "USER"
    const shortCode = `AVM-${cleanLetters}-${Math.floor(100 + Math.random() * 900)}`
    const newCRAId = `C2-CONV-${Date.now().toString().slice(-4)}`

    // Flowchart: Realized Revenue after 10% Referral Discount
    const referralDiscount = Math.round(orderAmount * 0.10)
    const realizedRevenue = orderAmount - referralDiscount
    const craIncentive = Math.round(realizedRevenue * 0.30) // 30% CRA Incentive

    const updatedCustomer: CustomerProfile = {
      ...state.customer,
      isConvertedToCRA: true,
      hasDualRole: true,
      craCode: shortCode,
      hasGeneratedReferral: true,
      generatedReferralCode: state.customer.generatedReferralCode || `REF-${cleanLetters}-10`
    }

    const convertedCRA: CRAUser = {
      id: newCRAId,
      role: "c2",
      name: customerName,
      mobile: state.customer?.mobile || "9845012345",
      email: state.customer?.email || "suresh.m@example.com",
      code: shortCode,
      city: "Bengaluru",
      c1Id: state.c1.id,
      c1Name: state.c1.name,
      isConvertedFromCustomer: true,
      hasDualRole: true
    }

    const newTransaction: WalletTransaction = {
      id: `tx-conv-${Date.now().toString().slice(-4)}`,
      userId: newCRAId,
      userRole: "c2",
      orderId: `ord-ref-${Date.now().toString().slice(-4)}`,
      orderNumber: `ORD-${Date.now().toString().slice(-5)}`,
      customerName: `Referred Patient (${customerName}'s Referral)`,
      profileName: "Master Health Checkup (10% Referral Discount applied)",
      orderAmount: orderAmount,
      realizedRevenue: realizedRevenue,
      incentiveRate: 0.30,
      incentiveAmount: craIncentive,
      type: "Direct 30% Incentive",
      date: "Just now",
      status: "Credited to Wallet"
    }

    const newLiveEvent: LiveActivityEvent = {
      id: `evt-${Date.now()}`,
      type: "incentive_credited",
      title: `🎉 ${customerName} converted to CRA Partner!`,
      subtitle: `30% Direct Incentive (₹${craIncentive}) credited on referred customer test booking.`,
      amount: craIncentive,
      timestamp: "Just now",
      isLive: true
    }

    const newState: WorkflowState = {
      ...state,
      customer: updatedCustomer,
      currentUser: convertedCRA,
      c2List: [convertedCRA, ...state.c2List.filter((c) => c.id !== newCRAId)],
      transactions: [newTransaction, ...state.transactions],
      liveEvents: [newLiveEvent, ...state.liveEvents]
    }
    updateGlobalState(newState)
    return convertedCRA
  }

  // Upgrade Normal Customer to Active CRA Partner
  const upgradeCustomerToCRA = (orgData?: Partial<CRAOrgProfile>) => {
    return convertCustomerToCRA(1000)
  }

  // Ensure beneficiaries array returned always has Self aligned with active user
  const alignedBeneficiaries = state.beneficiaries.map(b => {
    if (b.relation === "Self" && state.currentUser && state.currentUser.role !== "customer") {
      const isSudheer = state.currentUser.id === "C2-SUDHEER" || state.currentUser.name.toLowerCase().includes("sudheer")
      const isSreeram = state.currentUser.id === "C1-SREERAM" || state.currentUser.name.toLowerCase().includes("sreeram")
      const expectedName = isSudheer ? "Sudheer Reddy" : isSreeram ? "Thuraka Sreeram" : state.currentUser.name
      if (b.fullName === "Suresh M." || (isSudheer && b.fullName !== "Sudheer Reddy")) {
        return { ...b, fullName: expectedName }
      }
    }
    return b
  })

  return {
    ...state,
    beneficiaries: alignedBeneficiaries,
    switchRole,
    resetDemo,
    introduceC2,
    createCustomerBooking,
    payForOrder,
    getUserWallet,
    simulateLiveReferral,
    addBeneficiary,
    updateBeneficiary,
    removeBeneficiary,
    addPrescriptionRequest,
    setCustomerReferral,
    loginCustomer,
    logoutCustomer,
    loginWithCredentials,
    createCustomProfile,
    deleteCustomProfile,
    updateOrgProfile,
    requestWalletWithdrawal,
    upgradeCustomerToCRA,
    convertCustomerToCRA,
    generateCustomerReferralCode
  }
}
