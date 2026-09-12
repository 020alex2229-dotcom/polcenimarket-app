import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Brand, shadow } from '@/constants/Colors';
import { STORES, photoUrl } from '@/src/data/stores';
import { formatHours, formatOpensDate, isStoreOpen } from '@/src/utils/hours';
import { MaxGradient } from '@/src/components/MaxGradient';

export default function StoreDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const index = Number(id);
  const store = Number.isFinite(index) ? STORES[index] : undefined;

  if (!store) {
    return (
      <View style={styles.center}>
        <Text style={styles.missing}>Магазин не найден</Text>
      </View>
    );
  }

  const open = isStoreOpen(store);
  const opensLabel = formatOpensDate(store.opens);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <Image source={{ uri: photoUrl(store.img) }} style={styles.photo} />
        <LinearGradient
          colors={['transparent', 'rgba(16,28,51,0.45)', 'rgba(16,28,51,0.96)']}
          locations={[0.2, 0.55, 1]}
          style={styles.photoGrad}
        >
          <Text style={styles.city}>{store.city}</Text>
          <Text style={styles.addr}>{store.addr}</Text>
          {store.note ? <Text style={styles.noteOnPhoto}>{store.note}</Text> : null}
        </LinearGradient>
      </View>

      <View style={styles.panel}>
        <View style={styles.metaRow}>
          <View style={[styles.badge, open ? styles.openBadge : styles.closedBadge, shadow.soft]}>
            <View style={[styles.dot, open ? styles.dotOpen : styles.dotClosed]} />
            <Text style={[styles.badgeText, open ? styles.openText : styles.closedText]}>
              {open ? 'Сейчас открыто' : 'Сейчас закрыто'}
            </Text>
          </View>
          <Text style={styles.hours}>{formatHours(store)}</Text>
        </View>

        <View style={styles.tags}>
          {store.isNew ? (
            <View style={styles.tagNew}>
              <Text style={styles.tagNewText}>Новый магазин</Text>
            </View>
          ) : null}
          {store.fresh ? (
            <View style={styles.tagFresh}>
              <Text style={styles.tagFreshText}>Фреш</Text>
            </View>
          ) : null}
          {opensLabel ? <Text style={styles.opens}>Открытие: {opensLabel}</Text> : null}
        </View>

        <View style={[styles.warn, shadow.soft]}>
          <Ionicons name="warning-outline" size={18} color={Brand.amberDark} />
          <Text style={styles.warnText}>
            Чаты ниже — именно этого магазина ({store.city}, {store.addr}). Не
            путайте с группами других точек сети.
          </Text>
        </View>

        <Text style={styles.section}>Чат именно этого магазина</Text>

        <Pressable
          style={[styles.btn, styles.tg, shadow.soft]}
          onPress={() => Linking.openURL(store.tg)}
        >
          <View style={styles.btnIcon}>
            <FontAwesome5 name="telegram-plane" size={18} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.btnTitle}>Telegram этого магазина</Text>
            <Text style={styles.btnSub}>Новинки и акции именно этой точки</Text>
          </View>
          <Ionicons name="open-outline" size={18} color="#fff" />
        </Pressable>

        <Pressable onPress={() => Linking.openURL(store.max)} style={[styles.btnWrap, shadow.soft]}>
          <MaxGradient style={styles.maxBtn}>
            <View style={styles.btnIcon}>
              <Ionicons name="chatbubbles" size={18} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.btnTitle}>MAX этого магазина</Text>
              <Text style={styles.btnSub}>Группа только для {store.city}</Text>
            </View>
            <Ionicons name="open-outline" size={18} color="#fff" />
          </MaxGradient>
        </Pressable>

        <Pressable
          style={[styles.btn, styles.map, shadow.soft]}
          onPress={() => Linking.openURL(store.map)}
        >
          <View style={styles.btnIcon}>
            <Ionicons name="map" size={18} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.btnTitle}>Открыть на карте</Text>
            <Text style={styles.btnSub}>Яндекс Карты</Text>
          </View>
          <Ionicons name="open-outline" size={18} color="#fff" />
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.cream },
  content: { paddingBottom: 40 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Brand.cream },
  missing: { color: Brand.muted, fontSize: 16 },
  hero: { width: '100%', height: 280, backgroundColor: Brand.sky },
  photo: { width: '100%', height: '100%' },
  photoGrad: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    justifyContent: 'flex-end',
    paddingHorizontal: 18,
    paddingBottom: 22,
  },
  city: { fontSize: 28, fontWeight: '800', color: '#fff' },
  addr: { fontSize: 17, color: 'rgba(255,255,255,0.92)', marginTop: 4 },
  noteOnPhoto: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    fontStyle: 'italic',
    marginTop: 4,
  },
  panel: { paddingHorizontal: 16, marginTop: -8 },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 16,
    flexWrap: 'wrap',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  openBadge: { backgroundColor: Brand.successBg },
  closedBadge: { backgroundColor: Brand.closedBg },
  badgeText: { fontSize: 13, fontWeight: '700' },
  openText: { color: Brand.success },
  closedText: { color: Brand.closed },
  dot: { width: 7, height: 7, borderRadius: 4 },
  dotOpen: { backgroundColor: Brand.success },
  dotClosed: { backgroundColor: Brand.closed },
  hours: { color: Brand.muted, fontSize: 14 },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  tagNew: {
    backgroundColor: Brand.amberSoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  tagNewText: { color: Brand.amberDark, fontWeight: '700', fontSize: 12 },
  tagFresh: {
    backgroundColor: Brand.successBg,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  tagFreshText: { color: Brand.success, fontWeight: '700', fontSize: 12 },
  opens: { color: Brand.muted, fontSize: 12 },
  warn: {
    marginTop: 16,
    backgroundColor: Brand.amberSoft,
    borderRadius: Brand.radius,
    padding: 14,
    flexDirection: 'row',
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(231,161,27,0.25)',
  },
  warnText: { flex: 1, color: Brand.ink, fontSize: 13, lineHeight: 19 },
  section: {
    marginTop: 22,
    marginBottom: 12,
    fontSize: 18,
    fontWeight: '800',
    color: Brand.ink,
  },
  btnWrap: { marginBottom: 12, borderRadius: Brand.radius, overflow: 'hidden' },
  btn: {
    marginBottom: 12,
    borderRadius: Brand.radius,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  maxBtn: {
    borderRadius: Brand.radius,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  btnIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tg: { backgroundColor: Brand.tg },
  map: { backgroundColor: Brand.terra },
  btnTitle: { color: '#fff', fontWeight: '800', fontSize: 15 },
  btnSub: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 2 },
});
