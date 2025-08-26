import nodemailer from 'nodemailer'
import { logger } from './logger.js'

function makeTransport(){
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env
  if (SMTP_HOST && SMTP_USER) {
    return nodemailer.createTransport({ host: SMTP_HOST, port: Number(SMTP_PORT||587), secure: false, auth: { user: SMTP_USER, pass: SMTP_PASS } })
  }
  // fallback: log only
  return { sendMail: async (opts)=>{ logger.info({ mail_preview: opts }) } }
}

const transporter = makeTransport()

export async function sendMail({ to, subject, html }){
  const from = process.env.EMAIL_FROM || 'no-reply@musigram.local'
  await transporter.sendMail({ from, to, subject, html })
}
