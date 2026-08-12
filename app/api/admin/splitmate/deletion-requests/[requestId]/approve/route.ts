import { NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/adminAuth";
import { getFirebaseAdminDb } from "@/lib/firebaseAdmin";
import { sendApprovalEmail, sendVerificationEmail } from "@/lib/emailService";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: { requestId: string } }
) {
  try {
    const authHeader = request.headers.get("Authorization");
    const authResult = await verifyAdminAuth(authHeader);

    if (!authResult.authorized) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status || 401 });
    }

    const { requestId } = params;
    if (!requestId) {
      return NextResponse.json({ error: "Request ID is required." }, { status: 400 });
    }

    const { db, isConfigured } = getFirebaseAdminDb();
    if (!isConfigured || !db) {
      return NextResponse.json({ error: "Database service unavailable." }, { status: 503 });
    }

    const docRef = db.collection("deletionRequests").doc(requestId);

    let docData: Record<string, any> | null = null;
    let conflictError: string | null = null;

    // Use Firestore Transaction for atomic PENDING -> APPROVED check & state mutation
    await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(docRef);

      if (!doc.exists) {
        conflictError = "Deletion request not found.";
        return;
      }

      docData = doc.data() || {};
      if (docData?.status !== "PENDING") {
        conflictError = `This deletion request has already been reviewed (current status: ${docData?.status}).`;
        return;
      }

      const reviewedAt = new Date().toISOString();
      const updateData = {
        status: "APPROVED",
        reviewedAt,
        reviewedBy: authResult.uid,
        reviewedByEmail: authResult.email,
        lastAction: "APPROVED",
      };

      transaction.update(docRef, updateData);

      // Record Audit Subcollection Entry
      const auditRef = docRef.collection("audit").doc();
      transaction.set(auditRef, {
        action: "APPROVED",
        performedBy: authResult.uid,
        performedByEmail: authResult.email,
        timestamp: reviewedAt,
        metadata: {
          previousStatus: "PENDING",
          newStatus: "APPROVED",
        },
      });
    });

    if (conflictError) {
      return NextResponse.json({ error: conflictError }, { status: 409 });
    }

    const currentData = (docData as unknown) as Record<string, any>;

    // Generate 24-hour verification token for user safety check
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://fyndralabs.com";
    const verificationLink = `${siteUrl}/api/products/splitmate/delete-account/verify?requestId=${requestId}&token=${rawToken}`;

    await docRef.update({
      verificationTokenHash: tokenHash,
      verificationTokenExpiresAt: expiresAt,
      requestVerificationStatus: "PENDING_VERIFICATION",
    });

    // Phase 2B/3B Email Dispatch after Firestore transaction succeeds
    const emailResult = await sendApprovalEmail({
      requestId,
      fullName: currentData.fullName || "User",
      email: currentData.email,
    });

    const updateEmailData: Record<string, any> = {
      approvalEmailStatus: emailResult.status,
    };
    if (emailResult.emailId) {
      updateEmailData.approvalEmailId = emailResult.emailId;
    }

    try {
      await docRef.update(updateEmailData);
      // Send verification link email
      await sendVerificationEmail({
        requestId,
        fullName: currentData.fullName || "User",
        email: currentData.email,
        verificationLink,
      });
    } catch (err) {
      console.error("[Admin Approval Email Status Update Error]:", err);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Deletion request successfully approved.",
        requestId,
        status: "APPROVED",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Admin Deletion Request Approve Error]:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while approving request." },
      { status: 500 }
    );
  }
}
