/**
 * Inline +/- stepper used on grocery cards and PDPs.
 * Filled green background, white text. Tapping − at qty 1 calls onDec which
 * the parent can interpret as "remove from cart".
 */
export default function GroceryStepper({ qty, onInc, onDec, size = 'sm' }) {
  const cfg = size === 'lg'
    ? { h: 'h-[38px]', w: 'w-9', fs: 'text-base', qfs: 'text-sm', pad: 'px-2.5' }
    : { h: 'h-[26px]', w: 'w-6', fs: 'text-xs', qfs: 'text-[11px]', pad: 'px-1.5' };
  return (
    <div className={`inline-flex items-center bg-green-600 text-white rounded-md overflow-hidden ${cfg.h}`}>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onDec?.(); }}
        className={`${cfg.w} h-full font-extrabold ${cfg.fs} active:bg-green-700`}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className={`${cfg.pad} font-extrabold ${cfg.qfs} min-w-[18px] text-center`}>{qty}</span>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onInc?.(); }}
        className={`${cfg.w} h-full font-extrabold ${cfg.fs} active:bg-green-700`}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
