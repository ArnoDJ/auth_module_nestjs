import { User } from "../entities"
import { EmailTemplate } from "../types/emailTemplate"

export const passwordResetEmailTemplate = (
  user: User,
  resetUrl: string,
): EmailTemplate => {
  const subject = "Reset your password"

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Password reset</title>
    </head>
    <body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, Helvetica, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding:24px 0;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background-color:#ffffff; border-radius:6px; overflow:hidden;">

              <tr>
                <td style="padding:24px 32px; border-bottom:1px solid #e5e7eb;">
                  <h1 style="margin:0; font-size:20px; color:#111827;">
                    Password reset
                  </h1>
                </td>
              </tr>

              <tr>
                <td style="padding:32px;">
                  <p style="margin:0 0 16px; font-size:14px; color:#374151;">
                    Hi ${user.firstName},
                  </p>

                  <p style="margin:0 0 16px; font-size:14px; color:#374151;">
                    We received a request to reset your password. Click the button below to choose a new one.
                  </p>

                  <table cellpadding="0" cellspacing="0" style="margin:24px 0;">
                    <tr>
                      <td align="center">
                        <a
                          href="${resetUrl}"
                          style="
                            display:inline-block;
                            padding:12px 20px;
                            background-color:#2563eb;
                            color:#ffffff;
                            text-decoration:none;
                            font-size:14px;
                            font-weight:bold;
                            border-radius:4px;
                          "
                        >
                          Reset password
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="margin:0 0 16px; font-size:13px; color:#6b7280;">
                    This link is valid for 10 minutes. If you didn’t request a password reset, you can safely ignore this email.
                  </p>

                  <p style="margin:0; font-size:13px; color:#6b7280;">
                    If the button doesn’t work, copy and paste this link into your browser:
                    <br />
                    <a href="${resetUrl}" style="color:#2563eb; word-break:break-all;">
                      ${resetUrl}
                    </a>
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding:24px 32px; background-color:#f9fafb; font-size:12px; color:#9ca3af;">
                  This email was sent automatically. Please do not reply.
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `

  const text = `
    Hi ${user.firstName},

    We received a request to reset your password.

    Use the link below to choose a new one (valid for 10 minutes):
    ${resetUrl}

    If you didn’t request this, you can safely ignore this email.
  `

  return {
    subject,
    html,
    text,
  }
}
