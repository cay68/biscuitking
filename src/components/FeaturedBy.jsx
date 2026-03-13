import { useInView } from '../hooks/useInView'

const publishers = [
  { name: 'TidbitsMag', logo: '/images/press/tidbits mag logo.png' },
  { name: 'The Straits Times', logo: '/images/press/straits times logo.png' },
  { name: 'The Smart Local', logo: '/images/press/smart local logo.png' },
  { name: 'Seth Lui', logo: '/images/press/seth lui logo.png' },
  { name: 'Tripadvisor', logo: '/images/press/trip adivisor logo.png' },
]

export default function FeaturedBy() {
  const [ref, visible] = useInView()

  return (
    <section ref={ref} style={{ background: 'var(--white)', padding: '60px 48px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Publisher logos row with title on left */}
        <div
          className={`fade-up ${visible ? 'visible' : ''}`}
          style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '24px 48px', paddingBottom: 48 }}
        >
          <span style={{ fontSize: 14, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', whiteSpace: 'nowrap' }}>
            Featured On
          </span>
          {publishers.map((pub) => (
            <img
              key={pub.name}
              src={pub.logo}
              alt={pub.name}
              style={{ height: 40, width: 'auto', objectFit: 'contain' }}
            />
          ))}
        </div>

        {/* Horizontal divider */}
        <div style={{ borderTop: '1.5px solid var(--black)', width: '100%' }} />

        {/* Quote area — two columns with vertical divider */}
        <div
          className={`fade-up ${visible ? 'visible' : ''}`}
          style={{ transitionDelay: '0.2s', display: 'grid', gridTemplateColumns: '1fr auto 280px', gap: 0, paddingTop: 48 }}
          id="featured-quote-grid"
        >
          {/* Left — large quote */}
          <div style={{ paddingRight: 48 }}>
            <blockquote style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: 'clamp(1.1rem, 2.2vw, 1.55rem)',
              lineHeight: 1.65,
              color: 'var(--black)',
              fontWeight: 400,
              fontStyle: 'italic',
              margin: 0,
            }}>
              In a city that never stops building forward, some things are worth holding on to. Biscuit King has been that quiet keeper of Singapore&rsquo;s sweetest memories — a place where the tastes, toys, and treats of generations past still have a home. Every tin on our shelf carries a story. Every biscuit, a memory you forgot you had. We&rsquo;re not just selling snacks. We&rsquo;re making sure the flavours that raised a nation don&rsquo;t disappear with the mama shops that once carried them.
            </blockquote>
          </div>

          {/* Vertical divider */}
          <div style={{ width: 1.5, background: 'var(--black)', alignSelf: 'stretch' }} />

          {/* Right — attribution with logo */}
          <div style={{ paddingLeft: 48, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <img
              src="/images/press/tidbits mag logo.png"
              alt="TidbitsMag"
              style={{ height: 28, width: 'auto', objectFit: 'contain', marginBottom: 16, alignSelf: 'flex-start' }}
            />
            <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--black)', marginBottom: 2 }}>TidbitsMag</p>
            <p style={{ fontSize: 13, color: 'var(--muted)' }}>Feature Article</p>
          </div>
        </div>
      </div>

      {/* Responsive: stack on mobile */}
      <style>{`
        @media (max-width: 768px) {
          #featured-quote-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          #featured-quote-grid > div:first-child {
            padding-right: 0 !important;
          }
          #featured-quote-grid > div:nth-child(2) {
            display: none !important;
          }
          #featured-quote-grid > div:last-child {
            padding-left: 0 !important;
            border-top: 1.5px solid var(--black);
            padding-top: 24px;
          }
        }
      `}</style>
    </section>
  )
}
