import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Fit Flour — questions about your order, wholesale inquiries, or just want to say hi.',
  openGraph: {
    title: 'Contact | Fit Flour',
    description: 'Reach out to Fit Flour for order support, wholesale, or anything else.',
  },
}

export default function ContactPage() {
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

          {/* Form */}
          <form
            name="contact"
            className="flex flex-col gap-5"
            action="mailto:hello@fitflour.shop"
            method="get"
            encType="text/plain"
          >
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-ink">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
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
                className="bg-white border border-line px-4 py-3 text-sm text-ink focus:outline-none focus:border-teal transition-colors"
              >
                <option value="Order question">Order question</option>
                <option value="Product question">Product question</option>
                <option value="Wholesale inquiry">Wholesale inquiry</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-ink">
                Message
              </label>
              <textarea
                id="message"
                name="body"
                required
                rows={5}
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
