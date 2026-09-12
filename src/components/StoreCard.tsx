import { Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { Store } from '@/src/data/stores';
import { photoUrl } from '@/src/data/stores';
import { Brand, shadow } from '@/constants/Colors';
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
      style={({ pressed }) => [
        styles.card,
        shadow.card,
        nearest && styles.nearest,
        pressed && styles.pressed,
      ]}
      onPress={() => router.push(`/store/${index}`)}
    >
      <View style={styles.photoWrap}>
        <Image source={{ uri: photoUrl(store.img) }} style={styles.photo} />
        <LinearGradient
          colors={['transparent', 'rgba(16,28,51,0.55)', 'rgba(16,28,51,0.92)']}
          locations={[0.35, 0.7, 1]}
          style={styles.photoGrad}
        >
          <Text style={styles.photoCity} numberOfLines={1}>
            {store.city}
          </Text>
          <Text style={styles.photoAddr} numberOfLines={1}>
            {store.addr}
          </Text>
        </LinearGradient>

        {nearest ? (
          <View style={[styles.nearestBadge, shadow.glowAmber]}>
            <Ionicons name="star" size={12} color={Brand.amberInk} />
            <Text style={styles.nearestBadgeText}>Ближайший</Text>
          </View>
        ) : null}

        <View style={[styles.glassBadge, open ? styles.glassOpen : styles.glassClosed]}>
          <View style={[styles.dot, open ? styles.dotOpen : styles.dotClosed]} />
          <Text style={[styles.glassText, open ? styles.openText : styles.closedText]}>
            {open ? 'Открыто' : 'Закрыто'}
          </Text>
        </View>
      </View>

      <View style={styles.body}>
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
          {opensLabel ? <Text style={styles.opens}>с {opensLabel}</Text> : null}
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
    borderRadius: Brand.radius,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Brand.line,
    marginBottom: 16,
  },
  nearest: {
    borderColor: Brand.amber,
    borderWidth: 2,
  },
  pressed: { transform: [{ scale: 0.985 }], opacity: 0.97 },
  photoWrap: { position: 'relative' },
  photo: { width: '100%', height: 200, backgroundColor: Brand.blueSoft },
  photoGrad: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 14,
    paddingTop: 40,
    paddingBottom: 14,
  },
  photoCity: { color: '#fff', fontSize: 20, fontWeight: '800' },
  photoAddr: { color: 'rgba(255,255,255,0.88)', fontSize: 14, marginTop: 2 },
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
    paddingVertical: 6,
    borderRadius: 999,
  },
  nearestBadgeText: { color: Brand.amberInk, fontWeight: '800', fontSize: 12 },
  glassBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.82)',
  },
  glassOpen: { borderColor: 'rgba(31,138,90,0.25)' },
  glassClosed: { borderColor: 'rgba(182,65,47,0.25)' },
  glassText: { fontSize: 12, fontWeight: '700' },
  dot: { width: 7, height: 7, borderRadius: 4 },
  dotOpen: { backgroundColor: Brand.success },
  dotClosed: { backgroundColor: Brand.closed },
  openText: { color: Brand.success },
  closedText: { color: Brand.closed },
  body: { padding: 14, gap: 4 },
  note: { fontSize: 13, color: Brand.muted, fontStyle: 'italic' },
  hours: { fontSize: 13, color: Brand.muted, marginTop: 2 },
  distance: { fontSize: 13, color: Brand.amberDark, fontWeight: '700' },
  tags: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4, flexWrap: 'wrap' },
  tagNew: {
    backgroundColor: Brand.amberSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  tagNewText: { color: Brand.amberDark, fontWeight: '700', fontSize: 12 },
  tagFresh: {
    backgroundColor: Brand.successBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  tagFreshText: { color: Brand.success, fontWeight: '700', fontSize: 12 },
  opens: { fontSize: 12, color: Brand.muted },
  actions: { flexDirection: 'row', gap: 8, marginTop: 12 },
  btnFlex: { flex: 1, borderRadius: 12, overflow: 'hidden' },
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    borderRadius: 12,
  },
  tg: { backgroundColor: Brand.tg },
  map: { backgroundColor: Brand.terra },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 12 },
});
