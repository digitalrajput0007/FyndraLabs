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

export interface AdminActionEmailResult {
  status: "SENT" | "FAILED";
  emailId?: string;
}

export interface SendSupportNotificationParams {
  requestId: string;
  fullName: string;
  email: string;
  reason: string;
  createdAt: string;
}

export interface SendVerificationEmailParams {
  requestId: string;
  fullName: string;
  email: string;
  verificationLink: string;
}

export interface SendAdminActionEmailParams {
  requestId: string;
  fullName: string;
  email: string;
  rejectionReason?: string;
}

/**
 * Sends Internal Support Notification Email to support@fyndralabs.com immediately upon submission.
 * Does NOT contain the secret verification token.
 */
export async function sendSupportNotificationEmail(params: SendSupportNotificationParams): Promise<AdminActionEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "SplitMate <support@fyndralabs.com>";
  const supportEmail = process.env.SUPPORT_EMAIL || "support@fyndralabs.com";
  const logoUrl = process.env.SPLITMATE_LOGO_URL || "https://ik.imagekit.io/splitmateapp/notification_large.png?updatedAt=1786388742977";

  if (!apiKey) {
    console.warn("[SplitMate Support Email]: RESEND_API_KEY environment variable is not configured.");
    return { status: "FAILED" };
  }

  const resend = new Resend(apiKey);
  const { requestId, fullName, email, reason, createdAt } = params;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New SplitMate Account Deletion Request</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 24px 12px; -webkit-font-smoothing: antialiased; }
          .container { max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
          .header-bar { padding: 28px 32px 20px 32px; border-bottom: 1px solid #f1f5f9; text-align: center; }
          .logo-img { width: 120px !important; max-width: 120px !important; height: auto !important; display: block !important; margin: 0 auto !important; border: 0 !important; }
          .content { padding: 32px; }
          .headline { font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 16px 0; line-height: 1.3; }
          p { font-size: 15px; line-height: 1.6; color: #334155; margin: 0 0 16px 0; }
          .section-label { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.8px; margin: 24px 0 8px 0; }
          .details-card { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px 20px; margin-bottom: 24px; }
          .detail-row { display: table; width: 100%; margin-bottom: 10px; }
          .detail-row:last-child { margin-bottom: 0; }
          .detail-label { display: table-cell; font-size: 13px; font-weight: 600; color: #64748b; vertical-align: middle; width: 140px; }
          .detail-value { display: table-cell; font-size: 14px; color: #0f172a; vertical-align: middle; }
          .code-id { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 13px; background-color: #e2e8f0; padding: 2px 6px; border-radius: 4px; color: #1e293b; }
          .status-badge { display: inline-block; background-color: #fef3c7; color: #92400e; font-size: 12px; font-weight: 600; padding: 3px 8px; border-radius: 12px; }
          .notice-box { background-color: #eff6ff; border-left: 4px solid #0065F2; padding: 14px; font-size: 13px; color: #1e40af; border-radius: 0 4px 4px 0; margin-top: 16px; line-height: 1.5; }
          .footer { background-color: #f8fafc; padding: 20px 32px; border-top: 1px solid #f1f5f9; font-size: 12px; color: #94a3b8; text-align: center; }
          .footer strong { color: #64748b; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header-bar">
            <img src="${logoUrl}" width="120" height="auto" alt="SplitMate" class="logo-img" style="display:block;width:120px;max-width:120px;height:auto;margin:0 auto;border:0;" />
          </div>

          <div class="content">
            <h1 class="headline">New SplitMate Account Deletion Request</h1>

            <p>A new account deletion request has been submitted on SplitMate.</p>

            <div class="section-label">REQUEST DETAILS</div>
            <div class="details-card">
              <div class="detail-row">
                <div class="detail-label">Request ID</div>
                <div class="detail-value"><span class="code-id">${requestId}</span></div>
              </div>
              <div class="detail-row">
                <div class="detail-label">User Full Name</div>
                <div class="detail-value">${escapeHtml(fullName)}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">User Email</div>
                <div class="detail-value">${escapeHtml(email)}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Submitted Timestamp</div>
                <div class="detail-value">${escapeHtml(createdAt)}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Reason</div>
                <div class="detail-value">${escapeHtml(reason || "None provided")}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Verification Status</div>
                <div class="detail-value"><span class="status-badge">PENDING</span></div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Request Status</div>
                <div class="detail-value"><span class="status-badge">PENDING</span></div>
              </div>
            </div>

            <div class="notice-box">
              <strong>Important Notice:</strong> Email verification is required before this request can be approved.
            </div>
          </div>

          <div class="footer">
            <strong>SplitMate Administration</strong><br />
            Fyndra Labs Internal Notification
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const recipientDomain = supportEmail.split("@")[1] || "fyndralabs.com";
    console.log(`[SplitMate Email] Sending internal support notification for request ${requestId} to support@${recipientDomain}...`);

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [supportEmail],
      subject: `New SplitMate account deletion request — ${requestId}`,
      html,
    });

    if (error) {
      console.error(`[SplitMate Email Error - Support Notification] Request: ${requestId}, Recipient: ${supportEmail}, Code: ${error.name || "RESEND_ERROR"}, Message: ${error.message}`);
      return { status: "FAILED" };
    }

    console.log(`[SplitMate Email Success - Support Notification] Request: ${requestId}, Recipient: ${supportEmail}, MessageId: ${data?.id}`);
    return { status: "SENT", emailId: data?.id };
  } catch (err) {
    console.error(`[SplitMate Email Exception - Support Notification] Request: ${requestId}, Recipient: ${supportEmail}, Message: ${err instanceof Error ? err.message : String(err)}`);
    return { status: "FAILED" };
  }
}

/**
 * Sends Email Verification Token link to the customer before deletion processing.
 */
export async function sendVerificationEmail(params: SendVerificationEmailParams): Promise<AdminActionEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "SplitMate <support@fyndralabs.com>";
  const supportEmail = process.env.SUPPORT_EMAIL || "support@fyndralabs.com";
  const logoUrl = process.env.SPLITMATE_LOGO_URL || "https://ik.imagekit.io/splitmateapp/notification_large.png?updatedAt=1786388742977";

  if (!apiKey) {
    console.warn("[SplitMate Customer Email]: RESEND_API_KEY environment variable is not configured.");
    return { status: "FAILED" };
  }

  const resend = new Resend(apiKey);
  const { requestId, fullName, email, verificationLink } = params;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify SplitMate Account Deletion</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 24px 12px; -webkit-font-smoothing: antialiased; }
          .container { max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
          .header-bar { padding: 28px 32px 20px 32px; border-bottom: 1px solid #f1f5f9; text-align: center; }
          .logo-img { width: 120px !important; max-width: 120px !important; height: auto !important; display: block !important; margin: 0 auto !important; border: 0 !important; }
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
          .btn-container { margin: 28px 0; text-align: center; }
          .btn { display: inline-block; background-color: #0065F2; color: #ffffff !important; font-size: 14px; font-weight: 700; padding: 14px 28px; border-radius: 8px; text-decoration: none; letter-spacing: 0.3px; }
          .fallback-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px 14px; margin-top: 16px; word-break: break-all; font-size: 12px; color: #475569; }
          .footer { background-color: #f8fafc; padding: 20px 32px; border-top: 1px solid #f1f5f9; font-size: 12px; color: #94a3b8; text-align: center; }
          .footer strong { color: #64748b; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header-bar">
            <img src="${logoUrl}" width="120" height="auto" alt="SplitMate" class="logo-img" style="display:block;width:120px;max-width:120px;height:auto;margin:0 auto;border:0;" />
          </div>

          <div class="content">
            <h1 class="headline">Verify your account deletion request</h1>

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
                <div class="detail-value"><span class="status-badge">Pending verification</span></div>
              </div>
            </div>

            <p>To confirm that you own this email address and authorize this account deletion request, please verify your email address using the button below:</p>

            <div class="btn-container">
              <a href="${verificationLink}" class="btn" target="_blank">VERIFY EMAIL ADDRESS</a>
            </div>

            <p style="font-size: 13px; color: #64748b; margin-top: 20px;">
              This verification link expires in 24 hours and can only be used once.
            </p>

            <p style="font-size: 13px; color: #64748b;">
              Your shared SplitMate expense and settlement records may need to be retained in anonymized form so that group balances, expense history, and settlement records remain accurate for other members.
            </p>

            <p style="font-size: 13px; color: #64748b; margin-top: 20px;">
              If the button above does not work, copy and paste this link into your browser:
            </p>
            <div class="fallback-box">
              <a href="${verificationLink}" style="color: #0065F2; text-decoration: underline;">${verificationLink}</a>
            </div>

            <p style="margin-top: 24px; font-size: 13px; color: #64748b;">
              If you did not submit this request, no action is required. You can also contact support at <a href="mailto:${supportEmail}" style="color: #0065F2; text-decoration: none;">${supportEmail}</a>.
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

  try {
    const userDomain = email.split("@")[1] || "domain";
    console.log(`[SplitMate Email] Sending verification link for request ${requestId} to user domain @${userDomain}...`);

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: `Verify SplitMate account deletion — ${requestId}`,
      html,
    });

    if (error) {
      console.error(`[SplitMate Email Error - Verification] Request: ${requestId}, Code: ${error.name || "RESEND_ERROR"}, Message: ${error.message}`);
      return { status: "FAILED" };
    }

    console.log(`[SplitMate Email Success - Verification] Request: ${requestId}, MessageId: ${data?.id}`);
    return { status: "SENT", emailId: data?.id };
  } catch (err) {
    console.error(`[SplitMate Email Exception - Verification] Request: ${requestId}, Message: ${err instanceof Error ? err.message : String(err)}`);
    return { status: "FAILED" };
  }
}

/**
 * Sends User Approval Notification Email.
 */
export async function sendApprovalEmail(params: SendAdminActionEmailParams): Promise<AdminActionEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "SplitMate <support@fyndralabs.com>";
  const supportEmail = process.env.SUPPORT_EMAIL || "support@fyndralabs.com";
  const logoUrl = process.env.SPLITMATE_LOGO_URL || "https://ik.imagekit.io/splitmateapp/notification_large.png?updatedAt=1786388742977";

  if (!apiKey) {
    console.warn("[SplitMate Email]: RESEND_API_KEY environment variable is not configured.");
    return { status: "FAILED" };
  }

  const resend = new Resend(apiKey);
  const { requestId, fullName, email } = params;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SplitMate Account Deletion Approved</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 24px 12px; -webkit-font-smoothing: antialiased; }
          .container { max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
          .header-bar { padding: 28px 32px 20px 32px; border-bottom: 1px solid #f1f5f9; text-align: center; }
          .logo-img { width: 120px !important; max-width: 120px !important; height: auto !important; display: block !important; margin: 0 auto !important; border: 0 !important; }
          .content { padding: 32px; }
          .headline { font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 16px 0; line-height: 1.3; }
          p { font-size: 15px; line-height: 1.6; color: #334155; margin: 0 0 16px 0; }
          .details-card { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px 20px; margin: 20px 0; }
          .detail-row { display: table; width: 100%; margin-bottom: 8px; }
          .detail-row:last-child { margin-bottom: 0; }
          .detail-label { display: table-cell; font-size: 13px; font-weight: 600; color: #64748b; width: 100px; }
          .detail-value { display: table-cell; font-size: 14px; color: #0f172a; }
          .code-id { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 13px; background-color: #e2e8f0; padding: 2px 6px; border-radius: 4px; color: #1e293b; }
          .status-badge { display: inline-block; background-color: #dcfce7; color: #166534; font-size: 12px; font-weight: 600; padding: 3px 8px; border-radius: 12px; }
          .footer { background-color: #f8fafc; padding: 20px 32px; border-top: 1px solid #f1f5f9; font-size: 12px; color: #94a3b8; text-align: center; }
          .footer strong { color: #64748b; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header-bar">
            <img src="${logoUrl}" width="120" height="auto" alt="SplitMate" class="logo-img" style="display:block;width:120px;max-width:120px;height:auto;margin:0 auto;border:0;" />
          </div>

          <div class="content">
            <h1 class="headline">Account deletion request approved</h1>

            <p>Hello ${escapeHtml(fullName)},</p>
            <p>Your SplitMate account deletion request has been approved and is now scheduled for account deletion processing.</p>

            <div class="details-card">
              <div class="detail-row">
                <div class="detail-label">Request ID</div>
                <div class="detail-value"><span class="code-id">${requestId}</span></div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Status</div>
                <div class="detail-value"><span class="status-badge">Approved</span></div>
              </div>
            </div>

            <p>Your shared SplitMate expense and settlement records may need to remain in anonymized form so group financial history remains accurate for other group members.</p>

            <p style="margin-top: 24px; font-size: 14px; color: #64748b;">
              If you have any questions, contact: <a href="mailto:${supportEmail}" style="color: #0065F2; text-decoration: none;">${supportEmail}</a>
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

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: `SplitMate account deletion request approved — ${requestId}`,
      html,
    });

    if (error) {
      console.error("[SplitMate Approval Email Error]:", error.message);
      return { status: "FAILED" };
    }
    return { status: "SENT", emailId: data?.id };
  } catch (err) {
    console.error("[SplitMate Approval Email Exception]:", err instanceof Error ? err.message : err);
    return { status: "FAILED" };
  }
}

/**
 * Sends User Rejection Notification Email.
 */
export async function sendRejectionEmail(params: SendAdminActionEmailParams): Promise<AdminActionEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "SplitMate <support@fyndralabs.com>";
  const supportEmail = process.env.SUPPORT_EMAIL || "support@fyndralabs.com";
  const logoUrl = process.env.SPLITMATE_LOGO_URL || "https://ik.imagekit.io/splitmateapp/notification_large.png?updatedAt=1786388742977";

  if (!apiKey) {
    console.warn("[SplitMate Email]: RESEND_API_KEY environment variable is not configured.");
    return { status: "FAILED" };
  }

  const resend = new Resend(apiKey);
  const { requestId, fullName, email, rejectionReason } = params;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SplitMate Account Deletion Update</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 24px 12px; -webkit-font-smoothing: antialiased; }
          .container { max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
          .header-bar { padding: 28px 32px 20px 32px; border-bottom: 1px solid #f1f5f9; text-align: center; }
          .logo-img { width: 120px !important; max-width: 120px !important; height: auto !important; display: block !important; margin: 0 auto !important; border: 0 !important; }
          .content { padding: 32px; }
          .headline { font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 16px 0; line-height: 1.3; }
          p { font-size: 15px; line-height: 1.6; color: #334155; margin: 0 0 16px 0; }
          .details-card { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px 20px; margin: 20px 0; }
          .detail-row { display: table; width: 100%; margin-bottom: 8px; }
          .detail-row:last-child { margin-bottom: 0; }
          .detail-label { display: table-cell; font-size: 13px; font-weight: 600; color: #64748b; width: 120px; }
          .detail-value { display: table-cell; font-size: 14px; color: #0f172a; }
          .code-id { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 13px; background-color: #e2e8f0; padding: 2px 6px; border-radius: 4px; color: #1e293b; }
          .status-badge { display: inline-block; background-color: #fee2e2; color: #991b1b; font-size: 12px; font-weight: 600; padding: 3px 8px; border-radius: 12px; }
          .reason-box { background-color: #fff1f2; border-left: 4px solid #e11d48; padding: 14px; font-size: 14px; color: #881337; border-radius: 0 4px 4px 0; margin-top: 12px; }
          .footer { background-color: #f8fafc; padding: 20px 32px; border-top: 1px solid #f1f5f9; font-size: 12px; color: #94a3b8; text-align: center; }
          .footer strong { color: #64748b; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header-bar">
            <img src="${logoUrl}" width="120" height="auto" alt="SplitMate" class="logo-img" style="display:block;width:120px;max-width:120px;height:auto;margin:0 auto;border:0;" />
          </div>

          <div class="content">
            <h1 class="headline">Account deletion request update</h1>

            <p>Hello ${escapeHtml(fullName)},</p>
            <p>Your SplitMate account deletion request could not be approved at this time.</p>

            <div class="details-card">
              <div class="detail-row">
                <div class="detail-label">Request ID</div>
                <div class="detail-value"><span class="code-id">${requestId}</span></div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Status</div>
                <div class="detail-value"><span class="status-badge">Rejected</span></div>
              </div>
            </div>

            <p><strong>Reason provided by administrator:</strong></p>
            <div class="reason-box">
              ${escapeHtml(rejectionReason || "No specific reason provided.")}
            </div>

            <p style="margin-top: 24px; font-size: 14px; color: #64748b;">
              If you have any questions or wish to appeal, contact: <a href="mailto:${supportEmail}" style="color: #0065F2; text-decoration: none;">${supportEmail}</a>
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

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: `SplitMate account deletion request update — ${requestId}`,
      html,
    });

    if (error) {
      console.error("[SplitMate Rejection Email Error]:", error.message);
      return { status: "FAILED" };
    }
    return { status: "SENT", emailId: data?.id };
  } catch (err) {
    console.error("[SplitMate Rejection Email Exception]:", err instanceof Error ? err.message : err);
    return { status: "FAILED" };
  }
}

/**
 * Sends Final Deletion Completion Email to User.
 */
export async function sendCompletionEmail(params: SendAdminActionEmailParams): Promise<AdminActionEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "SplitMate <support@fyndralabs.com>";
  const supportEmail = process.env.SUPPORT_EMAIL || "support@fyndralabs.com";
  const logoUrl = process.env.SPLITMATE_LOGO_URL || "https://ik.imagekit.io/splitmateapp/notification_large.png?updatedAt=1786388742977";

  if (!apiKey) {
    console.warn("[SplitMate Email]: RESEND_API_KEY environment variable is not configured.");
    return { status: "FAILED" };
  }

  const resend = new Resend(apiKey);
  const { requestId, fullName, email } = params;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SplitMate Account Deletion Completed</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 24px 12px; -webkit-font-smoothing: antialiased; }
          .container { max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
          .header-bar { padding: 28px 32px 20px 32px; border-bottom: 1px solid #f1f5f9; text-align: center; }
          .logo-img { width: 120px !important; max-width: 120px !important; height: auto !important; display: block !important; margin: 0 auto !important; border: 0 !important; }
          .content { padding: 32px; }
          .headline { font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 16px 0; line-height: 1.3; }
          p { font-size: 15px; line-height: 1.6; color: #334155; margin: 0 0 16px 0; }
          .details-card { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px 20px; margin: 20px 0; }
          .detail-row { display: table; width: 100%; margin-bottom: 8px; }
          .detail-row:last-child { margin-bottom: 0; }
          .detail-label { display: table-cell; font-size: 13px; font-weight: 600; color: #64748b; width: 100px; }
          .detail-value { display: table-cell; font-size: 14px; color: #0f172a; }
          .code-id { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 13px; background-color: #e2e8f0; padding: 2px 6px; border-radius: 4px; color: #1e293b; }
          .status-badge { display: inline-block; background-color: #e0e7ff; color: #3730a3; font-size: 12px; font-weight: 600; padding: 3px 8px; border-radius: 12px; }
          .footer { background-color: #f8fafc; padding: 20px 32px; border-top: 1px solid #f1f5f9; font-size: 12px; color: #94a3b8; text-align: center; }
          .footer strong { color: #64748b; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header-bar">
            <img src="${logoUrl}" width="120" height="auto" alt="SplitMate" class="logo-img" style="display:block;width:120px;max-width:120px;height:auto;margin:0 auto;border:0;" />
          </div>

          <div class="content">
            <h1 class="headline">Account deletion completed</h1>

            <p>Hello ${escapeHtml(fullName)},</p>
            <p>Your SplitMate account deletion has been completed.</p>
            <p>Your private account information and account access have been removed.</p>

            <div class="details-card">
              <div class="detail-row">
                <div class="detail-label">Request ID</div>
                <div class="detail-value"><span class="code-id">${requestId}</span></div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Status</div>
                <div class="detail-value"><span class="status-badge">Completed</span></div>
              </div>
            </div>

            <p>Certain historical shared expense and settlement records have been retained in anonymized form to preserve the financial history and balances of other group members.</p>

            <p style="margin-top: 24px; font-size: 14px; color: #64748b;">
              Thank you for using SplitMate. If you have any questions, contact: <a href="mailto:${supportEmail}" style="color: #0065F2; text-decoration: none;">${supportEmail}</a>
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

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: `SplitMate account deletion completed — ${requestId}`,
      html,
    });

    if (error) {
      console.error("[SplitMate Completion Email Error]:", error.message);
      return { status: "FAILED" };
    }
    return { status: "SENT", emailId: data?.id };
  } catch (err) {
    console.error("[SplitMate Completion Email Exception]:", err instanceof Error ? err.message : err);
    return { status: "FAILED" };
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
