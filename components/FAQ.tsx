import { AnimateIn } from './AnimateIn'

export const FAQ_ITEMS = [
  {
    question: 'What is Fit Flour?',
    answer:
      'Fit Flour is a high-protein, low-carb flour alternative designed for people who want to bake healthier without giving up the foods they love. It works as a 1-to-1 substitute for regular all-purpose flour.',
  },
  {
    question: 'What is Fit Flour made from?',
    answer:
      'Fit Flour is crafted from a blend of protein-rich, whole-food ingredients that replace refined wheat flour. The formula is gluten-free, dairy-free, and nut-free — built for real food without the allergens or empty carbs.',
  },
  {
    question: 'How is Fit Flour different from regular flour?',
    answer:
      'Unlike all-purpose flour, Fit Flour is packed with protein, lower in net carbs, and free from gluten. It delivers the same baking results — same texture, same rise, same taste — but with a macro profile that actually supports your health goals.',
  },
  {
    question: 'Can I use Fit Flour as a 1-to-1 substitute?',
    answer:
      'Yes. Fit Flour swaps cup-for-cup with traditional flour in virtually any recipe — breads, muffins, pancakes, cookies, and more. No math, no adjustments, no failed bakes.',
  },
  {
    question: 'How much protein does Fit Flour have?',
    answer:
      'Fit Flour delivers significantly more protein per serving than conventional all-purpose flour — making it ideal for athletes, macro trackers, or anyone looking to eat more protein without changing their favorite recipes.',
  },
  {
    question: 'Is Fit Flour gluten-free?',
    answer:
      'Yes. Fit Flour is completely gluten-free, making it a safe and effective baking flour for those with celiac disease, gluten sensitivity, or anyone following a gluten-free lifestyle.',
  },
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
}

export function FAQ() {
  return (
    <section className="bg-paper py-20 md:py-28 px-6" aria-labelledby="faq-heading">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="max-w-content mx-auto">
        <AnimateIn animation="fade" className="text-center mb-14">
          <h2
            id="faq-heading"
            className="font-display text-4xl md:text-5xl uppercase text-ink tracking-tight"
          >
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-muted mt-3">Everything you need to know about Fit Flour.</p>
        </AnimateIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-14 max-w-5xl mx-auto">
          {FAQ_ITEMS.map((item, i) => (
            <AnimateIn key={i} animation="up" delay={i * 60} className="border-t border-line py-6">
              <h3 className="text-sm font-bold text-ink leading-snug mb-3">{item.question}</h3>
              <p className="text-sm text-muted leading-relaxed">{item.answer}</p>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  )
}
