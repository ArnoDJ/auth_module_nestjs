import { UserDto } from "../dto/user.dto"
import { EmailTemplate } from "../types/emailTemplate"

export const emailVerificationTemplate = (
  user: UserDto,
  verifyUrl: string,
): EmailTemplate => {
  const subject = "Verify your email address"

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Email verification</title>
    </head>
    <body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, Helvetica, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding:24px 0;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background-color:#ffffff; border-radius:6px; overflow:hidden;">

              <!-- Header -->
              <tr>
                <td style="padding:24px 32px; border-bottom:1px solid #e5e7eb;">
                  <h1 style="margin:0; font-size:20px; color:#111827;">
                    Verify your email
                  </h1>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:32px;">
                  <p style="margin:0 0 16px; font-size:14px; color:#374151;">
                    Hi ${user.firstName},
                  </p>

                  <p style="margin:0 0 16px; font-size:14px; color:#374151;">
                    Thanks for signing up. Please confirm your email address by clicking the button below.
                  </p>

                  <!-- Button -->
                  <table cellpadding="0" cellspacing="0" style="margin:24px 0;">
                    <tr>
                      <td align="center">
                        <a
                          href="${verifyUrl}"
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
                          Verify email
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="margin:0 0 16px; font-size:13px; color:#6b7280;">
                    This link is valid for 24 hours. If you didn’t create this account, you can safely ignore this email.
                  </p>

                  <p style="margin:0; font-size:13px; color:#6b7280;">
                    If the button doesn’t work, copy and paste this link into your browser:
                    <br />
                    <a href="${verifyUrl}" style="color:#2563eb; word-break:break-all;">
                      ${verifyUrl}
                    </a>
                  </p>
                </td>
              </tr>

              <!-- Footer -->
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

    Thanks for signing up.

    Please verify your email address using the link below (valid for 24 hours):
    ${verifyUrl}

    If you didn’t create this account, you can safely ignore this email.
  `

  return {
    subject,
    html,
    text,
  }
}
