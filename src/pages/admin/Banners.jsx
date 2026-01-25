/**
 * Admin Banners Management Page
 * Manage promotional banners, offers, and announcements
 */

import { useState, useEffect } from 'react';
import { Eye, Edit, Trash2, Plus, X, Save, Calendar, Tag, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import * as bannerService from '../../services/banner.service';

const AdminBanners = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);
    const [formData, setFormData] = useState({
        id: '',
        type: bannerService.BANNER_TYPES.OFFER,
        enabled: true,
        priority: 1,
        title: '',
        subtitle: '',
        description: '',
        badge: '',
        badgeColor: '#7f4f13',
        image: '',
        backgroundColor: 'linear-gradient(135deg, #181411 0%, #2d221a 100%)',
        textColor: '#ffffff',
        ctaText: 'Order Now',
        ctaLink: '/menu',
        validFrom: '',
        validUntil: '',
        minOrderAmount: 0,
        discountPercent: 0,
        applicableCategories: [],
        applicableOn: [],
    });

    useEffect(() => {
        loadBanners();
    }, []);

    const loadBanners = async () => {
        try {
            setLoading(true);
            const data = await bannerService.getAllBanners(true);
            setBanners(data);
        } catch (error) {
            console.error('Failed to load banners:', error);
            toast.error(error.message || 'Failed to load banners');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingBanner(null);
        setFormData({
            id: `banner_${Date.now()}`,
            type: bannerService.BANNER_TYPES.OFFER,
            enabled: true,
            priority: banners.length + 1,
            title: '',
            subtitle: '',
            description: '',
            badge: 'NEW OFFER',
            badgeColor: '#7f4f13',
            image: '',
            backgroundColor: 'linear-gradient(135deg, #181411 0%, #2d221a 100%)',
            textColor: '#ffffff',
            ctaText: 'Order Now',
            ctaLink: '/menu',
            validFrom: new Date().toISOString().split('T')[0],
            validUntil: '',
            minOrderAmount: 0,
            discountPercent: 0,
            applicableCategories: [],
            applicableOn: [],
        });
        setModalOpen(true);
    };

    const handleEdit = (banner) => {
        setEditingBanner(banner);
        setFormData({
            ...banner,
            validFrom: banner.validFrom?.split('T')[0] || '',
            validUntil: banner.validUntil?.split('T')[0] || '',
        });
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this banner?')) {
            try {
                await bannerService.deleteBanner(id);
                toast.success('Banner deleted successfully');
                loadBanners(); // Reload the list
            } catch (error) {
                console.error('Failed to delete banner:', error);
                toast.error(error.message || 'Failed to delete banner');
            }
        }
    };

    const handleToggleStatus = async (banner) => {
        try {
            await bannerService.toggleBannerStatus(banner.id);
            toast.success(`Banner ${banner.enabled ? 'disabled' : 'enabled'} successfully`);
            loadBanners(); // Reload the list
        } catch (error) {
            console.error('Failed to toggle banner status:', error);
            toast.error(error.message || 'Failed to toggle banner status');
        }
    };

    const handleSave = async () => {
        if (!formData.title || !formData.image) {
            toast.error('Title and Image are required');
            return;
        }

        try {
            if (editingBanner) {
                // Update existing banner
                await bannerService.updateBanner(editingBanner.id, formData);
                toast.success('Banner updated successfully');
            } else {
                // Create new banner
                await bannerService.createBanner(formData);
                toast.success('Banner created successfully');
            }

            setModalOpen(false);
            loadBanners(); // Reload the list
        } catch (error) {
            console.error('Failed to save banner:', error);
            toast.error(error.message || 'Failed to save banner');
        }
    };

    const columns = [
        {
            key: 'preview',
            label: 'Preview',
            sortable: false,
            render: (row) => (
                <div className="flex items-center gap-3">
                    {row.image ? (
                        <img
                            src={row.image}
                            alt={row.title}
                            className="w-20 h-10 object-cover rounded"
                        />
                    ) : (
                        <div className="w-20 h-10 bg-gray-200 rounded flex items-center justify-center">
                            <ImageIcon size={16} className="text-gray-400" />
                        </div>
                    )}
                    <div>
                        <p className="font-medium text-gray-900">{row.title}</p>
                        <p className="text-xs text-gray-500">{row.subtitle}</p>
                    </div>
                </div>
            )
        },
        {
            key: 'badge',
            label: 'Badge',
            sortable: true,
            render: (row) => row.badge ? (
                <span
                    className="px-2 py-1 text-xs font-bold text-white rounded"
                    style={{ backgroundColor: row.badgeColor }}
                >
                    {row.badge}
                </span>
            ) : '-'
        },
        {
            key: 'type',
            label: 'Type',
            sortable: true,
            render: (row) => (
                <span className="text-sm text-gray-700 capitalize">{row.type}</span>
            )
        },
        {
            key: 'priority',
            label: 'Priority',
            sortable: true,
            render: (row) => (
                <span className="text-sm font-medium text-gray-900">#{row.priority}</span>
            )
        },
        {
            key: 'validity',
            label: 'Validity',
            sortable: false,
            render: (row) => (
                <div className="text-xs">
                    {row.validFrom && (
                        <p className="text-gray-600">From: {new Date(row.validFrom).toLocaleDateString()}</p>
                    )}
                    {row.validUntil && (
                        <p className="text-gray-600">Until: {new Date(row.validUntil).toLocaleDateString()}</p>
                    )}
                    {!row.validFrom && !row.validUntil && '-'}
                </div>
            )
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (row) => {
                const isValid = bannerService.isBannerValid(row);
                return (
                    <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${row.enabled
                            ? isValid
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-200 text-gray-700'
                            }`}>
                            {row.enabled ? (isValid ? 'Active' : 'Scheduled') : 'Disabled'}
                        </span>
                    </div>
                );
            }
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
                        title="View Details"
                    >
                        <Eye size={16} />
                    </button>
                    <button
                        onClick={() => handleToggleStatus(row)}
                        className={`px-3 py-1 text-xs font-medium rounded transition-colors ${row.enabled
                            ? 'bg-gray-200 text-gray-700 hover:bg-gray-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                    >
                        {row.enabled ? 'Disable' : 'Enable'}
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
                        <h1 className="text-2xl font-bold text-gray-900">Banner Management</h1>
                        <p className="text-gray-600 mt-1">Manage promotional banners and offers</p>
                    </div>
                    <button
                        onClick={handleAdd}
                        className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                        <Plus size={20} />
                        <span>Add Banner</span>
                    </button>
                </div>

                {/* Info Alert */}
                {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <div className="text-blue-600 mt-0.5">
                            <Calendar size={20} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-semibold text-blue-900 mb-1">
                                Configuration File Based System
                            </h3>
                            <p className="text-sm text-blue-700 mb-2">
                                Banners are managed through <code className="bg-blue-100 px-1 py-0.5 rounded">frontend/src/config/banners.config.js</code>
                            </p>
                            <ul className="text-xs text-blue-600 space-y-1 list-disc list-inside">
                                <li>Use this page to preview and generate banner configurations</li>
                                <li>Copy the generated JSON to banners.config.js</li>
                                <li>Changes will be reflected immediately after page refresh</li>
                            </ul>
                        </div>
                    </div>
                </div> */}

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase">Total Banners</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{banners.length}</p>
                            </div>
                            <div className="bg-blue-50 p-2 rounded-lg">
                                <ImageIcon className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase">Active</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    {banners.filter(b => b.enabled && bannerService.isBannerValid(b)).length}
                                </p>
                            </div>
                            <div className="bg-green-50 p-2 rounded-lg">
                                <Eye className="w-5 h-5 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase">Scheduled</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    {banners.filter(b => b.enabled && !bannerService.isBannerValid(b)).length}
                                </p>
                            </div>
                            <div className="bg-yellow-50 p-2 rounded-lg">
                                <Calendar className="w-5 h-5 text-yellow-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase">Disabled</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    {banners.filter(b => !b.enabled).length}
                                </p>
                            </div>
                            <div className="bg-gray-50 p-2 rounded-lg">
                                <X className="w-5 h-5 text-gray-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={banners}
                        emptyMessage="No banners found. Add your first banner to get started."
                    />
                )}
            </div>

            {/* Banner Form Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-900">
                                {editingBanner ? 'Banner Details' : 'Add New Banner'}
                            </h3>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-6">
                            {/* Preview */}
                            {formData.image && (
                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <img
                                        src={formData.image}
                                        alt="Preview"
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-4" style={{ background: formData.backgroundColor }}>
                                        <div className="text-white">
                                            {formData.badge && (
                                                <span
                                                    className="text-xs font-bold px-2 py-1 rounded mb-2 inline-block"
                                                    style={{ backgroundColor: formData.badgeColor }}
                                                >
                                                    {formData.badge}
                                                </span>
                                            )}
                                            <h2 className="text-2xl font-bold">{formData.title || 'Banner Title'}</h2>
                                            <p className="text-lg">{formData.subtitle || 'Subtitle'}</p>
                                            <p className="text-sm mt-1">{formData.description || 'Description'}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Form */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                        placeholder="Flat 30% Off"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Subtitle
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.subtitle}
                                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                        placeholder="on Starters"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                        placeholder="Valid on orders above ₹499"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Badge Text
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.badge}
                                        onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                        placeholder="LIMITED OFFER"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Badge Color
                                    </label>
                                    <input
                                        type="color"
                                        value={formData.badgeColor}
                                        onChange={(e) => setFormData({ ...formData, badgeColor: e.target.value })}
                                        className="w-full h-10 px-1 border border-gray-300 rounded-lg"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Image URL *
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                        placeholder="https://images.unsplash.com/..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        CTA Button Text
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.ctaText}
                                        onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                        placeholder="Order Now"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        CTA Link
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.ctaLink}
                                        onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                        placeholder="/menu"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Valid From
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.validFrom}
                                        onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Valid Until
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.validUntil}
                                        onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Priority
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                        min="1"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Type
                                    </label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                    >
                                        {Object.values(bannerService.BANNER_TYPES).map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50 space-x-3">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 flex items-center space-x-2"
                            >
                                <Save size={16} />
                                <span>{editingBanner ? 'Update Banner' : 'Create Banner'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminBanners;
