/**
 * Admin Settings Page
 * Manage restaurant settings and status
 */

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import useRestaurantStore from '../../store/useRestaurantStore';
import { Power } from 'lucide-react';

const Settings = () => {
  const { isOpen, closingMessage, fetchAdminStatus, updateStatus } = useRestaurantStore();
  const [loading, setLoading] = useState(false);
  const [closingMessageInput, setClosingMessageInput] = useState('');

  useEffect(() => {
    fetchAdminStatus();
  }, [fetchAdminStatus]);

  useEffect(() => {
    setClosingMessageInput(closingMessage || '');
  }, [closingMessage]);

  const handleToggleStatus = async () => {
    setLoading(true);
    try {
      const result = await updateStatus(!isOpen, closingMessageInput);
      if (result.success) {
        toast.success(`Restaurant is now ${!isOpen ? 'open' : 'closed'}`);
        // Refresh status to ensure UI is in sync
        await fetchAdminStatus();
      } else {
        toast.error(result.error || 'Failed to update status');
      }
    } catch (error) {
      toast.error('Failed to update restaurant status');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMessage = async () => {
    setLoading(true);
    try {
      const result = await updateStatus(isOpen, closingMessageInput);
      if (result.success) {
        toast.success('Closing message updated');
        // Refresh status to ensure UI is in sync
        await fetchAdminStatus();
      } else {
        toast.error(result.error || 'Failed to update message');
      }
    } catch (error) {
      toast.error('Failed to update closing message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage restaurant settings and status</p>
        </div>

        {/* Restaurant Status Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-gray-200">
          <div className="flex items-center gap-4 mb-6">
            <div className={`p-3 rounded-lg ${isOpen ? 'bg-green-100' : 'bg-red-100'}`}>
              <Power size={24} className={isOpen ? 'text-green-600' : 'text-red-600'} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Restaurant Status</h2>
              <p className={`text-sm font-medium ${isOpen ? 'text-green-600' : 'text-red-600'}`}>
                {isOpen ? 'Currently Open' : 'Currently Closed'}
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Restaurant Status</p>
              <p className="text-xs text-gray-500">
                {isOpen
                  ? 'Restaurant is open and accepting orders'
                  : 'Restaurant is closed. Orders will be blocked.'}
              </p>
            </div>
            <button
              onClick={handleToggleStatus}
              disabled={loading}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isOpen ? 'bg-green-600' : 'bg-gray-300'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isOpen ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Closing Message */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Closing Message (Optional)
            </label>
            <p className="text-xs text-gray-500 mb-2">
              This message will be displayed to customers when the restaurant is closed.
            </p>
            <textarea
              value={closingMessageInput}
              onChange={(e) => setClosingMessageInput(e.target.value)}
              placeholder="e.g., Closed for maintenance. Will reopen at 9 AM tomorrow."
              maxLength={200}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">{closingMessageInput.length}/200 characters</p>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveMessage}
            disabled={loading}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Settings;
