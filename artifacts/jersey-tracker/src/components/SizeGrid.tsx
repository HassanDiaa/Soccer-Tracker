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
  const rows = Math.ceil(sizes.length / cols);

  return (
    <div
      className="grid gap-2 h-full w-full"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {sizes.map((size) => {
        const qty = selected[size] || 0;
        const isSelected = qty > 0;
        return (
          <button
            key={size}
            onClick={() => onToggle(size)}
            className={[
              "relative flex flex-col items-center justify-center rounded-2xl font-bold transition-all duration-150 select-none w-full h-full",
              "text-base",
              isSelected
                ? `${colors.button} ${colors.buttonText} shadow-md scale-95`
                : "bg-white border-2 border-gray-200 text-gray-700 active:scale-95",
            ].join(" ")}
          >
            <span className="leading-none text-lg font-extrabold">{size}</span>
            {isSelected && (
              <span className="mt-1 text-xs font-bold opacity-90">×{qty}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
