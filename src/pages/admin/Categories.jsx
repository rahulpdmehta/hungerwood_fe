/**
 * Admin Categories Page
 * Full CRUD operations for category management
 */

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Power } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import StatusBadge from '../../components/admin/StatusBadge';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import ImageUploader from '../../components/admin/ImageUploader';
import { categoryService } from '../../services/admin.service';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    isActive: true
  });
  const [sortKey, setSortKey] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAll();
      setCategories(response || []);
    } catch (error) {
      console.error('Failed to load categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedCategories = [...categories].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];

    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const handleOpenModal = (category = null) => {
    if (category) {
      setSelectedCategory(category);
      setFormData({
        name: category.name || '',
        description: category.description || '',
        image: category.image || '',
        isActive: category.isActive !== undefined ? category.isActive : true
      });
    } else {
      setSelectedCategory(null);
      setFormData({
        name: '',
        description: '',
        image: '',
        isActive: true
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCategory(null);
    setFormData({
      name: '',
      description: '',
      image: '',
      isActive: true
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = {
        name: formData.name,
        description: formData.description,
        isActive: formData.isActive
      };

      // Handle image (File or URL)
      if (formData.image instanceof File) {
        data.image = formData.image;
      } else if (typeof formData.image === 'string') {
        data.imageUrl = formData.image;
      }

      if (selectedCategory) {
        await categoryService.update(selectedCategory.id, data);
        toast.success('Category updated successfully');
      } else {
        await categoryService.create(data);
        toast.success('Category created successfully');
      }

      handleCloseModal();
      loadCategories();
    } catch (error) {
      console.error('Failed to save category:', error);
      toast.error(error.response?.data?.message || 'Failed to save category');
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;

    try {
      await categoryService.delete(selectedCategory.id);
      toast.success('Category deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedCategory(null);
      loadCategories();
    } catch (error) {
      console.error('Failed to delete category:', error);
      toast.error(error.response?.data?.message || 'Failed to delete category');
    }
  };

  const handleToggleStatus = async (category) => {
    try {
      await categoryService.toggleStatus(category.id);
      toast.success(`Category ${category.isActive ? 'deactivated' : 'activated'} successfully`);
      loadCategories();
    } catch (error) {
      console.error('Failed to toggle status:', error);
      toast.error('Failed to toggle status');
    }
  };

  const columns = [
    {
      key: 'image',
      label: 'Image',
      sortable: false,
      render: (row) => (
        <img
          src={row.image || 'https://via.placeholder.com/60'}
          alt={row.name}
          className="w-12 h-12 rounded-lg object-cover"
        />
      )
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900">{row.name}</p>
          {row.description && (
            <p className="text-xs text-gray-500 mt-1">{row.description}</p>
          )}
        </div>
      )
    },
    {
      key: 'itemCount',
      label: 'Items',
      sortable: true,
      render: (row) => (
        <span className="text-gray-700">{row.itemCount || 0}</span>
      )
    },
    {
      key: 'isActive',
      label: 'Status',
      sortable: true,
      render: (row) => <StatusBadge status={row.isActive} type="category" />
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleToggleStatus(row)}
            className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
            title={row.isActive ? 'Deactivate' : 'Activate'}
          >
            <Power size={16} />
          </button>
          <button
            onClick={() => handleOpenModal(row)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => {
              setSelectedCategory(row);
              setDeleteDialogOpen(true);
            }}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
            <p className="text-gray-600 mt-1">Manage food categories</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
          >
            <Plus size={20} />
            <span>Add Category</span>
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={sortedCategories}
            onSort={handleSort}
            sortKey={sortKey}
            sortOrder={sortOrder}
            emptyMessage="No categories found. Click 'Add Category' to create one."
          />
        )}
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit}>
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedCategory ? 'Edit Category' : 'Add Category'}
                </h3>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <ImageUploader
                  value={formData.image}
                  onChange={(value) => setFormData({ ...formData, image: value })}
                  label="Category Image"
                />

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                    Active
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
                >
                  {selectedCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedCategory(null);
        }}
        onConfirm={handleDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${selectedCategory?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </AdminLayout>
  );
};

export default Categories;
