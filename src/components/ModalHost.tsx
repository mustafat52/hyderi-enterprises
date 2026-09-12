import { useModalController } from '../state/ModalController'
import TransferModal from './modals/TransferModal'
import AdjustModal from './modals/AdjustModal'
import LimitModal from './modals/LimitModal'
import AddCategoryModal from './modals/AddCategoryModal'
import AddProductModal from './modals/AddProductModal'
import AddVariantModal from './modals/AddVariantModal'
import QuickUpdateModal from './modals/QuickUpdateModal'

export default function ModalHost() {
  const { modal, close } = useModalController()
  if (!modal) return null

  switch (modal.type) {
    case 'transfer':
      return <TransferModal variantId={modal.variantId} label={modal.label} onClose={close} />
    case 'adjust':
      return <AdjustModal variantId={modal.variantId} label={modal.label} onClose={close} />
    case 'limit':
      return <LimitModal variantId={modal.variantId} label={modal.label} currentLimit={modal.currentLimit} onClose={close} />
    case 'addCategory':
      return <AddCategoryModal onClose={close} />
    case 'addProduct':
      return <AddProductModal categoryId={modal.categoryId} brandId={modal.brandId} onClose={close} />
    case 'addVariant':
      return <AddVariantModal categoryId={modal.categoryId} brandId={modal.brandId} productId={modal.productId} productLabel={modal.productLabel} onClose={close} />
    case 'quickUpdate':
      return <QuickUpdateModal onClose={close} />
    default:
      return null
  }
}
