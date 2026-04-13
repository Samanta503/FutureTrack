"use client";

import { useEffect, useState } from "react";
import { dashboardRecommendations } from "@/data/mock-data";
import { Recommendation } from "@/lib/types";
import { getApiUrl } from "@/lib/api";

export function DashboardRecommendations() {
  const [items, setItems] = useState<Recommendation[]>(dashboardRecommendations);

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        const response = await fetch(getApiUrl("/recommendations?userId=1"), {
          cache: "no-store",
        });

        if (!response.ok) return;

        const payload = await response.json();

        if (payload?.data?.length) {
          setItems(payload.data);
        }
      } catch {
        // fallback to mock recommendations if API/DB is unavailable
      }
    };

    void loadRecommendations();
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item) => (
        <article key={item.id} className="rounded-2xl border border-[#6877ff]/35 bg-gradient-to-b from-[#12184b] to-[#0d1134] p-5">
          <span className="rounded-full bg-[#2a3178] px-2 py-1 text-xs uppercase tracking-wide text-[#c7d0ff]">
            {item.type}
          </span>
          <h3 className="mt-3 text-lg font-semibold text-white">{item.title}</h3>
          <p className="mt-2 text-sm text-white/75">{item.reason}</p>
        </article>
      ))}
    </div>
  );
}
