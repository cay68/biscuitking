import { useState, useEffect, useRef } from 'react'
import { useInView } from '../hooks/useInView'
import products from '../data/products.json'

const base = import.meta.env.BASE_URL
const categories = ['biscuits', 'cookies', 'sweets', 'crackers', 'others']

// Generate scatter positions for multiple copies of each item to fill the tin
function generateScatterPositions(items) {
  // Base positions — more slots to fill the tin
  const slots = [
    { bottom: 4, left: 12, rotate: -5 },
    { bottom: 6, left: 55, rotate: 8 },
    { bottom: 4, left: 110, rotate: -3 },
    { bottom: 6, left: 148, rotate: 6 },
    { bottom: 42, left: 8, rotate: 4 },
    { bottom: 48, left: 58, rotate: -7 },
    { bottom: 44, left: 108, rotate: 2 },
    { bottom: 46, left: 150, rotate: -5 },
    { bottom: 82, left: 14, rotate: -2 },
    { bottom: 88, left: 62, rotate: 6 },
    { bottom: 84, left: 112, rotate: -4 },
    { bottom: 86, left: 148, rotate: 3 },
    { bottom: 120, left: 10, rotate: 5 },
    { bottom: 124, left: 56, rotate: -3 },
    { bottom: 118, left: 106, rotate: 7 },
    { bottom: 122, left: 150, rotate: -6 },
  ]
  if (items.length === 0) return []
  // Distribute slots across items, repeating items to fill
  return slots.map((slot, i) => ({
    ...slot,
    item: items[i % items.length],
    key: i,
  }))
}

/* ── Product Detail Modal ── */
function ProductModal({ product, onClose, onAdd }) {
  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.5)', padding: 20 }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: 'white', borderRadius: 20, maxWidth: 520, width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 16, right: 16, zIndex: 10, width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,0,0,0.06)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--black)' }}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        <div style={{ background: 'var(--yellow-50)', borderRadius: '20px 20px 0 0', padding: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={`${base}images/products/${product.image}`} alt={product.name} style={{ width: '60%', maxHeight: 220, objectFit: 'contain' }} />
        </div>

        <div style={{ padding: '28px 28px 32px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '5px 14px', borderRadius: 9999, background: 'var(--red-50)', color: 'var(--red-500)' }}>{product.category}</span>
            {product.flavorProfile.map((f) => (
              <span key={f} style={{ fontSize: 12, fontWeight: 500, textTransform: 'capitalize', padding: '5px 14px', borderRadius: 9999, background: 'var(--yellow-50)', color: '#92600a' }}>{f}</span>
            ))}
          </div>

          <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', color: 'var(--black)', marginBottom: 6 }}>{product.name}</h2>
          <p style={{ fontSize: 24, fontWeight: 700, color: 'var(--red-400)', marginBottom: 16 }}>
            ${product.price.toFixed(2)}
            <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--muted)', marginLeft: 4 }}>/ {product.priceUnit}</span>
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--muted)', marginBottom: 20 }}>{product.description}</p>

          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)', marginBottom: 8 }}>Era</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {product.era.map((e) => (
                <span key={e} style={{ fontSize: 12, padding: '4px 12px', borderRadius: 9999, background: '#f3f4f6', color: 'var(--black)', fontWeight: 500 }}>{e}</span>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)', marginBottom: 8 }}>Perfect for</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {product.occasions.map((o) => (
                <span key={o} style={{ fontSize: 12, padding: '4px 12px', borderRadius: 9999, background: '#f3f4f6', color: 'var(--black)', fontWeight: 500, textTransform: 'capitalize' }}>{o}</span>
              ))}
            </div>
          </div>

          <button
            onClick={() => { onAdd(product); onClose() }}
            style={{ width: '100%', padding: '14px 0', borderRadius: 12, border: 'none', fontSize: 15, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', background: 'var(--red-400)', color: 'white', cursor: 'pointer', transition: 'background 200ms' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--red-500)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--red-400)'}
          >
            Add to Tin
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Product Card ── */
function ProductCard({ product, onAdd, onSelect }) {
  const [ref, visible] = useInView()

  return (
    <div
      ref={ref}
      className={`fade-up ${visible ? 'visible' : ''} group`}
      style={{ background: 'white', borderRadius: 16, overflow: 'hidden', transition: 'transform 300ms ease, box-shadow 300ms ease', boxShadow: '0 2px 16px var(--card-shadow)', display: 'flex', flexDirection: 'column' }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 32px var(--card-shadow-hover)' }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 16px var(--card-shadow)' }}
    >
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 20, zIndex: 5, background: 'var(--red-400)', color: 'white', padding: '6px 10px 8px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', borderRadius: '0 0 6px 6px' }}>
          {product.category}
        </div>
      </div>

      <div onClick={() => onSelect(product)} style={{ margin: '20px 16px 0', background: 'var(--yellow-50)', borderRadius: 12, border: '1.5px solid rgba(0,0,0,0.06)', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, cursor: 'pointer', overflow: 'hidden' }}>
        <img src={`${base}images/products/${product.image}`} alt={product.name} style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain', transition: 'transform 300ms ease' }} className="group-hover:scale-105" loading="lazy" />
      </div>

      <div style={{ padding: '16px 18px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 onClick={() => onSelect(product)} style={{ fontSize: 16, color: 'var(--black)', lineHeight: 1.3, cursor: 'pointer', marginBottom: 8 }}>{product.name}</h3>
        <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)', marginBottom: 5 }}>Flavour</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
          {product.flavorProfile.map((f) => (
            <span key={f} style={{ fontSize: 11, fontWeight: 500, textTransform: 'capitalize', padding: '3px 10px', borderRadius: 9999, background: 'var(--yellow-50)', color: '#92600a', border: '1px solid rgba(146,96,10,0.15)' }}>{f}</span>
          ))}
        </div>
        <div style={{ marginTop: 'auto', paddingBottom: 16 }}>
          <span style={{ fontSize: 26, fontWeight: 700, color: 'var(--black)' }}>${product.price.toFixed(2)}</span>
          <span style={{ fontSize: 13, color: 'var(--muted)', marginLeft: 4 }}>/ {product.priceUnit}</span>
        </div>
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); onAdd(product) }}
        style={{ width: '100%', padding: '13px 0', border: 'none', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: 'var(--red-400)', color: 'white', cursor: 'pointer', transition: 'background 200ms', borderRadius: '0 0 16px 16px' }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--red-500)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'var(--red-400)'}
      >
        Add to Tin
      </button>
    </div>
  )
}

/* ── Khong Guan-style Biscuit Tin ── */
function BiscuitTin({ currentTin, onRemoveFromCurrent, onClearCurrent, onCheckout }) {
  const tinRef = useRef(null)
  const prevCount = useRef(currentTin.length)
  const total = currentTin.reduce((sum, item) => sum + item.price, 0)

  // Shake on add
  useEffect(() => {
    if (currentTin.length > prevCount.current && tinRef.current) {
      tinRef.current.classList.add('tin-shake')
      const t = setTimeout(() => {
        tinRef.current?.classList.remove('tin-shake')
      }, 500)
      return () => clearTimeout(t)
    }
    prevCount.current = currentTin.length
  }, [currentTin.length])

  return (
    <div>
      <h2 className="text-2xl text-[var(--black)]" style={{ marginBottom: 20 }}>Your Tin</h2>

      {/* Khong Guan tin */}
      <div ref={tinRef} style={{ width: 224, margin: '0 auto', position: 'relative', paddingBottom: 8 }}>

        {/* Ground shadow */}
        <div style={{
          position: 'absolute', bottom: 0, left: '10%', right: '10%', height: 16,
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.22) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />

        {/* === Tin body (no lid) === */}
        <div style={{
          position: 'relative', width: 220, margin: '0 auto',
          background: 'linear-gradient(170deg, #c9952e 0%, #e8c252 15%, #f5d978 30%, #e8c252 45%, #c9952e 55%, #a67c1e 70%, #c9952e 85%, #e8c252 100%)',
          border: '1px solid #8b6914',
          borderRadius: '6px',
          boxShadow: '4px 4px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)',
          overflow: 'hidden',
        }}>
          {/* Metallic sheen overlay */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2,
            background: 'linear-gradient(90deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 30%, rgba(255,255,255,0) 70%, rgba(255,255,255,0.08) 100%)',
          }} />

          {/* Left 3D edge */}
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: '#a67c1e', zIndex: 1 }} />
          {/* Right 3D edge */}
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 3, background: '#e8c252', zIndex: 1 }} />

          {/* Top rim */}
          <div style={{ height: 4, background: 'linear-gradient(180deg, #e8c252, #c9952e)', borderBottom: '1px solid rgba(139,105,20,0.3)' }} />

          {/* Label area */}
          <div style={{
            margin: '0 8px',
            background: 'linear-gradient(180deg, #8b1a1a, #a52424)',
            border: '1px solid #c9952e',
            padding: '7px 12px', textAlign: 'center',
          }}>
            <p style={{
              color: '#e8c252', fontSize: 12, fontWeight: 700,
              letterSpacing: '2px', textTransform: 'uppercase', lineHeight: 1,
              textShadow: '0 1px 0 rgba(0,0,0,0.3)',
            }}>Biscuit King</p>
            <p style={{
              color: 'rgba(232,194,82,0.7)', fontSize: 9,
              letterSpacing: '1.5px', textTransform: 'uppercase', marginTop: 3,
              textShadow: '0 1px 0 rgba(0,0,0,0.3)',
            }}>Since 1980</p>
          </div>

          {/* Transparent window */}
          <div style={{
            height: 180, margin: '6px 8px',
            position: 'relative', overflow: 'hidden',
            background: '#faf5e4',
            border: '2px solid #8b6914', borderRadius: 4,
            boxShadow: 'inset 0 3px 8px rgba(0,0,0,0.15), inset 0 -2px 4px rgba(0,0,0,0.08), inset 0 0 20px rgba(139,105,20,0.1)',
          }}>
            {/* Empty state */}
            {currentTin.length === 0 && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ fontSize: 12, color: 'rgba(139,105,20,0.3)', textAlign: 'center', lineHeight: 1.5 }}>Add snacks<br/>to fill your tin</p>
              </div>
            )}

            {/* Fill tin with multiple copies of each product */}
            {generateScatterPositions(currentTin).map((pos) => (
              <img
                key={pos.key}
                src={`${base}images/products/${pos.item.image}`}
                alt={pos.item.name}
                className="tin-item-drop"
                style={{
                  position: 'absolute',
                  bottom: pos.bottom, left: pos.left,
                  width: 44, height: 44, objectFit: 'contain',
                  transform: `rotate(${pos.rotate}deg)`,
                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.18))',
                  zIndex: pos.key + 1,
                  animationDelay: `${pos.key * 30}ms`,
                  pointerEvents: 'none',
                }}
              />
            ))}
          </div>

          {/* Bottom section */}
          <div style={{ padding: '4px 8px 0' }}>
            <div style={{ height: 1, background: 'linear-gradient(90deg, #a67c1e, #e8c252, #a67c1e)', marginBottom: 4 }} />
            <p style={{ textAlign: 'center', fontSize: 8, color: 'rgba(139,105,20,0.5)', letterSpacing: '0.5px', paddingBottom: 2 }}>TIN DEPOSIT: $3.00</p>
          </div>

          {/* Bottom rim */}
          <div style={{ height: 4, background: 'linear-gradient(180deg, #c9952e, #e8c252)', borderTop: '1px solid rgba(139,105,20,0.3)' }} />
        </div>
      </div>

      {/* Items in current tin — removable list */}
      {currentTin.length > 0 && (
        <div style={{ marginTop: 20, maxWidth: 220, margin: '20px auto 0' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {currentTin.map((item, i) => (
              <div key={`${item.id}-${i}`} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 8px', background: 'var(--yellow-50)', borderRadius: 8 }}>
                <img src={`${base}images/products/${item.image}`} alt={item.name} style={{ width: 28, height: 28, objectFit: 'contain' }} />
                <span style={{ flex: 1, fontSize: 12, fontWeight: 500, color: 'var(--black)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</span>
                <button onClick={() => onRemoveFromCurrent(i)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: 2, flexShrink: 0 }}>
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Total + actions */}
      {currentTin.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <div className="flex justify-between items-center" style={{ marginBottom: 14 }}>
            <span className="text-sm font-bold text-[var(--black)]">
              Total <span style={{ fontWeight: 400, color: 'var(--muted)' }}>({currentTin.length} item{currentTin.length !== 1 ? 's' : ''})</span>
            </span>
            <span className="text-sm font-bold text-[var(--black)]">${total.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button
              onClick={onCheckout}
              style={{
                width: '100%', padding: '10px 0', borderRadius: 9999, fontSize: 13, fontWeight: 600,
                background: 'var(--red-400)', color: 'white',
                border: '1.5px solid var(--red-400)', cursor: 'pointer',
                transition: 'background 200ms',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--red-500)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--red-400)' }}
            >
              Checkout
            </button>
            <button
              onClick={onClearCurrent}
              style={{
                width: '100%', padding: '10px 0', borderRadius: 9999, fontSize: 12, fontWeight: 600,
                background: 'var(--red-50)', color: 'var(--red-500)',
                border: '1.5px solid var(--red-100)', cursor: 'pointer',
                transition: 'background 200ms',
              }}
            >
              Clear tin
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Mobile bottom bar / drawer ── */
function MobileCart({ currentTin, onRemoveFromCurrent, onClearCurrent, onCheckout, drawerOpen, setDrawerOpen }) {
  const total = currentTin.reduce((sum, item) => sum + item.price, 0)

  return (
    <>
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[800]" style={{ background: 'white', borderTop: '1px solid #e5e7eb', padding: '12px 16px', boxShadow: '0 -2px 10px rgba(0,0,0,0.08)' }}>
        <div className="flex items-center gap-3">
          <div
            onClick={() => setDrawerOpen(true)}
            style={{
              width: 48, height: 56, flexShrink: 0, cursor: 'pointer',
              background: 'linear-gradient(180deg, #d4a017, #f0c75e, #d4a017)',
              border: '2px solid #b8860b', borderRadius: 4,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, color: '#5c3a00',
            }}
          >
            {currentTin.length}
          </div>
          <div style={{ flex: 1 }}>
            <p className="text-sm font-semibold text-[var(--black)]">
              {currentTin.length} item{currentTin.length !== 1 ? 's' : ''} in tin
            </p>
            {currentTin.length > 0 && <p className="text-xs" style={{ color: 'var(--muted)' }}>${total.toFixed(2)}</p>}
          </div>
          <button
            onClick={() => currentTin.length > 0 ? onCheckout() : setDrawerOpen(true)}
            className="py-2.5 px-5 rounded-lg text-sm font-semibold"
            style={{ background: currentTin.length > 0 ? 'var(--red-400)' : 'var(--red-50)', color: currentTin.length > 0 ? 'white' : 'var(--red-500)' }}
          >
            {currentTin.length > 0 ? 'Checkout' : 'View Tin'}
          </button>
        </div>
      </div>

      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-[900]" onClick={() => setDrawerOpen(false)}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} />
          <div onClick={(e) => e.stopPropagation()} style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'var(--off-white)', borderRadius: '20px 20px 0 0', padding: '24px 20px 32px', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ width: 40, height: 4, borderRadius: 2, background: '#d1d5db', margin: '0 auto 16px' }} />
            <BiscuitTin
              currentTin={currentTin}
              onRemoveFromCurrent={onRemoveFromCurrent}
              onClearCurrent={onClearCurrent}
              onCheckout={onCheckout}
            />
          </div>
        </div>
      )}
    </>
  )
}

/* ── Main Shop Page ── */
export default function Shop() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState([])
  const [filterOpen, setFilterOpen] = useState(false)
  const [currentTin, setCurrentTin] = useState([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => { window.scrollTo(0, 0) }, [])

  useEffect(() => {
    if (!filterOpen) return
    const close = () => setFilterOpen(false)
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [filterOpen])

  useEffect(() => {
    document.body.style.overflow = selectedProduct ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [selectedProduct])

  const toggleFilter = (cat) => {
    setActiveFilters((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  const filtered = products.filter((p) => {
    const matchesFilter = activeFilters.length === 0 || activeFilters.includes(p.category)
    const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const addToTin = (product) => {
    setCurrentTin((prev) => [...prev, product])
  }

  const removeFromCurrent = (index) => {
    setCurrentTin((prev) => prev.filter((_, i) => i !== index))
  }

  const clearCurrent = () => setCurrentTin([])

  const handleCheckout = () => {
    // Placeholder for checkout flow
    alert(`Order placed! ${currentTin.length} item${currentTin.length !== 1 ? 's' : ''} — $${currentTin.reduce((s, p) => s + p.price, 0).toFixed(2)} total`)
    setCurrentTin([])
    setDrawerOpen(false)
  }

  return (
    <div style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--off-white)' }}>
      <div style={{ textAlign: 'center', padding: '28px 28px 0' }}>
        <h1 className="text-4xl md:text-5xl text-[var(--black)]">Our Snacks</h1>
        <p className="mt-3 text-lg" style={{ color: 'var(--muted)' }}>Mix & Match</p>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 28px 140px' }}>
        <div className="flex gap-10" id="shop-layout">
          <div style={{ flex: 3, minWidth: 0 }}>
            {/* Search + Filter row */}
            <div className="flex flex-wrap items-center gap-3" style={{ marginTop: 24, marginBottom: 28 }}>
              <div style={{ position: 'relative', flex: '0 1 220px' }}>
                <svg width="16" height="16" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search snacks..."
                  style={{
                    width: '100%', padding: '9px 16px 9px 36px', borderRadius: 10,
                    background: 'white', border: '1.5px solid #e5e7eb', fontSize: 14,
                    outline: 'none', color: 'var(--black)',
                  }}
                />
              </div>
              <div className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setFilterOpen((v) => !v) }}
                  className="flex items-center gap-2 transition-colors"
                  style={{ padding: '9px 16px', borderRadius: 10, background: 'white', border: '1.5px solid #e5e7eb', cursor: 'pointer', color: 'var(--black)', fontSize: 14, fontWeight: 500 }}
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                  Filter
                </button>
                {filterOpen && (
                  <div onClick={(e) => e.stopPropagation()} style={{ position: 'absolute', top: '100%', left: 0, marginTop: 6, background: 'white', borderRadius: 14, boxShadow: '0 8px 30px rgba(0,0,0,0.12)', padding: 6, zIndex: 50, minWidth: 180 }}>
                    {categories.map((cat) => (
                      <button key={cat} onClick={() => toggleFilter(cat)} className="w-full text-left rounded-lg text-sm capitalize transition-colors hover:bg-[var(--red-50)]" style={{ padding: '10px 14px', background: activeFilters.includes(cat) ? 'var(--red-50)' : 'transparent', color: 'var(--black)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {cat}
                        {activeFilters.includes(cat) && (
                          <svg width="14" height="14" fill="none" stroke="var(--red-400)" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {activeFilters.map((cat) => (
                <button key={cat} onClick={() => toggleFilter(cat)} className="flex items-center gap-2 capitalize transition-colors" style={{ padding: '8px 16px', borderRadius: 9999, background: 'var(--red-50)', color: 'var(--red-500)', border: '1.5px solid var(--red-100)', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                  {cat}
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              ))}

              {activeFilters.length > 0 && (
                <button onClick={() => setActiveFilters([])} style={{ padding: '8px 14px', background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 13, textDecoration: 'underline' }}>
                  Clear all
                </button>
              )}
            </div>

            {/* Product grid */}
            <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }} id="product-grid">
              {filtered.map((product, i) => (
                <ProductCard key={`${product.id}-${i}`} product={product} onAdd={addToTin} onSelect={setSelectedProduct} />
              ))}
            </div>
          </div>

          {/* Right — Cart */}
          <div className="hidden lg:block" style={{ width: 280, flexShrink: 0, paddingTop: 88 }}>
            <div style={{ position: 'sticky', top: 100, padding: '28px 22px', background: 'white', borderRadius: 16, boxShadow: '0 2px 16px var(--card-shadow)', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
              <BiscuitTin
                currentTin={currentTin}
                onRemoveFromCurrent={removeFromCurrent}
                onClearCurrent={clearCurrent}
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        </div>
      </div>

      <MobileCart
        currentTin={currentTin}
        onRemoveFromCurrent={removeFromCurrent}
        onClearCurrent={clearCurrent}
        onCheckout={handleCheckout}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
      />

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAdd={addToTin} />
      )}

      <style>{`
        @keyframes tin-shake {
          0%, 100% { transform: rotate(0deg); }
          20% { transform: rotate(-2deg); }
          40% { transform: rotate(2deg); }
          60% { transform: rotate(-1deg); }
          80% { transform: rotate(1deg); }
        }
        .tin-shake { animation: tin-shake 400ms ease; }

        @keyframes tin-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0,186,77,0); }
          50% { box-shadow: 0 0 16px 4px rgba(0,186,77,0.4); }
        }
        .tin-glow { animation: tin-glow 600ms ease; }

        @keyframes tin-drop {
          0% { opacity: 0; transform: translateY(-20px) rotate(0deg); }
          60% { opacity: 1; transform: translateY(4px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .tin-item-drop { animation: tin-drop 400ms ease forwards; }

        @keyframes cart-fade-in {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .completed-tin-card { animation: cart-fade-in 300ms ease forwards; }

        @media (max-width: 1023px) {
          #shop-layout { flex-direction: column; }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          #product-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 767px) {
          #product-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 400px) {
          #product-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
