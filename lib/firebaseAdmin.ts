import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";

/**
 * Server-only Firebase Admin SDK initializer.
 * Credentials are retrieved securely from environment variables or local fallback key.
 */
export function getFirebaseAdminDb() {
  const apps = getApps();
  if (apps.length > 0) {
    return { db: getFirestore(apps[0]), app: apps[0], isConfigured: true };
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // Handle escaped newlines in environment variable private key
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  try {
    if (serviceAccountJson) {
      const parsedServiceAccount = JSON.parse(serviceAccountJson);
      const app = initializeApp({
        credential: cert(parsedServiceAccount),
      });
      return { db: getFirestore(app), app, isConfigured: true };
    }

    if (projectId && clientEmail && privateKey) {
      const app = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      return { db: getFirestore(app), app, isConfigured: true };
    }

    // Local development fallback to SplitMate service account key
    const localKeyPath = path.join("C:", "SplitMate", "splitmate-d2d66-firebase-adminsdk-fbsvc-c01c280d7f.json");
    if (fs.existsSync(localKeyPath)) {
      const localKeyContent = fs.readFileSync(localKeyPath, "utf8");
      const parsedLocalKey = JSON.parse(localKeyContent);
      const app = initializeApp({
        credential: cert(parsedLocalKey),
      });
      return { db: getFirestore(app), app, isConfigured: true };
    }
  } catch (error) {
    console.error("[Firebase Admin Initialization Error]:", error);
    return { db: null, app: null, isConfigured: false, error: "FIREBASE_ADMIN_INIT_FAILED" };
  }

  return { db: null, app: null, isConfigured: false, error: "FIREBASE_ADMIN_CREDENTIALS_MISSING" };
}
