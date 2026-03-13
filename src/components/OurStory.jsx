import { useRef, useEffect } from 'react'
import { useInView } from '../hooks/useInView'

export default function OurStory() {
  const [ref, visible] = useInView()
  const videoRef = useRef(null)

  useEffect(() => {
    if (visible && videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }, [visible])

  return (
    <section
      id="story"
      ref={ref}
      style={{ background: 'var(--red-50)', padding: '60px 48px' }}
    >
      <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
        {/* Header */}
        <div className={`fade-up ${visible ? 'visible' : ''}`} style={{ textAlign: 'center', marginBottom: 64 }}>
          <span style={{ display: 'block', fontSize: 14, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--red-500)', marginBottom: 16 }}>
            Our Story
          </span>
          <h2
            style={{ fontSize: 'clamp(1.4rem, 3vw, 2.2rem)', color: 'var(--black)', marginBottom: 24, textAlign: 'center', whiteSpace: 'nowrap' }}
          >
            Keeping Singapore&rsquo;s Snack Heritage Alive
          </h2>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.125rem)', color: 'var(--muted)', lineHeight: 1.7, maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
            Biscuit King is an old-school snack shop at 130 Casuarina Road, Upper Thomson.
            What started as a humble biscuit store has become one of Singapore&rsquo;s last
            remaining treasure troves of traditional treats — a place where iced gems,
            pineapple tarts, haw flakes, and love letters still sit proudly on shelves
            lined with classic biscuit tins.
          </p>
        </div>

        {/* Video */}
        <div
          className={`fade-up ${visible ? 'visible' : ''}`}
          style={{ transitionDelay: '0.3s' }}
        >
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="metadata"
            style={{
              width: '100%',
              borderRadius: 16,
              display: 'block',
              aspectRatio: '16 / 9',
              objectFit: 'cover',
            }}
          >
            <source src="/videos/our story video.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  )
}
