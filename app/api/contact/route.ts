import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

const smtpEnv = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"]
const oauthEnv = ["SMTP_OAUTH_CLIENT_ID", "SMTP_OAUTH_CLIENT_SECRET", "SMTP_OAUTH_REFRESH_TOKEN", "SMTP_USER"]
const baseEnv = ["EMAIL_FROM", "EMAIL_TO"]

function validateEnv() {
  const hasSmtp = smtpEnv.every((key) => !!process.env[key])
  const hasOAuth = oauthEnv.every((key) => !!process.env[key])
  const missingBase = baseEnv.filter((key) => !process.env[key])

  if (missingBase.length) {
    throw new Error(`Missing environment variables: ${missingBase.join(", ")}`)
  }

  if (!hasSmtp && !hasOAuth) {
    throw new Error("Missing mail transport configuration. Provide SMTP_* or SMTP_OAUTH_* variables.")
  }
}

export async function POST(req: Request) {
  try {
    validateEnv()

    const { name, email, subject, category, message } = await req.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Please fill out all required fields." }, { status: 400 })
    }

    const target = process.env.EMAIL_TO
    if (!target) {
      throw new Error("EMAIL_TO not configured")
    }

    const useOAuth =
      process.env.SMTP_OAUTH_CLIENT_ID &&
      process.env.SMTP_OAUTH_CLIENT_SECRET &&
      process.env.SMTP_OAUTH_REFRESH_TOKEN &&
      process.env.SMTP_USER

    const transporter = useOAuth
      ? nodemailer.createTransport({
          service: "gmail",
          auth: {
            type: "OAuth2",
            user: process.env.SMTP_USER,
            clientId: process.env.SMTP_OAUTH_CLIENT_ID,
            clientSecret: process.env.SMTP_OAUTH_CLIENT_SECRET,
            refreshToken: process.env.SMTP_OAUTH_REFRESH_TOKEN,
            accessToken: process.env.SMTP_OAUTH_ACCESS_TOKEN, // optional; refresh token is primary
          },
        })
      : nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          secure: String(process.env.SMTP_SECURE || "").toLowerCase() === "true",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        })

    const textBody = `
From: ${name} <${email}>
Category: ${category || "not specified"}
Subject: ${subject}

${message}
`

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      replyTo: email,
      subject: `[Contact] ${subject}`,
      text: textBody.trim(),
    })

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Unable to send message right now." }, { status: 500 })
  }
}
