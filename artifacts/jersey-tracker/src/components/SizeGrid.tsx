import { Location, LOCATION_COLORS } from "@/lib/storage";

interface SizeGridProps {
  sizes: readonly string[];
  selected: Record<string, number>;
  onToggle: (size: string) => void;
  location: Location;
}

export function SizeGrid({ sizes, selected, onToggle, location }: SizeGridProps) {
  const colors = LOCATION_COLORS[location];

  const cols = sizes.length <= 6 ? sizes.length : 5;

  return (
    <div
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
    >
      {sizes.map((size) => {
        const qty = selected[size] || 0;
        const isSelected = qty > 0;
        return (
          <button
            key={size}
            onClick={() => onToggle(size)}
            className={[
              "flex items-center justify-center rounded-xl font-bold transition-all duration-150 select-none",
              "py-3 text-sm",
              isSelected
                ? `${colors.button} ${colors.buttonText} shadow-md scale-95`
                : "bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300 active:scale-95",
            ].join(" ")}
          >
            <span className="leading-none">{size}</span>
          </button>
        );
      })}
    </div>
  );
}
