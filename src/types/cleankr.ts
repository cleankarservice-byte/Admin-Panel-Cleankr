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

export interface CustomerReview {
  id: string;
  bookingId: string;
  rating: number;
  comment: string;
  date: string;
  serviceTitle?: string;
  partnerName?: string;
}

export interface CustomerNotification {
  id: string;
  title: string;
  body: string;
  date: string;
  channel: 'PUSH_FCM' | 'SMS_PRIORITY' | 'IN_APP';
  read?: boolean;
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
  servingHubId?: string;
  servingHubName?: string;
  deletionRequest?: {
    requestedAt: string;
    status: 'NONE' | 'PENDING_REVIEW' | 'PROCESSED' | 'REJECTED';
    reason?: string;
    notes?: string;
  };
  reviews?: CustomerReview[];
  notifications?: CustomerNotification[];
  addresses?: Array<{
    id: string;
    label: string;
    flat: string;
    street: string;
    landmark?: string;
    city: string;
    pincode: string;
    matchedHubId?: string;
    matchedHubName?: string;
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
  assignedHubIds?: string[];
  primaryHubId?: string;
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

export interface PriceSnapshot {
  serviceId: string;
  serviceName: string;
  variant: string;
  quantity: number;
  basePrice: number;
  addOns: Array<{ id: string; name: string; price: number }>;
  addOnPrice: number;
  subtotal: number;
  tax: number;
  discount: number;
  totalAmount: number;
  priceVersion: string;
  timestamp: string;
}

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
  hubId?: string;
  hubName?: string;
  serviceArea?: string;
  address: {
    street: string;
    city: string;
    pincode: string;
    landmark?: string;
  };
  priceSnapshot?: PriceSnapshot;
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
  refundStatus?: 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSED';
  refundAmount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface ServicePackage {
  id: string;
  name: string;
  description: string;
  durationHours: number;
  price: number;
  partnerSharePercent: number;
  isActive: boolean;
}

export interface ServiceAddOn {
  id: string;
  name: string;
  price: number;
  isActive?: boolean;
}

export interface PriceHistoryRecord {
  id: string;
  variantId?: string;
  variantName: string;
  oldPrice: number;
  newPrice: number;
  changedBy: string;
  timestamp: string;
  reason?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  category: 'BATHROOM' | 'KITCHEN' | 'FLAT' | 'OTHER' | string;
  description: string;
  isActive: boolean;
  iconName?: string;
  displayOrder: number;
  packages: ServicePackage[];
  addOns?: ServiceAddOn[];
  availableCities: string[];
  priceHistory?: PriceHistoryRecord[];
  createdAt: string;
  updatedAt?: string;
}

export interface PriceAuditLog {
  id: string;
  adminId: string;
  adminEmail?: string;
  serviceId: string;
  serviceName: string;
  variantId?: string;
  variantName?: string;
  oldPrice: number;
  newPrice: number;
  timestamp: string;
  action: string;
}

export interface Hub {
  hubId: string;
  hubName: string;
  city: string;
  state: string;
  serviceAreas: string[];
  pincodes: string[];
  status: 'ACTIVE' | 'INACTIVE';
  assignedPartnerIds: string[];
  createdAt: string;
  updatedAt: string;
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

export interface DynamicBanner {
  id: string;
  title: string;
  subtitle: string;
  badgeText?: string;
  imageUrl?: string;
  actionType: 'SERVICE' | 'CATEGORY' | 'EXTERNAL_LINK' | 'NONE';
  actionTarget?: string;
  displayOrder: number;
  isActive: boolean;
  validUntil?: string;
}

export interface AppGlobalConfig {
  companyName: string;
  supportEmail: string;
  supportPhone: string;
  supportWhatsapp: string;
  commissionRate: number;
  cancellationGraceMinutes: number;
  isMaintenanceMode: boolean;
  maintenanceMessage?: string;
  minCustomerAppVersion: string;
  minPartnerAppVersion: string;
  activeAnnouncement?: string;
  isAnnouncementActive: boolean;
  banners: DynamicBanner[];
  updatedAt: string;
  updatedBy: string;
}
