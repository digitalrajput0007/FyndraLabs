import { getFirebaseAdminDb } from "@/lib/firebaseAdmin";
import { getAuth } from "firebase-admin/auth";

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

  const { db, app, isConfigured } = getFirebaseAdminDb();

  if (!isConfigured || !db || !app) {
    return { authorized: false, error: "Firebase Admin SDK not initialized.", status: 500 };
  }

  try {
    const auth = getAuth(app);
    const decodedToken = await auth.verifyIdToken(token);
    const uid = decodedToken.uid;
    const email = decodedToken.email || "";

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
