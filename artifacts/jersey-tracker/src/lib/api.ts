import { Location, LOCATIONS, JERSEY_SIZES, HOODIE_SIZES } from "./storage";

type GearType = "jersey" | "hoodie";
type InventoryMap = Record<Location, { jersey: Record<string, number>; hoodie: Record<string, number> }>;

function buildEmpty(): InventoryMap {
  const result: Record<string, { jersey: Record<string, number>; hoodie: Record<string, number> }> = {};
  for (const loc of LOCATIONS) {
    result[loc.id] = { jersey: {}, hoodie: {} };
    for (const s of JERSEY_SIZES) result[loc.id].jersey[s] = 0;
    for (const s of HOODIE_SIZES) result[loc.id].hoodie[s] = 0;
  }
  return result as InventoryMap;
}

const BASE = `${import.meta.env.VITE_API_URL ?? ""}/api`;

export async function fetchInventory(): Promise<InventoryMap> {
  try {
    const res = await fetch(`${BASE}/inventory`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return buildEmpty();
  }
}

export async function fetchGiven(): Promise<InventoryMap> {
  try {
    const res = await fetch(`${BASE}/given`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return buildEmpty();
  }
}

export async function confirmSizes(
  location: Location,
  gearType: GearType,
  sizes: Record<string, number>
): Promise<boolean> {
  try {
    const res = await fetch(`${BASE}/inventory/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ location, gearType, sizes }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function setInventory(
  location: Location,
  gearType: GearType,
  size: string,
  quantity: number
): Promise<boolean> {
  try {
    const res = await fetch(`${BASE}/inventory/set`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ location, gearType, size, quantity }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function addInventory(
  location: Location,
  gearType: GearType,
  sizes: Record<string, number>
): Promise<boolean> {
  try {
    const res = await fetch(`${BASE}/inventory/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ location, gearType, sizes }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
