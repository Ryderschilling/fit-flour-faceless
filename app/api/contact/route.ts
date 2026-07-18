import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.error('Contact route: RESEND_API_KEY is not configured')
      return NextResponse.json({ error: 'Email service not configured' }, { status: 503 })
    }
    const resend = new Resend(apiKey)

    const { name, email, subject, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { error } = await resend.emails.send({
      from: 'Fit Flour <noreply@fitflour.shop>',
      to: 'hello@fitflour.shop',
      replyTo: email,
      subject: `[Contact] ${subject} — ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a1a; border-bottom: 2px solid #2d6a4f; padding-bottom: 8px;">New Contact Form Submission</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; width: 100px;">Name</td>
              <td style="padding: 8px 0; color: #1a1a1a;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em;">Email</td>
              <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #2d6a4f;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em;">Subject</td>
              <td style="padding: 8px 0; color: #1a1a1a;">${subject}</td>
            </tr>
          </table>
          <div style="margin-top: 24px; padding: 16px; background: #f5f0eb; border-left: 3px solid #2d6a4f;">
            <p style="margin: 0; color: #666; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">Message</p>
            <p style="margin: 0; color: #1a1a1a; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          <p style="margin-top: 24px; color: #999; font-size: 12px;">Reply directly to this email to respond to ${name}.</p>
        </div>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact route error:', err)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
