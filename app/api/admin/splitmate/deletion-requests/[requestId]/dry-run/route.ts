import { NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/adminAuth";
import { getFirebaseAdminDb } from "@/lib/firebaseAdmin";
import { getAuth } from "firebase-admin/auth";

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

    const { db, app, isConfigured } = getFirebaseAdminDb();
    if (!isConfigured || !db || !app) {
      return NextResponse.json({ error: "Database service unavailable." }, { status: 503 });
    }

    const docRef = db.collection("deletionRequests").doc(requestId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: "Deletion request not found." }, { status: 404 });
    }

    const reqData = docSnap.data() || {};
    const email = reqData.email;

    if (!email) {
      return NextResponse.json({ error: "No target email found in deletion request." }, { status: 400 });
    }

    let targetUid = reqData.targetUid || null;
    let authUserFound = false;

    if (!targetUid) {
      try {
        const authAdmin = getAuth(app);
        const userRecord = await authAdmin.getUserByEmail(email);
        targetUid = userRecord.uid;
        authUserFound = true;

        await docRef.update({
          targetUid,
          targetEmail: userRecord.email || email,
          targetUidResolvedAt: new Date().toISOString(),
        });
      } catch (err: any) {
        console.warn("[Dry-Run Auth Lookup Warning]:", err.message);
      }
    } else {
      authUserFound = true;
    }

    const report = {
      requestId,
      targetEmail: email,
      targetUid: targetUid || "NOT_FOUND_IN_AUTH",
      authUserFound,
      status: reqData.status,
      actionsProposed: {
        deletePrivateData: [
          `users/${targetUid || "<uid>"}`,
          `users/${targetUid || "<uid>"}/contacts/*`,
          `users/${targetUid || "<uid>"}/fcmTokens/*`,
          `notifications (where userId == ${targetUid || "<uid>"})`,
        ],
        removeReferences: [
          `groups (remove ${targetUid || "<uid>"} from memberIds array)`,
          `users/*/contacts/${targetUid || "<uid>"} (unlink reverse contacts)`,
          `recurringExpenses (set active: false for bills paid by ${targetUid || "<uid>"})`,
        ],
        anonymizeFinancialRecords: [
          `expenses (set paidByName = "Deleted User", preserve amount & splitDetails)`,
          `settlements (set fromName/toName = "Deleted User", preserve amount & UIDs)`,
          `groups (set membersDetails name = "Deleted User")`,
        ],
        preserveFinancialMath: [
          "expenses.amount",
          "expenses.splitDetails (all keys preserved)",
          "expenses.paidBy",
          "settlements.amount",
          "settlements.fromUserId",
          "settlements.toUserId",
        ],
        authAccount: authUserFound ? `Delete Auth User ${targetUid}` : "Skip (Auth User not found)",
      },
    };

    return NextResponse.json({ success: true, report }, { status: 200 });
  } catch (error) {
    console.error("[Admin Deletion Request Dry-Run Error]:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during dry-run audit." },
      { status: 500 }
    );
  }
}
