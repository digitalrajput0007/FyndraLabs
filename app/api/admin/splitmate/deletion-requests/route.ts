import { NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/adminAuth";
import { getFirebaseAdminDb } from "@/lib/firebaseAdmin";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const authResult = await verifyAdminAuth(authHeader);

    if (!authResult.authorized) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status || 401 });
    }

    const { db, isConfigured } = getFirebaseAdminDb();
    if (!isConfigured || !db) {
      return NextResponse.json({ error: "Database service unavailable." }, { status: 503 });
    }

    const snapshot = await db
      .collection("deletionRequests")
      .orderBy("createdAt", "desc")
      .limit(100)
      .get();

    const requests = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        requestId: data.requestId || doc.id,
        app: data.app || "SplitMate",
        fullName: data.fullName || "—",
        email: data.email || "—",
        reason: data.reason || "—",
        status: data.status || "PENDING",
        requestVerificationStatus: data.requestVerificationStatus || "PENDING",
        source: data.source || "WEB",
        createdAt: data.createdAt || "—",
        emailStatus: data.emailStatus || null,
        verificationEmailStatus: data.verificationEmailStatus || null,
        emailProcessedAt: data.emailProcessedAt || null,
        supportEmailId: data.supportEmailId || null,
        userEmailId: data.userEmailId || null,
        reviewedAt: data.reviewedAt || null,
        reviewedBy: data.reviewedBy || null,
        reviewedByEmail: data.reviewedByEmail || null,
        rejectionReason: data.rejectionReason || null,
        approvalEmailStatus: data.approvalEmailStatus || null,
        rejectionEmailStatus: data.rejectionEmailStatus || null,
      };
    });

    return NextResponse.json({ requests }, { status: 200 });
  } catch (error) {
    console.error("[Admin Deletion Requests GET Error]:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while fetching requests." },
      { status: 500 }
    );
  }
}
