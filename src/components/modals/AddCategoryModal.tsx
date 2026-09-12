import { useState } from 'react'
import Modal from '../Modal'
import { useInventory } from '../../state/InventoryContext'
import { useToast } from '../../utils/ToastContext'
import { EMOJI_OPTIONS, SWATCH_OPTIONS } from '../../data/seedData'

export default function AddCategoryModal({ onClose }: { onClose: () => void }) {
  const { addCategory } = useInventory()
  const { showToast } = useToast()
  const [name, setName] = useState('')
  const [unit, setUnit] = useState('')
  const [emoji, setEmoji] = useState('🪣')
  const [colors, setColors] = useState<string[]>([SWATCH_OPTIONS[0], SWATCH_OPTIONS[1]])
  const [error, setError] = useState(false)

  function toggleColor(c: string) {
    setColors(prev => {
      if (prev.includes(c)) return prev.filter(x => x !== c)
      const next = [...prev, c]
      return next.length > 2 ? next.slice(1) : next
    })
  }

  function submit() {
    if (!name.trim() || !unit.trim()) { setError(true); return }
    const finalColors: [string, string] = colors.length === 2 ? [colors[0], colors[1]] : [SWATCH_OPTIONS[0], SWATCH_OPTIONS[1]]
    addCategory(name.trim(), unit.trim(), emoji, finalColors)
    showToast(`Category "${name.trim()}" created`)
    onClose()
  }

  return (
    <Modal onClose={onClose}>
      <h3 className="text-[19px] mb-1">Add category</h3>
      <p className="text-[12.5px] mb-5" style={{ color: 'var(--ink-soft)' }}>Creates a new top-level category, like "Waterproofing" or "Adhesives".</p>
      <div className="field">
        <label>Category name</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Sandpaper & Abrasives" />
      </div>
      <div className="field">
        <label>Unit of measure</label>
        <input type="text" value={unit} onChange={e => setUnit(e.target.value)} placeholder="e.g. pc, L, kg" />
      </div>
      <div className="field">
        <label>Emoji</label>
        <input
          type="text" value={emoji} onChange={e => setEmoji(e.target.value)} maxLength={4}
          style={{ width: 60, textAlign: 'center', fontSize: 18 }}
        />
        <div className="flex gap-2 flex-wrap mt-2">
          {EMOJI_OPTIONS.map(em => (
            <div
              key={em} className="swatch-opt" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, background: 'var(--paper)' }}
              onClick={() => setEmoji(em)}
            >
              {em}
            </div>
          ))}
        </div>
      </div>
      <div className="field">
        <label>Color identity</label>
        <div className="flex gap-2 flex-wrap">
          {SWATCH_OPTIONS.map(c => (
            <div
              key={c} className={`swatch-opt ${colors.includes(c) ? 'sel' : ''}`} style={{ background: c }}
              onClick={() => toggleColor(c)}
            />
          ))}
        </div>
      </div>
      {error && <div className="text-[11.5px] mb-2" style={{ color: 'var(--barn-ink)' }}>Enter a name and unit.</div>}
      <div className="flex gap-2.5 mt-3">
        <button className="mini-btn flex-1 !py-2.5" onClick={onClose}>Cancel</button>
        <button className="mini-btn solid flex-1 !py-2.5" onClick={submit}>Create category</button>
      </div>
    </Modal>
  )
}
