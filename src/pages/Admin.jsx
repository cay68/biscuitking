import { useState, useRef } from 'react'
import productsData from '../data/products.json'

const ADMIN_PASSWORD = 'biscuitking2026'
const base = import.meta.env.BASE_URL

const MONITORING_LOGS = [
  { time: '10:32 AM', query: '"I\'m a 90s kid"', status: 'PASS', products: 'Haw Flakes, Ais Gems', issues: 'None' },
  { time: '10:35 AM', query: '"Do you sell macarons?"', status: 'PASS', products: 'Pineapple Jam Biscuits', issues: 'None' },
  { time: '10:41 AM', query: '"Gift for grandma"', status: 'FLAG', products: 'Love Letters', issues: 'Unknown product: "Grandma\'s Special Tin"' },
  { time: '10:45 AM', query: '"What\'s the weather?"', status: 'PASS', products: '—', issues: 'None' },
  { time: '10:52 AM', query: '"Cheapest snack?"', status: 'PASS', products: 'Eyeglass Candy', issues: 'None' },
  { time: '11:01 AM', query: '"Spicy crackers?"', status: 'FLAG', products: 'Muruku Sticks', issues: 'Unknown price: $8.99' },
]

const SYSTEM_PROMPT_PREVIEW = `You are "Biscuit King", a friendly and knowledgeable snack shop assistant for Biscuit King — a traditional snack retailer at 130 Casuarina Road, Upper Thomson, Singapore.

## YOUR PERSONA
- Warm, enthusiastic, and genuinely passionate about traditional snacks
- You speak naturally and can use light Singlish where appropriate (e.g., "shiok", "best lah")
- You are like the friendly uncle behind the counter who knows every product
- Keep responses concise: 2-4 sentences, then offer to help more

## YOUR KNOWLEDGE — PRODUCT CATALOGUE
You know EXACTLY 50 products across these categories: biscuits, cookies, sweets, crackers, others
Price range: $3.50 — $18.00

[Full product catalogue with 50 items loaded automatically from products.json]

## STORE INFORMATION
- Address: 130 Casuarina Road, Singapore 579518
- Hours: Tuesday – Sunday, 11am – 10pm (Closed on Mondays)
- Phone: +65 6454 5938
- WhatsApp: 9729 6540
- Mix & Match Tins: Choose up to 4 flavours per tin, from $30
- In-store pickup available

## CRITICAL RULES — HALLUCINATION PREVENTION
1. ONLY recommend products that exist in the catalogue above. NEVER invent product names, prices, or descriptions.
2. If a user asks about a product you don't have in your catalogue, say: "I don't have that in my current catalogue, but let me suggest something similar!" — then recommend a real product.
3. ALWAYS include the exact price and unit when recommending a product (e.g., "$10.50 per 1kg").
4. If you are unsure about any detail, say so honestly. Do not guess.
5. NEVER make up promotions, discounts, or offers that are not mentioned in the store information above.
6. If asked about topics unrelated to Biscuit King or snacks, politely redirect: "I'm best at helping with snacks! What kind of treats are you looking for?"
7. When recommending products, pull directly from the catalogue data — use the exact product name and price as listed.

## WHAT YOU CAN DO
- Recommend snacks by era (e.g., "I'm a 90s kid")
- Recommend by flavour preference (sweet, sour, savoury, etc.)
- Recommend by occasion (CNY, Hari Raya, Deepavali, gifting, parties)
- Suggest gift tin combinations within a budget
- Answer questions about specific products (price, description, flavour)
- Compare products when asked
- Suggest pairings ("If you like X, you'll also love Y")

## RESPONSE FORMAT
- Keep it conversational, not robotic
- When listing multiple products, use a short format: Product Name — $X.XX/unit — one-line description
- Always end with a follow-up question or suggestion to keep the conversation going
- If recommending a tin combination, list the 4 items and the total price`

// ── Shared styles ────────────────────────────────
const inputStyle = {
  width: '100%',
  padding: '9px 12px',
  border: '1px solid #e5e0d8',
  borderRadius: '8px',
  fontSize: '14px',
  fontFamily: "'DM Sans', sans-serif",
  outline: 'none',
  color: 'var(--black)',
  boxSizing: 'border-box',
  background: 'white',
}

const selectStyle = {
  ...inputStyle,
  cursor: 'pointer',
}

// ── Toggle Switch ────────────────────────────────
function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        width: '44px',
        height: '24px',
        borderRadius: '999px',
        background: checked ? 'var(--red-400)' : '#d1d5db',
        border: 'none',
        cursor: 'pointer',
        transition: 'background 0.2s',
        flexShrink: 0,
        padding: 0,
      }}
      role="switch"
      aria-checked={checked}
    >
      <span style={{
        position: 'absolute',
        left: checked ? '22px' : '2px',
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        background: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        transition: 'left 0.2s',
      }} />
    </button>
  )
}

// ── Accordion Section ────────────────────────────
function AccordionSection({ title, description, isOpen, onToggle, children, lockIcon = false, noBorder = false }) {
  return (
    <div style={{ borderBottom: noBorder ? 'none' : '1px solid #f0e8d8' }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          padding: '18px 24px',
          background: isOpen ? '#fdfaf5' : 'white',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          textAlign: 'left',
          transition: 'background 0.15s',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {lockIcon && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" style={{ flexShrink: 0 }}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            )}
            <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--black)', fontFamily: "'DM Sans', sans-serif" }}>{title}</span>
          </div>
          {!isOpen && (
            <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '2px' }}>{description}</p>
          )}
        </div>
        <svg
          width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="var(--muted)" strokeWidth="2"
          style={{ flexShrink: 0, transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {isOpen && (
        <div style={{ padding: '0 24px 24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {children}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Form Field ───────────────────────────────────
function FormField({ label, helper, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--black)', marginBottom: '6px' }}>
        {label}
      </label>
      {children}
      {helper && <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>{helper}</p>}
    </div>
  )
}

// ── Admin Header ─────────────────────────────────
function AdminHeader() {
  return (
    <header style={{
      background: 'white',
      borderBottom: '1px solid #f0e8d8',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '0 24px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <img src={`${base}images/logo.png`} alt="Biscuit King" style={{ height: '36px', objectFit: 'contain' }} />
        <span style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 600,
          fontSize: '13px',
          color: 'var(--muted)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>
          Admin Dashboard
        </span>
      </div>
    </header>
  )
}

// ── Add Product Modal ────────────────────────────
const FLAVOR_OPTIONS = ['sweet', 'sour', 'savoury', 'creamy', 'spicy', 'crunchy']
const ERA_OPTIONS = ['70s', '80s', '90s', '2000s']
const OCCASION_OPTIONS = ['chinese new year', 'hari raya', 'deepavali', 'gifting', 'children\'s parties', 'casual snacking', 'nostalgia gifts']
const ALL_CATEGORIES = ['biscuits', 'cookies', 'sweets', 'crackers', 'others']

const EMPTY_FORM = {
  name: '',
  category: 'biscuits',
  price: '',
  priceUnit: '',
  description: '',
  flavorProfile: [],
  era: [],
  occasions: [],
  inStock: true,
}

function AddProductModal({ onClose, onAdd }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }))
  }

  function toggleArray(field, value) {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value],
    }))
  }

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Product name is required'
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) e.price = 'Enter a valid price'
    if (!form.priceUnit.trim()) e.priceUnit = 'Unit is required (e.g. 1kg, 200g)'
    return e
  }

  function handleSubmit(e) {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length > 0) { setErrors(e2); return }
    onAdd({
      id: `new-${Date.now()}`,
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      priceUnit: form.priceUnit.trim(),
      description: form.description.trim(),
      flavorProfile: form.flavorProfile,
      era: form.era,
      occasions: form.occasions,
      image: '',
      inStock: form.inStock,
    })
    onClose()
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
      >
        {/* Header */}
        <div style={{ padding: '24px 28px 20px', borderBottom: '1px solid #f0e8d8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: 'white', borderRadius: '20px 20px 0 0', zIndex: 1 }}>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 700, color: 'var(--black)' }}>Add New Product</h2>
            <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '2px' }}>Fill in the details below</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: '4px', display: 'flex', alignItems: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px 28px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Name */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--black)', marginBottom: '6px' }}>
              Product Name <span style={{ color: 'var(--red-400)' }}>*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Pineapple Jam Biscuits"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              style={{ ...inputStyle, borderColor: errors.name ? '#fca5a5' : '#e5e0d8' }}
              autoFocus
            />
            {errors.name && <p style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px' }}>{errors.name}</p>}
          </div>

          {/* Category */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--black)', marginBottom: '6px' }}>Category</label>
            <select value={form.category} onChange={e => set('category', e.target.value)} style={selectStyle}>
              {ALL_CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
          </div>

          {/* Price + Unit row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--black)', marginBottom: '6px' }}>
                Price (SGD) <span style={{ color: 'var(--red-400)' }}>*</span>
              </label>
              <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${errors.price ? '#fca5a5' : '#e5e0d8'}`, borderRadius: '8px', overflow: 'hidden' }}>
                <span style={{ padding: '9px 10px', background: '#f8f4ee', fontSize: '13px', color: 'var(--muted)', borderRight: '1px solid #e5e0d8', flexShrink: 0 }}>$</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={form.price}
                  onChange={e => set('price', e.target.value)}
                  step="0.50"
                  min="0"
                  style={{ border: 'none', padding: '9px 10px', fontSize: '14px', fontFamily: "'DM Sans', sans-serif", width: '100%', outline: 'none', color: 'var(--black)' }}
                />
              </div>
              {errors.price && <p style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px' }}>{errors.price}</p>}
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--black)', marginBottom: '6px' }}>
                Unit <span style={{ color: 'var(--red-400)' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 1kg, 200g"
                value={form.priceUnit}
                onChange={e => set('priceUnit', e.target.value)}
                style={{ ...inputStyle, borderColor: errors.priceUnit ? '#fca5a5' : '#e5e0d8' }}
              />
              {errors.priceUnit && <p style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px' }}>{errors.priceUnit}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--black)', marginBottom: '6px' }}>Description</label>
            <textarea
              placeholder="Short description of the product..."
              value={form.description}
              onChange={e => set('description', e.target.value)}
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          {/* Flavor Profile */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--black)', marginBottom: '8px' }}>Flavour Profile</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {FLAVOR_OPTIONS.map(f => {
                const active = form.flavorProfile.includes(f)
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => toggleArray('flavorProfile', f)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '999px',
                      border: `1.5px solid ${active ? 'var(--red-400)' : '#e5e0d8'}`,
                      background: active ? 'var(--red-50)' : 'white',
                      color: active ? 'var(--red-500)' : 'var(--muted)',
                      fontSize: '13px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      fontFamily: "'DM Sans', sans-serif",
                      textTransform: 'capitalize',
                      transition: 'all 0.15s',
                    }}
                  >{f}</button>
                )
              })}
            </div>
          </div>

          {/* Era */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--black)', marginBottom: '8px' }}>Era</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {ERA_OPTIONS.map(era => {
                const active = form.era.includes(era)
                return (
                  <button
                    key={era}
                    type="button"
                    onClick={() => toggleArray('era', era)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '999px',
                      border: `1.5px solid ${active ? 'var(--red-400)' : '#e5e0d8'}`,
                      background: active ? 'var(--red-50)' : 'white',
                      color: active ? 'var(--red-500)' : 'var(--muted)',
                      fontSize: '13px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      fontFamily: "'DM Sans', sans-serif",
                      transition: 'all 0.15s',
                    }}
                  >{era}</button>
                )
              })}
            </div>
          </div>

          {/* Occasions */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--black)', marginBottom: '8px' }}>Occasions</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {OCCASION_OPTIONS.map(occ => {
                const active = form.occasions.includes(occ)
                return (
                  <button
                    key={occ}
                    type="button"
                    onClick={() => toggleArray('occasions', occ)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '999px',
                      border: `1.5px solid ${active ? 'var(--red-400)' : '#e5e0d8'}`,
                      background: active ? 'var(--red-50)' : 'white',
                      color: active ? 'var(--red-500)' : 'var(--muted)',
                      fontSize: '13px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      fontFamily: "'DM Sans', sans-serif",
                      textTransform: 'capitalize',
                      transition: 'all 0.15s',
                    }}
                  >{occ}</button>
                )
              })}
            </div>
          </div>

          {/* In Stock */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ToggleSwitch checked={form.inStock} onChange={v => set('inStock', v)} />
            <div>
              <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--black)' }}>In Stock</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Product is available for purchase</div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px',
                border: '1.5px solid #e5e0d8',
                borderRadius: '10px',
                background: 'white',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                color: 'var(--muted)',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                flex: 2,
                padding: '12px',
                border: 'none',
                borderRadius: '10px',
                background: 'var(--red-400)',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                color: 'white',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Products Tab ─────────────────────────────────
function ProductsTab() {
  const [search, setSearch] = useState('')
  const [rows, setRows] = useState(productsData.map(p => ({ ...p, inStock: true })))
  const [showAddForm, setShowAddForm] = useState(false)
  const categories = [...new Set(productsData.map(p => p.category))]

  const filtered = rows.filter(p => {
    const q = search.toLowerCase()
    return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
  })

  function updateRow(id, field, value) {
    setRows(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p))
  }

  const statCards = [
    { label: 'Total Products', value: rows.length },
    { label: 'Categories', value: categories.length },
  ]

  function addProduct(product) {
    setRows(prev => [product, ...prev])
  }

  return (
    <div>
      {showAddForm && <AddProductModal onClose={() => setShowAddForm(false)} onAdd={addProduct} />}
      {/* Stats Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {statCards.map(s => (
          <div key={s.label} style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px 24px',
            boxShadow: '0 2px 8px var(--card-shadow)',
            borderLeft: '3px solid var(--red-400)',
          }}>
            <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>{s.label}</div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--black)', fontFamily: "'Playfair Display', serif" }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 2px 8px var(--card-shadow)', overflow: 'hidden' }}>
        {/* Toolbar */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #f0e8d8',
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
        }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <svg style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ ...inputStyle, paddingLeft: '36px', background: 'var(--off-white)' }}
            />
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            style={{
              background: 'var(--red-400)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '9px 16px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: "'DM Sans', sans-serif",
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Product
          </button>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#faf6ef' }}>
                {['Image', 'Name', 'Category', 'Price', 'Unit', 'In Stock', 'Actions'].map(col => (
                  <th key={col} style={{
                    padding: '10px 14px',
                    textAlign: 'left',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'var(--muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    borderBottom: '1px solid #f0e8d8',
                    whiteSpace: 'nowrap',
                  }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((product, i) => (
                <tr key={product.id} style={{
                  borderBottom: '1px solid #f8f4ee',
                  background: i % 2 === 0 ? 'white' : '#fdfaf5',
                }}>
                  <td style={{ padding: '10px 14px' }}>
                    <img
                      src={`${base}images/products/${product.image}`}
                      alt={product.name}
                      style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #f0e8d8', background: '#fef9ee' }}
                      onError={e => { e.target.src = `${base}images/logo.png` }}
                    />
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <input
                      type="text"
                      defaultValue={product.name}
                      style={{ ...inputStyle, width: '170px', padding: '6px 10px', fontSize: '13px' }}
                    />
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <select defaultValue={product.category} style={{ ...selectStyle, width: 'auto', padding: '6px 10px', fontSize: '13px' }}>
                      {categories.map(c => (
                        <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e5e0d8', borderRadius: '8px', overflow: 'hidden', width: '88px' }}>
                      <span style={{ padding: '6px 8px', background: '#f8f4ee', fontSize: '13px', color: 'var(--muted)', borderRight: '1px solid #e5e0d8', flexShrink: 0 }}>$</span>
                      <input
                        type="number"
                        defaultValue={product.price}
                        step="0.50"
                        min="0"
                        style={{ border: 'none', padding: '6px 8px', fontSize: '13px', fontFamily: "'DM Sans', sans-serif", width: '100%', outline: 'none', color: 'var(--black)' }}
                      />
                    </div>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <input
                      type="text"
                      defaultValue={product.priceUnit}
                      style={{ ...inputStyle, width: '68px', padding: '6px 10px', fontSize: '13px' }}
                    />
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <ToggleSwitch
                      checked={product.inStock}
                      onChange={val => updateRow(product.id, 'inStock', val)}
                    />
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button title="Edit" style={{
                        border: '1px solid #e5e0d8', borderRadius: '6px', padding: '6px', background: 'white',
                        cursor: 'pointer', color: 'var(--muted)', display: 'flex', alignItems: 'center',
                      }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button title="Delete" style={{
                        border: '1px solid #fee2e2', borderRadius: '6px', padding: '6px', background: '#fff5f5',
                        cursor: 'pointer', color: 'var(--red-400)', display: 'flex', alignItems: 'center',
                      }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6M14 11v6" />
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--muted)', fontSize: '14px' }}>
              No products found matching &ldquo;{search}&rdquo;
            </div>
          )}
        </div>

        {/* Table footer */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid #f0e8d8', fontSize: '12px', color: 'var(--muted)' }}>
          Showing {filtered.length} of {rows.length} products
        </div>
      </div>
    </div>
  )
}

// ── Chatbot Tab ──────────────────────────────────
function ChatbotTab() {
  const [open, setOpen] = useState({ identity: true, store: false, capabilities: false, safety: false, preview: false })
  const [name, setName] = useState('Biscuit King')
  const [greeting, setGreeting] = useState("Hi, I'm Biscuit King! 👋 Your guide to Singapore's best old-school snacks. Whether you're hunting for childhood favourites or looking for the perfect gift tin, I'm here to help. What are you looking for today?")
  const [personality, setPersonality] = useState('Friendly Uncle')
  const [singlish, setSinglish] = useState(true)
  const [responseLength, setResponseLength] = useState('Short (2-4 sentences)')
  const [address, setAddress] = useState('130 Casuarina Road, Singapore 579518')
  const [hours, setHours] = useState('Tuesday – Sunday, 11am – 10pm (Closed on Mondays)')
  const [phone, setPhone] = useState('+65 6454 5938')
  const [whatsapp, setWhatsapp] = useState('9729 6540')
  const [tinPricing, setTinPricing] = useState('Choose up to 4 flavours per tin, from $30')
  const [pickup, setPickup] = useState('In-store pickup available')
  const [capabilities, setCapabilities] = useState([
    { id: 'era', label: 'Recommend snacks by era (e.g. "I\'m a 90s kid")', on: true },
    { id: 'flavour', label: 'Recommend by flavour preference (sweet, sour, savoury)', on: true },
    { id: 'occasion', label: 'Recommend by occasion (CNY, Hari Raya, gifting, parties)', on: true },
    { id: 'budget', label: 'Suggest gift tin combinations within a budget', on: true },
    { id: 'product', label: 'Answer questions about specific products', on: true },
    { id: 'compare', label: 'Compare products when asked', on: true },
    { id: 'pairings', label: 'Suggest pairings ("If you like X, you\'ll also love Y")', on: true },
  ])
  const [safety, setSafety] = useState([
    { id: 's1', label: 'Only recommend products that exist in the catalogue', on: true },
    { id: 's2', label: 'If asked about an unknown product, redirect to real alternatives', on: true },
    { id: 's3', label: 'Always include the exact price and unit when recommending', on: true },
    { id: 's4', label: 'If unsure about any detail, say so honestly', on: true },
    { id: 's5', label: 'Never make up promotions or discounts', on: true },
    { id: 's6', label: 'Redirect off-topic questions back to snacks', on: true },
    { id: 's7', label: 'Always use exact product names and prices from the catalogue', on: true },
  ])
  const [showToast, setShowToast] = useState(false)
  const [copied, setCopied] = useState(false)
  const toastTimer = useRef(null)

  function toggle(key) {
    setOpen(prev => ({ ...prev, [key]: !prev[key] }))
  }

  function toggleCap(id) {
    setCapabilities(prev => prev.map(c => c.id === id ? { ...c, on: !c.on } : c))
  }

  function toggleSafety(id) {
    setSafety(prev => prev.map(r => r.id === id ? { ...r, on: !r.on } : r))
  }

  function handleSave() {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setShowToast(true)
    toastTimer.current = setTimeout(() => setShowToast(false), 3000)
  }

  function handleCopy() {
    navigator.clipboard.writeText(SYSTEM_PROMPT_PREVIEW)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Status Card */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px var(--card-shadow)' }}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', fontWeight: 700, color: 'var(--black)', marginBottom: '16px' }}>
          Chatbot Status
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          {[
            { label: 'Status', value: <><span style={{ color: '#22c55e' }}>●</span> Online</> },
            { label: 'Model', value: 'claude-sonnet-4-20250514' },
            { label: 'Products Loaded', value: productsData.length },
            { label: 'Last Updated', value: '25 Mar 2026' },
          ].map(item => (
            <div key={item.label} style={{ padding: '14px 16px', background: 'var(--off-white)', borderRadius: '10px' }}>
              <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>{item.label}</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--black)' }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Monitoring Logs */}
      <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px var(--card-shadow)' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0e8d8' }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', fontWeight: 700, color: 'var(--black)' }}>Monitoring Logs</h3>
          <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '3px' }}>Recent chatbot interactions and validation results</p>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#faf6ef' }}>
                {['Time', 'User Query', 'Status', 'Products Mentioned', 'Issues'].map(col => (
                  <th key={col} style={{
                    padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700,
                    color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em',
                    borderBottom: '1px solid #f0e8d8', whiteSpace: 'nowrap',
                  }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MONITORING_LOGS.map((log, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f8f4ee', background: i % 2 === 0 ? 'white' : '#fdfaf5' }}>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--muted)', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>{log.time}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--black)' }}>{log.query}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      display: 'inline-block', padding: '3px 10px', borderRadius: '999px',
                      fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em',
                      background: log.status === 'PASS' ? '#dcfce7' : '#fee2e2',
                      color: log.status === 'PASS' ? '#16a34a' : '#dc2626',
                    }}>{log.status}</span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--black)' }}>{log.products}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: log.issues === 'None' ? 'var(--muted)' : '#dc2626' }}>{log.issues}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Settings Accordion */}
      <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px var(--card-shadow)' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0e8d8' }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', fontWeight: 700, color: 'var(--black)' }}>Chatbot Settings</h3>
        </div>

        {/* Section 1: Identity */}
        <AccordionSection title="Chatbot Identity" description="Control how the chatbot introduces itself and communicates" isOpen={open.identity} onToggle={() => toggle('identity')}>
          <FormField label="Chatbot Name" helper="The name your chatbot introduces itself as">
            <input type="text" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
          </FormField>
          <FormField label="Greeting Message" helper="The first message customers see when they open the chat">
            <textarea value={greeting} onChange={e => setGreeting(e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          </FormField>
          <FormField label="How should the chatbot talk?" helper="">
            <select value={personality} onChange={e => setPersonality(e.target.value)} style={selectStyle}>
              {['Friendly Uncle', 'Professional', 'Casual & Fun'].map(o => <option key={o}>{o}</option>)}
            </select>
          </FormField>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <ToggleSwitch checked={singlish} onChange={setSinglish} />
            <div>
              <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--black)' }}>Use Singlish</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>Allow the chatbot to use local expressions like 'shiok' and 'best lah'</div>
            </div>
          </div>
          <FormField label="How long should responses be?" helper="">
            <select value={responseLength} onChange={e => setResponseLength(e.target.value)} style={selectStyle}>
              {['Short (2-4 sentences)', 'Medium (4-6 sentences)', 'Detailed'].map(o => <option key={o}>{o}</option>)}
            </select>
          </FormField>
        </AccordionSection>

        {/* Section 2: Store Info */}
        <AccordionSection title="Store Information" description="Shop details the chatbot shares with customers" isOpen={open.store} onToggle={() => toggle('store')}>
          <FormField label="Shop Address" helper="Your shop's physical address">
            <input type="text" value={address} onChange={e => setAddress(e.target.value)} style={inputStyle} />
          </FormField>
          <FormField label="Opening Hours" helper="When your shop is open">
            <input type="text" value={hours} onChange={e => setHours(e.target.value)} style={inputStyle} />
          </FormField>
          <FormField label="Phone Number" helper="Main contact number">
            <input type="text" value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle} />
          </FormField>
          <FormField label="WhatsApp" helper="WhatsApp number for customer enquiries">
            <input type="text" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} style={inputStyle} />
          </FormField>
          <FormField label="Tin Pricing" helper="Mix & match tin pricing details">
            <input type="text" value={tinPricing} onChange={e => setTinPricing(e.target.value)} style={inputStyle} />
          </FormField>
          <FormField label="Pickup / Delivery Policy" helper="How customers can collect their orders">
            <textarea value={pickup} onChange={e => setPickup(e.target.value)} rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
          </FormField>
        </AccordionSection>

        {/* Section 3: Capabilities */}
        <AccordionSection title="Chatbot Capabilities" description="Toggle which types of recommendations the chatbot can make" isOpen={open.capabilities} onToggle={() => toggle('capabilities')}>
          <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.5 }}>
            Choose what your chatbot can help customers with. Disabling an option means the chatbot will politely decline that type of request.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {capabilities.map(cap => (
              <div key={cap.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <ToggleSwitch checked={cap.on} onChange={() => toggleCap(cap.id)} />
                <span style={{ fontSize: '14px', color: 'var(--black)' }}>{cap.label}</span>
              </div>
            ))}
          </div>
        </AccordionSection>

        {/* Section 4: Safety Rules */}
        <AccordionSection title="Safety Rules" description="Prevent the chatbot from hallucinating products, prices, or promotions" isOpen={open.safety} onToggle={() => toggle('safety')} lockIcon>
          <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.5 }}>
            These rules prevent the chatbot from making up products, prices, or promotions. We recommend keeping all rules enabled.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {safety.map((rule, idx) => (
              <div key={rule.id}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 0',
                  borderBottom: idx < safety.length - 1 ? '1px solid #f8f4ee' : 'none',
                }}>
                  <span style={{ fontSize: '12px', color: 'var(--muted)', width: '18px', flexShrink: 0, fontWeight: 600 }}>{idx + 1}.</span>
                  <ToggleSwitch checked={rule.on} onChange={() => toggleSafety(rule.id)} />
                  <span style={{ fontSize: '14px', color: 'var(--black)', flex: 1 }}>{rule.label}</span>
                </div>
                {!rule.on && (
                  <div style={{
                    margin: '0 0 10px 42px',
                    padding: '8px 12px',
                    background: '#fff7ed',
                    border: '1px solid #fed7aa',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: '#c2410c',
                    lineHeight: 1.4,
                  }}>
                    ⚠ Disabling this rule may allow the chatbot to give inaccurate information
                  </div>
                )}
              </div>
            ))}
          </div>
        </AccordionSection>

        {/* Section 5: Prompt Preview */}
        <AccordionSection title="Full Prompt Preview" description="Read-only view of the complete assembled system prompt" isOpen={open.preview} onToggle={() => toggle('preview')} noBorder>
          <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.5 }}>
            This is the complete instruction sent to the AI. It's automatically built from your settings above. You cannot edit it directly — use the sections above to make changes.
          </p>
          <button
            onClick={handleCopy}
            style={{
              padding: '7px 14px',
              border: '1px solid #e5e0d8',
              borderRadius: '7px',
              background: 'white',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              color: copied ? '#16a34a' : 'var(--black)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: "'DM Sans', sans-serif",
              alignSelf: 'flex-start',
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copied ? '✓ Copied!' : 'Copy to Clipboard'}
          </button>
          <textarea
            readOnly
            value={SYSTEM_PROMPT_PREVIEW}
            rows={15}
            style={{
              width: '100%',
              fontFamily: 'monospace',
              fontSize: '12px',
              lineHeight: 1.7,
              border: '1px solid #e5e0d8',
              borderRadius: '8px',
              padding: '14px',
              background: '#faf6ef',
              color: 'var(--black)',
              resize: 'vertical',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </AccordionSection>

        {/* Save Button */}
        <div style={{ padding: '20px 24px', borderTop: '1px solid #f0e8d8' }}>
          <button
            onClick={handleSave}
            style={{
              width: '100%',
              padding: '14px',
              background: 'var(--red-400)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Toast */}
      {showToast && (
        <div style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          background: '#16a34a',
          color: 'white',
          padding: '14px 20px',
          borderRadius: '10px',
          fontSize: '14px',
          fontWeight: 600,
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          zIndex: 9999,
          fontFamily: "'DM Sans', sans-serif",
        }}>
          ✓ Chatbot settings saved
        </div>
      )}
    </div>
  )
}

// ── Main Export ──────────────────────────────────
export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [activeTab, setActiveTab] = useState('products')

  function handleLogin(e) {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setAuthed(true)
    } else {
      setError(true)
      setPassword('')
    }
  }

  if (!authed) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--off-white)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}>
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '48px 40px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
          width: '100%',
          maxWidth: '400px',
          textAlign: 'center',
        }}>
          <img src={`${base}images/logo.png`} alt="Biscuit King" style={{ height: '52px', objectFit: 'contain', marginBottom: '24px', display: 'block', margin: '0 auto 24px' }} />
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: 700, color: 'var(--black)', marginBottom: '6px' }}>
            Admin Dashboard
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '32px' }}>
            Enter your password to continue
          </p>
          <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
            <div style={{ position: 'relative', marginBottom: error ? '8px' : '16px' }}>
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(false) }}
                autoFocus
                style={{
                  ...inputStyle,
                  padding: '12px 44px 12px 16px',
                  fontSize: '15px',
                  borderRadius: '10px',
                  borderColor: error ? '#fca5a5' : '#e5e0d8',
                  background: error ? '#fff5f5' : 'var(--off-white)',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: '4px',
                  display: 'flex', alignItems: 'center',
                }}
              >
                {showPw ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {error && (
              <p style={{ fontSize: '13px', color: '#dc2626', marginBottom: '12px' }}>
                Incorrect password. Please try again.
              </p>
            )}
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                background: 'var(--red-400)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--off-white)' }}>
      <AdminHeader />

      {/* Pill Toggle */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 24px 0' }}>
        <div style={{
          background: '#ede8df',
          borderRadius: '999px',
          padding: '4px',
          display: 'inline-flex',
        }}>
          {[['products', 'Products'], ['chatbot', 'Chatbot']].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setActiveTab(val)}
              style={{
                padding: '9px 28px',
                borderRadius: '999px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                background: activeTab === val ? 'white' : 'transparent',
                color: activeTab === val ? 'var(--black)' : 'var(--muted)',
                boxShadow: activeTab === val ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '28px 24px 80px' }}>
        {activeTab === 'products' ? <ProductsTab /> : <ChatbotTab />}
      </div>
    </div>
  )
}
