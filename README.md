# Cleankr Admin Panel — Production Control Center

Production-grade, security-first web control center for the **Cleankr** service marketplace, integrated with existing Customer & Partner apps.

- **Production Subdomain**: `https://admin.cleankr.co.in`
- **Main Production Domain**: `https://cleankr.co.in`
- **Authoritative Firebase Project**: `cleankr-724ce`

---

## 1. System Architecture & Cross-App Consistency

```
   [Cleankr Customer App]        [Cleankr Partner App]
            │                              │
            └──► [ Firebase: cleankr-724ce ] ◄──┘
                           ▲
                           │
             [ Cleankr Admin Panel ]
```

### Shared Authoritative Firestore Collections
- `/customers`: Registered marketplace buyers, addresses, booking frequency.
- `/partners`: Service professionals, KYC identity docs, police checks, approval status.
- `/services`: Company-controlled fixed pricing, packages, add-ons. (Client apps cannot override prices).
- `/bookings`: Operational lifecycle state machine (`CREATED` -> `ASSIGNED` -> `ACCEPTED` -> `ON_THE_WAY` -> `ARRIVED` -> `STARTED` -> `COMPLETED`).
- `/service_changes`: Partner on-site change proposals. Only Admin approval converts them into updated booking charges.
- `/payouts`: Verified bank settlements with UTR references.
- `/refunds`: Adjudicated customer dispute resolutions.
- `/audit_logs`: Append-only immutable log (`allow update, delete: if false`).
- `/security_alerts`: Threat detection & brute force monitoring.

---

## 2. Granular Role-Based Access Control (RBAC)

1. **SUPER_ADMIN**: Full system administration, admin user provisioning, rule controls.
2. **OPERATIONS_ADMIN**: Customer profiles, partner vetting, booking assignment, service catalog & change requests.
3. **FINANCE_ADMIN**: Payment transaction ledger, refund adjudication, partner payout settlements.
4. **SUPPORT_ADMIN**: Customer dispute intake, booking assistance, inquiry handling.
5. **READ_ONLY_ADMIN**: Audit and observation access without mutate capabilities.

---

## 3. Security Rules & Deployment

The repository includes production rules:
- `firestore.rules`: Strict **DEFAULT DENY** posture, server-enforced claims, immutable audit logs.
- `storage.rules`: Partner document lockdown; only partner & authorized admins can access KYC credentials.

Deploy rules via Firebase CLI:
```bash
firebase deploy --only firestore:rules,storage
```

---

## 4. Environment Configuration

Copy `.env.example` to `.env.local` to override default Firebase Web keys:

```env
VITE_FIREBASE_API_KEY="your-firebase-web-api-key"
VITE_FIREBASE_AUTH_DOMAIN="cleankr-724ce.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="cleankr-724ce"
VITE_FIREBASE_STORAGE_BUCKET="cleankr-724ce.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
VITE_FIREBASE_APP_ID="your-firebase-app-id"
```
