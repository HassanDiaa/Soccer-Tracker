import { useState } from "react";
import { JerseyPage } from "@/pages/JerseyPage";
import { HoodiePage } from "@/pages/HoodiePage";
import { AdminPage } from "@/pages/AdminPage";

type Tab = "jersey" | "hoodie" | "admin";

export default function App() {
  const [tab, setTab] = useState<Tab>("jersey");

  const tabs: { id: Tab; emoji: string; label: string }[] = [
    { id: "jersey", emoji: "👕", label: "Jerseys" },
    { id: "hoodie", emoji: "🧥", label: "Hoodies" },
    { id: "admin", emoji: "🔐", label: "Admin" },
  ];

  return (
    <div className="flex flex-col h-dvh max-w-sm mx-auto bg-white overflow-hidden">
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {tab === "jersey" && <JerseyPage />}
        {tab === "hoodie" && <HoodiePage />}
        {tab === "admin" && <AdminPage />}
      </div>

      <nav className="border-t border-gray-100 bg-white flex safe-bottom shadow-[0_-1px_8px_rgba(0,0,0,0.06)]">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={[
              "flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-all",
              tab === t.id ? "text-gray-900" : "text-gray-400",
            ].join(" ")}
          >
            <span className="text-2xl leading-tight">{t.emoji}</span>
            <span className={`text-[10px] font-semibold leading-tight ${tab === t.id ? "text-gray-800" : "text-gray-400"}`}>
              {t.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}
