/**
 * Phase 6 — Controlled Production Deletion Execution & 27-Point Verification
 *
 * Uses Firebase Admin SDK to:
 *   1. Mint a custom token for the admin UID
 *   2. Exchange it for an ID token via Firebase REST API
 *   3. POST /process to Vercel production
 *   4. Perform all 27 READ-ONLY post-deletion verifications
 *
 * Run: node phase6_execute_and_verify.mjs
 */

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import fs from "fs";
import path from "path";
import https from "https";

// ─── Constants ────────────────────────────────────────────────────────────────
const REQUEST_ID   = "DEL-959BBC";
const TARGET_UID   = "vOEcAj3SFzcJxNVoLJFOcfOrCof2";
const TARGET_EMAIL = "splitmate-phase6-test-1786532563220@yopmail.com";
const APP_URL      = process.env.APP_URL || "http://localhost:3000";
// Firebase Web API Key (from google-services.json)
const FIREBASE_API_KEY = "AIzaSyB2fCMYGgRHXYOiiESoQeqg9F_BIS2pS60";
const LOCAL_KEY_PATH   = path.join("C:", "SplitMate", "splitmate-d2d66-firebase-adminsdk-fbsvc-c01c280d7f.json");

// ─── Init Firebase Admin ───────────────────────────────────────────────────────
function initAdmin() {
  if (getApps().length > 0) {
    const app = getApps()[0];
    return { db: getFirestore(app), auth: getAuth(app) };
  }
  const key = JSON.parse(fs.readFileSync(LOCAL_KEY_PATH, "utf8"));
  const app = initializeApp({ credential: cert(key) });
  return { db: getFirestore(app), auth: getAuth(app) };
}

import http from "http";

// ─── HTTP POST helper ─────────────────────────────────────────────────────────
function httpsPost(urlStr, headers, bodyObj) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(bodyObj || {});
    const parsed = new URL(urlStr);
    const isHttps = parsed.protocol === "https:";
    const transport = isHttps ? https : http;
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      port: parsed.port || (isHttps ? 443 : 80),
      method: "POST",
      headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body), ...headers },
    };
    const req = transport.request(options, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => {
        let json; try { json = JSON.parse(data); } catch { json = { raw: data }; }
        resolve({ status: res.statusCode, body: json });
      });
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

// ─── Get admin UID from Firestore admins collection ───────────────────────────
async function getAdminUid(db) {
  const snap = await db.collection("admins").where("role", "==", "admin").where("enabled", "==", true).get();
  if (snap.empty) throw new Error("No active admin found in Firestore admins collection.");
  const adminDoc = snap.docs[0];
  const email = adminDoc.data().email || "";
  console.log(`  Admin UID: ${adminDoc.id} (${email})`);
  return adminDoc.id;
}

// ─── Exchange custom token for ID token via Firebase REST ────────────────────
async function getIdTokenFromCustomToken(customToken) {
  const resp = await httpsPost(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${FIREBASE_API_KEY}`,
    {},
    { token: customToken, returnSecureToken: true }
  );
  if (!resp.body.idToken) {
    throw new Error(`Custom token exchange failed: ${JSON.stringify(resp.body)}`);
  }
  return resp.body.idToken;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("\n══════════════════════════════════════════════════════════════");
  console.log("  PHASE 6 — CONTROLLED PRODUCTION DELETION EXECUTION & VERIFICATION");
  console.log("══════════════════════════════════════════════════════════════");
  console.log(`  Request  : ${REQUEST_ID}`);
  console.log(`  Target   : ${TARGET_UID} (${TARGET_EMAIL})`);
  console.log(`  Endpoint : ${APP_URL}/api/admin/splitmate/deletion-requests/${REQUEST_ID}/process`);
  console.log("──────────────────────────────────────────────────────────────\n");

  const { db, auth } = initAdmin();

  // ─── PRE-DELETION BASELINE ─────────────────────────────────────────────────
  console.log("▶ Capturing pre-deletion financial baseline...");

  const preExpSnap  = await db.collection("expenses").where("paidBy", "==", TARGET_UID).get();
  const preFromSnap = await db.collection("settlements").where("fromUserId", "==", TARGET_UID).get();
  const preToSnap   = await db.collection("settlements").where("toUserId", "==", TARGET_UID).get();

  const preExpenses = preExpSnap.docs.map(d => ({ id: d.id, ...d.data() }));
  const preFromDocs = preFromSnap.docs.map(d => ({ id: d.id, ...d.data() }));
  const preToDocs   = preToSnap.docs.map(d => ({ id: d.id, ...d.data() }));

  const preExpTotal  = preExpenses.reduce((s, e) => s + (Number(e.amount) || 0), 0);
  const preFromTotal = preFromDocs.reduce((s, e) => s + (Number(e.amount) || 0), 0);
  const preToTotal   = preToDocs.reduce((s, e) => s + (Number(e.amount) || 0), 0);

  console.log(`  Expenses (paidBy target)  : ${preExpenses.length} doc(s), total amount = ${preExpTotal}`);
  console.log(`  Settlements (from target) : ${preFromDocs.length} doc(s), total = ${preFromTotal}`);
  console.log(`  Settlements (to target)   : ${preToDocs.length} doc(s), total = ${preToTotal}`);

  // ─── STEP 1: Mint custom token → exchange for ID token ────────────────────
  console.log("\n▶ STEP 1: Minting admin ID token via Firebase Admin SDK...");
  const adminUid    = await getAdminUid(db);
  const customToken = await auth.createCustomToken(adminUid);
  const idToken     = await getIdTokenFromCustomToken(customToken);
  console.log("  ✓ Admin ID token obtained successfully");

  // ─── STEP 2: Verify preconditions ─────────────────────────────────────────
  console.log("\n▶ STEP 2: Verifying preconditions from Firestore...");
  const reqDoc  = await db.collection("deletionRequests").doc(REQUEST_ID).get();
  if (!reqDoc.exists) throw new Error(`Request ${REQUEST_ID} not found in Firestore!`);
  const reqData = reqDoc.data();
  console.log(`  status                    : ${reqData.status}`);
  console.log(`  requestVerificationStatus : ${reqData.requestVerificationStatus}`);
  console.log(`  targetUid                 : ${reqData.targetUid || "(not yet resolved)"}`);
  if (reqData.status !== "APPROVED" && reqData.status !== "FAILED_PROCESSING") {
    throw new Error(`Cannot process: status is '${reqData.status}', expected APPROVED or FAILED_PROCESSING.`);
  }
  if (reqData.requestVerificationStatus !== "VERIFIED") {
    throw new Error(`Cannot process: requestVerificationStatus is '${reqData.requestVerificationStatus}', expected VERIFIED.`);
  }
  console.log("  ✓ Preconditions satisfied");

  // ─── STEP 3: Call /process endpoint ───────────────────────────────────────
  console.log("\n▶ STEP 3: Executing POST /process...");
  const processResp = await httpsPost(
    `${APP_URL}/api/admin/splitmate/deletion-requests/${REQUEST_ID}/process`,
    { "Authorization": `Bearer ${idToken}` }
  );
  console.log(`  HTTP Status : ${processResp.status}`);
  console.log(`  Response    : ${JSON.stringify(processResp.body, null, 4)}`);

  if (processResp.status !== 200) {
    throw new Error(`Process endpoint returned HTTP ${processResp.status}. Aborting verification.`);
  }
  console.log("  ✓ Deletion process completed successfully");

  // Wait for Firestore propagation
  console.log("\n  Waiting 4s for Firestore write propagation...");
  await new Promise(r => setTimeout(r, 4000));

  // ─── STEP 4: 27-Point READ-ONLY Verification ──────────────────────────────
  console.log("\n══════════════════════════════════════════════════════════════");
  console.log("  POST-DELETION VERIFICATION — 27 CHECKS (READ-ONLY)");
  console.log("══════════════════════════════════════════════════════════════");

  const results = [];
  const PASS = (n, label, detail = "") => { results.push({ n, label, r: "✅ PASS", detail }); console.log(`  [${String(n).padStart(2)}] ✅  ${label}${detail ? `\n        → ${detail}` : ""}`); };
  const FAIL = (n, label, detail = "") => { results.push({ n, label, r: "❌ FAIL", detail }); console.log(`  [${String(n).padStart(2)}] ❌  ${label}${detail ? `\n        → ${detail}` : ""}`); };
  const WARN = (n, label, detail = "") => { results.push({ n, label, r: "⚠  WARN", detail }); console.log(`  [${String(n).padStart(2)}] ⚠   ${label}${detail ? `\n        → ${detail}` : ""}`); };

  // [1] Firebase Auth user deleted
  try {
    await auth.getUser(TARGET_UID);
    FAIL(1, "Firebase Auth user deleted", `UID ${TARGET_UID} still found in Auth`);
  } catch (e) {
    e.code === "auth/user-not-found"
      ? PASS(1, "Firebase Auth user deleted", `UID ${TARGET_UID} confirmed absent from Auth`)
      : FAIL(1, "Firebase Auth user deleted", `Auth error: ${e.message}`);
  }

  // [2] users/{targetUid} document deleted
  const userDoc = await db.collection("users").doc(TARGET_UID).get();
  userDoc.exists
    ? FAIL(2, "users/{targetUid} document deleted", "Document still exists in Firestore")
    : PASS(2, "users/{targetUid} document deleted");

  // [3] users/{targetUid}/contacts/* deleted
  const contactsSub = await db.collection("users").doc(TARGET_UID).collection("contacts").get();
  contactsSub.empty
    ? PASS(3, "users/{targetUid}/contacts/* deleted", "0 documents remaining")
    : FAIL(3, "users/{targetUid}/contacts/* deleted", `${contactsSub.size} document(s) still present`);

  // [4] users/{targetUid}/fcmTokens/* deleted
  const tokensSub = await db.collection("users").doc(TARGET_UID).collection("fcmTokens").get();
  tokensSub.empty
    ? PASS(4, "users/{targetUid}/fcmTokens/* deleted", "0 documents remaining")
    : FAIL(4, "users/{targetUid}/fcmTokens/* deleted", `${tokensSub.size} document(s) still present`);

  // [5] Inverse contacts removed from all other users
  const allUsers = await db.collection("users").get();
  let inverseFound = 0;
  for (const uDoc of allUsers.docs) {
    if (uDoc.id === TARGET_UID) continue;
    const inv = await db.collection("users").doc(uDoc.id).collection("contacts").doc(TARGET_UID).get();
    if (inv.exists) inverseFound++;
  }
  inverseFound === 0
    ? PASS(5, "Inverse contacts referencing targetUid removed", "No other user references targetUid in contacts")
    : FAIL(5, "Inverse contacts referencing targetUid removed", `${inverseFound} user(s) still have contact entry for targetUid`);

  // [6] targetUid removed from all group membership fields (memberIds, members, membersDetails, memberProfiles, membersJoinedAt, memberExistingExpensesPreference)
  // [7] Group ownership correctly transferred when targetUid was creator
  // [8] Group member profile/name clean and anonymized
  const allGroups = await db.collection("groups").get();
  let stillInGroups = 0, badOwnership = 0, notAnonymized = 0;
  for (const gDoc of allGroups.docs) {
    const g = gDoc.data();
    let foundInGroup = false;

    if (Array.isArray(g.memberIds) && g.memberIds.includes(TARGET_UID)) foundInGroup = true;
    if (Array.isArray(g.members) && g.members.some(m => typeof m === "string" ? m === TARGET_UID : m && m.uid === TARGET_UID)) foundInGroup = true;
    if (Array.isArray(g.membersDetails) && g.membersDetails.some(m => m && m.uid === TARGET_UID)) foundInGroup = true;
    if (g.memberProfiles && g.memberProfiles[TARGET_UID]) foundInGroup = true;
    if (g.membersJoinedAt && g.membersJoinedAt[TARGET_UID]) foundInGroup = true;
    if (g.memberExistingExpensesPreference && g.memberExistingExpensesPreference[TARGET_UID]) foundInGroup = true;

    if (foundInGroup) stillInGroups++;

    // badOwnership: if createdBy is still target UID AND there are other members remaining
    if (g.createdBy === TARGET_UID && Array.isArray(g.memberIds) && g.memberIds.length > 0) badOwnership++;

    // Check anonymization in membersDetails
    if (Array.isArray(g.membersDetails)) {
      const entry = g.membersDetails.find(m => m.uid === TARGET_UID);
      if (entry && entry.name !== "Deleted User") notAnonymized++;
    }
  }

  stillInGroups === 0
    ? PASS(6, "targetUid removed from all group membership fields (memberIds, members, details, profiles, etc.)")
    : FAIL(6, "targetUid removed from all group membership fields", `${stillInGroups} group(s) still retain targetUid in membership fields`);

  badOwnership === 0
    ? PASS(7, "Group ownership transferred correctly (targetUid no longer creator with active members)")
    : FAIL(7, "Group ownership transferred correctly", `${badOwnership} group(s) still have targetUid as createdBy with remaining members`);

  notAnonymized === 0
    ? PASS(8, "Group member representations anonymized/cleaned")
    : FAIL(8, "Group member representations anonymized/cleaned", `${notAnonymized} group member entry(ies) not cleaned`);

  // [9] Active recurring expenses deactivated
  const recurringSnap = await db.collection("recurringExpenses").get();
  let activeStillUp = 0;
  for (const rDoc of recurringSnap.docs) {
    const r = rDoc.data();
    const involved = r.createdBy === TARGET_UID || r.paidBy === TARGET_UID
      || (Array.isArray(r.splitBetween) && r.splitBetween.includes(TARGET_UID));
    if (involved && r.active !== false) activeStillUp++;
  }
  activeStillUp === 0
    ? PASS(9, "Active recurring expenses deactivated", "All recurring expenses for target set active=false")
    : FAIL(9, "Active recurring expenses deactivated", `${activeStillUp} recurring expense(s) still active`);

  // Post-deletion expense & settlement snapshots
  const postExpSnap  = await db.collection("expenses").where("paidBy", "==", TARGET_UID).get();
  const postFromSnap = await db.collection("settlements").where("fromUserId", "==", TARGET_UID).get();
  const postToSnap   = await db.collection("settlements").where("toUserId", "==", TARGET_UID).get();
  const postExpenses = postExpSnap.docs.map(d => ({ id: d.id, ...d.data() }));
  const postFromDocs = postFromSnap.docs.map(d => ({ id: d.id, ...d.data() }));
  const postToDocs   = postToSnap.docs.map(d => ({ id: d.id, ...d.data() }));
  const postExpTotal  = postExpenses.reduce((s, e) => s + (Number(e.amount) || 0), 0);
  const postFromTotal = postFromDocs.reduce((s, e) => s + (Number(e.amount) || 0), 0);
  const postToTotal   = postToDocs.reduce((s, e) => s + (Number(e.amount) || 0), 0);

  // [10] Historical expenses record count preserved
  postExpenses.length === preExpenses.length
    ? PASS(10, "Historical expenses remain intact", `${postExpenses.length} record(s) preserved`)
    : FAIL(10, "Historical expenses remain intact", `Before: ${preExpenses.length}, After: ${postExpenses.length} — records deleted!`);

  // [11] expenses.amount unchanged
  Math.abs(postExpTotal - preExpTotal) < 0.001
    ? PASS(11, "expenses.amount unchanged", `Sum: ${postExpTotal} (was ${preExpTotal})`)
    : FAIL(11, "expenses.amount unchanged", `Before: ${preExpTotal}, After: ${postExpTotal}`);

  // [12] expenses.splitDetails unchanged
  let splitModified = 0;
  for (const post of postExpenses) {
    const pre = preExpenses.find(p => p.id === post.id);
    if (pre && JSON.stringify(pre.splitDetails) !== JSON.stringify(post.splitDetails)) splitModified++;
  }
  splitModified === 0
    ? PASS(12, "expenses.splitDetails unchanged")
    : FAIL(12, "expenses.splitDetails unchanged", `${splitModified} expense(s) have modified splitDetails`);

  // [13] expenses.paidBy remains original targetUid (NEVER modified)
  const paidByModified = postExpenses.filter(e => e.paidBy !== TARGET_UID).length;
  paidByModified === 0
    ? PASS(13, "expenses.paidBy preserved as original targetUid", `All ${postExpenses.length} expense(s) retain paidBy = ${TARGET_UID}`)
    : FAIL(13, "expenses.paidBy preserved as original targetUid", `${paidByModified} expense(s) have paidBy ≠ ${TARGET_UID}`);

  // [14] expenses.paidByName anonymized to "Deleted User"
  const paidByNameWrong = postExpenses.filter(e => e.paidByName !== "Deleted User").length;
  paidByNameWrong === 0
    ? PASS(14, "expenses.paidByName anonymized to 'Deleted User'", `${postExpenses.length} expense(s) updated`)
    : FAIL(14, "expenses.paidByName anonymized to 'Deleted User'", `${paidByNameWrong} expense(s) not updated`);

  // [15] Historical settlements record count preserved
  (postFromDocs.length === preFromDocs.length && postToDocs.length === preToDocs.length)
    ? PASS(15, "Historical settlements remain intact", `from: ${postFromDocs.length}, to: ${postToDocs.length}`)
    : FAIL(15, "Historical settlements remain intact", `from Before/After: ${preFromDocs.length}/${postFromDocs.length}, to: ${preToDocs.length}/${postToDocs.length}`);

  // [16] settlements.amount unchanged
  (Math.abs(postFromTotal - preFromTotal) < 0.001 && Math.abs(postToTotal - preToTotal) < 0.001)
    ? PASS(16, "settlements.amount unchanged", `from total: ${postFromTotal}, to total: ${postToTotal}`)
    : FAIL(16, "settlements.amount unchanged", `from: ${preFromTotal}→${postFromTotal}, to: ${preToTotal}→${postToTotal}`);

  // [17] settlements.fromUserId unchanged (still TARGET_UID)
  const fromIdModified = postFromDocs.filter(s => s.fromUserId !== TARGET_UID).length;
  fromIdModified === 0
    ? PASS(17, "settlements.fromUserId preserved as targetUid", `${postFromDocs.length} record(s) checked`)
    : FAIL(17, "settlements.fromUserId preserved as targetUid", `${fromIdModified} record(s) have modified fromUserId`);

  // [18] settlements.toUserId unchanged (still TARGET_UID)
  const toIdModified = postToDocs.filter(s => s.toUserId !== TARGET_UID).length;
  toIdModified === 0
    ? PASS(18, "settlements.toUserId preserved as targetUid", `${postToDocs.length} record(s) checked`)
    : FAIL(18, "settlements.toUserId preserved as targetUid", `${toIdModified} record(s) have modified toUserId`);

  // [19] Settlement display names anonymized to "Deleted User"
  const fromNameWrong = postFromDocs.filter(s => s.fromName !== "Deleted User").length;
  const toNameWrong   = postToDocs.filter(s => s.toName !== "Deleted User").length;
  (fromNameWrong === 0 && toNameWrong === 0)
    ? PASS(19, "Settlement names anonymized to 'Deleted User'", `fromName: ${postFromDocs.length} updated, toName: ${postToDocs.length} updated`)
    : FAIL(19, "Settlement names anonymized to 'Deleted User'", `fromName wrong: ${fromNameWrong}, toName wrong: ${toNameWrong}`);

  // [20] Target user's private notifications deleted
  const notifOwn1 = await db.collection("notifications").where("userId", "==", TARGET_UID).get();
  const notifOwn2 = await db.collection("notifications").where("recipientUid", "==", TARGET_UID).get();
  const ownNotifCount = notifOwn1.size + notifOwn2.size;
  ownNotifCount === 0
    ? PASS(20, "Target user private notifications deleted", "0 remaining")
    : FAIL(20, "Target user private notifications deleted", `${ownNotifCount} notification(s) still reference target as userId/recipientUid`);

  // [21] Notifications sent by deleted user have senderName anonymized
  const senderNotifs = await db.collection("notifications").where("data.senderUid", "==", TARGET_UID).get();
  const senderNotAnon = senderNotifs.docs.filter(n => n.data()?.data?.senderName !== "Deleted User").length;
  senderNotAnon === 0
    ? PASS(21, "Sender notifications anonymized", `${senderNotifs.size} notification(s) checked; all show 'Deleted User'`)
    : FAIL(21, "Sender notifications anonymized", `${senderNotAnon} notification(s) still show original sender name`);

  // [22] Financial balance mathematically identical
  const balanceOk = Math.abs(postExpTotal - preExpTotal) < 0.001
    && Math.abs(postFromTotal - preFromTotal) < 0.001
    && Math.abs(postToTotal - preToTotal) < 0.001;
  balanceOk
    ? PASS(22, "Financial balance mathematically identical pre vs post",
        `expenses: ${preExpTotal}→${postExpTotal} | from-settlements: ${preFromTotal}→${postFromTotal} | to-settlements: ${preToTotal}→${postToTotal}`)
    : FAIL(22, "Financial balance mathematically identical pre vs post",
        `Discrepancy detected`);

  // [23] All deletionProgress checkpoints = COMPLETED
  const reqPost = (await db.collection("deletionRequests").doc(REQUEST_ID).get()).data() || {};
  const progress = reqPost.deletionProgress || {};
  const checkpoints = ["privateData","recurringExpenses","groups","expenses","settlements","contacts","notifications","auth"];
  const incomplete = checkpoints.filter(k => progress[k] !== "COMPLETED");
  incomplete.length === 0
    ? PASS(23, "All 8 deletionProgress checkpoints = COMPLETED",
        checkpoints.map(k => `${k}=${progress[k]}`).join(", "))
    : FAIL(23, "All deletionProgress checkpoints = COMPLETED", `Incomplete: ${incomplete.join(", ")}`);

  // [24] Request status = COMPLETED
  reqPost.status === "COMPLETED"
    ? PASS(24, "deletionRequests/DEL-959BBC status = COMPLETED", `completedAt: ${reqPost.completedAt || "n/a"}`)
    : FAIL(24, "deletionRequests/DEL-959BBC status = COMPLETED", `Actual: ${reqPost.status}`);

  // [25] DELETION_COMPLETED audit record exists
  const auditSnap = await db.collection("deletionRequests").doc(REQUEST_ID)
    .collection("audit").where("action", "==", "DELETION_COMPLETED").get();
  auditSnap.size > 0
    ? PASS(25, "DELETION_COMPLETED audit record present", `${auditSnap.size} record(s) — performedBy: ${auditSnap.docs[0]?.data()?.performedBy}`)
    : FAIL(25, "DELETION_COMPLETED audit record present", "No audit record with action=DELETION_COMPLETED found");

  // [26] Completion email dispatched
  const emailStatus = reqPost.completionEmailStatus;
  const emailId     = reqPost.completionEmailId;
  (emailStatus === "sent" || emailStatus === "SENT" || emailId)
    ? PASS(26, "Completion email dispatched", `status=${emailStatus}, id=${emailId || "n/a"}`)
    : WARN(26, "Completion email dispatched", `status=${emailStatus || "unknown"} — check Resend dashboard`);

  // [27] Re-running /process → HTTP 409
  console.log("\n▶ STEP 5: Verifying re-process protection (expecting HTTP 409)...");
  const rerunResp = await httpsPost(
    `${APP_URL}/api/admin/splitmate/deletion-requests/${REQUEST_ID}/process`,
    { "Authorization": `Bearer ${idToken}` }
  );
  console.log(`  Re-run HTTP Status : ${rerunResp.status}`);
  console.log(`  Re-run Body        : ${JSON.stringify(rerunResp.body)}`);
  rerunResp.status === 409
    ? PASS(27, "Re-running /process returns HTTP 409 Conflict", `Error: "${rerunResp.body?.error}"`)
    : FAIL(27, "Re-running /process returns HTTP 409 Conflict", `Got HTTP ${rerunResp.status}`);

  // ─── FINAL RESULTS TABLE ───────────────────────────────────────────────────
  console.log("\n══════════════════════════════════════════════════════════════");
  console.log("  PHASE 6 FINAL RESULTS TABLE");
  console.log("══════════════════════════════════════════════════════════════");
  const passCount = results.filter(r => r.r === "✅ PASS").length;
  const failCount = results.filter(r => r.r === "❌ FAIL").length;
  const warnCount = results.filter(r => r.r === "⚠  WARN").length;

  console.log(`\n  # | Result   | Verification Check`);
  console.log(`  ──┼──────────┼${"─".repeat(56)}`);
  for (const r of results) {
    console.log(`  ${String(r.n).padStart(2)} │ ${r.r.padEnd(8)} │ ${r.label}`);
    if (r.detail) console.log(`     │          │   ↳ ${r.detail}`);
  }
  console.log(`\n  PASS: ${passCount}  FAIL: ${failCount}  WARN: ${warnCount}  TOTAL: ${results.length}`);

  if (failCount > 0) {
    console.log("\n  ⛔ PHASE 6 STATUS: FAIL — One or more verifications FAILED.");
    process.exit(1);
  } else {
    console.log("\n  🎉 PHASE 6 STATUS: COMPLETE — All verifications PASSED.");
  }
}

main().catch(err => {
  console.error("\n[FATAL ERROR]:", err.message || err);
  process.exit(1);
});
