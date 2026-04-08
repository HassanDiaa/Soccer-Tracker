import { Router, type IRouter } from "express";
import { pool } from "@workspace/db";

const router: IRouter = Router();

const LOCATIONS = ["irvine", "garden-grove", "yorba-linda"];
const JERSEY_SIZES = ["4XS", "3XS", "2XS", "XS", "S", "M", "L", "XL", "2XL"];
const HOODIE_SIZES = ["S", "M", "L", "XL", "2XL", "3XL"];

type GearType = "jersey" | "hoodie";

function buildEmpty() {
  const result: Record<string, { jersey: Record<string, number>; hoodie: Record<string, number> }> = {};
  for (const loc of LOCATIONS) {
    result[loc] = { jersey: {}, hoodie: {} };
    for (const s of JERSEY_SIZES) result[loc].jersey[s] = 0;
    for (const s of HOODIE_SIZES) result[loc].hoodie[s] = 0;
  }
  return result;
}

router.get("/inventory", async (_req, res) => {
  const { rows } = await pool.query<{ location: string; gear_type: string; size: string; quantity: number }>(
    "SELECT location, gear_type, size, quantity FROM inventory"
  );
  const data = buildEmpty();
  for (const row of rows) {
    if (data[row.location]?.[row.gear_type as GearType]) {
      data[row.location][row.gear_type as GearType][row.size] = row.quantity;
    }
  }
  res.json(data);
});

router.get("/given", async (_req, res) => {
  const { rows } = await pool.query<{ location: string; gear_type: string; size: string; quantity: number }>(
    "SELECT location, gear_type, size, quantity FROM given"
  );
  const data = buildEmpty();
  for (const row of rows) {
    if (data[row.location]?.[row.gear_type as GearType]) {
      data[row.location][row.gear_type as GearType][row.size] = row.quantity;
    }
  }
  res.json(data);
});

router.post("/inventory/confirm", async (req, res) => {
  const { location, gearType, sizes } = req.body as {
    location: string;
    gearType: GearType;
    sizes: Record<string, number>;
  };

  if (!location || !gearType || !sizes) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const [size, qty] of Object.entries(sizes)) {
      if (qty <= 0) continue;
      await client.query(
        `INSERT INTO inventory (location, gear_type, size, quantity)
         VALUES ($1, $2, $3, 0)
         ON CONFLICT (location, gear_type, size) DO NOTHING`,
        [location, gearType, size]
      );
      await client.query(
        `UPDATE inventory SET quantity = GREATEST(0, quantity - $4)
         WHERE location = $1 AND gear_type = $2 AND size = $3`,
        [location, gearType, size, qty]
      );
      await client.query(
        `INSERT INTO given (location, gear_type, size, quantity)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (location, gear_type, size)
         DO UPDATE SET quantity = given.quantity + $4`,
        [location, gearType, size, qty]
      );
    }
    await client.query("COMMIT");
    res.json({ ok: true });
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
});

router.put("/inventory/set", async (req, res) => {
  const { location, gearType, size, quantity } = req.body as {
    location: string;
    gearType: GearType;
    size: string;
    quantity: number;
  };

  if (!location || !gearType || !size || quantity == null) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  await pool.query(
    `INSERT INTO inventory (location, gear_type, size, quantity)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (location, gear_type, size)
     DO UPDATE SET quantity = $4`,
    [location, gearType, size, Math.max(0, quantity)]
  );
  res.json({ ok: true });
});

router.post("/inventory/add", async (req, res) => {
  const { location, gearType, sizes } = req.body as {
    location: string;
    gearType: GearType;
    sizes: Record<string, number>;
  };

  if (!location || !gearType || !sizes) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const [size, qty] of Object.entries(sizes)) {
      if (qty <= 0) continue;
      await client.query(
        `INSERT INTO inventory (location, gear_type, size, quantity)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (location, gear_type, size)
         DO UPDATE SET quantity = inventory.quantity + $4`,
        [location, gearType, size, qty]
      );
    }
    await client.query("COMMIT");
    res.json({ ok: true });
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
});

export default router;
