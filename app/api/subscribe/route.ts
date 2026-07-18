import { NextResponse } from 'next/server'

const DISCOUNT_CODE = process.env.WELCOME_DISCOUNT_CODE ?? 'WELCOME10'
const WIX_API_KEY = process.env.WIX_API_KEY ?? ''
const WIX_SITE_ID = process.env.WIX_SITE_ID ?? ''

const HEADERS = {
  'Content-Type': 'application/json',
  Authorization: WIX_API_KEY,
  'wix-site-id': WIX_SITE_ID,
}

// Step 1: Create/upsert the contact, returns the contactId
async function upsertContact(email: string): Promise<string | null> {
  const res = await fetch('https://www.wixapis.com/contacts/v4/contacts', {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({
      info: {
        emails: {
          items: [{ email, tag: 'MAIN' }],
        },
        labelKeys: {
          items: ['custom.popup-lead'],
        },
      },
    }),
  })

  if (res.status === 409) {
    // Contact already exists — fetch their ID by email
    const search = await fetch('https://www.wixapis.com/contacts/v4/contacts/query', {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({
        query: {
          filter: JSON.stringify({ 'info.emails.email': { $eq: email } }),
          paging: { limit: 1 },
        },
      }),
    })
    const data = await search.json()
    return data?.contacts?.[0]?.id ?? null
  }

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Wix create contact error ${res.status}: ${body}`)
  }

  const data = await res.json()
  return data?.contact?.id ?? null
}

// Step 2: Mark the contact as SUBSCRIBED for email marketing
async function subscribeContact(contactId: string): Promise<void> {
  await fetch(
    `https://www.wixapis.com/email-subscriptions/v1/subscription/${contactId}`,
    {
      method: 'PUT',
      headers: HEADERS,
      body: JSON.stringify({ subscriptionStatus: 'SUBSCRIBED' }),
    }
  )
  // Best-effort — don't throw if this fails
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const email: unknown = body?.email

    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const contactId = await upsertContact(email)
    if (contactId) {
      await subscribeContact(contactId)
    }

    console.log(`[EMAIL_LEAD] ${new Date().toISOString()} | ${email} | contactId: ${contactId}`)

    return NextResponse.json({ code: DISCOUNT_CODE })
  } catch (err) {
    console.error('[SUBSCRIBE_ERROR]', err)
    // Never block the user — show the code regardless
    return NextResponse.json({ code: DISCOUNT_CODE })
  }
}
