/**
 * Ticket-shaped coupon card with notch cutouts on left/right edges.
 * Theme drives the icon background + accent color.
 */

const THEME_CLASSES = {
  green: {
    border: 'border-green-600',
    grad: 'from-white to-green-50',
    iconBg: 'bg-green-600',
    accent: 'text-green-700',
  },
  amber: {
    border: 'border-amber-500',
    grad: 'from-white to-amber-50',
    iconBg: 'bg-amber-500',
    accent: 'text-amber-700',
  },
  brown: {
    border: 'border-amber-700',
    grad: 'from-white to-amber-700/10',
    iconBg: 'bg-amber-700',
    accent: 'text-amber-800',
  },
};

const THEME_ICONS = { green: '🏷', amber: '💸', brown: '🎁' };

export default function CouponCard({ coupon, applied, onApply, onRemove }) {
  const t = THEME_CLASSES[coupon.theme] || THEME_CLASSES.green;
  const icon = coupon.type === 'FREE_DELIVERY' ? '🚚' : THEME_ICONS[coupon.theme] || '🏷';

  return (
    <div
      className={`relative my-2 rounded-xl border-[1.5px] border-dashed ${t.border} bg-gradient-to-r ${t.grad} p-3 flex items-center gap-2.5`}
    >
      <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-stone-50 dark:bg-[#211811] rounded-full" aria-hidden />
      <span className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-stone-50 dark:bg-[#211811] rounded-full" aria-hidden />

      <div className={`w-9 h-9 ${t.iconBg} text-white rounded-full flex items-center justify-center text-base flex-shrink-0`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h6 className="text-xs font-extrabold text-stone-900 dark:text-white">{coupon.code}</h6>
        {coupon.description && (
          <p className="text-2xs text-stone-500 dark:text-stone-400 leading-tight mt-0.5 line-clamp-2">
            {coupon.description}
          </p>
        )}
      </div>

      {applied ? (
        <button onClick={onRemove} className={`${t.accent} text-2xs font-extrabold px-1`}>
          REMOVE ✓
        </button>
      ) : (
        <button onClick={onApply} className={`${t.accent} text-2xs font-extrabold px-1`}>
          APPLY
        </button>
      )}
    </div>
  );
}
