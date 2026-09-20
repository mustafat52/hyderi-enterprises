import { createContext, useContext, useState, type ReactNode } from 'react'

const AUTH_KEY = 'hyderi-auth-user-v1'

export type Role = 'owner' | 'employee'

export interface StaffUser {
  id: string
  name: string
  role: Role
}

// DEMO-ONLY: plain-text passwords here are visible to anyone who opens browser
// dev tools, since this is still the frontend-only demo with no backend. This
// MUST move to real Supabase Auth (with RLS enforcing the owner/employee split
// server-side) before this goes anywhere near real use. Change these defaults
// before showing this outside your team.
const CREDENTIALS: { user: StaffUser; password: string }[] = [
  { user: { id: 'zoeb', name: 'Zoeb Bhai', role: 'owner' }, password: 'zoeb2026' },
  { user: { id: 'murtuza', name: 'Murtuza Bhai', role: 'owner' }, password: 'murtuza2026' },
  { user: { id: 'hatim', name: 'Hatim Bhai', role: 'owner' }, password: 'hatim2026' },
  { user: { id: 'burhan', name: 'Burhan Bhai', role: 'owner' }, password: 'burhan2026' },
  { user: { id: 'khadija', name: 'Khadija Ben', role: 'employee' }, password: 'khadija2026' },
]

export const STAFF_DIRECTORY: StaffUser[] = CREDENTIALS.map(c => c.user)

interface AuthContextValue {
  currentUser: StaffUser | null
  isAuthenticated: boolean
  login: (userId: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function loadUser(): StaffUser | null {
  const savedId = localStorage.getItem(AUTH_KEY)
  if (!savedId) return null
  return STAFF_DIRECTORY.find(u => u.id === savedId) || null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<StaffUser | null>(() => loadUser())

  function login(userId: string, password: string): boolean {
    const match = CREDENTIALS.find(c => c.user.id === userId && c.password === password)
    if (match) {
      localStorage.setItem(AUTH_KEY, match.user.id)
      setCurrentUser(match.user)
      return true
    }
    return false
  }

  function logout() {
    localStorage.removeItem(AUTH_KEY)
    setCurrentUser(null)
  }

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated: currentUser !== null, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}