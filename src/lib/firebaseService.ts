import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  addDoc, 
  query, 
  limit, 
  orderBy, 
  serverTimestamp,
  type DocumentData
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  signOut as fbSignOut, 
  onAuthStateChanged,
  type User
} from 'firebase/auth';
import { db, auth } from './firebase';
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
  AdminRole,
  Hub,
  AppGlobalConfig
} from '../types/cleankr';

export type FirebaseConnectionState = 'CHECKING' | 'CONNECTED_LIVE' | 'FALLBACK_LOCAL' | 'PERMISSION_DENIED' | 'CONFIGURATION_REQUIRED';

export interface FirebaseDiagnostics {
  state: FirebaseConnectionState;
  projectId: string;
  authDomain: string;
  errorMessage?: string;
  lastChecked: string;
  liveCollections: {
    customersCount: number;
    partnersCount: number;
    bookingsCount: number;
    servicesCount: number;
    auditLogsCount: number;
  };
}

/**
 * Diagnostic test to verify live connection with cleankr-724ce
 */
export async function testFirebaseConnection(): Promise<FirebaseDiagnostics> {
  const diagnostics: FirebaseDiagnostics = {
    state: 'CHECKING',
    projectId: 'cleankr-724ce',
    authDomain: 'cleankr-724ce.firebaseapp.com',
    lastChecked: new Date().toISOString(),
    liveCollections: {
      customersCount: 0,
      partnersCount: 0,
      bookingsCount: 0,
      servicesCount: 0,
      auditLogsCount: 0
    }
  };

  try {
    if (!db) {
      diagnostics.state = 'CONFIGURATION_REQUIRED';
      diagnostics.errorMessage = 'Firestore client instance not initialized.';
      return diagnostics;
    }

    // Try pinging public services catalog
    const srvRef = collection(db, 'services');
    const srvQuery = query(srvRef, limit(10));
    const srvSnap = await getDocs(srvQuery);
    
    diagnostics.liveCollections.servicesCount = srvSnap.size;
    diagnostics.state = 'CONNECTED_LIVE';
    return diagnostics;
  } catch (err: any) {
    console.warn('[Firebase Verification] Live query outcome:', err?.code || err?.message);
    if (err?.code === 'permission-denied') {
      diagnostics.state = 'PERMISSION_DENIED';
      diagnostics.errorMessage = 'Default-deny security rules enforced: Unauthenticated access blocked as designed.';
    } else if (err?.code === 'auth/api-key-not-valid' || err?.message?.includes('API key')) {
      diagnostics.state = 'CONFIGURATION_REQUIRED';
      diagnostics.errorMessage = 'Production Firebase Web API key requires configuration in .env.local.';
    } else {
      diagnostics.state = 'FALLBACK_LOCAL';
      diagnostics.errorMessage = err?.message || 'Network unreachable or offline fallback active.';
    }
    return diagnostics;
  }
}

/**
 * Real Firebase Auth Sign In with Admin Role Verification
 */
export async function authenticateAdminUser(
  email: string, 
  pass: string
): Promise<{ user: User | null; admin: AdminUser | null; error?: string }> {
  try {
    if (!auth) throw new Error('Firebase Auth not available');
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;

    // Check custom claims or /admins/{uid}
    const tokenResult = await user.getIdTokenResult();
    const tokenRole = tokenResult.claims.role as AdminRole | undefined;

    let adminData: AdminUser | null = null;

    if (tokenRole) {
      adminData = {
        uid: user.uid,
        email: user.email || email,
        displayName: user.displayName || email.split('@')[0],
        role: tokenRole,
        isActive: true,
        createdAt: user.metadata.creationTime || new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        mfaEnabled: true
      };
    } else if (db) {
      // Query /admins/{uid} in Firestore
      const adminDocRef = doc(db, 'admins', user.uid);
      const adminDoc = await getDoc(adminDocRef);
      if (adminDoc.exists()) {
        const data = adminDoc.data();
        if (!data.isActive) {
          throw new Error('This administrative account has been deactivated by Super Admin.');
        }
        adminData = {
          uid: user.uid,
          email: user.email || email,
          displayName: data.displayName || email.split('@')[0],
          role: data.role || 'READ_ONLY_ADMIN',
          isActive: data.isActive,
          phoneNumber: data.phoneNumber,
          createdAt: data.createdAt || new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          mfaEnabled: !!data.mfaEnabled
        };
      } else {
        // User authenticated but not authorized as admin!
        await fbSignOut(auth);
        throw new Error('Access Denied: Authenticated account does not possess administrative authorization in /admins.');
      }
    }

    return { user, admin: adminData };
  } catch (err: any) {
    return { user: null, admin: null, error: err?.message || 'Authentication failed' };
  }
}

/**
 * Write immutable audit log to Firestore
 */
export async function writeAuditLogToFirestore(log: AuditLog): Promise<boolean> {
  try {
    if (!db) return false;
    const colRef = collection(db, 'audit_logs');
    await setDoc(doc(colRef, log.id), {
      ...log,
      serverCreatedAt: serverTimestamp()
    });
    return true;
  } catch (err) {
    console.warn('[Audit Log] Could not write to remote Firestore (will persist locally):', err);
    return false;
  }
}

/**
 * Real-time OTA Write-through: Sync Service Catalog directly to Firestore
 * Customer App fetches collection('services') in real-time without Play Store updates.
 */
export async function writeServiceToFirestore(service: ServiceItem): Promise<boolean> {
  try {
    if (!db) return false;
    const sanitized = JSON.parse(JSON.stringify(service));
    const srvRef = doc(db, 'services', service.id);
    await setDoc(srvRef, {
      ...sanitized,
      serverUpdatedAt: serverTimestamp()
    }, { merge: true });
    return true;
  } catch (err) {
    console.warn(`[Firestore OTA] Failed to write service ${service.id} to Firestore:`, err);
    return false;
  }
}

/**
 * Real-time OTA Write-through: Sync Pune Hubs directly to Firestore
 * Customer & Partner Apps fetch collection('hubs') in real-time.
 */
export async function writeHubToFirestore(hub: Hub): Promise<boolean> {
  try {
    if (!db) return false;
    const sanitized = JSON.parse(JSON.stringify(hub));
    const hubRef = doc(db, 'hubs', hub.hubId);
    await setDoc(hubRef, {
      ...sanitized,
      serverUpdatedAt: serverTimestamp()
    }, { merge: true });
    return true;
  } catch (err) {
    console.warn(`[Firestore OTA] Failed to write hub ${hub.hubId} to Firestore:`, err);
    return false;
  }
}

/**
 * Real-time OTA Write-through: Sync Partner Profile & Hub Assignments to Firestore
 * Partner App listens to partners/{partnerId} in real-time.
 */
export async function writePartnerUpdateToFirestore(partnerId: string, updates: Partial<Partner>): Promise<boolean> {
  try {
    if (!db) return false;
    const sanitized = JSON.parse(JSON.stringify(updates));
    const partnerRef = doc(db, 'partners', partnerId);
    await setDoc(partnerRef, {
      ...sanitized,
      serverUpdatedAt: serverTimestamp()
    }, { merge: true });
    return true;
  } catch (err) {
    console.warn(`[Firestore OTA] Failed to update partner ${partnerId} in Firestore:`, err);
    return false;
  }
}

/**
 * Real-time OTA Write-through: Sync Customer Profile / Status to Firestore
 */
export async function writeCustomerUpdateToFirestore(customerId: string, updates: Partial<Customer>): Promise<boolean> {
  try {
    if (!db) return false;
    const sanitized = JSON.parse(JSON.stringify(updates));
    const custRef = doc(db, 'customers', customerId);
    await setDoc(custRef, {
      ...sanitized,
      serverUpdatedAt: serverTimestamp()
    }, { merge: true });
    return true;
  } catch (err) {
    console.warn(`[Firestore OTA] Failed to update customer ${customerId} in Firestore:`, err);
    return false;
  }
}

/**
 * Real-time OTA Write-through: Sync Global App Configuration & Dynamic Banners
 * Customer & Partner apps listen to doc('app_config', 'global') for instant over-the-air updates
 * (helpline numbers, emergency maintenance, banners, minimum version check).
 */
export async function writeAppConfigToFirestore(config: AppGlobalConfig): Promise<boolean> {
  try {
    if (!db) return false;
    const sanitized = JSON.parse(JSON.stringify(config));
    const configRef = doc(db, 'app_config', 'global');
    await setDoc(configRef, {
      ...sanitized,
      serverUpdatedAt: serverTimestamp()
    }, { merge: true });
    return true;
  } catch (err) {
    console.warn('[Firestore OTA] Failed to write app_config/global to Firestore:', err);
    return false;
  }
}

/**
 * Instant Bulk OTA Push: Pushes all Services, Hubs, and App Config to Firebase Firestore
 * Customer App and Partner App update immediately without Play Store APK release.
 */
export async function pushAllToFirestore(
  services: ServiceItem[],
  hubs: Hub[],
  config: AppGlobalConfig
): Promise<{ success: boolean; syncedServices: number; syncedHubs: number; error?: string }> {
  try {
    if (!db) {
      return { success: false, syncedServices: 0, syncedHubs: 0, error: 'Firestore client not initialized' };
    }

    // 1. Sync all services
    let sCount = 0;
    for (const srv of services) {
      await writeServiceToFirestore(srv);
      sCount++;
    }

    // 2. Sync all hubs
    let hCount = 0;
    for (const hub of hubs) {
      await writeHubToFirestore(hub);
      hCount++;
    }

    // 3. Sync app config & banners
    await writeAppConfigToFirestore(config);

    return {
      success: true,
      syncedServices: sCount,
      syncedHubs: hCount
    };
  } catch (err: any) {
    return {
      success: false,
      syncedServices: 0,
      syncedHubs: 0,
      error: err?.message || 'Bulk push failed'
    };
  }
}
