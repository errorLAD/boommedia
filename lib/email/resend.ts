import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.EMAIL_FROM || 'noreply@boommedia.in'
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'BoomMedia'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export async function sendVerificationEmail(
  email: string,
  name: string,
  token: string
) {
  const verifyUrl = `${APP_URL}/verify-email?token=${token}`
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Verify your ${APP_NAME} account`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;">
        <h2 style="color:#7c3aed;">Welcome to ${APP_NAME}!</h2>
        <p>Hi ${name},</p>
        <p>Please verify your email address by clicking the button below:</p>
        <a href="${verifyUrl}" style="display:inline-block;padding:12px 24px;background:#7c3aed;color:white;text-decoration:none;border-radius:8px;font-weight:600;margin:16px 0;">
          Verify Email
        </a>
        <p style="color:#666;margin-top:24px;">This link expires in 24 hours.</p>
        <p style="color:#666;">If you did not create an account, you can safely ignore this email.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:32px 0;" />
        <p style="color:#999;font-size:12px;">© ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
      </div>
    `,
  })
}

export async function sendPasswordResetEmail(
  email: string,
  name: string,
  token: string
) {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Reset your ${APP_NAME} password`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;">
        <h2 style="color:#7c3aed;">${APP_NAME} Password Reset</h2>
        <p>Hi ${name},</p>
        <p>Click below to reset your password. This link expires in 1 hour.</p>
        <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#7c3aed;color:white;text-decoration:none;border-radius:8px;font-weight:600;margin:16px 0;">
          Reset Password
        </a>
        <p style="color:#666;margin-top:24px;">If you didn't request a password reset, ignore this email.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:32px 0;" />
        <p style="color:#999;font-size:12px;">© ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
      </div>
    `,
  })
}

export async function sendNotificationEmail(
  email: string,
  title: string,
  body: string,
  actionUrl?: string
) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `${title} — ${APP_NAME}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;">
        <h2 style="color:#7c3aed;">${title}</h2>
        <p>${body}</p>
        ${
          actionUrl
            ? `<a href="${actionUrl}" style="display:inline-block;padding:12px 24px;background:#7c3aed;color:white;text-decoration:none;border-radius:8px;font-weight:600;margin:16px 0;">View Details</a>`
            : ''
        }
        <hr style="border:none;border-top:1px solid #eee;margin:32px 0;" />
        <p style="color:#666;margin-top:24px;">— The ${APP_NAME} Team</p>
        <p style="color:#999;font-size:12px;">© ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
      </div>
    `,
  })
}

export async function sendCampaignInviteEmail(
  email: string,
  name: string,
  campaignTitle: string,
  brandName: string,
  inviteUrl: string
) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `You've been invited to join "${campaignTitle}" — ${APP_NAME}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;">
        <h2 style="color:#7c3aed;">Campaign Invitation</h2>
        <p>Hi ${name},</p>
        <p><strong>${brandName}</strong> has invited you to collaborate on their campaign:</p>
        <div style="background:#f5f3ff;border-left:4px solid #7c3aed;padding:16px;border-radius:4px;margin:16px 0;">
          <strong>${campaignTitle}</strong>
        </div>
        <p>Click below to review the campaign details and accept or decline the invitation.</p>
        <a href="${inviteUrl}" style="display:inline-block;padding:12px 24px;background:#7c3aed;color:white;text-decoration:none;border-radius:8px;font-weight:600;margin:16px 0;">
          View Invitation
        </a>
        <hr style="border:none;border-top:1px solid #eee;margin:32px 0;" />
        <p style="color:#999;font-size:12px;">© ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
      </div>
    `,
  })
}

export async function sendApplicationStatusEmail(
  email: string,
  name: string,
  campaignTitle: string,
  status: 'ACCEPTED' | 'REJECTED',
  dashboardUrl: string,
  notes?: string
) {
  const isAccepted = status === 'ACCEPTED'
  const statusColor = isAccepted ? '#059669' : '#dc2626'
  const statusText = isAccepted ? 'Accepted 🎉' : 'Not Selected'
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Your application for "${campaignTitle}" was ${isAccepted ? 'accepted' : 'not selected'} — ${APP_NAME}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;">
        <h2 style="color:${statusColor};">Application ${statusText}</h2>
        <p>Hi ${name},</p>
        <p>Your application for the campaign <strong>${campaignTitle}</strong> has been reviewed.</p>
        ${
          isAccepted
            ? `<p>Congratulations! You have been selected to collaborate. Log in to your dashboard to get started.</p>`
            : `<p>Unfortunately, your application was not selected for this campaign. Keep applying — there are many more opportunities!</p>`
        }
        ${notes ? `<div style="background:#f9fafb;border:1px solid #e5e7eb;padding:16px;border-radius:4px;margin:16px 0;"><strong>Brand Notes:</strong><br/>${notes}</div>` : ''}
        <a href="${dashboardUrl}" style="display:inline-block;padding:12px 24px;background:#7c3aed;color:white;text-decoration:none;border-radius:8px;font-weight:600;margin:16px 0;">
          Go to Dashboard
        </a>
        <hr style="border:none;border-top:1px solid #eee;margin:32px 0;" />
        <p style="color:#999;font-size:12px;">© ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
      </div>
    `,
  })
}
