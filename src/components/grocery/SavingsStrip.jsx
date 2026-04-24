/**
 * Green callout shown at the top of the cart when MRP savings > 0.
 * Sums (mrp - sellingPrice) * qty across cart items.
 */
export default function SavingsStrip({ savings }) {
  if (!savings || savings <= 0) return null;
  return (
    <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg text-[11px] font-bold flex items-center gap-2 mb-3">
      <span aria-hidden>🎉</span>
      <span>You're saving ₹{Math.round(savings)} on this order</span>
    </div>
  );
}
