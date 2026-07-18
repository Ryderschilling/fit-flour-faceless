import { NextResponse } from 'next/server'

const DISCOUNT_CODE = process.env.WELCOME_DISCOUNT_CODE ?? 'WELCOME10'
const WIX_API_KEY = process.env.WIX_API_KEY ?? ''
const WIX_SITE_ID = process.env.WIX_SITE_ID ?? ''
const WIX_CONTACTS_URL = 'https://www.wixapis.com/contacts/v4/contacts'

async function upsertWixContact(email: string): Promise<void> {
  const res = await fetch(WIX_CONTACTS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: WIX_API_KEY,
      'wix-site-id': WIX_SITE_ID,
    },
    body: JSON.stringify({
      info: {
        emails: {
          items: [{ email, tag: 'MAIN' }],
        },
        extendedFields: {
          items: {
            // Marks them as subscribed to marketing emails in Wix
            'emailSubscriptions.subscriptionStatus': 'SUBSCRIBED',
            // Custom label so you can filter these leads in Wix Contacts
            'emailSubscriptions.effectiveEmail': email,
          },
        },
        labelKeys: {
          // Tags this contact as a popup lead — visible in Wix Contacts filters
          items: ['custom.popup-lead'],
        },
      },
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    // 409 = contact already exists — that's fine, not a real error
    if (res.status !== 409) {
      throw new Error(`Wix Contacts API error ${res.status}: ${body}`)
    }
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const email: unknown = body?.email

    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    // Send to Wix Contacts (shows up in Customers & Leads → Contacts)
    await upsertWixContact(email)

    console.log(`[EMAIL_LEAD] ${new Date().toISOString()} | ${email}`)

    return NextResponse.json({ code: DISCOUNT_CODE })
  } catch (err) {
    console.error('[SUBSCRIBE_ERROR]', err)
    // Still return the code — don't block the user if Wix API is down
    return NextResponse.json({ code: DISCOUNT_CODE })
  }
}
