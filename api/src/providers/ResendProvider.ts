// Author: TrungQuanDev: https://youtube.com/@trungquandev
import { Resend } from 'resend'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const ADMIN_SENDER_EMAIL = process.env.ADMIN_SENDER_EMAIL

const resend = new Resend(RESEND_API_KEY)

interface SendEmailParams {
  to: string
  subject: string
  html: string
}

const sendEmail = async ({ to, subject, html }: SendEmailParams) => {
  try {
    await resend.emails.send({
      from: ADMIN_SENDER_EMAIL!,
      to,
      subject,
      html,
    })
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

export const ResendProvider = {
  sendEmail,
}
