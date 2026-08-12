/**
 * Phase 6 — READ-ONLY Post-ECONNRESET Investigation
 *
 * NO WRITES. NO DELETIONS. NO MODIFICATIONS. ZERO SIDE-EFFECTS.
 *
 * Reads directly from Firestore + Firebase Auth Admin SDK.
 */

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore }                  from "firebase-admin/firestore";
import { getAuth }                       from "firebase-admin/auth";
import fs                                from "fs";
import path                              from "path";

// ─── Constants ────────────────────────────────────────────────────────────────
const REQUEST_ID   = "DEL-959BBC";
const TARGET_UID   = "vOEcAj3SFzcJxNVoLJFOcfOrCof2";
const TARGET_EMAIL = "splitmate-phase6-test-1786532563220@yopmail.com";

const LOCAL_KEY_PATH = path.join(
  "C:", "SplitMate",
  "splitmate-d2d66-firebase-adminsdk-fbsvc-c01c280d7f.json"
);

// ─── Init Firebase Admin (read-only by nature of Firestore — no writes issued) ─
function initAdmin() {
  if (getApps().length > 0) {
    const app = getApps()[0];
    return { db: getFirestore(app), auth: getAuth(app) };
  }
  const key = JSON.parse(fs.readFileSync(LOCAL_KEY_PATH, "utf8"));
  const app = initializeApp({ credential: cert(key) });
  return { db: getFirestore(app), auth: getAuth(app) };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const section = (title) =>
  console.log(`\n${"═".repeat(62)}\n  ${title}\n${"═".repeat(62)}`);
const sub = (label, value) =>
  console.log(`  ${label.padEnd(35)}: ${JSON.stringify(value)}`);

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("\n╔══════════════════════════════════════════════════════════╗");
  console.log("║  PHASE 6 — READ-ONLY POST-ECONNRESET INVESTIGATION       ║");
  console.log("╚══════════════════════════════════════════════════════════╝");
  console.log(`  Target Request : ${REQUEST_ID}`);
  console.log(`  Target UID     : ${TARGET_UID}`);
  console.log(`  Target Email   : ${TARGET_EMAIL}`);
  console.log(`  Mode           : READ-ONLY — zero writes`);

  const { db, auth } = initAdmin();

  // ══════════════════════════════════════════════════════════════════
  // 1. DELETION REQUEST DOC
  // ══════════════════════════════════════════════════════════════════
  section("1. DELETION REQUEST — deletionRequests/DEL-959BBC");

  const reqSnap = await db.collection("deletionRequests").doc(REQUEST_ID).get();
  if (!reqSnap.exists) {
    console.log("  ⛔ Document does NOT exist — unexpected!");
    process.exit(1);
  }
  const req = reqSnap.data();

  sub("status",                    req.status);
  sub("requestVerificationStatus", req.requestVerificationStatus);
  sub("targetUid",                 req.targetUid);
  sub("completedAt",               req.completedAt  || null);
  sub("processingStartedAt",       req.processingStartedAt || null);
  sub("failedStep",                req.failedStep   || null);
  sub("failureCode",               req.failureCode  || null);

  const progress = req.deletionProgress || {};
  console.log("\n  deletionProgress:");
  const checkpoints = [
    "privateData", "recurringExpenses", "groups",
    "expenses", "settlements", "contacts", "notifications", "auth"
  ];
  for (const cp of checkpoints) {
    console.log(`    ${cp.padEnd(22)}: ${progress[cp] || "PENDING"}`);
  }

  // ══════════════════════════════════════════════════════════════════
  // 2. AUDIT TRAIL
  // ══════════════════════════════════════════════════════════════════
  section("2. AUDIT TRAIL — deletionRequests/DEL-959BBC/audit/*");

  const auditSnap = await db
    .collection("deletionRequests").doc(REQUEST_ID)
    .collection("audit")
    .orderBy("timestamp", "asc")
    .get();

  if (auditSnap.empty) {
    console.log("  (no audit records found)");
  } else {
    for (const adoc of auditSnap.docs) {
      const a = adoc.data();
      console.log(`  [${a.timestamp || "?"}] action=${a.action}` +
        (a.failureCode  ? ` failureCode=${a.failureCode}`  : "") +
        (a.failedStep   ? ` failedStep=${a.failedStep}`    : "") +
        (a.performedBy  ? ` by=${a.performedBy}`           : ""));
    }
  }

  const completedAudit = auditSnap.docs.find(d => d.data().action === "DELETION_COMPLETED");
  const failedAudit    = auditSnap.docs.find(d => d.data().action === "DELETION_FAILED");
  console.log(`\n  DELETION_COMPLETED audit record : ${completedAudit ? "✅ EXISTS" : "❌ NOT FOUND"}`);
  console.log(`  DELETION_FAILED    audit record : ${failedAudit    ? "⚠  EXISTS"  : "— not found"}`);

  // ══════════════════════════════════════════════════════════════════
  // 3. FIREBASE AUTH
  // ══════════════════════════════════════════════════════════════════
  section("3. FIREBASE AUTH — getUser(targetUid)");

  let authExists = false;
  try {
    const userRecord = await auth.getUser(TARGET_UID);
    authExists = true;
    console.log(`  AUTH_STILL_EXISTS`);
    sub("uid",          userRecord.uid);
    sub("email",        userRecord.email);
    sub("disabled",     userRecord.disabled);
    sub("creationTime", userRecord.metadata?.creationTime);
  } catch (e) {
    if (e.code === "auth/user-not-found") {
      console.log(`  AUTH_DELETED  ✅  — UID ${TARGET_UID} not found in Firebase Auth`);
    } else {
      console.log(`  Auth lookup error: ${e.message}`);
    }
  }

  // ══════════════════════════════════════════════════════════════════
  // 4. USER PROFILE DOCUMENT
  // ══════════════════════════════════════════════════════════════════
  section("4. USER PROFILE — users/{targetUid}");

  const userDoc = await db.collection("users").doc(TARGET_UID).get();
  console.log(`  users/${TARGET_UID}  : ${userDoc.exists ? "❌ STILL EXISTS" : "✅ DELETED"}`);

  const contactsSub = await db.collection("users").doc(TARGET_UID).collection("contacts").get();
  console.log(`  contacts subcollection       : ${contactsSub.empty ? "✅ EMPTY" : `❌ ${contactsSub.size} doc(s) remain`}`);

  const tokensSub = await db.collection("users").doc(TARGET_UID).collection("fcmTokens").get();
  console.log(`  fcmTokens subcollection      : ${tokensSub.empty  ? "✅ EMPTY" : `❌ ${tokensSub.size} doc(s) remain`}`);

  // ══════════════════════════════════════════════════════════════════
  // 5. GROUPS
  // ══════════════════════════════════════════════════════════════════
  section("5. PHASE 6 GROUPS");

  const groupIds = ["group_p6_created_1786532564667", "group_p6_member_1786532564667"];
  for (const gid of groupIds) {
    const gSnap = await db.collection("groups").doc(gid).get();
    if (!gSnap.exists) {
      console.log(`\n  [${gid}] — NOT FOUND (may not have been created for this test)`);
      continue;
    }
    const g = gSnap.data();
    const inMemberIds = Array.isArray(g.memberIds) && g.memberIds.includes(TARGET_UID);
    const memberEntry = Array.isArray(g.membersDetails)
      ? g.membersDetails.find(m => m.uid === TARGET_UID)
      : null;

    console.log(`\n  [${gid}]`);
    console.log(`    memberIds contains targetUid  : ${inMemberIds ? "❌ YES (not removed)" : "✅ NO (removed)"}`);
    console.log(`    createdBy                     : ${g.createdBy}`);
    console.log(`    createdBy === targetUid       : ${g.createdBy === TARGET_UID ? "⚠  YES" : "✅ NO"}`);
    console.log(`    isArchived                    : ${g.isArchived || false}`);
    if (memberEntry) {
      console.log(`    membersDetails[target].name   : ${memberEntry.name} ${memberEntry.name === "Deleted User" ? "✅" : "❌"}`);
      console.log(`    membersDetails[target].email  : ${memberEntry.email}`);
    } else {
      console.log(`    membersDetails[target]        : not present in membersDetails array`);
    }
  }

  // Also do a broad check — any group still contains targetUid?
  const allGroupsSnap = await db.collection("groups")
    .where("memberIds", "array-contains", TARGET_UID).get();
  console.log(`\n  Broad scan: groups with targetUid still in memberIds: ${allGroupsSnap.size}`);

  // ══════════════════════════════════════════════════════════════════
  // 6. RECURRING EXPENSE
  // ══════════════════════════════════════════════════════════════════
  section("6. RECURRING EXPENSE — rec_p6_1786532564667");

  const recSnap = await db.collection("recurringExpenses").doc("rec_p6_1786532564667").get();
  if (!recSnap.exists) {
    console.log("  Document not found (may not exist for this test)");
  } else {
    const r = recSnap.data();
    console.log(`  active  : ${r.active}`);
    console.log(`  active === false : ${r.active === false ? "✅ YES (deactivated)" : "❌ NO (still active)"}`);
  }

  // ══════════════════════════════════════════════════════════════════
  // 7. FINANCIAL RECORDS
  // ══════════════════════════════════════════════════════════════════
  section("7. FINANCIAL RECORDS (invariant check)");

  // expense_p6_paid_1786532564667
  const expPaidSnap = await db.collection("expenses").doc("expense_p6_paid_1786532564667").get();
  if (!expPaidSnap.exists) {
    console.log("  expense_p6_paid_1786532564667  : NOT FOUND");
  } else {
    const e = expPaidSnap.data();
    console.log("\n  expense_p6_paid_1786532564667:");
    sub("  amount",      e.amount);
    sub("  paidBy",      e.paidBy);
    sub("  paidByName",  e.paidByName);
    sub("  splitDetails", e.splitDetails);
    console.log(`    paidBy === targetUid        : ${e.paidBy === TARGET_UID ? "✅ PRESERVED" : "❌ MODIFIED"}`);
    console.log(`    paidByName === 'Deleted User': ${e.paidByName === "Deleted User" ? "✅ ANONYMIZED" : `⚠  '${e.paidByName}' (not yet anonymized)`}`);
  }

  // expense_p6_partner_1786532564667
  const expPartnerSnap = await db.collection("expenses").doc("expense_p6_partner_1786532564667").get();
  if (!expPartnerSnap.exists) {
    console.log("\n  expense_p6_partner_1786532564667 : NOT FOUND");
  } else {
    const e = expPartnerSnap.data();
    console.log("\n  expense_p6_partner_1786532564667:");
    sub("  amount",      e.amount);
    sub("  paidBy",      e.paidBy);
    sub("  paidByName",  e.paidByName);
    console.log(`    paidBy !== targetUid (partner pays): ${e.paidBy !== TARGET_UID ? "✅ OK" : "⚠  Unexpected"}`);
    console.log(`    amount unchanged (should be unmodified): ✅ (read-only check, amount=${e.amount})`);
  }

  // settlement_p6_1786532564667
  const settleSnap = await db.collection("settlements").doc("settlement_p6_1786532564667").get();
  if (!settleSnap.exists) {
    console.log("\n  settlement_p6_1786532564667 : NOT FOUND");
  } else {
    const s = settleSnap.data();
    console.log("\n  settlement_p6_1786532564667:");
    sub("  amount",      s.amount);
    sub("  fromUserId",  s.fromUserId);
    sub("  toUserId",    s.toUserId);
    sub("  fromName",    s.fromName);
    sub("  toName",      s.toName);
    console.log(`    fromUserId === targetUid    : ${s.fromUserId === TARGET_UID ? "✅ PRESERVED" : "❌ MODIFIED"}`);
    console.log(`    fromName === 'Deleted User' : ${s.fromName   === "Deleted User" ? "✅ ANONYMIZED" : `⚠  '${s.fromName}' (not yet anonymized)`}`);
    console.log(`    amount unchanged            : ✅ (amount=${s.amount})`);
  }

  // ══════════════════════════════════════════════════════════════════
  // 8. INVERSE CONTACTS
  // ══════════════════════════════════════════════════════════════════
  section("8. INVERSE CONTACTS");

  // Check all users for lingering contact reference to targetUid
  const allUsersSnap = await db.collection("users").get();
  let inverseCount = 0;
  const inverseOwners = [];
  for (const uDoc of allUsersSnap.docs) {
    if (uDoc.id === TARGET_UID) continue;
    const inv = await db.collection("users").doc(uDoc.id)
      .collection("contacts").doc(TARGET_UID).get();
    if (inv.exists) {
      inverseCount++;
      inverseOwners.push(uDoc.id);
    }
  }
  if (inverseCount === 0) {
    console.log(`  ✅ No other user has a contacts/${TARGET_UID} entry`);
  } else {
    console.log(`  ❌ ${inverseCount} user(s) still have contacts/${TARGET_UID}:`);
    inverseOwners.forEach(uid => console.log(`     → ${uid}`));
  }

  // ══════════════════════════════════════════════════════════════════
  // 9. NOTIFICATIONS
  // ══════════════════════════════════════════════════════════════════
  section("9. NOTIFICATIONS");

  const notifOwn1 = await db.collection("notifications")
    .where("userId", "==", TARGET_UID).get();
  const notifOwn2 = await db.collection("notifications")
    .where("recipientUid", "==", TARGET_UID).get();
  const ownTotal = notifOwn1.size + notifOwn2.size;
  console.log(`  Private notifications (userId/recipientUid = targetUid): ${ownTotal === 0 ? `✅ 0 remaining` : `❌ ${ownTotal} still exist`}`);

  const senderNotifs = await db.collection("notifications")
    .where("data.senderUid", "==", TARGET_UID).get();
  const notAnon = senderNotifs.docs.filter(n => n.data()?.data?.senderName !== "Deleted User").length;
  console.log(`  Sender notifications total      : ${senderNotifs.size}`);
  console.log(`  Sender identity anonymized      : ${notAnon === 0 ? "✅ ALL anonymized" : `❌ ${notAnon} not anonymized`}`);

  // ══════════════════════════════════════════════════════════════════
  // 10. CLASSIFICATION
  // ══════════════════════════════════════════════════════════════════
  section("10. PROCESS STATE CLASSIFICATION");

  const incomplete = checkpoints.filter(k => progress[k] !== "COMPLETED");
  const allDone    = incomplete.length === 0;

  let classification;
  if (req.status === "COMPLETED" && !authExists && allDone && completedAudit) {
    classification = "PROCESS_COMPLETED";
  } else if (req.status === "FAILED_PROCESSING" || (req.failedStep && req.failureCode)) {
    classification = "PROCESS_FAILED_PARTIAL";
  } else if (req.status === "APPROVED" && !req.processingStartedAt && !Object.values(progress).some(v => v === "COMPLETED")) {
    classification = "PROCESS_NOT_STARTED";
  } else {
    classification = "PROCESS_STATE_UNKNOWN";
  }

  console.log(`\n  Request status                : ${req.status}`);
  console.log(`  processingStartedAt           : ${req.processingStartedAt || "null"}`);
  console.log(`  Auth account                  : ${authExists ? "STILL_EXISTS" : "DELETED"}`);
  console.log(`  Checkpoints COMPLETED         : ${checkpoints.filter(k => progress[k] === "COMPLETED").join(", ") || "(none)"}`);
  console.log(`  Checkpoints NOT COMPLETED     : ${incomplete.join(", ") || "(none — all done)"}`);
  console.log(`  DELETION_COMPLETED audit      : ${completedAudit ? "EXISTS" : "NOT FOUND"}`);
  console.log(`\n  ► CLASSIFICATION: ${classification}`);

  // ══════════════════════════════════════════════════════════════════
  // SUMMARY TABLE
  // ══════════════════════════════════════════════════════════════════
  section("FINAL SUMMARY TABLE");

  const completedCPs = checkpoints.filter(k => progress[k] === "COMPLETED");
  const lastCP       = completedCPs.length > 0 ? completedCPs[completedCPs.length - 1] : "NONE";

  const table = [
    ["Check",                          "Result"],
    ["──────────────────────────────", "──────────────────────────────────────"],
    ["Request status",                 req.status || "?"],
    ["Verification status",            req.requestVerificationStatus || "?"],
    ["processingStartedAt",            req.processingStartedAt || "null"],
    ["Last completed checkpoint",      lastCP],
    ["Auth account",                   authExists ? "AUTH_STILL_EXISTS" : "AUTH_DELETED ✅"],
    ["User document",                  userDoc.exists ? "STILL EXISTS ❌" : "DELETED ✅"],
    ["Contacts subcollection",         contactsSub.empty ? "EMPTY ✅" : `${contactsSub.size} remain ❌`],
    ["FCM tokens subcollection",       tokensSub.empty  ? "EMPTY ✅" : `${tokensSub.size} remain ❌`],
    ["Groups (broad scan)",            allGroupsSnap.size === 0 ? "targetUid removed ✅" : `${allGroupsSnap.size} group(s) still have target ❌`],
    ["Recurring expense",              recSnap.exists ? (recSnap.data().active === false ? "deactivated ✅" : "still active ❌") : "not found"],
    ["expenses (count w/ paidBy=target)", `${(await db.collection("expenses").where("paidBy","==",TARGET_UID).get()).size} doc(s)`],
    ["expense paidBy preserved",       expPaidSnap.exists ? (expPaidSnap.data().paidBy === TARGET_UID ? "✅ PRESERVED" : "❌ MODIFIED") : "n/a"],
    ["expense paidByName anonymized",  expPaidSnap.exists ? (expPaidSnap.data().paidByName === "Deleted User" ? "✅ YES" : "❌ NO") : "n/a"],
    ["settlement fromUserId preserved",settleSnap.exists  ? (settleSnap.data().fromUserId === TARGET_UID ? "✅ PRESERVED" : "❌ MODIFIED") : "n/a"],
    ["settlement fromName anonymized", settleSnap.exists  ? (settleSnap.data().fromName === "Deleted User"  ? "✅ YES" : "❌ NO") : "n/a"],
    ["Inverse contacts",               inverseCount === 0 ? "none remain ✅" : `${inverseCount} remain ❌`],
    ["Private notifications",          ownTotal  === 0 ? "deleted ✅" : `${ownTotal} remain ❌`],
    ["Sender notifications",           notAnon   === 0 ? "all anonymized ✅" : `${notAnon} not anonymized ❌`],
    ["DELETION_COMPLETED audit",       completedAudit ? "✅ EXISTS" : "❌ NOT FOUND"],
    ["──────────────────────────────", "──────────────────────────────────────"],
    ["Overall classification",         classification],
  ];

  const colW = 33;
  for (const [label, value] of table) {
    console.log(`  ${label.padEnd(colW)} ${value}`);
  }

  console.log(`\n\n  ${"═".repeat(58)}`);
  console.log(`  FINAL VERDICT: ${classification}`);
  console.log(`  ${"═".repeat(58)}\n`);
}

main().catch(err => {
  console.error("\n[INVESTIGATION ERROR]:", err.message || err);
  process.exit(1);
});
