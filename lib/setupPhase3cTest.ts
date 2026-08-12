import { getFirebaseAdminDb } from "@/lib/firebaseAdmin";
import { getAuth } from "firebase-admin/auth";
import crypto from "crypto";

export async function runStep1And2(testEmail: string) {
  console.log("=== PHASE 3C STEP 1 & 2: FIND USER & PROVISION DATA ===");
  const { db, app, isConfigured } = getFirebaseAdminDb();
  if (!isConfigured || !db || !app) {
    return { success: false, error: "Firebase Admin SDK failed to initialize" };
  }

  const authAdmin = getAuth(app);
  let testUserRecord;
  try {
    testUserRecord = await authAdmin.getUserByEmail(testEmail);
  } catch (err: any) {
    return { success: false, error: `Could not find Firebase Auth user for email ${testEmail}: ${err.message}` };
  }

  const testUid = testUserRecord.uid;
  const now = new Date().toISOString();

  // Create Partner Users for Group testing
  const partner1Email = `test-partner-1-${Date.now()}@fyndralabs.com`;
  const partner2Email = `test-partner-2-${Date.now()}@fyndralabs.com`;

  const partner1Record = await authAdmin.createUser({
    email: partner1Email,
    displayName: "Test Partner One",
    password: "Partner1Password123!",
  });

  const partner2Record = await authAdmin.createUser({
    email: partner2Email,
    displayName: "Test Partner Two",
    password: "Partner2Password123!",
  });

  const partner1Uid = partner1Record.uid;
  const partner2Uid = partner2Record.uid;

  // 1. Profile & Subcollections
  await db.collection("users").doc(testUid).set(
    {
      uid: testUid,
      name: testUserRecord.displayName || "Test User",
      email: testEmail,
      mobile: "+15550009999",
      updatedAt: now,
    },
    { merge: true }
  );

  await db.collection("users").doc(testUid).collection("contacts").doc("contact1").set({
    name: "Saved Contact 1",
    phone: "1234567890",
  });

  await db.collection("users").doc(testUid).collection("fcmTokens").doc("token1").set({
    token: "fcm_token_test_123",
    createdAt: now,
  });

  // Partner Profiles & Inverse Contact
  await db.collection("users").doc(partner1Uid).set({
    uid: partner1Uid,
    name: "Test Partner One",
    email: partner1Email,
    createdAt: now,
  });

  await db.collection("users").doc(partner2Uid).set({
    uid: partner2Uid,
    name: "Test Partner Two",
    email: partner2Email,
    createdAt: now,
  });

  await db.collection("users").doc(partner1Uid).collection("contacts").doc(testUid).set({
    name: "Test User",
    uid: testUid,
  });

  // 2. Groups
  const groupOwnedId = `test_group_owned_${Date.now()}`;
  const groupMemberId = `test_group_member_${Date.now()}`;

  await db.collection("groups").doc(groupOwnedId).set({
    groupId: groupOwnedId,
    name: "Test Owned Trip",
    createdBy: testUid,
    createdAt: now,
    memberIds: [testUid, partner1Uid, partner2Uid],
    membersDetails: [
      { uid: testUid, name: "Test User", email: testEmail, role: "Admin", joinedAt: 1000 },
      { uid: partner1Uid, name: "Test Partner One", email: partner1Email, role: "Member", joinedAt: 2000 },
      { uid: partner2Uid, name: "Test Partner Two", email: partner2Email, role: "Member", joinedAt: 3000 },
    ],
  });

  await db.collection("groups").doc(groupMemberId).set({
    groupId: groupMemberId,
    name: "Test Member Flat",
    createdBy: partner1Uid,
    createdAt: now,
    memberIds: [partner1Uid, testUid],
    membersDetails: [
      { uid: partner1Uid, name: "Test Partner One", email: partner1Email, role: "Admin", joinedAt: 1000 },
      { uid: testUid, name: "Test User", email: testEmail, role: "Member", joinedAt: 2000 },
    ],
  });

  // 3. Historical Expenses
  const expPaidByTestId = `exp_test_paid_${Date.now()}`;
  const expPaidByPartnerId = `exp_partner_paid_${Date.now()}`;

  await db.collection("expenses").doc(expPaidByTestId).set({
    expenseId: expPaidByTestId,
    groupId: groupOwnedId,
    title: "Test Dinner Paid by Test User",
    amount: 150,
    paidBy: testUid,
    paidByName: "Test User",
    splitType: "equal",
    splitDetails: {
      [testUid]: 50,
      [partner1Uid]: 50,
      [partner2Uid]: 50,
    },
    createdAt: now,
  });

  await db.collection("expenses").doc(expPaidByPartnerId).set({
    expenseId: expPaidByPartnerId,
    groupId: groupOwnedId,
    title: "Test Cab Paid by Partner One",
    amount: 60,
    paidBy: partner1Uid,
    paidByName: "Test Partner One",
    splitType: "equal",
    splitDetails: {
      [testUid]: 20,
      [partner1Uid]: 20,
      [partner2Uid]: 20,
    },
    createdAt: now,
  });

  // 4. Completed Settlement
  const settlementId = `settlement_${Date.now()}`;
  await db.collection("settlements").doc(settlementId).set({
    settlementId,
    groupId: groupOwnedId,
    amount: 30,
    fromUserId: partner1Uid,
    fromName: "Test Partner One",
    toUserId: testUid,
    toName: "Test User",
    status: "completed",
    createdAt: now,
  });

  // 5. Active Recurring Expense
  const recurringId = `recurring_${Date.now()}`;
  await db.collection("recurringExpenses").doc(recurringId).set({
    recurringExpenseId: recurringId,
    groupId: groupOwnedId,
    title: "Test Monthly WiFi",
    amount: 60,
    paidBy: testUid,
    splitBetween: [testUid, partner1Uid, partner2Uid],
    splitDetails: { [testUid]: 20, [partner1Uid]: 20, [partner2Uid]: 20 },
    active: true,
    createdBy: testUid,
  });

  // 6. Notifications
  const notifRecId = `notif_rec_${Date.now()}`;
  const notifSentId = `notif_sent_${Date.now()}`;

  await db.collection("notifications").doc(notifRecId).set({
    id: notifRecId,
    userId: testUid,
    recipientUid: testUid,
    title: "Test Notification",
    message: "Test message",
    createdAt: now,
  });

  await db.collection("notifications").doc(notifSentId).set({
    id: notifSentId,
    userId: partner1Uid,
    recipientUid: partner1Uid,
    title: "Test Reminder",
    message: "Test reminder sent",
    data: { senderUid: testUid, senderName: "Test User" },
    createdAt: now,
  });

  // Calculate Balances
  // Partner 1 Balance Math:
  // Expense 1 (Test Paid 150): Partner 1 owes 50 (+50 debt to Test)
  // Expense 2 (Partner 1 Paid 60): Test owes 20 (-20 debt) & Partner 2 owes 20 (+20 credit) -> Net debt to Test = 30
  // Settlement (Partner 1 paid Test 30): Net debt to Test becomes 0.
  // Partner 1 Net Balance with Partner 2 = +20 (Partner 2 owes Partner 1 $20).
  const partner1BalanceWithPartner2 = 20;
  const partner2BalanceWithPartner1 = -20;

  return {
    success: true,
    testUid,
    testEmail,
    partner1Uid,
    partner2Uid,
    groupOwnedId,
    groupMemberId,
    expPaidByTestId,
    expPaidByPartnerId,
    settlementId,
    recurringId,
    notifRecId,
    notifSentId,
    baselineBalances: {
      partner1BalanceWithPartner2,
      partner2BalanceWithPartner1,
    },
  };
}
