import { Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { Store } from '@/src/data/stores';
import { photoUrl } from '@/src/data/stores';
import { Brand } from '@/constants/Colors';
import { formatHours, formatOpensDate, isStoreOpen } from '@/src/utils/hours';
import { formatDistance } from '@/src/utils/geo';
import { MaxGradient } from '@/src/components/MaxGradient';

type Props = {
  store: Store;
  index: number;
  distanceKm?: number;
  nearest?: boolean;
};

export function StoreCard({ store, index, distanceKm, nearest }: Props) {
  const open = isStoreOpen(store);
  const opensLabel = formatOpensDate(store.opens);

  return (
    <Pressable
      style={({ pressed }) => [styles.card, nearest && styles.nearest, pressed && styles.pressed]}
      onPress={() => router.push(`/store/${index}`)}
    >
      <Image source={{ uri: photoUrl(store.img) }} style={styles.photo} />
      {nearest ? (
        <View style={styles.nearestBadge}>
          <Ionicons name="star" size={12} color={Brand.amberInk} />
          <Text style={styles.nearestBadgeText}>Ближайший</Text>
        </View>
      ) : null}
      <View style={styles.body}>
        <View style={styles.row}>
          <Text style={styles.city}>{store.city}</Text>
          <View style={[styles.badge, open ? styles.openBadge : styles.closedBadge]}>
            <Text style={[styles.badgeText, open ? styles.openText : styles.closedText]}>
              {open ? 'Открыто' : 'Закрыто'}
            </Text>
          </View>
        </View>
        <Text style={styles.addr}>{store.addr}</Text>
        {store.note ? <Text style={styles.note}>{store.note}</Text> : null}
        <Text style={styles.hours}>{formatHours(store)}</Text>
        {typeof distanceKm === 'number' ? (
          <Text style={styles.distance}>≈ {formatDistance(distanceKm)}</Text>
        ) : null}
        <View style={styles.tags}>
          {store.isNew ? (
            <View style={styles.tagNew}>
              <Text style={styles.tagNewText}>Новый</Text>
            </View>
          ) : null}
          {store.fresh ? (
            <View style={styles.tagFresh}>
              <Text style={styles.tagFreshText}>Фреш</Text>
            </View>
          ) : null}
          {opensLabel ? (
            <Text style={styles.opens}>с {opensLabel}</Text>
          ) : null}
        </View>
        <View style={styles.actions}>
          <Pressable
            style={[styles.btn, styles.tg]}
            onPress={(e) => {
              e.stopPropagation?.();
              Linking.openURL(store.tg);
            }}
          >
            <FontAwesome5 name="telegram-plane" size={14} color="#fff" />
            <Text style={styles.btnText}>Telegram</Text>
          </Pressable>
          <Pressable
            onPress={(e) => {
              e.stopPropagation?.();
              Linking.openURL(store.max);
            }}
            style={styles.btnFlex}
          >
            <MaxGradient style={styles.btn}>
              <Ionicons name="chatbubbles" size={14} color="#fff" />
              <Text style={styles.btnText}>MAX</Text>
            </MaxGradient>
          </Pressable>
          <Pressable
            style={[styles.btn, styles.map]}
            onPress={(e) => {
              e.stopPropagation?.();
              Linking.openURL(store.map);
            }}
          >
            <Ionicons name="map" size={14} color="#fff" />
            <Text style={styles.btnText}>Карта</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Brand.card,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Brand.line,
    marginBottom: 14,
  },
  nearest: {
    borderColor: Brand.amber,
    borderWidth: 2,
  },
  pressed: { opacity: 0.92 },
  photo: { width: '100%', height: 160, backgroundColor: Brand.blueSoft },
  nearestBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Brand.amber,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  nearestBadgeText: { color: Brand.amberInk, fontWeight: '800', fontSize: 12 },
  body: { padding: 14, gap: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  city: { fontSize: 18, fontWeight: '700', color: Brand.ink, flex: 1 },
  addr: { fontSize: 15, color: Brand.ink },
  note: { fontSize: 13, color: Brand.muted, fontStyle: 'italic' },
  hours: { fontSize: 13, color: Brand.muted, marginTop: 2 },
  distance: { fontSize: 13, color: Brand.amberDark, fontWeight: '700' },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  openBadge: { backgroundColor: Brand.successBg },
  closedBadge: { backgroundColor: Brand.closedBg },
  badgeText: { fontSize: 12, fontWeight: '700' },
  openText: { color: Brand.success },
  closedText: { color: Brand.closed },
  tags: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4, flexWrap: 'wrap' },
  tagNew: { backgroundColor: Brand.amberSoft, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  tagNewText: { color: Brand.amberDark, fontWeight: '700', fontSize: 12 },
  tagFresh: { backgroundColor: Brand.successBg, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  tagFreshText: { color: Brand.success, fontWeight: '700', fontSize: 12 },
  opens: { fontSize: 12, color: Brand.muted },
  actions: { flexDirection: 'row', gap: 8, marginTop: 10 },
  btnFlex: { flex: 1, borderRadius: 10, overflow: 'hidden' },
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  tg: { backgroundColor: Brand.tg },
  map: { backgroundColor: Brand.terra },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 12 },
});
