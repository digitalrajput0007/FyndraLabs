import { NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/adminAuth";
import { getFirebaseAdminDb } from "@/lib/firebaseAdmin";
import { sendApprovalEmail } from "@/lib/emailService";

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

      // Phase 5 Enforcement: Must be VERIFIED before Admin Approval
      if (docData?.requestVerificationStatus !== "VERIFIED") {
        conflictError = "Deletion request requires user email verification before admin approval can be granted.";
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
          requestVerificationStatus: "VERIFIED",
        },
      });
    });

    if (conflictError) {
      return NextResponse.json({ error: conflictError }, { status: 409 });
    }

    const currentData = (docData as unknown) as Record<string, any>;

    // Send Approval Email Notification to User
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
