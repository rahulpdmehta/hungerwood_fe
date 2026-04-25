import { AlertTriangle } from 'lucide-react';

/**
 * Customer-side confirmation modal. Mobile-first bottom sheet on small
 * screens, centered card on larger ones (uses the same `max-w-sm` cap).
 *
 *   <ConfirmModal
 *     open={confirming}
 *     onClose={() => setConfirming(false)}
 *     onConfirm={doDelete}
 *     title="Delete address?"
 *     message="This address will be removed from your saved list."
 *     confirmText="Delete"
 *     tone="danger"
 *   />
 */
export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = '',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  tone = 'danger', // danger | primary
}) {
  if (!open) return null;

  const confirmBtn =
    tone === 'danger'
      ? 'bg-rose-600 hover:bg-rose-700 text-white'
      : 'bg-[#7f4f13] hover:bg-[#7f4f13]/90 text-white';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-[#2d221a] w-full max-w-sm rounded-t-2xl sm:rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-5 animate-slideUp"
      >
        <div className="flex items-start gap-3 mb-3">
          <div className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${tone === 'danger' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-700'}`}>
            <AlertTriangle size={18} />
          </div>
          <div className="flex-1">
            <h3 id="confirm-title" className="text-base font-bold text-[#181411] dark:text-white">{title}</h3>
            {message && <p className="text-sm text-[#887263] dark:text-gray-400 mt-1">{message}</p>}
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-sm font-bold text-[#181411] dark:text-white bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-xl"
          >
            {cancelText}
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl ${confirmBtn}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
