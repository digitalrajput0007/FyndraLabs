import { NextResponse } from "next/server";
import { getFirebaseAdminDb } from "@/lib/firebaseAdmin";
import { sendVerificationEmail, sendSupportNotificationEmail } from "@/lib/emailService";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, fullName, email, reason, confirm } = body;

    const userFullName = (fullName || name || "").trim();
    const userEmail = (email || "").trim().toLowerCase();
    const userReason = (reason || "").trim();

    // 1. Server-side validation
    if (!userFullName || userFullName.length < 2) {
      return NextResponse.json(
        { error: "Please provide your full name (minimum 2 characters)." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userEmail || !emailRegex.test(userEmail)) {
      return NextResponse.json(
        { error: "Please provide a valid email address associated with your SplitMate account." },
        { status: 400 }
      );
    }

    if (confirm !== true) {
      return NextResponse.json(
        { error: "You must confirm that you understand account deletion is permanent." },
        { status: 400 }
      );
    }

    // 2. Require Firebase Admin / Firestore
    const { db, app, isConfigured } = getFirebaseAdminDb();

    if (!isConfigured || !db || !app) {
      return NextResponse.json(
        { error: "The account deletion service is temporarily unavailable. Please try again later or contact support." },
        { status: 503 }
      );
    }

    // 3. Rate Limiting Check (IP & Email level via Firestore)
    const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    const recentIpSnap = await db
      .collection("deletionRequests")
      .where("sourceIp", "==", clientIp)
      .get();

    const ipCount = recentIpSnap.docs.filter((d) => (d.data().createdAt || "") >= oneHourAgo).length;
    if (ipCount >= 5) {
      return NextResponse.json(
        { error: "Too many deletion requests submitted from your IP address. Please try again in an hour." },
        { status: 429 }
      );
    }

    // 4. Duplicate PENDING Request Check (Past 24 hours)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const existingPendingSnap = await db
      .collection("deletionRequests")
      .where("email", "==", userEmail)
      .where("status", "==", "PENDING")
      .get();

    const hasRecentPending = existingPendingSnap.docs.some((d) => {
      const createdAt = d.data().createdAt;
      return createdAt && createdAt >= twentyFourHoursAgo;
    });

    if (hasRecentPending) {
      console.log(`[SplitMate Deletion] Duplicate PENDING request suppressed for ${userEmail}`);
      return NextResponse.json(
        {
          success: true,
          message: "Deletion request received",
          detail: "Please check your inbox. A verification link has been sent to authorize your account deletion request.",
        },
        { status: 200 }
      );
    }

    // 5. Generate unique short request ID (e.g. DEL-8F4K2M) and 32-byte Cryptographic Verification Token
    const randomShort = crypto.randomBytes(3).toString("hex").toUpperCase();
    const requestId = `DEL-${randomShort}`;
    const createdAt = new Date().toISOString();

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const deletionPayload = {
      requestId,
      app: "SplitMate",
      fullName: userFullName,
      email: userEmail,
      reason: userReason,
      status: "PENDING",
      requestVerificationStatus: "PENDING",
      verificationTokenHash: tokenHash,
      verificationTokenExpiresAt: tokenExpiresAt,
      createdAt,
      source: "WEB",
      sourceIp: clientIp,
    };

    // Write to Firestore — success response ONLY after confirmed write
    await db.collection("deletionRequests").doc(requestId).set(deletionPayload);

    // 6. Send Immediate Verification Email to Customer & Internal Support Notification Email to Fyndra Labs
    const appUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://fyndralabs.com";
    const baseUrl = appUrl.replace(/\/$/, "");
    const verificationLink = `${baseUrl}/api/products/splitmate/delete-account/verify?requestId=${requestId}&token=${rawToken}`;

    // A) Customer Verification Email (contains verification token link)
    const userEmailResult = await sendVerificationEmail({
      requestId,
      fullName: userFullName,
      email: userEmail,
      verificationLink,
    });

    // B) Internal Support Notification Email (sent immediately to support@fyndralabs.com, NO raw token)
    const supportEmailResult = await sendSupportNotificationEmail({
      requestId,
      fullName: userFullName,
      email: userEmail,
      reason: userReason,
      createdAt,
    });

    // 7. Update Firestore document with email delivery status
    const emailProcessedAt = new Date().toISOString();
    const updateData: Record<string, unknown> = {
      userConfirmationEmailStatus: userEmailResult.status,
      verificationEmailStatus: userEmailResult.status, // preserve existing field
      supportEmailStatus: supportEmailResult.status,
      emailProcessedAt,
    };

    if (userEmailResult.emailId) {
      updateData.userConfirmationEmailMessageId = userEmailResult.emailId;
      updateData.verificationEmailId = userEmailResult.emailId; // preserve existing field
    }

    if (supportEmailResult.emailId) {
      updateData.supportEmailMessageId = supportEmailResult.emailId;
    }

    try {
      await db.collection("deletionRequests").doc(requestId).update(updateData);
    } catch (updateErr) {
      console.error("[SplitMate Deletion Update Email Status Error]:", updateErr);
    }

    // 8. Return generic success — does NOT reveal account existence or raw token
    return NextResponse.json(
      {
        success: true,
        requestId,
        message: "Deletion request received",
        detail: "Please check your inbox. A verification link has been sent to authorize your account deletion request.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[SplitMate Deletion API Error]:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your request. Please try again or contact support." },
      { status: 500 }
    );
  }
}
