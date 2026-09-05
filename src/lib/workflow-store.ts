"use client"

import { useState, useEffect } from "react"

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

export const DEFAULT_BENEFICIARIES: Beneficiary[] = [
  {
    id: "ben-1",
    fullName: "Suresh M.",
    relation: "Self",
    age: 42,
    gender: "Male",
    address: "#42, 12th Cross, HAL 2nd Stage, Indiranagar",
    city: "Bengaluru",
    pincode: "560038",
    selectedTests: ["pkg-fullbody"]
  },
  {
    id: "ben-2",
    fullName: "Ramanathan M.",
    relation: "Father",
    age: 70,
    gender: "Male",
    address: "#42, 12th Cross, HAL 2nd Stage, Indiranagar",
    city: "Bengaluru",
    pincode: "560038",
    selectedTests: ["pkg-diabetes"]
  },
  {
    id: "ben-3",
    fullName: "Lakshmi M.",
    relation: "Mother",
    age: 65,
    gender: "Female",
    address: "#42, 12th Cross, HAL 2nd Stage, Indiranagar",
    city: "Bengaluru",
    pincode: "560038",
    selectedTests: ["pkg-senior"]
  },
  {
    id: "ben-4",
    fullName: "Priya S.",
    relation: "Wife",
    age: 39,
    gender: "Female",
    address: "#42, 12th Cross, HAL 2nd Stage, Indiranagar",
    city: "Bengaluru",
    pincode: "560038",
    selectedTests: ["pkg-women"]
  }
]

export const DEFAULT_PRESCRIPTIONS: PrescriptionRequest[] = [
  {
    id: "RX-901",
    customerName: "Suresh M.",
    mobile: "+91 98450 12345",
    uploadedFileUrl: "/hero_diagnostic_lab.jpg",
    fileName: "Dr_Sharma_Prescription_Aug2026.pdf",
    notes: "Doctor advised 3-month follow up for fasting sugar and thyroid.",
    requestedAt: "Today, 09:30 AM",
    status: "Pending Review",
    recommendedTests: ["HbA1c Glycated Hemoglobin", "Fasting Blood Sugar", "Thyroid Profile (TSH)"]
  }
]

export const DEFAULT_CUSTOMER: CustomerProfile = {
  id: "CUST-981",
  name: "Suresh M.",
  mobile: "+91 98450 12345",
  email: "suresh.m@example.com",
  isReferred: true,
  referralCode: "AVM-SREERAM-C1",
  referrerName: "THURAKA SREERAM",
  walletBalance: 350,
  cashbackEarned: 150,
  activeCoupons: ["WELLNESS20", "HEALTH100"]
}

// -------------------------------------------------------------
// 4 REAL PERSONA ACCOUNTS CONFIGURED FOR 2-LEVEL REAL WORLD FLOW
// -------------------------------------------------------------

// 1. THURAKA SREERAM (C1 - Primary CRA Partner)
export const DEFAULT_C1: CRAUser = {
  id: "C1-SREERAM",
  role: "c1",
  name: "THURAKA SREERAM",
  mobile: "+91 98450 12345",
  email: "sreeram.thuraka@avmlabs.com",
  code: "AVM-SREERAM-C1",
  city: "Hyderabad"
}

// 2, 3, 4: SUB-PARTNERS
export const DEFAULT_C2_LIST: CRAUser[] = [
  // 2. SUDHEER REDDY (C2 under Sreeram)
  {
    id: "C2-SUDHEER",
    role: "c2",
    name: "SUDHEER REDDY",
    mobile: "+91 98860 54321",
    email: "sudheer.reddy@avmlabs.com",
    code: "AVM-SUDHEER-C2",
    city: "Bengaluru",
    c1Id: "C1-SREERAM",
    c1Name: "THURAKA SREERAM"
  },
  // 3. SAI MAHENDRA (C2 under Sreeram & Introducer of Vishnu)
  {
    id: "C2-MAHENDRA",
    role: "c2",
    name: "SAI MAHENDRA",
    mobile: "+91 97400 98765",
    email: "sai.mahendra@avmlabs.com",
    code: "AVM-MAHENDRA-C2",
    city: "Pune",
    c1Id: "C1-SREERAM",
    c1Name: "THURAKA SREERAM"
  },
  // 4. VISHNU (C2 introduced by Sai Mahendra)
  {
    id: "C2-VISHNU",
    role: "c2",
    name: "VISHNU VARDHAN",
    mobile: "+91 98220 77112",
    email: "vishnu.vardhan@avmlabs.com",
    code: "AVM-VISHNU-C2",
    city: "Vijayawada",
    c1Id: "C2-MAHENDRA",
    c1Name: "SAI MAHENDRA"
  }
]

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
}

const STORAGE_KEY = "avm_workflow_state_v8"

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
      prescriptionRequests: DEFAULT_PRESCRIPTIONS
    }
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      const parsed = JSON.parse(data)
      // Validate that currentUser matches current personas
      if (parsed.currentUser && parsed.c1 && parsed.c2List) {
        return {
          ...parsed,
          customer: parsed.customer || DEFAULT_CUSTOMER,
          isCustomerLoggedIn: parsed.isCustomerLoggedIn ?? false,
          beneficiaries: parsed.beneficiaries || DEFAULT_BENEFICIARIES,
          prescriptionRequests: parsed.prescriptionRequests || DEFAULT_PRESCRIPTIONS
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
    prescriptionRequests: DEFAULT_PRESCRIPTIONS
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
        newUser = state.c2List.find(c => c.id === customC2Id) || DEFAULT_C2_LIST[0]
      } else {
        newUser = DEFAULT_C2_LIST[0]
      }
    } else {
      newUser = {
        id: "CUST-981",
        role: "customer",
        name: state.customer?.name || "Suresh M.",
        mobile: state.customer?.mobile || "+91 98450 12345",
        email: state.customer?.email || "suresh.m@example.com",
        code: "CUST-SURESH",
        city: "Bengaluru"
      }
    }

    const newState = {
      ...state,
      currentUser: newUser,
      isCustomerLoggedIn: roleOrPersona === "customer" ? true : state.isCustomerLoggedIn
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
      ...state,
      beneficiaries: [...state.beneficiaries, newBen]
    }
    updateGlobalState(newState)
    return newBen
  }

  const updateBeneficiary = (id: string, updated: Partial<Beneficiary>) => {
    const newState = {
      ...state,
      beneficiaries: state.beneficiaries.map(b => b.id === id ? { ...b, ...updated } : b)
    }
    updateGlobalState(newState)
  }

  const removeBeneficiary = (id: string) => {
    const newState = {
      ...state,
      beneficiaries: state.beneficiaries.filter(b => b.id !== id)
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
      ...state,
      prescriptionRequests: [newReq, ...state.prescriptionRequests]
    }
    updateGlobalState(newState)
    return newReq
  }

  // Set customer referral status (Referred with 20% discount vs Regular)
  const setCustomerReferral = (isReferred: boolean, code?: string, referrerName?: string) => {
    const newState = {
      ...state,
      customer: {
        ...state.customer,
        isReferred,
        referralCode: isReferred ? (code || "AVM-RAMESH-C1") : undefined,
        referrerName: isReferred ? (referrerName || "Ramesh Gupta") : undefined
      }
    }
    updateGlobalState(newState)
  }

  // Customer Login / Logout State
  const loginCustomer = (profile?: Partial<CustomerProfile>) => {
    const updatedCustomer = profile ? { ...state.customer, ...profile } : state.customer
    const newState: WorkflowState = {
      ...state,
      isCustomerLoggedIn: true,
      customer: updatedCustomer
    }
    updateGlobalState(newState)
  }

  const logoutCustomer = () => {
    const newState: WorkflowState = {
      ...state,
      isCustomerLoggedIn: false
    }
    updateGlobalState(newState)
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
      prescriptionRequests: DEFAULT_PRESCRIPTIONS
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

    if (order.createdByRole === "c2") {
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

  return {
    ...state,
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
    logoutCustomer
  }
}
