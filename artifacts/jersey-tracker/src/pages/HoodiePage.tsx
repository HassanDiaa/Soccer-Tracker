import { useState, useCallback } from "react";
import {
  Location,
  LOCATION_COLORS,
  HOODIE_SIZES,
  loadInventory,
  saveInventory,
  loadLastLocation,
  saveLastLocation,
} from "@/lib/storage";
import { LocationTabs } from "@/components/LocationTabs";
import { SizeGrid } from "@/components/SizeGrid";
import { ConfirmDrawer } from "@/components/ConfirmDrawer";

export function HoodiePage() {
  const [location, setLocation] = useState<Location>(loadLastLocation);
  const [pending, setPending] = useState<Record<string, number>>({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [flash, setFlash] = useState(false);
  const [inv, setInv] = useState(loadInventory);

  const colors = LOCATION_COLORS[location];

  const handleLocationChange = (loc: Location) => {
    setLocation(loc);
    saveLastLocation(loc);
    setPending({});
    setShowConfirm(false);
    setInv(loadInventory());
  };

  const handleToggle = useCallback((size: string) => {
    setPending((prev) => {
      const qty = (prev[size] || 0) + 1;
      return { ...prev, [size]: qty };
    });
    setShowConfirm(true);
  }, []);

  const handleRemove = (size: string) => {
    setPending((prev) => {
      const next = { ...prev };
      delete next[size];
      if (Object.keys(next).length === 0) setShowConfirm(false);
      return next;
    });
  };

  const handleConfirm = () => {
    const current = loadInventory();
    for (const [size, qty] of Object.entries(pending)) {
      const stock = current[location].hoodie[size] || 0;
      current[location].hoodie[size] = Math.max(0, stock - qty);
    }
    saveInventory(current);
    setInv(loadInventory());
    setPending({});
    setShowConfirm(false);
    setFlash(true);
    setTimeout(() => setFlash(false), 800);
  };

  const handleCancel = () => {
    setPending({});
    setShowConfirm(false);
  };

  const hasPending = Object.values(pending).some((v) => v > 0);

  return (
    <div className="flex flex-col h-full">
      <div className={`${colors.header} px-4 pt-4 pb-0`}>
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-white font-bold text-lg tracking-tight">Hoodies</h1>
          {hasPending && (
            <div className="bg-white/25 text-white text-xs font-bold px-3 py-1 rounded-full">
              {Object.values(pending).reduce((a, b) => a + b, 0)} selected
            </div>
          )}
        </div>
        <LocationTabs selected={location} onSelect={handleLocationChange} />
      </div>

      <div className={`flex-1 ${colors.bg} px-4 py-3 flex flex-col gap-2`}>
        {flash && (
          <div className={`${colors.button} text-white text-sm font-bold text-center py-2 rounded-xl shadow animate-in fade-in duration-200`}>
            Inventory updated!
          </div>
        )}
        <p className={`text-xs font-medium ${colors.text} text-center`}>
          Tap a size to select — confirm when done
        </p>
        <SizeGrid
          sizes={HOODIE_SIZES}
          selected={pending}
          inventory={inv[location].hoodie}
          onToggle={handleToggle}
          location={location}
          cols={3}
        />
      </div>

      {showConfirm && hasPending && (
        <ConfirmDrawer
          pendingSelections={pending}
          location={location}
          gearType="hoodie"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          onRemove={handleRemove}
        />
      )}
    </div>
  );
}
