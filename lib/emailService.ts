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

  // 2. User Confirmation Email Template (Redesigned for production transactional email)
  const userHtml = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SplitMate Deletion Request</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 24px 12px; -webkit-font-smoothing: antialiased; }
          .container { max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
          .header-bar { padding: 24px 32px 16px 32px; border-bottom: 1px solid #f1f5f9; }
          .brand-logo { font-size: 20px; font-weight: 800; color: #0065F2; letter-spacing: -0.5px; text-decoration: none; }
          .content { padding: 32px; }
          .headline { font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 16px 0; line-height: 1.3; }
          p { font-size: 15px; line-height: 1.6; color: #334155; margin: 0 0 16px 0; }
          .section-label { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.8px; margin: 24px 0 8px 0; }
          .details-card { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px 20px; margin-bottom: 24px; }
          .detail-row { display: table; width: 100%; margin-bottom: 10px; }
          .detail-row:last-child { margin-bottom: 0; }
          .detail-label { display: table-cell; font-size: 13px; font-weight: 600; color: #64748b; vertical-align: middle; width: 100px; }
          .detail-value { display: table-cell; font-size: 14px; color: #0f172a; vertical-align: middle; }
          .code-id { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 13px; background-color: #e2e8f0; padding: 2px 6px; border-radius: 4px; color: #1e293b; }
          .status-badge { display: inline-block; background-color: #fef3c7; color: #92400e; font-size: 12px; font-weight: 600; padding: 3px 8px; border-radius: 12px; }
          .footer { background-color: #f8fafc; padding: 20px 32px; border-top: 1px solid #f1f5f9; font-size: 12px; color: #94a3b8; text-align: center; }
          .footer strong { color: #64748b; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header-bar">
            <span class="brand-logo">SplitMate</span>
          </div>

          <div class="content">
            <h1 class="headline">Your deletion request has been received</h1>

            <p>Hello ${escapeHtml(fullName)},</p>
            <p>We've received your request to delete your SplitMate account.</p>

            <div class="section-label">REQUEST DETAILS</div>
            <div class="details-card">
              <div class="detail-row">
                <div class="detail-label">Request ID</div>
                <div class="detail-value"><span class="code-id">${requestId}</span></div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Status</div>
                <div class="detail-value"><span class="status-badge">Pending review</span></div>
              </div>
            </div>

            <div class="section-label">WHAT HAPPENS NEXT</div>
            <p>We'll verify your request and process the deletion.</p>
            <p>Your shared SplitMate expense and settlement records may need to be retained in anonymized form so that group balances, expense history, and settlement records remain accurate for other members.</p>

            <p style="margin-top: 24px; font-size: 14px; color: #64748b;">
              If you did not submit this request, please contact: <a href="mailto:${supportEmail}" style="color: #0065F2; text-decoration: none;">${supportEmail}</a>
            </p>
          </div>

          <div class="footer">
            <strong>SplitMate</strong><br />
            by Fyndra Labs
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
