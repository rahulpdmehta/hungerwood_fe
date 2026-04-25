import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@services/api';
import useAuthStore from '@store/useAuthStore';

const fetchSavings = async () => {
  const res = await api.get('/grocery/me/savings');
  return res.data?.savings || 0;
};

/**
 * Animated lifetime savings card on the grocery Home.
 * Counts up from 0 to the actual total over ~800ms on mount.
 * Hidden if the user is unauthenticated or has zero savings this year.
 */
export default function SavingsWidget() {
  const { isAuthenticated } = useAuthStore();
  const { data: target = 0 } = useQuery({
    queryKey: ['grocery', 'me', 'savings'],
    queryFn: fetchSavings,
    enabled: isAuthenticated,
  });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!target) { setN(0); return; }
    const start = performance.now();
    const dur = 800;
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.floor(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  if (!isAuthenticated || !target) return null;

  return (
    <div
      className="mx-4 my-3 rounded-2xl text-white p-3 flex items-center gap-3 relative overflow-hidden shadow-md"
      style={{ background: 'linear-gradient(90deg, #15803D, #16a34a)' }}
    >
      <div className="absolute right-3 -bottom-2 text-[56px] opacity-25 pointer-events-none select-none" aria-hidden>💰</div>
      <div>
        <div className="text-2xl font-extrabold leading-none">₹{n.toLocaleString('en-IN')}</div>
        <div className="text-2xs opacity-90 leading-tight mt-1">
          saved on grocery this year<br />with HungerWood
        </div>
      </div>
    </div>
  );
}
