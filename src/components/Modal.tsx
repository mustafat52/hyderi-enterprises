import type { ReactNode } from 'react'

export default function Modal({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 16, color: 'var(--ink-soft)' }}
          aria-label="Close"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  )
}
