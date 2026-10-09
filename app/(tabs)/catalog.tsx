import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image as RNImage,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Brand } from '@/constants/Colors';
import {
  PRICE_RANGES,
  cachedCatalog,
  fetchCatalog,
  matchesQuery,
  rememberCatalog,
  trackEvent,
  type CatalogItem,
  type StoreCatalog,
} from '@/src/api/catalog';
import { Cat, Chip, ItemCard, StoreSelector } from '@/src/components/CatalogUI';
import { useOwner } from '@/src/state/owner';

const brandMark = require('../../assets/images/brand-mark.png');

function ComingSoon() {
  return (
    <ScrollView contentContainerStyle={styles.soon}>
      <RNImage source={brandMark} style={styles.soonLogo} />
      <Text style={styles.soonTitle}>Каталог скоро</Text>
      <Text style={styles.soonText}>
        Здесь появятся все новинки наших магазинов с фото и ценами. Мы уже наполняем каталог —
        загляните чуть позже!
      </Text>
      <Text style={styles.soonText}>А пока новинки каждый день выходят в группе вашего магазина в MAX.</Text>
      <Pressable style={styles.soonBtn} onPress={() => router.navigate('/stores')}>
        <Text style={styles.soonBtnText}>Выбрать свой магазин</Text>
      </Pressable>
    </ScrollView>
  );
}

export default function CatalogScreen() {
  const { ready, unlocked } = useOwner();
  if (!ready) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Cat.red} />
      </View>
    );
  }
  return unlocked ? <OwnerCatalog /> : <ComingSoon />;
}

function OwnerCatalog() {
  const insets = useSafeAreaInsets();
  const { selectedStore, selectStore, stores, refreshStores } = useOwner();
  const [data, setData] = useState<StoreCatalog | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offlineAt, setOfflineAt] = useState<number | null>(null);
  const [picker, setPicker] = useState(false);
  const [sizePicker, setSizePicker] = useState(false);
  const [tab, setTab] = useState<'today' | 'all'>('today');
  const [cat, setCat] = useState('');
  const [query, setQuery] = useState('');
  const [price, setPrice] = useState('');
  const [size, setSize] = useState('');
  const listRef = useRef<FlatList<CatalogItem>>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const storeList = stores?.stores ?? [];
  const currentName =
    data?.store.name || storeList.find((s) => s.id === selectedStore)?.name || 'Выберите магазин';

  const load = useCallback(
    async (store: string, mode: 'open' | 'refresh') => {
      setError(null);
      if (mode === 'open') {
        setLoading(true);
        const cache = await cachedCatalog(store);
        if (cache) {
          setData(cache.data);
          rememberCatalog(store, cache.data);
        } else setData(null);
      } else setRefreshing(true);
      try {
        const d = await fetchCatalog(store);
        setData(d);
        setOfflineAt(null);
        if (mode === 'open') {
          setCat('');
          setSize('');
          setPrice('');
          if (!d.items.some((x) => x.ts >= d.today_from)) setTab('all');
        }
      } catch (e: any) {
        const cache = await cachedCatalog(store);
        if (cache) {
          setData(cache.data);
          setOfflineAt(cache.savedAt);
        } else setError(e?.message || 'Не удалось загрузить товары');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (selectedStore) load(selectedStore, 'open');
    else if (stores) setPicker(true);
  }, [selectedStore, load, stores == null]); // eslint-disable-line react-hooks/exhaustive-deps

  const todayPool = useMemo(
    () => (data ? data.items.filter((x) => x.ts >= data.today_from) : []),
    [data],
  );
  const pool = tab === 'today' ? todayPool : data?.items ?? [];

  const sizes = useMemo(() => {
    const all = (data?.items ?? []).filter((x) => !cat || x.cat === cat).map((x) => x.size).filter(Boolean);
    return [...new Set(all)].sort(
      (a, b) => (parseFloat(a) || 999) - (parseFloat(b) || 999) || a.localeCompare(b),
    );
  }, [data, cat]);

  const filtered = useMemo(() => {
    const range = PRICE_RANGES.find((r) => r.id === price) ?? PRICE_RANGES[0];
    return pool.filter(
      (x) =>
        (!cat || x.cat === cat) &&
        x.price >= range.lo &&
        x.price < range.hi &&
        (!size || x.size.toLowerCase() === size.toLowerCase()) &&
        matchesQuery(x, query),
    );
  }, [pool, cat, price, size, query]);

  const catCounts = useMemo(() => {
    const m: Record<string, number> = {};
    pool.forEach((x) => (m[x.cat] = (m[x.cat] || 0) + 1));
    return m;
  }, [pool]);

  useEffect(() => {
    if (size && !sizes.includes(size)) setSize('');
  }, [sizes, size]);

  const onQuery = (q: string) => {
    setQuery(q);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (q.trim() && selectedStore) {
      searchTimer.current = setTimeout(() => {
        trackEvent('search', { store: selectedStore, query: q.trim(), category: cat });
      }, 1500);
    }
  };

  const scrollTop = () => listRef.current?.scrollToOffset({ offset: 0, animated: false });

  const header = (
    <View>
      <View style={styles.chipsRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          <Chip label="Все" count={pool.length} on={!cat} onPress={() => (setCat(''), scrollTop())} />
          {(data?.categories ?? [])
            .filter((c) => catCounts[c.id] || cat === c.id)
            .map((c) => (
              <Chip
                key={c.id}
                label={c.name}
                count={catCounts[c.id] || 0}
                on={cat === c.id}
                onPress={() => {
                  setCat(c.id);
                  scrollTop();
                  trackEvent('view_category', { store: selectedStore, category: c.id });
                }}
              />
            ))}
        </ScrollView>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {PRICE_RANGES.map((r) => (
          <Pressable key={r.id || 'any'} onPress={() => setPrice(r.id)} style={[styles.filter, price === r.id && styles.filterOn]}>
            <Text style={[styles.filterText, price === r.id && styles.filterTextOn]}>{r.label}</Text>
          </Pressable>
        ))}
        {sizes.length ? (
          <Pressable onPress={() => setSizePicker(true)} style={[styles.filter, !!size && styles.filterOn]}>
            <Text style={[styles.filterText, !!size && styles.filterTextOn]}>
              {size ? `Размер: ${size}` : 'Любой размер'} ▾
            </Text>
          </Pressable>
        ) : null}
      </ScrollView>
      {offlineAt ? (
        <Text style={styles.offline}>
          Нет связи — показаны сохранённые товары от{' '}
          {new Date(offlineAt).toLocaleString('ru-RU', { timeZone: 'Europe/Moscow', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}{' '}
          МСК. Потяните вниз, чтобы обновить.
        </Text>
      ) : null}
      <Text style={styles.status}>
        {tab === 'today' ? 'Новинки дня' : 'За 48 часов'}
        {cat ? ` · ${data?.categories.find((c) => c.id === cat)?.name ?? ''}` : ''}: {filtered.length}
      </Text>
    </View>
  );

  const empty = loading ? (
    <View style={styles.empty}>
      <ActivityIndicator color={Cat.red} />
      <Text style={styles.emptyText}>Загружаем товары…</Text>
    </View>
  ) : error ? (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>Не удалось загрузить товары: {error}</Text>
      <Pressable style={styles.retry} onPress={() => selectedStore && load(selectedStore, 'open')}>
        <Text style={styles.retryText}>Повторить</Text>
      </Pressable>
    </View>
  ) : !selectedStore ? (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>Выберите магазин вверху, чтобы увидеть его товары.</Text>
    </View>
  ) : (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>
        {query
          ? `По запросу «${query}» ничего не нашлось.`
          : tab === 'today'
            ? 'Сегодня в этой категории новинок пока нет. Откройте «Все товары» — там всё за 48 часов.'
            : 'В этой категории пока нет товаров.'}
      </Text>
    </View>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.top}>
        <StoreSelector label={currentName} onPress={() => (setPicker(true), refreshStores())} />
        <View style={styles.searchRow}>
          <Ionicons name="search" size={18} color={Brand.muted} />
          <TextInput
            value={query}
            onChangeText={onQuery}
            placeholder="Поиск: пылесос, куртка, кроссовки…"
            placeholderTextColor="#9AA0A6"
            style={styles.search}
            returnKeyType="search"
            autoCorrect={false}
          />
          {query ? (
            <Pressable onPress={() => setQuery('')} hitSlop={10}>
              <Ionicons name="close-circle" size={18} color={Brand.muted} />
            </Pressable>
          ) : null}
        </View>
        <View style={styles.tabs}>
          {(['today', 'all'] as const).map((t) => (
            <Pressable
              key={t}
              onPress={() => {
                setTab(t);
                scrollTop();
                if (t === 'today') trackEvent('view_today', { store: selectedStore });
              }}
              style={[styles.tab, tab === t && styles.tabOn]}
            >
              <Text style={[styles.tabText, tab === t && { color: '#fff' }]}>
                {t === 'today' ? `🔥 Новинки дня ${todayPool.length ? todayPool.length : ''}` : 'Все товары'}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <FlatList
        ref={listRef}
        data={filtered}
        keyExtractor={(x) => x.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 10 }}
        contentContainerStyle={{ padding: 10, paddingBottom: 30 + insets.bottom, gap: 10 }}
        ListHeaderComponent={header}
        ListEmptyComponent={empty}
        renderItem={({ item }) => (
          <View style={{ flex: 1, maxWidth: '50%' }}>
            <ItemCard
              item={item}
              isNew={tab !== 'today' && !!data && item.ts >= data.today_from}
              onPress={() => router.push(`/product/${item.id}`)}
            />
          </View>
        )}
        initialNumToRender={8}
        windowSize={7}
        removeClippedSubviews
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              refreshStores();
              if (selectedStore) load(selectedStore, 'refresh');
            }}
            colors={[Cat.red]}
            tintColor={Cat.red}
          />
        }
      />

      <Modal visible={picker} animationType="slide" transparent onRequestClose={() => setPicker(false)}>
        <Pressable style={styles.sheetBg} onPress={() => selectedStore && setPicker(false)}>
          <Pressable style={[styles.sheet, { paddingBottom: 18 + insets.bottom }]} onPress={() => {}}>
            <View style={styles.sheetHead}>
              <Text style={styles.sheetTitle}>Выберите магазин</Text>
              {selectedStore ? (
                <Pressable onPress={() => setPicker(false)} hitSlop={10}>
                  <Ionicons name="close" size={26} color={Brand.ink} />
                </Pressable>
              ) : null}
            </View>
            {!storeList.length ? (
              <View style={styles.empty}>
                <ActivityIndicator color={Cat.red} />
                <Text style={styles.emptyText}>Загружаем список магазинов…</Text>
                <Pressable style={styles.retry} onPress={() => refreshStores()}>
                  <Text style={styles.retryText}>Повторить</Text>
                </Pressable>
              </View>
            ) : (
              <ScrollView>
                {storeList.map((s) => (
                  <Pressable
                    key={s.id}
                    style={[styles.st, s.id === selectedStore && styles.stOn]}
                    onPress={() => {
                      setPicker(false);
                      setQuery('');
                      if (s.id === selectedStore) load(s.id, 'open');
                      else selectStore(s.id);
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.stName}>{s.name}</Text>
                      <Text style={styles.stSub}>
                        {[s.city && `${s.city}, ${s.address}`, s.hours].filter(Boolean).join(' · ')}
                      </Text>
                    </View>
                    <Text style={styles.stCount}>{s.count ? `${s.count} тов.` : 'скоро'}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            )}
          </Pressable>
        </Pressable>
      </Modal>

      <Modal visible={sizePicker} animationType="fade" transparent onRequestClose={() => setSizePicker(false)}>
        <Pressable style={styles.sheetBg} onPress={() => setSizePicker(false)}>
          <View style={[styles.sheet, { paddingBottom: 18 + insets.bottom }]}>
            <Text style={styles.sheetTitle}>Размер</Text>
            <ScrollView contentContainerStyle={styles.sizeGrid}>
              {['', ...sizes].map((s) => (
                <Pressable
                  key={s || 'any'}
                  onPress={() => {
                    setSize(s);
                    setSizePicker(false);
                    trackEvent('filter', { store: selectedStore, query: s ? `size:${s}` : 'size:any' });
                  }}
                  style={[styles.filter, size === s && styles.filterOn]}
                >
                  <Text style={[styles.filterText, size === s && styles.filterTextOn]}>{s || 'Любой размер'}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Cat.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Cat.bg },
  top: {
    backgroundColor: '#fff',
    borderTopWidth: 4,
    borderTopColor: Cat.red,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 8,
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    zIndex: 2,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: Cat.sunLine,
    borderRadius: 12,
    paddingHorizontal: 10,
    backgroundColor: '#FFFEF8',
  },
  search: { flex: 1, paddingVertical: 9, fontSize: 15, color: Brand.ink },
  tabs: { flexDirection: 'row', gap: 6 },
  tab: {
    flex: 1,
    borderWidth: 2,
    borderColor: Cat.sunLine,
    backgroundColor: '#fff',
    borderRadius: 11,
    paddingVertical: 8,
    alignItems: 'center',
  },
  tabOn: { backgroundColor: Cat.red, borderColor: Cat.red },
  tabText: { fontWeight: '800', fontSize: 14, color: Brand.ink },
  chipsRow: { marginHorizontal: -10 },
  chips: { gap: 6, paddingHorizontal: 2, paddingBottom: 8 },
  filter: {
    borderWidth: 1.5,
    borderColor: Cat.sunLine,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  filterOn: { borderColor: Cat.red, backgroundColor: '#FFE9EA' },
  filterText: { fontSize: 13.5, fontWeight: '700', color: Brand.ink },
  filterTextOn: { color: Cat.red2 },
  offline: {
    backgroundColor: '#FFF3D6',
    color: '#6B5200',
    borderRadius: 10,
    padding: 8,
    fontSize: 12.5,
    marginBottom: 6,
  },
  status: { color: Brand.muted, fontWeight: '700', fontSize: 13, marginBottom: 2, marginLeft: 2 },
  empty: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Cat.sunLine,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 10,
  },
  emptyText: { color: '#6B5C00', fontWeight: '700', textAlign: 'center', fontSize: 14 },
  retry: { backgroundColor: Cat.red, borderRadius: 11, paddingHorizontal: 22, paddingVertical: 10 },
  retryText: { color: '#fff', fontWeight: '900' },
  sheetBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 14,
    maxHeight: '85%',
  },
  sheetHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  sheetTitle: { fontSize: 19, fontWeight: '900', color: Brand.ink, marginBottom: 6 },
  st: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: Cat.sunLine,
    backgroundColor: '#FFFEF8',
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
  },
  stOn: { borderColor: Cat.red },
  stName: { fontSize: 15.5, fontWeight: '800', color: Brand.ink },
  stSub: { fontSize: 13, color: Brand.muted, marginTop: 2 },
  stCount: { fontSize: 13, fontWeight: '800', color: Cat.red2 },
  sizeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  soon: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 28, backgroundColor: Brand.cream },
  soonLogo: { width: 96, height: 96, borderRadius: 24, marginBottom: 16 },
  soonTitle: { fontSize: 26, fontWeight: '900', color: Brand.ink, marginBottom: 10 },
  soonText: { fontSize: 15, lineHeight: 22, color: Brand.muted, textAlign: 'center', marginBottom: 8 },
  soonBtn: { marginTop: 14, backgroundColor: Brand.amber, borderRadius: 14, paddingHorizontal: 22, paddingVertical: 13 },
  soonBtnText: { fontWeight: '900', color: Brand.amberInk, fontSize: 15 },
});
