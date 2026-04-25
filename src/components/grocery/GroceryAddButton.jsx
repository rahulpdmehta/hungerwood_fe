/**
 * Compact green ADD button used on grocery product cards and rails.
 * Tap morphs into <GroceryStepper /> on the parent's responsibility.
 */
export default function GroceryAddButton({ onClick, disabled = false, label = 'ADD', size = 'sm' }) {
  const padding = size === 'lg' ? 'px-4 py-1.5 text-xs' : 'px-3 py-1 text-2xs';
  const base = 'font-extrabold uppercase tracking-wide rounded-md border-[1.5px] transition-colors whitespace-nowrap shrink-0';
  const enabled = 'bg-green-600/10 text-green-700 border-green-600 hover:bg-green-600 hover:text-white';
  const off = 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed';
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); if (!disabled) onClick?.(e); }}
      disabled={disabled}
      className={`${base} ${padding} ${disabled ? off : enabled}`}
    >
      {label}
    </button>
  );
}
