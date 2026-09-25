import React, { createContext, useContext, useState, useEffect } from 'react';
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
  BookingStatus,
  PartnerStatus
} from '../types/cleankr';
import {
  INITIAL_CUSTOMERS,
  INITIAL_PARTNERS,
  INITIAL_BOOKINGS,
  INITIAL_SERVICES,
  INITIAL_SERVICE_CHANGES,
  INITIAL_PAYOUTS,
  INITIAL_REFUNDS,
  INITIAL_AUDIT_LOGS,
  INITIAL_SECURITY_ALERTS,
  INITIAL_ADMINS
} from '../data/mockData';
import { useAuth } from './AuthContext';
import { 
  testFirebaseConnection, 
  writeAuditLogToFirestore, 
  FirebaseDiagnostics 
} from '../lib/firebaseService';
import {
  verifyPaymentWithGateway,
  executeGatewayRefund,
  executePartnerBankPayout
} from '../lib/paymentService';
import {
  dispatchFcmNotification,
  type FcmDispatchResult
} from '../lib/notificationService';

interface DataContextType {
  customers: Customer[];
  partners: Partner[];
  bookings: Booking[];
  services: ServiceItem[];
  serviceChanges: ServiceChangeRequest[];
  payouts: PayoutRecord[];
  refunds: RefundRecord[];
  auditLogs: AuditLog[];
  securityAlerts: SecurityAlert[];
  admins: AdminUser[];
  firebaseDiagnostics: FirebaseDiagnostics;
  
  // Actions
  updateCustomerStatus: (id: string, status: 'ACTIVE' | 'SUSPENDED') => void;
  updatePartnerStatus: (id: string, status: PartnerStatus, reason?: string) => void;
  updateBookingStatus: (id: string, status: BookingStatus, notes?: string) => void;
  assignBookingPartner: (bookingId: string, partnerId: string) => void;
  approveServiceChange: (changeId: string, reviewerNotes?: string) => void;
  rejectServiceChange: (changeId: string, reviewerNotes?: string) => void;
  processPayout: (payoutId: string, referenceNumber?: string) => Promise<string>;
  processRefund: (refundId: string, approved: boolean) => Promise<string | undefined>;
  verifyBookingPayment: (bookingId: string) => Promise<boolean>;
  broadcastNotification: (
    target: 'ALL_CUSTOMERS' | 'ALL_PARTNERS' | 'ALL_USERS',
    title: string,
    body: string,
    channel: 'PUSH_FCM' | 'SMS_PRIORITY' | 'IN_APP'
  ) => Promise<FcmDispatchResult>;
  saveService: (service: ServiceItem) => void;
  toggleServiceActive: (serviceId: string) => void;
  addAuditLog: (action: string, targetResource: string, newValue?: string, previousValue?: string) => void;
  resolveSecurityAlert: (alertId: string) => void;
  createAdminUser: (admin: Partial<AdminUser>) => void;
  updateAdminStatus: (uid: string, isActive: boolean) => void;
  syncWithFirebase: () => Promise<void>;
  isSyncing: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentAdmin } = useAuth();

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('cleankr_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [partners, setPartners] = useState<Partner[]>(() => {
    const saved = localStorage.getItem('cleankr_partners');
    return saved ? JSON.parse(saved) : INITIAL_PARTNERS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('cleankr_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [services, setServices] = useState<ServiceItem[]>(() => {
    const saved = localStorage.getItem('cleankr_services');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [serviceChanges, setServiceChanges] = useState<ServiceChangeRequest[]>(() => {
    const saved = localStorage.getItem('cleankr_service_changes');
    return saved ? JSON.parse(saved) : INITIAL_SERVICE_CHANGES;
  });

  const [payouts, setPayouts] = useState<PayoutRecord[]>(() => {
    const saved = localStorage.getItem('cleankr_payouts');
    return saved ? JSON.parse(saved) : INITIAL_PAYOUTS;
  });

  const [refunds, setRefunds] = useState<RefundRecord[]>(() => {
    const saved = localStorage.getItem('cleankr_refunds');
    return saved ? JSON.parse(saved) : INITIAL_REFUNDS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('cleankr_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>(() => {
    const saved = localStorage.getItem('cleankr_security_alerts');
    return saved ? JSON.parse(saved) : INITIAL_SECURITY_ALERTS;
  });

  const [admins, setAdmins] = useState<AdminUser[]>(() => {
    const saved = localStorage.getItem('cleankr_admins');
    return saved ? JSON.parse(saved) : INITIAL_ADMINS;
  });

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [firebaseDiagnostics, setFirebaseDiagnostics] = useState<FirebaseDiagnostics>({
    state: 'CONNECTED_LIVE',
    projectId: 'cleankr-724ce',
    authDomain: 'cleankr-724ce.firebaseapp.com',
    lastChecked: new Date().toISOString(),
    liveCollections: {
      customersCount: 4,
      partnersCount: 4,
      bookingsCount: 5,
      servicesCount: 4,
      auditLogsCount: 4
    }
  });

  // Test real connection on initial boot
  useEffect(() => {
    syncWithFirebase();
  }, []);

  // Persistence to local state
  useEffect(() => {
    localStorage.setItem('cleankr_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('cleankr_partners', JSON.stringify(partners));
  }, [partners]);

  useEffect(() => {
    localStorage.setItem('cleankr_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('cleankr_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('cleankr_service_changes', JSON.stringify(serviceChanges));
  }, [serviceChanges]);

  useEffect(() => {
    localStorage.setItem('cleankr_payouts', JSON.stringify(payouts));
  }, [payouts]);

  useEffect(() => {
    localStorage.setItem('cleankr_refunds', JSON.stringify(refunds));
  }, [refunds]);

  useEffect(() => {
    localStorage.setItem('cleankr_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('cleankr_security_alerts', JSON.stringify(securityAlerts));
  }, [securityAlerts]);

  useEffect(() => {
    localStorage.setItem('cleankr_admins', JSON.stringify(admins));
  }, [admins]);

  const addAuditLog = (action: string, targetResource: string, newValue?: string, previousValue?: string) => {
    const newLog: AuditLog = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      adminEmail: currentAdmin ? currentAdmin.email : 'system@cleankr.co.in',
      adminRole: currentAdmin ? currentAdmin.role : 'SUPER_ADMIN',
      action,
      targetResource,
      previousValue,
      newValue,
      ipAddress: '152.57.19.42 (Authorized Session)',
      status: 'SUCCESS'
    };
    setAuditLogs(prev => [newLog, ...prev]);

    // Attempt real write to Firestore
    writeAuditLogToFirestore(newLog);
  };

  const updateCustomerStatus = (id: string, status: 'ACTIVE' | 'SUSPENDED') => {
    const cust = customers.find(c => c.id === id);
    if (!cust) return;
    const prev = cust.status;
    setCustomers(prevList => prevList.map(c => c.id === id ? { ...c, status } : c));
    addAuditLog('CUSTOMER_STATUS_UPDATE', `Customer/${id}`, status, prev);
  };

  const updatePartnerStatus = (id: string, status: PartnerStatus, reason?: string) => {
    const part = partners.find(p => p.id === id);
    if (!part) return;
    const prev = part.status;
    setPartners(prevList => prevList.map(p => {
      if (p.id === id) {
        return {
          ...p,
          status,
          rejectionReason: reason || p.rejectionReason,
          documents: {
            ...p.documents,
            verifiedAt: status === 'ACTIVE' ? new Date().toISOString() : p.documents?.verifiedAt
          }
        };
      }
      return p;
    }));
    addAuditLog('PARTNER_STATUS_UPDATE', `Partner/${id}`, `${status}${reason ? ` (${reason})` : ''}`, prev);
  };

  const updateBookingStatus = (id: string, status: BookingStatus, notes?: string) => {
    const bk = bookings.find(b => b.id === id);
    if (!bk) return;
    const prev = bk.bookingStatus;
    setBookings(prevList => prevList.map(b => {
      if (b.id === id) {
        return {
          ...b,
          bookingStatus: status,
          notes: notes ? `${b.notes ? b.notes + ' | ' : ''}${notes}` : b.notes,
          updatedAt: new Date().toISOString()
        };
      }
      return b;
    }));
    addAuditLog('BOOKING_STATUS_OVERRIDE', `Booking/${id}`, status, prev);
  };

  const assignBookingPartner = (bookingId: string, partnerId: string) => {
    const targetPartner = partners.find(p => p.id === partnerId);
    if (!targetPartner) return;

    setBookings(prevList => prevList.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          partnerId: targetPartner.id,
          partnerName: targetPartner.fullName,
          partnerPhone: targetPartner.phoneNumber,
          bookingStatus: 'ASSIGNED',
          updatedAt: new Date().toISOString()
        };
      }
      return b;
    }));

    addAuditLog('BOOKING_PARTNER_ASSIGNMENT', `Booking/${bookingId}`, `Assigned to ${targetPartner.fullName} (${targetPartner.id})`);
  };

  const approveServiceChange = (changeId: string, reviewerNotes?: string) => {
    const req = serviceChanges.find(s => s.id === changeId);
    if (!req) return;

    // 1. Mark request as APPROVED
    setServiceChanges(prev => prev.map(s => s.id === changeId ? {
      ...s,
      status: 'APPROVED',
      reviewedBy: currentAdmin?.displayName || 'Admin',
      reviewerNotes: reviewerNotes || 'Approved by Operations',
      reviewedAt: new Date().toISOString()
    } : s));

    // 2. Authoritatively update the Booking price and package
    setBookings(prev => prev.map(b => {
      if (b.id === req.bookingId) {
        const newPartnerShare = Math.round(req.proposedPrice * 0.75);
        const newCommission = req.proposedPrice - newPartnerShare;
        return {
          ...b,
          serviceTitle: req.proposedService,
          packageName: req.proposedPackage,
          totalAmount: req.proposedPrice,
          partnerPayoutAmount: newPartnerShare,
          companyCommissionAmount: newCommission,
          serviceChangePending: false,
          notes: `${b.notes || ''} [Service change approved: ₹${req.currentPrice} -> ₹${req.proposedPrice}]`,
          updatedAt: new Date().toISOString()
        };
      }
      return b;
    }));

    addAuditLog('SERVICE_CHANGE_APPROVED', `ServiceChange/${changeId}`, `Price updated to ₹${req.proposedPrice} for Booking ${req.bookingId}`, `₹${req.currentPrice}`);
  };

  const rejectServiceChange = (changeId: string, reviewerNotes?: string) => {
    const req = serviceChanges.find(s => s.id === changeId);
    if (!req) return;

    setServiceChanges(prev => prev.map(s => s.id === changeId ? {
      ...s,
      status: 'REJECTED',
      reviewedBy: currentAdmin?.displayName || 'Admin',
      reviewerNotes: reviewerNotes || 'Declined',
      reviewedAt: new Date().toISOString()
    } : s));

    setBookings(prev => prev.map(b => {
      if (b.id === req.bookingId) {
        return {
          ...b,
          serviceChangePending: false,
          notes: `${b.notes || ''} [Service change rejected by admin]`,
          updatedAt: new Date().toISOString()
        };
      }
      return b;
    }));

    addAuditLog('SERVICE_CHANGE_REJECTED', `ServiceChange/${changeId}`, `Rejected for Booking ${req.bookingId}`);
  };

  const verifyBookingPayment = async (bookingId: string): Promise<boolean> => {
    const b = bookings.find(item => item.id === bookingId);
    if (!b) return false;

    const res = await verifyPaymentWithGateway(b);
    if (res.verified) {
      setBookings(prev => prev.map(item => item.id === bookingId ? {
        ...item,
        transactionId: res.gatewayTransactionId,
        notes: `${item.notes || ''} [Gateway Verified: ${res.gatewayStatus} at ${new Date(res.verifiedAt).toLocaleTimeString()}]`
      } : item));

      addAuditLog('PAYMENT_VERIFIED', `Booking/${bookingId}`, `Transaction ${res.gatewayTransactionId} verified against gateway`);
      return true;
    }
    return false;
  };

  const processPayout = async (payoutId: string, referenceNumber?: string): Promise<string> => {
    const p = payouts.find(item => item.id === payoutId);
    if (!p) throw new Error('Payout record not found');

    const targetPartner = partners.find(part => part.id === p.partnerId);
    const bankDetails = targetPartner?.bankDetails || {
      accountNumber: '1122334455',
      ifscCode: 'HDFC0000123',
      bankName: 'HDFC Bank',
      accountHolderName: p.partnerName
    };

    let effectiveUtr = referenceNumber;
    if (!effectiveUtr) {
      const bankRes = await executePartnerBankPayout(p.partnerId, p.partnerName, p.amount, bankDetails);
      effectiveUtr = bankRes.utrNumber;
    }

    setPayouts(prev => prev.map(item => item.id === payoutId ? {
      ...item,
      status: 'PAID',
      referenceNumber: effectiveUtr,
      processedBy: currentAdmin?.displayName || 'Finance Team',
      processedAt: new Date().toISOString()
    } : item));

    // Deduct pending payout from Partner
    setPartners(prev => prev.map(part => {
      if (part.id === p.partnerId) {
        return {
          ...part,
          pendingPayout: Math.max(0, part.pendingPayout - p.amount)
        };
      }
      return part;
    }));

    addAuditLog('PAYOUT_DISBURSED', `PayoutRecord/${payoutId}`, `₹${p.amount} settled to ${p.partnerName} (UTR: ${effectiveUtr})`);
    return effectiveUtr;
  };

  const processRefund = async (refundId: string, approved: boolean): Promise<string | undefined> => {
    const ref = refunds.find(r => r.id === refundId);
    if (!ref) return undefined;

    let gatewayRef: string | undefined;

    if (approved) {
      const refundRes = await executeGatewayRefund(ref.bookingId, ref.amount, ref.reason);
      gatewayRef = refundRes.gatewayRefundRef;

      setBookings(prev => prev.map(b => {
        if (b.id === ref.bookingId) {
          return {
            ...b,
            paymentStatus: 'REFUNDED',
            notes: `${b.notes || ''} [Refund issued: ${refundRes.gatewayRefundRef}, ARN: ${refundRes.arn}]`
          };
        }
        return b;
      }));
    }

    setRefunds(prev => prev.map(r => r.id === refundId ? {
      ...r,
      status: approved ? 'PROCESSED' : 'REJECTED',
      processedBy: currentAdmin?.displayName || 'Finance Officer',
      updatedAt: new Date().toISOString(),
      transactionRef: gatewayRef
    } : r));

    addAuditLog('REFUND_DECISION', `RefundRecord/${refundId}`, approved ? `Approved ₹${ref.amount} (Ref: ${gatewayRef})` : 'Rejected', 'PENDING');
    return gatewayRef;
  };

  const broadcastNotification = async (
    target: 'ALL_CUSTOMERS' | 'ALL_PARTNERS' | 'ALL_USERS',
    title: string,
    body: string,
    channel: 'PUSH_FCM' | 'SMS_PRIORITY' | 'IN_APP'
  ): Promise<FcmDispatchResult> => {
    const res = await dispatchFcmNotification(target, title, body, channel);
    addAuditLog(
      'FCM_BROADCAST_SENT', 
      `Topic/${res.targetTopic}`, 
      `Sent: "${title}" to ${res.deliverySuccessCount}/${res.recipientCount} active terminals`
    );
    return res;
  };

  const saveService = (service: ServiceItem) => {
    const existingIndex = services.findIndex(s => s.id === service.id);
    if (existingIndex >= 0) {
      setServices(prev => {
        const copy = [...prev];
        copy[existingIndex] = { ...service, updatedAt: new Date().toISOString() };
        return copy;
      });
      addAuditLog('SERVICE_UPDATED', `Service/${service.id}`, `Updated catalog & package prices for ${service.title}`);
    } else {
      const newService = {
        ...service,
        id: service.id || `srv-${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      setServices(prev => [newService, ...prev]);
      addAuditLog('SERVICE_CREATED', `Service/${newService.id}`, `Created service ${newService.title}`);
    }
  };

  const toggleServiceActive = (serviceId: string) => {
    const s = services.find(x => x.id === serviceId);
    if (!s) return;
    const nextState = !s.isActive;
    setServices(prev => prev.map(item => item.id === serviceId ? { ...item, isActive: nextState } : item));
    addAuditLog('SERVICE_STATUS_TOGGLE', `Service/${serviceId}`, nextState ? 'ACTIVATED' : 'DEACTIVATED');
  };

  const resolveSecurityAlert = (alertId: string) => {
    setSecurityAlerts(prev => prev.map(a => a.id === alertId ? {
      ...a,
      status: 'RESOLVED',
      resolvedBy: currentAdmin?.displayName || 'Admin'
    } : a));
    addAuditLog('SECURITY_ALERT_RESOLVED', `SecurityAlert/${alertId}`, 'Marked as resolved');
  };

  const createAdminUser = (admin: Partial<AdminUser>) => {
    const newAdmin: AdminUser = {
      uid: `adm-${Date.now().toString().slice(-4)}`,
      email: admin.email || 'admin@cleankr.co.in',
      displayName: admin.displayName || 'Operations Member',
      role: admin.role || 'OPERATIONS_ADMIN',
      isActive: true,
      phoneNumber: admin.phoneNumber || '+91 98000 00000',
      createdAt: new Date().toISOString(),
      mfaEnabled: true
    };
    setAdmins(prev => [...prev, newAdmin]);
    addAuditLog('ADMIN_USER_CREATED', `AdminUser/${newAdmin.uid}`, `${newAdmin.email} assigned role ${newAdmin.role}`);
  };

  const updateAdminStatus = (uid: string, isActive: boolean) => {
    setAdmins(prev => prev.map(a => a.uid === uid ? { ...a, isActive } : a));
    addAuditLog('ADMIN_STATUS_CHANGED', `AdminUser/${uid}`, isActive ? 'ACTIVATED' : 'DEACTIVATED');
  };

  const syncWithFirebase = async () => {
    setIsSyncing(true);
    const diag = await testFirebaseConnection();
    setFirebaseDiagnostics(diag);
    setIsSyncing(false);
    
    addAuditLog(
      'FIREBASE_VERIFICATION', 
      'Database/cleankr-724ce', 
      `Result: ${diag.state}${diag.errorMessage ? ` (${diag.errorMessage})` : ''}`
    );
  };

  return (
    <DataContext.Provider
      value={{
        customers,
        partners,
        bookings,
        services,
        serviceChanges,
        payouts,
        refunds,
        auditLogs,
        securityAlerts,
        admins,
        firebaseDiagnostics,
        updateCustomerStatus,
        updatePartnerStatus,
        updateBookingStatus,
        assignBookingPartner,
        approveServiceChange,
        rejectServiceChange,
        processPayout,
        processRefund,
        verifyBookingPayment,
        broadcastNotification,
        saveService,
        toggleServiceActive,
        addAuditLog,
        resolveSecurityAlert,
        createAdminUser,
        updateAdminStatus,
        syncWithFirebase,
        isSyncing
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
