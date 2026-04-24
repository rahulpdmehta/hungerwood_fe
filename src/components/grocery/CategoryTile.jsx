import { Link } from 'react-router-dom';
import { optimizeImage } from '@utils/image';

/**
 * Category tile for the grocery Home grid. Each tile takes a category and
 * picks a soft gradient + emoji glyph based on keywords in the name.
 *
 * If no keyword matches, falls back to a neutral stone gradient and a
 * generic basket emoji — and renders the actual category image as well so
 * admin-uploaded imagery still wins when present.
 */

const HUE_MAP = [
  [['atta', 'rice', 'flour', 'grain'], 'from-amber-100 to-amber-300', '🌾'],
  [['dairy', 'milk', 'curd', 'paneer', 'cheese', 'egg'], 'from-blue-100 to-blue-300', '🥛'],
  [['oil', 'ghee'], 'from-yellow-100 to-yellow-300', '🛢'],
  [['snack', 'chip', 'biscuit'], 'from-red-100 to-red-300', '🍿'],
  [['masala', 'spice', 'pickle'], 'from-orange-100 to-orange-300', '🌶'],
  [['beverage', 'drink', 'juice', 'tea', 'coffee'], 'from-emerald-100 to-emerald-300', '🥤'],
  [['bakery', 'bread', 'cake'], 'from-purple-100 to-purple-300', '🥖'],
  [['personal', 'care', 'soap', 'shampoo'], 'from-pink-100 to-pink-300', '🧴'],
  [['cleaning', 'detergent'], 'from-teal-100 to-teal-300', '🧽'],
  [['fruit', 'vegetable', 'veggies'], 'from-lime-100 to-lime-300', '🥬'],
  [['frozen'], 'from-sky-100 to-sky-300', '❄️'],
  [['baby'], 'from-rose-100 to-rose-300', '🍼'],
];

function pickStyle(name = '') {
  const n = name.toLowerCase();
  for (const [keys, hue, emoji] of HUE_MAP) {
    if (keys.some(k => n.includes(k))) return { hue, emoji };
  }
  return { hue: 'from-stone-100 to-stone-300', emoji: '🛒' };
}

export default function CategoryTile({ category }) {
  const { hue, emoji } = pickStyle(category.name);
  const id = category.id || category._id;
  return (
    <Link
      to={`/grocery/c/${id}`}
      className={`block rounded-2xl p-1 text-center shadow-sm border border-white/60 bg-gradient-to-br ${hue} transition-transform active:scale-95`}
    >
      <div className="w-full aspect-square mb-1 rounded-xl bg-white/70 flex items-center justify-center overflow-hidden">
        {category.image ? (
          <img src={optimizeImage(category.image, 160)} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
        ) : (
          <span className="text-[34px]" aria-hidden>{emoji}</span>
        )}
      </div>
      <div className="text-[10px] font-extrabold text-amber-950 leading-tight line-clamp-2 px-1 pb-1">{category.name}</div>
    </Link>
  );
}
