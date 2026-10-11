/**
 * Клиент API каталога «ПолЦены Маркет» (тот же сервис, что мини-приложение в MAX).
 * Ходим напрямую на catalog.polcenimarket.ru (российский фронт, без Cloudflare).
 * Ключ владельца хранится только в SecureStore устройства — в APK и в git его нет.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Адреса того же сервиса каталога (VPS). Основной — catalog.polcenimarket.ru; запасной — прямой адрес VPS
 * со своим сертификатом Let's Encrypt (без Cloudflare). При сетевой/TLS-ошибке переключаемся на следующий.
 * В веб-превью (только для скриншотов) API идёт через локальный прокси — без CORS.
 */
const BASES = Platform.OS === 'web' ? [''] : ['https://catalog.polcenimarket.ru', 'https://94-228-163-212.sslip.io'];
let baseIndex = 0;
export const catalogBase = () => BASES[baseIndex];

export type CatalogStore = {
  id: string;
  name: string;
  city: string;
  address: string;
  landmark: string;
  hours: string;
  map: string;
  group: string;
  has_feed: boolean;
  count?: number;
};

export type CatalogItem = {
  id: string;
  ts: number;
  store: string;
  name: string;
  variant: string;
  size: string;
  model: string;
  dims?: string;
  price: number;
  card: number;
  market: string;
  cat: string;
  img: string;
};

export type CatalogCategory = { id: string; name: string; count: number };

export type StoreCatalog = {
  store: CatalogStore;
  categories: CatalogCategory[];
  items: CatalogItem[];
  today_from: number;
  subscriptions: string[];
};

export type StoresPayload = { stores: CatalogStore[]; window_hours: number; policies: string[] };

const KEY_OWNER = 'pc_owner_key';
const K_SESSION = 'pc_session';
const K_STORES = 'pc_cache_stores';
const K_STORE_PREFIX = 'pc_cache_catalog_';
export const K_SELECTED_STORE = 'pc_selected_store';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status = 0) {
    super(message);
    this.status = status;
  }
}

// ---------------------------------------------------------------- secure key (owner)
async function secureGet(k: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    try {
      return globalThis.localStorage?.getItem(k) ?? null;
    } catch {
      return null;
    }
  }
  return SecureStore.getItemAsync(k);
}
async function secureSet(k: string, v: string | null): Promise<void> {
  if (Platform.OS === 'web') {
    try {
      if (v == null) globalThis.localStorage?.removeItem(k);
      else globalThis.localStorage?.setItem(k, v);
    } catch {}
    return;
  }
  if (v == null) await SecureStore.deleteItemAsync(k);
  else await SecureStore.setItemAsync(k, v);
}

export const getOwnerKey = () => secureGet(KEY_OWNER);

let session: string | null = null;

// ---------------------------------------------------------------- fetch with timeout + retries
async function fetchJson(
  path: string,
  opts: { body?: unknown; timeout?: number; tries?: number; auth?: boolean } = {},
): Promise<any> {
  const tries = opts.tries ?? (opts.body ? 1 : 3);
  let lastErr: unknown = null;
  const attempts = Math.max(tries, BASES.length);
  for (let i = 0; i < attempts; i++) {
    const ac = new AbortController();
    const timer = setTimeout(() => ac.abort(), opts.timeout ?? 20000);
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json', Accept: 'application/json' };
      if (opts.auth !== false && session) headers['X-Session'] = session;
      const r = await fetch(catalogBase() + path, {
        method: opts.body ? 'POST' : 'GET',
        headers,
        body: opts.body ? JSON.stringify(opts.body) : undefined,
        signal: ac.signal,
      });
      clearTimeout(timer);
      let j: any = {};
      try {
        j = await r.json();
      } catch {}
      if (!r.ok) throw new ApiError(String(j.detail || j.error || `Ошибка ${r.status}`), r.status);
      return j;
    } catch (e) {
      clearTimeout(timer);
      lastErr = e;
      if (e instanceof ApiError && e.status >= 400 && e.status < 500) throw e; // не сеть — повтор не поможет
      if (!(e instanceof ApiError) && BASES.length > 1) {
        baseIndex = (baseIndex + 1) % BASES.length; // сеть/сертификат — пробуем другой адрес того же сервера
        continue;
      }
      if (i < attempts - 1) await new Promise((res) => setTimeout(res, 800 * (i + 1)));
    }
  }
  if (lastErr instanceof ApiError) throw lastErr;
  throw new ApiError('Нет связи с сервером каталога. Проверьте интернет и нажмите «Повторить».');
}

// ---------------------------------------------------------------- session
/** Проверяет ключ на сервере. Возвращает true, если ключ владельца верный. */
export async function unlockOwner(key: string): Promise<boolean> {
  const k = key.trim();
  if (!k) return false;
  try {
    const j = await fetchJson('/app/api/session', { body: { key: k }, auth: false, tries: 2 });
    if (!j.ok || !j.session) return false;
    session = j.session;
    await secureSet(KEY_OWNER, k);
    await AsyncStorage.setItem(K_SESSION, j.session);
    return true;
  } catch (e) {
    if (e instanceof ApiError && e.status === 403) return false;
    throw e;
  }
}

export async function lockOwner(): Promise<void> {
  session = null;
  await secureSet(KEY_OWNER, null);
  await AsyncStorage.multiRemove([K_SESSION]);
}

async function ensureSession(force = false): Promise<void> {
  if (!force && session) return;
  if (!force) {
    const saved = await AsyncStorage.getItem(K_SESSION);
    if (saved) {
      session = saved;
      return;
    }
  }
  const key = await getOwnerKey();
  if (!key) throw new ApiError('Каталог пока закрыт', 403);
  const j = await fetchJson('/app/api/session', { body: { key }, auth: false, tries: 2 });
  session = j.session;
  await AsyncStorage.setItem(K_SESSION, j.session);
}

async function authed(path: string, opts: { body?: unknown; timeout?: number; tries?: number } = {}) {
  await ensureSession();
  try {
    return await fetchJson(path, opts);
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) {
      await ensureSession(true);
      return fetchJson(path, opts);
    }
    throw e;
  }
}

// ---------------------------------------------------------------- data + offline cache
type Cached<T> = { data: T; savedAt: number };

async function readCache<T>(k: string): Promise<Cached<T> | null> {
  try {
    const raw = await AsyncStorage.getItem(k);
    return raw ? (JSON.parse(raw) as Cached<T>) : null;
  } catch {
    return null;
  }
}
async function writeCache<T>(k: string, data: T) {
  try {
    await AsyncStorage.setItem(k, JSON.stringify({ data, savedAt: Date.now() }));
  } catch {}
}

export const cachedStores = () => readCache<StoresPayload>(K_STORES);
export const cachedCatalog = (store: string) => readCache<StoreCatalog>(K_STORE_PREFIX + store);

export async function fetchStores(): Promise<StoresPayload> {
  const d = (await authed('/app/api/stores')) as StoresPayload;
  await writeCache(K_STORES, d);
  return d;
}

const memCatalog = new Map<string, StoreCatalog>();

export async function fetchCatalog(store: string): Promise<StoreCatalog> {
  const d = (await authed('/app/api/catalog?store=' + encodeURIComponent(store), { timeout: 40000 })) as StoreCatalog;
  memCatalog.set(store, d);
  await writeCache(K_STORE_PREFIX + store, d);
  return d;
}

export function rememberCatalog(store: string, d: StoreCatalog) {
  memCatalog.set(store, d);
}

export function findItem(id: string): { item: CatalogItem; catalog: StoreCatalog } | null {
  for (const c of memCatalog.values()) {
    const item = c.items.find((x) => x.id === id);
    if (item) return { item, catalog: c };
  }
  return null;
}

export type LeadResult = { visit: string; dm: boolean; duplicate: boolean };

/** «Хочу посмотреть»: сервер передаёт заявку директору и возвращает текст «Приходите, пожалуйста…». */
export async function sendLead(itemId: string): Promise<LeadResult> {
  const j = await authed('/app/api/lead', { body: { item: itemId }, timeout: 30000 });
  return { visit: String(j.visit || j.message || 'Заявка отправлена.'), dm: !!j.dm, duplicate: !!j.duplicate };
}

/** Реальные категории каталога (id как на сервере) и значки для Главной. */
export const CATEGORY_ICONS: Record<string, string> = {
  furniture: '🛋️',
  'women-clothing': '👗',
  'men-clothing': '👔',
  shoes: '👟',
  kids: '🧸',
  appliances: '🔌',
  electronics: '📱',
  kitchen: '🍳',
  dishes: '🍽️',
  'home-textiles': '🛏️',
  beauty: '💄',
  'tools-auto': '🔧',
  household: '🧽',
};

export const DEFAULT_CATEGORIES: { id: string; name: string }[] = [
  { id: 'furniture', name: 'Мебель' },
  { id: 'women-clothing', name: 'Женская одежда' },
  { id: 'men-clothing', name: 'Мужская одежда' },
  { id: 'shoes', name: 'Обувь' },
  { id: 'kids', name: 'Детское' },
  { id: 'appliances', name: 'Бытовая техника' },
  { id: 'electronics', name: 'Электроника' },
  { id: 'kitchen', name: 'Кухня' },
  { id: 'dishes', name: 'Посуда' },
  { id: 'home-textiles', name: 'Дом и текстиль' },
  { id: 'beauty', name: 'Красота и уход' },
  { id: 'tools-auto', name: 'Инструменты и авто' },
  { id: 'household', name: 'Хозтовары' },
];

export function trackEvent(kind: string, extra: Record<string, unknown> = {}) {
  authed('/app/api/event', { body: { kind, ...extra }, timeout: 10000 }).catch(() => {});
}

// ---------------------------------------------------------------- helpers
export const imageUrl = (u: string) => (u && u.startsWith('/') ? catalogBase() + u : u);

export const rub = (v: number) => `${Math.round(v).toLocaleString('ru-RU').replace(/[\u00a0,]/g, ' ')} ₽`;

export function whenLabel(ts: number): string {
  const fmt = (d: Date) => d.toLocaleDateString('ru-RU', { timeZone: 'Europe/Moscow' });
  const d = new Date(ts * 1000);
  const now = new Date();
  const hm = d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Moscow' });
  const day = fmt(d);
  const yesterday = fmt(new Date(now.getTime() - 864e5));
  return `${day === fmt(now) ? 'сегодня' : day === yesterday ? 'вчера' : day.slice(0, 5)} в ${hm}`;
}

export function matchesQuery(x: CatalogItem, q: string): boolean {
  const norm = (s: string) => s.toLowerCase().replace(/ё/g, 'е');
  const words = norm(q).split(/\s+/).filter(Boolean);
  if (!words.length) return true;
  const t = norm(`${x.name} ${x.variant} ${x.model} ${x.size}`);
  return words.every((w) => t.includes(w.length > 4 ? w.slice(0, -1) : w));
}

export const PRICE_RANGES: { id: string; label: string; lo: number; hi: number }[] = [
  { id: '', label: 'Любая цена', lo: 0, hi: Infinity },
  { id: '0-500', label: 'до 500 ₽', lo: 0, hi: 500 },
  { id: '500-1500', label: '500–1 500 ₽', lo: 500, hi: 1500 },
  { id: '1500-5000', label: '1 500–5 000 ₽', lo: 1500, hi: 5000 },
  { id: '5000+', label: 'от 5 000 ₽', lo: 5000, hi: Infinity },
];
