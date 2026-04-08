import { Location, LOCATION_COLORS } from "@/lib/storage";

interface ConfirmBarProps {
  pendingSelections: Record<string, number>;
  location: Location;
  gearType: "jersey" | "hoodie";
  onConfirm: () => void;
  onClear: () => void;
}

export function ConfirmBar({
  pendingSelections,
  location,
  gearType,
  onConfirm,
  onClear,
}: ConfirmBarProps) {
  const colors = LOCATION_COLORS[location];
  const entries = Object.entries(pendingSelections).filter(([, qty]) => qty > 0);
  if (entries.length === 0) return null;

  const total = entries.reduce((sum, [, qty]) => sum + qty, 0);
  const label = gearType === "jersey" ? "Jersey" : "Hoodie";

  return (
    <div className="bg-white border-t border-gray-100 shadow-[0_-2px_12px_rgba(0,0,0,0.08)] px-3 py-2.5 flex items-center gap-2">
      <button
        onClick={onClear}
        className="shrink-0 w-7 h-7 rounded-full bg-gray-100 text-gray-500 text-sm font-bold flex items-center justify-center leading-none active:scale-90 transition-transform"
        aria-label="Clear selection"
      >
        ×
      </button>

      <div className="flex-1 overflow-x-auto flex items-center gap-1.5 no-scrollbar">
        {entries.map(([size, qty]) => (
          <span
            key={size}
            className={`shrink-0 px-2.5 py-1 rounded-xl text-xs font-bold ${colors.badge} ${colors.badgeText}`}
          >
            {size} ×{qty}
          </span>
        ))}
      </div>

      <button
        onClick={onConfirm}
        className={`shrink-0 px-4 py-2 rounded-xl ${colors.button} ${colors.buttonText} font-bold text-xs active:scale-95 transition-transform whitespace-nowrap`}
      >
        Give {total} {label}{total !== 1 ? "s" : ""}
      </button>
    </div>
  );
}
