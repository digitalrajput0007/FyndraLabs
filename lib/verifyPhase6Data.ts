import { getFirebaseAdminDb } from "./firebaseAdmin";

async function verifyCurrentTestData() {
  console.log("=== READ-ONLY AUDIT: VERIFYING PHASE 6 TEST DATA ===");
  const { db, isConfigured } = getFirebaseAdminDb();
  if (!isConfigured || !db) {
    throw new Error("Database service unavailable.");
  }

  const requestId = "DEL-959BBC";
  const expectedUid = "vOEcAj3SFzcJxNVoLJFOcfOrCof2";

  console.log(`1. Inspecting Deletion Request Doc: ${requestId}`);
  const reqSnap = await db.collection("deletionRequests").doc(requestId).get();
  if (!reqSnap.exists) {
    throw new Error(`Request ${requestId} not found!`);
  }
  const reqData = reqSnap.data()!;
  console.log("Deletion Request Data:", {
    requestId: reqData.requestId,
    status: reqData.status,
    requestVerificationStatus: reqData.requestVerificationStatus,
    targetUid: reqData.targetUid,
    email: reqData.email,
  });

  if (reqData.targetUid !== expectedUid) {
    throw new Error(`Target UID mismatch! Expected ${expectedUid}, got ${reqData.targetUid}`);
  }

  console.log("\n2. Inspecting Test Expense: expense_p6_paid_1786532564667");
  const expSnap = await db.collection("expenses").doc("expense_p6_paid_1786532564667").get();
  if (!expSnap.exists) {
    throw new Error("Test expense not found!");
  }
  const expData = expSnap.data()!;
  console.log("Expense Financial Identity Data:", {
    expenseId: expData.expenseId,
    amount: expData.amount,
    paidBy: expData.paidBy,
    paidByName: expData.paidByName || "(not set yet)",
    splitDetails: expData.splitDetails,
  });

  if (expData.paidBy !== expectedUid) {
    throw new Error(`CRITICAL: expense.paidBy was modified! Expected ${expectedUid}, got ${expData.paidBy}`);
  }

  console.log("\n3. Inspecting Test Settlement: settlement_p6_1786532564667");
  const setSnap = await db.collection("settlements").doc("settlement_p6_1786532564667").get();
  if (!setSnap.exists) {
    throw new Error("Test settlement not found!");
  }
  const setData = setSnap.data()!;
  console.log("Settlement Financial Identity Data:", {
    settlementId: setData.settlementId,
    amount: setData.amount,
    fromUserId: setData.fromUserId,
    toUserId: setData.toUserId,
    fromName: setData.fromName || "(not set yet)",
    toName: setData.toName || "(not set yet)",
  });

  if (setData.fromUserId !== expectedUid) {
    throw new Error(`CRITICAL: settlement.fromUserId was modified! Expected ${expectedUid}, got ${setData.fromUserId}`);
  }

  console.log("\n✅ ALL TEST DATA REMAINS 100% UNTOUCHED AND INTACT!");
}

verifyCurrentTestData().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
