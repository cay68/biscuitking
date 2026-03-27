import { useEffect, useState } from 'react'

const base = import.meta.env.BASE_URL

const heroImages = [
  { src: `${base}images/hero/heart_shape_butter_cookie.png`, alt: 'Heart Shape Butter Cookie', top: '24%', left: '22%', rotate: -12, size: 'w-20 md:w-28', zIndex: 11 },
  { src: `${base}images/hero/ice gems.png`, alt: 'Iced Gems', top: '10%', left: '6%', rotate: -5, size: 'w-28 md:w-40' },
  { src: `${base}images/hero/chocolate wafer.png`, alt: 'Chocolate Wafers', top: '8%', right: '5%', rotate: 4, size: 'w-32 md:w-44' },
  { src: `${base}images/hero/pineapple tart.png`, alt: 'Pineapple Tart', bottom: '20%', left: '10%', rotate: 3, size: 'w-24 md:w-36' },
  { src: `${base}images/hero/oreo.png`, alt: 'Oreo', bottom: '18%', right: '8%', rotate: -4, size: 'w-24 md:w-32' },
]

export default function Hero() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <section
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: 'var(--off-white)' }}
    >
      {/* Floating snack images */}
      {heroImages.map((img, i) => (
        <img
          key={i}
          src={img.src}
          alt={img.alt}
          className={`absolute ${img.size} pop-in select-none pointer-events-none ${loaded ? 'visible' : ''}`}
          style={{
            top: img.top,
            left: img.left,
            right: img.right,
            bottom: img.bottom,
            rotate: `${img.rotate}deg`,
            zIndex: img.zIndex || 1,
            transitionDelay: `${0.3 + i * 0.25}s`,
          }}
          loading="eager"
        />
      ))}

      {/* Center content — "Biscuit" over "King" like Prept inspo */}
      <div className="relative z-10 text-center px-4">
        <h1
          className={`fade-up ${loaded ? 'visible' : ''}`}
          style={{ transitionDelay: '0s', lineHeight: 0.9 }}
        >
          <span
            className="block text-[var(--black)]"
            style={{ fontSize: 'clamp(4rem, 14vw, 12rem)', fontFamily: '"Playfair Display", serif', fontWeight: 400 }}
          >
            Biscuit
          </span>
          <span
            className="block text-[var(--red-400)]"
            style={{ fontSize: 'clamp(3.5rem, 12vw, 10rem)', fontFamily: '"Pacifico", cursive', fontWeight: 400, marginTop: '-0.35em', position: 'relative', zIndex: 1 }}
          >
            King
          </span>
        </h1>

        <p
          className={`mt-6 text-[var(--muted)] fade-up ${loaded ? 'visible' : ''}`}
          style={{ transitionDelay: '1.5s', fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', fontFamily: '"DM Sans", sans-serif' }}
        >
          Where Freshness Is Guaranteed
        </p>
      </div>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-10 left-1/2 -translate-x-1/2 fade-in ${loaded ? 'visible' : ''}`}
        style={{ transitionDelay: '2s' }}
      >
        <div className="bounce-down text-[var(--red-400)]">
          <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 5v14M19 12l-7 7-7-7"/>
          </svg>
        </div>
      </div>
    </section>
  )
}
