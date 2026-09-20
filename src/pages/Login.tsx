import { useState } from 'react'
import { useAuth, STAFF_DIRECTORY } from '../state/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const [userId, setUserId] = useState(STAFF_DIRECTORY[0].id)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const ok = login(userId, password)
    if (!ok) {
      setError(true)
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5" style={{
      background: 'radial-gradient(1200px 500px at 100% -10%, rgba(153,55,42,0.06), transparent 60%), var(--paper)',
    }}>
      <div
        className={shake ? 'shake-anim' : ''}
        style={{ width: '100%', maxWidth: 380, background: 'var(--card)', border: '1px solid var(--ink)', padding: '36px 30px' }}
      >
        <div className="flex flex-col items-center mb-7">
          <div className="brand-mark" style={{ width: 46, height: 46, borderRadius: 10, marginBottom: 16 }} />
          <h1 className="text-[22px] text-center">Hyderi Enterprises</h1>
          <p className="text-[10.5px] tracking-[0.14em] uppercase mt-1" style={{ color: 'var(--ink-faint)' }}>Stock Ledger</p>
        </div>

        <form onSubmit={submit}>
          <div className="field">
            <label>Who are you?</label>
            <select
              value={userId}
              onChange={e => { setUserId(e.target.value); setError(false) }}
            >
              {STAFF_DIRECTORY.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>

          <div className="field" style={{ position: 'relative' }}>
            <label>Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => { setPassword(e.target.value); setError(false) }}
              placeholder="Enter password"
              autoFocus
              style={{ paddingRight: 44 }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(s => !s)}
              style={{ position: 'absolute', right: 10, top: 30, background: 'none', border: 'none', color: 'var(--ink-faint)', fontSize: 11, fontWeight: 600 }}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          {error && (
            <div className="text-[12px] mb-3.5 -mt-1.5" style={{ color: 'var(--barn-ink)' }}>
              That password isn't right — try again.
            </div>
          )}

          <button type="submit" className="mini-btn solid w-full !py-3 !text-[14px] mt-1">
            Unlock
          </button>
        </form>

        <p className="text-[11px] text-center mt-6" style={{ color: 'var(--ink-faint)' }}>
          Internal stock ledger — for Hyderi Enterprises staff only.
        </p>
      </div>
    </div>
  )
}