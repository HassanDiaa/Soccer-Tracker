import { useState } from "react";
import {
  Location,
  LOCATION_COLORS,
  LOCATIONS,
  JERSEY_SIZES,
  HOODIE_SIZES,
  loadInventory,
  saveInventory,
  loadGiven,
  loadAdminLastLocation,
  saveAdminLastLocation,
  loadAdminPassword,
  saveAdminPassword,
} from "@/lib/storage";
import { LocationTabs } from "@/components/LocationTabs";

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);

  const handle = () => {
    if (pw === loadAdminPassword()) {
      onLogin();
    } else {
      setError(true);
      setPw("");
    }
  };

  return (
    <div className="flex flex-col h-full items-center justify-center px-8 bg-gray-50">
      <div className="w-full max-w-xs">
        <div className="text-5xl text-center mb-2">🔒</div>
        <h2 className="text-xl font-bold text-gray-900 text-center mb-1">Admin Access</h2>
        <p className="text-xs text-gray-500 text-center mb-6">Enter your admin password to continue</p>
        <input
          type="password"
          value={pw}
          onChange={(e) => { setPw(e.target.value); setError(false); }}
          onKeyDown={(e) => e.key === "Enter" && handle()}
          placeholder="Password"
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#3aadba] transition-colors mb-2"
          autoFocus
        />
        {error && <p className="text-red-500 text-xs text-center mb-2">Incorrect password</p>}
        <button
          onClick={handle}
          className="w-full bg-[#3aadba] text-white font-bold py-3 rounded-xl text-sm active:scale-95 transition-transform"
        >
          Unlock
        </button>
      </div>
    </div>
  );
}

function ChangePasswordSection() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handle = () => {
    setError("");
    setSuccess(false);
    if (current !== loadAdminPassword()) {
      setError("Current password is incorrect.");
      return;
    }
    if (next.length < 4) {
      setError("New password must be at least 4 characters.");
      return;
    }
    if (next !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    saveAdminPassword(next);
    setCurrent("");
    setNext("");
    setConfirm("");
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);
  };

  return (
    <div className="px-4 py-4">
      <h3 className="font-bold text-gray-800 text-sm mb-3">Change Password</h3>
      <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-2">
        <input
          type="password"
          value={current}
          onChange={(e) => { setCurrent(e.target.value); setError(""); }}
          placeholder="Current password"
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-gray-400 transition-colors"
        />
        <input
          type="password"
          value={next}
          onChange={(e) => { setNext(e.target.value); setError(""); }}
          placeholder="New password"
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-gray-400 transition-colors"
        />
        <input
          type="password"
          value={confirm}
          onChange={(e) => { setConfirm(e.target.value); setError(""); }}
          placeholder="Confirm new password"
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-gray-400 transition-colors"
          onKeyDown={(e) => e.key === "Enter" && handle()}
        />
        {error && <p className="text-red-500 text-xs">{error}</p>}
        {success && <p className="text-green-600 text-xs font-semibold">Password updated successfully!</p>}
        <button
          onClick={handle}
          className="w-full bg-gray-900 text-white font-bold py-2.5 rounded-xl text-sm active:scale-95 transition-transform mt-1"
        >
          Update Password
        </button>
      </div>
    </div>
  );
}

function LocationInventoryView({ location }: { location: Location }) {
  const colors = LOCATION_COLORS[location];
  const [inv, setInv] = useState(loadInventory);
  const [bulkJersey, setBulkJersey] = useState<Record<string, string>>({});
  const [bulkHoodie, setBulkHoodie] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const handleBulkSave = (type: "jersey" | "hoodie") => {
    const current = loadInventory();
    const bulk = type === "jersey" ? bulkJersey : bulkHoodie;
    const setBulk = type === "jersey" ? setBulkJersey : setBulkHoodie;
    for (const [size, val] of Object.entries(bulk)) {
      const n = parseInt(val, 10);
      if (!isNaN(n) && n >= 0) {
        current[location][type][size] = (current[location][type][size] || 0) + n;
      }
    }
    saveInventory(current);
    setInv(loadInventory());
    setBulk({});
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const handleSetInventory = (type: "jersey" | "hoodie", size: string, val: string) => {
    const n = parseInt(val, 10);
    if (isNaN(n) || n < 0) return;
    const current = loadInventory();
    current[location][type][size] = n;
    saveInventory(current);
    setInv(loadInventory());
  };

  const given = loadGiven();
  const jerseyTotal = JERSEY_SIZES.reduce((s, sz) => s + (inv[location].jersey[sz] || 0), 0);
  const hoodieTotal = HOODIE_SIZES.reduce((s, sz) => s + (inv[location].hoodie[sz] || 0), 0);

  return (
    <div className="px-4 py-4 space-y-5">
      {saved && (
        <div className={`${colors.button} text-white text-sm font-bold text-center py-2 rounded-xl animate-in fade-in`}>
          Bulk order added!
        </div>
      )}

      <section>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-gray-800 text-sm">Jerseys</h3>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${colors.badge} ${colors.badgeText}`}>
            {jerseyTotal} in stock
          </span>
        </div>
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
          {JERSEY_SIZES.map((size, i) => (
            <div
              key={size}
              className={`flex items-center px-4 py-2 gap-2 ${i !== JERSEY_SIZES.length - 1 ? "border-b border-gray-50" : ""}`}
            >
              <span className="text-sm font-bold text-gray-800 w-10">{size}</span>
              <div className="flex-1 flex flex-col gap-0.5">
                <span className={`text-xs font-semibold ${colors.text}`}>
                  {inv[location].jersey[size] ?? 0} in stock
                </span>
                <span className="text-xs text-gray-400 font-medium">
                  {given[location].jersey[size] ?? 0} given
                </span>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  placeholder="Set"
                  className="w-14 border border-gray-200 rounded-lg px-2 py-1 text-xs text-center outline-none"
                  onChange={(e) => {
                    if (e.target.value !== "") {
                      handleSetInventory("jersey", size, e.target.value);
                      e.target.value = "";
                    }
                  }}
                />
                <input
                  type="number"
                  min="0"
                  placeholder="+Add"
                  value={bulkJersey[size] || ""}
                  onChange={(e) => setBulkJersey((p) => ({ ...p, [size]: e.target.value }))}
                  className="w-16 border border-gray-200 rounded-lg px-2 py-1 text-xs text-center outline-none"
                />
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => handleBulkSave("jersey")}
          className={`mt-2 w-full py-2 rounded-xl ${colors.button} ${colors.buttonText} text-xs font-bold active:scale-95 transition-transform`}
        >
          Apply Bulk Jersey Order
        </button>
      </section>

      <section>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-gray-800 text-sm">Hoodies</h3>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${colors.badge} ${colors.badgeText}`}>
            {hoodieTotal} in stock
          </span>
        </div>
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
          {HOODIE_SIZES.map((size, i) => (
            <div
              key={size}
              className={`flex items-center px-4 py-2 gap-2 ${i !== HOODIE_SIZES.length - 1 ? "border-b border-gray-50" : ""}`}
            >
              <span className="text-sm font-bold text-gray-800 w-10">{size}</span>
              <div className="flex-1 flex flex-col gap-0.5">
                <span className={`text-xs font-semibold ${colors.text}`}>
                  {inv[location].hoodie[size] ?? 0} in stock
                </span>
                <span className="text-xs text-gray-400 font-medium">
                  {given[location].hoodie[size] ?? 0} given
                </span>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  placeholder="Set"
                  className="w-14 border border-gray-200 rounded-lg px-2 py-1 text-xs text-center outline-none"
                  onChange={(e) => {
                    if (e.target.value !== "") {
                      handleSetInventory("hoodie", size, e.target.value);
                      e.target.value = "";
                    }
                  }}
                />
                <input
                  type="number"
                  min="0"
                  placeholder="+Add"
                  value={bulkHoodie[size] || ""}
                  onChange={(e) => setBulkHoodie((p) => ({ ...p, [size]: e.target.value }))}
                  className="w-16 border border-gray-200 rounded-lg px-2 py-1 text-xs text-center outline-none"
                />
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => handleBulkSave("hoodie")}
          className={`mt-2 w-full py-2 rounded-xl ${colors.button} ${colors.buttonText} text-xs font-bold active:scale-95 transition-transform`}
        >
          Apply Bulk Hoodie Order
        </button>
      </section>
    </div>
  );
}

function MasterView() {
  const inv = loadInventory();
  const given = loadGiven();

  const jerseyBySize: Record<string, number> = {};
  const hoodieBySize: Record<string, number> = {};
  const jerseyGivenBySize: Record<string, number> = {};
  const hoodieGivenBySize: Record<string, number> = {};

  for (const sz of JERSEY_SIZES) {
    jerseyBySize[sz] = LOCATIONS.reduce((sum, loc) => sum + (inv[loc.id].jersey[sz] || 0), 0);
    jerseyGivenBySize[sz] = LOCATIONS.reduce((sum, loc) => sum + (given[loc.id].jersey[sz] || 0), 0);
  }
  for (const sz of HOODIE_SIZES) {
    hoodieBySize[sz] = LOCATIONS.reduce((sum, loc) => sum + (inv[loc.id].hoodie[sz] || 0), 0);
    hoodieGivenBySize[sz] = LOCATIONS.reduce((sum, loc) => sum + (given[loc.id].hoodie[sz] || 0), 0);
  }

  const jerseyTotal = Object.values(jerseyBySize).reduce((a, b) => a + b, 0);
  const hoodieTotal = Object.values(hoodieBySize).reduce((a, b) => a + b, 0);
  const jerseyGivenTotal = Object.values(jerseyGivenBySize).reduce((a, b) => a + b, 0);
  const hoodieGivenTotal = Object.values(hoodieGivenBySize).reduce((a, b) => a + b, 0);

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 text-white">
        <p className="text-xs text-gray-400 mb-2">All Locations Summary</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-2xl font-bold">{jerseyTotal}</p>
            <p className="text-xs text-gray-400">Jerseys in stock</p>
            <p className="text-sm font-semibold text-gray-300 mt-0.5">{jerseyGivenTotal} given out</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{hoodieTotal}</p>
            <p className="text-xs text-gray-400">Hoodies in stock</p>
            <p className="text-sm font-semibold text-gray-300 mt-0.5">{hoodieGivenTotal} given out</p>
          </div>
        </div>
      </div>

      <section>
        <h3 className="font-bold text-gray-800 text-sm mb-2">All Jerseys by Size</h3>
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
          {JERSEY_SIZES.map((size, i) => (
            <div
              key={size}
              className={`flex items-center px-4 py-2.5 ${i !== JERSEY_SIZES.length - 1 ? "border-b border-gray-50" : ""}`}
            >
              <span className="text-sm font-bold text-gray-800 w-10">{size}</span>
              <div className="flex-1 flex gap-1.5 flex-wrap">
                {LOCATIONS.map((loc) => {
                  const colors = LOCATION_COLORS[loc.id];
                  return (
                    <span key={loc.id} className={`text-xs font-semibold px-1.5 py-0.5 rounded-md ${colors.badge} ${colors.badgeText}`}>
                      {loc.name.split(" ")[0]}: {inv[loc.id].jersey[size] || 0}
                    </span>
                  );
                })}
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">{jerseyBySize[size]}</p>
                <p className="text-xs text-gray-400">{jerseyGivenBySize[size]} given</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="font-bold text-gray-800 text-sm mb-2">All Hoodies by Size</h3>
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
          {HOODIE_SIZES.map((size, i) => (
            <div
              key={size}
              className={`flex items-center px-4 py-2.5 ${i !== HOODIE_SIZES.length - 1 ? "border-b border-gray-50" : ""}`}
            >
              <span className="text-sm font-bold text-gray-800 w-10">{size}</span>
              <div className="flex-1 flex gap-1.5 flex-wrap">
                {LOCATIONS.map((loc) => {
                  const colors = LOCATION_COLORS[loc.id];
                  return (
                    <span key={loc.id} className={`text-xs font-semibold px-1.5 py-0.5 rounded-md ${colors.badge} ${colors.badgeText}`}>
                      {loc.name.split(" ")[0]}: {inv[loc.id].hoodie[size] || 0}
                    </span>
                  );
                })}
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">{hoodieBySize[size]}</p>
                <p className="text-xs text-gray-400">{hoodieGivenBySize[size]} given</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<"master" | "location" | "settings">("master");
  const [location, setLocation] = useState<Location>(loadAdminLastLocation);

  const colors = LOCATION_COLORS[location];

  const handleLocationChange = (loc: Location) => {
    setLocation(loc);
    saveAdminLastLocation(loc);
  };

  if (!authenticated) {
    return <AdminLogin onLogin={() => setAuthenticated(true)} />;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-gray-900 px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-white font-bold text-lg tracking-tight">Admin</h1>
          <button
            onClick={() => setAuthenticated(false)}
            className="text-xs text-gray-400 bg-gray-800 px-3 py-1 rounded-full"
          >
            Lock
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("master")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${activeTab === "master" ? "bg-white text-gray-900" : "bg-gray-800 text-gray-400"}`}
          >
            All Locations
          </button>
          <button
            onClick={() => setActiveTab("location")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${activeTab === "location" ? "bg-white text-gray-900" : "bg-gray-800 text-gray-400"}`}
          >
            By Location
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${activeTab === "settings" ? "bg-white text-gray-900" : "bg-gray-800 text-gray-400"}`}
          >
            Settings
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50 no-scrollbar">
        {activeTab === "master" && <MasterView />}
        {activeTab === "settings" && <ChangePasswordSection />}
        {activeTab === "location" && (
          <>
            <div className={`${colors.header} px-4 pt-3 pb-0`}>
              <LocationTabs selected={location} onSelect={handleLocationChange} />
            </div>
            <LocationInventoryView key={location} location={location} />
          </>
        )}
      </div>
    </div>
  );
}
