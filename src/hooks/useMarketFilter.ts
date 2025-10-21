import { useState, useEffect, useMemo, useCallback } from "react";
import type { ExtendedTickerData } from "@/types";

const STORAGE_KEY = "aucep.visibleMarkets";

/**
 * Loads saved market visibility from localStorage
 */
const loadSavedMarkets = (availableMarkets: Set<string>): Set<string> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return availableMarkets;

    const saved: string[] = JSON.parse(raw);
    const restored = new Set<string>();

    // Only restore markets that still exist
    saved.forEach((m) => {
      if (availableMarkets.has(m)) restored.add(m);
    });

    return restored.size > 0 ? restored : availableMarkets;
  } catch {
    return availableMarkets;
  }
};

/**
 * Saves market visibility to localStorage
 */
const saveMarkets = (markets: Set<string>) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(markets)));
  } catch (error) {
    console.error("Failed to save market filter:", error);
  }
};

/**
 * Reconciles visible markets with available markets
 */
const reconcileMarkets = (
  visible: Set<string>,
  available: Set<string>
): Set<string> => {
  const reconciled = new Set<string>();

  // Keep existing visible markets that are still available
  visible.forEach((m) => {
    if (available.has(m)) reconciled.add(m);
  });

  // Add new markets as visible by default
  available.forEach((m) => {
    if (!reconciled.has(m)) reconciled.add(m);
  });

  return reconciled;
};

export const useMarketFilter = (allMarkets: string[]) => {
  const [visibleMarkets, setVisibleMarkets] = useState<Set<string>>(new Set());

  // Create a stable set of available markets
  const availableMarkets = useMemo(
    () => new Set(allMarkets),
    // Only update when the content changes, not the array reference
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allMarkets.join(",")]
  );

  // Initialize and reconcile markets when available markets change
  useEffect(() => {
    if (availableMarkets.size === 0) return;

    setVisibleMarkets((prev) => {
      // First load: try to restore from localStorage
      if (prev.size === 0) {
        return loadSavedMarkets(availableMarkets);
      }

      // Subsequent updates: reconcile with new available markets
      return reconcileMarkets(prev, availableMarkets);
    });
  }, [availableMarkets]);

  // Persist visible markets to localStorage
  useEffect(() => {
    if (visibleMarkets.size > 0) {
      saveMarkets(visibleMarkets);
    }
  }, [visibleMarkets]);

  const toggleMarket = useCallback((market: string) => {
    setVisibleMarkets((prev) => {
      const next = new Set(prev);
      if (next.has(market)) {
        next.delete(market);
      } else {
        next.add(market);
      }
      return next;
    });
  }, []);

  const setMarketVisible = useCallback((market: string, visible: boolean) => {
    setVisibleMarkets((prev) => {
      const next = new Set(prev);
      if (visible) {
        next.add(market);
      } else {
        next.delete(market);
      }
      return next;
    });
  }, []);

  const toggleAll = useCallback(
    (visible: boolean) => {
      setVisibleMarkets(visible ? new Set(availableMarkets) : new Set());
    },
    [availableMarkets]
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
