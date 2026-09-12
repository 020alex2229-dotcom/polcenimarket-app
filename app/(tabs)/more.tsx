import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Brand, shadow } from '@/constants/Colors';
import { NETWORK, STORES } from '@/src/data/stores';
import { MaxGradient } from '@/src/components/MaxGradient';

const brandMark = require('../../assets/images/brand-mark.png');
const logoMark = require('../../assets/images/logo-mark.png');

export default function MoreScreen() {
  const cities = new Set(STORES.map((s) => s.city)).size;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={[Brand.sky, Brand.sky2]} style={styles.header}>
        <Image source={brandMark} style={styles.headerMark} accessibilityLabel="Логотип ПолЦены Маркет" />
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>ПолЦены Маркет</Text>
          <Text style={styles.headerSub}>Ещё о сети и полезные ссылки</Text>
        </View>
        <Image source={logoMark} style={styles.headerLogo} />
      </LinearGradient>

      <Pressable
        style={({ pressed }) => [styles.row, shadow.soft, pressed && styles.rowPressed]}
        onPress={() => Linking.openURL(NETWORK.website)}
      >
        <View style={styles.icon}>
          <Ionicons name="globe-outline" size={22} color={Brand.blue} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.rowTitle}>Сайт polcenimarket.ru</Text>
          <Text style={styles.rowSub}>Актуальные адреса и новости сети</Text>
        </View>
        <Ionicons name="open-outline" size={18} color={Brand.muted} />
      </Pressable>

      <Pressable
        style={({ pressed }) => [styles.rowMaxWrap, shadow.card, pressed && { opacity: 0.94 }]}
        onPress={() => Linking.openURL(NETWORK.maxChannel)}
      >
        <MaxGradient style={styles.rowMax}>
          <View style={styles.maxIcon}>
            <Ionicons name="chatbubbles" size={22} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowMaxTitle}>Канал сети в MAX</Text>
            <Text style={styles.rowMaxSub}>Лучшие предложения со всех магазинов</Text>
          </View>
          <Ionicons name="open-outline" size={18} color="rgba(255,255,255,0.85)" />
        </MaxGradient>
      </Pressable>

      <View style={[styles.about, shadow.card]}>
        <View style={styles.aboutHeader}>
          <Image source={brandMark} style={styles.aboutMark} accessibilityLabel="Логотип" />
          <Text style={styles.aboutTitle}>О сети</Text>
        </View>
        <Text style={styles.aboutBody}>
          ПолЦены Маркет — магазины товаров с маркетплейсов со скидкой −50% в
          Краснодарском крае и Республике Адыгея.
        </Text>
        <Text style={styles.aboutBody}>
          Сейчас в сети {STORES.length} магазинов в {cities} городах и станицах.
          У каждого магазина — свой чат в Telegram и MAX: вступайте только в чат
          своей точки, чтобы не перепутать новинки и акции.
        </Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{STORES.length}</Text>
            <Text style={styles.statLabel}>магазинов</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{cities}</Text>
            <Text style={styles.statLabel}>городов</Text>
          </View>
          <View style={[styles.statBox, styles.statAmber]}>
            <Text style={[styles.statNum, { color: Brand.amberDark }]}>−50%</Text>
            <Text style={styles.statLabel}>скидка</Text>
          </View>
        </View>
      </View>

      <View style={styles.footerRow}>
        <Image source={brandMark} style={styles.footerMark} />
        <Text style={styles.footer}>ПолЦены Маркет · v1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.cream },
  content: { padding: 16, paddingBottom: 48 },
  header: {
    borderRadius: Brand.radius,
    padding: 18,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...shadow.card,
  },
  headerMark: {
    width: 52,
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  headerLogo: { width: 40, height: 40, borderRadius: 10, opacity: 0.95 },
  headerTitle: { color: Brand.cream, fontWeight: '800', fontSize: 18 },
  headerSub: { color: '#c9d3e6', fontSize: 13, marginTop: 3 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Brand.card,
    borderRadius: Brand.radius,
    padding: 16,
    borderWidth: 1,
    borderColor: Brand.line,
    marginBottom: 12,
  },
  rowPressed: { transform: [{ scale: 0.98 }], opacity: 0.96 },
  icon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: Brand.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowMaxWrap: {
    borderRadius: Brand.radius,
    overflow: 'hidden',
    marginBottom: 14,
  },
  rowMax: {
    borderRadius: Brand.radius,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  maxIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: { fontWeight: '700', color: Brand.ink, fontSize: 15 },
  rowSub: { color: Brand.muted, fontSize: 12, marginTop: 2 },
  rowMaxTitle: { fontWeight: '800', color: '#fff', fontSize: 15 },
  rowMaxSub: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 2 },
  about: {
    marginTop: 4,
    backgroundColor: Brand.card,
    borderRadius: Brand.radius,
    padding: 18,
    borderWidth: 1,
    borderColor: Brand.line,
  },
  aboutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  aboutMark: {
    width: 36,
    height: 36,
    borderRadius: 10,
  },
  aboutTitle: { fontWeight: '800', fontSize: 17, color: Brand.ink },
  aboutBody: { color: Brand.ink, fontSize: 14, lineHeight: 21, marginBottom: 8 },
  statsRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  statBox: {
    flex: 1,
    backgroundColor: Brand.blueSoft,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  statAmber: { backgroundColor: Brand.amberSoft },
  statNum: { fontWeight: '800', fontSize: 16, color: Brand.blue },
  statLabel: { fontSize: 11, color: Brand.muted, marginTop: 2 },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 28,
  },
  footerMark: {
    width: 22,
    height: 22,
    borderRadius: 5,
  },
  footer: { textAlign: 'center', color: Brand.muted, fontSize: 12 },
});
