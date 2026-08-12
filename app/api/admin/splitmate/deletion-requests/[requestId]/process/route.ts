import { NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/adminAuth";
import { getFirebaseAdminDb } from "@/lib/firebaseAdmin";
import { sendCompletionEmail } from "@/lib/emailService";
import { getAuth } from "firebase-admin/auth";
import { FieldValue } from "firebase-admin/firestore";

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

    let targetUid: string | null = null;
    let targetEmail: string = "";
    let userFullName: string = "User";
    let conflictError: string | null = null;
    let failureDetail: { code: string; step: string; message: string } | null = null;

    // 1. Atomic State Transition: APPROVED (or FAILED_PROCESSING) -> PROCESSING
    await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(docRef);
      if (!doc.exists) {
        conflictError = "Deletion request not found.";
        return;
      }

      const data = doc.data() || {};

      if (data.status !== "APPROVED" && data.status !== "FAILED_PROCESSING") {
        conflictError = `Deletion request cannot be processed from status: ${data.status}. Must be APPROVED.`;
        return;
      }

      // Check Verification Status Requirement
      if (data.requestVerificationStatus && data.requestVerificationStatus !== "VERIFIED") {
        conflictError = "Deletion request requires email verification before processing.";
        return;
      }

      targetEmail = data.email || "";
      userFullName = data.fullName || "User";
      targetUid = data.targetUid || null;

      const now = new Date().toISOString();
      const updatedProgress = data.deletionProgress || {
        privateData: "PENDING",
        recurringExpenses: "PENDING",
        groups: "PENDING",
        expenses: "PENDING",
        settlements: "PENDING",
        contacts: "PENDING",
        notifications: "PENDING",
        auth: "PENDING",
      };

      transaction.update(docRef, {
        status: "PROCESSING",
        processingStartedAt: now,
        processingAdminUid: authResult.uid,
        processingAdminEmail: authResult.email,
        deletionProgress: updatedProgress,
      });

      const auditRef = docRef.collection("audit").doc();
      transaction.set(auditRef, {
        action: "DELETION_PROCESSING_STARTED",
        performedBy: authResult.uid,
        performedByEmail: authResult.email,
        timestamp: now,
      });
    });

    if (conflictError) {
      return NextResponse.json({ error: conflictError }, { status: 409 });
    }

    // 2. Target UID Resolution via Firebase Admin Auth
    const authAdmin = getAuth(app);
    if (!targetUid) {
      try {
        const userRecord = await authAdmin.getUserByEmail(targetEmail);
        targetUid = userRecord.uid;
        await docRef.update({
          targetUid,
          targetEmail: userRecord.email || targetEmail,
          targetUidResolvedAt: new Date().toISOString(),
        });
      } catch (err: any) {
        console.error("[Process Deletion Auth Lookup Error]:", err);
        const now = new Date().toISOString();
        await docRef.update({
          status: "FAILED_PROCESSING",
          failureCode: "AUTH_USER_NOT_FOUND",
          failedStep: "TARGET_UID_RESOLUTION",
          failedAt: now,
        });

        await docRef.collection("audit").add({
          action: "DELETION_FAILED",
          failureCode: "AUTH_USER_NOT_FOUND",
          failedStep: "TARGET_UID_RESOLUTION",
          performedBy: authResult.uid,
          performedByEmail: authResult.email,
          timestamp: now,
        });

        return NextResponse.json(
          { error: "Firebase Auth user not found for submitted email.", failureCode: "AUTH_USER_NOT_FOUND" },
          { status: 404 }
        );
      }
    }

    const uidToProcess = targetUid as string;
    const progress = (await docRef.get()).data()?.deletionProgress || {};

    // -------------------------------------------------------------
    // CHECKPOINT 1: Private User Data (users/{targetUid} + subcollections)
    // -------------------------------------------------------------
    if (progress.privateData !== "COMPLETED") {
      try {
        const userDocRef = db.collection("users").doc(uidToProcess);
        const contactsSub = await userDocRef.collection("contacts").get();
        for (const cDoc of contactsSub.docs) {
          await cDoc.ref.delete();
        }
        const tokensSub = await userDocRef.collection("fcmTokens").get();
        for (const tDoc of tokensSub.docs) {
          await tDoc.ref.delete();
        }
        await userDocRef.delete();
        progress.privateData = "COMPLETED";
        await docRef.update({ "deletionProgress.privateData": "COMPLETED" });
      } catch (err: any) {
        console.error("[Checkpoint 1 Failed]:", err);
        failureDetail = { code: "PRIVATE_DATA_CLEANUP_FAILED", step: "privateData", message: err.message };
      }
    }

    // -------------------------------------------------------------
    // CHECKPOINT 2: Recurring Expenses (Deactivate)
    // -------------------------------------------------------------
    if (!failureDetail && progress.recurringExpenses !== "COMPLETED") {
      try {
        const recurringSnap = await db.collection("recurringExpenses").get();
        for (const rDoc of recurringSnap.docs) {
          const rData = rDoc.data();
          if (
            rData.createdBy === uidToProcess ||
            rData.paidBy === uidToProcess ||
            (Array.isArray(rData.splitBetween) && rData.splitBetween.includes(uidToProcess))
          ) {
            await rDoc.ref.update({ active: false, updatedAt: new Date().toISOString() });
          }
        }
        progress.recurringExpenses = "COMPLETED";
        await docRef.update({ "deletionProgress.recurringExpenses": "COMPLETED" });
      } catch (err: any) {
        console.error("[Checkpoint 2 Failed]:", err);
        failureDetail = { code: "RECURRING_EXPENSES_DEACTIVATION_FAILED", step: "recurringExpenses", message: err.message };
      }
    }

    // -------------------------------------------------------------
    // CHECKPOINT 3: Groups Membership Cleanup & Anonymization (Idempotent & Comprehensive)
    // -------------------------------------------------------------
    if (!failureDetail) {
      try {
        const groupsSnap = await db.collection("groups").get();

        for (const gDoc of groupsSnap.docs) {
          const gData = gDoc.data();
          const hasMemberId = Array.isArray(gData.memberIds) && gData.memberIds.includes(uidToProcess);
          const hasMember = Array.isArray(gData.members) && gData.members.some((m: any) =>
            typeof m === "string" ? m === uidToProcess : m && m.uid === uidToProcess
          );
          const hasMemberDetail = Array.isArray(gData.membersDetails) && gData.membersDetails.some((m: any) => m && m.uid === uidToProcess);
          const hasMemberProfile = gData.memberProfiles && Boolean(gData.memberProfiles[uidToProcess]);
          const hasJoinedAt = gData.membersJoinedAt && Boolean(gData.membersJoinedAt[uidToProcess]);
          const hasPref = gData.memberExistingExpensesPreference && Boolean(gData.memberExistingExpensesPreference[uidToProcess]);
          const isCreator = gData.createdBy === uidToProcess;

          if (hasMemberId || hasMember || hasMemberDetail || hasMemberProfile || hasJoinedAt || hasPref || isCreator) {
            const updatedMemberIds = Array.isArray(gData.memberIds)
              ? gData.memberIds.filter((id: string) => id !== uidToProcess)
              : [];

            const updatedMembers = Array.isArray(gData.members)
              ? gData.members.filter((m: any) =>
                  typeof m === "string" ? m !== uidToProcess : m && m.uid !== uidToProcess
                )
              : gData.members;

            const updateFields: Record<string, any> = {
              memberIds: updatedMemberIds,
              updatedAt: new Date().toISOString(),
            };

            if (Array.isArray(gData.members)) {
              updateFields.members = updatedMembers;
            }

            if (Array.isArray(gData.membersDetails)) {
              updateFields.membersDetails = gData.membersDetails.filter(
                (m: any) => m && m.uid !== uidToProcess
              );
            }

            if (gData.memberProfiles && gData.memberProfiles[uidToProcess]) {
              updateFields[`memberProfiles.${uidToProcess}`] = FieldValue.delete();
            }

            if (gData.membersJoinedAt && gData.membersJoinedAt[uidToProcess]) {
              updateFields[`membersJoinedAt.${uidToProcess}`] = FieldValue.delete();
            }

            if (gData.memberExistingExpensesPreference && gData.memberExistingExpensesPreference[uidToProcess]) {
              updateFields[`memberExistingExpensesPreference.${uidToProcess}`] = FieldValue.delete();
            }

            // Handle Creator Transfer / Archive
            if (isCreator) {
              if (updatedMemberIds.length > 0) {
                let newOwnerUid = updatedMemberIds[0];

                if (Array.isArray(updateFields.membersDetails) && updateFields.membersDetails.length > 0) {
                  const remainingDetails = [...updateFields.membersDetails].sort((a: any, b: any) => {
                    const timeA =
                      typeof a.joinedAt === "number"
                        ? a.joinedAt
                        : typeof a.joinedAt === "string"
                        ? new Date(a.joinedAt).getTime()
                        : Infinity;
                    const timeB =
                      typeof b.joinedAt === "number"
                        ? b.joinedAt
                        : typeof b.joinedAt === "string"
                        ? new Date(b.joinedAt).getTime()
                        : Infinity;
                    return timeA - timeB;
                  });

                  if (remainingDetails[0] && remainingDetails[0].uid) {
                    newOwnerUid = remainingDetails[0].uid;
                  }
                }

                if (updatedMemberIds.includes(newOwnerUid)) {
                  updateFields.createdBy = newOwnerUid;
                } else {
                  updateFields.createdBy = updatedMemberIds[0];
                }
              } else {
                updateFields.isArchived = true;
              }
            }

            await gDoc.ref.update(updateFields);
          }
        }

        progress.groups = "COMPLETED";
        await docRef.update({ "deletionProgress.groups": "COMPLETED" });
      } catch (err: any) {
        console.error("[Checkpoint 3 Failed]:", err);
        failureDetail = { code: "GROUPS_MEMBERSHIP_UPDATE_FAILED", step: "groups", message: err.message };
      }
    }

    // -------------------------------------------------------------
    // CHECKPOINT 4: Historical Expenses Anonymization
    // -------------------------------------------------------------
    if (!failureDetail && progress.expenses !== "COMPLETED") {
      try {
        const expensesSnap = await db.collection("expenses").where("paidBy", "==", uidToProcess).get();
        for (const eDoc of expensesSnap.docs) {
          await eDoc.ref.update({ paidByName: "Deleted User" });
        }
        progress.expenses = "COMPLETED";
        await docRef.update({ "deletionProgress.expenses": "COMPLETED" });
      } catch (err: any) {
        console.error("[Checkpoint 4 Failed]:", err);
        failureDetail = { code: "EXPENSES_ANONYMIZATION_FAILED", step: "expenses", message: err.message };
      }
    }

    // -------------------------------------------------------------
    // CHECKPOINT 5: Historical Settlements Anonymization
    // -------------------------------------------------------------
    if (!failureDetail && progress.settlements !== "COMPLETED") {
      try {
        const fromSnap = await db.collection("settlements").where("fromUserId", "==", uidToProcess).get();
        for (const sDoc of fromSnap.docs) {
          await sDoc.ref.update({ fromName: "Deleted User" });
        }
        const toSnap = await db.collection("settlements").where("toUserId", "==", uidToProcess).get();
        for (const sDoc of toSnap.docs) {
          await sDoc.ref.update({ toName: "Deleted User" });
        }
        progress.settlements = "COMPLETED";
        await docRef.update({ "deletionProgress.settlements": "COMPLETED" });
      } catch (err: any) {
        console.error("[Checkpoint 5 Failed]:", err);
        failureDetail = { code: "SETTLEMENTS_ANONYMIZATION_FAILED", step: "settlements", message: err.message };
      }
    }

    // -------------------------------------------------------------
    // CHECKPOINT 6: Inverse Contacts Cleanup
    // -------------------------------------------------------------
    if (!failureDetail && progress.contacts !== "COMPLETED") {
      try {
        const usersSnap = await db.collection("users").get();
        for (const uDoc of usersSnap.docs) {
          if (uDoc.id !== uidToProcess) {
            const invContactDoc = uDoc.ref.collection("contacts").doc(uidToProcess);
            const invSnap = await invContactDoc.get();
            if (invSnap.exists) {
              await invContactDoc.delete();
            }
          }
        }
        progress.contacts = "COMPLETED";
        await docRef.update({ "deletionProgress.contacts": "COMPLETED" });
      } catch (err: any) {
        console.error("[Checkpoint 6 Failed]:", err);
        failureDetail = { code: "INVERSE_CONTACTS_CLEANUP_FAILED", step: "contacts", message: err.message };
      }
    }

    // -------------------------------------------------------------
    // CHECKPOINT 7: Notifications Anonymization & Cleanup (Idempotent & Comprehensive)
    // -------------------------------------------------------------
    if (!failureDetail) {
      try {
        const notifSnap = await db.collection("notifications").get();
        for (const nDoc of notifSnap.docs) {
          const nData = nDoc.data();
          const isTargetRecipient =
            nData.userId === uidToProcess ||
            nData.recipientUid === uidToProcess ||
            nData.targetUid === uidToProcess;

          const isTargetSender =
            nData.senderUid === uidToProcess ||
            nData.fromUserId === uidToProcess ||
            (nData.data && nData.data.senderUid === uidToProcess);

          if (isTargetRecipient) {
            await nDoc.ref.delete();
          } else if (isTargetSender) {
            const notifUpdates: Record<string, any> = {};
            if (nData.senderName) {
              notifUpdates.senderName = "Deleted User";
            }
            if (nData.data && nData.data.senderName) {
              notifUpdates["data.senderName"] = "Deleted User";
            }
            if (Object.keys(notifUpdates).length > 0) {
              await nDoc.ref.update(notifUpdates);
            }
          }
        }
        progress.notifications = "COMPLETED";
        await docRef.update({ "deletionProgress.notifications": "COMPLETED" });
      } catch (err: any) {
        console.error("[Checkpoint 7 Failed]:", err);
        failureDetail = { code: "NOTIFICATIONS_CLEANUP_FAILED", step: "notifications", message: err.message };
      }
    }

    // -------------------------------------------------------------
    // CHECKPOINT 8: Firebase Authentication Account Deletion
    // -------------------------------------------------------------
    if (!failureDetail && progress.auth !== "COMPLETED") {
      try {
        await authAdmin.deleteUser(uidToProcess);
        progress.auth = "COMPLETED";
        await docRef.update({ "deletionProgress.auth": "COMPLETED" });
      } catch (err: any) {
        if (err.code === "auth/user-not-found") {
          console.warn("[Checkpoint 8 User already deleted from Auth]:", uidToProcess);
          progress.auth = "COMPLETED";
          await docRef.update({ "deletionProgress.auth": "COMPLETED" });
        } else {
          console.error("[Checkpoint 8 Failed Server-Side Error]:", err.code || err, err.message);
          let sanitizedCode = "FIREBASE_AUTH_DELETION_FAILED";
          if (err.code === "auth/insufficient-permission") {
            sanitizedCode = "FIREBASE_AUTH_INSUFFICIENT_PERMISSION";
          } else if (err.code === "auth/internal-error") {
            sanitizedCode = "FIREBASE_AUTH_INTERNAL_ERROR";
          } else if (err.code === "auth/network-request-failed") {
            sanitizedCode = "FIREBASE_AUTH_NETWORK_FAILED";
          }
          failureDetail = {
            code: sanitizedCode,
            step: "auth",
            message: "Account deletion failed during authentication account processing.",
          };
        }
      }
    }

    // Handle Failures
    if (failureDetail) {
      const now = new Date().toISOString();
      await docRef.update({
        status: "FAILED_PROCESSING",
        failureCode: failureDetail.code,
        failedStep: failureDetail.step,
        failedAt: now,
      });

      await docRef.collection("audit").add({
        action: "DELETION_FAILED",
        failureCode: failureDetail.code,
        failedStep: failureDetail.step,
        performedBy: authResult.uid,
        performedByEmail: authResult.email,
        timestamp: now,
      });

      return NextResponse.json(
        {
          error: `Deletion processing failed at step: ${failureDetail.step}`,
          failureCode: failureDetail.code,
          failedStep: failureDetail.step,
        },
        { status: 500 }
      );
    }

    // -------------------------------------------------------------
    // FINALIZATION: Deletion Requests Doc Completion & Final Email
    // -------------------------------------------------------------
    const completedAt = new Date().toISOString();
    await docRef.update({
      status: "COMPLETED",
      completedAt,
      completedBy: authResult.uid,
      targetUid: uidToProcess,
      deletionVersion: 1,
    });

    await docRef.collection("audit").add({
      action: "DELETION_COMPLETED",
      performedBy: authResult.uid,
      performedByEmail: authResult.email,
      timestamp: completedAt,
    });

    // Send Completion Email
    const completionEmailResult = await sendCompletionEmail({
      requestId,
      fullName: userFullName,
      email: targetEmail,
    });

    await docRef.update({
      completionEmailStatus: completionEmailResult.status,
      completionEmailId: completionEmailResult.emailId || null,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Account deletion process successfully completed.",
        requestId,
        targetUid: uidToProcess,
        status: "COMPLETED",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Admin Deletion Request Process Error]:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during account deletion processing." },
      { status: 500 }
    );
  }
}
