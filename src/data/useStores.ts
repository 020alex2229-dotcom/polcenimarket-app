import { useMemo } from 'react';
import { STORES, type Store } from '@/src/data/stores';
import { useOwner } from '@/src/state/owner';
import type { CatalogStore } from '@/src/api/catalog';

function parseHours(h: string): { open: number; close: number } | null {
  const m = /(\d{1,2})[:.]?\d{0,2}\s*[–-]\s*(\d{1,2})/.exec(h || '');
  if (!m) return null;
  const open = Number(m[1]);
  const close = Number(m[2]);
  return open >= 0 && close > open && close <= 24 ? { open, close } : null;
}

/** Встроенный список + свежие данные сервера (часы, карта, ссылка на группу, новые магазины). */
export function mergeStores(server: CatalogStore[] | undefined): Store[] {
  if (!server?.length) return STORES;
  const byId = new Map(server.map((s) => [s.id, s]));
  const byGroup = new Map(server.filter((s) => s.group).map((s) => [s.group, s]));
  const used = new Set<string>();
  const merged = STORES.map((st) => {
    const sv = (st.catalogId && byId.get(st.catalogId)) || byGroup.get(st.max);
    if (!sv) return st;
    used.add(sv.id);
    const hours = parseHours(sv.hours);
    return {
      ...st,
      catalogId: sv.id,
      ...(hours ?? {}),
      map: sv.map || st.map,
      max: sv.group || st.max,
    };
  });
  for (const sv of server) {
    if (used.has(sv.id) || !sv.has_feed || !sv.city) continue;
    const hours = parseHours(sv.hours) ?? { open: 10, close: 19 };
    merged.push({
      city: sv.city,
      addr: sv.address || sv.name,
      note: sv.landmark || undefined,
      lat: NaN,
      lon: NaN,
      ...hours,
      tg: '',
      max: sv.group,
      map: sv.map,
      img: '',
      catalogId: sv.id,
      isNew: true,
    });
  }
  return merged;
}

export function useStores(): Store[] {
  const { stores } = useOwner();
  return useMemo(() => mergeStores(stores?.stores), [stores]);
}
