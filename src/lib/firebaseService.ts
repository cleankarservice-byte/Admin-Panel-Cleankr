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
  AdminRole
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
