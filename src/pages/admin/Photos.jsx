/**
 * Admin Photos Management Page
 * Manage photo library for home page gallery
 */

import { useState, useEffect } from 'react';
import { Eye, Edit, Trash2, Plus, X, Save, Image as ImageIcon, Star } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import { photoService } from '../../services/admin.service';

const AdminPhotos = () => {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingPhoto, setEditingPhoto] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        category: 'Food',
        url: '',
        isFeatured: false,
        isActive: true,
        displayOrder: 0,
        description: ''
    });

    const categories = ['Food', 'Restaurant', 'Ambiance', 'Events', 'Other'];

    useEffect(() => {
        loadPhotos();
    }, []);

    const loadPhotos = async () => {
        try {
            setLoading(true);
            const data = await photoService.getAll(true);
            setPhotos(data);
        } catch (error) {
            console.error('Failed to load photos:', error);
            toast.error(error.message || 'Failed to load photos');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingPhoto(null);
        setFormData({
            title: '',
            category: 'Food',
            url: '',
            isFeatured: false,
            isActive: true,
            displayOrder: photos.length,
            description: ''
        });
        setModalOpen(true);
    };

    const handleEdit = (photo) => {
        setEditingPhoto(photo);
        setFormData({
            title: photo.title || '',
            category: photo.category || 'Food',
            url: photo.url || '',
            isFeatured: photo.isFeatured || false,
            isActive: photo.isActive !== undefined ? photo.isActive : true,
            displayOrder: photo.displayOrder || 0,
            description: photo.description || ''
        });
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this photo?')) {
            try {
                await photoService.delete(id);
                toast.success('Photo deleted successfully');
                loadPhotos();
            } catch (error) {
                console.error('Failed to delete photo:', error);
                toast.error(error.message || 'Failed to delete photo');
            }
        }
    };

    const handleToggleStatus = async (photo) => {
        try {
            await photoService.update(photo.id, {
                isActive: !photo.isActive
            });
            toast.success(`Photo ${photo.isActive ? 'deactivated' : 'activated'} successfully`);
            loadPhotos();
        } catch (error) {
            console.error('Failed to toggle photo status:', error);
            toast.error(error.message || 'Failed to toggle photo status');
        }
    };

    const handleSave = async () => {
        if (!formData.title || !formData.url) {
            toast.error('Title and URL are required');
            return;
        }

        try {
            if (editingPhoto) {
                await photoService.update(editingPhoto.id, formData);
                toast.success('Photo updated successfully');
            } else {
                await photoService.create(formData);
                toast.success('Photo created successfully');
            }

            setModalOpen(false);
            loadPhotos();
        } catch (error) {
            console.error('Failed to save photo:', error);
            toast.error(error.message || 'Failed to save photo');
        }
    };

    const columns = [
        {
            key: 'preview',
            label: 'Preview',
            sortable: false,
            render: (row) => (
                <div className="flex items-center gap-3">
                    {row.url ? (
                        <img
                            src={row.url}
                            alt={row.title}
                            className="w-20 h-20 object-cover rounded-lg"
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/80x80?text=Image';
                            }}
                        />
                    ) : (
                        <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                            <ImageIcon size={20} className="text-gray-400" />
                        </div>
                    )}
                    <div>
                        <p className="font-medium text-gray-900">{row.title}</p>
                        <p className="text-xs text-gray-500">{row.category}</p>
                    </div>
                </div>
            )
        },
        {
            key: 'category',
            label: 'Category',
            sortable: true,
            render: (row) => (
                <span className="text-sm text-gray-700 capitalize">{row.category}</span>
            )
        },
        {
            key: 'featured',
            label: 'Featured',
            sortable: true,
            render: (row) => (
                row.isFeatured ? (
                    <div className="flex items-center gap-1 text-orange-600">
                        <Star size={16} className="fill-current" />
                        <span className="text-xs font-medium">Featured</span>
                    </div>
                ) : (
                    <span className="text-xs text-gray-400">-</span>
                )
            )
        },
        {
            key: 'displayOrder',
            label: 'Order',
            sortable: true,
            render: (row) => (
                <span className="text-sm font-medium text-gray-900">#{row.displayOrder || 0}</span>
            )
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (row) => (
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                    row.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-200 text-gray-700'
                }`}>
                    {row.isActive ? 'Active' : 'Inactive'}
                </span>
            )
        },
        {
            key: 'actions',
            label: 'Actions',
            sortable: false,
            render: (row) => (
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => handleEdit(row)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                    >
                        <Edit size={16} />
                    </button>
                    <button
                        onClick={() => handleToggleStatus(row)}
                        className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                            row.isActive
                                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                    >
                        {row.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                        onClick={() => handleDelete(row.id)}
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
                        <h1 className="text-2xl font-bold text-gray-900">Photo Library</h1>
                        <p className="text-gray-600 mt-1">Manage photos for home page gallery</p>
                    </div>
                    <button
                        onClick={handleAdd}
                        className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                        <Plus size={20} />
                        <span>Add Photo</span>
                    </button>
                </div>

                {/* Data Table */}
                <DataTable
                    data={photos}
                    columns={columns}
                    loading={loading}
                    searchable
                    searchPlaceholder="Search photos by title..."
                />

                {/* Add/Edit Modal */}
                {modalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {editingPhoto ? 'Edit Photo' : 'Add New Photo'}
                                </h2>
                                <button
                                    onClick={() => setModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                        placeholder="Enter photo title"
                                    />
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Category <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* URL */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Image URL <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.url}
                                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                    {formData.url && (
                                        <div className="mt-2">
                                            <img
                                                src={formData.url}
                                                alt="Preview"
                                                className="w-full h-48 object-cover rounded-lg border"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                        placeholder="Enter photo description (optional)"
                                        rows={3}
                                        maxLength={500}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        {formData.description.length}/500 characters
                                    </p>
                                </div>

                                {/* Display Order */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Display Order
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.displayOrder}
                                        onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                        placeholder="0"
                                        min="0"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Lower numbers appear first. Featured photos always appear first.
                                    </p>
                                </div>

                                {/* Checkboxes */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={formData.isFeatured}
                                            onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                            className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                                        />
                                        <span className="text-sm text-gray-700">Featured (shows first in gallery)</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={formData.isActive}
                                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                            className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                                        />
                                        <span className="text-sm text-gray-700">Active (visible on home page)</span>
                                    </label>
                                </div>
                            </div>

                            <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex items-center justify-end gap-3">
                                <button
                                    onClick={() => setModalOpen(false)}
                                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
                                >
                                    <Save size={16} />
                                    {editingPhoto ? 'Update Photo' : 'Create Photo'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminPhotos;
