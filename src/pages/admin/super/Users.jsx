import { useState } from 'react';
import { Plus, Edit2, Power } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AdminLayout from '@components/admin/AdminLayout';
import DataTable from '@components/admin/DataTable';
import ConfirmDialog from '@components/admin/ConfirmDialog';
import {
  useAdminUsers,
  useCreateAdmin,
  useUpdateAdmin,
  useDeactivateAdmin,
} from '@hooks/useAdminUsersQueries';

const ROLES = [
  { value: 'RESTAURANT_ADMIN', label: 'Restaurant admin' },
  { value: 'GROCERY_ADMIN', label: 'Grocery admin' },
  { value: 'SUPER_ADMIN', label: 'Super admin' },
];

export default function Users() {
  const { data: users = [], isLoading } = useAdminUsers();
  const createMut = useCreateAdmin();
  const updateMut = useUpdateAdmin();
  const deactivateMut = useDeactivateAdmin();

  const [modal, setModal] = useState(null); // null | {mode:'add'} | {mode:'edit', user}
  const [confirm, setConfirm] = useState(null);

  const handleSubmit = async (payload) => {
    try {
      if (modal.mode === 'add') await createMut.mutateAsync(payload);
      else await updateMut.mutateAsync({ id: modal.user._id, ...payload });
      toast.success(modal.mode === 'add' ? 'Admin created' : 'Admin updated');
      setModal(null);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed');
    }
  };

  const handleDeactivate = async () => {
    try {
      await deactivateMut.mutateAsync(confirm._id);
      toast.success('Admin deactivated');
      setConfirm(null);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed');
    }
  };

  const columns = [
    { key: 'phone', label: 'Phone' },
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role', render: (r) => ROLES.find(x => x.value === r.role)?.label || r.role },
    { key: 'isActive', label: 'Status', render: (r) => r.isActive ? 'Active' : 'Deactivated' },
    { key: 'actions', label: 'Actions', render: (r) => (
      <div className="flex gap-2">
        <button onClick={() => setModal({ mode: 'edit', user: r })} title="Edit">
          <Edit2 size={16} />
        </button>
        {r.isActive && (
          <button onClick={() => setConfirm(r)} title="Deactivate">
            <Power size={16} />
          </button>
        )}
      </div>
    )},
  ];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Users & Roles</h1>
        <button
          onClick={() => setModal({ mode: 'add' })}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg"
        >
          <Plus size={18} /> Add Admin
        </button>
      </div>

      {isLoading ? <div>Loading…</div> : (
        <DataTable columns={columns} data={users} emptyMessage="No admin users yet." />
      )}

      {modal && <UserFormModal initial={modal.user} onClose={() => setModal(null)} onSubmit={handleSubmit} />}
      <ConfirmDialog
        isOpen={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={handleDeactivate}
        title="Deactivate admin?"
        message={`${confirm?.name} will no longer be able to log in.`}
        confirmText="Deactivate"
        type="danger"
      />
    </AdminLayout>
  );
}

function UserFormModal({ initial, onClose, onSubmit }) {
  const [form, setForm] = useState({
    phone: initial?.phone || '',
    name: initial?.name || '',
    role: initial?.role || 'RESTAURANT_ADMIN',
  });

  const submit = (e) => {
    e.preventDefault();
    // Phone is immutable after creation; only send name+role on edit
    if (initial) onSubmit({ name: form.name, role: form.role });
    else onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <form onSubmit={submit} className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
        <h3 className="text-xl font-semibold">{initial ? 'Edit admin' : 'Add admin'}</h3>
        <label className="block">
          <span className="text-sm">Phone</span>
          <input
            type="tel" value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
            disabled={!!initial}
            className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100"
            required
          />
        </label>
        <label className="block">
          <span className="text-sm">Name</span>
          <input
            type="text" value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </label>
        <label className="block">
          <span className="text-sm">Role</span>
          <select
            value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </label>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded-lg">Save</button>
        </div>
      </form>
    </div>
  );
}
