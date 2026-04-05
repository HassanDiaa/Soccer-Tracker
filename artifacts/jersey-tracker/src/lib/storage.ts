export type Location = "irvine" | "garden-grove" | "yorba-linda";
export type GearType = "jersey" | "hoodie";

export const LOCATIONS: { id: Location; name: string }[] = [
  { id: "irvine", name: "Irvine" },
  { id: "garden-grove", name: "Garden Grove" },
  { id: "yorba-linda", name: "Yorba Linda" },
];

export const JERSEY_SIZES = ["4XS", "3XS", "2XS", "XS", "S", "M", "L", "XL", "2XL"] as const;
export const HOODIE_SIZES = ["S", "M", "L", "XL", "2XL", "3XL"] as const;

export type JerseySize = (typeof JERSEY_SIZES)[number];
export type HoodieSize = (typeof HOODIE_SIZES)[number];

export type Inventory = Record<string, number>;

const INVENTORY_KEY = "gear_inventory_v2";
const LOCATION_KEY = "last_location_v2";
const ADMIN_TAB_KEY = "admin_last_location_v2";
const ADMIN_PASSWORD_KEY = "admin_password_v1";

export function loadAdminPassword(): string {
  try {
    return localStorage.getItem(ADMIN_PASSWORD_KEY) || "admin123";
  } catch {
    return "admin123";
  }
}

export function saveAdminPassword(pw: string) {
  localStorage.setItem(ADMIN_PASSWORD_KEY, pw);
}

function getDefaultInventory(): Record<Location, { jersey: Inventory; hoodie: Inventory }> {
  const obj: Record<string, { jersey: Inventory; hoodie: Inventory }> = {};
  for (const loc of LOCATIONS) {
    const jerseys: Inventory = {};
    for (const s of JERSEY_SIZES) jerseys[s] = 0;
    const hoodies: Inventory = {};
    for (const s of HOODIE_SIZES) hoodies[s] = 0;
    obj[loc.id] = { jersey: jerseys, hoodie: hoodies };
  }
  return obj as Record<Location, { jersey: Inventory; hoodie: Inventory }>;
}

export function loadInventory(): Record<Location, { jersey: Inventory; hoodie: Inventory }> {
  try {
    const raw = localStorage.getItem(INVENTORY_KEY);
    if (!raw) return getDefaultInventory();
    const parsed = JSON.parse(raw);
    const defaults = getDefaultInventory();
    for (const loc of LOCATIONS) {
      if (!parsed[loc.id]) parsed[loc.id] = defaults[loc.id];
      if (!parsed[loc.id].jersey) parsed[loc.id].jersey = defaults[loc.id].jersey;
      if (!parsed[loc.id].hoodie) parsed[loc.id].hoodie = defaults[loc.id].hoodie;
      for (const s of JERSEY_SIZES) {
        if (typeof parsed[loc.id].jersey[s] !== "number") parsed[loc.id].jersey[s] = 0;
      }
      for (const s of HOODIE_SIZES) {
        if (typeof parsed[loc.id].hoodie[s] !== "number") parsed[loc.id].hoodie[s] = 0;
      }
    }
    return parsed;
  } catch {
    return getDefaultInventory();
  }
}

export function saveInventory(inv: Record<Location, { jersey: Inventory; hoodie: Inventory }>) {
  localStorage.setItem(INVENTORY_KEY, JSON.stringify(inv));
}

export function loadLastLocation(): Location {
  try {
    const raw = localStorage.getItem(LOCATION_KEY);
    if (raw && LOCATIONS.find((l) => l.id === raw)) return raw as Location;
  } catch {}
  return "irvine";
}

export function saveLastLocation(loc: Location) {
  localStorage.setItem(LOCATION_KEY, loc);
}

export function loadAdminLastLocation(): Location {
  try {
    const raw = localStorage.getItem(ADMIN_TAB_KEY);
    if (raw && LOCATIONS.find((l) => l.id === raw)) return raw as Location;
  } catch {}
  return "irvine";
}

export function saveAdminLastLocation(loc: Location) {
  localStorage.setItem(ADMIN_TAB_KEY, loc);
}

export const LOCATION_COLORS: Record<Location, {
  bg: string;
  text: string;
  tabBg: string;
  tabText: string;
  activeTab: string;
  button: string;
  buttonHover: string;
  buttonText: string;
  confirmBg: string;
  header: string;
  badge: string;
  badgeText: string;
  border: string;
  chipBg: string;
  chipText: string;
}> = {
  irvine: {
    bg: "bg-[#e8f7f9]",
    text: "text-[#1a7a8a]",
    tabBg: "bg-[#3aadba]",
    tabText: "text-white",
    activeTab: "bg-[#3aadba]",
    button: "bg-[#3aadba]",
    buttonHover: "hover:bg-[#2d9aa8]",
    buttonText: "text-white",
    confirmBg: "bg-[#3aadba]",
    header: "bg-[#3aadba]",
    badge: "bg-[#c0eaf0]",
    badgeText: "text-[#1a7a8a]",
    border: "border-[#3aadba]",
    chipBg: "bg-[#3aadba]",
    chipText: "text-white",
  },
  "garden-grove": {
    bg: "bg-[#fff3e8]",
    text: "text-[#c05a00]",
    tabBg: "bg-[#e87b2a]",
    tabText: "text-white",
    activeTab: "bg-[#e87b2a]",
    button: "bg-[#e87b2a]",
    buttonHover: "hover:bg-[#d06a1a]",
    buttonText: "text-white",
    confirmBg: "bg-[#e87b2a]",
    header: "bg-[#e87b2a]",
    badge: "bg-[#fde0c0]",
    badgeText: "text-[#c05a00]",
    border: "border-[#e87b2a]",
    chipBg: "bg-[#e87b2a]",
    chipText: "text-white",
  },
  "yorba-linda": {
    bg: "bg-[#f9f5e0]",
    text: "text-[#7a6800]",
    tabBg: "bg-[#a89428]",
    tabText: "text-white",
    activeTab: "bg-[#a89428]",
    button: "bg-[#a89428]",
    buttonHover: "hover:bg-[#927f20]",
    buttonText: "text-white",
    confirmBg: "bg-[#a89428]",
    header: "bg-[#a89428]",
    badge: "bg-[#f0e8a0]",
    badgeText: "text-[#7a6800]",
    border: "border-[#a89428]",
    chipBg: "bg-[#a89428]",
    chipText: "text-white",
  },
};
