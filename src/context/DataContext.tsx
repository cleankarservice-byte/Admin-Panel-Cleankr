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
  PartnerStatus,
  Hub,
  PriceAuditLog,
  PriceSnapshot,
  AppGlobalConfig,
  DynamicBanner
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
  INITIAL_ADMINS,
  INITIAL_HUBS,
  INITIAL_PRICE_AUDIT_LOGS,
  INITIAL_APP_CONFIG
} from '../data/mockData';
import { useAuth } from './AuthContext';
import { 
  testFirebaseConnection, 
  writeAuditLogToFirestore,
  writeServiceToFirestore,
  writeHubToFirestore,
  writePartnerUpdateToFirestore,
  writeCustomerUpdateToFirestore,
  writeAppConfigToFirestore,
  pushAllToFirestore,
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
  hubs: Hub[];
  priceAuditLogs: PriceAuditLog[];
  serviceChanges: ServiceChangeRequest[];
  payouts: PayoutRecord[];
  refunds: RefundRecord[];
  auditLogs: AuditLog[];
  securityAlerts: SecurityAlert[];
  admins: AdminUser[];
  firebaseDiagnostics: FirebaseDiagnostics;
  isSyncing: boolean;
  
  // Customer Operations
  updateCustomerStatus: (id: string, status: 'ACTIVE' | 'SUSPENDED') => void;
  updateCustomerDeletionStatus: (id: string, status: 'PROCESSED' | 'REJECTED', notes?: string) => void;
  sendCustomerNotification: (customerId: string, title: string, body: string, channel?: 'PUSH_FCM' | 'SMS_PRIORITY' | 'IN_APP') => Promise<void>;
  
  // Partner Operations
  updatePartnerStatus: (id: string, status: PartnerStatus, reason?: string) => void;
  assignPartnerToHub: (partnerId: string, hubId: string, isPrimary?: boolean) => void;
  removePartnerFromHub: (partnerId: string, hubId: string) => void;
  setPartnerPrimaryHub: (partnerId: string, hubId: string) => void;
  isPartnerEligibleForBooking: (partnerId: string, bookingHubId?: string) => boolean;

  // Hub Operations
  createHub: (hubData: Omit<Hub, 'hubId' | 'createdAt' | 'updatedAt'>) => Hub;
  updateHub: (hubId: string, updates: Partial<Hub>) => void;
  toggleHubActive: (hubId: string) => void;
  findActiveHubForPincode: (pincode: string) => Hub | null;
  broadcastToHubCustomers: (hubId: string, title: string, body: string, channel: 'PUSH_FCM' | 'SMS_PRIORITY' | 'IN_APP') => Promise<number>;

  // Booking & Price Security Operations
  updateBookingStatus: (id: string, status: BookingStatus, notes?: string) => void;
  assignBookingPartner: (bookingId: string, partnerId: string) => boolean;
  createBookingWithSnapshot: (params: {
    customerId: string;
    serviceId: string;
    variantId: string;
    addOnIds?: string[];
    date: string;
    timeSlot: string;
    address: { street: string; city: string; pincode: string; landmark?: string };
    paymentMethod: 'ONLINE' | 'UPI' | 'CASH' | 'CARD';
  }) => { success: boolean; bookingId?: string; error?: string };

  // Services & Pricing Operations
  saveService: (service: ServiceItem) => void;
  toggleServiceActive: (serviceId: string) => void;
  updateServicePrice: (serviceId: string, variantId: string, newPrice: number, reason?: string) => void;
  
  // Service Change Operations
  approveServiceChange: (changeId: string, reviewerNotes?: string) => void;
  rejectServiceChange: (changeId: string, reviewerNotes?: string) => void;

  // Finance Operations
  processPayout: (payoutId: string, referenceNumber?: string) => Promise<string>;
  processRefund: (refundId: string, approved: boolean) => Promise<string | undefined>;
  verifyBookingPayment: (bookingId: string) => Promise<boolean>;

  // Notifications & Audit
  broadcastNotification: (
    target: 'ALL_CUSTOMERS' | 'ALL_PARTNERS' | 'ALL_USERS',
    title: string,
    body: string,
    channel: 'PUSH_FCM' | 'SMS_PRIORITY' | 'IN_APP'
  ) => Promise<FcmDispatchResult>;
  addAuditLog: (action: string, targetResource: string, newValue?: string, previousValue?: string) => void;
  resolveSecurityAlert: (alertId: string) => void;
  createAdminUser: (admin: Partial<AdminUser>) => void;
  updateAdminStatus: (uid: string, isActive: boolean) => void;
  syncWithFirebase: () => Promise<void>;

  // OTA App Config & Play Store Bypass Engine
  appConfig: AppGlobalConfig;
  updateAppConfig: (updates: Partial<AppGlobalConfig>) => Promise<boolean>;
  addBanner: (banner: Omit<DynamicBanner, 'id'>) => Promise<boolean>;
  deleteBanner: (bannerId: string) => Promise<boolean>;
  toggleBannerActive: (bannerId: string) => Promise<boolean>;
  pushAllToLiveApps: () => Promise<{ success: boolean; syncedServices: number; syncedHubs: number; error?: string }>;
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

  const [hubs, setHubs] = useState<Hub[]>(() => {
    const saved = localStorage.getItem('cleankr_hubs');
    return saved ? JSON.parse(saved) : INITIAL_HUBS;
  });

  const [priceAuditLogs, setPriceAuditLogs] = useState<PriceAuditLog[]>(() => {
    const saved = localStorage.getItem('cleankr_price_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_PRICE_AUDIT_LOGS;
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

  const [appConfig, setAppConfig] = useState<AppGlobalConfig>(() => {
    const saved = localStorage.getItem('cleankr_app_config');
    return saved ? JSON.parse(saved) : INITIAL_APP_CONFIG;
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
      servicesCount: 7,
      auditLogsCount: 4
    }
  });

  useEffect(() => {
    syncWithFirebase();
  }, []);

  // Save to localStorage
  useEffect(() => { localStorage.setItem('cleankr_customers', JSON.stringify(customers)); }, [customers]);
  useEffect(() => { localStorage.setItem('cleankr_partners', JSON.stringify(partners)); }, [partners]);
  useEffect(() => { localStorage.setItem('cleankr_bookings', JSON.stringify(bookings)); }, [bookings]);
  useEffect(() => { localStorage.setItem('cleankr_services', JSON.stringify(services)); }, [services]);
  useEffect(() => { localStorage.setItem('cleankr_hubs', JSON.stringify(hubs)); }, [hubs]);
  useEffect(() => { localStorage.setItem('cleankr_price_audit_logs', JSON.stringify(priceAuditLogs)); }, [priceAuditLogs]);
  useEffect(() => { localStorage.setItem('cleankr_service_changes', JSON.stringify(serviceChanges)); }, [serviceChanges]);
  useEffect(() => { localStorage.setItem('cleankr_payouts', JSON.stringify(payouts)); }, [payouts]);
  useEffect(() => { localStorage.setItem('cleankr_refunds', JSON.stringify(refunds)); }, [refunds]);
  useEffect(() => { localStorage.setItem('cleankr_audit_logs', JSON.stringify(auditLogs)); }, [auditLogs]);
  useEffect(() => { localStorage.setItem('cleankr_security_alerts', JSON.stringify(securityAlerts)); }, [securityAlerts]);
  useEffect(() => { localStorage.setItem('cleankr_admins', JSON.stringify(admins)); }, [admins]);
  useEffect(() => { localStorage.setItem('cleankr_app_config', JSON.stringify(appConfig)); }, [appConfig]);

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
    writeAuditLogToFirestore(newLog);
  };

  // --- Customer Operations ---
  const updateCustomerStatus = (id: string, status: 'ACTIVE' | 'SUSPENDED') => {
    const cust = customers.find(c => c.id === id);
    if (!cust) return;
    const prev = cust.status;
    setCustomers(prevList => prevList.map(c => c.id === id ? { ...c, status, updatedAt: new Date().toISOString() } : c));
    addAuditLog('CUSTOMER_STATUS_UPDATE', `Customer/${id}`, status, prev);
  };

  const updateCustomerDeletionStatus = (id: string, status: 'PROCESSED' | 'REJECTED', notes?: string) => {
    const cust = customers.find(c => c.id === id);
    if (!cust) return;
    const prev = cust.deletionRequest?.status || 'NONE';
    setCustomers(prevList => prevList.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: status === 'PROCESSED' ? 'SUSPENDED' : c.status,
          deletionRequest: {
            requestedAt: c.deletionRequest?.requestedAt || new Date().toISOString(),
            status,
            reason: c.deletionRequest?.reason,
            notes: notes || (status === 'PROCESSED' ? 'Personal data anonymized; financial ledger preserved for audit requirements.' : 'Rejected by compliance admin')
          },
          updatedAt: new Date().toISOString()
        };
      }
      return c;
    }));
    addAuditLog('CUSTOMER_DELETION_PROCESSED', `Customer/${id}`, `Deletion status changed to ${status}`, prev);
  };

  const sendCustomerNotification = async (customerId: string, title: string, body: string, channel: 'PUSH_FCM' | 'SMS_PRIORITY' | 'IN_APP' = 'PUSH_FCM') => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      title,
      body,
      date: new Date().toISOString(),
      channel,
      read: false
    };
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        return {
          ...c,
          notifications: [newNotif, ...(c.notifications || [])]
        };
      }
      return c;
    }));
    addAuditLog('NOTIFICATION_SENT_CUSTOMER', `Customer/${customerId}`, `Sent "${title}" via ${channel}`);
  };

  // --- Hub Operations ---
  const findActiveHubForPincode = (pincode: string): Hub | null => {
    const cleanPin = pincode.trim();
    const activeHub = hubs.find(h => h.status === 'ACTIVE' && h.pincodes.includes(cleanPin));
    return activeHub || null;
  };

  const createHub = (hubData: Omit<Hub, 'hubId' | 'createdAt' | 'updatedAt'>): Hub => {
    const newHub: Hub = {
      ...hubData,
      hubId: `hub-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setHubs(prev => [newHub, ...prev]);
    writeHubToFirestore(newHub);
    addAuditLog('HUB_CREATED', `Hub/${newHub.hubId}`, `Created Hub "${newHub.hubName}" in ${newHub.city} with ${newHub.pincodes.length} pincodes`);
    return newHub;
  };

  const updateHub = (hubId: string, updates: Partial<Hub>) => {
    let updatedHubObj: Hub | null = null;
    setHubs(prev => prev.map(h => {
      if (h.hubId === hubId) {
        updatedHubObj = { ...h, ...updates, updatedAt: new Date().toISOString() };
        return updatedHubObj;
      }
      return h;
    }));
    if (updatedHubObj) writeHubToFirestore(updatedHubObj);
    addAuditLog('HUB_UPDATED', `Hub/${hubId}`, `Updated properties for Hub ${hubId}`);
  };

  const toggleHubActive = (hubId: string) => {
    const hub = hubs.find(h => h.hubId === hubId);
    if (!hub) return;
    const nextStatus: 'ACTIVE' | 'INACTIVE' = hub.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const updatedHub: Hub = { ...hub, status: nextStatus, updatedAt: new Date().toISOString() };
    setHubs(prev => prev.map(h => h.hubId === hubId ? updatedHub : h));
    writeHubToFirestore(updatedHub);
    addAuditLog('HUB_STATUS_TOGGLED', `Hub/${hubId}`, `Status changed to ${nextStatus}`, hub.status);
  };

  // --- Partner Hub Assignment & Eligibility ---
  const assignPartnerToHub = (partnerId: string, hubId: string, isPrimary = false) => {
    const partner = partners.find(p => p.id === partnerId);
    const hub = hubs.find(h => h.hubId === hubId);
    if (!partner || !hub) return;

    // Update partner
    setPartners(prev => prev.map(p => {
      if (p.id === partnerId) {
        const currentAssigned = p.assignedHubIds || [];
        const nextAssigned = currentAssigned.includes(hubId) ? currentAssigned : [...currentAssigned, hubId];
        return {
          ...p,
          assignedHubIds: nextAssigned,
          primaryHubId: isPrimary || !p.primaryHubId ? hubId : p.primaryHubId,
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    }));

    // Update hub's assignedPartnerIds list
    setHubs(prev => prev.map(h => {
      if (h.hubId === hubId) {
        const list = h.assignedPartnerIds || [];
        return {
          ...h,
          assignedPartnerIds: list.includes(partnerId) ? list : [...list, partnerId],
          updatedAt: new Date().toISOString()
        };
      }
      return h;
    }));

    addAuditLog('PARTNER_ASSIGNED_HUB', `Partner/${partnerId}`, `Assigned to ${hub.hubName} (${hubId})${isPrimary ? ' as Primary' : ''}`);
  };

  const removePartnerFromHub = (partnerId: string, hubId: string) => {
    setPartners(prev => prev.map(p => {
      if (p.id === partnerId) {
        const nextAssigned = (p.assignedHubIds || []).filter(id => id !== hubId);
        const nextPrimary = p.primaryHubId === hubId ? (nextAssigned[0] || '') : p.primaryHubId;
        return {
          ...p,
          assignedHubIds: nextAssigned,
          primaryHubId: nextPrimary,
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    }));

    setHubs(prev => prev.map(h => {
      if (h.hubId === hubId) {
        return {
          ...h,
          assignedPartnerIds: (h.assignedPartnerIds || []).filter(id => id !== partnerId),
          updatedAt: new Date().toISOString()
        };
      }
      return h;
    }));

    addAuditLog('PARTNER_REMOVED_HUB', `Partner/${partnerId}`, `Removed from Hub ${hubId}`);
  };

  const setPartnerPrimaryHub = (partnerId: string, hubId: string) => {
    setPartners(prev => prev.map(p => {
      if (p.id === partnerId) {
        const currentAssigned = p.assignedHubIds || [];
        const nextAssigned = currentAssigned.includes(hubId) ? currentAssigned : [...currentAssigned, hubId];
        return {
          ...p,
          assignedHubIds: nextAssigned,
          primaryHubId: hubId,
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    }));
    addAuditLog('PARTNER_PRIMARY_HUB_SET', `Partner/${partnerId}`, `Set primary Hub to ${hubId}`);
  };

  const isPartnerEligibleForBooking = (partnerId: string, bookingHubId?: string): boolean => {
    const partner = partners.find(p => p.id === partnerId);
    if (!partner || partner.status !== 'ACTIVE') return false;
    if (!bookingHubId) return true; // If no hub specified, all active partners eligible
    const assigned = partner.assignedHubIds || [];
    return assigned.includes(bookingHubId) || partner.primaryHubId === bookingHubId;
  };

  // --- Booking Operations with Routing & Price Snapshotting ---
  const assignBookingPartner = (bookingId: string, partnerId: string): boolean => {
    const targetBooking = bookings.find(b => b.id === bookingId);
    const targetPartner = partners.find(p => p.id === partnerId);
    if (!targetBooking || !targetPartner) return false;

    // Check Hub Eligibility
    if (targetBooking.hubId && !isPartnerEligibleForBooking(partnerId, targetBooking.hubId)) {
      addAuditLog(
        'BOOKING_ASSIGNMENT_BLOCKED', 
        `Booking/${bookingId}`, 
        `Partner ${targetPartner.fullName} (${partnerId}) is not assigned to Hub ${targetBooking.hubName || targetBooking.hubId}`
      );
      return false;
    }

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
    return true;
  };

  const createBookingWithSnapshot = (params: {
    customerId: string;
    serviceId: string;
    variantId: string;
    addOnIds?: string[];
    date: string;
    timeSlot: string;
    address: { street: string; city: string; pincode: string; landmark?: string };
    paymentMethod: 'ONLINE' | 'UPI' | 'CASH' | 'CARD';
  }): { success: boolean; bookingId?: string; error?: string } => {
    // 1. Hub validation
    const servingHub = findActiveHubForPincode(params.address.pincode);
    if (!servingHub) {
      return {
        success: false,
        error: 'Cleankr service is currently unavailable in your area.'
      };
    }

    // 2. Pricing lookup
    const service = services.find(s => s.id === params.serviceId);
    if (!service || !service.isActive) {
      return { success: false, error: 'Selected service is currently inactive.' };
    }

    const variant = service.packages.find(p => p.id === params.variantId);
    if (!variant || !variant.isActive) {
      return { success: false, error: 'Selected variant is not active.' };
    }

    const selectedAddOns = (service.addOns || [])
      .filter(a => params.addOnIds?.includes(a.id))
      .map(a => ({ id: a.id, name: a.name, price: a.price }));

    const addOnPrice = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
    const basePrice = variant.price;
    const subtotal = basePrice + addOnPrice;
    const discount = 0;
    const tax = 0; // Tax included
    const totalAmount = subtotal - discount + tax;

    const priceSnapshot: PriceSnapshot = {
      serviceId: service.id,
      serviceName: service.title,
      variant: variant.name,
      quantity: 1,
      basePrice,
      addOns: selectedAddOns,
      addOnPrice,
      subtotal,
      tax,
      discount,
      totalAmount,
      priceVersion: 'v1.0.0',
      timestamp: new Date().toISOString()
    };

    const customer = customers.find(c => c.id === params.customerId);
    const bookingId = `BK-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const partnerPayoutAmount = Math.round(totalAmount * (variant.partnerSharePercent / 100));
    const companyCommissionAmount = totalAmount - partnerPayoutAmount;

    const newBooking: Booking = {
      id: bookingId,
      customerId: params.customerId,
      customerName: customer ? customer.fullName : 'Customer',
      customerPhone: customer ? customer.phoneNumber : '+91 99999 99999',
      serviceId: service.id,
      serviceTitle: service.title,
      packageId: variant.id,
      packageName: variant.name,
      date: params.date,
      timeSlot: params.timeSlot,
      hubId: servingHub.hubId,
      hubName: servingHub.hubName,
      address: params.address,
      priceSnapshot,
      totalAmount,
      partnerPayoutAmount,
      companyCommissionAmount,
      bookingStatus: 'CREATED',
      paymentStatus: 'PAID',
      paymentMethod: params.paymentMethod,
      transactionId: `TXN_INIT_${Date.now().toString().slice(-6)}`,
      refundStatus: 'NONE',
      createdAt: new Date().toISOString()
    };

    setBookings(prev => [newBooking, ...prev]);
    addAuditLog('BOOKING_CREATED_SNAPSHOT', `Booking/${bookingId}`, `Created booking under Hub ${servingHub.hubName} with total ₹${totalAmount}`);
    return { success: true, bookingId };
  };

  // --- Services & Pricing Operations ---
  const updateServicePrice = (serviceId: string, variantId: string, newPrice: number, reason?: string) => {
    const service = services.find(s => s.id === serviceId);
    if (!service) return;
    const variant = service.packages.find(p => p.id === variantId);
    if (!variant) return;

    const oldPrice = variant.price;
    if (oldPrice === newPrice) return;

    const historyRecord = {
      id: `ph-${Date.now()}`,
      variantId,
      variantName: variant.name,
      oldPrice,
      newPrice,
      changedBy: currentAdmin?.email || 'admin@cleankr.co.in',
      timestamp: new Date().toISOString(),
      reason: reason || 'Administrative price revision'
    };

    const updatedPackages = service.packages.map(p => p.id === variantId ? { ...p, price: newPrice } : p);
    const updatedHistory = [historyRecord, ...(service.priceHistory || [])];
    const updatedService: ServiceItem = {
      ...service,
      packages: updatedPackages,
      priceHistory: updatedHistory,
      updatedAt: new Date().toISOString()
    };

    setServices(prev => prev.map(s => s.id === serviceId ? updatedService : s));
    writeServiceToFirestore(updatedService);

    const priceAudit: PriceAuditLog = {
      id: `PAL-${Date.now().toString().slice(-4)}`,
      adminId: currentAdmin?.uid || 'adm-001',
      adminEmail: currentAdmin?.email || 'admin@cleankr.co.in',
      serviceId,
      serviceName: service.title,
      variantId,
      variantName: variant.name,
      oldPrice,
      newPrice,
      timestamp: new Date().toISOString(),
      action: 'PRICE_UPDATE'
    };
    setPriceAuditLogs(prev => [priceAudit, ...prev]);
    addAuditLog('SERVICE_PRICE_CHANGED', `Service/${serviceId}`, `${service.title} - ${variant.name} changed from ₹${oldPrice} to ₹${newPrice}`, `₹${oldPrice}`);
  };

  const saveService = (service: ServiceItem) => {
    const existingIndex = services.findIndex(s => s.id === service.id);
    if (existingIndex >= 0) {
      const updatedSrv = { ...service, updatedAt: new Date().toISOString() };
      setServices(prev => {
        const copy = [...prev];
        copy[existingIndex] = updatedSrv;
        return copy;
      });
      writeServiceToFirestore(updatedSrv);
      addAuditLog('SERVICE_UPDATED', `Service/${service.id}`, `Updated catalog & packages for ${service.title}`);
    } else {
      const newService = {
        ...service,
        id: service.id || `srv-${Date.now()}`,
        displayOrder: service.displayOrder || (services.length + 1),
        createdAt: new Date().toISOString()
      };
      setServices(prev => [...prev, newService]);
      writeServiceToFirestore(newService);
      addAuditLog('SERVICE_CREATED', `Service/${newService.id}`, `Created service ${newService.title}`);
    }
  };

  const toggleServiceActive = (serviceId: string) => {
    const s = services.find(x => x.id === serviceId);
    if (!s) return;
    const nextState = !s.isActive;
    const updatedService = { ...s, isActive: nextState, updatedAt: new Date().toISOString() };
    setServices(prev => prev.map(item => item.id === serviceId ? updatedService : item));
    writeServiceToFirestore(updatedService);
    addAuditLog('SERVICE_STATUS_TOGGLE', `Service/${serviceId}`, nextState ? 'ACTIVATED' : 'DEACTIVATED');
  };

  // --- Existing Booking & Finance Handlers ---
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
          },
          updatedAt: new Date().toISOString()
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

  const approveServiceChange = (changeId: string, reviewerNotes?: string) => {
    const req = serviceChanges.find(s => s.id === changeId);
    if (!req) return;

    setServiceChanges(prev => prev.map(s => s.id === changeId ? {
      ...s,
      status: 'APPROVED',
      reviewedBy: currentAdmin?.displayName || 'Admin',
      reviewerNotes: reviewerNotes || 'Approved by Operations',
      reviewedAt: new Date().toISOString()
    } : s));

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
            refundStatus: 'PROCESSED',
            refundAmount: ref.amount,
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

  const broadcastToHubCustomers = async (
    hubId: string,
    title: string,
    body: string,
    channel: 'PUSH_FCM' | 'SMS_PRIORITY' | 'IN_APP'
  ): Promise<number> => {
    const targetHub = hubs.find(h => h.hubId === hubId);
    if (!targetHub) return 0;

    // Filter customers residing in this hub's pincodes
    const hubCustomers = customers.filter(c => 
      c.servingHubId === hubId || 
      c.addresses?.some(a => targetHub.pincodes.includes(a.pincode))
    );

    const newNotif = {
      id: `hub-notif-${Date.now()}`,
      title,
      body,
      date: new Date().toISOString(),
      channel,
      read: false
    };

    setCustomers(prev => prev.map(c => {
      const isInHub = c.servingHubId === hubId || c.addresses?.some(a => targetHub.pincodes.includes(a.pincode));
      if (isInHub) {
        return {
          ...c,
          notifications: [newNotif, ...(c.notifications || [])]
        };
      }
      return c;
    }));

    addAuditLog('FCM_HUB_BROADCAST_SENT', `Hub/${hubId}`, `Broadcasted "${title}" to ${hubCustomers.length} customers in Hub ${targetHub.hubName}`);
    return hubCustomers.length;
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

  const updateAppConfig = async (updates: Partial<AppGlobalConfig>): Promise<boolean> => {
    const updated: AppGlobalConfig = {
      ...appConfig,
      ...updates,
      updatedAt: new Date().toISOString(),
      updatedBy: currentAdmin?.email || 'admin@cleankr.co.in'
    };
    setAppConfig(updated);
    addAuditLog('APP_CONFIG_UPDATED', 'AppConfig/global', JSON.stringify(updates));
    await writeAppConfigToFirestore(updated);
    return true;
  };

  const addBanner = async (banner: Omit<DynamicBanner, 'id'>): Promise<boolean> => {
    const newBanner: DynamicBanner = {
      ...banner,
      id: `ban-${Date.now()}`
    };
    const updatedBanners = [...appConfig.banners, newBanner];
    return await updateAppConfig({ banners: updatedBanners });
  };

  const deleteBanner = async (bannerId: string): Promise<boolean> => {
    const updatedBanners = appConfig.banners.filter(b => b.id !== bannerId);
    return await updateAppConfig({ banners: updatedBanners });
  };

  const toggleBannerActive = async (bannerId: string): Promise<boolean> => {
    const updatedBanners = appConfig.banners.map(b => b.id === bannerId ? { ...b, isActive: !b.isActive } : b);
    return await updateAppConfig({ banners: updatedBanners });
  };

  const pushAllToLiveApps = async (): Promise<{ success: boolean; syncedServices: number; syncedHubs: number; error?: string }> => {
    setIsSyncing(true);
    const result = await pushAllToFirestore(services, hubs, appConfig);
    setIsSyncing(false);
    addAuditLog(
      'OTA_APPS_BULK_PUSH',
      'Firebase/cleankr-724ce',
      `Synced ${result.syncedServices} services & ${result.syncedHubs} Pune hubs to live Android apps without Play Store rebuild`
    );
    return result;
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
        hubs,
        priceAuditLogs,
        serviceChanges,
        payouts,
        refunds,
        auditLogs,
        securityAlerts,
        admins,
        firebaseDiagnostics,
        isSyncing,
        appConfig,
        updateAppConfig,
        addBanner,
        deleteBanner,
        toggleBannerActive,
        pushAllToLiveApps,
        updateCustomerStatus,
        updateCustomerDeletionStatus,
        sendCustomerNotification,
        updatePartnerStatus,
        assignPartnerToHub,
        removePartnerFromHub,
        setPartnerPrimaryHub,
        isPartnerEligibleForBooking,
        createHub,
        updateHub,
        toggleHubActive,
        findActiveHubForPincode,
        broadcastToHubCustomers,
        updateBookingStatus,
        assignBookingPartner,
        createBookingWithSnapshot,
        saveService,
        toggleServiceActive,
        updateServicePrice,
        approveServiceChange,
        rejectServiceChange,
        processPayout,
        processRefund,
        verifyBookingPayment,
        broadcastNotification,
        addAuditLog,
        resolveSecurityAlert,
        createAdminUser,
        updateAdminStatus,
        syncWithFirebase
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
