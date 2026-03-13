import { useInView } from '../hooks/useInView'

export default function StoreInfo() {
  const [ref, visible] = useInView()

  return (
    <section id="visit" ref={ref} style={{ background: 'var(--off-white)', padding: '60px 48px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Centered title */}
        <h2
          className={`fade-up ${visible ? 'visible' : ''}`}
          style={{ textAlign: 'center', fontSize: 'clamp(1.4rem, 3vw, 2.2rem)', color: 'var(--black)', marginBottom: 48 }}
        >
          Visit Our Shop
        </h2>

        {/* Map + Details card side by side */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'stretch' }} className="store-grid">
          {/* Map */}
          <div
            className={`slide-left ${visible ? 'visible' : ''}`}
            style={{ borderRadius: 20, overflow: 'hidden', minHeight: 380 }}
          >
            <iframe
              title="Biscuit King Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.683!2d103.8344!3d1.3584!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da17299fcd1c7f%3A0x3e066bfe64fd5a0!2s130%20Casuarina%20Rd%2C%20Singapore%20579518!5e0!3m2!1sen!2ssg!4v1700000000000!5m2!1sen!2ssg"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 380, display: 'block' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Details card — Prept sticker/badge style */}
          <div
            className={`slide-right ${visible ? 'visible' : ''}`}
            style={{
              background: 'var(--red-50)',
              borderRadius: 24,
              padding: '40px 36px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 24,
            }}
          >
            {/* Address */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="20" height="20" fill="none" stroke="var(--red-400)" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div>
                <p style={{ fontWeight: 600, color: 'var(--black)', fontSize: 14, marginBottom: 2 }}>Address</p>
                <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.5 }}>130 Casuarina Road,<br/>Singapore 579518</p>
              </div>
            </div>

            {/* Hours */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="20" height="20" fill="none" stroke="var(--red-400)" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div>
                <p style={{ fontWeight: 600, color: 'var(--black)', fontSize: 14, marginBottom: 2 }}>Hours</p>
                <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.5 }}>Tue – Sun, 11am – 10pm<br/>Closed on Mondays</p>
              </div>
            </div>

            {/* Phone */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="20" height="20" fill="none" stroke="var(--red-400)" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                </svg>
              </div>
              <div>
                <p style={{ fontWeight: 600, color: 'var(--black)', fontSize: 14, marginBottom: 2 }}>Phone</p>
                <p style={{ color: 'var(--muted)', fontSize: 14 }}>+65 6454 5938</p>
              </div>
            </div>

            {/* WhatsApp */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="20" height="20" fill="none" stroke="var(--red-400)" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
                </svg>
              </div>
              <div>
                <p style={{ fontWeight: 600, color: 'var(--black)', fontSize: 14, marginBottom: 2 }}>WhatsApp</p>
                <p style={{ color: 'var(--muted)', fontSize: 14 }}>9729 6540</p>
              </div>
            </div>

            {/* CTA */}
            <a
              href="https://maps.google.com/?q=130+Casuarina+Road+Singapore+579518"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:bg-[var(--red-500)] transition-colors"
              style={{
                display: 'block',
                textAlign: 'center',
                marginTop: 8,
                padding: '12px 0',
                borderRadius: 14,
                background: 'var(--red-400)',
                color: 'var(--white)',
                fontWeight: 600,
                fontSize: 14,
                textDecoration: 'none',
              }}
            >
              Get Directions &rarr;
            </a>
          </div>
        </div>
      </div>

      {/* Responsive: stack on mobile */}
      <style>{`
        @media (max-width: 768px) {
          .store-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}
