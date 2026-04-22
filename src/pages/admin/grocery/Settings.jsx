import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import AdminLayout from '@components/admin/AdminLayout';
import { useGrocerySettings, useUpdateGrocerySettings } from '@hooks/useGroceryQueries';

export default function GrocerySettings() {
  const { data: settings, isLoading } = useGrocerySettings();
  const updateMut = useUpdateGrocerySettings();
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (settings) setForm({
      isOpen: !!settings.isOpen,
      closingMessage: settings.closingMessage || '',
      taxRate: settings.taxRate ?? 0.05,
      deliveryFee: settings.deliveryFee ?? 40,
      freeDeliveryThreshold: settings.freeDeliveryThreshold ?? '',
      minOrderValue: settings.minOrderValue ?? '',
    });
  }, [settings]);

  if (isLoading || !form) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
        </div>
      </AdminLayout>
    );
  }

  const save = async (e) => {
    e.preventDefault();
    try {
      await updateMut.mutateAsync({
        isOpen: form.isOpen,
        closingMessage: form.closingMessage,
        taxRate: Number(form.taxRate),
        deliveryFee: Number(form.deliveryFee),
        freeDeliveryThreshold: form.freeDeliveryThreshold === '' ? null : Number(form.freeDeliveryThreshold),
        minOrderValue: form.minOrderValue === '' ? null : Number(form.minOrderValue),
      });
      toast.success('Grocery settings saved');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    }
  };

  const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent';

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Grocery Settings</h1>
          <p className="text-gray-600 mt-1">Shop status and billing configuration for the grocery section.</p>
        </div>

        <form onSubmit={save} className="space-y-6">
          {/* Shop status */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="font-semibold text-lg text-gray-900">Shop status</h2>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isOpen}
                onChange={e => setForm({ ...form, isOpen: e.target.checked })}
                className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              />
              Grocery shop is open to customers
            </label>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Closing message (shown on closed shop)</label>
              <input
                className={inputClass}
                placeholder="We're closed right now — see you soon!"
                value={form.closingMessage}
                onChange={e => setForm({ ...form, closingMessage: e.target.value })}
              />
            </div>
          </div>

          {/* Billing */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="font-semibold text-lg text-gray-900">Billing</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tax rate (decimal — e.g. 0.05 for 5%)</label>
              <input
                className={inputClass}
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={form.taxRate}
                onChange={e => setForm({ ...form, taxRate: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Flat delivery fee (₹)</label>
              <input
                className={inputClass}
                type="number"
                min="0"
                value={form.deliveryFee}
                onChange={e => setForm({ ...form, deliveryFee: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Free delivery above (₹) — leave blank to disable</label>
              <input
                className={inputClass}
                type="number"
                min="0"
                value={form.freeDeliveryThreshold}
                onChange={e => setForm({ ...form, freeDeliveryThreshold: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minimum order value (₹) — leave blank to disable</label>
              <input
                className={inputClass}
                type="number"
                min="0"
                value={form.minOrderValue}
                onChange={e => setForm({ ...form, minOrderValue: e.target.value })}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={updateMut.isPending}
              className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium disabled:opacity-50"
            >
              {updateMut.isPending ? 'Saving…' : 'Save settings'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
