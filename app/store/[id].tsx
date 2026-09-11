import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Brand } from '@/constants/Colors';
import { STORES, photoUrl } from '@/src/data/stores';
import { formatHours, formatOpensDate, isStoreOpen } from '@/src/utils/hours';

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
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Image source={{ uri: photoUrl(store.img) }} style={styles.photo} />

      <Text style={styles.city}>{store.city}</Text>
      <Text style={styles.addr}>{store.addr}</Text>
      {store.note ? <Text style={styles.note}>{store.note}</Text> : null}

      <View style={styles.metaRow}>
        <View style={[styles.badge, open ? styles.openBadge : styles.closedBadge]}>
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

      <View style={styles.warn}>
        <Ionicons name="warning-outline" size={18} color={Brand.amberDark} />
        <Text style={styles.warnText}>
          Чаты ниже относятся только к этому магазину ({store.city}, {store.addr}).
          Не путайте с группами других точек сети.
        </Text>
      </View>

      <Text style={styles.section}>Чаты этого магазина</Text>

      <Pressable style={[styles.btn, styles.tg]} onPress={() => Linking.openURL(store.tg)}>
        <FontAwesome5 name="telegram-plane" size={18} color="#fff" />
        <View style={{ flex: 1 }}>
          <Text style={styles.btnTitle}>Telegram этого магазина</Text>
          <Text style={styles.btnSub}>Новинки и акции именно этой точки</Text>
        </View>
        <Ionicons name="open-outline" size={18} color="#fff" />
      </Pressable>

      <Pressable style={[styles.btn, styles.max]} onPress={() => Linking.openURL(store.max)}>
        <Ionicons name="chatbubbles" size={18} color="#fff" />
        <View style={{ flex: 1 }}>
          <Text style={styles.btnTitle}>MAX этого магазина</Text>
          <Text style={styles.btnSub}>Группа только для {store.city}</Text>
        </View>
        <Ionicons name="open-outline" size={18} color="#fff" />
      </Pressable>

      <Pressable style={[styles.btn, styles.map]} onPress={() => Linking.openURL(store.map)}>
        <Ionicons name="map" size={18} color="#fff" />
        <View style={{ flex: 1 }}>
          <Text style={styles.btnTitle}>Открыть на карте</Text>
          <Text style={styles.btnSub}>Яндекс Карты</Text>
        </View>
        <Ionicons name="open-outline" size={18} color="#fff" />
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.cream },
  content: { paddingBottom: 40 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Brand.cream },
  missing: { color: Brand.muted, fontSize: 16 },
  photo: { width: '100%', height: 220, backgroundColor: Brand.softBlue },
  city: { fontSize: 26, fontWeight: '800', color: Brand.ink, marginTop: 16, paddingHorizontal: 16 },
  addr: { fontSize: 17, color: Brand.ink, marginTop: 4, paddingHorizontal: 16 },
  note: { fontSize: 14, color: Brand.muted, fontStyle: 'italic', marginTop: 4, paddingHorizontal: 16 },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
    paddingHorizontal: 16,
  },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  openBadge: { backgroundColor: '#E3F6EC' },
  closedBadge: { backgroundColor: '#FCE8E6' },
  badgeText: { fontSize: 13, fontWeight: '700' },
  openText: { color: Brand.success },
  closedText: { color: Brand.danger },
  hours: { color: Brand.muted, fontSize: 14 },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  tagNew: { backgroundColor: Brand.softAmber, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  tagNewText: { color: Brand.amberDark, fontWeight: '700', fontSize: 12 },
  tagFresh: { backgroundColor: '#E3F6EC', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  tagFreshText: { color: Brand.success, fontWeight: '700', fontSize: 12 },
  opens: { color: Brand.muted, fontSize: 12 },
  warn: {
    marginTop: 16,
    marginHorizontal: 16,
    backgroundColor: Brand.softAmber,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    gap: 8,
  },
  warnText: { flex: 1, color: Brand.ink, fontSize: 13, lineHeight: 19 },
  section: {
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 16,
    fontSize: 18,
    fontWeight: '800',
    color: Brand.ink,
  },
  btn: {
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tg: { backgroundColor: Brand.telegram },
  max: { backgroundColor: Brand.blue },
  map: { backgroundColor: Brand.amberDark },
  btnTitle: { color: '#fff', fontWeight: '800', fontSize: 15 },
  btnSub: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 2 },
});
