export function fmt(n: number): string {
  return Math.round(n).toLocaleString('en-IN')
}

export function rupee(n: number): string {
  return '\u20B9' + fmt(n)
}

export function pct(a: number, b: number): number {
  if (b === 0) return 0
  return Math.min(100, Math.round((a / b) * 100))
}

export function hashSeed(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0
  }
  return h
}

export function timeAgo(ts: number): string {
  const diff = Date.now() - ts
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'just now'
  if (min < 60) return `${min} min ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr} hr ago`
  const day = Math.floor(hr / 24)
  return `${day}d ago`
}
