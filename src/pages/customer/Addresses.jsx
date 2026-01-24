import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '@components/common/BackButton';
import Button from '@components/common/Button';
import { addressService } from '@services/address.service';

const Addresses = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    label: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const MAX_ADDRESSES = 5;

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
    if (!formData.city.trim()) {
      setError('City is required');
      return false;
    }
    if (!formData.state.trim()) {
      setError('State is required');
      return false;
    }
    if (!/^\d{6}$/.test(formData.pincode)) {
      setError('Pincode must be 6 digits');
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
      setFormData({ label: '', street: '', city: '', state: '', pincode: '' });
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
      city: address.city,
      state: address.state,
      pincode: address.pincode,
    });
    setEditingAddress(address);
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      await addressService.deleteAddress(id);
      await loadAddresses();
    } catch (error) {
      setError('Failed to delete address');
    }
  };

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
    setFormData({ label: '', street: '', city: '', state: '', pincode: '' });
    setError('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading addresses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center px-4 py-4">
          <BackButton to="/profile" />
          <h1 className="flex-1 text-center text-xl font-semibold text-text-primary pr-10">
            My Addresses
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
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
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

              {/* City & State */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className="w-full bg-surface border-2 border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:border-primary focus:outline-none transition-colors"
                    disabled={submitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="State"
                    className="w-full bg-surface border-2 border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:border-primary focus:outline-none transition-colors"
                    disabled={submitting}
                  />
                </div>
              </div>

              {/* Pincode */}
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Pincode *
                </label>
                <input
                  type="tel"
                  name="pincode"
                  value={formData.pincode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setFormData(prev => ({ ...prev, pincode: value }));
                    setError('');
                  }}
                  placeholder="6-digit pincode"
                  maxLength="6"
                  className="w-full bg-surface border-2 border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:border-primary focus:outline-none transition-colors"
                  disabled={submitting}
                />
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
                className={`bg-white rounded-2xl shadow-sm border-2 p-4 ${
                  address.isDefault ? 'border-primary/50' : 'border-gray-100'
                }`}
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
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(address)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
                  </div>
                </div>

                {/* Address */}
                <p className="text-text-secondary text-sm leading-relaxed mb-3">
                  {address.street}, {address.city}, {address.state} - {address.pincode}
                </p>

                {/* Set Default Button */}
                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="text-primary text-sm font-semibold hover:underline"
                  >
                    Set as Default
                  </button>
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
    </div>
  );
};

export default Addresses;
