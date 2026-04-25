import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@services/api';
import useGroceryCartStore from '@store/useGroceryCartStore';
import BundleCard from '@components/grocery/BundleCard';
import GroceryBottomNavBar from '@components/layout/GroceryBottomNavBar';

const fetchBundles = async () => (await api.get('/grocery/bundles')).data || [];

export default function GroceryBundles() {
  const navigate = useNavigate();
  const applyBundle = useGroceryCartStore(s => s.applyBundle);
  const [busySlug, setBusySlug] = useState(null);

  const { data: bundles = [], isLoading } = useQuery({
    queryKey: ['grocery', 'bundles'],
    queryFn: fetchBundles,
  });

  const addBundle = async (bundle) => {
    setBusySlug(bundle.slug);
    try {
      const res = await api.get(`/grocery/bundles/${bundle.slug}`);
      const data = res.data;
      if (!data || !data.items?.length) throw new Error('Bundle is unavailable');
      applyBundle(
        { slug: data.slug, name: data.name, discount: data.bundleDiscount, regularPrice: data.regularPrice, bundlePrice: data.bundlePrice },
        data.items
      );
      toast.success(`${data.name} added · save ₹${Math.round(data.bundleDiscount)}`);
      navigate('/grocery/cart');
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Could not add bundle');
    } finally {
      setBusySlug(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f6] dark:bg-[#211811] pb-24">
      <nav className="sticky top-0 z-30 bg-white dark:bg-[#211811] border-b border-stone-200 dark:border-gray-700">
        <div className="flex items-center p-4 max-w-md mx-auto">
          <Link to="/grocery" className="flex size-10 items-center justify-center rounded-full hover:bg-stone-100">
            <ArrowLeft size={20} />
          </Link>
          <h2 className="text-base font-bold ml-2">Smart bundles</h2>
        </div>
      </nav>

      <main className="max-w-md mx-auto pt-2">
        <p className="px-4 py-2 text-2xs text-stone-600 dark:text-stone-400">
          Hand-picked bundles by HungerWood — save more when bought together.
        </p>

        {isLoading && <div className="text-center text-stone-500 py-10">Loading…</div>}
        {!isLoading && bundles.length === 0 && (
          <div className="text-center text-stone-500 py-10">No bundles available right now.</div>
        )}

        {bundles.map(b => (
          <BundleCard
            key={b._id}
            bundle={b}
            onAdd={() => addBundle(b)}
            busy={busySlug === b.slug}
          />
        ))}
      </main>
      <GroceryBottomNavBar />
    </div>
  );
}
