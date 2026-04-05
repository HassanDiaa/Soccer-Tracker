import { useState } from "react";
import { LOCATIONS, LOCATION_COLORS, Location } from "@/lib/storage";

interface LocationTabsProps {
  selected: Location;
  onSelect: (loc: Location) => void;
}

export function LocationTabs({ selected, onSelect }: LocationTabsProps) {
  const [open, setOpen] = useState(false);
  const colors = LOCATION_COLORS[selected];
  const selectedName = LOCATIONS.find((l) => l.id === selected)?.name ?? selected;

  const handleSelect = (loc: Location) => {
    onSelect(loc);
    setOpen(false);
  };

  return (
    <div className="w-full rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-white/30 text-white font-bold text-sm"
      >
        <span>{selectedName}</span>
        <span
          className="text-white/80 transition-transform duration-200 text-xs"
          style={{ display: "inline-block", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          ▼
        </span>
      </button>

      {open && (
        <div className="flex flex-col">
          {LOCATIONS.filter((l) => l.id !== selected).map((loc) => {
            const locColors = LOCATION_COLORS[loc.id];
            return (
              <button
                key={loc.id}
                onClick={() => handleSelect(loc.id)}
                className={`w-full text-left px-4 py-2.5 text-sm font-semibold text-white border-t border-white/20 ${locColors.header} transition-all duration-150 active:opacity-80`}
              >
                {loc.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
