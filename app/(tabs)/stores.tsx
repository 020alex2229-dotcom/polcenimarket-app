import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { Brand, shadow } from '@/constants/Colors';
import { STORES } from '@/src/data/stores';
import { StoreCard } from '@/src/components/StoreCard';
import { haversineKm } from '@/src/utils/geo';

const CITIES = Array.from(new Set(STORES.map((s) => s.city)));

export default function StoresScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [city, setCity] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [sortingNear, setSortingNear] = useState(false);
  const [locating, setLocating] = useState(false);

  const distances = useMemo(() => {
    if (!coords) return {} as Record<number, number>;
    const map: Record<number, number> = {};
    STORES.forEach((s, i) => {
      map[i] = haversineKm(coords.lat, coords.lon, s.lat, s.lon);
    });
    return map;
  }, [coords]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let items = STORES.map((store, index) => ({ store, index }));
    if (city) items = items.filter((x) => x.store.city === city);
    if (q) {
      items = items.filter(
        (x) =>
          x.store.city.toLowerCase().includes(q) ||
          x.store.addr.toLowerCase().includes(q) ||
          (x.store.note ?? '').toLowerCase().includes(q),
      );
    }
    if (sortingNear && coords) {
      items = [...items].sort(
        (a, b) => (distances[a.index] ?? 1e9) - (distances[b.index] ?? 1e9),
      );
    }
    return items;
  }, [query, city, sortingNear, coords, distances]);

  async function findNearby() {
    try {
      setLocating(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Нет доступа к геолокации',
          'Разрешите доступ к местоположению в настройках, чтобы найти магазины рядом.',
        );
        return;
      }
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      setSortingNear(true);
      setCity(null);
    } catch {
      Alert.alert('Ошибка', 'Не удалось определить местоположение. Попробуйте ещё раз.');
    } finally {
      setLocating(false);
    }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.toolbar}>
        <View style={[styles.searchBox, shadow.soft]}>
          <Ionicons name="search" size={18} color={Brand.muted} />
          <TextInput
            style={styles.input}
            placeholder="Город или улица…"
            placeholderTextColor={Brand.muted}
            value={query}
            onChangeText={setQuery}
          />
          {query ? (
            <Pressable onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color={Brand.muted} />
            </Pressable>
          ) : null}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          <Pressable
            style={[styles.chip, !city && styles.chipActive, shadow.soft]}
            onPress={() => setCity(null)}
          >
            <Text style={[styles.chipText, !city && styles.chipTextActive]}>Все</Text>
          </Pressable>
          {CITIES.map((c) => (
            <Pressable
              key={c}
              style={[styles.chip, city === c && styles.chipActive, shadow.soft]}
              onPress={() => setCity(city === c ? null : c)}
            >
              <Text style={[styles.chipText, city === c && styles.chipTextActive]}>{c}</Text>
            </Pressable>
          ))}
        </ScrollView>
        {sortingNear && coords ? (
          <Text style={styles.hint}>Сортировка по расстоянию от вас</Text>
        ) : null}
      </View>

      <ScrollView contentContainerStyle={[styles.list, { paddingBottom: 88 + insets.bottom }]}>
        {filtered.length === 0 ? (
          <Text style={styles.empty}>
            Ничего не нашли. Попробуйте другой город или сбросьте фильтр.
          </Text>
        ) : (
          filtered.map(({ store, index }, i) => (
            <StoreCard
              key={`${store.city}-${store.addr}`}
              store={store}
              index={index}
              distanceKm={coords ? distances[index] : undefined}
              nearest={Boolean(sortingNear && coords && i === 0)}
            />
          ))
        )}
      </ScrollView>

      <View style={[styles.nearDock, { paddingBottom: Math.max(12, insets.bottom + 8) }]}>
        <Pressable
          style={[styles.nearBtn, shadow.glowAmber]}
          onPress={findNearby}
          disabled={locating}
        >
          {locating ? (
            <ActivityIndicator color={Brand.amberInk} />
          ) : (
            <>
              <Ionicons name="navigate" size={18} color={Brand.amberInk} />
              <Text style={styles.nearText}>Рядом со мной</Text>
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.cream },
  toolbar: { paddingHorizontal: 16, paddingTop: 8, gap: 12 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Brand.card,
    borderRadius: Brand.radius,
    borderWidth: 1,
    borderColor: Brand.line,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  input: { flex: 1, color: Brand.ink, fontSize: 15, padding: 0 },
  nearDock: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 0,
  },
  nearBtn: {
    backgroundColor: Brand.amber,
    borderRadius: Brand.radius,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  nearText: { color: Brand.amberInk, fontWeight: '800', fontSize: 16 },
  chips: { gap: 8, paddingVertical: 2, paddingRight: 8 },
  chip: {
    backgroundColor: Brand.card,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: Brand.line,
  },
  chipActive: { backgroundColor: Brand.blue, borderColor: Brand.blue },
  chipText: { color: Brand.muted, fontSize: 13, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  hint: { color: Brand.muted, fontSize: 12 },
  list: { padding: 16 },
  empty: { textAlign: 'center', color: Brand.muted, marginTop: 40, fontSize: 15 },
});
