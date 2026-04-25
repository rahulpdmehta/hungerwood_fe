import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import BackButton from '@components/common/BackButton';
import Button from '@components/common/Button';
import { SkeletonList } from '@components/common/Skeleton';
import ConfirmModal from '@components/common/ConfirmModal';
import { addressService } from '@services/address.service';

const Addresses = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    label: '',
    street: '',
    city: 'Gaya',
    state: 'Bihar',
    pincode: '824201',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const MAX_ADDRESSES = 5;
  const fromCheckout = location.state?.fromCheckout || false;
  const returnTo = location.state?.returnTo || '/profile';

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    setLoading(true);
    try {
      const response = await addressService.getAddresses();
      setAddresses(response.data);
    } catch (error) {
      console.error('Failed to load addresses:', error);
      setError('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.label.trim()) {
      setError('Label is required');
      return false;
    }
    if (!formData.street.trim()) {
      setError('Street address is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitting(true);
    setError('');

    try {
      if (editingAddress) {
        // Update existing address
        await addressService.updateAddress(editingAddress.id, formData);
      } else {
        // Add new address
        await addressService.addAddress(formData);
      }
      
      // Reload addresses
      await loadAddresses();
      
      // Reset form
      setFormData({ label: '', street: '', city: 'Gaya', state: 'Bihar', pincode: '824201' });
      setShowAddForm(false);
      setEditingAddress(null);
    } catch (err) {
      setError(err.message || 'Failed to save address');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (address) => {
    setFormData({
      label: address.label,
      street: address.street,
      city: address.city || 'Gaya',
      state: address.state || 'Bihar',
      pincode: address.pincode || '824201',
    });
    setEditingAddress(address);
    setShowAddForm(true);
  };

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const performDelete = async (id) => {
    try {
      await addressService.deleteAddress(id);
      await loadAddresses();
      toast.success('Address deleted');
    } catch (error) {
      toast.error('Failed to delete address');
    }
  };

  const handleDelete = (id) => setConfirmDeleteId(id);

  const handleSetDefault = async (id) => {
    try {
      await addressService.setDefaultAddress(id);
      await loadAddresses();
    } catch (error) {
      setError('Failed to set default address');
    }
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingAddress(null);
    setFormData({ label: '', street: '', city: 'Gaya', state: 'Bihar', pincode: '824201' });
    setError('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f7f6] dark:bg-[#211811]">
        <div className="max-w-md mx-auto p-4 pt-16">
          <SkeletonList rows={3} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center px-4 py-4">
          <BackButton to={returnTo} />
          <h1 className="flex-1 text-center text-xl font-semibold text-text-primary pr-10">
            {fromCheckout ? 'Select Address' : 'My Addresses'}
          </h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Error Message */}
        {error && !showAddForm && (
          <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Add Address Button */}
        {!showAddForm && addresses.length < MAX_ADDRESSES && (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full flex items-center justify-center gap-2 bg-primary/10 text-primary border-2 border-dashed border-primary/30 rounded-xl py-4 hover:bg-primary/20 transition-colors"
          >
            <span className="material-symbols-outlined">add</span>
            <span className="font-semibold">Add New Address</span>
          </button>
        )}

        {/* Add/Edit Address Form */}
        {showAddForm && (
          <div className="bg-white rounded-2xl shadow-md border-2 border-gray-100 p-4">
            <h3 className="text-lg font-bold text-text-primary mb-4">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error */}
              {error && (
                <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Label */}
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Label *
                </label>
                <input
                  type="text"
                  name="label"
                  value={formData.label}
                  onChange={handleInputChange}
                  placeholder="e.g., Home, Office, Other"
                  className="w-full bg-surface border-2 border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:border-primary focus:outline-none transition-colors"
                  disabled={submitting}
                />
              </div>

              {/* Street */}
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  placeholder="Enter street address"
                  className="w-full bg-surface border-2 border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:border-primary focus:outline-none transition-colors"
                  disabled={submitting}
                />
              </div>

              {/* Locality (hardcoded single line) */}
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  City & Pincode
                </label>
                <div className="w-full bg-surface border-2 border-border rounded-xl px-4 py-3 text-text-secondary">
                  Gaya, 824201
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCancelForm}
                  className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  loading={submitting}
                  className="flex-1 !bg-primary hover:!bg-primary-dark !text-white !rounded-xl !py-3"
                >
                  {editingAddress ? 'Update' : 'Save'} Address
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Addresses List */}
        {addresses.length === 0 && !showAddForm ? (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-gray-300 text-6xl mb-4">
              location_off
            </span>
            <h3 className="text-xl font-bold text-text-primary mb-2">No addresses saved</h3>
            <p className="text-text-secondary mb-6">Add your first delivery address</p>
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`bg-white rounded-2xl shadow-md border-2 p-4 ${
                  address.isDefault ? 'border-primary/50' : 'border-gray-100'
                } ${fromCheckout ? 'cursor-pointer hover:border-primary transition-colors' : ''}`}
                onClick={fromCheckout ? () => {
                  // Navigate back to checkout with selected address
                  navigate(returnTo, {
                    state: {
                      selectedAddress: address
                    }
                  });
                } : undefined}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-2xl">
                      {address.label === 'Home' ? 'home' : address.label === 'Office' ? 'work' : 'location_on'}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-text-primary">{address.label}</h3>
                      {address.isDefault && (
                        <span className="text-xs text-primary font-semibold">Default</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    {fromCheckout ? (
                      <button
                        className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                        onClick={() => {
                          navigate(returnTo, {
                            state: {
                              selectedAddress: address
                            }
                          });
                        }}
                      >
                        <span className="material-symbols-outlined text-primary text-xl">
                          check_circle
                        </span>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(address)}
                          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <span className="material-symbols-outlined text-text-secondary text-xl">
                            edit
                          </span>
                        </button>
                        <button
                          onClick={() => handleDelete(address.id)}
                          className="p-2 hover:bg-danger/10 rounded-lg transition-colors"
                        >
                          <span className="material-symbols-outlined text-danger text-xl">
                            delete
                          </span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Address */}
                <p className="text-text-secondary text-sm leading-relaxed mb-3">
                  {address.street}, Gaya - 824201
                </p>

                {/* Set Default Button */}
                {!address.isDefault && !fromCheckout && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetDefault(address.id);
                    }}
                    className="text-primary text-sm font-semibold hover:underline"
                  >
                    Set as Default
                  </button>
                )}
                {fromCheckout && (
                  <p className="text-primary text-sm font-semibold">Tap to select</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Max Addresses Warning */}
        {addresses.length >= MAX_ADDRESSES && !showAddForm && (
          <div className="bg-warning/10 border border-warning/20 text-warning px-4 py-3 rounded-lg text-sm text-center">
            You've reached the maximum limit of {MAX_ADDRESSES} addresses
          </div>
        )}
      </div>
      <ConfirmModal
        open={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={() => performDelete(confirmDeleteId)}
        title="Delete address?"
        message="This address will be removed from your saved list."
        confirmText="Delete"
        tone="danger"
      />
    </div>
  );
};

export default Addresses;
