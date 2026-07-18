'use client'

import { useState } from 'react'

const SUBJECTS = [
  'Order question',
  'Product question',
  'Wholesale inquiry',
  'Partner inquiry',
  'Other',
]

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: 'Order question',
    message: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const body = `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    const mailto = `mailto:hello@fitflour.shop?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailto
  }

  return (
    <div className="bg-paper min-h-screen">
      <div className="max-w-content mx-auto px-6 py-16 md:py-24">
        <div className="max-w-xl mx-auto">
          {/* Header */}
          <header className="text-center mb-12">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-muted mb-3">
              Get in Touch
            </p>
            <h1 className="font-display text-5xl md:text-6xl uppercase text-ink tracking-tight">
              Contact
            </h1>
            <p className="text-base text-muted mt-4 leading-relaxed">
              Questions about your order, wholesale, or just want to say hi? We respond within 24
              hours.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-ink">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                className="bg-white border border-line px-4 py-3 text-sm text-ink placeholder:text-muted focus:outline-none focus:border-teal transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-ink">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="bg-white border border-line px-4 py-3 text-sm text-ink placeholder:text-muted focus:outline-none focus:border-teal transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="subject" className="text-xs font-bold uppercase tracking-widest text-ink">
                Subject
              </label>
              <select
                id="subject"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className="bg-white border border-line px-4 py-3 text-sm text-ink focus:outline-none focus:border-teal transition-colors"
              >
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-ink">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={form.message}
                onChange={handleChange}
                placeholder="What's on your mind?"
                className="bg-white border border-line px-4 py-3 text-sm text-ink placeholder:text-muted focus:outline-none focus:border-teal transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="bg-teal text-paper text-sm font-bold uppercase tracking-widest py-4 hover:bg-teal2 transition-colors"
            >
              Send Message
            </button>
          </form>

          {/* Alternative */}
          <div className="mt-12 pt-8 border-t border-line text-center">
            <p className="text-sm text-muted">
              You can also reach us on Instagram{' '}
              <a
                href="https://www.instagram.com/fitflour"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal font-semibold hover:underline"
              >
                @fitflour
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
