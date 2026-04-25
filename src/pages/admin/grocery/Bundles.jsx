import { useState, useMemo } from 'react';
import { Plus, Power, Trash2, Edit2, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import AdminLayout from '@components/admin/AdminLayout';
import api from '@services/api';
import { useGroceryProducts } from '@hooks/useGroceryQueries';

const EMPTY = {
  name: '',
  slug: '',
  description: '',
  theme: 'warm',
  items: [],
  bundlePrice: 0,
  regularPrice: 0,
  isActive: true,
  order: 0,
};

const slugify = (s) =>
  String(s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

export default function GroceryBundlesAdmin() {
  const qc = useQueryClient();
  const { data: products = [] } = useGroceryProducts();
  const { data: bundles = [], isLoading } = useQuery({
    queryKey: ['admin', 'grocery', 'bundles'],
    queryFn: async () => (await api.get('/admin/grocery/bundles')).data || [],
  });

  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const inv = () => qc.invalidateQueries({ queryKey: ['admin', 'grocery', 'bundles'] });

  const createMut = useMutation({
    mutationFn: (b) => api.post('/admin/grocery/bundles', b),
    onSuccess: () => { toast.success('Bundle created'); inv(); setModal(null); },
    onError: (e) => toast.error(e?.response?.data?.message || 'Create failed'),
  });
  const updateMut = useMutation({
    mutationFn: ({ id, body }) => api.patch(`/admin/grocery/bundles/${id}`, body),
    onSuccess: () => { toast.success('Bundle updated'); inv(); setModal(null); },
    onError: (e) => toast.error(e?.response?.data?.message || 'Update failed'),
  });
  const toggleMut = useMutation({
    mutationFn: (id) => api.patch(`/admin/grocery/bundles/${id}/toggle`),
    onSuccess: () => { toast.success('Toggled'); inv(); },
  });
  const deleteMut = useMutation({
    mutationFn: (id) => api.delete(`/admin/grocery/bundles/${id}`),
    onSuccess: () => { toast.success('Deleted'); inv(); },
  });

  const productMap = useMemo(() => new Map(products.map(p => [String(p.id || p._id), p])), [products]);

  const submit = () => {
    if (!form.name.trim() || form.items.length === 0 || !form.bundlePrice || !form.regularPrice) {
      return toast.error('Name, items, bundlePrice, regularPrice required');
    }
    const payload = {
      ...form,
      slug: form.slug || slugify(form.name),
      bundlePrice: Number(form.bundlePrice),
      regularPrice: Number(form.regularPrice),
    };
    if (modal.mode === 'add') createMut.mutate(payload);
    else updateMut.mutate({ id: modal.id, body: payload });
  };

  const addItem = () => setForm(f => ({ ...f, items: [...f.items, { product: '', variantId: '', quantity: 1 }] }));
  const removeItem = (i) => setForm(f => ({ ...f, items: f.items.filter((_, k) => k !== i) }));
  const updateItem = (i, key, val) => setForm(f => ({ ...f, items: f.items.map((it, k) => k === i ? { ...it, [key]: val } : it) }));

  return (
    <AdminLayout title="Grocery Bundles">
      <div className="p-4 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Smart bundles</h2>
          <button onClick={() => { setForm(EMPTY); setModal({ mode: 'add' }); }} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold">
            <Plus size={16} /> Add bundle
          </button>
        </div>

        {isLoading ? (
          <div className="py-10 text-center text-stone-500">Loading…</div>
        ) : bundles.length === 0 ? (
          <div className="py-12 text-center text-stone-500 bg-white rounded-xl">No bundles yet.</div>
        ) : (
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 text-stone-600 text-xs uppercase">
                <tr>
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Items</th>
                  <th className="text-left p-3">Bundle ₹</th>
                  <th className="text-left p-3">Regular ₹</th>
                  <th className="text-left p-3">Theme</th>
                  <th className="text-left p-3">Status</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {bundles.map(b => (
                  <tr key={b._id} className="border-t border-stone-100">
                    <td className="p-3 font-bold">{b.name}<div className="text-2xs text-stone-400 font-normal">{b.slug}</div></td>
                    <td className="p-3">{b.items?.length || 0}</td>
                    <td className="p-3">₹{b.bundlePrice}</td>
                    <td className="p-3 text-stone-500 line-through">₹{b.regularPrice}</td>
                    <td className="p-3 text-xs">{b.theme}</td>
                    <td className="p-3">
                      <span className={`text-2xs font-bold px-2 py-0.5 rounded ${b.isActive ? 'bg-green-100 text-green-700' : 'bg-stone-200 text-stone-500'}`}>
                        {b.isActive ? 'ACTIVE' : 'OFF'}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button onClick={() => { setForm({ ...b, items: (b.items || []).map(it => ({ product: it.product?._id || it.product, variantId: it.variantId, quantity: it.quantity })) }); setModal({ mode: 'edit', id: b._id }); }} className="text-stone-500 hover:text-stone-800"><Edit2 size={14} /></button>
                      <button onClick={() => toggleMut.mutate(b._id)} className="text-stone-500 hover:text-stone-800"><Power size={14} /></button>
                      <button onClick={() => { if (confirm(`Delete bundle ${b.name}?`)) deleteMut.mutate(b._id); }} className="text-rose-500 hover:text-rose-700"><Trash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {modal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-5 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="font-bold text-lg mb-3">{modal.mode === 'add' ? 'Add bundle' : 'Edit bundle'}</h3>
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-xs font-bold">Name</span>
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value, slug: form.slug || slugify(e.target.value) })} className="w-full border rounded p-2 mt-0.5" />
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold">Slug</span>
                    <input value={form.slug} onChange={e => setForm({ ...form, slug: slugify(e.target.value) })} className="w-full border rounded p-2 mt-0.5 font-mono text-xs" />
                  </label>
                </div>
                <label className="block">
                  <span className="text-xs font-bold">Description</span>
                  <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border rounded p-2 mt-0.5" />
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <label className="block">
                    <span className="text-xs font-bold">Bundle price ₹</span>
                    <input type="number" min="0" value={form.bundlePrice} onChange={e => setForm({ ...form, bundlePrice: e.target.value })} className="w-full border rounded p-2 mt-0.5" />
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold">Regular price ₹</span>
                    <input type="number" min="0" value={form.regularPrice} onChange={e => setForm({ ...form, regularPrice: e.target.value })} className="w-full border rounded p-2 mt-0.5" />
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold">Theme</span>
                    <select value={form.theme} onChange={e => setForm({ ...form, theme: e.target.value })} className="w-full border rounded p-2 mt-0.5">
                      <option value="warm">warm</option>
                      <option value="green">green</option>
                      <option value="rose">rose</option>
                    </select>
                  </label>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">Items</span>
                    <button onClick={addItem} className="text-green-600 text-xs font-bold flex items-center gap-1"><Plus size={12} /> Add item</button>
                  </div>
                  <div className="space-y-2 mt-1">
                    {form.items.map((it, i) => {
                      const p = productMap.get(String(it.product));
                      return (
                        <div key={i} className="flex items-center gap-2 bg-stone-50 p-2 rounded">
                          <select value={it.product || ''} onChange={e => updateItem(i, 'product', e.target.value)} className="flex-1 border rounded p-1.5 text-xs">
                            <option value="">— pick product —</option>
                            {products.map(pr => <option key={pr.id || pr._id} value={pr.id || pr._id}>{pr.brand ? `${pr.brand} · ` : ''}{pr.name}</option>)}
                          </select>
                          <select value={it.variantId || ''} onChange={e => updateItem(i, 'variantId', e.target.value)} className="w-32 border rounded p-1.5 text-xs">
                            <option value="">— variant —</option>
                            {(p?.variants || []).map(v => <option key={v.id || v._id} value={v.id || v._id}>{v.label} · ₹{v.sellingPrice}</option>)}
                          </select>
                          <input type="number" min="1" value={it.quantity} onChange={e => updateItem(i, 'quantity', Number(e.target.value))} className="w-14 border rounded p-1.5 text-xs" />
                          <button onClick={() => removeItem(i)} className="text-rose-500"><X size={14} /></button>
                        </div>
                      );
                    })}
                    {form.items.length === 0 && <div className="text-stone-400 text-xs italic">No items yet — add at least one.</div>}
                  </div>
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
