// Server-only transactional email helper.
//
// Uses Resend when RESEND_API_KEY is configured. When it is not configured the
// helper never throws: it logs and reports { skipped: true } so the approval
// workflow keeps working (the admin UI shows the generated link instead).
import { getSiteUrl } from "@/lib/verification";

export type EmailResult = {
  sent: boolean;
  skipped?: boolean;
  error?: string;
};

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

const DEFAULT_FROM = "Tasheel Legal <onboarding@resend.dev>";

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: SendEmailInput): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || DEFAULT_FROM;

  if (!apiKey) {
    console.warn(
      `[email] RESEND_API_KEY not configured; skipped "${subject}" to ${to}`,
    );
    return { sent: false, skipped: true };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        html,
        ...(text ? { text } : {}),
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`[email] Resend rejected "${subject}": ${res.status} ${body}`);
      return { sent: false, error: `Email provider error (${res.status})` };
    }

    return { sent: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown email error";
    console.error(`[email] Failed to send "${subject}": ${message}`);
    return { sent: false, error: message };
  }
}

function shell(title: string, body: string): string {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#070D19;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#070D19;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#0A1120;border:1px solid rgba(197,168,128,0.35);">
            <tr>
              <td style="padding:28px 32px;border-bottom:1px solid rgba(255,255,255,0.08);">
                <p style="margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#C5A880;font-weight:bold;">Tasheel Legal</p>
                <h1 style="margin:10px 0 0;font-size:22px;color:#ffffff;font-weight:normal;">${title}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 32px;color:#d1d5db;font-size:14px;line-height:1.75;">
                ${body}
              </td>
            </tr>
            <tr>
              <td style="padding:18px 32px;border-top:1px solid rgba(255,255,255,0.08);color:#6b7280;font-size:11px;">
                Tasheel Legal — Law Firm &amp; Legal Consultancy
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function sendApprovedEmail(
  to: string,
  fullName: string | null,
): Promise<EmailResult> {
  const name = fullName || "there";
  return sendEmail({
    to,
    subject: "Your Tasheel Legal account has been approved",
    text: `Hello ${name}, your Tasheel Legal account has been approved. You can now access the marketplace at ${getSiteUrl()}.`,
    html: shell(
      "Account approved",
      `<p>Hello ${escapeHtml(name)},</p>
       <p>Your Tasheel Legal account has been <strong style="color:#86EFAC;">approved</strong>. You can now access the marketplace programs.</p>
       <p style="margin-top:24px;">
         <a href="${getSiteUrl()}" style="display:inline-block;background:#C5A880;color:#070D19;padding:12px 22px;text-decoration:none;font-weight:bold;letter-spacing:1px;font-size:12px;text-transform:uppercase;">Open Tasheel Legal</a>
       </p>`,
    ),
  });
}

export function sendRejectedEmail(
  to: string,
  fullName: string | null,
  reason?: string | null,
): Promise<EmailResult> {
  const name = fullName || "there";
  return sendEmail({
    to,
    subject: "Update on your Tasheel Legal account request",
    text: `Hello ${name}, your Tasheel Legal account request was not approved at this time.${reason ? ` Reason: ${reason}` : ""}`,
    html: shell(
      "Account request update",
      `<p>Hello ${escapeHtml(name)},</p>
       <p>Your Tasheel Legal account request was <strong style="color:#FCA5A5;">not approved</strong> at this time.</p>
       ${reason ? `<p style="color:#9CA3AF;">Reason: ${escapeHtml(reason)}</p>` : ""}
       <p>If you believe this was a mistake, please reply to this email so our team can review your case.</p>`,
    ),
  });
}

export function sendStatementRequestEmail(
  to: string,
  fullName: string | null,
  statementUrl: string,
  expiresAt: string,
): Promise<EmailResult> {
  const name = fullName || "there";
  const expiry = new Date(expiresAt).toUTCString();
  return sendEmail({
    to,
    subject: "Action required: complete your Tasheel Legal verification",
    text: `Hello ${name}, please complete the problem statement form to continue your Tasheel Legal verification: ${statementUrl} (link expires ${expiry}).`,
    html: shell(
      "Complete your verification",
      `<p>Hello ${escapeHtml(name)},</p>
       <p>To continue reviewing your Tasheel Legal account, please complete a short problem statement form. This helps our team understand your matter before granting marketplace access.</p>
       <p style="margin-top:24px;">
         <a href="${statementUrl}" style="display:inline-block;background:#C5A880;color:#070D19;padding:12px 22px;text-decoration:none;font-weight:bold;letter-spacing:1px;font-size:12px;text-transform:uppercase;">Complete the form</a>
       </p>
       <p style="margin-top:20px;color:#9CA3AF;font-size:12px;">Or copy this link into your browser:<br><span style="color:#C5A880;word-break:break-all;">${statementUrl}</span></p>
       <p style="color:#9CA3AF;font-size:12px;">This link expires on ${expiry}.</p>`,
    ),
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
