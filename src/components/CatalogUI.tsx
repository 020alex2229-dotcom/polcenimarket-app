import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Brand } from '@/constants/Colors';
import { imageUrl, rub, whenLabel, type CatalogItem } from '@/src/api/catalog';

/** Цвета как в мини-приложении каталога в MAX */
export const Cat = {
  red: '#EF1F2F',
  red2: '#C91424',
  sun: '#FFD400',
  sun2: '#FFF3A6',
  sunLine: '#F3E3A0',
  chip: '#FFF9CF',
  chipLine: '#FFD84A',
  bg: '#FFFDF5',
};

export function StoreSelector({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Магазин: ${label}. Нажмите, чтобы выбрать другой`}
      style={({ pressed }) => [styles.storeBtn, pressed && { backgroundColor: Cat.sun }]}
    >
      <Text style={styles.storePin}>📍</Text>
      <Text style={styles.storeText} numberOfLines={2}>
        {label}
      </Text>
      <Text style={styles.storeArrow}>▼</Text>
    </Pressable>
  );
}

export function PriceLine({ item, big }: { item: CatalogItem; big?: boolean }) {
  return (
    <View>
      {item.card ? (
        <Text style={[styles.cardPrice, big && { fontSize: 15 }]}>
          {item.market} {rub(item.card)} →
        </Text>
      ) : null}
      <View style={styles.ourWrap}>
        <Text style={[styles.ourPrice, big && { fontSize: 30 }]}>{rub(item.price)}</Text>
      </View>
    </View>
  );
}

export const ItemCard = memo(function ItemCard({
  item,
  isNew,
  onPress,
}: {
  item: CatalogItem;
  isNew: boolean;
  onPress: () => void;
}) {
  const attrs = [item.size && `Размер: ${item.size}`, item.model && `Модель: ${item.model}`].filter(Boolean).join(' · ');
  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && { opacity: 0.92 }]} onPress={onPress}>
      <View style={styles.pic}>
        {item.img ? (
          <Image
            source={{ uri: imageUrl(item.img) }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            contentPosition={{ top: '28%', left: '50%' }}
            cachePolicy="memory-disk"
            recyclingKey={item.id}
            transition={150}
          />
        ) : (
          <Text style={styles.noPic}>Фото скоро</Text>
        )}
        {isNew ? <Text style={styles.newBadge}>НОВИНКА</Text> : null}
      </View>
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>
        {item.variant ? (
          <Text style={styles.variant} numberOfLines={1}>
            {item.variant}
          </Text>
        ) : null}
        {attrs ? <Text style={styles.attr}>{attrs}</Text> : null}
        <View style={{ marginTop: 4 }}>
          <PriceLine item={item} />
        </View>
        <Text style={styles.when}>{whenLabel(item.ts)}</Text>
      </View>
    </Pressable>
  );
});

export function Chip({ label, count, on, onPress }: { label: string; count?: number; on: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, on && styles.chipOn]}>
      <Text style={[styles.chipText, on && { color: '#fff' }]}>
        {label}
        {typeof count === 'number' ? <Text style={styles.chipCount}> {count}</Text> : null}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  storeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 2.5,
    borderColor: Cat.red,
    backgroundColor: Cat.sun2,
    borderRadius: 16,
    paddingVertical: 10,
    paddingLeft: 12,
    paddingRight: 10,
    shadowColor: Cat.red,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  storePin: { fontSize: 22 },
  storeText: { flex: 1, fontSize: 18, fontWeight: '900', color: Brand.ink, lineHeight: 23 },
  storeArrow: { fontSize: 30, fontWeight: '900', color: Cat.red, lineHeight: 34 },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#FFF0A6',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#543E00',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  pic: { aspectRatio: 4 / 5, backgroundColor: '#FFF7CF', alignItems: 'center', justifyContent: 'center' },
  noPic: { color: '#9A8A40', fontSize: 12 },
  newBadge: {
    position: 'absolute',
    left: 7,
    top: 7,
    backgroundColor: Cat.sun,
    color: '#3C3100',
    fontSize: 11,
    fontWeight: '900',
    borderRadius: 8,
    overflow: 'hidden',
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  body: { padding: 10, gap: 3, flex: 1 },
  name: { fontWeight: '800', fontSize: 14.5, color: Brand.ink },
  variant: { color: Brand.muted, fontSize: 12.5 },
  attr: { fontSize: 12.5, fontWeight: '700', color: '#3F464C' },
  cardPrice: { fontSize: 12.5, color: Brand.muted, fontWeight: '700' },
  ourWrap: {
    alignSelf: 'flex-start',
    backgroundColor: Cat.sun2,
    borderRadius: 8,
    paddingHorizontal: 7,
    marginTop: 2,
  },
  ourPrice: { color: Cat.red2, fontSize: 19, fontWeight: '900' },
  when: { fontSize: 11.5, color: '#8A8F94', marginTop: 'auto', paddingTop: 4 },
  chip: {
    borderWidth: 1.5,
    borderColor: Cat.chipLine,
    backgroundColor: Cat.chip,
    borderRadius: 999,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  chipOn: { backgroundColor: Brand.ink, borderColor: Brand.ink },
  chipText: { fontWeight: '800', fontSize: 14, color: Brand.ink },
  chipCount: { opacity: 0.6, fontWeight: '700' },
});
