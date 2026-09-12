import { createContext, useContext, useState, type ReactNode } from 'react'

export type ModalState =
  | { type: 'transfer'; variantId: string; label: string }
  | { type: 'adjust'; variantId: string; label: string }
  | { type: 'limit'; variantId: string; label: string; currentLimit: number }
  | { type: 'addCategory' }
  | { type: 'addProduct'; categoryId: string; brandId: string | null }
  | { type: 'addVariant'; categoryId: string; brandId: string; productId: string; productLabel: string }
  | { type: 'quickUpdate' }
  | null

interface ModalControllerValue {
  modal: ModalState
  open: (m: ModalState) => void
  close: () => void
}

const ModalControllerContext = createContext<ModalControllerValue | null>(null)

export function ModalControllerProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<ModalState>(null)
  return (
    <ModalControllerContext.Provider value={{ modal, open: setModal, close: () => setModal(null) }}>
      {children}
    </ModalControllerContext.Provider>
  )
}

export function useModalController(): ModalControllerValue {
  const ctx = useContext(ModalControllerContext)
  if (!ctx) throw new Error('useModalController must be used within ModalControllerProvider')
  return ctx
}
