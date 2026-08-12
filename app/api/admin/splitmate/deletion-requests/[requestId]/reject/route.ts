import { NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/adminAuth";
import { getFirebaseAdminDb } from "@/lib/firebaseAdmin";
import { sendRejectionEmail } from "@/lib/emailService";

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

    const body = await request.json();
    const rejectionReason = (body.rejectionReason || body.reason || "").trim();

    if (!rejectionReason || rejectionReason.length < 3) {
      return NextResponse.json(
        { error: "A detailed rejection reason is required (minimum 3 characters)." },
        { status: 400 }
      );
    }

    const { db, isConfigured } = getFirebaseAdminDb();
    if (!isConfigured || !db) {
      return NextResponse.json({ error: "Database service unavailable." }, { status: 503 });
    }

    const docRef = db.collection("deletionRequests").doc(requestId);

    let docData: Record<string, any> | null = null;
    let conflictError: string | null = null;

    // Use Firestore Transaction for atomic PENDING -> REJECTED check & state mutation
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
        status: "REJECTED",
        rejectionReason,
        reviewedAt,
        reviewedBy: authResult.uid,
        reviewedByEmail: authResult.email,
        lastAction: "REJECTED",
      };

      transaction.update(docRef, updateData);

      // Record Audit Subcollection Entry
      const auditRef = docRef.collection("audit").doc();
      transaction.set(auditRef, {
        action: "REJECTED",
        rejectionReason,
        performedBy: authResult.uid,
        performedByEmail: authResult.email,
        timestamp: reviewedAt,
        metadata: {
          previousStatus: "PENDING",
          newStatus: "REJECTED",
        },
      });
    });

    if (conflictError) {
      return NextResponse.json({ error: conflictError }, { status: 409 });
    }

    const currentData = (docData as unknown) as Record<string, any>;

    // Phase 2B Email Dispatch after Firestore transaction succeeds
    const emailResult = await sendRejectionEmail({
      requestId,
      fullName: currentData.fullName || "User",
      email: currentData.email,
      rejectionReason,
    });

    const updateEmailData: Record<string, any> = {
      rejectionEmailStatus: emailResult.status,
    };
    if (emailResult.emailId) {
      updateEmailData.rejectionEmailId = emailResult.emailId;
    }

    try {
      await docRef.update(updateEmailData);
    } catch (err) {
      console.error("[Admin Rejection Email Status Update Error]:", err);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Deletion request successfully rejected.",
        requestId,
        status: "REJECTED",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Admin Deletion Request Reject Error]:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while rejecting request." },
      { status: 500 }
    );
  }
}
