export default function Footer() {
  const links = [
    { label: 'Shop', href: '#featured' },
    { label: 'Our Story', href: '#story' },
    { label: 'Visit Us', href: '#visit' },
    { label: 'Instagram', href: '#' },
    { label: 'TikTok', href: '#' },
    { label: 'WhatsApp', href: '#' },
  ]

  return (
    <footer style={{ background: 'var(--red-50)', padding: '48px 48px 32px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', textAlign: 'center' }}>
        {/* Logo */}
        <img src="/images/logo.png" alt="Biscuit King" style={{ height: 48, margin: '0 auto 12px' }} />

        <p style={{ color: 'var(--muted)', fontSize: 16, marginBottom: 40 }}>
          Singapore&rsquo;s nostalgia, delivered.
        </p>

        {/* Single row of links */}
        <nav style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px 32px', marginBottom: 48 }}>
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-[var(--red-400)] transition-colors"
              style={{ color: 'var(--black)', fontSize: 14, textDecoration: 'none', letterSpacing: '0.05em', textTransform: 'uppercase' }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Divider + bottom */}
        <div style={{ borderTop: '1px solid var(--red-200)', paddingTop: 24, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px 24px', alignItems: 'center' }}>
          <span style={{ color: 'var(--muted)', fontSize: 13 }}>
            &copy; 2026 Biscuit King
          </span>
          <span style={{ color: 'var(--red-200)' }}>&middot;</span>
          <span style={{ color: 'var(--muted)', fontSize: 13 }}>
            Visa &middot; Mastercard &middot; PayNow &middot; GrabPay
          </span>
        </div>
      </div>
    </footer>
  )
}
