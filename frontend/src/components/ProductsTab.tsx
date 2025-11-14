import type { Product } from '../types'
import { useProducts } from '../hooks/useProducts'
import { useFilters } from '../hooks/useFilters'
import { usePagination } from '../hooks/usePagination'
import { useToastContext } from '../contexts/ToastContext'

interface ProductsTabProps {
  uploadStatus: string
  setUploadStatus: (status: string) => void
}

export function ProductsTab({ uploadStatus, setUploadStatus }: ProductsTabProps) {
  const {
    products,
    editingProduct,
    setEditingProduct,
    createProduct,
    saveProduct,
    deleteProduct,
    bulkDelete,
    fetchFilteredProducts,
  } = useProducts()

  const { filters, setFilters } = useFilters()
  const { currentPage, paginate, totalPages, nextPage, prevPage } = usePagination(10)
  const { showToast } = useToastContext()

  const paginatedProducts = paginate(products)
  const totalPagesCount = totalPages(products.length)

  const handleBulkDelete = async () => {
    if (await bulkDelete()) {
      showToast('All products deleted successfully', 'success')
      setUploadStatus('All products deleted successfully')
      setTimeout(() => setUploadStatus(''), 3000)
    }
  }

  const handleSaveProduct = async (product: Product) => {
    if (!product.sku.trim() || !product.name.trim()) {
      showToast('SKU and Name are required', 'error')
      return
    }
    const isEdit = !!product.id
    try {
      const result = await saveProduct(product)
      if (result && result.status) {
        showToast(result.message || (isEdit ? 'Product updated successfully' : 'Product created successfully'), 'success')
      } else {
        showToast(result && result.message ? result.message : 'Failed to save product', 'error')
      }
    } catch (error: any) {
      let message = 'Failed to save product';
      if (error && error.message) message = error.message;
      showToast(message, 'error');
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      // Find product by id to get SKU
      const product = products.find((p) => p.id === id)
      if (!product) {
        showToast('Product not found', 'error')
        return
      }
      const success = await deleteProduct(product.sku)
      if (success) {
        showToast('Product deleted successfully', 'success')
      } else {
        showToast('Failed to delete product', 'error')
      }
    }
  }

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2 className="m-0 text-3xl">Product Management</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setEditingProduct({ id: '', sku: '', name: '', description: '', active: true })}
            className="px-6 py-3 bg-[#646cff] text-white border-none rounded-lg cursor-pointer text-base transition-colors duration-300 hover:bg-[#535bf2]"
          >
            Add Product
          </button>
          <button
            onClick={handleBulkDelete}
            className="px-6 py-3 bg-[#f44336] text-white border-none rounded-lg cursor-pointer text-base transition-colors duration-300 hover:bg-[#d32f2f]"
          >
            Delete All Products
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 flex-wrap">
        <input
          type="text"
          placeholder="Filter by SKU"
          value={filters.sku}
          onChange={async (e) => {
            const newFilters = { ...filters, sku: e.target.value }
            setFilters(newFilters)
            await fetchFilteredProducts(newFilters)
          }}
          className="px-3 py-3 border border-[#646cff] rounded-md text-base flex-1 min-w-[150px] bg-[#1a1a1a] text-white"
        />
        <input
          type="text"
          placeholder="Filter by Name"
          value={filters.name}
          onChange={async (e) => {
            const newFilters = { ...filters, name: e.target.value }
            setFilters(newFilters)
            await fetchFilteredProducts(newFilters)
          }}
          className="px-3 py-3 border border-[#646cff] rounded-md text-base flex-1 min-w-[150px] bg-[#1a1a1a] text-white"
        />
        <input
          type="text"
          placeholder="Filter by Description"
          value={filters.description}
          onChange={async (e) => {
            const newFilters = { ...filters, description: e.target.value }
            setFilters(newFilters)
            await fetchFilteredProducts(newFilters)
          }}
          className="px-3 py-3 border border-[#646cff] rounded-md text-base flex-1 min-w-[150px] bg-[#1a1a1a] text-white"
        />
        <select
          value={filters.active}
          onChange={async (e) => {
            const newFilters = { ...filters, active: e.target.value }
            setFilters(newFilters)
            await fetchFilteredProducts(newFilters)
          }}
          className="px-3 py-3 border border-[#646cff] rounded-md text-base flex-1 min-w-[150px] bg-[#1a1a1a] text-white cursor-pointer"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      {/* Product Modal */}
      {editingProduct && (
        <div
          className="fixed inset-0 bg-black/70 flex justify-center items-center z-[1000]"
          onClick={() => setEditingProduct(null)}
        >
          <div
            className="bg-[#1a1a1a] p-8 rounded-xl max-w-[500px] w-[90%] border-2 border-[#646cff]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mt-0 mb-6 text-[#646cff] text-2xl">
              {editingProduct.id ? 'Edit Product' : 'Create Product'}
            </h3>
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-300">SKU</label>
                <input
                  type="text"
                  value={editingProduct.sku}
                  onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                  className="w-full px-3 py-3 border border-[#646cff] rounded-md text-base bg-[#242424] text-white box-border"
                  disabled={!!editingProduct.id}
                />
              {editingProduct.id && (
                <p className="mt-2 text-sm text-gray-400">SKU cannot be edited for existing products.</p>
              )}
            </div>
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-300">Name</label>
              <input
                type="text"
                value={editingProduct.name}
                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                className="w-full px-3 py-3 border border-[#646cff] rounded-md text-base bg-[#242424] text-white box-border"
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-300">Description</label>
              <textarea
                value={editingProduct.description}
                onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                className="w-full px-3 py-3 border border-[#646cff] rounded-md text-base bg-[#242424] text-white box-border min-h-[100px] resize-y"
              />
            </div>
            <div className="mb-6">
              <label className="block font-semibold text-gray-300">
                <input
                  type="checkbox"
                  checked={editingProduct.active}
                  onChange={(e) => setEditingProduct({ ...editingProduct, active: e.target.checked })}
                  className="mr-2 w-auto"
                />
                Active
              </label>
            </div>
            <div className="flex gap-4 justify-end mt-8">
              <button
                onClick={() => handleSaveProduct(editingProduct)}
                className="px-6 py-3 bg-[#646cff] text-white border-none rounded-lg cursor-pointer text-base transition-colors duration-300 hover:bg-[#535bf2]"
              >
                Save
              </button>
              <button
                onClick={() => setEditingProduct(null)}
                className="px-6 py-3 bg-gray-500 text-white border-none rounded-lg cursor-pointer text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="overflow-x-auto mb-8 border border-[#646cff] rounded-lg">
        <table className="w-full border-collapse bg-[#1a1a1a]">
          <thead>
            <tr>
              <th className="bg-[#646cff] text-white p-4 text-left font-semibold">SKU</th>
              <th className="bg-[#646cff] text-white p-4 text-left font-semibold">Name</th>
              <th className="bg-[#646cff] text-white p-4 text-left font-semibold">Description</th>
              <th className="bg-[#646cff] text-white p-4 text-left font-semibold">Status</th>
              <th className="bg-[#646cff] text-white p-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((product) => (
              <tr key={product.id} className="hover:bg-[rgba(100,108,255,0.1)]">
                <td className="p-4 border-b border-[rgba(100,108,255,0.2)]">{product.sku}</td>
                <td className="p-4 border-b border-[rgba(100,108,255,0.2)]">{product.name}</td>
                <td className="p-4 border-b border-[rgba(100,108,255,0.2)]">{product.description}</td>
                <td className="p-4 border-b border-[rgba(100,108,255,0.2)]">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      product.active
                        ? 'bg-[rgba(76,175,80,0.2)] text-[#4caf50]'
                        : 'bg-[rgba(244,67,54,0.2)] text-[#f44336]'
                    }`}
                  >
                    {product.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-4 border-b border-[rgba(100,108,255,0.2)]">
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="p-2 mx-1 bg-[#646cff] text-white border-none rounded-md cursor-pointer inline-flex items-center justify-center w-8 h-8 transition-colors duration-300 hover:bg-[#535bf2]"
                    title="Edit"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.11 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="p-2 mx-1 bg-[#f44336] text-white border-none rounded-md cursor-pointer inline-flex items-center justify-center w-8 h-8 transition-colors duration-300 hover:bg-[#d32f2f]"
                    title="Delete"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className={`px-6 py-3 border-none rounded-lg cursor-pointer ${
            currentPage === 1
              ? 'opacity-50 cursor-not-allowed bg-gray-600'
              : 'bg-[#646cff] text-white hover:bg-[#535bf2]'
          }`}
        >
          Previous
        </button>
        <span className="font-semibold">
          Page {currentPage} of {totalPagesCount}
        </span>
        <button
          onClick={() => nextPage(totalPagesCount)}
          disabled={currentPage >= totalPagesCount}
          className={`px-6 py-3 border-none rounded-lg cursor-pointer ${
            currentPage >= totalPagesCount
              ? 'opacity-50 cursor-not-allowed bg-gray-600'
              : 'bg-[#646cff] text-white hover:bg-[#535bf2]'
          }`}
        >
          Next
        </button>
      </div>

      {uploadStatus && (
        <p className="mt-4 p-4 rounded-lg bg-[rgba(76,175,80,0.2)] text-[#4caf50] border border-[#4caf50]">
          {uploadStatus}
        </p>
      )}
    </div>
  )
}

