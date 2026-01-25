/**
 * Admin Menu Items Page
 * Full CRUD operations for menu item management
 */

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Power, Search, Leaf } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import StatusBadge from '../../components/admin/StatusBadge';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import ImageUploader from '../../components/admin/ImageUploader';
import { menuItemService, categoryService } from '../../services/admin.service';

const AdminMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    isVeg: true,
    isAvailable: true,
    isBestSeller: false,
    discount: 0,
  });
  const [sortKey, setSortKey] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [menuResponse, categoryResponse] = await Promise.all([
        menuItemService.getAll(),
        categoryService.getAll()
      ]);
      setMenuItems(menuResponse || []);
      setCategories(categoryResponse || []);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('Failed to load menu items');
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

  // Filter and sort menu items
  const filteredMenuItems = menuItems.filter(item => {
    console.log('filteredMenuItems', item);
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !categoryFilter || item.category === categoryFilter ||
      item.category?.id === categoryFilter ||
      item.category?.name === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const sortedMenuItems = [...filteredMenuItems].sort((a, b) => {
    let aVal = a[sortKey];
    let bVal = b[sortKey];

    // Handle nested category object
    if (sortKey === 'category') {
      aVal = typeof a.category === 'object' ? a.category?.name : a.category;
      bVal = typeof b.category === 'object' ? b.category?.name : b.category;
    }

    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const handleOpenModal = (item = null) => {
    if (item) {
      setSelectedItem(item);
      console.log('handleOpenModal', item);
      
      // Handle category: can be string (name), object with _id/id, or ObjectId
      let categoryId = '';
      if (item.category) {
        if (typeof item.category === 'object') {
          // Category is an object - use _id or id
          categoryId = item.category._id || item.category.id || '';
        } else if (typeof item.category === 'string') {
          // Category is a string (name) - find matching category by name
          const matchingCategory = categories.find(cat => 
            cat.name === item.category || 
            cat.name?.toLowerCase() === item.category.toLowerCase() ||
            String(cat._id) === item.category ||
            String(cat.id) === item.category
          );
          // Use id first (from transformation), then _id, then fallback to the string itself
          categoryId = matchingCategory?.id || matchingCategory?._id || item.category;
        }
      }
      
      setFormData({
        id: item.id || '',
        name: item.name || '',
        description: item.description || '',
        price: item.price || '',
        category: categoryId,
        image: item.image || '',
        isVeg: item.isVeg !== undefined ? item.isVeg : true,
        isAvailable: item.isAvailable !== undefined ? item.isAvailable : true,
        isBestSeller: item.isBestSeller || false,
        discount: item.discount || 0
      });
    } else {
      setSelectedItem(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: categories[0]?.id || '',
        image: '',
        isVeg: true,
        isAvailable: true,
        isBestSeller: false,
        discount: 0
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      image: '',
      isVeg: true,
      isAvailable: true,
      isBestSeller: false,
      discount: 0
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        isVeg: formData.isVeg,
        isAvailable: formData.isAvailable,
        isBestSeller: formData.isBestSeller,
        discount: parseFloat(formData.discount) || 0
      };

      // Handle image (File or URL)
      if (formData.image instanceof File) {
        data.image = formData.image;
      } else if (typeof formData.image === 'string') {
        data.imageUrl = formData.image;
      }

      if (selectedItem) {
        const itemId = selectedItem.id;
        if (!itemId) {
          toast.error('Item ID is missing');
          return;
        }
        await menuItemService.update(itemId, data);
        toast.success('Menu item updated successfully');
      } else {
        await menuItemService.create(data);
        toast.success('Menu item created successfully');
      }

      handleCloseModal();
      loadData();
    } catch (error) {
      console.error('Failed to save menu item:', error);
      toast.error(error.response?.data?.message || 'Failed to save menu item');
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;

    try {
      const itemId = selectedItem.id;
      if (!itemId) {
        toast.error('Item ID is missing');
        return;
      }
      await menuItemService.delete(itemId);
      toast.success('Menu item deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedItem(null);
      loadData();
    } catch (error) {
      console.error('Failed to delete menu item:', error);
      toast.error(error.response?.data?.message || 'Failed to delete menu item');
    }
  };

  const handleToggleAvailability = async (item) => {
    try {
      const itemId = item.id;
      if (!itemId) {
        toast.error('Item ID is missing');
        return;
      }
      console.log('handleToggleAvailability', itemId);
      await menuItemService.toggleAvailability(itemId);
      toast.success(`Item ${item.isAvailable ? 'marked unavailable' : 'marked available'}`);
      loadData();
    } catch (error) {
      console.error('Failed to toggle availability:', error);
      toast.error('Failed to toggle availability');
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
        <div className="max-w-xs">
          <div className="flex items-center space-x-2">
            <p className="font-medium text-gray-900">{row.name}</p>
            {row.isVeg && (
              <Leaf size={14} className="text-green-600" title="Vegetarian" />
            )}
          </div>
          {row.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-1">{row.description}</p>
          )}
        </div>
      )
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      render: (row) => (
        <span className="text-sm text-gray-700">
          {typeof row.category === 'object' ? row.category?.name : row.category}
        </span>
      )
    },
    {
      key: 'price',
      label: 'Price',
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900">₹{row.price}</p>
          {row.discount > 0 && (
            <p className="text-xs text-green-600">{row.discount}% off</p>
          )}
        </div>
      )
    },
    {
      key: 'isAvailable',
      label: 'Status',
      sortable: true,
      render: (row) => <StatusBadge status={row.isAvailable} type="availability" />
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleToggleAvailability(row)}
            className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
            title={row.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
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
              setSelectedItem(row);
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
            <h1 className="text-2xl font-bold text-gray-900">Menu Items</h1>
            <p className="text-gray-600 mt-1">Manage your menu offerings</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
          >
            <Plus size={20} />
            <span>Add Item</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search menu items..."
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
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={sortedMenuItems}
            onSort={handleSort}
            sortKey={sortKey}
            sortOrder={sortOrder}
            emptyMessage="No menu items found. Click 'Add Item' to create one."
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
                  {selectedItem ? 'Edit Menu Item' : 'Add Menu Item'}
                </h3>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
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

                  <div className="col-span-2">
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat._id || cat.id} value={cat._id || cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <ImageUploader
                  value={formData.image}
                  onChange={(value) => setFormData({ ...formData, image: value })}
                  label="Item Image"
                />

                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isVeg}
                      onChange={(e) => setFormData({ ...formData, isVeg: e.target.checked })}
                      className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Vegetarian</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isAvailable}
                      onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                      className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Available</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isBestSeller}
                      onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                      className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Best Seller</span>
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
                  {selectedItem ? 'Update' : 'Create'}
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
          setSelectedItem(null);
        }}
        onConfirm={handleDelete}
        title="Delete Menu Item"
        message={`Are you sure you want to delete "${selectedItem?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </AdminLayout>
  );
};

export default AdminMenu;
