import { useState, useCallback, useEffect } from "react";
import {
  Location,
  LOCATION_COLORS,
  JERSEY_SIZES,
  loadLastLocation,
  saveLastLocation,
} from "@/lib/storage";
import { fetchInventory, confirmSizes } from "@/lib/api";
import { LocationTabs } from "@/components/LocationTabs";
import { SizeGrid } from "@/components/SizeGrid";
import { ConfirmBar } from "@/components/ConfirmBar";

type InventoryMap = Record<string, { jersey: Record<string, number>; hoodie: Record<string, number> }>;

export function JerseyPage() {
  const [location, setLocation] = useState<Location>(loadLastLocation);
  const [pending, setPending] = useState<Record<string, number>>({});
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
  };

  const handleToggle = useCallback((size: string) => {
    setPending((prev) => {
      const stock = inv[location]?.jersey[size] ?? 0;
      const current = prev[size] || 0;
      if (current >= stock) return prev;
      return { ...prev, [size]: current + 1 };
    });
  }, [inv, location]);

  const handleClear = () => setPending({});

  const handleConfirm = async () => {
    await confirmSizes(location, "jersey", pending);
    const data = await fetchInventory();
    setInv(data);
    setPending({});
    setFlash(true);
    setTimeout(() => setFlash(false), 800);
  };

  const jerseyInv = inv[location]?.jersey ?? {};
  const hasPending = Object.values(pending).some((v) => v > 0);

  return (
    <div className="flex flex-col h-full">
      <div className={`${colors.header} px-4 pt-4 pb-0`}>
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-white font-bold text-lg tracking-tight">Jerseys</h1>
        </div>
        <LocationTabs selected={location} onSelect={handleLocationChange} />
      </div>

      <div className={`flex-1 ${colors.bg} px-4 py-3 flex flex-col gap-2 overflow-y-auto no-scrollbar`}>
        {flash && (
          <div className={`${colors.button} text-white text-sm font-bold text-center py-2 rounded-xl shadow animate-in fade-in duration-200`}>
            Inventory updated!
          </div>
        )}
        <p className={`text-xs font-medium ${colors.text} text-center`}>
          {loading ? "Loading inventory…" : "Tap a size to add — each tap adds one"}
        </p>
        <SizeGrid
          sizes={JERSEY_SIZES}
          selected={pending}
          inventory={jerseyInv}
          onToggle={handleToggle}
          location={location}
          cols={3}
        />
      </div>

      {hasPending && (
        <ConfirmBar
          pendingSelections={pending}
          location={location}
          gearType="jersey"
          onConfirm={handleConfirm}
          onClear={handleClear}
        />
      )}
    </div>
  );
}
