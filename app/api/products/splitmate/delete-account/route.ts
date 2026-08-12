import { NextResponse } from "next/server";
import { getFirebaseAdminDb } from "@/lib/firebaseAdmin";
import { sendDeletionEmails } from "@/lib/emailService";
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

    // 2. Require Firebase Admin / Firestore — no fallback logging
    const { db, app, isConfigured } = getFirebaseAdminDb();

    if (!isConfigured || !db || !app) {
      // Return 503 — service not available; do not expose internal error details to the client
      return NextResponse.json(
        { error: "The account deletion service is temporarily unavailable. Please try again later or contact support." },
        { status: 503 }
      );
    }

    // 3. Duplicate PENDING Request Check (Past 24 hours)
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
          detail: "Your request has been securely submitted. We will verify the request and process your account deletion.",
        },
        { status: 200 }
      );
    }

    // 4. Generate unique request ID
    const randomHex = crypto.randomBytes(4).toString("hex");
    const requestId = `del_sm_${Date.now()}_${randomHex}`;
    const createdAt = new Date().toISOString();

    const deletionPayload = {
      requestId,
      app: "SplitMate",
      fullName: userFullName,
      email: userEmail,
      reason: userReason,
      status: "PENDING",
      createdAt,
      source: "WEB",
    };

    // 4. Write to Firestore — success response ONLY after confirmed write
    await db.collection("deletionRequests").doc(requestId).set(deletionPayload);

    // Safe Server-Side Diagnostics Log
    const resolvedProjectId = app.options.projectId || "UNKNOWN";
    const databaseId = "(default)";
    console.log(
      `[SplitMate Deletion Diagnostic]\nFirebase project ID: ${resolvedProjectId}\nFirestore database: ${databaseId}\nCollection: deletionRequests\nRequest ID: ${requestId}\nFirestore write: SUCCESS`
    );

    // 5. Phase 2A: Send Resend Email Notifications (Support & User)
    const emailResult = await sendDeletionEmails({
      requestId,
      fullName: userFullName,
      email: userEmail,
      reason: userReason,
      createdAt,
    });

    // 6. Update Firestore document with email delivery status
    const emailProcessedAt = new Date().toISOString();
    const updateData: Record<string, unknown> = {
      emailStatus: {
        support: emailResult.supportStatus,
        user: emailResult.userStatus,
      },
      emailProcessedAt,
    };

    if (emailResult.supportEmailId) {
      updateData.supportEmailId = emailResult.supportEmailId;
    }
    if (emailResult.userEmailId) {
      updateData.userEmailId = emailResult.userEmailId;
    }

    try {
      await db.collection("deletionRequests").doc(requestId).update(updateData);
    } catch (updateErr) {
      console.error("[SplitMate Deletion Update Email Status Error]:", updateErr);
    }

    // 7. Return success — guaranteed that Firestore document exists at this point
    return NextResponse.json(
      {
        success: true,
        requestId,
        message: "Deletion request received",
        detail: "Your request has been securely submitted. We will verify the request and process your account deletion.",
      },
      { status: 200 }
    );
  } catch (error) {
    // Do not expose internal error details (Firebase errors, stack traces) to the client
    console.error("[SplitMate Deletion API Error]:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your request. Please try again or contact support." },
      { status: 500 }
    );
  }
}
