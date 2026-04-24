/**
 * Progress bar shown in the cart when subtotal hasn't crossed the
 * free-delivery threshold. Hidden if threshold is null/0 or already met.
 */
export default function FreeDeliveryProgress({ subtotal, threshold }) {
  if (!threshold || threshold <= 0) return null;
  if (subtotal >= threshold) {
    return (
      <div className="bg-green-50 text-green-800 px-3 py-2 rounded-lg mb-3 text-[10px] font-bold flex items-center gap-2">
        <span aria-hidden>✓</span> You've unlocked FREE delivery
      </div>
    );
  }
  const remaining = threshold - subtotal;
  const pct = Math.min(100, (subtotal / threshold) * 100);
  return (
    <div className="bg-green-50 px-3 py-2 rounded-lg mb-3 text-[10px] text-gray-800">
      <div>Add <strong>₹{Math.round(remaining)} more</strong> for <strong className="text-green-700">FREE delivery</strong></div>
      <div className="h-1 bg-green-200 rounded-full mt-1.5 overflow-hidden">
        <div className="h-full bg-green-600 transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
