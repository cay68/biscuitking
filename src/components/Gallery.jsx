import { useInView } from '../hooks/useInView'

const images = [
  { src: '/images/gallery/gallery 1.jpg', alt: 'Biscuit King snack shelves' },
  { src: '/images/gallery/gallery 2.jpg', alt: 'Biscuit King snacks' },
  { src: '/images/gallery/gallery 3.jpg', alt: 'Retro toys and games' },
  { src: '/images/gallery/gallery 4.jpg', alt: 'Traditional biscuit tins' },
  { src: '/images/gallery/gallery 5.jpg', alt: 'Biscuit King storefront' },
  { src: '/images/gallery/gallery 6.jpg', alt: 'Biscuit King treats' },
  { src: '/images/gallery/gallery 7.jpg', alt: 'Biscuit King collection' },
]

export default function Gallery() {
  const [ref, visible] = useInView()

  // Build the cell order: row1 (4 images), row2 (title + 3 images)
  const cells = [
    ...images.slice(0, 4).map((img) => ({ type: 'image', ...img })),
    { type: 'title' },
    ...images.slice(4).map((img) => ({ type: 'image', ...img })),
  ]

  return (
    <section ref={ref} style={{ background: 'var(--white)', padding: '60px 48px' }}>
      <div style={{ maxWidth: 880, margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gridTemplateRows: 'repeat(2, 1fr)',
            gap: 6,
          }}
          id="gallery-grid"
        >
          {cells.map((cell, i) =>
            cell.type === 'title' ? (
              <div
                key="title"
                className={`fade-up ${visible ? 'visible' : ''}`}
                style={{
                  background: 'var(--red-50)',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-start',
                  padding: 32,
                  aspectRatio: '1',
                  transitionDelay: `${i * 0.08}s`,
                }}
              >
                <h2 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', color: 'var(--black)', textAlign: 'left', lineHeight: 1.2 }}>
                  Our Wall of<br />Nostalgia
                </h2>
              </div>
            ) : (
              <div
                key={cell.src}
                className={`pop-in ${visible ? 'visible' : ''}`}
                style={{
                  borderRadius: 8,
                  overflow: 'hidden',
                  aspectRatio: '1',
                  transitionDelay: `${i * 0.08}s`,
                }}
              >
                <img
                  src={cell.src}
                  alt={cell.alt}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
              </div>
            )
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #gallery-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  )
}
