import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const base = import.meta.env.BASE_URL

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const isShop = location.pathname === '/shop'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { label: 'Shop', href: '/shop', isRoute: true },
    { label: 'Our Story', href: isShop ? '/#story' : '#story' },
    { label: 'Visit Us', href: isShop ? '/#visit' : '#visit' },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-300 ${
        scrolled
          ? 'bg-[var(--off-white)] shadow-md'
          : 'bg-transparent'
      }`}
      style={{ height: 80 }}
    >
      <div className="h-full flex items-center justify-between" style={{ paddingLeft: 32, paddingRight: 32 }}>
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0" style={{ marginLeft: 12 }}>
          <img
            src={`${base}images/logo.png`}
            alt="Biscuit King"
            className="h-10 w-auto"
          />
        </Link>

        {/* Desktop Nav — rounded border pill */}
        <div
          className="hidden md:flex items-center gap-6"
          style={{ border: '1.5px solid var(--red-200)', borderRadius: 9999, padding: '8px 28px' }}
        >
          {navLinks.map((link) =>
            link.isRoute ? (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm font-medium uppercase tracking-wider text-[var(--black)] hover:text-[var(--red-500)] transition-colors"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium uppercase tracking-wider text-[var(--black)] hover:text-[var(--red-500)] transition-colors"
              >
                {link.label}
              </a>
            )
          )}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center" style={{ marginRight: 12 }}>
          <Link
            to="/shop"
            className="hover:bg-[var(--red-50)] transition-colors"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              border: '1.5px solid var(--red-200)',
              borderRadius: 9999,
              padding: '8px 24px',
              color: 'var(--black)',
              fontSize: 14,
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              textDecoration: 'none',
            }}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            Order Now
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-[var(--black)]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          ) : (
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 12h18M3 6h18M3 18h18"/>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile overlay menu */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 top-0 bg-[var(--white)] z-[999] flex flex-col items-center justify-center gap-10">
          <button
            className="absolute top-6 right-6 text-[var(--black)]"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
          {navLinks.map((link) =>
            link.isRoute ? (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-[var(--black)] text-2xl font-medium uppercase tracking-wider hover:text-[var(--red-500)] transition-colors"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-[var(--black)] text-2xl font-medium uppercase tracking-wider hover:text-[var(--red-500)] transition-colors"
              >
                {link.label}
              </a>
            )
          )}
          <Link
            to="/shop"
            onClick={() => setMenuOpen(false)}
            className="mt-4 bg-[var(--red-400)] text-white text-lg font-medium uppercase px-8 py-3 rounded-full"
          >
            Order Now
          </Link>
        </div>
      )}
    </nav>
  )
}
