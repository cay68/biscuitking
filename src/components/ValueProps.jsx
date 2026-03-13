import { useInView } from '../hooks/useInView'

const cards = [
  {
    title: '50+ Snacks',
    desc: "Singapore's largest collection of traditional biscuits, sweets, preserved fruits, and childhood games.",
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--red-400)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon-rock">
        <circle cx="12" cy="12" r="10"/>
        <circle cx="9" cy="10" r="1" fill="var(--red-400)" stroke="none"/>
        <circle cx="15" cy="10" r="1" fill="var(--red-400)" stroke="none"/>
        <circle cx="12" cy="15" r="1" fill="var(--red-400)" stroke="none"/>
        <circle cx="8" cy="14" r="0.7" fill="var(--red-400)" stroke="none"/>
        <circle cx="16" cy="13" r="0.7" fill="var(--red-400)" stroke="none"/>
      </svg>
    ),
  },
  {
    title: 'Mix & Match Tins',
    desc: 'Build your own gift tin with up to 4 flavours. The perfect nostalgia gift from just $30.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--red-400)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon-bounce">
        <rect x="3" y="8" width="18" height="13" rx="2"/>
        <path d="M12 8V3"/>
        <path d="M7.5 3C7.5 3 7.5 8 12 8"/>
        <path d="M16.5 3C16.5 3 16.5 8 12 8"/>
        <line x1="3" y1="12" x2="21" y2="12"/>
      </svg>
    ),
  },
  {
    title: 'In-Store Pickup',
    desc: 'Order online, collect at your convenience from our shop at 130 Casuarina Road.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--red-400)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon-pulse">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
    ),
  },
]

export default function ValueProps() {
  const [ref, visible] = useInView()

  return (
    <section ref={ref} style={{ background: 'var(--off-white)', padding: '40px 48px' }}>
      <div style={{ maxWidth: 780, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: 'var(--black)', marginBottom: 32 }}>
          Why Biscuit King?
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }} id="vp-grid">
          {cards.map((card, i) => (
            <div
              key={i}
              className={`fade-up ${visible ? 'visible' : ''}`}
              style={{
                textAlign: 'center',
                padding: '28px 20px',
                borderRadius: 14,
                background: 'var(--white)',
                boxShadow: '0 2px 16px var(--card-shadow)',
                transitionDelay: `${i * 0.15}s`,
              }}
            >
              <div style={{ marginBottom: 14, display: 'inline-block' }}>
                {card.icon}
              </div>
              <h3 style={{ fontSize: 17, color: 'var(--black)', marginBottom: 8 }}>
                {card.title}
              </h3>
              <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes rock {
          0%, 100% { transform: rotate(-10deg); }
          50% { transform: rotate(10deg); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes pulse-scale {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        .icon-rock {
          animation: rock 2s ease-in-out infinite;
          transform-origin: center center;
        }
        .icon-bounce {
          animation: bounce 1.5s ease-in-out infinite;
        }
        .icon-pulse {
          animation: pulse-scale 2.2s ease-in-out infinite;
        }
        @media (max-width: 768px) {
          #vp-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}
