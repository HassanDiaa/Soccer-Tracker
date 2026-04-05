import { LOCATIONS, LOCATION_COLORS, Location } from "@/lib/storage";

interface LocationTabsProps {
  selected: Location;
  onSelect: (loc: Location) => void;
}

export function LocationTabs({ selected, onSelect }: LocationTabsProps) {
  return (
    <div className="flex w-full">
      {LOCATIONS.map((loc) => {
        const colors = LOCATION_COLORS[loc.id];
        const isActive = selected === loc.id;
        return (
          <button
            key={loc.id}
            onClick={() => onSelect(loc.id)}
            className={[
              "flex-1 py-2 text-xs font-bold tracking-wide transition-all duration-200",
              isActive
                ? `${colors.tabBg} ${colors.tabText} shadow-sm`
                : "bg-white/60 text-gray-500 hover:bg-white/80",
              "first:rounded-tl-xl last:rounded-tr-xl",
            ].join(" ")}
          >
            {loc.name}
          </button>
        );
      })}
    </div>
  );
}
