import { Resend } from "resend";

export interface SendDeletionEmailsParams {
  requestId: string;
  fullName: string;
  email: string;
  reason: string;
  createdAt: string;
}

export interface EmailResult {
  supportStatus: "SENT" | "FAILED";
  userStatus: "SENT" | "FAILED";
  supportEmailId?: string;
  userEmailId?: string;
}

/**
 * Server-only helper to send support notification & user confirmation emails via Resend.
 * Safely handles missing API keys or network errors without throwing or losing Firestore records.
 */
export async function sendDeletionEmails(params: SendDeletionEmailsParams): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "SplitMate <support@fyndralabs.com>";
  const supportEmail = process.env.SUPPORT_EMAIL || "support@fyndralabs.com";

  const result: EmailResult = {
    supportStatus: "FAILED",
    userStatus: "FAILED",
  };

  if (!apiKey) {
    console.warn("[SplitMate Email]: RESEND_API_KEY environment variable is not configured.");
    return result;
  }

  const resend = new Resend(apiKey);
  const { requestId, fullName, email, reason, createdAt } = params;

  // 1. Support Notification Email Template
  const supportHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f8; color: #1e293b; margin: 0; padding: 20px; }
          .card { background-color: #ffffff; border-radius: 8px; max-width: 600px; margin: 0 auto; padding: 32px; border: 1px solid #e2e8f0; }
          .header { font-size: 20px; font-weight: 700; color: #0065F2; margin-bottom: 20px; }
          .badge { display: inline-block; background-color: #fef3c7; color: #92400e; font-weight: 600; font-size: 12px; padding: 4px 8px; border-radius: 4px; text-transform: uppercase; }
          .field { margin-bottom: 12px; }
          .label { font-weight: 600; color: #64748b; font-size: 13px; text-transform: uppercase; margin-bottom: 2px; }
          .value { font-size: 15px; color: #0f172a; }
          .notice { margin-top: 24px; padding: 12px; background-color: #eff6ff; border-left: 4px solid #0065F2; font-size: 13px; color: #1e40af; border-radius: 0 4px 4px 0; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">SplitMate &bull; Account Deletion Request</div>
          
          <div class="field">
            <div class="label">Request ID</div>
            <div class="value"><code>${requestId}</code> &nbsp; <span class="badge">PENDING</span></div>
          </div>

          <div class="field">
            <div class="label">Submitted At</div>
            <div class="value">${createdAt}</div>
          </div>

          <div class="field">
            <div class="label">Source</div>
            <div class="value">Web Form</div>
          </div>

          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />

          <div class="field">
            <div class="label">User Name</div>
            <div class="value">${escapeHtml(fullName)}</div>
          </div>

          <div class="field">
            <div class="label">Account Email</div>
            <div class="value">${escapeHtml(email)}</div>
          </div>

          <div class="field">
            <div class="label">Reason Given</div>
            <div class="value">${escapeHtml(reason || "None provided")}</div>
          </div>

          <div class="notice">
            This request has been recorded in the SplitMate <code>deletionRequests</code> collection and requires review before account deletion is performed.
          </div>
        </div>
      </body>
    </html>
  `;

  // 2. User Confirmation Email Template
  const userHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f8; color: #1e293b; margin: 0; padding: 20px; }
          .card { background-color: #ffffff; border-radius: 8px; max-width: 600px; margin: 0 auto; padding: 32px; border: 1px solid #e2e8f0; }
          .brand { font-size: 20px; font-weight: 700; color: #0065F2; margin-bottom: 24px; }
          .title { font-size: 18px; font-weight: 600; color: #0f172a; margin-bottom: 16px; }
          p { font-size: 15px; line-height: 1.6; color: #334155; margin-bottom: 16px; }
          .info-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin: 20px 0; }
          .info-row { font-size: 14px; margin-bottom: 6px; }
          .info-label { font-weight: 600; color: #64748b; }
          .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #94a3b8; text-align: center; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="brand">SplitMate</div>
          <div class="title">Account Deletion Request Received</div>

          <p>Hello ${escapeHtml(fullName)},</p>

          <p>We received your request to delete your SplitMate account.</p>

          <div class="info-box">
            <div class="info-row"><span class="info-label">Request ID:</span> <code>${requestId}</code></div>
            <div class="info-row"><span class="info-label">Status:</span> <strong>Pending review</strong></div>
          </div>

          <p>We will verify and process your request. Your shared SplitMate expense and settlement records may need to be retained in anonymized form so group balances and financial history remain accurate.</p>

          <p>If you did not submit this request, please contact our support team immediately at <a href="mailto:${supportEmail}" style="color: #0065F2; text-decoration: none;">${supportEmail}</a>.</p>

          <div class="footer">
            &copy; ${new Date().getFullYear()} Fyndra Labs &bull; SplitMate Service
          </div>
        </div>
      </body>
    </html>
  `;

  // Attempt Support Email
  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [supportEmail],
      subject: `[SplitMate] New Account Deletion Request — ${requestId}`,
      html: supportHtml,
    });

    if (error) {
      console.error("[SplitMate Email Error - Support]:", error.message);
    } else if (data) {
      result.supportStatus = "SENT";
      result.supportEmailId = data.id;
    }
  } catch (err) {
    console.error("[SplitMate Email Exception - Support]:", err instanceof Error ? err.message : err);
  }

  // Attempt User Confirmation Email
  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: `SplitMate account deletion request received — ${requestId}`,
      html: userHtml,
    });

    if (error) {
      console.error("[SplitMate Email Error - User]:", error.message);
    } else if (data) {
      result.userStatus = "SENT";
      result.userEmailId = data.id;
    }
  } catch (err) {
    console.error("[SplitMate Email Exception - User]:", err instanceof Error ? err.message : err);
  }

  return result;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
