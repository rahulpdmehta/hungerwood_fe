import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { addressService } from '@services/address.service';

const DEFAULT_PINCODE = '824201';

/**
 * Bottom sheet for picking a delivery address. Used by both food and
 * grocery checkout. Out-of-zone addresses (pincode != Gaya) are shown but
 * not selectable. "Add new" links to the existing /addresses page.
 *
 * Props:
 *   open       (bool)  controls visibility
 *   onClose    (fn)    close handler
 *   selectedId (str)   currently selected address id (or null)
 *   onSelect   (addr)  called with the chosen address; sheet closes
 */
export default function AddressSheet({ open, onClose, selectedId, onSelect }) {
  const { data: res, isLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: addressService.getAddresses,
    enabled: open,
  });
  const addresses = res?.data || [];
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (open) {
      setClosing(false);
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [open]);

  if (!open) return null;

  const close = () => {
    setClosing(true);
    setTimeout(onClose, 150);
  };

  const pick = (a) => {
    onSelect(a);
    close();
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/45 flex items-end transition-opacity ${closing ? 'opacity-0' : 'opacity-100'}`}
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label="Choose delivery address"
    >
      <div
        onClick={e => e.stopPropagation()}
        className={`bg-white dark:bg-[#211811] w-full max-w-md mx-auto rounded-t-3xl p-4 max-h-[80vh] overflow-y-auto shadow-2xl ${closing ? 'translate-y-full' : 'translate-y-0'} transition-transform duration-150`}
      >
        <div className="w-9 h-1 bg-amber-200 rounded-full mx-auto mb-3" aria-hidden />

        <h5 className="font-extrabold text-base">Choose delivery address</h5>
        <p className="text-[11px] text-stone-500 mb-3">Delivery available across Gaya {DEFAULT_PINCODE}</p>

        {isLoading && <div className="py-8 text-center text-stone-500 text-sm">Loading…</div>}

        {!isLoading && addresses.length === 0 && (
          <div className="py-6 text-center text-stone-500 text-sm">
            No saved addresses yet.
          </div>
        )}

        {addresses.map(a => {
          const inZone = (a.pincode || DEFAULT_PINCODE) === DEFAULT_PINCODE;
          const isSelected = selectedId && (selectedId === a.id || selectedId === a._id);
          return (
            <button
              key={a.id || a._id}
              disabled={!inZone}
              onClick={() => pick(a)}
              className={`w-full text-left flex items-start gap-2.5 py-3 border-b border-dashed border-stone-200 dark:border-gray-700 ${!inZone ? 'opacity-60' : 'hover:bg-stone-50 dark:hover:bg-white/5'}`}
            >
              <span
                className={`w-4 h-4 mt-1 rounded-full border-2 ${isSelected ? 'border-green-600' : 'border-stone-300'} flex-shrink-0`}
                style={isSelected ? { background: 'radial-gradient(circle, #16a34a 50%, #fff 60%)' } : {}}
                aria-hidden
              />
              <div className="flex-1">
                <div className="text-[12px] font-extrabold flex items-center gap-1.5">
                  {a.label}
                  {a.isDefault && (
                    <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">DEFAULT</span>
                  )}
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5">
                  {a.street}, Gaya - {a.pincode || DEFAULT_PINCODE}
                  {!inZone && <span className="text-rose-600 ml-1">· Outside delivery zone</span>}
                </div>
              </div>
            </button>
          );
        })}

        <Link
          to="/addresses"
          onClick={close}
          className="mt-4 block text-center w-full py-3 border-[1.5px] border-dashed border-amber-700 bg-amber-700/5 rounded-xl text-amber-700 text-xs font-extrabold"
        >
          + Add new address
        </Link>
      </div>
    </div>
  );
}
