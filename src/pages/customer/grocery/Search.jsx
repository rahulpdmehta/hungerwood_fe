import { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, X, Search as SearchIcon, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@services/api';
import { useDebounce } from '@hooks/useDebounce';
import { optimizeImage } from '@utils/image';
import {
  useGroceryProductsPublic,
  useGroceryCategoriesPublic,
} from '@hooks/useGroceryCustomerQueries';
import GroceryProductCard from '@components/grocery/GroceryProductCard';
import GroceryCardSkeleton from '@components/grocery/GroceryCardSkeleton';
import CategoryTile from '@components/grocery/CategoryTile';
import CategoryTileSkeleton from '@components/grocery/CategoryTileSkeleton';

const RECENT_KEY = 'grocery.recent';
const MAX_RECENT = 5;

const loadRecent = () => {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch { return []; }
};
const saveRecent = (list) => {
  try { localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, MAX_RECENT))); } catch { /* noop */ }
};

const fetchTrending = async () => (await api.get('/grocery/search/trending')).data || [];
const fetchSuggest = (q) => async () => (await api.get(`/grocery/search/suggest`, { params: { q } })).data || [];

export default function GrocerySearch() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const debounced = useDebounce(q, 200);
  const [recent, setRecent] = useState(loadRecent);

  const { data: trending = [] } = useQuery({
    queryKey: ['grocery', 'search', 'trending'],
    queryFn: fetchTrending,
    staleTime: 60_000,
  });
  const { data: suggestions = [] } = useQuery({
    queryKey: ['grocery', 'search', 'suggest', debounced],
    queryFn: fetchSuggest(debounced),
    enabled: debounced.length >= 2,
  });

  const { data: allProducts = [], isLoading: productsLoading } = useGroceryProductsPublic();
  const { data: categories = [], isLoading: categoriesLoading } = useGroceryCategoriesPublic();
  const topPicks = useMemo(() => {
    const bestsellers = allProducts.filter(p => p.tags?.isBestseller);
    const picks = bestsellers.length >= 8 ? bestsellers : allProducts;
    return picks.slice(0, 10);
  }, [allProducts]);

  const submit = (term) => {
    const t = term.trim();
    if (!t) return;
    const next = [t, ...recent.filter(r => r !== t)].slice(0, MAX_RECENT);
    saveRecent(next);
    setRecent(next);
    api.post('/grocery/search/log', { term: t }).catch(() => {});
    // Navigate to first matching product detail when one suggestion fits exactly,
    // otherwise stay on the search page with results filtered.
    setQ(t);
  };

  const removeRecent = (term) => {
    const next = recent.filter(r => r !== term);
    saveRecent(next);
    setRecent(next);
  };

  return (
    <div className="min-h-screen bg-[#f8f7f6] dark:bg-[#211811]">
      <nav className="sticky top-0 z-30 bg-[#7f4f13] text-white p-3 flex items-center gap-2">
        <Link to="/grocery" className="flex size-8 items-center justify-center rounded-full bg-white/15">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1 flex items-center gap-2 bg-white/15 rounded-lg px-3 py-2">
          <SearchIcon size={14} />
          <input
            autoFocus
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') submit(q); }}
            placeholder="Search products"
            className="flex-1 bg-transparent outline-none text-sm placeholder-white/60"
          />
          {q && <button onClick={() => setQ('')} aria-label="Clear"><X size={14} /></button>}
        </div>
      </nav>

      <main className="max-w-md mx-auto pb-10">
        {q.length < 2 && recent.length > 0 && (
          <section className="px-4 pt-4">
            <h6 className="text-[10px] font-extrabold text-stone-500 uppercase tracking-wider mb-1">Recent searches</h6>
            {recent.map(r => (
              <div key={r} className="flex items-center gap-2.5 py-2 border-b border-dashed border-stone-200 text-sm">
                <Clock size={14} className="text-stone-400" />
                <button onClick={() => submit(r)} className="flex-1 text-left">{r}</button>
                <button onClick={() => removeRecent(r)} aria-label="Remove" className="text-stone-400"><X size={12} /></button>
              </div>
            ))}
          </section>
        )}

        {q.length < 2 && trending.length > 0 && (
          <section className="px-4 pt-5">
            <h6 className="text-[10px] font-extrabold text-stone-500 uppercase tracking-wider mb-2">Trending in Gaya</h6>
            <div className="flex flex-wrap gap-1.5">
              {trending.map(t => (
                <button
                  key={t.term}
                  onClick={() => submit(t.term)}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${t.hot ? 'bg-amber-100 border-amber-400 text-amber-700' : 'bg-white border-stone-200 text-stone-700'}`}
                >
                  {t.hot && <span className="mr-1">🔥</span>}{t.term}
                </button>
              ))}
            </div>
          </section>
        )}

        {q.length < 2 && (
          <section className="pt-6">
            <h6 className="px-4 text-[10px] font-extrabold text-stone-500 uppercase tracking-wider mb-2">Top picks for you</h6>
            {productsLoading ? (
              <div className="flex gap-2 overflow-x-auto px-4 scrollbar-hide pb-1">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="min-w-[130px] max-w-[130px]">
                    <GroceryCardSkeleton />
                  </div>
                ))}
              </div>
            ) : topPicks.length > 0 ? (
              <div className="flex gap-2 overflow-x-auto px-4 scrollbar-hide pb-1">
                {topPicks.map(p => (
                  <div key={p.id || p._id} className="min-w-[130px] max-w-[130px]">
                    <GroceryProductCard product={p} />
                  </div>
                ))}
              </div>
            ) : null}
          </section>
        )}

        {q.length < 2 && (
          <section className="pt-6 px-4">
            <h6 className="text-[10px] font-extrabold text-stone-500 uppercase tracking-wider mb-2">Shop by category</h6>
            {categoriesLoading ? (
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <CategoryTileSkeleton key={i} />)}
              </div>
            ) : categories.length > 0 ? (
              <div className="grid grid-cols-4 gap-2">
                {categories.slice(0, 8).map(c => (
                  <CategoryTile key={c.id || c._id} category={c} />
                ))}
              </div>
            ) : null}
          </section>
        )}

        {q.length < 2 && !productsLoading && allProducts.length > topPicks.length && (
          <section className="pt-6 px-4">
            <h6 className="text-[10px] font-extrabold text-stone-500 uppercase tracking-wider mb-2">More to explore</h6>
            <div className="grid grid-cols-3 gap-2">
              {allProducts.slice(topPicks.length, topPicks.length + 9).map(p => (
                <GroceryProductCard key={p.id || p._id} product={p} />
              ))}
            </div>
          </section>
        )}

        {q.length < 2 && !productsLoading && !categoriesLoading && recent.length === 0 && trending.length === 0 && topPicks.length === 0 && categories.length === 0 && (
          <div className="text-center text-stone-400 text-sm py-16 px-6">
            Start typing to search our catalogue.
          </div>
        )}

        {debounced.length >= 2 && (
          <section className="pt-2">
            <h6 className="text-[10px] font-extrabold text-stone-500 uppercase tracking-wider mb-1 px-4">
              {suggestions.length ? `Suggestions for "${debounced}"` : `No results for "${debounced}"`}
            </h6>
            {suggestions.map(s => (
              <button
                key={s.id}
                onClick={() => navigate(`/grocery/p/${s.id}`)}
                className="flex items-center gap-2.5 px-4 py-2 w-full text-left hover:bg-stone-100 dark:hover:bg-white/5"
              >
                {s.image ? (
                  <img
                    src={optimizeImage(s.image, 40)}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="w-9 h-9 rounded-md object-cover flex-shrink-0 bg-stone-200"
                    aria-hidden
                  />
                ) : (
                  <div className="w-9 h-9 rounded-md bg-stone-200 flex-shrink-0" aria-hidden />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-bold truncate">{s.name}</div>
                  <div className="text-[10px] text-stone-500 truncate">{s.brand && `${s.brand} · `}{s.category}</div>
                </div>
              </button>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
