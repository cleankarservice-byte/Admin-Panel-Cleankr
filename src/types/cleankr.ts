export type AdminRole = 
  | 'SUPER_ADMIN'
  | 'OPERATIONS_ADMIN'
  | 'FINANCE_ADMIN'
  | 'SUPPORT_ADMIN'
  | 'READ_ONLY_ADMIN';

export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  role: AdminRole;
  isActive: boolean;
  phoneNumber?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt?: string;
  mfaEnabled?: boolean;
}

export interface Customer {
  id: string;
  uid?: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING';
  totalBookings: number;
  totalSpent: number;
  rating?: number;
  createdAt: string;
  updatedAt?: string;
  addresses?: Array<{
    id: string;
    label: string;
    flat: string;
    street: string;
    landmark?: string;
    city: string;
    pincode: string;
  }>;
}

export type PartnerStatus = 'PENDING_APPROVAL' | 'ACTIVE' | 'SUSPENDED' | 'REJECTED';

export interface Partner {
  id: string;
  uid?: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  status: PartnerStatus;
  skills: string[];
  city: string;
  serviceAreas?: string[];
  rating: number;
  completedJobsCount: number;
  totalEarnings: number;
  pendingPayout: number;
  isAvailable: boolean;
  onLeave?: boolean;
  documents?: {
    idProofUrl?: string;
    idProofType?: string;
    policeVerificationUrl?: string;
    verifiedAt?: string;
  };
  bankDetails?: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    accountHolderName: string;
  };
  rejectionReason?: string;
  createdAt: string;
  updatedAt?: string;
}

export type BookingStatus =
  | 'CREATED'
  | 'ASSIGNED'
  | 'ACCEPTED'
  | 'ON_THE_WAY'
  | 'ARRIVED'
  | 'STARTED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'FAILED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'REFUNDED' | 'PARTIALLY_REFUNDED' | 'FAILED';

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  partnerId?: string;
  partnerName?: string;
  partnerPhone?: string;
  serviceId: string;
  serviceTitle: string;
  packageId: string;
  packageName: string;
  date: string;
  timeSlot: string;
  address: {
    street: string;
    city: string;
    pincode: string;
    landmark?: string;
  };
  totalAmount: number;
  partnerPayoutAmount: number;
  companyCommissionAmount: number;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: 'ONLINE' | 'UPI' | 'CASH' | 'CARD';
  transactionId?: string;
  serviceChangePending?: boolean;
  serviceChangeId?: string;
  cancellationReason?: string;
  cancelledBy?: 'CUSTOMER' | 'PARTNER' | 'ADMIN';
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  category: string;
  description: string;
  isActive: boolean;
  iconName?: string;
  packages: Array<{
    id: string;
    name: string;
    description: string;
    durationHours: number;
    price: number;
    partnerSharePercent: number;
    isActive: boolean;
  }>;
  addOns?: Array<{
    id: string;
    name: string;
    price: number;
  }>;
  availableCities: string[];
  createdAt: string;
  updatedAt?: string;
}

export type ServiceChangeStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ServiceChangeRequest {
  id: string;
  bookingId: string;
  partnerId: string;
  partnerName: string;
  customerId: string;
  customerName: string;
  currentService: string;
  currentPackage: string;
  currentPrice: number;
  proposedService: string;
  proposedPackage: string;
  proposedPrice: number;
  reason: string;
  status: ServiceChangeStatus;
  reviewedBy?: string;
  reviewerNotes?: string;
  requestedAt: string;
  reviewedAt?: string;
}

export type PayoutStatus = 'REQUESTED' | 'PROCESSING' | 'PAID' | 'REJECTED';

export interface PayoutRecord {
  id: string;
  partnerId: string;
  partnerName: string;
  amount: number;
  status: PayoutStatus;
  bankAccount: string;
  referenceNumber?: string;
  requestedAt: string;
  processedAt?: string;
  processedBy?: string;
  notes?: string;
}

export interface RefundRecord {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  amount: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSED';
  processedBy?: string;
  createdAt: string;
  updatedAt?: string;
  transactionRef?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  adminEmail: string;
  adminRole: AdminRole;
  action: string;
  targetResource: string;
  targetId?: string;
  previousValue?: string;
  newValue?: string;
  ipAddress?: string;
  status: 'SUCCESS' | 'FAILED' | 'BLOCKED';
  metadata?: Record<string, any>;
}

export interface SecurityAlert {
  id: string;
  type: 'FAILED_LOGIN' | 'SUSPICIOUS_IP' | 'PRIVILEGE_CHANGE' | 'HIGH_VALUE_REFUND' | 'UNAUTHORIZED_ACCESS_ATTEMPT';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  source: string;
  timestamp: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
  resolvedBy?: string;
}
