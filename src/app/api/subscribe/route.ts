import { NextResponse } from 'next/server'

import { writeClient } from '@/sanity/client'

export const runtime = 'nodejs'

/** Deliberately permissive: real validation is the provider's confirmation email. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function reply(status: number, message: string) {
  return NextResponse.json({ message }, { status })
}

/**
 * Newsletter sign-up.
 *
 * Buttondown is used when a key is present; otherwise the address is stored in
 * Sanity so nothing is lost before a mailing provider is chosen. With neither
 * configured we say so plainly rather than pretending it worked.
 */
export async function POST(request: Request) {
  let email: unknown
  try {
    ;({ email } = await request.json())
  } catch {
    return reply(400, 'Could not read that request.')
  }

  if (typeof email !== 'string' || !EMAIL.test(email.trim())) {
    return reply(400, 'That does not look like an email address.')
  }

  const address = email.trim().toLowerCase()
  const buttondownKey = process.env.BUTTONDOWN_API_KEY

  if (buttondownKey) {
    try {
      const response = await fetch('https://api.buttondown.email/v1/subscribers', {
        method: 'POST',
        headers: {
          Authorization: `Token ${buttondownKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email_address: address }),
      })

      if (response.status === 201 || response.status === 200) {
        return reply(200, 'Welcome. Look for the next Lord’s Day letter.')
      }
      // Buttondown returns 400 for an address that is already on the list.
      if (response.status === 400) {
        return reply(200, 'You are already on the list. Grace and peace.')
      }

      console.error('[subscribe] buttondown responded', response.status)
      return reply(502, 'The letter list is not answering. Please try again later.')
    } catch (error) {
      console.error('[subscribe] buttondown request failed:', error)
      return reply(502, 'The letter list is not answering. Please try again later.')
    }
  }

  const sanity = writeClient()
  if (sanity) {
    try {
      // A deterministic id makes a repeat sign-up a no-op rather than a duplicate.
      const id = `subscriber.${Buffer.from(address).toString('hex').slice(0, 40)}`
      await sanity.createIfNotExists({
        _id: id,
        _type: 'subscriber',
        email: address,
        subscribedAt: new Date().toISOString(),
        source: 'website',
      })
      return reply(200, 'Welcome. Look for the next Lord’s Day letter.')
    } catch (error) {
      console.error('[subscribe] sanity write failed:', error)
      return reply(502, 'Could not save that just now. Please try again later.')
    }
  }

  return reply(
    503,
    'Subscriptions are not switched on yet. Please check back shortly.',
  )
}
