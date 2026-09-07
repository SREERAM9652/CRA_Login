
flowchart TD

    A([New User]) --> B[Register as New Customer]
    B --> C[Complete Customer Onboarding]

    C --> D{Generate Referral Link / Code?}

    D -->|No| E[Continue as Normal Customer]
    E --> F[Customer Dashboard]
    F --> G[Book Tests / My Orders / Reports]
    G --> D

    D -->|Yes| H[Generate Referral Link / Referral Code]
    H --> I[Share Referral with New Customer]

    I --> J[New Customer Registers Using Referral]
    J --> K[Referral Successfully Verified]

    K --> L[Referred Customer Books Tests]
    L --> M[Calculate Test Price]
    M --> N[Apply 10% Referral Discount]
    N --> O[Proceed to Payment]

    O --> P{Payment Successful?}

    P -->|No| Q[Payment Failed / Pending]
    Q --> R[Original Customer Remains Customer]
    R --> S{Try Payment Again?}

    S -->|Yes| O
    S -->|No| T[Referral Process Not Completed]
    T --> D

    P -->|Yes| U[Payment Successfully Completed]
    U --> V[Calculate Realized Revenue]

    V --> W[Convert Original Customer to CRA]

    W --> X[Same User Account]
    X --> Y[Customer Role + CRA Role]

    Y --> Z[CRA Dashboard]

    Z --> Z1[Make a Profile]
    Z --> Z2[Refer New Customer]
    Z --> Z3[My Customers]
    Z --> Z4[My Bookings]
    Z --> Z5[Earnings / Wallet / Ledger]
    Z --> Z6[Test Prices / Price Estimator]

    Y --> AA[Customer Dashboard / Customer Features]

    AA --> AA1[Book Tests]
    AA --> AA2[My Orders]
    AA --> AA3[Reports]
    AA --> AA4[Customer Booking History]

    Z --> AB[Calculate 30% CRA Incentive]
    AB --> AC[Credit Incentive to CRA Wallet / Ledger]

    AC --> AD{Refer Another New Customer?}

    AD -->|Yes| H
    AD -->|No| AE[Continue as CRA + Customer]

    AE --> AF{New Referral?}
    AF -->|Yes| H
    AF -->|No| AG([End])