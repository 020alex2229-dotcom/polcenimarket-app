import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  K_SELECTED_STORE,
  cachedStores,
  fetchStores,
  getOwnerKey,
  lockOwner,
  unlockOwner,
  type StoresPayload,
} from '@/src/api/catalog';

type Ctx = {
  ready: boolean;
  unlocked: boolean;
  unlock: (key: string) => Promise<boolean>;
  lock: () => Promise<void>;
  selectedStore: string | null;
  selectStore: (id: string) => void;
  stores: StoresPayload | null;
  refreshStores: () => Promise<StoresPayload | null>;
  /** Категория, выбранная на Главной: каталог откроется сразу с этим фильтром */
  pendingCategory: string | null;
  setPendingCategory: (id: string | null) => void;
};

const OwnerContext = createContext<Ctx | null>(null);

export function OwnerProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [selectedStore, setSelected] = useState<string | null>(null);
  const [stores, setStores] = useState<StoresPayload | null>(null);
  const [pendingCategory, setPendingCategory] = useState<string | null>(null);

  const refreshStores = useCallback(async () => {
    try {
      const d = await fetchStores();
      setStores(d);
      return d;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    (async () => {
      const [key, sel, cache] = await Promise.all([
        getOwnerKey().catch(() => null),
        AsyncStorage.getItem(K_SELECTED_STORE).catch(() => null),
        cachedStores(),
      ]);
      setUnlocked(!!key);
      setSelected(sel);
      if (cache) setStores(cache.data);
      setReady(true);
      if (key) refreshStores();
    })();
  }, [refreshStores]);

  const unlock = useCallback(
    async (key: string) => {
      const ok = await unlockOwner(key);
      if (ok) {
        setUnlocked(true);
        refreshStores();
      }
      return ok;
    },
    [refreshStores],
  );

  const lock = useCallback(async () => {
    await lockOwner();
    setUnlocked(false);
  }, []);

  const selectStore = useCallback((id: string) => {
    setSelected(id);
    AsyncStorage.setItem(K_SELECTED_STORE, id).catch(() => {});
  }, []);

  const value = useMemo(
    () => ({ ready, unlocked, unlock, lock, selectedStore, selectStore, stores, refreshStores, pendingCategory, setPendingCategory }),
    [ready, unlocked, unlock, lock, selectedStore, selectStore, stores, refreshStores, pendingCategory],
  );
  return <OwnerContext.Provider value={value}>{children}</OwnerContext.Provider>;
}

export function useOwner(): Ctx {
  const c = useContext(OwnerContext);
  if (!c) throw new Error('OwnerProvider missing');
  return c;
}
