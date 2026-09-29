'use client'

import { useState } from 'react'

type State = 'idle' | 'sending' | 'done' | 'error'

export function SubscribeForm({ title, dek }: { title: string; dek: string }) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<State>('idle')
  const [message, setMessage] = useState('')

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (state === 'sending') return

    setState('sending')
    setMessage('')

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = (await response.json()) as { message?: string }

      if (response.ok) {
        setState('done')
        setMessage(data.message ?? 'Welcome. Look for the next Lord’s Day letter.')
        setEmail('')
      } else {
        setState('error')
        setMessage(data.message ?? 'That did not go through. Please try again.')
      }
    } catch {
      setState('error')
      setMessage('No connection. Please try again.')
    }
  }

  return (
    <section className="subscribe" id="subscribe" aria-labelledby="subscribe-title">
      <h2 className="subscribe__title" id="subscribe-title">
        {title}
      </h2>
      <p className="subscribe__dek">{dek}</p>

      <form className="subscribe__form" onSubmit={onSubmit}>
        <label htmlFor="subscribe-email" className="skip-link">
          Your email address
        </label>
        <input
          id="subscribe-email"
          className="subscribe__input"
          type="email"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Your email address"
          autoComplete="email"
          required
          disabled={state === 'sending'}
        />
        <button className="subscribe__button" type="submit" disabled={state === 'sending'}>
          {state === 'sending' ? 'Sending…' : 'Subscribe'}
        </button>
      </form>

      <p
        className="subscribe__status"
        data-tone={state === 'error' ? 'error' : undefined}
        role="status"
        aria-live="polite"
      >
        {message}
      </p>
    </section>
  )
}
