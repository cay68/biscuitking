import { useInView } from '../hooks/useInView'

const base = import.meta.env.BASE_URL

const products = [
  { name: 'Iced Gems', category: 'Biscuits', price: 3.50, era: '80s', img: `${base}images/hero/ice gems.png` },
  { name: 'Pineapple Tarts', category: 'Biscuits', price: 5.50, era: '80s', img: `${base}images/hero/pineapple tart.png` },
  { name: 'Chocolate Wafers', category: 'Biscuits', price: 4.00, era: '90s', img: `${base}images/hero/chocolate wafer.png` },
  { name: 'Oreo', category: 'Biscuits', price: 3.80, era: '90s', img: `${base}images/hero/oreo.png` },
  { name: 'Iced Gems', category: 'Biscuits', price: 3.50, era: '80s', img: `${base}images/hero/ice gems.png` },
  { name: 'Pineapple Tarts', category: 'Biscuits', price: 5.50, era: '80s', img: `${base}images/hero/pineapple tart.png` },
]

export default function FeaturedProducts() {
  const [ref, visible] = useInView()

  return (
    <section
      id="featured"
      ref={ref}
      className="py-20 md:py-28 px-6"
      style={{ background: 'var(--yellow-50)' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className={`text-center mb-12 fade-up ${visible ? 'visible' : ''}`}>
          <h2 className="text-4xl md:text-5xl text-[var(--red-900)]">The Classics</h2>
          <p className="mt-3 text-lg text-[var(--red-700)]">The snacks that defined a generation</p>
        </div>

        {/* Horizontal scroll */}
        <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
          {products.map((p, i) => (
            <div
              key={i}
              className={`fade-up shrink-0 w-64 md:w-72 snap-start bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer group ${visible ? 'visible' : ''}`}
              style={{
                transitionDelay: `${0.1 + i * 0.1}s`,
                boxShadow: '0 2px 20px var(--card-shadow)',
              }}
            >
              {/* Image */}
              <div className="aspect-square flex items-center justify-center p-6" style={{ background: 'var(--yellow-50)' }}>
                <img
                  src={p.img}
                  alt={p.name}
                  className="w-3/4 h-3/4 object-contain transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wide text-[var(--red-500)]">{p.category}</span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: 'var(--red-50)', color: 'var(--red-700)' }}
                  >
                    {p.era}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[var(--red-900)]">{p.name}</h3>
                <p className="text-sm text-[var(--red-700)] mt-1">From ${p.price.toFixed(2)}</p>
                <button className="mt-3 w-full py-2 rounded-lg text-sm font-semibold text-white bg-[var(--red-500)] hover:bg-[var(--red-600)] transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View all link */}
        <div className={`text-center mt-10 fade-up ${visible ? 'visible' : ''}`} style={{ transitionDelay: '0.5s' }}>
          <a href="/shop" className="text-[var(--red-500)] hover:text-[var(--red-600)] font-semibold transition-colors">
            View All Products &rarr;
          </a>
        </div>
      </div>
    </section>
  )
}
