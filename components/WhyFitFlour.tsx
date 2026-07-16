import { AnimateIn } from './AnimateIn'

const BENEFITS = [
  {
    stat: '1:1',
    label: 'SWAP',
    description: 'Replace all-purpose flour cup for cup in any recipe. No math, no adjustments, no failed bakes.',
  },
  {
    stat: '6X',
    label: 'PROTEIN',
    description: 'Serious protein in every bake. Hit your macros without changing the recipes you love.',
  },
  {
    stat: '⅓',
    label: 'THE CARBS',
    description: 'Same recipes, a third of the carbs. Bake smarter without sacrificing taste or texture.',
  },
]

export function WhyFitFlour() {
  return (
    <section className="bg-white py-20 md:py-28 px-6" aria-labelledby="why-ff-heading">
      <div className="max-w-content mx-auto">
        <AnimateIn animation="fade" className="text-center mb-16">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-muted mb-3">
            The Difference
          </p>
          <h2
            id="why-ff-heading"
            className="font-display text-4xl md:text-5xl uppercase text-ink tracking-tight"
          >
            Why Fit Flour?
          </h2>
        </AnimateIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {BENEFITS.map((b, i) => (
            <AnimateIn key={b.stat} animation="up" delay={i * 120} className="flex flex-col items-center text-center gap-3">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-5xl md:text-6xl text-ink leading-none">
                  {b.stat}
                </span>
                <span className="font-display text-2xl text-teal leading-none">{b.label}</span>
              </div>
              <p className="text-sm text-muted leading-relaxed max-w-xs">{b.description}</p>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  )
}
