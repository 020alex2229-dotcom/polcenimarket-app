import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Brand } from '@/constants/Colors';
import { NETWORK, STORES } from '@/src/data/stores';
import { MaxGradient } from '@/src/components/MaxGradient';

export default function MoreScreen() {
  const cities = new Set(STORES.map((s) => s.city)).size;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Ещё</Text>

      <Pressable style={styles.row} onPress={() => Linking.openURL(NETWORK.website)}>
        <View style={styles.icon}>
          <Ionicons name="globe-outline" size={22} color={Brand.blue} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.rowTitle}>Сайт polcenimarket.ru</Text>
          <Text style={styles.rowSub}>Актуальные адреса и новости сети</Text>
        </View>
        <Ionicons name="open-outline" size={18} color={Brand.muted} />
      </Pressable>

      <Pressable style={styles.row} onPress={() => Linking.openURL(NETWORK.maxChannel)}>
        <MaxGradient style={styles.maxIcon}>
          <Ionicons name="chatbubbles" size={22} color="#fff" />
        </MaxGradient>
        <View style={{ flex: 1 }}>
          <Text style={styles.rowTitle}>Канал сети в MAX</Text>
          <Text style={styles.rowSub}>Лучшие предложения со всех магазинов</Text>
        </View>
        <Ionicons name="open-outline" size={18} color={Brand.muted} />
      </Pressable>

      <View style={styles.about}>
        <Text style={styles.aboutTitle}>О сети</Text>
        <Text style={styles.aboutBody}>
          ПолЦены Маркет — магазины товаров с маркетплейсов со скидкой −50% в
          Краснодарском крае и Республике Адыгея.
        </Text>
        <Text style={styles.aboutBody}>
          Сейчас в сети {STORES.length} магазинов в {cities} городах и станицах.
          У каждого магазина — свой чат в Telegram и MAX: вступайте только в чат
          своей точки, чтобы не перепутать новинки и акции.
        </Text>
      </View>

      <Text style={styles.footer}>ПолЦены Маркет · v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.cream },
  content: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: '800', color: Brand.ink, marginBottom: 14 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Brand.card,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Brand.line,
    marginBottom: 10,
  },
  icon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: Brand.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  maxIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: { fontWeight: '700', color: Brand.ink, fontSize: 15 },
  rowSub: { color: Brand.muted, fontSize: 12, marginTop: 2 },
  about: {
    marginTop: 10,
    backgroundColor: Brand.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Brand.line,
  },
  aboutTitle: { fontWeight: '800', fontSize: 17, color: Brand.ink, marginBottom: 8 },
  aboutBody: { color: Brand.ink, fontSize: 14, lineHeight: 21, marginBottom: 8 },
  footer: { textAlign: 'center', color: Brand.muted, marginTop: 24, fontSize: 12 },
});
