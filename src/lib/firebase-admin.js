import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

let adminApp;
let adminAuth;
let adminDb;

try {
  // Check if already initialized
  if (getApps().length === 0) {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
      : null;

    if (serviceAccount) {
      adminApp = initializeApp({
        credential: cert(serviceAccount),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
    } else {
      // Fallback: Initialize with project ID (for development)
      // Note: This requires setting GOOGLE_APPLICATION_CREDENTIALS or using Application Default Credentials
      adminApp = initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
    }

    adminAuth = getAuth(adminApp);
    adminDb = getFirestore(adminApp);
  } else {
    adminApp = getApps()[0];
    adminAuth = getAuth(adminApp);
    adminDb = getFirestore(adminApp);
  }
} catch (error) {
  console.error('Firebase Admin initialization error:', error);
}

export { adminAuth, adminDb };

