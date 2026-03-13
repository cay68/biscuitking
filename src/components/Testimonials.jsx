import { useInView } from '../hooks/useInView'

const reviews = [
  {
    quote: "Stepping into Biscuit King is like walking back into your sweetest childhood days.",
    source: 'TripAdvisor Review',
  },
  {
    quote: "Their pineapple jam biscuits are old-fashioned goodness. A tub for $5.50 — what a steal!",
    source: 'Burpple Review',
  },
  {
    quote: "This is the go-to place for good biscuits to give people. Old school biscuits, no more 'old school'.",
    source: 'Foursquare Review',
  },
]

export default function Testimonials() {
  const [ref, visible] = useInView()

  return (
    <section ref={ref} style={{ background: 'var(--off-white)', padding: '60px 48px' }}>
      <div className="max-w-6xl mx-auto">
        <h2
          className={`text-4xl md:text-5xl text-center text-[var(--black)] mb-16 fade-up ${visible ? 'visible' : ''}`}
        >
          What People Say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <div
              key={i}
              className={`relative bg-[var(--white)] rounded-2xl p-8 fade-up ${visible ? 'visible' : ''}`}
              style={{
                transitionDelay: `${0.15 + i * 0.15}s`,
                boxShadow: '0 2px 20px var(--card-shadow)',
              }}
            >
              {/* Decorative quote mark */}
              <span
                className="absolute top-4 left-6 text-6xl leading-none font-serif select-none"
                style={{ color: 'var(--red-200)' }}
              >
                &ldquo;
              </span>

              <p className="relative mt-8 text-base text-[var(--black)] leading-relaxed italic">
                {r.quote}
              </p>

              <p className="mt-5 text-sm font-medium" style={{ color: 'var(--muted)' }}>
                — {r.source}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
