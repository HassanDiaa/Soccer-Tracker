import { Location, LOCATION_COLORS } from "@/lib/storage";

interface SizeGridProps {
  sizes: readonly string[];
  selected: Record<string, number>;
  inventory: Record<string, number>;
  onToggle: (size: string) => void;
  location: Location;
  cols: number;
}

export function SizeGrid({ sizes, selected, inventory, onToggle, location, cols }: SizeGridProps) {
  const colors = LOCATION_COLORS[location];

  return (
    <div
      className="grid gap-3 w-full"
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
    >
      {sizes.map((size) => {
        const qty = selected[size] || 0;
        const isSelected = qty > 0;
        const stock = inventory[size] ?? 0;

        return (
          <button
            key={size}
            onClick={() => onToggle(size)}
            className={[
              "relative flex flex-col items-center justify-center rounded-2xl font-bold transition-all duration-150 select-none aspect-square",
              isSelected
                ? `${colors.button} ${colors.buttonText} shadow-lg scale-95`
                : "bg-white border-2 border-gray-200 text-gray-700 active:scale-95",
            ].join(" ")}
          >
            <span className="text-xl font-extrabold leading-none">{size}</span>
            <span className={`text-xs mt-1 font-semibold ${isSelected ? "opacity-80" : colors.text}`}>
              {stock} left
            </span>
            {isSelected && (
              <span className="absolute top-1.5 right-2 text-xs font-bold opacity-90">
                ×{qty}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
