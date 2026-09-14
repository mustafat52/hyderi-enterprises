import { useModalController } from '../state/ModalController'
import EditVariantModal from './modals/EditVariantModal'
import AddCategoryModal from './modals/AddCategoryModal'
import AddProductModal from './modals/AddProductModal'
import AddVariantModal from './modals/AddVariantModal'

export default function ModalHost() {
  const { modal, close } = useModalController()
  if (!modal) return null

  switch (modal.type) {
    case 'editVariant':
      return <EditVariantModal variantId={modal.variantId} label={modal.label} currentLimit={modal.currentLimit} onClose={close} />
    case 'addCategory':
      return <AddCategoryModal onClose={close} />
    case 'addProduct':
      return <AddProductModal categoryId={modal.categoryId} brandId={modal.brandId} onClose={close} />
    case 'addVariant':
      return <AddVariantModal categoryId={modal.categoryId} brandId={modal.brandId} productId={modal.productId} productLabel={modal.productLabel} onClose={close} />
    default:
      return null
  }
}