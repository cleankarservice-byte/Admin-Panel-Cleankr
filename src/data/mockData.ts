import { 
  Customer, 
  Partner, 
  Booking, 
  ServiceItem, 
  ServiceChangeRequest, 
  PayoutRecord, 
  RefundRecord, 
  AuditLog, 
  SecurityAlert,
  AdminUser
} from '../types/cleankr';

export const INITIAL_ADMINS: AdminUser[] = [
  {
    uid: 'adm-001',
    email: 'admin@cleankr.co.in',
    displayName: 'Operations Lead (Super Admin)',
    role: 'SUPER_ADMIN',
    isActive: true,
    phoneNumber: '+91 98200 12345',
    createdAt: '2026-01-15T09:00:00Z',
    lastLoginAt: '2026-09-25T08:15:00Z',
    mfaEnabled: true
  },
  {
    uid: 'adm-002',
    email: 'ops@cleankr.co.in',
    displayName: 'Rajesh Sharma',
    role: 'OPERATIONS_ADMIN',
    isActive: true,
    phoneNumber: '+91 98200 54321',
    createdAt: '2026-02-10T10:30:00Z',
    lastLoginAt: '2026-09-24T17:40:00Z',
    mfaEnabled: true
  },
  {
    uid: 'adm-003',
    email: 'finance@cleankr.co.in',
    displayName: 'Pooja Verma',
    role: 'FINANCE_ADMIN',
    isActive: true,
    phoneNumber: '+91 98200 98765',
    createdAt: '2026-03-01T11:00:00Z',
    lastLoginAt: '2026-09-25T07:30:00Z',
    mfaEnabled: true
  },
  {
    uid: 'adm-004',
    email: 'support@cleankr.co.in',
    displayName: 'Anil Deshmukh',
    role: 'SUPPORT_ADMIN',
    isActive: true,
    phoneNumber: '+91 98200 33445',
    createdAt: '2026-04-12T08:00:00Z',
    lastLoginAt: '2026-09-25T08:05:00Z',
    mfaEnabled: false
  }
];

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'srv-deep-clean',
    title: 'Full Home Deep Cleaning',
    category: 'Home Cleaning',
    description: 'Intense chemical scrub, kitchen degreasing, bathroom sanitization, floor buffing.',
    isActive: true,
    iconName: 'Sparkles',
    availableCities: ['Mumbai', 'Pune', 'Bengaluru', 'Delhi NCR'],
    packages: [
      {
        id: 'pkg-1bhk',
        name: '1 BHK Complete Care',
        description: 'Single bedroom, hall, kitchen & bathroom deep sterilization.',
        durationHours: 4,
        price: 2499,
        partnerSharePercent: 75,
        isActive: true
      },
      {
        id: 'pkg-2bhk',
        name: '2 BHK Premium Deep Clean',
        description: 'Two bedrooms, hall, kitchen, balconies & 2 bathrooms complete sanitize.',
        durationHours: 6,
        price: 3699,
        partnerSharePercent: 75,
        isActive: true
      },
      {
        id: 'pkg-3bhk',
        name: '3 BHK Villa & Luxury Clean',
        description: '3 bedrooms, large living space, utility, kitchen and 3 bathrooms.',
        durationHours: 8,
        price: 4999,
        partnerSharePercent: 75,
        isActive: true
      }
    ],
    addOns: [
      { id: 'add-fridge', name: 'Refrigerator Internal Sanitization', price: 349 },
      { id: 'add-chimney', name: 'Kitchen Exhaust / Chimney Degreasing', price: 499 },
      { id: 'add-balcony', name: 'Extra Balcony High Pressure Wash', price: 299 }
    ],
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'srv-kitchen-clean',
    title: 'Kitchen Intensive Degrease',
    category: 'Kitchen',
    description: 'Heavy oil removal, countertop descaling, cabinet scrubbing inside and out.',
    isActive: true,
    iconName: 'Utensils',
    availableCities: ['Mumbai', 'Pune', 'Bengaluru'],
    packages: [
      {
        id: 'pkg-standard-kitchen',
        name: 'Standard Kitchen Deep Scrub',
        description: 'Cabinets, tiles, countertop and grease trap cleaning.',
        durationHours: 3,
        price: 1399,
        partnerSharePercent: 70,
        isActive: true
      }
    ],
    createdAt: '2026-01-05T00:00:00Z'
  },
  {
    id: 'srv-sofa-shampoo',
    title: 'Sofa & Fabric Spa',
    category: 'Upholstery',
    description: 'Injection-extraction shampooing and stain elimination for fabric and leather sofas.',
    isActive: true,
    iconName: 'Armchair',
    availableCities: ['Mumbai', 'Pune', 'Bengaluru', 'Delhi NCR'],
    packages: [
      {
        id: 'pkg-3seater',
        name: '3 Seater Sofa Deep Foam Wash',
        description: 'Anti-allergen shampoo and vacuum extraction for 3 seats.',
        durationHours: 2,
        price: 899,
        partnerSharePercent: 70,
        isActive: true
      },
      {
        id: 'pkg-5seater',
        name: '5 Seater (3+1+1 or L-shape) Spa',
        description: 'Complete moisture vacuuming and fabric protection coating.',
        durationHours: 3,
        price: 1499,
        partnerSharePercent: 70,
        isActive: true
      }
    ],
    createdAt: '2026-01-08T00:00:00Z'
  },
  {
    id: 'srv-bathroom-clean',
    title: 'Bathroom Disinfection & Tile Buffing',
    category: 'Sanitary',
    description: 'Hard water scale removal, chrome polishing, toilet bowl descaling and anti-bacterial fogging.',
    isActive: true,
    iconName: 'Droplets',
    availableCities: ['Mumbai', 'Pune', 'Bengaluru', 'Delhi NCR'],
    packages: [
      {
        id: 'pkg-1bath',
        name: 'Single Washroom Intensive Scrub',
        description: 'Tile descaling, mirrors, fixtures and grout treatment.',
        durationHours: 1.5,
        price: 549,
        partnerSharePercent: 70,
        isActive: true
      },
      {
        id: 'pkg-2bath',
        name: 'Dual Washroom Package',
        description: 'Both master and guest washroom sterilization.',
        durationHours: 3,
        price: 999,
        partnerSharePercent: 70,
        isActive: true
      }
    ],
    createdAt: '2026-01-10T00:00:00Z'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-901',
    uid: 'user-c-901',
    fullName: 'Priya Kulkarni',
    email: 'priya.kulkarni@example.com',
    phoneNumber: '+91 98210 99482',
    status: 'ACTIVE',
    totalBookings: 8,
    totalSpent: 19450,
    rating: 4.9,
    createdAt: '2026-02-14T10:00:00Z',
    addresses: [
      {
        id: 'addr-1',
        label: 'Home',
        flat: 'Flat 902, Tower B, Hiranandani Estate',
        street: 'Ghodbunder Road',
        city: 'Thane, Mumbai',
        pincode: '400607'
      }
    ]
  },
  {
    id: 'cust-902',
    uid: 'user-c-902',
    fullName: 'Vikramaditya Roy',
    email: 'vikram.roy@example.com',
    phoneNumber: '+91 99870 12894',
    status: 'ACTIVE',
    totalBookings: 3,
    totalSpent: 8697,
    rating: 4.8,
    createdAt: '2026-03-01T14:20:00Z',
    addresses: [
      {
        id: 'addr-2',
        label: 'Residence',
        flat: 'Villa 14, Palm Meadows',
        street: 'Whitefield',
        city: 'Bengaluru',
        pincode: '560066'
      }
    ]
  },
  {
    id: 'cust-903',
    uid: 'user-c-903',
    fullName: 'Siddharth Iyer',
    email: 'siddharth.iyer@example.com',
    phoneNumber: '+91 91672 45890',
    status: 'ACTIVE',
    totalBookings: 12,
    totalSpent: 31200,
    rating: 5.0,
    createdAt: '2026-01-20T11:15:00Z',
    addresses: [
      {
        id: 'addr-3',
        label: 'Apartment',
        flat: 'A-404, Raheja Woods',
        street: 'Kalyani Nagar',
        city: 'Pune',
        pincode: '411006'
      }
    ]
  },
  {
    id: 'cust-904',
    uid: 'user-c-904',
    fullName: 'Meera Nair',
    email: 'meera.nair@example.com',
    phoneNumber: '+91 97690 88211',
    status: 'SUSPENDED',
    totalBookings: 2,
    totalSpent: 2998,
    rating: 3.2,
    createdAt: '2026-05-18T09:40:00Z',
    addresses: [
      {
        id: 'addr-4',
        label: 'Home',
        flat: 'C-201, Green Glen Layout',
        street: 'Bellandur',
        city: 'Bengaluru',
        pincode: '560103'
      }
    ]
  }
];

export const INITIAL_PARTNERS: Partner[] = [
  {
    id: 'part-301',
    uid: 'user-p-301',
    fullName: 'Santosh Kamble',
    email: 'santosh.cleankr@partner.in',
    phoneNumber: '+91 98691 33201',
    status: 'ACTIVE',
    skills: ['Full Home Deep Cleaning', 'Sofa & Fabric Spa', 'Kitchen Intensive Degrease'],
    city: 'Mumbai',
    serviceAreas: ['Thane', 'Mulund', 'Powai', 'Ghatkopar'],
    rating: 4.95,
    completedJobsCount: 142,
    totalEarnings: 278500,
    pendingPayout: 12450,
    isAvailable: true,
    documents: {
      idProofUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600',
      idProofType: 'Aadhaar Card',
      policeVerificationUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=600',
      verifiedAt: '2026-01-20T10:00:00Z'
    },
    bankDetails: {
      accountNumber: 'XXXXXX9821',
      ifscCode: 'HDFC0000123',
      bankName: 'HDFC Bank',
      accountHolderName: 'Santosh Kamble'
    },
    createdAt: '2026-01-18T08:00:00Z'
  },
  {
    id: 'part-302',
    uid: 'user-p-302',
    fullName: 'Rameshwar Yadav',
    email: 'rameshwar.cleankr@partner.in',
    phoneNumber: '+91 99201 44510',
    status: 'ACTIVE',
    skills: ['Full Home Deep Cleaning', 'Bathroom Disinfection & Tile Buffing'],
    city: 'Pune',
    serviceAreas: ['Kalyani Nagar', 'Koregaon Park', 'Viman Nagar'],
    rating: 4.88,
    completedJobsCount: 89,
    totalEarnings: 165200,
    pendingPayout: 8200,
    isAvailable: true,
    documents: {
      idProofUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',
      idProofType: 'Voter ID',
      policeVerificationUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600',
      verifiedAt: '2026-02-05T12:00:00Z'
    },
    bankDetails: {
      accountNumber: 'XXXXXX4419',
      ifscCode: 'SBIN0004521',
      bankName: 'State Bank of India',
      accountHolderName: 'Rameshwar Yadav'
    },
    createdAt: '2026-02-01T09:30:00Z'
  },
  {
    id: 'part-303',
    uid: 'user-p-303',
    fullName: 'Mahesh Gounder',
    email: 'mahesh.gounder@partner.in',
    phoneNumber: '+91 98450 67123',
    status: 'PENDING_APPROVAL',
    skills: ['Sofa & Fabric Spa', 'Full Home Deep Cleaning'],
    city: 'Bengaluru',
    serviceAreas: ['Whitefield', 'Indiranagar', 'Koramangala'],
    rating: 5.0,
    completedJobsCount: 0,
    totalEarnings: 0,
    pendingPayout: 0,
    isAvailable: false,
    documents: {
      idProofUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600',
      idProofType: 'Aadhaar Card',
      policeVerificationUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600'
    },
    bankDetails: {
      accountNumber: 'XXXXXX7712',
      ifscCode: 'ICIC0001040',
      bankName: 'ICICI Bank',
      accountHolderName: 'Mahesh Gounder'
    },
    createdAt: '2026-09-24T14:10:00Z'
  },
  {
    id: 'part-304',
    uid: 'user-p-304',
    fullName: 'Gurpreet Singh',
    email: 'gurpreet.singh@partner.in',
    phoneNumber: '+91 98110 55432',
    status: 'SUSPENDED',
    skills: ['Kitchen Intensive Degrease', 'Full Home Deep Cleaning'],
    city: 'Delhi NCR',
    serviceAreas: ['Gurugram', 'South Delhi'],
    rating: 3.4,
    completedJobsCount: 22,
    totalEarnings: 42000,
    pendingPayout: 0,
    isAvailable: false,
    rejectionReason: 'Multiple no-shows and client complaints on safety protocols.',
    createdAt: '2026-03-10T10:00:00Z'
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BK-2026-881',
    customerId: 'cust-901',
    customerName: 'Priya Kulkarni',
    customerPhone: '+91 98210 99482',
    partnerId: 'part-301',
    partnerName: 'Santosh Kamble',
    partnerPhone: '+91 98691 33201',
    serviceId: 'srv-deep-clean',
    serviceTitle: 'Full Home Deep Cleaning',
    packageId: 'pkg-2bhk',
    packageName: '2 BHK Premium Deep Clean',
    date: '2026-09-25',
    timeSlot: '09:00 AM - 01:00 PM',
    address: {
      street: 'Flat 902, Tower B, Hiranandani Estate, Ghodbunder Rd',
      city: 'Thane, Mumbai',
      pincode: '400607'
    },
    totalAmount: 3699,
    partnerPayoutAmount: 2774,
    companyCommissionAmount: 925,
    bookingStatus: 'STARTED',
    paymentStatus: 'PAID',
    paymentMethod: 'ONLINE',
    transactionId: 'TXN_RAZOR_9921448',
    serviceChangePending: true,
    serviceChangeId: 'SCHG-401',
    notes: 'Customer requested special focus on oil stains above modular stove.',
    createdAt: '2026-09-24T18:00:00Z'
  },
  {
    id: 'BK-2026-882',
    customerId: 'cust-903',
    customerName: 'Siddharth Iyer',
    customerPhone: '+91 91672 45890',
    partnerId: 'part-302',
    partnerName: 'Rameshwar Yadav',
    partnerPhone: '+91 99201 44510',
    serviceId: 'srv-bathroom-clean',
    serviceTitle: 'Bathroom Disinfection & Tile Buffing',
    packageId: 'pkg-2bath',
    packageName: 'Dual Washroom Package',
    date: '2026-09-25',
    timeSlot: '02:00 PM - 04:30 PM',
    address: {
      street: 'A-404, Raheja Woods, Kalyani Nagar',
      city: 'Pune',
      pincode: '411006'
    },
    totalAmount: 999,
    partnerPayoutAmount: 699,
    companyCommissionAmount: 300,
    bookingStatus: 'ACCEPTED',
    paymentStatus: 'PAID',
    paymentMethod: 'UPI',
    transactionId: 'UPI_993821094',
    createdAt: '2026-09-25T06:30:00Z'
  },
  {
    id: 'BK-2026-883',
    customerId: 'cust-902',
    customerName: 'Vikramaditya Roy',
    customerPhone: '+91 99870 12894',
    serviceId: 'srv-sofa-shampoo',
    serviceTitle: 'Sofa & Fabric Spa',
    packageId: 'pkg-5seater',
    packageName: '5 Seater (3+1+1 or L-shape) Spa',
    date: '2026-09-26',
    timeSlot: '10:00 AM - 01:00 PM',
    address: {
      street: 'Villa 14, Palm Meadows, Whitefield',
      city: 'Bengaluru',
      pincode: '560066'
    },
    totalAmount: 1499,
    partnerPayoutAmount: 1049,
    companyCommissionAmount: 450,
    bookingStatus: 'CREATED',
    paymentStatus: 'PAID',
    paymentMethod: 'ONLINE',
    transactionId: 'TXN_RAZOR_5541092',
    createdAt: '2026-09-25T07:15:00Z'
  },
  {
    id: 'BK-2026-880',
    customerId: 'cust-901',
    customerName: 'Priya Kulkarni',
    customerPhone: '+91 98210 99482',
    partnerId: 'part-301',
    partnerName: 'Santosh Kamble',
    partnerPhone: '+91 98691 33201',
    serviceId: 'srv-kitchen-clean',
    serviceTitle: 'Kitchen Intensive Degrease',
    packageId: 'pkg-standard-kitchen',
    packageName: 'Standard Kitchen Deep Scrub',
    date: '2026-09-23',
    timeSlot: '11:00 AM - 02:00 PM',
    address: {
      street: 'Flat 902, Tower B, Hiranandani Estate',
      city: 'Thane, Mumbai',
      pincode: '400607'
    },
    totalAmount: 1399,
    partnerPayoutAmount: 979,
    companyCommissionAmount: 420,
    bookingStatus: 'COMPLETED',
    paymentStatus: 'PAID',
    paymentMethod: 'ONLINE',
    transactionId: 'TXN_RAZOR_1192844',
    createdAt: '2026-09-22T14:10:00Z'
  },
  {
    id: 'BK-2026-879',
    customerId: 'cust-904',
    customerName: 'Meera Nair',
    customerPhone: '+91 97690 88211',
    serviceId: 'srv-bathroom-clean',
    serviceTitle: 'Bathroom Disinfection & Tile Buffing',
    packageId: 'pkg-1bath',
    packageName: 'Single Washroom Intensive Scrub',
    date: '2026-09-22',
    timeSlot: '04:00 PM - 05:30 PM',
    address: {
      street: 'C-201, Green Glen Layout, Bellandur',
      city: 'Bengaluru',
      pincode: '560103'
    },
    totalAmount: 549,
    partnerPayoutAmount: 0,
    companyCommissionAmount: 0,
    bookingStatus: 'CANCELLED',
    paymentStatus: 'REFUNDED',
    paymentMethod: 'UPI',
    cancellationReason: 'Customer requested reschedule outside available partner coverage window.',
    cancelledBy: 'CUSTOMER',
    createdAt: '2026-09-21T10:00:00Z'
  }
];

export const INITIAL_SERVICE_CHANGES: ServiceChangeRequest[] = [
  {
    id: 'SCHG-401',
    bookingId: 'BK-2026-881',
    partnerId: 'part-301',
    partnerName: 'Santosh Kamble',
    customerId: 'cust-901',
    customerName: 'Priya Kulkarni',
    currentService: 'Full Home Deep Cleaning',
    currentPackage: '2 BHK Premium Deep Clean (₹3,699)',
    currentPrice: 3699,
    proposedService: 'Full Home Deep Cleaning + Balcony High Pressure Wash',
    proposedPackage: '3 BHK Villa & Luxury Clean (₹4,999) + Balcony Addon',
    proposedPrice: 5298,
    reason: 'Customer has an oversized terrace balcony and converted study room that requires industrial buffing machine. Agreed verbally on site.',
    status: 'PENDING',
    requestedAt: '2026-09-25T08:10:00Z'
  }
];

export const INITIAL_PAYOUTS: PayoutRecord[] = [
  {
    id: 'PO-2026-108',
    partnerId: 'part-301',
    partnerName: 'Santosh Kamble',
    amount: 12450,
    status: 'REQUESTED',
    bankAccount: 'HDFC Bank (XXXXXX9821)',
    requestedAt: '2026-09-25T06:00:00Z'
  },
  {
    id: 'PO-2026-107',
    partnerId: 'part-302',
    partnerName: 'Rameshwar Yadav',
    amount: 8200,
    status: 'PROCESSING',
    bankAccount: 'SBI (XXXXXX4419)',
    referenceNumber: 'NEFT_99210459',
    requestedAt: '2026-09-24T18:30:00Z'
  },
  {
    id: 'PO-2026-106',
    partnerId: 'part-301',
    partnerName: 'Santosh Kamble',
    amount: 19800,
    status: 'PAID',
    bankAccount: 'HDFC Bank (XXXXXX9821)',
    referenceNumber: 'NEFT_88192004',
    requestedAt: '2026-09-18T10:00:00Z',
    processedAt: '2026-09-19T11:20:00Z',
    processedBy: 'Pooja Verma'
  }
];

export const INITIAL_REFUNDS: RefundRecord[] = [
  {
    id: 'REF-2026-051',
    bookingId: 'BK-2026-879',
    customerId: 'cust-904',
    customerName: 'Meera Nair',
    amount: 549,
    reason: 'Customer cancelled prior to partner dispatch due to slot unavailability.',
    status: 'PROCESSED',
    transactionRef: 'RFND_UPI_991823',
    processedBy: 'Pooja Verma',
    createdAt: '2026-09-22T12:00:00Z',
    updatedAt: '2026-09-22T14:15:00Z'
  },
  {
    id: 'REF-2026-052',
    bookingId: 'BK-2026-865',
    customerId: 'cust-902',
    customerName: 'Vikramaditya Roy',
    amount: 899,
    reason: 'Partial refund requested: 1 seater out of 3 was leather which partner could not shampoo.',
    status: 'PENDING',
    createdAt: '2026-09-24T16:40:00Z'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'AUD-8801',
    timestamp: '2026-09-25T08:15:22Z',
    adminEmail: 'admin@cleankr.co.in',
    adminRole: 'SUPER_ADMIN',
    action: 'ADMIN_LOGIN_SUCCESS',
    targetResource: 'AUTH_SESSION',
    newValue: 'Session initialized with MFA OTP verification',
    ipAddress: '152.57.19.42 (Mumbai, IN)',
    status: 'SUCCESS'
  },
  {
    id: 'AUD-8800',
    timestamp: '2026-09-25T07:30:10Z',
    adminEmail: 'finance@cleankr.co.in',
    adminRole: 'FINANCE_ADMIN',
    action: 'PAYOUT_STATUS_UPDATE',
    targetResource: 'PayoutRecord/PO-2026-107',
    previousValue: 'REQUESTED',
    newValue: 'PROCESSING',
    ipAddress: '103.246.40.11 (Pune, IN)',
    status: 'SUCCESS'
  },
  {
    id: 'AUD-8799',
    timestamp: '2026-09-24T18:45:00Z',
    adminEmail: 'ops@cleankr.co.in',
    adminRole: 'OPERATIONS_ADMIN',
    action: 'BOOKING_DISPATCH_MANUAL',
    targetResource: 'Booking/BK-2026-881',
    newValue: 'Assigned to Santosh Kamble (part-301)',
    ipAddress: '14.139.112.98 (Bengaluru, IN)',
    status: 'SUCCESS'
  },
  {
    id: 'AUD-8798',
    timestamp: '2026-09-24T14:15:00Z',
    adminEmail: 'ops@cleankr.co.in',
    adminRole: 'OPERATIONS_ADMIN',
    action: 'PARTNER_ONBOARDING_RECEIVED',
    targetResource: 'Partner/part-303',
    newValue: 'Mahesh Gounder applied for Sofa & Deep Cleaning in Bengaluru',
    ipAddress: '14.139.112.98 (Bengaluru, IN)',
    status: 'SUCCESS'
  }
];

export const INITIAL_SECURITY_ALERTS: SecurityAlert[] = [
  {
    id: 'SEC-901',
    type: 'FAILED_LOGIN',
    severity: 'MEDIUM',
    description: '3 failed password attempts for admin account support@cleankr.co.in within 5 minutes.',
    source: '115.112.89.21 (Moscow, RU) [Proxy/VPN]',
    timestamp: '2026-09-25T04:22:10Z',
    status: 'INVESTIGATING'
  },
  {
    id: 'SEC-902',
    type: 'HIGH_VALUE_REFUND',
    severity: 'LOW',
    description: 'Automated notification: Refund request REF-2026-052 over ₹500 marked for Finance review.',
    source: 'Cleankr Customer Web Portal',
    timestamp: '2026-09-24T16:40:00Z',
    status: 'OPEN'
  }
];
