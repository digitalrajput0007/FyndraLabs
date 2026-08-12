import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

export interface AdminUserAuthResult {
  authorized: boolean;
  uid?: string;
  email?: string;
  error?: string;
  status?: number;
}

/**
 * Server-only helper to verify Firebase ID Token and check /admins/{uid} collection.
 * Must have role === 'admin' and enabled === true in Firestore.
 */
export async function verifyAdminAuth(authHeader: string | null): Promise<AdminUserAuthResult> {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { authorized: false, error: "Missing or invalid authorization header.", status: 401 };
  }

  const token = authHeader.split("Bearer ")[1]?.trim();
  if (!token) {
    return { authorized: false, error: "Bearer token required.", status: 401 };
  }

  const apps = getApps();
  let adminApp = apps.length > 0 ? apps[0] : null;

  if (!adminApp) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    try {
      if (serviceAccountJson) {
        adminApp = initializeApp({ credential: cert(JSON.parse(serviceAccountJson)) });
      } else if (projectId && clientEmail && privateKey) {
        adminApp = initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
      }
    } catch (err) {
      console.error("[Admin Auth SDK Init Error]:", err);
      return { authorized: false, error: "Server authentication misconfiguration.", status: 500 };
    }
  }

  if (!adminApp) {
    return { authorized: false, error: "Firebase Admin SDK not initialized.", status: 500 };
  }

  try {
    const auth = getAuth(adminApp);
    const decodedToken = await auth.verifyIdToken(token);
    const uid = decodedToken.uid;
    const email = decodedToken.email || "";

    const db = getFirestore(adminApp);
    const adminDoc = await db.collection("admins").doc(uid).get();

    if (!adminDoc.exists) {
      return { authorized: false, error: "User is not registered as an administrator.", status: 403 };
    }

    const adminData = adminDoc.data();
    if (!adminData || adminData.role !== "admin" || adminData.enabled !== true) {
      return { authorized: false, error: "User does not have active admin privileges.", status: 403 };
    }

    return { authorized: true, uid, email };
  } catch (err) {
    console.error("[Admin Auth Verification Error]:", err);
    return { authorized: false, error: "Invalid or expired ID token.", status: 401 };
  }
}
