import { NextResponse } from "next/server";
import { getFirebaseAdminDb } from "@/lib/firebaseAdmin";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const requestId = url.searchParams.get("requestId");

  if (!token || !requestId) {
    return NextResponse.json({ error: "Missing verification token or request ID." }, { status: 400 });
  }

  const { db, isConfigured } = getFirebaseAdminDb();
  if (!isConfigured || !db) {
    return NextResponse.json({ error: "Database service unavailable." }, { status: 503 });
  }

  const docRef = db.collection("deletionRequests").doc(requestId);
  const docSnap = await docRef.get();

  if (!docSnap.exists) {
    return NextResponse.json({ error: "Deletion request not found." }, { status: 404 });
  }

  const data = docSnap.data() || {};
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  if (data.verificationTokenHash !== tokenHash) {
    return NextResponse.json({ error: "Invalid verification token." }, { status: 401 });
  }

  if (data.verificationTokenExpiresAt && new Date(data.verificationTokenExpiresAt) < new Date()) {
    return NextResponse.json({ error: "Verification token has expired." }, { status: 410 });
  }

  const now = new Date().toISOString();
  await docRef.update({
    requestVerificationStatus: "VERIFIED",
    verifiedAt: now,
  });

  await docRef.collection("audit").add({
    action: "EMAIL_VERIFIED",
    performedBy: "USER",
    timestamp: now,
  });

  return new NextResponse(
    `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>Deletion Request Verified</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; color: #0f172a; display: flex; items-center; justify-content: center; min-height: 100vh; margin: 0; }
          .card { background-color: #ffffff; padding: 32px; border-radius: 12px; border: 1px solid #e2e8f0; max-width: 480px; text-align: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
          h1 { color: #0065F2; font-size: 20px; margin-bottom: 12px; }
          p { color: #475569; font-size: 14px; line-height: 1.6; }
          .code { font-family: monospace; background: #e2e8f0; padding: 2px 6px; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Verification Successful</h1>
          <p>Your SplitMate account deletion request (<span class="code">${requestId}</span>) has been verified.</p>
          <p>Our administration team has been authorized to proceed with final account processing.</p>
        </div>
      </body>
    </html>
    `,
    {
      status: 200,
      headers: { "Content-Type": "text/html" },
    }
  );
}
