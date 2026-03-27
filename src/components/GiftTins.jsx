import { useInView } from '../hooks/useInView'

const base = import.meta.env.BASE_URL

export default function GiftTins() {
  const [ref, visible] = useInView()

  return (
    <section id="gift-tins" ref={ref} className="py-20 md:py-28 px-6 bg-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Image side */}
        <div className={`slide-left ${visible ? 'visible' : ''}`}>
          <div
            className="aspect-square rounded-3xl flex items-center justify-center overflow-hidden"
            style={{ background: 'var(--yellow-50)' }}
          >
            {/* Grid of snack images to simulate a gift tin */}
            <div className="grid grid-cols-2 gap-4 p-8 w-full h-full">
              <div className="flex items-center justify-center rounded-2xl p-4" style={{ background: 'var(--red-50)' }}>
                <img src={`${base}images/hero/ice gems.png`} alt="Iced Gems" className="w-full h-full object-contain" loading="lazy" />
              </div>
              <div className="flex items-center justify-center rounded-2xl p-4" style={{ background: 'var(--red-50)' }}>
                <img src={`${base}images/hero/pineapple tart.png`} alt="Pineapple Tart" className="w-full h-full object-contain" loading="lazy" />
              </div>
              <div className="flex items-center justify-center rounded-2xl p-4" style={{ background: 'var(--red-50)' }}>
                <img src={`${base}images/hero/chocolate wafer.png`} alt="Chocolate Wafers" className="w-full h-full object-contain" loading="lazy" />
              </div>
              <div className="flex items-center justify-center rounded-2xl p-4" style={{ background: 'var(--red-50)' }}>
                <img src={`${base}images/hero/oreo.png`} alt="Oreo" className="w-full h-full object-contain" loading="lazy" />
              </div>
            </div>
          </div>
        </div>

        {/* Content side */}
        <div className={`slide-right ${visible ? 'visible' : ''}`}>
          <span className="text-sm font-bold uppercase tracking-widest text-[var(--red-500)]">
            Perfect for Gifting
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl text-[var(--red-900)]">
            Build Your Own Tin
          </h2>
          <p className="mt-5 text-base md:text-lg text-[var(--red-800)] leading-relaxed">
            Choose up to 4 of your favourite flavours in a single tin. From $30 — perfect for
            birthdays, Chinese New Year, Hari Raya, or just because you miss the old days.
          </p>

          {/* Mini features */}
          <div className="flex flex-wrap gap-4 mt-6">
            {['4 flavours per tin', 'From $30', 'Free delivery over $50'].map((feat) => (
              <span
                key={feat}
                className="px-4 py-2 rounded-full text-sm font-medium"
                style={{ background: 'var(--yellow-50)', color: 'var(--red-800)' }}
              >
                {feat}
              </span>
            ))}
          </div>

          <a
            href="#"
            className="inline-block mt-8 px-8 py-3 rounded-full text-white font-semibold bg-[var(--red-500)] hover:bg-[var(--red-600)] transition-colors"
          >
            Build a Gift Tin &rarr;
          </a>
        </div>
      </div>
    </section>
  )
}
