import { useState } from 'react';
import { Plus, Power, Trash2, Edit2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import AdminLayout from '@components/admin/AdminLayout';
import api from '@services/api';

const EMPTY = {
  code: '',
  description: '',
  section: 'grocery',
  type: 'PERCENTAGE',
  value: 10,
  theme: 'green',
  minOrderValue: '',
  maxDiscount: '',
  validFrom: '',
  validTo: '',
  perUserLimit: '',
  isActive: true,
};

const fmtDate = (d) => (d ? new Date(d).toISOString().slice(0, 10) : '');

export default function GroceryCouponsAdmin() {
  const qc = useQueryClient();
  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ['admin', 'grocery', 'coupons'],
    queryFn: async () => (await api.get('/admin/grocery/coupons?section=grocery')).data || [],
  });

  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const inv = () => qc.invalidateQueries({ queryKey: ['admin', 'grocery', 'coupons'] });

  const createMut = useMutation({
    mutationFn: (b) => api.post('/admin/grocery/coupons', b),
    onSuccess: () => { toast.success('Coupon created'); inv(); setModal(null); },
    onError: (e) => toast.error(e?.response?.data?.message || 'Create failed'),
  });
  const updateMut = useMutation({
    mutationFn: ({ id, body }) => api.patch(`/admin/grocery/coupons/${id}`, body),
    onSuccess: () => { toast.success('Coupon updated'); inv(); setModal(null); },
    onError: (e) => toast.error(e?.response?.data?.message || 'Update failed'),
  });
  const toggleMut = useMutation({
    mutationFn: (id) => api.patch(`/admin/grocery/coupons/${id}/toggle`),
    onSuccess: () => { toast.success('Toggled'); inv(); },
  });
  const deleteMut = useMutation({
    mutationFn: (id) => api.delete(`/admin/grocery/coupons/${id}`),
    onSuccess: () => { toast.success('Deleted'); inv(); },
  });

  const openAdd = () => {
    setForm({
      ...EMPTY,
      validFrom: fmtDate(new Date()),
      validTo: fmtDate(new Date(Date.now() + 30 * 86400000)),
    });
    setModal({ mode: 'add' });
  };
  const openEdit = (c) => {
    setForm({
      code: c.code,
      description: c.description || '',
      section: c.section,
      type: c.type,
      value: c.value,
      theme: c.theme || 'green',
      minOrderValue: c.minOrderValue ?? '',
      maxDiscount: c.maxDiscount ?? '',
      validFrom: fmtDate(c.validFrom),
      validTo: fmtDate(c.validTo),
      perUserLimit: c.perUserLimit ?? '',
      isActive: c.isActive,
    });
    setModal({ mode: 'edit', id: c._id });
  };

  const submit = () => {
    if (!form.code.trim() || !form.value || !form.validTo) {
      return toast.error('Code, value, and validity end-date are required');
    }
    const payload = {
      ...form,
      value: Number(form.value),
      minOrderValue: form.minOrderValue === '' ? null : Number(form.minOrderValue),
      maxDiscount: form.maxDiscount === '' ? null : Number(form.maxDiscount),
      perUserLimit: form.perUserLimit === '' ? null : Number(form.perUserLimit),
    };
    if (modal.mode === 'add') createMut.mutate(payload);
    else updateMut.mutate({ id: modal.id, body: payload });
  };

  return (
    <AdminLayout title="Grocery Coupons">
      <div className="p-4 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Coupons</h2>
          <button onClick={openAdd} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold">
            <Plus size={16} /> Add coupon
          </button>
        </div>

        {isLoading ? (
          <div className="py-10 text-center text-stone-500">Loading…</div>
        ) : coupons.length === 0 ? (
          <div className="py-12 text-center text-stone-500 bg-white rounded-xl">No coupons yet.</div>
        ) : (
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 text-stone-600 text-xs uppercase">
                <tr>
                  <th className="text-left p-3">Code</th>
                  <th className="text-left p-3">Type</th>
                  <th className="text-left p-3">Value</th>
                  <th className="text-left p-3">Min order</th>
                  <th className="text-left p-3">Valid until</th>
                  <th className="text-left p-3">Status</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {coupons.map(c => (
                  <tr key={c._id} className="border-t border-stone-100">
                    <td className="p-3 font-bold">{c.code}</td>
                    <td className="p-3 text-xs">{c.type}</td>
                    <td className="p-3">
                      {c.type === 'PERCENTAGE' ? `${c.value}%` : c.type === 'FLAT' ? `₹${c.value}` : 'Free delivery'}
                      {c.maxDiscount && c.type === 'PERCENTAGE' && <span className="text-stone-500 text-xs"> · max ₹{c.maxDiscount}</span>}
                    </td>
                    <td className="p-3 text-stone-600">{c.minOrderValue ? `₹${c.minOrderValue}` : '—'}</td>
                    <td className="p-3 text-stone-600">{fmtDate(c.validTo)}</td>
                    <td className="p-3">
                      <span className={`text-2xs font-bold px-2 py-0.5 rounded ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-stone-200 text-stone-500'}`}>
                        {c.isActive ? 'ACTIVE' : 'OFF'}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button onClick={() => openEdit(c)} className="text-stone-500 hover:text-stone-800" title="Edit"><Edit2 size={14} /></button>
                      <button onClick={() => toggleMut.mutate(c._id)} className="text-stone-500 hover:text-stone-800" title="Toggle"><Power size={14} /></button>
                      <button onClick={() => { if (confirm(`Delete coupon ${c.code}?`)) deleteMut.mutate(c._id); }} className="text-rose-500 hover:text-rose-700" title="Delete"><Trash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {modal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-5 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h3 className="font-bold text-lg mb-3">{modal.mode === 'add' ? 'Add coupon' : 'Edit coupon'}</h3>
              <div className="space-y-3 text-sm">
                <label className="block">
                  <span className="text-xs font-bold text-stone-600">Code</span>
                  <input value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} className="w-full border rounded p-2 mt-0.5 font-mono" />
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-stone-600">Description</span>
                  <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border rounded p-2 mt-0.5" />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-xs font-bold text-stone-600">Type</span>
                    <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full border rounded p-2 mt-0.5">
                      <option value="PERCENTAGE">% off</option>
                      <option value="FLAT">Flat ₹ off</option>
                      <option value="FREE_DELIVERY">Free delivery</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold text-stone-600">Value</span>
                    <input type="number" min="0" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} className="w-full border rounded p-2 mt-0.5" disabled={form.type === 'FREE_DELIVERY'} />
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-xs font-bold text-stone-600">Min order ₹</span>
                    <input type="number" min="0" value={form.minOrderValue} onChange={e => setForm({ ...form, minOrderValue: e.target.value })} className="w-full border rounded p-2 mt-0.5" placeholder="optional" />
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold text-stone-600">Max discount ₹</span>
                    <input type="number" min="0" value={form.maxDiscount} onChange={e => setForm({ ...form, maxDiscount: e.target.value })} className="w-full border rounded p-2 mt-0.5" placeholder="optional" disabled={form.type !== 'PERCENTAGE'} />
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-xs font-bold text-stone-600">Valid from</span>
                    <input type="date" value={form.validFrom} onChange={e => setForm({ ...form, validFrom: e.target.value })} className="w-full border rounded p-2 mt-0.5" />
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold text-stone-600">Valid to</span>
                    <input type="date" value={form.validTo} onChange={e => setForm({ ...form, validTo: e.target.value })} className="w-full border rounded p-2 mt-0.5" required />
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-xs font-bold text-stone-600">Per-user limit</span>
                    <input type="number" min="1" value={form.perUserLimit} onChange={e => setForm({ ...form, perUserLimit: e.target.value })} className="w-full border rounded p-2 mt-0.5" placeholder="unlimited" />
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold text-stone-600">Theme</span>
                    <select value={form.theme} onChange={e => setForm({ ...form, theme: e.target.value })} className="w-full border rounded p-2 mt-0.5">
                      <option value="green">green</option>
                      <option value="amber">amber</option>
                      <option value="brown">brown</option>
                    </select>
                  </label>
                </div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} />
                  Active
                </label>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setModal(null)} className="px-4 py-2 border rounded text-sm">Cancel</button>
                <button onClick={submit} className="px-4 py-2 bg-green-600 text-white rounded text-sm font-bold">Save</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
