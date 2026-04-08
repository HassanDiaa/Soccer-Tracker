import { Location, LOCATION_COLORS } from "@/lib/storage";

interface ConfirmDrawerProps {
  pendingSelections: Record<string, number>;
  inventory: Record<string, number>;
  location: Location;
  gearType: "jersey" | "hoodie";
  onConfirm: () => void;
  onCancel: () => void;
  onRemove: (size: string) => void;
  onIncrement: (size: string) => void;
  onDecrement: (size: string) => void;
}

export function ConfirmDrawer({
  pendingSelections,
  inventory,
  location,
  gearType,
  onConfirm,
  onCancel,
  onRemove,
  onIncrement,
  onDecrement,
}: ConfirmDrawerProps) {
  const colors = LOCATION_COLORS[location];
  const entries = Object.entries(pendingSelections).filter(([, qty]) => qty > 0);

  if (entries.length === 0) return null;

  const totalItems = entries.reduce((sum, [, qty]) => sum + qty, 0);
  const label = gearType === "jersey" ? "Jersey" : "Hoodie";

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-t-2xl shadow-2xl pb-safe">
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-4" />
        <div className={`px-5 py-3 ${colors.button}`}>
          <h2 className={`text-base font-bold ${colors.buttonText}`}>
            Confirm {label} Selection
          </h2>
          <p className={`text-xs ${colors.buttonText} opacity-80 mt-0.5`}>
            {totalItems} item{totalItems !== 1 ? "s" : ""} across {entries.length} size{entries.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="px-5 py-4 space-y-2 max-h-64 overflow-y-auto">
          {entries.map(([size, qty]) => {
            const stock = inventory[size] ?? 0;
            const atMax = qty >= stock;
            return (
              <div
                key={size}
                className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2.5"
              >
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onRemove(size)}
                    className="w-6 h-6 rounded-full bg-red-100 text-red-500 text-sm font-bold flex items-center justify-center leading-none shrink-0"
                    aria-label={`Remove ${size}`}
                  >
                    ×
                  </button>
                  <span className="font-bold text-gray-900 text-sm">{size}</span>
                  <span className="text-gray-400 text-xs">{label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onDecrement(size)}
                    disabled={qty <= 1}
                    className="w-7 h-7 rounded-lg bg-gray-200 text-gray-700 font-bold text-base flex items-center justify-center disabled:opacity-30 active:scale-90 transition-transform"
                  >
                    −
                  </button>
                  <span className={`w-6 text-center font-bold text-sm ${colors.text}`}>{qty}</span>
                  <button
                    onClick={() => onIncrement(size)}
                    disabled={atMax}
                    className={`w-7 h-7 rounded-lg font-bold text-base flex items-center justify-center active:scale-90 transition-transform ${atMax ? "bg-gray-100 text-gray-300" : `${colors.button} ${colors.buttonText}`}`}
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="px-5 pb-6 pt-2 grid grid-cols-2 gap-3">
          <button
            onClick={onCancel}
            className="py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`py-3 rounded-xl ${colors.button} ${colors.buttonText} font-bold text-sm shadow-sm active:scale-95 transition-transform`}
          >
            Give {totalItems} {label}{totalItems !== 1 ? "s" : ""}
          </button>
        </div>
      </div>
    </div>
  );
}
