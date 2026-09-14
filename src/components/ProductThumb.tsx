export default function ProductThumb({ name, color, size = 44 }: { name: string; color: string; size?: number }) {
  const initial = name.trim().charAt(0).toUpperCase() || '?'
  return (
    <div
      style={{
        width: size, height: size, borderRadius: 6, background: color, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Fraunces', serif", fontWeight: 600, color: '#fff',
        fontSize: size * 0.42, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.25)',
      }}
      aria-hidden="true"
    >
      {initial}
    </div>
  )
}