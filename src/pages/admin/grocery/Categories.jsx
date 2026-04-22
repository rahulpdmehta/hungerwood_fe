import { useState } from 'react';
import { Plus, Edit2, Trash2, Power } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AdminLayout from '@components/admin/AdminLayout';
import DataTable from '@components/admin/DataTable';
import StatusBadge from '@components/admin/StatusBadge';
import ConfirmDialog from '@components/admin/ConfirmDialog';
import ImageUploader from '@components/admin/ImageUploader';
import {
  useGroceryCategories,
  useCreateGroceryCategory,
  useUpdateGroceryCategory,
  useDeleteGroceryCategory,
  useToggleGroceryCategory,
} from '@hooks/useGroceryQueries';

const EMPTY = { name: '', image: '', order: 0, isActive: true };

export default function GroceryCategories() {
  const { data: categories = [], isLoading } = useGroceryCategories();
  const createMut = useCreateGroceryCategory();
  const updateMut = useUpdateGroceryCategory();
  const deleteMut = useDeleteGroceryCategory();
  const toggleMut = useToggleGroceryCategory();

  const [modal, setModal] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const openAdd = () => { setForm(EMPTY); setModal({ mode: 'add' }); };
  const openEdit = (cat) => {
    setForm({
      name: cat.name || '',
      image: cat.image || '',
      order: cat.order ?? 0,
      isActive: cat.isActive ?? true,
    });
    setModal({ mode: 'edit', id: cat.id || cat._id });
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (modal.mode === 'add') await createMut.mutateAsync(form);
      else await updateMut.mutateAsync({ id: modal.id, ...form });
      toast.success(modal.mode === 'add' ? 'Category created' : 'Category updated');
      setModal(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    }
  };

  const columns = [
    {
      key: 'image',
      label: 'Image',
      render: r => (
        <img
          src={r.image || 'https://via.placeholder.com/60'}
          className="w-12 h-12 rounded-lg object-cover"
          alt=""
        />
      ),
    },
    { key: 'name', label: 'Name', render: r => <span className="font-medium">{r.name}</span> },
    { key: 'productCount', label: 'Products', render: r => r.productCount || 0 },
    { key: 'isActive', label: 'Status', render: r => <StatusBadge status={r.isActive} type="category" /> },
    {
      key: 'actions',
      label: 'Actions',
      render: r => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleMut.mutate(r.id || r._id)}
            className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg"
            title={r.isActive ? 'Deactivate' : 'Activate'}
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
            onClick={() => setConfirmDelete(r)}
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
            <h1 className="text-2xl font-bold text-gray-900">Grocery Categories</h1>
            <p className="text-gray-600 mt-1">Manage grocery categories (Staples, Dairy, Snacks, etc.)</p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
          >
            <Plus size={20} />
            <span>Add Category</span>
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={categories}
            emptyMessage="No grocery categories yet. Click 'Add Category' to create one."
          />
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={submit}>
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">
                  {modal.mode === 'add' ? 'Add Category' : 'Edit Category'}
                </h3>
              </div>
              <div className="p-6 space-y-4">
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

                <ImageUploader
                  value={form.image}
                  onChange={v => setForm({ ...form, image: v })}
                  label="Category Image"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display order</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={e => setForm({ ...form, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={e => setForm({ ...form, isActive: e.target.checked })}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Active</span>
                </label>
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
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={async () => {
          try {
            await deleteMut.mutateAsync(confirmDelete.id || confirmDelete._id);
            toast.success('Category deleted');
            setConfirmDelete(null);
          } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete');
          }
        }}
        title="Delete Category"
        message={`Are you sure you want to delete "${confirmDelete?.name}"? This cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </AdminLayout>
  );
}
