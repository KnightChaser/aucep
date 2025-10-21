import { useState, useEffect, useMemo, useCallback } from "react";
import type { ExtendedTickerData } from "@/types";

export const useMarketFilter = (allMarkets: string[]) => {
  const [visibleMarkets, setVisibleMarkets] = useState<Set<string>>(new Set());
  const STORAGE_KEY = "aucep.visibleMarkets";

  // Build a stable signature that only changes when the CONTENT of markets changes
  const stableList = useMemo(
    () => Array.from(new Set(allMarkets)).sort(),
    // allMarkets can be a new array frequently; rely on its content only
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allMarkets.join(",")]
  );

  const signature = useMemo(() => stableList.join(","), [stableList]);

  // Initialize once and reconcile only when actual market set changes
  useEffect(() => {
    if (stableList.length === 0) return;

    setVisibleMarkets((prev) => {
      const current = new Set(stableList);

      // First load attempt: try restore from localStorage
      if (prev.size === 0) {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) {
            const saved: string[] = JSON.parse(raw);
            const restored = new Set<string>();
            saved.forEach((m) => {
              if (current.has(m)) restored.add(m);
            });
            if (restored.size > 0) return restored;
          }
        } catch {}
        // Otherwise default to all visible
        return new Set(stableList);
      }

      // Reconcile: keep existing selections, remove disappeared, add new as visible
      const next = new Set<string>();
      prev.forEach((m) => {
        if (current.has(m)) next.add(m);
      });
      current.forEach((m) => {
        if (!next.has(m)) next.add(m);
      });
      return next;
    });
    // Depend on signature so we only run when set content truly changes
  }, [signature]);

  // Persist selection
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(Array.from(visibleMarkets))
      );
    } catch {}
  }, [visibleMarkets]);

  const toggleMarket = useCallback((market: string) => {
    setVisibleMarkets((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(market)) newSet.delete(market);
      else newSet.add(market);
      return newSet;
    });
  }, []);

  const setMarketVisible = useCallback((market: string, visible: boolean) => {
    setVisibleMarkets((prev) => {
      const next = new Set(prev);
      if (visible) next.add(market);
      else next.delete(market);
      return next;
    });
  }, []);

  const toggleAll = useCallback(
    (visible: boolean) => {
      setVisibleMarkets(() => (visible ? new Set(stableList) : new Set()));
    },
    [stableList]
  );

  const filteredData = useMemo(() => {
    return (data: ExtendedTickerData[]) =>
      data.filter((item) => visibleMarkets.has(item.market));
  }, [visibleMarkets]);

  return {
    visibleMarkets,
    toggleMarket,
    setMarketVisible,
    toggleAll,
    filteredData,
  };
};
