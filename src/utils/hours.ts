import type { Store } from '@/src/data/stores';

/** Moscow time (Europe/Moscow, UTC+3) for store hours */
export function getMoscowHour(): number {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Moscow',
    hour: 'numeric',
    hour12: false,
  }).formatToParts(new Date());
  const hour = parts.find((p) => p.type === 'hour')?.value ?? '0';
  return parseInt(hour, 10);
}

export function isStoreOpen(store: Store, hour = getMoscowHour()): boolean {
  return hour >= store.open && hour < store.close;
}

export function formatHours(store: Store): string {
  const pad = (n: number) => `${n.toString().padStart(2, '0')}:00`;
  return `${pad(store.open)}–${pad(store.close)}`;
}

export function formatOpensDate(iso?: string): string | null {
  if (!iso) return null;
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return null;
  return `${String(d).padStart(2, '0')}.${String(m).padStart(2, '0')}.${y}`;
}
