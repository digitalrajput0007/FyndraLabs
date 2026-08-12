"use strict";exports.id=127,exports.ids=[127],exports.modules={6685:(e,o,t)=>{t.d(o,{KM:()=>i,TB:()=>n,ah:()=>s,sv:()=>r,zk:()=>l});var a=t(2591);async function i(e){let o=process.env.RESEND_API_KEY,t=process.env.RESEND_FROM_EMAIL||"SplitMate <support@fyndralabs.com>",i=process.env.SUPPORT_EMAIL||"support@fyndralabs.com",r={supportStatus:"FAILED",userStatus:"FAILED"};if(!o)return console.warn("[SplitMate Email]: RESEND_API_KEY environment variable is not configured."),r;let n=new a.R(o),{requestId:l,fullName:s,email:p,reason:c,createdAt:f}=e,b=`
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
            <div class="value"><code>${l}</code> &nbsp; <span class="badge">PENDING</span></div>
          </div>

          <div class="field">
            <div class="label">Submitted At</div>
            <div class="value">${f}</div>
          </div>

          <div class="field">
            <div class="label">Source</div>
            <div class="value">Web Form</div>
          </div>

          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />

          <div class="field">
            <div class="label">User Name</div>
            <div class="value">${d(s)}</div>
          </div>

          <div class="field">
            <div class="label">Account Email</div>
            <div class="value">${d(p)}</div>
          </div>

          <div class="field">
            <div class="label">Reason Given</div>
            <div class="value">${d(c||"None provided")}</div>
          </div>

          <div class="notice">
            This request has been recorded in the SplitMate <code>deletionRequests</code> collection and requires review before account deletion is performed.
          </div>
        </div>
      </body>
    </html>
  `,u=`
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

            <p>Hello ${d(s)},</p>
            <p>We've received your request to delete your SplitMate account.</p>

            <div class="section-label">REQUEST DETAILS</div>
            <div class="details-card">
              <div class="detail-row">
                <div class="detail-label">Request ID</div>
                <div class="detail-value"><span class="code-id">${l}</span></div>
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
              If you did not submit this request, please contact: <a href="mailto:${i}" style="color: #0065F2; text-decoration: none;">${i}</a>
            </p>
          </div>

          <div class="footer">
            <strong>SplitMate</strong><br />
            by Fyndra Labs
          </div>
        </div>
      </body>
    </html>
  `;try{let{data:e,error:o}=await n.emails.send({from:t,to:[i],subject:`[SplitMate] New Account Deletion Request — ${l}`,html:b});o?console.error("[SplitMate Email Error - Support]:",o.message):e&&(r.supportStatus="SENT",r.supportEmailId=e.id)}catch(e){console.error("[SplitMate Email Exception - Support]:",e instanceof Error?e.message:e)}try{let{data:e,error:o}=await n.emails.send({from:t,to:[p],subject:`SplitMate account deletion request received — ${l}`,html:u});o?console.error("[SplitMate Email Error - User]:",o.message):e&&(r.userStatus="SENT",r.userEmailId=e.id)}catch(e){console.error("[SplitMate Email Exception - User]:",e instanceof Error?e.message:e)}return r}async function r(e){let o=process.env.RESEND_API_KEY,t=process.env.RESEND_FROM_EMAIL||"SplitMate <support@fyndralabs.com>",i=process.env.SUPPORT_EMAIL||"support@fyndralabs.com";if(!o)return console.warn("[SplitMate Email]: RESEND_API_KEY environment variable is not configured."),{status:"FAILED"};let r=new a.R(o),{requestId:n,fullName:l,email:s}=e,p=`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SplitMate Account Deletion Approved</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 24px 12px; -webkit-font-smoothing: antialiased; }
          .container { max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
          .header-bar { padding: 24px 32px 16px 32px; border-bottom: 1px solid #f1f5f9; }
          .brand-logo { font-size: 20px; font-weight: 800; color: #0065F2; letter-spacing: -0.5px; text-decoration: none; }
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
            <span class="brand-logo">SplitMate</span>
          </div>

          <div class="content">
            <h1 class="headline">Account deletion request approved</h1>

            <p>Hello ${d(l)},</p>
            <p>Your SplitMate account deletion request has been approved and is now scheduled for account deletion processing.</p>

            <div class="details-card">
              <div class="detail-row">
                <div class="detail-label">Request ID</div>
                <div class="detail-value"><span class="code-id">${n}</span></div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Status</div>
                <div class="detail-value"><span class="status-badge">Approved</span></div>
              </div>
            </div>

            <p>Your shared SplitMate expense and settlement records may need to remain in anonymized form so group financial history remains accurate for other group members.</p>

            <p style="margin-top: 24px; font-size: 14px; color: #64748b;">
              If you have any questions, contact: <a href="mailto:${i}" style="color: #0065F2; text-decoration: none;">${i}</a>
            </p>
          </div>

          <div class="footer">
            <strong>SplitMate</strong><br />
            by Fyndra Labs
          </div>
        </div>
      </body>
    </html>
  `;try{let{data:e,error:o}=await r.emails.send({from:t,to:[s],subject:`SplitMate account deletion request approved — ${n}`,html:p});if(o)return console.error("[SplitMate Approval Email Error]:",o.message),{status:"FAILED"};return{status:"SENT",emailId:e?.id}}catch(e){return console.error("[SplitMate Approval Email Exception]:",e instanceof Error?e.message:e),{status:"FAILED"}}}async function n(e){let o=process.env.RESEND_API_KEY,t=process.env.RESEND_FROM_EMAIL||"SplitMate <support@fyndralabs.com>",i=process.env.SUPPORT_EMAIL||"support@fyndralabs.com";if(!o)return console.warn("[SplitMate Email]: RESEND_API_KEY environment variable is not configured."),{status:"FAILED"};let r=new a.R(o),{requestId:n,fullName:l,email:s,rejectionReason:p}=e,c=`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SplitMate Account Deletion Update</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 24px 12px; -webkit-font-smoothing: antialiased; }
          .container { max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
          .header-bar { padding: 24px 32px 16px 32px; border-bottom: 1px solid #f1f5f9; }
          .brand-logo { font-size: 20px; font-weight: 800; color: #0065F2; letter-spacing: -0.5px; text-decoration: none; }
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
            <span class="brand-logo">SplitMate</span>
          </div>

          <div class="content">
            <h1 class="headline">Account deletion request update</h1>

            <p>Hello ${d(l)},</p>
            <p>Your SplitMate account deletion request could not be approved at this time.</p>

            <div class="details-card">
              <div class="detail-row">
                <div class="detail-label">Request ID</div>
                <div class="detail-value"><span class="code-id">${n}</span></div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Status</div>
                <div class="detail-value"><span class="status-badge">Rejected</span></div>
              </div>
            </div>

            <p><strong>Reason provided by administrator:</strong></p>
            <div class="reason-box">
              ${d(p||"No specific reason provided.")}
            </div>

            <p style="margin-top: 24px; font-size: 14px; color: #64748b;">
              If you have any questions or wish to appeal, contact: <a href="mailto:${i}" style="color: #0065F2; text-decoration: none;">${i}</a>
            </p>
          </div>

          <div class="footer">
            <strong>SplitMate</strong><br />
            by Fyndra Labs
          </div>
        </div>
      </body>
    </html>
  `;try{let{data:e,error:o}=await r.emails.send({from:t,to:[s],subject:`SplitMate account deletion request update — ${n}`,html:c});if(o)return console.error("[SplitMate Rejection Email Error]:",o.message),{status:"FAILED"};return{status:"SENT",emailId:e?.id}}catch(e){return console.error("[SplitMate Rejection Email Exception]:",e instanceof Error?e.message:e),{status:"FAILED"}}}async function l(e){let o=process.env.RESEND_API_KEY,t=process.env.RESEND_FROM_EMAIL||"SplitMate <support@fyndralabs.com>",i=process.env.SUPPORT_EMAIL||"support@fyndralabs.com";if(!o)return console.warn("[SplitMate Email]: RESEND_API_KEY environment variable is not configured."),{status:"FAILED"};let r=new a.R(o),{requestId:n,fullName:l,email:s,verificationLink:p}=e,c=`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify SplitMate Account Deletion</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 24px 12px; -webkit-font-smoothing: antialiased; }
          .container { max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
          .header-bar { padding: 24px 32px 16px 32px; border-bottom: 1px solid #f1f5f9; }
          .brand-logo { font-size: 20px; font-weight: 800; color: #0065F2; letter-spacing: -0.5px; text-decoration: none; }
          .content { padding: 32px; }
          .headline { font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 16px 0; line-height: 1.3; }
          p { font-size: 15px; line-height: 1.6; color: #334155; margin: 0 0 16px 0; }
          .btn-container { margin: 24px 0; text-align: center; }
          .btn { display: inline-block; background-color: #0065F2; color: #ffffff !important; font-size: 14px; font-weight: 600; padding: 12px 24px; border-radius: 8px; text-decoration: none; }
          .code-id { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 13px; background-color: #e2e8f0; padding: 2px 6px; border-radius: 4px; color: #1e293b; }
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
            <h1 class="headline">Verify your account deletion request</h1>

            <p>Hello ${d(l)},</p>
            <p>Your deletion request (<span class="code-id">${n}</span>) has been approved for processing. Please click the link below to verify ownership of this email address and authorize final deletion.</p>

            <div class="btn-container">
              <a href="${p}" class="btn" target="_blank">Verify Deletion Request</a>
            </div>

            <p style="font-size: 13px; color: #64748b;">This link is valid for 24 hours. If you did not request this deletion, please contact <a href="mailto:${i}" style="color: #0065F2;">${i}</a> immediately.</p>
          </div>

          <div class="footer">
            <strong>SplitMate</strong><br />
            by Fyndra Labs
          </div>
        </div>
      </body>
    </html>
  `;try{let{data:e,error:o}=await r.emails.send({from:t,to:[s],subject:`Verify SplitMate account deletion — ${n}`,html:c});if(o)return console.error("[SplitMate Verification Email Error]:",o.message),{status:"FAILED"};return{status:"SENT",emailId:e?.id}}catch(e){return console.error("[SplitMate Verification Email Exception]:",e instanceof Error?e.message:e),{status:"FAILED"}}}async function s(e){let o=process.env.RESEND_API_KEY,t=process.env.RESEND_FROM_EMAIL||"SplitMate <support@fyndralabs.com>",i=process.env.SUPPORT_EMAIL||"support@fyndralabs.com";if(!o)return console.warn("[SplitMate Email]: RESEND_API_KEY environment variable is not configured."),{status:"FAILED"};let r=new a.R(o),{requestId:n,fullName:l,email:s}=e,p=`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SplitMate Account Deletion Completed</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 24px 12px; -webkit-font-smoothing: antialiased; }
          .container { max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
          .header-bar { padding: 24px 32px 16px 32px; border-bottom: 1px solid #f1f5f9; }
          .brand-logo { font-size: 20px; font-weight: 800; color: #0065F2; letter-spacing: -0.5px; text-decoration: none; }
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
            <span class="brand-logo">SplitMate</span>
          </div>

          <div class="content">
            <h1 class="headline">Account deletion completed</h1>

            <p>Hello ${d(l)},</p>
            <p>Your SplitMate account deletion has been completed.</p>
            <p>Your private account information and account access have been removed.</p>

            <div class="details-card">
              <div class="detail-row">
                <div class="detail-label">Request ID</div>
                <div class="detail-value"><span class="code-id">${n}</span></div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Status</div>
                <div class="detail-value"><span class="status-badge">Completed</span></div>
              </div>
            </div>

            <p>Certain historical shared expense and settlement records have been retained in anonymized form to preserve the financial history and balances of other group members.</p>

            <p style="margin-top: 24px; font-size: 14px; color: #64748b;">
              Thank you for using SplitMate. If you have any questions, contact: <a href="mailto:${i}" style="color: #0065F2; text-decoration: none;">${i}</a>
            </p>
          </div>

          <div class="footer">
            <strong>SplitMate</strong><br />
            by Fyndra Labs
          </div>
        </div>
      </body>
    </html>
  `;try{let{data:e,error:o}=await r.emails.send({from:t,to:[s],subject:`SplitMate account deletion completed — ${n}`,html:p});if(o)return console.error("[SplitMate Completion Email Error]:",o.message),{status:"FAILED"};return{status:"SENT",emailId:e?.id}}catch(e){return console.error("[SplitMate Completion Email Exception]:",e instanceof Error?e.message:e),{status:"FAILED"}}}function d(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}},3133:(e,o,t)=>{t.a(e,async(e,a)=>{try{t.d(o,{E:()=>c});var i=t(3263),r=t(2929),n=t(2048),l=t.n(n),s=t(5315),d=t.n(s),p=e([i,r]);function c(){let e=(0,i.getApps)();if(e.length>0)return{db:(0,r.getFirestore)(e[0]),app:e[0],isConfigured:!0};let o=process.env.FIREBASE_PROJECT_ID,t=process.env.FIREBASE_CLIENT_EMAIL,a=process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g,"\n"),n=process.env.FIREBASE_SERVICE_ACCOUNT_KEY;try{if(n){let e=JSON.parse(n),o=(0,i.initializeApp)({credential:(0,i.cert)(e)});return{db:(0,r.getFirestore)(o),app:o,isConfigured:!0}}if(o&&t&&a){let e=(0,i.initializeApp)({credential:(0,i.cert)({projectId:o,clientEmail:t,privateKey:a})});return{db:(0,r.getFirestore)(e),app:e,isConfigured:!0}}let e=d().join("C:","SplitMate","splitmate-d2d66-firebase-adminsdk-fbsvc-c01c280d7f.json");if(l().existsSync(e)){let o=l().readFileSync(e,"utf8"),t=JSON.parse(o),a=(0,i.initializeApp)({credential:(0,i.cert)(t)});return{db:(0,r.getFirestore)(a),app:a,isConfigured:!0}}}catch(e){return console.error("[Firebase Admin Initialization Error]:",e),{db:null,app:null,isConfigured:!1,error:"FIREBASE_ADMIN_INIT_FAILED"}}return{db:null,app:null,isConfigured:!1,error:"FIREBASE_ADMIN_CREDENTIALS_MISSING"}}[i,r]=p.then?(await p)():p,a()}catch(e){a(e)}})}};