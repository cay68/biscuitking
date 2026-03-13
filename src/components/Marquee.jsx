const items = [
  'Iced Gems', 'Pineapple Tarts', 'Love Letters', 'Haw Flakes',
  'Lemon Puffs', 'Chocolate Wafers', 'Pick-up Sticks',
  'White Rabbit Candy', 'Apollo Wafers', 'Oreo',
]

const track = items.map((item) => `•  ${item}  `).join('')

export default function Marquee() {
  return (
    <section
      className="w-full overflow-hidden py-5"
      style={{ background: 'var(--white)' }}
    >
      <div className="marquee-track flex whitespace-nowrap" style={{ width: 'max-content' }}>
        <span className="text-[var(--black)] font-normal uppercase tracking-wide text-base md:text-lg px-2">
          {track}
        </span>
        <span className="text-[var(--black)] font-normal uppercase tracking-wide text-base md:text-lg px-2">
          {track}
        </span>
      </div>
    </section>
  )
}
