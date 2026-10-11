import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Brand, shadow } from '@/constants/Colors';
import { CATEGORY_ICONS, DEFAULT_CATEGORIES, cachedCatalog } from '@/src/api/catalog';
import { useOwner } from '@/src/state/owner';

type Tile = { id: string; name: string; count?: number };

/** Сетка категорий на Главной: те же категории, что в каталоге; нажатие открывает «Каталог» с фильтром. */
export function HomeCategories() {
  const { unlocked, selectedStore, setPendingCategory } = useOwner();
  const [tiles, setTiles] = useState<Tile[]>(DEFAULT_CATEGORIES);
  const [storeName, setStoreName] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      (async () => {
        if (!unlocked || !selectedStore) {
          setTiles(DEFAULT_CATEGORIES);
          setStoreName(null);
          return;
        }
        const c = await cachedCatalog(selectedStore);
        if (!alive || !c) return;
        const counts: Record<string, number> = {};
        c.data.items.forEach((x) => (counts[x.cat] = (counts[x.cat] || 0) + 1));
        const real = c.data.categories.map((k) => ({ id: k.id, name: k.name, count: counts[k.id] || 0 }));
        setTiles(real.some((t) => t.count) ? real.filter((t) => t.count) : real);
        setStoreName(c.data.store.name);
      })();
      return () => {
        alive = false;
      };
    }, [unlocked, selectedStore]),
  );

  const open = (id: string) => {
    if (unlocked) setPendingCategory(id);
    router.navigate('/catalog');
  };

  return (
    <View>
      <Text style={styles.title}>Категории</Text>
      {storeName ? <Text style={styles.sub}>📍 {storeName}</Text> : null}
      <View style={styles.grid}>
        {tiles.map((t) => (
          <Pressable
            key={t.id}
            onPress={() => open(t.id)}
            accessibilityRole="button"
            accessibilityLabel={`${t.name}${t.count ? `, ${t.count} товаров` : ''}`}
            style={({ pressed }) => [styles.tile, shadow.soft, pressed && styles.pressed]}
          >
            <View style={styles.icon}>
              <Text style={styles.emoji}>{CATEGORY_ICONS[t.id] ?? '🛍'}</Text>
            </View>
            <Text style={styles.name} numberOfLines={2}>
              {t.name}
            </Text>
            {t.count ? <Text style={styles.count}>{t.count}</Text> : null}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: '800', color: Brand.ink, marginBottom: 4 },
  sub: { fontSize: 13, color: Brand.muted, marginBottom: 8, fontWeight: '700' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6, marginBottom: 22 },
  tile: {
    width: '22.8%',
    backgroundColor: Brand.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Brand.line,
    paddingVertical: 10,
    paddingHorizontal: 2,
    alignItems: 'center',
    minHeight: 96,
  },
  pressed: { transform: [{ scale: 0.95 }], opacity: 0.9 },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Brand.amberSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  emoji: { fontSize: 24 },
  name: { fontSize: 11, fontWeight: '800', color: Brand.ink, textAlign: 'center', lineHeight: 14, letterSpacing: -0.2 },
  count: { fontSize: 10.5, color: Brand.amberDark, fontWeight: '800', marginTop: 2 },
});
