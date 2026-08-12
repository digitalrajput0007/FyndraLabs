import { NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/adminAuth";
import { getFirebaseAdminDb } from "@/lib/firebaseAdmin";

export const dynamic = "force-dynamic";

export async function GET(
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
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: "Deletion request not found." }, { status: 404 });
    }

    const data = doc.data() || {};

    // Retrieve Audit Trail subcollection
    const auditSnapshot = await docRef.collection("audit").orderBy("timestamp", "desc").get();
    const auditTrail = auditSnapshot.docs.map((auditDoc) => ({
      id: auditDoc.id,
      ...auditDoc.data(),
    }));

    return NextResponse.json(
      {
        request: {
          requestId: data.requestId || doc.id,
          app: data.app || "SplitMate",
          fullName: data.fullName || "—",
          email: data.email || "—",
          reason: data.reason || "—",
          status: data.status || "PENDING",
          source: data.source || "WEB",
          createdAt: data.createdAt || "—",
          emailStatus: data.emailStatus || null,
          emailProcessedAt: data.emailProcessedAt || null,
          supportEmailId: data.supportEmailId || null,
          userEmailId: data.userEmailId || null,
          reviewedAt: data.reviewedAt || null,
          reviewedBy: data.reviewedBy || null,
          reviewedByEmail: data.reviewedByEmail || null,
          rejectionReason: data.rejectionReason || null,
          approvalEmailStatus: data.approvalEmailStatus || null,
          rejectionEmailStatus: data.rejectionEmailStatus || null,
          auditTrail,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Admin Deletion Request Detail GET Error]:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while fetching request details." },
      { status: 500 }
    );
  }
}
