# AVMLabs CRA Dashboard — Master Backend API & JSON Integration Contract
> **Document Version:** 1.0.0  
> **Target Audience:** Backend Developers, API Engineers, QA & Frontend Integration Team  
> **Base URL:** `https://api.avmlabs.com/v1` (Production) / `http://localhost:5000/api/v1` (Development)  
> **Authentication:** Bearer Token via HTTP Header: `Authorization: Bearer <JWT_TOKEN>`  
> **Content-Type:** `application/json`

---

## Table of Contents
1. [Core Commercial Rules & Business Logic](#1-core-commercial-rules--business-logic)
2. [Global Standards (Headers, Response Formats & Errors)](#2-global-standards)
3. [Module 1: Authentication & User Session](#module-1-authentication--user-session)
4. [Module 2: Dashboard Overview & Real-Time Performance](#module-2-dashboard-overview--real-time-performance)
5. [Module 3: Make My Profile (Custom Health Panel Bundler)](#module-3-make-my-profile-custom-health-panel-bundler)
6. [Module 4: Family Beneficiaries Management](#module-4-family-beneficiaries-management)
7. [Module 5: Add Referral & Test Booking (Referral & Family Modes)](#module-5-add-referral--test-booking)
8. [Module 6: My Leads & Referral Order Pipeline](#module-6-my-leads--referral-order-pipeline)
9. [Module 7: My Team & Secondary Partner Network (C1 -> C2 Tiering)](#module-7-my-team--secondary-partner-network)
10. [Module 8: Wellness Catalogue & 100+ Tests Master](#module-8-wellness-catalogue--100-tests-master)
11. [Module 9: Cost Estimator & Patient Quotation](#module-9-cost-estimator--patient-quotation)
12. [Module 10: Wallet, Ledger & Withdrawal Requests](#module-10-wallet-ledger--withdrawal-requests)
13. [Module 11: Payout History & Bi-Monthly Settlements](#module-11-payout-history--bi-monthly-settlements)
14. [Module 12: Client Reminders (90-Day Retest Retain Loop)](#module-12-client-reminders-90-day-retest-loop)
15. [Module 13: Activity & Incentive Notifications](#module-13-activity--incentive-notifications)
16. [Module 14: Profile, Bank Settlement & KYC Management](#module-14-profile-bank-settlement--kyc-management)
17. [Frontend Field to Backend Key Cross-Reference](#frontend-field-to-backend-key-cross-reference)

---

## 1. Core Commercial Rules & Business Logic

Every calculation on the backend **MUST strictly respect** these financial rules confirmed across the CRA frontend:

| Rule Name | Formula / Percentage | Description |
| :--- | :--- | :--- |
| **Customer Discount** | **20%** | Standard 20% discount on test/package MRP for every customer booking through a CRA referral link. |
| **Realized Revenue (RR)** | `Catalogue MRP - Customer Discount` (80% of MRP) | The revenue actually collected by AVMLabs after the 20% discount. **All commissions are calculated on RR, NEVER on MRP.** |
| **Direct CRA Incentive** | **30% of RR** | The direct commission credited to the CRA who referred the customer (C1 or C2). Example: MRP ₹1,000 → RR ₹800 → CRA earns **₹240**. |
| **Team Override Bonus** | **10% of RR** | When a Secondary partner (C2) makes a sale, the introducing Primary partner (C1) receives an automatic 10% override. Example: RR ₹800 → C2 earns **₹240**, C1 earns **₹80**. |
| **2-Level Cap** | Strictly 2 Tiers Maximum | The referral structure strictly terminates at 2 levels: C1 (Primary) and C2 (Secondary). C2 partners cannot introduce C3 partners who earn overrides from C1. |
| **Family Booking Policy** | 20% Customer Discount + 30% CRA Direct Commission | When a CRA books tests for their own family members, their family gets the standard 20% discount, and the CRA still earns the full 30% direct commission in their wallet. |
| **Logistics Fee** | ₹0 or ₹200 | Home sample collection charge. Billed separately and sits **outside** the incentive split. |

---

## 2. Global Standards

### Standard Success Response Wrapper
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation completed successfully",
  "data": {},
  "meta": {
    "timestamp": "2026-09-08T11:00:00.000Z",
    "requestId": "req_8829104812"
  }
}
```

### Standard Paginated Response Wrapper
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Data retrieved successfully",
  "data": [],
  "pagination": {
    "totalRecords": 128,
    "page": 1,
    "pageSize": 10,
    "totalPages": 13,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Standard Error Response Wrapper
```json
{
  "success": false,
  "statusCode": 400,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input provided",
    "details": [
      {
        "field": "mobile",
        "message": "Mobile number must be a valid 10-digit Indian number"
      }
    ]
  },
  "meta": {
    "timestamp": "2026-09-08T11:00:00.000Z"
  }
}
```

---

## Module 1: Authentication & User Session

### 1.1 Login with Credentials (Unified Portal Login)
- **Method:** `POST`
- **Endpoint:** `/api/v1/auth/login`
- **Frontend Source:** `workflow-store.ts` (`loginWithCredentials`)
- **Access:** Public

#### Request Body
```json
{
  "identifier": "+91 98450 12345",
  "password": "Password@123",
  "portalType": "cra"
}
```

#### Response Body (`200 OK`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Authenticated as THURAKA SREERAM (Primary CRA Partner).",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "ref_881920491823...",
    "targetUrl": "/cra/dashboard",
    "user": {
      "id": "C1-SREERAM",
      "role": "c1",
      "personaKey": "sreeram",
      "name": "THURAKA SREERAM",
      "roleTitle": "Primary CRA Partner (C1)",
      "code": "AVM-SREERAM-C1",
      "mobile": "+91 98450 12345",
      "email": "sreeram.thuraka@avmlabs.com",
      "city": "Hyderabad",
      "badgeColor": "emerald",
      "isConvertedFromCustomer": false,
      "hasDualRole": true,
      "c1Id": null,
      "c1Name": null
    }
  }
}
```

### 1.2 Get Current User Profile (Session Hydration)
- **Method:** `GET`
- **Endpoint:** `/api/v1/auth/me`
- **Access:** Bearer Auth

#### Response Body (`200 OK`)
```json
{
  "success": true,
  "data": {
    "id": "C1-SREERAM",
    "role": "c1",
    "name": "THURAKA SREERAM",
    "code": "AVM-SREERAM-C1",
    "mobile": "+91 98450 12345",
    "email": "sreeram.thuraka@avmlabs.com",
    "city": "Hyderabad",
    "c1Id": null,
    "c1Name": null,
    "isConvertedFromCustomer": false,
    "hasDualRole": true
  }
}
```

---

## Module 2: Dashboard Overview & Real-Time Performance

### 2.1 Get CRA Dashboard Overview
- **Method:** `GET`
- **Endpoint:** `/api/v1/cra/dashboard/overview`
- **Frontend Source:** `app/cra/dashboard/page.tsx`
- **Access:** Bearer Auth

#### Response Body (`200 OK`)
```json
{
  "success": true,
  "data": {
    "partner": {
      "id": "C1-SREERAM",
      "name": "THURAKA SREERAM",
      "role": "c1",
      "roleLabel": "Primary Partner (C1)",
      "code": "AVM-SREERAM-C1",
      "city": "Hyderabad",
      "introducer": null,
      "referralUrl": "https://avmlabs.com/booking?ref=AVM-SREERAM-C1",
      "whatsappShareText": "Hello! 👋 Book certified diagnostic lab tests with AVM Labs through THURAKA SREERAM.\n\n🎁 Special Partner Discount: 20% OFF\n🏠 Free Home Sample Collection & Smart WhatsApp Reports\n\nBook now: https://avmlabs.com/booking?ref=AVM-SREERAM-C1"
    },
    "thisMonthPerformance": {
      "totalRealizedRevenue": 14720,
      "totalIncentive": 3968,
      "directIncentive": 3440,
      "overrideIncentive": 528,
      "activeLeadsCount": 12,
      "incentiveBreakdownLabel": "30% + 10% bonus"
    },
    "recentActivity": [
      {
        "id": "TXN-8801",
        "orderId": "ORD-8820",
        "orderNumber": "AVM-8820",
        "customerName": "Anita Rao",
        "initials": "AR",
        "type": "Direct 30% Incentive",
        "realizedRevenue": 800,
        "incentiveRate": 0.30,
        "incentiveAmount": 240,
        "date": "10 mins ago",
        "status": "Credited to Wallet",
        "isDirect": true,
        "subtitle": "Direct Referral • Diagnostic Test"
      },
      {
        "id": "TXN-8802",
        "orderId": "ORD-8821",
        "orderNumber": "AVM-8821",
        "customerName": "Sunil Sharma (via SUDHEER REDDY)",
        "initials": "SS",
        "type": "Second-Level Referral Bonus (10%)",
        "realizedRevenue": 800,
        "incentiveRate": 0.10,
        "incentiveAmount": 80,
        "date": "30 mins ago",
        "status": "Credited to Wallet",
        "isDirect": false,
        "subtitle": "via Secondary Team (SUDHEER REDDY)"
      }
    ]
  }
}
```

---

## Module 3: Make My Profile (Custom Health Panel Bundler)

### 3.1 List Published Custom Profiles
- **Method:** `GET`
- **Endpoint:** `/api/v1/cra/custom-profiles`
- **Query Params:** `search`, `category`, `sortBy`, `page`, `pageSize`

#### Response Body (`200 OK`)
```json
{
  "success": true,
  "data": [
    {
      "id": "profile-yoga-vitality",
      "craId": "C1-SREERAM",
      "craName": "THURAKA SREERAM",
      "brandOrOrgName": "Yoga & Wellness Center",
      "profileTitle": "Yoga Complete Detox & Vitality Profile",
      "description": "Curated diagnostic wellness panel designed for yoga practitioners to monitor metabolic rate, cellular hydration, and endocrine harmony.",
      "category": "Wellness & Preventive",
      "selectedTestCodes": ["H6", "FBS", "LIPID", "TSH", "VITD"],
      "testNames": [
        "Complete Blood Count (CBC)",
        "Fasting Blood Sugar (FBS)",
        "Lipid Profile (Cholesterol & Triglycerides)",
        "Thyroid Stimulating Hormone (TSH)",
        "Vitamin D 25-Hydroxy"
      ],
      "totalMrp": 2800,
      "discountedPrice": 2240,
      "realizedRevenue": 2240,
      "directIncentive": 672,
      "createdAt": "Yesterday",
      "shareLink": "https://avmlabs.com/booking?ref=AVM-SREERAM-C1&profile=profile-yoga-vitality"
    }
  ],
  "pagination": {
    "totalRecords": 5,
    "page": 1,
    "pageSize": 10,
    "totalPages": 1
  }
}
```

### 3.2 Create a New Custom Profile
- **Method:** `POST`
- **Endpoint:** `/api/v1/cra/custom-profiles`

#### Request Body
```json
{
  "brandOrOrgName": "Apex Heart & Life Care",
  "profileTitle": "Executive Cardio-Vascular Risk Assessment",
  "description": "Specialized clinical panel curated for executive lifestyle screening and cardiovascular health tracking.",
  "category": "Cardio-Diabetic",
  "selectedTestCodes": ["H6", "HBA1C", "LIPID", "KFT", "CRP"]
}
```

#### Response Body (`201 Created`)
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Custom profile created and published successfully",
  "data": {
    "id": "profile-cardio-99881",
    "craId": "C1-SREERAM",
    "craName": "THURAKA SREERAM",
    "brandOrOrgName": "Apex Heart & Life Care",
    "profileTitle": "Executive Cardio-Vascular Risk Assessment",
    "description": "Specialized clinical panel curated for executive lifestyle screening and cardiovascular health tracking.",
    "category": "Cardio-Diabetic",
    "selectedTestCodes": ["H6", "HBA1C", "LIPID", "KFT", "CRP"],
    "testNames": [
      "Complete Blood Count (CBC)",
      "HbA1c Glycated Hemoglobin",
      "Lipid Profile Comprehensive",
      "Kidney Function Test (KFT)",
      "High Sensitivity CRP (hs-CRP)"
    ],
    "totalMrp": 3400,
    "discountedPrice": 2720,
    "realizedRevenue": 2720,
    "directIncentive": 816,
    "createdAt": "Just now",
    "shareLink": "https://avmlabs.com/booking?ref=AVM-SREERAM-C1&profile=profile-cardio-99881"
  }
}
```

### 3.3 Delete a Custom Profile
- **Method:** `DELETE`
- **Endpoint:** `/api/v1/cra/custom-profiles/:id`

#### Response Body (`200 OK`)
```json
{
  "success": true,
  "message": "Custom profile deleted successfully"
}
```

### 3.4 Get & Update CRA Organization / Clinic Branding
- **Endpoints:**
  - `GET /api/v1/cra/org-profile`
  - `PUT /api/v1/cra/org-profile`

#### Request Body (`PUT`)
```json
{
  "brandName": "Apex Health & Wellness Studio",
  "diagnosticCenterName": "Apex Diagnostic Collection Center",
  "category": "Doctor / Clinic",
  "tagline": "Certified Diagnostic Collection Center (Powered by AVM Labs)",
  "address": "Shop #4, Ground Floor, Jubilee Hills Checkpost, Hyderabad",
  "contactPhone": "+91 98450 12345",
  "isCustomProfileActive": true
}
```

---

## Module 4: Family Beneficiaries Management

### 4.1 List Family Beneficiaries
- **Method:** `GET`
- **Endpoint:** `/api/v1/cra/beneficiaries`

#### Response Body (`200 OK`)
```json
{
  "success": true,
  "data": [
    {
      "id": "ben-sreeram-1",
      "fullName": "Thuraka Sreeram",
      "relation": "Self",
      "age": 42,
      "gender": "Male",
      "address": "#18, Green Glen Layout, Bellandur",
      "city": "Hyderabad",
      "pincode": "500081",
      "selectedTests": ["test-H6", "test-CUA"]
    },
    {
      "id": "ben-sreeram-2",
      "fullName": "Venkata Subbaiah T.",
      "relation": "Father",
      "age": 72,
      "gender": "Male",
      "address": "#18, Green Glen Layout, Bellandur",
      "city": "Hyderabad",
      "pincode": "500081",
      "selectedTests": ["pkg-senior"]
    }
  ]
}
```

### 4.2 Add New Beneficiary
- **Method:** `POST`
- **Endpoint:** `/api/v1/cra/beneficiaries`

#### Request Body
```json
{
  "fullName": "Savitri T.",
  "relation": "Mother",
  "age": 67,
  "gender": "Female",
  "address": "#18, Green Glen Layout, Bellandur",
  "city": "Hyderabad",
  "pincode": "500081",
  "selectedTests": ["test-H6"]
}
```

#### Response Body (`201 Created`)
```json
{
  "success": true,
  "message": "Beneficiary created successfully",
  "data": {
    "id": "ben-9912",
    "fullName": "Savitri T.",
    "relation": "Mother",
    "age": 67,
    "gender": "Female",
    "address": "#18, Green Glen Layout, Bellandur",
    "city": "Hyderabad",
    "pincode": "500081",
    "selectedTests": ["test-H6"]
  }
}
```

---

## Module 5: Add Referral & Test Booking

### 5.1 Create Diagnostic Test Booking
- **Method:** `POST`
- **Endpoint:** `/api/v1/cra/bookings`

#### Case A: Referral Mode Payload
```json
{
  "bookingMode": "referral",
  "isFamilyMember": false,
  "customerName": "Anita Rao",
  "mobile": "+91 98765 43210",
  "email": "anita.rao@example.com",
  "city": "Bengaluru",
  "pincode": "560038",
  "collectionAddress": "#42, 12th Cross, Indiranagar, Bengaluru - 560038",
  "collectionSlot": "2026-09-09 07:30 AM",
  "selectedItems": [
    {
      "id": "test-H6",
      "type": "test",
      "code": "H6",
      "name": "Complete Blood Count (CBC)",
      "mrp": 350
    },
    {
      "id": "test-CUA",
      "type": "test",
      "code": "CUA",
      "name": "Complete Urine Analysis",
      "mrp": 250
    }
  ],
  "notes": "Patient prefers morning collection before 8:00 AM."
}
```

#### Case B: Family Booking Mode Payload
```json
{
  "bookingMode": "family",
  "isFamilyMember": true,
  "collectionAddress": "#18, Green Glen Layout, Bellandur, Hyderabad - 500081",
  "collectionSlot": "2026-09-10 08:00 AM",
  "familyMembers": [
    {
      "beneficiaryId": "ben-sreeram-1",
      "name": "Thuraka Sreeram",
      "relation": "Self",
      "selectedItemIds": ["test-H6", "test-CUA"]
    },
    {
      "beneficiaryId": "ben-sreeram-2",
      "name": "Venkata Subbaiah T.",
      "relation": "Father",
      "selectedItemIds": ["pkg-senior"]
    }
  ],
  "notes": "Elderly father needs gentle phlebotomist collection."
}
```

#### Response Body (`201 Created`)
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Test booking created successfully",
  "data": {
    "orderId": "ORD-88291",
    "orderNumber": "AVM-8829",
    "customerName": "Anita Rao",
    "mobile": "+91 98765 43210",
    "email": "anita.rao@example.com",
    "profileName": "Complete Blood Count (CBC) + Complete Urine Analysis",
    "cataloguePrice": 600,
    "discount": 120,
    "realizedRevenue": 480,
    "homeCollectionFee": 0,
    "totalPayable": 480,
    "status": "Payment Pending",
    "isFamilyMember": false,
    "paymentLink": "https://avmlabs.com/checkout?order=AVM-8829",
    "commercialBreakdown": {
      "directIncentive": 144,
      "teamOverride": 48,
      "incentiveRate": 0.30
    },
    "createdAt": "2026-09-08T11:05:00.000Z"
  }
}
```

---

## Module 6: My Leads & Referral Order Pipeline

### 6.1 List Leads & Referrals
- **Method:** `GET`
- **Endpoint:** `/api/v1/cra/leads`
- **Query Params:** `filter`, `search`, `page`, `pageSize`

#### Response Body (`200 OK`)
```json
{
  "success": true,
  "data": [
    {
      "id": "LEAD-101",
      "orderId": "ORD-8820",
      "avatar": "AR",
      "name": "Anita Rao",
      "mobile": "+91 98765 43210",
      "city": "Pune",
      "packageName": "Full Body Wellness Profile",
      "parameters": 62,
      "realizedRevenue": 800,
      "directIncentive": 240,
      "teamBonus": 80,
      "owner": "me",
      "c2PartnerName": null,
      "status": "Report Delivered",
      "statusSubtext": "Report delivered • via you",
      "date": "28 Aug 2026, 10:30 AM"
    }
  ],
  "pagination": {
    "totalRecords": 12,
    "page": 1,
    "pageSize": 10,
    "totalPages": 2
  }
}
```

### 6.2 Update Lead Status
- **Method:** `PATCH`
- **Endpoint:** `/api/v1/cra/leads/:id/status`

#### Request Body
```json
{
  "status": "Test Scheduled",
  "statusSubtext": "Sample collection scheduled for tomorrow 7:30 AM"
}
```

---

## Module 7: My Team & Secondary Partner Network

### 7.1 Get Team Summary & Secondary CRA List
- **Method:** `GET`
- **Endpoint:** `/api/v1/cra/team`

#### Response Body (`200 OK`)
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalPartners": 2,
      "teamRevenue": 5360,
      "totalOverrideEarned": 536,
      "customersReferredByTeam": 5
    },
    "members": [
      {
        "id": "C2-01",
        "avatar": "SR",
        "name": "SUDHEER REDDY",
        "code": "AVM-SUDH-102",
        "mobile": "+91 98860 54321",
        "email": "sudheer.reddy@example.com",
        "city": "Bengaluru",
        "joinedDate": "Mar 2025",
        "customersCount": 3,
        "totalRR": 2320,
        "overrideIncentive": 232,
        "status": "Active"
      }
    ]
  }
}
```

### 7.2 Introduce / Register New Secondary CRA Partner (C2)
- **Method:** `POST`
- **Endpoint:** `/api/v1/cra/team/introduce`

#### Request Body
```json
{
  "name": "Ramesh Kumar",
  "mobile": "+91 98450 67890",
  "email": "ramesh.kumar@example.com",
  "city": "Hyderabad"
}
```

#### Response Body (`201 Created`)
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Secondary CRA partner registered successfully",
  "data": {
    "id": "C2-9921",
    "name": "Ramesh Kumar",
    "role": "c2",
    "code": "AVM-RAME-481",
    "mobile": "+91 98450 67890",
    "email": "ramesh.kumar@example.com",
    "city": "Hyderabad",
    "c1Id": "C1-SREERAM",
    "c1Name": "THURAKA SREERAM",
    "partnerInviteLink": "https://avmlabs.com/login?role=cra&ref=AVM-RAME-481",
    "status": "Active"
  }
}
```

---

## Module 8: Wellness Catalogue & 100+ Tests Master

### 8.1 List Diagnostic Tests & Wellness Packages
- **Method:** `GET`
- **Endpoint:** `/api/v1/catalog/tests`
- **Query Params:** `search`, `category`, `technology`, `page`, `pageSize`

#### Response Body (`200 OK`)
```json
{
  "success": true,
  "data": [
    {
      "code": "H6",
      "name": "Complete Blood Count (CBC)",
      "category": "Hematology",
      "technology": "Automated Blood Cell Counter",
      "sample": "EDTA Whole Blood",
      "catalogueRate": 350,
      "discount": 70,
      "realizedRevenue": 280,
      "c1Incentive": 84,
      "c2Override": 28
    }
  ],
  "pagination": {
    "totalRecords": 104,
    "page": 1,
    "pageSize": 10,
    "totalPages": 11
  }
}
```

---

## Module 9: Cost Estimator & Patient Quotation

### 9.1 Calculate Multi-Test Quotation
- **Method:** `POST`
- **Endpoint:** `/api/v1/cra/estimate/calculate`

#### Request Body
```json
{
  "testCodes": ["CUA", "H6", "TSH", "VITDC"],
  "patientDetails": {
    "name": "Ms. Priya Sharma",
    "phone": "+91 98765 43210",
    "email": "priya.sharma@email.com",
    "date": "08 Sep 2026"
  },
  "isCustomerCopy": true
}
```

#### Response Body (`200 OK`)
```json
{
  "success": true,
  "data": {
    "patientDetails": {
      "name": "Ms. Priya Sharma",
      "phone": "+91 98765 43210",
      "email": "priya.sharma@email.com",
      "date": "08 Sep 2026"
    },
    "tests": [
      {
        "code": "CUA",
        "name": "Complete Urine Analysis",
        "category": "Clinical Pathology",
        "mrp": 250,
        "discount": 50,
        "finalPrice": 200,
        "c1Incentive": 60,
        "c2Override": 20
      }
    ],
    "financialSummary": {
      "totalCatalogueMrp": 2750,
      "customerDiscountAmount": 550,
      "totalRealizedRevenue": 2200,
      "totalC1DirectIncentive": 660,
      "totalC2OverrideIncentive": 220,
      "netCompanyShare": 1320
    }
  }
}
```

---

## Module 10: Wallet, Ledger & Withdrawal Requests

### 10.1 Get Wallet Balances & Summary
- **Method:** `GET`
- **Endpoint:** `/api/v1/cra/wallet`

#### Response Body (`200 OK`)
```json
{
  "success": true,
  "data": {
    "currentAccruedBalance": 3968,
    "totalRealizedRevenue": 14720,
    "directIncentiveTotal": 3440,
    "teamOverrideTotal": 528,
    "nextPayoutDate": "15 Sept 2026",
    "totalPaidOutLifetime": 172600
  }
}
```

### 10.2 Get Transaction Ledger (Passbook)
- **Method:** `GET`
- **Endpoint:** `/api/v1/cra/wallet/transactions`
- **Query Params:** `status`, `type`, `search`, `page`, `pageSize`

#### Response Body (`200 OK`)
```json
{
  "success": true,
  "data": [
    {
      "id": "TXN-8801",
      "avatar": "AR",
      "orderId": "ORD-8820",
      "customerName": "Anita Rao",
      "source": "Direct Referral",
      "owner": "me",
      "profileName": "Full Body Wellness Profile",
      "realizedRevenue": 800,
      "rateApplied": "30% Direct",
      "incentiveAmount": 240,
      "date": "28 Aug 2026, 10:30 AM",
      "status": "Credited to Wallet"
    }
  ],
  "pagination": {
    "totalRecords": 14,
    "page": 1,
    "pageSize": 10,
    "totalPages": 2
  }
}
```

### 10.3 Submit Wallet Withdrawal Request (Encash to Bank)
- **Method:** `POST`
- **Endpoint:** `/api/v1/cra/wallet/withdraw`

#### Request Body
```json
{
  "amount": 2500,
  "method": "Bank Transfer",
  "bankDetails": {
    "bankName": "HDFC Bank Ltd",
    "accountNumber": "50100293849182",
    "ifsc": "HDFC0001234",
    "upiId": "sreeram.thuraka@okhdfcbank"
  }
}
```

#### Response Body (`201 Created`)
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Withdrawal request submitted successfully. Transfer will be processed within 24 bank working hours.",
  "data": {
    "withdrawalId": "WD-991820",
    "amount": 2500,
    "method": "Bank Transfer",
    "status": "Pending Processing",
    "requestedAt": "2026-09-08T11:10:00.000Z"
  }
}
```

---

## Module 11: Payout History & Bi-Monthly Settlements

### 11.1 List Payout Settlements
- **Method:** `GET`
- **Endpoint:** `/api/v1/cra/payouts`
- **Query Params:** `search`, `filter`, `page`, `pageSize`

#### Response Body (`200 OK`)
```json
{
  "success": true,
  "data": [
    {
      "id": "PAY-2026-08A",
      "payoutDate": "15 Aug 2026",
      "period": "01 Aug 2026 – 15 Aug 2026",
      "amount": 14400,
      "mode": "Bank NEFT Transfer",
      "account": "HDFC Bank •••• 4892",
      "utr": "HDFC9823419082",
      "status": "Settled & Transferred"
    }
  ],
  "pagination": {
    "totalRecords": 12,
    "page": 1,
    "pageSize": 10,
    "totalPages": 2
  }
}
```

---

## Module 12: Client Reminders (90-Day Retest Loop)

### 12.1 List Retest Reminders
- **Method:** `GET`
- **Endpoint:** `/api/v1/cra/reminders`

#### Response Body (`200 OK`)
```json
{
  "success": true,
  "data": {
    "stats": {
      "overdueCount": 5,
      "dueSoonCount": 3,
      "potentialRepeatEarnings": 3312
    },
    "clients": [
      {
        "id": "REM-01",
        "avatar": "SS",
        "customerName": "Sunil Sharma",
        "mobile": "+91 98450 99887",
        "city": "Pune",
        "lastTestDate": "28 May 2026",
        "lastProfile": "Full Body Wellness Profile",
        "realizedRevenue": 800,
        "repeatIncentive": 240,
        "daysAgo": 92,
        "status": "Overdue",
        "statusLabel": "Due for 90-Day Retest",
        "retestBookingLink": "https://avmlabs.com/booking?ref=AVM-SREERAM-C1&retest=REM-01"
      }
    ]
  }
}
```

---

## Module 13: Activity & Incentive Notifications

### 13.1 List Notifications
- **Method:** `GET`
- **Endpoint:** `/api/v1/cra/notifications`

#### Response Body (`200 OK`)
```json
{
  "success": true,
  "data": [
    {
      "id": "NOTIF-01",
      "type": "payout",
      "badgeText": "Incentive Credited",
      "title": "Direct Incentive Credited (+₹240)",
      "description": "Anita Rao completed online payment for Full Body Wellness Panel. ₹240 cash incentive added to your wallet balance.",
      "timestamp": "10 mins ago",
      "read": false
    }
  ]
}
```

---

## Module 14: Profile, Bank Settlement & KYC Management

### 14.1 Get Profile & Banking Details
- **Method:** `GET`
- **Endpoint:** `/api/v1/cra/profile`

#### Response Body (`200 OK`)
```json
{
  "success": true,
  "data": {
    "personal": {
      "name": "THURAKA SREERAM",
      "mobile": "+91 98450 12345",
      "email": "sreeram.thuraka@avmlabs.com",
      "code": "AVM-SREERAM-C1",
      "role": "c1",
      "roleTitle": "Primary CRA Partner (C1)"
    },
    "banking": {
      "bankName": "HDFC Bank",
      "accountNumber": "50100293849182",
      "ifsc": "HDFC0001234",
      "upiId": "sreeram.thuraka@okhdfcbank"
    },
    "kyc": {
      "pan": "ABCDE1234F",
      "panStatus": "Verified",
      "aadhaar": "•••• •••• 8912",
      "aadhaarStatus": "Verified",
      "craAgreementStatus": "Signed & Active",
      "isKycComplete": true
    },
    "assignedBde": {
      "name": "Vikram Sharma",
      "designation": "Senior BDE",
      "phone": "+91 98765 43210",
      "email": "bde.support@avmlabs.com"
    }
  }
}
```

### 14.2 Update Personal & Banking Information
- **Method:** `PUT`
- **Endpoint:** `/api/v1/cra/profile`

#### Request Body
```json
{
  "name": "THURAKA SREERAM",
  "email": "sreeram.thuraka@avmlabs.com",
  "bankName": "HDFC Bank",
  "accountNumber": "50100293849182",
  "ifsc": "HDFC0001234",
  "upiId": "sreeram.thuraka@okhdfcbank"
}
```

---

## Frontend Field to Backend Key Cross-Reference

| Frontend State / Prop (`Next.js`) | Backend JSON Field | Type | Description |
| :--- | :--- | :--- | :--- |
| `currentUser.name` | `user.name` | `string` | Partner full legal name |
| `currentUser.code` | `user.code` | `string` | Referral code (e.g. `AVM-SREERAM-C1`) |
| `currentUser.role` | `user.role` | `"c1" \| "c2"` | Tier role: Primary (C1) or Secondary (C2) |
| `wallet.totalRealizedRevenue` | `totalRealizedRevenue` | `number` | Sum of RR (`totalMrp * 0.80`) |
| `wallet.totalIncentive` | `totalIncentive` | `number` | Direct 30% + Override 10% earned |
| `bookingMode` | `bookingMode` | `"referral" \| "family"` | Selected booking flow |
| `selectedBenIds` | `familyMembers[].beneficiaryId` | `string[]` | Chosen family beneficiary IDs |
| `memberTestsMap` | `familyMembers[].selectedItemIds` | `Record<string, string[]>` | Mapping of each member to their tests |
| `selectedTestCodes` | `selectedTestCodes` | `string[]` | Array of test codes in custom profile |
| `brandName` | `brandOrOrgName` | `string` | Clinic or partner brand title |
| `rateApplied` | `rateApplied` | `"30% Direct" \| "10% Override"` | Tier commission rate badge |
| `payouts.utr` | `utr` | `string` | Bank NEFT transaction reference number |
| `reminders.daysAgo` | `daysAgo` | `number` | Days since last diagnostic test |
