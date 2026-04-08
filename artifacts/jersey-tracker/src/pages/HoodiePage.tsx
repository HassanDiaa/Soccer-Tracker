import { useState, useCallback, useEffect } from "react";
import {
  Location,
  LOCATION_COLORS,
  HOODIE_SIZES,
  loadLastLocation,
  saveLastLocation,
} from "@/lib/storage";
import { fetchInventory, confirmSizes } from "@/lib/api";
import { LocationTabs } from "@/components/LocationTabs";
import { SizeGrid } from "@/components/SizeGrid";
import { ConfirmDrawer } from "@/components/ConfirmDrawer";

type InventoryMap = Record<string, { jersey: Record<string, number>; hoodie: Record<string, number> }>;

export function HoodiePage() {
  const [location, setLocation] = useState<Location>(loadLastLocation);
  const [pending, setPending] = useState<Record<string, number>>({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [flash, setFlash] = useState(false);
  const [inv, setInv] = useState<InventoryMap>({});
  const [loading, setLoading] = useState(true);

  const loadInv = useCallback(async () => {
    const data = await fetchInventory();
    setInv(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadInv();
    const interval = setInterval(loadInv, 10000);
    return () => clearInterval(interval);
  }, [loadInv]);

  const colors = LOCATION_COLORS[location];

  const handleLocationChange = (loc: Location) => {
    setLocation(loc);
    saveLastLocation(loc);
    setPending({});
    setShowConfirm(false);
  };

  const handleToggle = useCallback((size: string) => {
    setPending((prev) => {
      if (prev[size]) {
        const next = { ...prev };
        delete next[size];
        return next;
      }
      return { ...prev, [size]: 1 };
    });
  }, []);

  const handleIncrement = useCallback((size: string) => {
    setPending((prev) => {
      const stock = inv[location]?.hoodie[size] ?? 0;
      const current = prev[size] || 0;
      if (current >= stock) return prev;
      return { ...prev, [size]: current + 1 };
    });
  }, [inv, location]);

  const handleDecrement = useCallback((size: string) => {
    setPending((prev) => {
      const current = prev[size] || 0;
      if (current <= 1) return prev;
      return { ...prev, [size]: current - 1 };
    });
  }, []);

  const handleRemove = useCallback((size: string) => {
    setPending((prev) => {
      const next = { ...prev };
      delete next[size];
      return next;
    });
  }, []);

  const handleConfirm = async () => {
    await confirmSizes(location, "hoodie", pending);
    const data = await fetchInventory();
    setInv(data);
    setPending({});
    setShowConfirm(false);
    setFlash(true);
    setTimeout(() => setFlash(false), 800);
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  const hoodieInv = inv[location]?.hoodie ?? {};
  const selectedSizes = Object.keys(pending).filter((s) => pending[s] > 0);
  const totalSelected = selectedSizes.reduce((sum, s) => sum + pending[s], 0);
  const hasPending = totalSelected > 0;

  return (
    <div className="flex flex-col h-full">
      <div className={`${colors.header} px-4 pt-4 pb-0`}>
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-white font-bold text-lg tracking-tight">Hoodies</h1>
          {hasPending && (
            <div className="bg-white/25 text-white text-xs font-bold px-3 py-1 rounded-full">
              {totalSelected} selected
            </div>
          )}
        </div>
        <LocationTabs selected={location} onSelect={handleLocationChange} />
      </div>

      <div className={`flex-1 ${colors.bg} px-4 py-3 flex flex-col gap-2 ${hasPending ? "pb-20" : ""}`}>
        {flash && (
          <div className={`${colors.button} text-white text-sm font-bold text-center py-2 rounded-xl shadow animate-in fade-in duration-200`}>
            Inventory updated!
          </div>
        )}
        <p className={`text-xs font-medium ${colors.text} text-center`}>
          {loading ? "Loading inventory…" : "Tap sizes to select, then review your batch"}
        </p>
        <SizeGrid
          sizes={HOODIE_SIZES}
          selected={pending}
          inventory={hoodieInv}
          onToggle={handleToggle}
          location={location}
          cols={3}
        />
      </div>

      {hasPending && !showConfirm && (
        <div className={`fixed bottom-16 inset-x-0 px-4 z-40`}>
          <button
            onClick={() => setShowConfirm(true)}
            className={`w-full py-3.5 rounded-2xl ${colors.button} ${colors.buttonText} font-bold text-sm shadow-xl active:scale-95 transition-transform`}
          >
            Review {selectedSizes.length} size{selectedSizes.length !== 1 ? "s" : ""} · {totalSelected} hoodie{totalSelected !== 1 ? "s" : ""}
          </button>
        </div>
      )}

      {showConfirm && hasPending && (
        <ConfirmDrawer
          pendingSelections={pending}
          inventory={hoodieInv}
          location={location}
          gearType="hoodie"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          onRemove={handleRemove}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
        />
      )}
    </div>
  );
}
