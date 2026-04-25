import { useState, useEffect, useMemo } from 'react';
import { Plus, Edit2, Trash2, Power, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AdminLayout from '@components/admin/AdminLayout';
import DataTable from '@components/admin/DataTable';
import StatusBadge from '@components/admin/StatusBadge';
import ImageUploader from '@components/admin/ImageUploader';
import ConfirmDialog from '@components/admin/ConfirmDialog';
import Pagination from '@components/admin/Pagination';
import {
  useGroceryProducts,
  useCreateGroceryProduct,
  useUpdateGroceryProduct,
  useDeleteGroceryProduct,
  useToggleGroceryProduct,
  useGroceryCategories,
} from '@hooks/useGroceryQueries';

const EMPTY = {
  name: '', brand: '', description: '', image: '',
  category: '',
  variants: [{ label: '', mrp: 0, sellingPrice: 0, isAvailable: true }],
  isAvailable: true,
  tags: { isBestseller: false, isNew: false },
};

export default function GroceryProducts() {
  const { data: products = [], isLoading } = useGroceryProducts();
  const { data: categories = [] } = useGroceryCategories();
  const createMut = useCreateGroceryProduct();
  const updateMut = useUpdateGroceryProduct();
  const deleteMut = useDeleteGroceryProduct();
  const toggleMut = useToggleGroceryProduct();

  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [confirmDel, setConfirmDel] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, categoryFilter]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((p) => {
      const catId = p.category?.id || p.category?._id || p.category;
      if (categoryFilter && String(catId) !== String(categoryFilter)) return false;
      if (!q) return true;
      return (
        p.name?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    });
  }, [products, searchQuery, categoryFilter]);

  const pagedProducts = useMemo(
    () => filteredProducts.slice((page - 1) * pageSize, page * pageSize),
    [filteredProducts, page, pageSize]
  );

  const openAdd = () => { setForm(EMPTY); setModal({ mode: 'add' }); };
  const openEdit = (p) => {
    setForm({
      name: p.name || '',
      brand: p.brand || '',
      description: p.description || '',
      image: p.image || '',
      category: p.category?.id || p.category || '',
      variants: p.variants?.length
        ? p.variants.map(v => ({
            _id: v._id || v.id,
            label: v.label || '',
            mrp: v.mrp ?? 0,
            sellingPrice: v.sellingPrice ?? 0,
            isAvailable: v.isAvailable ?? true,
          }))
        : [{ label: '', mrp: 0, sellingPrice: 0, isAvailable: true }],
      isAvailable: p.isAvailable ?? true,
      tags: p.tags || { isBestseller: false, isNew: false },
    });
    setModal({ mode: 'edit', id: p.id || p._id });
  };

  const setVariant = (i, patch) => {
    setForm(f => ({ ...f, variants: f.variants.map((v, idx) => idx === i ? { ...v, ...patch } : v) }));
  };
  const addVariant = () => setForm(f => ({ ...f, variants: [...f.variants, { label: '', mrp: 0, sellingPrice: 0, isAvailable: true }] }));
  const removeVariant = (i) => setForm(f => ({ ...f, variants: f.variants.filter((_, idx) => idx !== i) }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.variants.length) return toast.error('At least one variant required');
    for (const v of form.variants) {
      if (!v.label.trim()) return toast.error('Each variant needs a label');
      if (Number(v.sellingPrice) > Number(v.mrp)) return toast.error(`Variant "${v.label}" selling price exceeds MRP`);
    }
    try {
      if (modal.mode === 'add') await createMut.mutateAsync(form);
      else await updateMut.mutateAsync({ id: modal.id, ...form });
      toast.success(modal.mode === 'add' ? 'Product created' : 'Product updated');
      setModal(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    }
  };

  const columns = [
    {
      key: 'image',
      label: '',
      render: r => <img src={r.image} className="w-12 h-12 rounded object-cover" alt="" />,
    },
    {
      key: 'name',
      label: 'Name',
      render: r => (
        <div>
          <div className="font-medium">{r.name}</div>
          {r.brand && <div className="text-xs text-gray-500">{r.brand}</div>}
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      render: r => {
        const catId = r.category?.id || r.category;
        return categories.find(c => (c.id || c._id) === catId)?.name || '—';
      },
    },
    {
      key: 'variants',
      label: 'Variants',
      render: r => {
        if (!r.variants?.length) return '—';
        const prices = r.variants.map(v => v.sellingPrice);
        return `₹${Math.min(...prices)}–₹${Math.max(...prices)} (${r.variants.length})`;
      },
    },
    {
      key: 'isAvailable',
      label: 'Status',
      render: r => <StatusBadge status={r.isAvailable} type="category" />,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: r => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleMut.mutate(r.id || r._id)}
            className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg"
            title={r.isAvailable ? 'Deactivate' : 'Activate'}
          >
            <Power size={16} />
          </button>
          <button
            onClick={() => openEdit(r)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            title="Edit"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => setConfirmDel(r)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Grocery Products</h1>
            <p className="text-gray-600 mt-1">Manage grocery products with pack-size variants</p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
          >
            <Plus size={20} />
            <span>Add Product</span>
          </button>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, brand, description…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id || c._id} value={c.id || c._id}>{c.name}</option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          </div>
        ) : (
          <>
            <DataTable
              columns={columns}
              data={pagedProducts}
              emptyMessage={
                searchQuery || categoryFilter
                  ? 'No products match these filters.'
                  : "No grocery products yet. Click 'Add Product' to create one."
              }
            />
            <Pagination
              page={page}
              pageSize={pageSize}
              total={filteredProducts.length}
              onPageChange={setPage}
              onPageSizeChange={(n) => { setPageSize(n); setPage(1); }}
            />
          </>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto">
            <form onSubmit={submit}>
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">
                  {modal.mode === 'add' ? 'Add Product' : 'Edit Product'}
                </h3>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                    <input
                      type="text"
                      value={form.brand}
                      onChange={e => setForm({ ...form, brand: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select category…</option>
                    {categories.map(c => (
                      <option key={c.id || c._id} value={c.id || c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <ImageUploader
                  value={form.image}
                  onChange={v => setForm({ ...form, image: v })}
                  label="Product image"
                />

                {/* Variants editor */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-sm text-gray-700">Variants *</span>
                    <button
                      type="button"
                      onClick={addVariant}
                      className="text-sm text-orange-600 hover:text-orange-700"
                    >
                      + Add variant
                    </button>
                  </div>
                  <div className="space-y-2">
                    {form.variants.map((v, i) => (
                      <div key={i} className="grid grid-cols-12 gap-2 items-center">
                        <input
                          className="col-span-3 px-2 py-1 border border-gray-300 rounded"
                          placeholder="1 kg"
                          value={v.label}
                          onChange={e => setVariant(i, { label: e.target.value })}
                          required
                        />
                        <input
                          className="col-span-3 px-2 py-1 border border-gray-300 rounded"
                          type="number"
                          min="0"
                          placeholder="MRP"
                          value={v.mrp}
                          onChange={e => setVariant(i, { mrp: Number(e.target.value) })}
                          required
                        />
                        <input
                          className="col-span-3 px-2 py-1 border border-gray-300 rounded"
                          type="number"
                          min="0"
                          placeholder="Sell price"
                          value={v.sellingPrice}
                          onChange={e => setVariant(i, { sellingPrice: Number(e.target.value) })}
                          required
                        />
                        <label className="col-span-2 flex items-center gap-1 text-xs text-gray-700">
                          <input
                            type="checkbox"
                            checked={v.isAvailable}
                            onChange={e => setVariant(i, { isAvailable: e.target.checked })}
                          />
                          Avail
                        </label>
                        <button
                          type="button"
                          onClick={() => removeVariant(i)}
                          className="col-span-1 text-red-600 disabled:opacity-50"
                          disabled={form.variants.length === 1}
                          title="Remove variant"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags + active */}
                <div className="flex flex-wrap gap-4 border-t border-gray-200 pt-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.tags.isBestseller}
                      onChange={e => setForm({ ...form, tags: { ...form.tags, isBestseller: e.target.checked } })}
                    />
                    Bestseller
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.tags.isNew}
                      onChange={e => setForm({ ...form, tags: { ...form.tags, isNew: e.target.checked } })}
                    />
                    New
                  </label>
                  <label className="flex items-center gap-2 text-sm ml-auto">
                    <input
                      type="checkbox"
                      checked={form.isAvailable}
                      onChange={e => setForm({ ...form, isAvailable: e.target.checked })}
                    />
                    Active
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg"
                >
                  {modal.mode === 'add' ? 'Create' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!confirmDel}
        onClose={() => setConfirmDel(null)}
        onConfirm={async () => {
          try {
            await deleteMut.mutateAsync(confirmDel.id || confirmDel._id);
            toast.success('Product deleted');
            setConfirmDel(null);
          } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete');
          }
        }}
        title="Delete Product"
        message={`Are you sure you want to delete "${confirmDel?.name}"? This cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </AdminLayout>
  );
}
