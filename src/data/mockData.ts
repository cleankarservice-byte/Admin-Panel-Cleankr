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
  AdminUser,
  Hub,
  PriceAuditLog,
  AppGlobalConfig
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

export const INITIAL_HUBS: Hub[] = [
  // 1. Baner Hub
  {
    hubId: 'hub-pune-baner',
    hubName: 'Baner Hub',
    city: 'Pune',
    state: 'Maharashtra',
    serviceAreas: ['Baner', 'Baner Road', 'Pan Card Club Road', 'Veer Bhadra Nagar'],
    pincodes: ['411045'],
    status: 'ACTIVE',
    assignedPartnerIds: ['part-302', 'part-311'],
    createdAt: '2026-01-10T00:00:00Z',
    updatedAt: '2026-09-26T00:00:00Z'
  },
  // 2. Hinjewadi Hub
  {
    hubId: 'hub-pune-hinjewadi',
    hubName: 'Hinjewadi Hub',
    city: 'Pune',
    state: 'Maharashtra',
    serviceAreas: ['Hinjewadi', 'Hinjewadi Phase 1', 'Hinjewadi Phase 2', 'Hinjewadi Phase 3', 'Maan', 'Marunji'],
    pincodes: ['411057'],
    status: 'ACTIVE',
    assignedPartnerIds: ['part-305'],
    createdAt: '2026-01-10T00:00:00Z',
    updatedAt: '2026-09-26T00:00:00Z'
  },
  // 3. Wakad Hub
  {
    hubId: 'hub-pune-wakad',
    hubName: 'Wakad Hub',
    city: 'Pune',
    state: 'Maharashtra',
    serviceAreas: ['Wakad', 'Datta Mandir Road', 'Kaspate Wasti', 'Bhujbal Chowk', 'Shankar Kalat Nagar'],
    pincodes: ['411057', '411033'],
    status: 'ACTIVE',
    assignedPartnerIds: ['part-306'],
    createdAt: '2026-01-10T00:00:00Z',
    updatedAt: '2026-09-26T00:00:00Z'
  },
  // 4. Bopodi Hub
  {
    hubId: 'hub-pune-bopodi',
    hubName: 'Bopodi Hub',
    city: 'Pune',
    state: 'Maharashtra',
    serviceAreas: ['Bopodi', 'Bhau Patil Road', 'Bopodi Gaon', 'Khadki Border'],
    pincodes: ['411020'],
    status: 'ACTIVE',
    assignedPartnerIds: ['part-307'],
    createdAt: '2026-01-10T00:00:00Z',
    updatedAt: '2026-09-26T00:00:00Z'
  },
  // 5. Dapodi Hub
  {
    hubId: 'hub-pune-dapodi',
    hubName: 'Dapodi Hub',
    city: 'Pune',
    state: 'Maharashtra',
    serviceAreas: ['Dapodi', 'Dapodi Bazar', 'Old Mumbai Pune Highway Dapodi', 'Phugewadi Border'],
    pincodes: ['411012'],
    status: 'ACTIVE',
    assignedPartnerIds: ['part-308'],
    createdAt: '2026-01-10T00:00:00Z',
    updatedAt: '2026-09-26T00:00:00Z'
  },
  // 6. Aundh Hub
  {
    hubId: 'hub-pune-aundh',
    hubName: 'Aundh Hub',
    city: 'Pune',
    state: 'Maharashtra',
    serviceAreas: ['Aundh', 'Parihar Chowk', 'DP Road Aundh', 'Sindh Society', 'Medipoint Road', 'Vidyanagar'],
    pincodes: ['411007'],
    status: 'ACTIVE',
    assignedPartnerIds: ['part-309', 'part-311'],
    createdAt: '2026-01-10T00:00:00Z',
    updatedAt: '2026-09-26T00:00:00Z'
  },
  // 7. Pashan Hub
  {
    hubId: 'hub-pune-pashan',
    hubName: 'Pashan Hub',
    city: 'Pune',
    state: 'Maharashtra',
    serviceAreas: ['Pashan', 'Pashan Sus Road', 'Pashan Lake', 'Sutarwadi', 'Abhimanshree Society'],
    pincodes: ['411021', '411008'],
    status: 'ACTIVE',
    assignedPartnerIds: ['part-310'],
    createdAt: '2026-01-10T00:00:00Z',
    updatedAt: '2026-09-26T00:00:00Z'
  },
  // Other Non-Pune Hubs
  {
    hubId: 'hub-mumbai-thane',
    hubName: 'Mumbai Thane & Central Hub',
    city: 'Mumbai',
    state: 'Maharashtra',
    serviceAreas: ['Thane West', 'Thane East', 'Mulund', 'Powai', 'Ghatkopar'],
    pincodes: ['400607', '400080', '400076'],
    status: 'ACTIVE',
    assignedPartnerIds: ['part-301'],
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-09-20T00:00:00Z'
  },
  {
    hubId: 'hub-blr-east',
    hubName: 'Bengaluru East Tech Hub',
    city: 'Bengaluru',
    state: 'Karnataka',
    serviceAreas: ['Whitefield', 'Bellandur', 'Marathahalli', 'Indiranagar'],
    pincodes: ['560066', '560103', '560038'],
    status: 'ACTIVE',
    assignedPartnerIds: ['part-303'],
    createdAt: '2026-01-08T00:00:00Z',
    updatedAt: '2026-09-20T00:00:00Z'
  }
];

export const INITIAL_SERVICES: ServiceItem[] = [
  // 1. BATHROOM - Bathroom Intense Clean
  {
    id: 'srv-bath-intense',
    title: 'Bathroom Intense Clean',
    category: 'BATHROOM',
    description: 'Deep sanitary scrub, tile descaling, stain removal, mirror buffing and odor elimination.',
    isActive: true,
    iconName: 'Droplets',
    displayOrder: 1,
    availableCities: ['Pune', 'Mumbai', 'Bengaluru', 'Delhi NCR'],
    packages: [
      { id: 'pkg-bi-1', name: '1 Bathroom', description: 'Single bathroom intensive deep cleaning.', durationHours: 1.5, price: 450, partnerSharePercent: 70, isActive: true },
      { id: 'pkg-bi-2', name: '2 Bathrooms', description: 'Dual bathroom complete sanitize & scrub.', durationHours: 2.5, price: 850, partnerSharePercent: 70, isActive: true },
      { id: 'pkg-bi-3', name: '3 Bathrooms', description: 'Three bathrooms full revitalization package.', durationHours: 3.5, price: 1250, partnerSharePercent: 70, isActive: true }
    ],
    addOns: [
      { id: 'add-glass-partition', name: 'Glass Partition Add-on', price: 200, isActive: true }
    ],
    priceHistory: [
      { id: 'ph-1', variantName: '1 Bathroom', oldPrice: 400, newPrice: 450, changedBy: 'admin@cleankr.co.in', timestamp: '2026-09-01T10:00:00Z', reason: 'Base price calibration' }
    ],
    createdAt: '2026-01-01T00:00:00Z'
  },
  // 2. BATHROOM - Bathroom Move-in Clean
  {
    id: 'srv-bath-movein',
    title: 'Bathroom Move-in Clean',
    category: 'BATHROOM',
    description: 'Move-in sterilization, deep disinfection of tiles, WC, fittings, drains, and high-touch areas.',
    isActive: true,
    iconName: 'Sparkles',
    displayOrder: 2,
    availableCities: ['Pune', 'Mumbai', 'Bengaluru', 'Delhi NCR'],
    packages: [
      { id: 'pkg-bm-1', name: '1 Bathroom', description: 'Move-in sanitization for 1 bathroom.', durationHours: 2, price: 550, partnerSharePercent: 70, isActive: true },
      { id: 'pkg-bm-2', name: '2 Bathrooms', description: 'Move-in sanitization for 2 bathrooms.', durationHours: 3, price: 950, partnerSharePercent: 70, isActive: true },
      { id: 'pkg-bm-3', name: '3 Bathrooms', description: 'Move-in sanitization for 3 bathrooms.', durationHours: 4, price: 1350, partnerSharePercent: 70, isActive: true }
    ],
    addOns: [
      { id: 'add-glass-partition-2', name: 'Glass Partition Add-on', price: 200, isActive: true }
    ],
    createdAt: '2026-01-02T00:00:00Z'
  },
  // 3. BATHROOM - Bathroom Hard Water Removal
  {
    id: 'srv-bath-hardwater',
    title: 'Bathroom Hard Water Removal',
    category: 'BATHROOM',
    description: 'Specialized scaling treatment for stubborn calcium & magnesium deposits, taps, tiles, and cubicles.',
    isActive: true,
    iconName: 'ShieldAlert',
    displayOrder: 3,
    availableCities: ['Pune', 'Mumbai', 'Bengaluru', 'Delhi NCR'],
    packages: [
      { id: 'pkg-bh-1', name: '1 Bathroom', description: 'Hard water scale removal for 1 bathroom.', durationHours: 2, price: 700, partnerSharePercent: 70, isActive: true },
      { id: 'pkg-bh-2', name: '2 Bathrooms', description: 'Hard water scale removal for 2 bathrooms.', durationHours: 3.5, price: 1100, partnerSharePercent: 70, isActive: true },
      { id: 'pkg-bh-3', name: '3 Bathrooms', description: 'Hard water scale removal for 3 bathrooms.', durationHours: 4.5, price: 1600, partnerSharePercent: 70, isActive: true }
    ],
    addOns: [
      { id: 'add-glass-partition-3', name: 'Glass Partition Add-on', price: 200, isActive: true }
    ],
    createdAt: '2026-01-03T00:00:00Z'
  },
  // 4. KITCHEN - Kitchen Cleaning
  {
    id: 'srv-kitchen-clean',
    title: 'Kitchen Cleaning',
    category: 'KITCHEN',
    description: 'Heavy oil and grease removal, countertop descaling, cabinet scrubbing, sink & exhaust buffing.',
    isActive: true,
    iconName: 'Utensils',
    displayOrder: 4,
    availableCities: ['Pune', 'Mumbai', 'Bengaluru', 'Delhi NCR'],
    packages: [
      { id: 'pkg-kc-std', name: 'Kitchen Cleaning Standard', description: 'Full kitchen intensive degrease and sanitize.', durationHours: 3, price: 1400, partnerSharePercent: 70, isActive: true }
    ],
    addOns: [
      { id: 'add-kc-chimney', name: 'Chimney', price: 200, isActive: true },
      { id: 'add-kc-cabinets', name: 'Cabinets', price: 250, isActive: true },
      { id: 'add-kc-trolleys', name: 'Trolleys', price: 350, isActive: true }
    ],
    createdAt: '2026-01-04T00:00:00Z'
  },
  // 5. FLAT - Flat Deep Cleaning
  {
    id: 'srv-flat-clean',
    title: 'Flat Complete Cleaning',
    category: 'FLAT',
    description: 'Comprehensive deep cleaning across all rooms, windows, balconies, kitchen, and washrooms.',
    isActive: true,
    iconName: 'Home',
    displayOrder: 5,
    availableCities: ['Pune', 'Mumbai', 'Bengaluru', 'Delhi NCR'],
    packages: [
      { id: 'pkg-flat-1bhk', name: '1 BHK', description: 'Complete 1 BHK deep cleaning.', durationHours: 4, price: 3000, partnerSharePercent: 75, isActive: true },
      { id: 'pkg-flat-2bhk', name: '2 BHK', description: 'Complete 2 BHK deep cleaning.', durationHours: 6, price: 5000, partnerSharePercent: 75, isActive: true },
      { id: 'pkg-flat-3bhk', name: '3 BHK', description: 'Complete 3 BHK deep cleaning.', durationHours: 8, price: 7000, partnerSharePercent: 75, isActive: true },
      { id: 'pkg-flat-4bhk', name: '4 BHK', description: 'Complete 4 BHK luxury deep cleaning.', durationHours: 10, price: 9200, partnerSharePercent: 75, isActive: true }
    ],
    createdAt: '2026-01-05T00:00:00Z'
  },
  // 6. OTHER - Balcony
  {
    id: 'srv-balcony-clean',
    title: 'Balcony Cleaning',
    category: 'OTHER',
    description: 'High-pressure wash, railing scrub, floor tile descaling, bird stain removal & sterilization.',
    isActive: true,
    iconName: 'Sun',
    displayOrder: 6,
    availableCities: ['Pune', 'Mumbai', 'Bengaluru', 'Delhi NCR'],
    packages: [
      { id: 'pkg-balc-small', name: 'Small Balcony', description: 'Standard balcony scrub and sanitization.', durationHours: 1, price: 600, partnerSharePercent: 70, isActive: true },
      { id: 'pkg-balc-big', name: 'Big Balcony', description: 'Large or terrace balcony heavy wash.', durationHours: 2, price: 850, partnerSharePercent: 70, isActive: true }
    ],
    createdAt: '2026-01-06T00:00:00Z'
  },
  // 7. OTHER - Cleaning (Fan, Exhaust Fan, Glass Window, Glass Door)
  {
    id: 'srv-fixture-cleaning',
    title: 'Fixture & Glass Cleaning',
    category: 'OTHER',
    description: 'Detailed wiping, degreasing, and streak-free buffing for home fixtures and glass surfaces.',
    isActive: true,
    iconName: 'CheckCircle',
    displayOrder: 7,
    availableCities: ['Pune', 'Mumbai', 'Bengaluru', 'Delhi NCR'],
    packages: [
      { id: 'pkg-fix-fan', name: 'Fan', description: 'Ceiling or table fan blade dust and grease wiping.', durationHours: 0.5, price: 60, partnerSharePercent: 70, isActive: true },
      { id: 'pkg-fix-exhaust', name: 'Exhaust Fan', description: 'Kitchen/bathroom exhaust motor and blade degrease.', durationHours: 0.5, price: 65, partnerSharePercent: 70, isActive: true },
      { id: 'pkg-fix-window', name: 'Glass Window', description: 'Glass window panel & track cleaning.', durationHours: 0.5, price: 300, partnerSharePercent: 70, isActive: true },
      { id: 'pkg-fix-door', name: 'Glass Door', description: 'Full length glass door wiping and streak-free buffing.', durationHours: 0.75, price: 400, partnerSharePercent: 70, isActive: true }
    ],
    createdAt: '2026-01-07T00:00:00Z'
  }
];

export const INITIAL_PRICE_AUDIT_LOGS: PriceAuditLog[] = [
  {
    id: 'PAL-101',
    adminId: 'adm-001',
    adminEmail: 'admin@cleankr.co.in',
    serviceId: 'srv-bath-intense',
    serviceName: 'Bathroom Intense Clean',
    variantId: 'pkg-bi-1',
    variantName: '1 Bathroom',
    oldPrice: 400,
    newPrice: 450,
    timestamp: '2026-09-01T10:00:00Z',
    action: 'PRICE_UPDATE'
  },
  {
    id: 'PAL-102',
    adminId: 'adm-001',
    adminEmail: 'admin@cleankr.co.in',
    serviceId: 'srv-flat-clean',
    serviceName: 'Flat Complete Cleaning',
    variantId: 'pkg-flat-2bhk',
    variantName: '2 BHK',
    oldPrice: 4800,
    newPrice: 5000,
    timestamp: '2026-09-10T14:30:00Z',
    action: 'PRICE_UPDATE'
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
    servingHubId: 'hub-mumbai-thane',
    servingHubName: 'Mumbai Thane & Central Hub',
    addresses: [
      {
        id: 'addr-1',
        label: 'Home',
        flat: 'Flat 902, Tower B, Hiranandani Estate',
        street: 'Ghodbunder Road',
        city: 'Thane, Mumbai',
        pincode: '400607',
        matchedHubId: 'hub-mumbai-thane',
        matchedHubName: 'Mumbai Thane & Central Hub'
      }
    ],
    reviews: [
      {
        id: 'rev-1',
        bookingId: 'BK-2026-880',
        rating: 5,
        comment: 'Santosh did a fantastic job with kitchen degreasing. All oily spots gone completely!',
        date: '2026-09-23T15:00:00Z',
        serviceTitle: 'Kitchen Cleaning',
        partnerName: 'Santosh Kamble'
      }
    ],
    notifications: [
      {
        id: 'notif-1',
        title: 'Booking Confirmed',
        body: 'Your booking BK-2026-881 for 2 BHK Flat Deep Clean is confirmed for 25th Sep.',
        date: '2026-09-24T18:00:00Z',
        channel: 'PUSH_FCM',
        read: true
      },
      {
        id: 'notif-2',
        title: 'Partner Dispatched',
        body: 'Santosh Kamble is on the way to your location in Thane.',
        date: '2026-09-25T08:30:00Z',
        channel: 'PUSH_FCM',
        read: true
      }
    ],
    deletionRequest: {
      requestedAt: '',
      status: 'NONE'
    }
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
    servingHubId: 'hub-blr-east',
    servingHubName: 'Bengaluru East Tech Hub',
    addresses: [
      {
        id: 'addr-2',
        label: 'Residence',
        flat: 'Villa 14, Palm Meadows',
        street: 'Whitefield',
        city: 'Bengaluru',
        pincode: '560066',
        matchedHubId: 'hub-blr-east',
        matchedHubName: 'Bengaluru East Tech Hub'
      }
    ],
    reviews: [
      {
        id: 'rev-2',
        bookingId: 'BK-2026-865',
        rating: 4,
        comment: 'Good cleaning overall, sofa took a bit of time to air dry.',
        date: '2026-09-24T17:00:00Z',
        serviceTitle: 'Fixture & Glass Cleaning',
        partnerName: 'Mahesh Gounder'
      }
    ],
    notifications: [
      {
        id: 'notif-3',
        title: 'Partial Refund Processed',
        body: 'Refund request REF-2026-052 of ₹899 has been approved by the finance desk.',
        date: '2026-09-24T16:45:00Z',
        channel: 'IN_APP',
        read: true
      }
    ],
    deletionRequest: {
      requestedAt: '',
      status: 'NONE'
    }
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
    servingHubId: 'hub-pune-central',
    servingHubName: 'Pune Central Hub',
    addresses: [
      {
        id: 'addr-3',
        label: 'Apartment',
        flat: 'A-404, Raheja Woods',
        street: 'Kalyani Nagar',
        city: 'Pune',
        pincode: '411006',
        matchedHubId: 'hub-pune-central',
        matchedHubName: 'Pune Central Hub'
      }
    ],
    reviews: [
      {
        id: 'rev-3',
        bookingId: 'BK-2026-882',
        rating: 5,
        comment: 'Hard water scale on glass partition and chrome shower heads is completely gone!',
        date: '2026-09-25T17:00:00Z',
        serviceTitle: 'Bathroom Hard Water Removal',
        partnerName: 'Rameshwar Yadav'
      }
    ],
    notifications: [
      {
        id: 'notif-4',
        title: 'Booking Accepted',
        body: 'Rameshwar Yadav has accepted your bathroom hard water removal booking.',
        date: '2026-09-25T06:35:00Z',
        channel: 'PUSH_FCM',
        read: true
      }
    ],
    deletionRequest: {
      requestedAt: '',
      status: 'NONE'
    }
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
    servingHubId: 'hub-blr-east',
    servingHubName: 'Bengaluru East Tech Hub',
    addresses: [
      {
        id: 'addr-4',
        label: 'Home',
        flat: 'C-201, Green Glen Layout',
        street: 'Bellandur',
        city: 'Bengaluru',
        pincode: '560103',
        matchedHubId: 'hub-blr-east',
        matchedHubName: 'Bengaluru East Tech Hub'
      }
    ],
    reviews: [],
    notifications: [
      {
        id: 'notif-5',
        title: 'Refund Credit Settled',
        body: 'Refund of ₹549 credited for cancelled booking BK-2026-879.',
        date: '2026-09-22T14:15:00Z',
        channel: 'SMS_PRIORITY',
        read: true
      }
    ],
    deletionRequest: {
      requestedAt: '2026-09-24T10:00:00Z',
      status: 'PENDING_REVIEW',
      reason: 'Relocating to Singapore, requested erasure under DPDP compliance.',
      notes: 'Customer submitted in-app erasure request; financial booking logs must be retained for tax retention.'
    }
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
    skills: ['Flat Complete Cleaning', 'Kitchen Cleaning', 'Fixture & Glass Cleaning'],
    city: 'Mumbai',
    serviceAreas: ['Thane West', 'Thane East', 'Mulund', 'Powai', 'Ghatkopar'],
    assignedHubIds: ['hub-mumbai-thane'],
    primaryHubId: 'hub-mumbai-thane',
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
    skills: ['Bathroom Intense Clean', 'Bathroom Move-in Clean', 'Bathroom Hard Water Removal'],
    city: 'Pune',
    serviceAreas: ['Kalyani Nagar', 'Koregaon Park', 'Viman Nagar', 'Camp', 'Shivaji Nagar'],
    assignedHubIds: ['hub-pune-central'],
    primaryHubId: 'hub-pune-central',
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
    skills: ['Flat Complete Cleaning', 'Balcony Cleaning'],
    city: 'Bengaluru',
    serviceAreas: ['Whitefield', 'Bellandur', 'Marathahalli', 'Indiranagar'],
    assignedHubIds: ['hub-blr-east'],
    primaryHubId: 'hub-blr-east',
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
    skills: ['Kitchen Cleaning', 'Flat Complete Cleaning'],
    city: 'Delhi NCR',
    serviceAreas: ['Gurugram', 'South Delhi'],
    assignedHubIds: [],
    primaryHubId: '',
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
    serviceId: 'srv-flat-clean',
    serviceTitle: 'Flat Complete Cleaning',
    packageId: 'pkg-flat-2bhk',
    packageName: '2 BHK',
    date: '2026-09-25',
    timeSlot: '09:00 AM - 01:00 PM',
    hubId: 'hub-mumbai-thane',
    hubName: 'Mumbai Thane & Central Hub',
    address: {
      street: 'Flat 902, Tower B, Hiranandani Estate, Ghodbunder Rd',
      city: 'Thane, Mumbai',
      pincode: '400607'
    },
    priceSnapshot: {
      serviceId: 'srv-flat-clean',
      serviceName: 'Flat Complete Cleaning',
      variant: '2 BHK',
      quantity: 1,
      basePrice: 5000,
      addOns: [],
      addOnPrice: 0,
      subtotal: 5000,
      tax: 0,
      discount: 1301,
      totalAmount: 3699,
      priceVersion: 'v1.0.0',
      timestamp: '2026-09-24T18:00:00Z'
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
    refundStatus: 'NONE',
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
    serviceId: 'srv-bath-hardwater',
    serviceTitle: 'Bathroom Hard Water Removal',
    packageId: 'pkg-bh-2',
    packageName: '2 Bathrooms',
    date: '2026-09-25',
    timeSlot: '02:00 PM - 04:30 PM',
    hubId: 'hub-pune-central',
    hubName: 'Pune Central Hub',
    address: {
      street: 'A-404, Raheja Woods, Kalyani Nagar',
      city: 'Pune',
      pincode: '411006'
    },
    priceSnapshot: {
      serviceId: 'srv-bath-hardwater',
      serviceName: 'Bathroom Hard Water Removal',
      variant: '2 Bathrooms',
      quantity: 1,
      basePrice: 1100,
      addOns: [],
      addOnPrice: 0,
      subtotal: 1100,
      tax: 0,
      discount: 101,
      totalAmount: 999,
      priceVersion: 'v1.0.0',
      timestamp: '2026-09-25T06:30:00Z'
    },
    totalAmount: 999,
    partnerPayoutAmount: 699,
    companyCommissionAmount: 300,
    bookingStatus: 'ACCEPTED',
    paymentStatus: 'PAID',
    paymentMethod: 'UPI',
    transactionId: 'UPI_993821094',
    refundStatus: 'NONE',
    createdAt: '2026-09-25T06:30:00Z'
  },
  {
    id: 'BK-2026-883',
    customerId: 'cust-902',
    customerName: 'Vikramaditya Roy',
    customerPhone: '+91 99870 12894',
    serviceId: 'srv-kitchen-clean',
    serviceTitle: 'Kitchen Cleaning',
    packageId: 'pkg-kc-std',
    packageName: 'Kitchen Cleaning Standard',
    date: '2026-09-26',
    timeSlot: '10:00 AM - 01:00 PM',
    hubId: 'hub-blr-east',
    hubName: 'Bengaluru East Tech Hub',
    address: {
      street: 'Villa 14, Palm Meadows, Whitefield',
      city: 'Bengaluru',
      pincode: '560066'
    },
    priceSnapshot: {
      serviceId: 'srv-kitchen-clean',
      serviceName: 'Kitchen Cleaning',
      variant: 'Kitchen Cleaning Standard',
      quantity: 1,
      basePrice: 1400,
      addOns: [],
      addOnPrice: 0,
      subtotal: 1400,
      tax: 0,
      discount: 0,
      totalAmount: 1400,
      priceVersion: 'v1.0.0',
      timestamp: '2026-09-25T07:15:00Z'
    },
    totalAmount: 1400,
    partnerPayoutAmount: 980,
    companyCommissionAmount: 420,
    bookingStatus: 'CREATED',
    paymentStatus: 'PAID',
    paymentMethod: 'ONLINE',
    transactionId: 'TXN_RAZOR_5541092',
    refundStatus: 'NONE',
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
    serviceTitle: 'Kitchen Cleaning',
    packageId: 'pkg-kc-std',
    packageName: 'Kitchen Cleaning Standard',
    date: '2026-09-23',
    timeSlot: '11:00 AM - 02:00 PM',
    hubId: 'hub-mumbai-thane',
    hubName: 'Mumbai Thane & Central Hub',
    address: {
      street: 'Flat 902, Tower B, Hiranandani Estate',
      city: 'Thane, Mumbai',
      pincode: '400607'
    },
    priceSnapshot: {
      serviceId: 'srv-kitchen-clean',
      serviceName: 'Kitchen Cleaning',
      variant: 'Kitchen Cleaning Standard',
      quantity: 1,
      basePrice: 1400,
      addOns: [],
      addOnPrice: 0,
      subtotal: 1400,
      tax: 0,
      discount: 1,
      totalAmount: 1399,
      priceVersion: 'v1.0.0',
      timestamp: '2026-09-22T14:10:00Z'
    },
    totalAmount: 1399,
    partnerPayoutAmount: 979,
    companyCommissionAmount: 420,
    bookingStatus: 'COMPLETED',
    paymentStatus: 'PAID',
    paymentMethod: 'ONLINE',
    transactionId: 'TXN_RAZOR_1192844',
    refundStatus: 'NONE',
    createdAt: '2026-09-22T14:10:00Z'
  },
  {
    id: 'BK-2026-879',
    customerId: 'cust-904',
    customerName: 'Meera Nair',
    customerPhone: '+91 97690 88211',
    serviceId: 'srv-bath-movein',
    serviceTitle: 'Bathroom Move-in Clean',
    packageId: 'pkg-bm-1',
    packageName: '1 Bathroom',
    date: '2026-09-22',
    timeSlot: '04:00 PM - 05:30 PM',
    hubId: 'hub-blr-east',
    hubName: 'Bengaluru East Tech Hub',
    address: {
      street: 'C-201, Green Glen Layout, Bellandur',
      city: 'Bengaluru',
      pincode: '560103'
    },
    priceSnapshot: {
      serviceId: 'srv-bath-movein',
      serviceName: 'Bathroom Move-in Clean',
      variant: '1 Bathroom',
      quantity: 1,
      basePrice: 550,
      addOns: [],
      addOnPrice: 0,
      subtotal: 550,
      tax: 0,
      discount: 1,
      totalAmount: 549,
      priceVersion: 'v1.0.0',
      timestamp: '2026-09-21T10:00:00Z'
    },
    totalAmount: 549,
    partnerPayoutAmount: 0,
    companyCommissionAmount: 0,
    bookingStatus: 'CANCELLED',
    paymentStatus: 'REFUNDED',
    paymentMethod: 'UPI',
    cancellationReason: 'Customer requested reschedule outside available partner coverage window.',
    cancelledBy: 'CUSTOMER',
    refundStatus: 'PROCESSED',
    refundAmount: 549,
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
    currentService: 'Flat Complete Cleaning',
    currentPackage: '2 BHK (₹5,000)',
    currentPrice: 3699,
    proposedService: 'Flat Complete Cleaning + Balcony High Pressure Wash',
    proposedPackage: '3 BHK (₹7,000) + Balcony Addon',
    proposedPrice: 7600,
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
    newValue: 'Assigned to Santosh Kamble (part-301) for Hub Mumbai Thane',
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
    newValue: 'Mahesh Gounder applied for Sofa & Deep Cleaning in Bengaluru East Hub',
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

export const INITIAL_APP_CONFIG: AppGlobalConfig = {
  companyName: 'Cleankr Services India Private Limited',
  supportEmail: 'support@cleankr.co.in',
  supportPhone: '+91 1800 200 4567',
  supportWhatsapp: '+91 91580 04567',
  commissionRate: 25,
  cancellationGraceMinutes: 30,
  isMaintenanceMode: false,
  maintenanceMessage: 'Cleankr services are temporarily paused for scheduled maintenance. We will be back online shortly!',
  minCustomerAppVersion: '1.0.0',
  minPartnerAppVersion: '1.0.0',
  activeAnnouncement: '🎉 Flat ₹100 OFF on your first Pune Deep Cleaning! Use code PUNE100',
  isAnnouncementActive: true,
  banners: [
    {
      id: 'ban-001',
      title: 'Monsoon Home Refresh',
      subtitle: 'Intense Bathroom Clean starting at ₹450',
      badgeText: 'POPULAR',
      actionType: 'SERVICE',
      actionTarget: 'srv-001',
      displayOrder: 1,
      isActive: true
    },
    {
      id: 'ban-002',
      title: 'Full Flat Deep Cleaning',
      subtitle: '1 BHK to 4 BHK sanitized by verified partners',
      badgeText: 'UP TO 20% OFF',
      actionType: 'CATEGORY',
      actionTarget: 'FLAT',
      displayOrder: 2,
      isActive: true
    }
  ],
  updatedAt: new Date().toISOString(),
  updatedBy: 'system@cleankr.co.in'
};
