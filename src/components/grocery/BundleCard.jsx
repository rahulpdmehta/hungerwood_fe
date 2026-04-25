import { optimizeImage } from '@utils/image';

/**
 * Curated bundle card. Theme drives the gradient + accent CTA color.
 */

const THEMES = {
  warm: {
    grad: 'from-amber-100 to-amber-300',
    border: 'border-amber-300',
    cta: 'bg-amber-900 text-white',
    badge: 'bg-rose-600',
    title: 'text-amber-950',
  },
  green: {
    grad: 'from-emerald-100 to-emerald-300',
    border: 'border-emerald-400',
    cta: 'bg-emerald-700 text-white',
    badge: 'bg-emerald-700',
    title: 'text-emerald-950',
  },
  rose: {
    grad: 'from-rose-100 to-rose-300',
    border: 'border-rose-400',
    cta: 'bg-rose-600 text-white',
    badge: 'bg-rose-600',
    title: 'text-rose-950',
  },
};

export default function BundleCard({ bundle, onAdd, busy }) {
  const t = THEMES[bundle.theme] || THEMES.warm;
  const savings = Math.max(0, (bundle.regularPrice || 0) - (bundle.bundlePrice || 0));
  return (
    <div className={`mx-3 my-2 rounded-2xl bg-gradient-to-br ${t.grad} border ${t.border} p-3 relative overflow-hidden shadow-sm`}>
      {savings > 0 && (
        <span className={`inline-block ${t.badge} text-white text-2xs font-extrabold px-1.5 py-0.5 rounded`}>
          SAVE ₹{Math.round(savings)}
        </span>
      )}
      <h5 className={`mt-1.5 text-sm font-extrabold ${t.title}`}>{bundle.name}</h5>
      {bundle.description && <p className="text-2xs text-stone-700 opacity-80">{bundle.description}</p>}

      <div className="flex gap-1 mt-2">
        {(bundle.items || []).slice(0, 6).map((it, i) => (
          it.image ? (
            <img
              key={i}
              src={optimizeImage(it.image, 40)}
              alt=""
              loading="lazy"
              decoding="async"
              className="w-9 h-9 rounded-md object-cover bg-white/60 border-[1.5px] border-white shadow-sm"
              aria-hidden
            />
          ) : (
            <div key={i} className="w-9 h-9 rounded-md bg-white/60 border-[1.5px] border-white shadow-sm" aria-hidden />
          )
        ))}
      </div>

      <div className="flex justify-between items-center mt-2">
        <div className="text-[12px] font-extrabold text-stone-900">
          ₹{Math.round(bundle.bundlePrice)}
          {savings > 0 && <span className="ml-1 text-stone-500 line-through font-medium text-2xs">₹{Math.round(bundle.regularPrice)}</span>}
        </div>
        <button
          onClick={onAdd}
          disabled={busy}
          className={`text-2xs font-extrabold px-3 py-1.5 rounded-md ${t.cta} disabled:opacity-50`}
        >
          {busy ? 'Adding…' : 'Add bundle'}
        </button>
      </div>
    </div>
  );
}
