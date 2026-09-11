import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Brand } from '@/constants/Colors';
import { NETWORK, STORES } from '@/src/data/stores';

const CATEGORIES = [
  { emoji: '🛋️', title: 'Мебель', subtitle: 'для дома и дачи' },
  { emoji: '📺', title: 'Техника', subtitle: 'для дома и кухни' },
  { emoji: '👕', title: 'Одежда и обувь', subtitle: 'для всей семьи' },
  { emoji: '🏠', title: 'Товары для дома', subtitle: 'и всё для быта' },
];

export default function HomeScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.brand}>ПолЦены Маркет</Text>
        <Text style={styles.heroTitle}>Товары с маркетплейсов{'\n'}по скидке −50%</Text>
        <Text style={styles.heroSub}>
          Мебель, техника, одежда и товары для дома за половину цены! Найдите
          ближайший магазин и вступайте в чат — там все новинки и акции.
        </Text>
        <View style={styles.heroStats}>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{STORES.length}</Text>
            <Text style={styles.statLabel}>магазинов</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNum}>−50%</Text>
            <Text style={styles.statLabel}>от карточки</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNum}>Кубань</Text>
            <Text style={styles.statLabel}>и Адыгея</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Категории</Text>
      <View style={styles.cats}>
        {CATEGORIES.map((c) => (
          <View key={c.title} style={styles.cat}>
            <Text style={styles.catEmoji}>{c.emoji}</Text>
            <Text style={styles.catTitle}>{c.title}</Text>
            <Text style={styles.catSub}>{c.subtitle}</Text>
          </View>
        ))}
      </View>

      <Pressable style={styles.cta} onPress={() => router.push('/(tabs)/stores')}>
        <Ionicons name="location" size={20} color="#fff" />
        <Text style={styles.ctaText}>Найти магазин рядом</Text>
      </Pressable>

      <Pressable
        style={styles.secondary}
        onPress={() => Linking.openURL(NETWORK.maxChannel)}
      >
        <Ionicons name="chatbubbles" size={18} color={Brand.blue} />
        <View style={{ flex: 1 }}>
          <Text style={styles.secondaryTitle}>Канал сети в MAX</Text>
          <Text style={styles.secondarySub}>Горячие предложения со всех точек</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={Brand.muted} />
      </Pressable>

      <Pressable style={styles.linkHow} onPress={() => router.push('/(tabs)/how')}>
        <Text style={styles.linkHowText}>Как работает скидка −50% →</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.cream },
  content: { padding: 16, paddingBottom: 40 },
  hero: {
    backgroundColor: Brand.blue,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  brand: { color: Brand.amber, fontWeight: '800', fontSize: 13, letterSpacing: 0.5 },
  heroTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
    marginTop: 8,
    lineHeight: 32,
  },
  heroSub: { color: '#D7E0EF', marginTop: 10, fontSize: 15, lineHeight: 22 },
  heroStats: { flexDirection: 'row', marginTop: 18, gap: 10 },
  stat: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    padding: 10,
  },
  statNum: { color: '#fff', fontWeight: '800', fontSize: 16 },
  statLabel: { color: '#C5D0E3', fontSize: 12, marginTop: 2 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Brand.ink,
    marginBottom: 12,
  },
  cats: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 18 },
  cat: {
    width: '48%',
    flexGrow: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  catEmoji: { fontSize: 28, marginBottom: 6 },
  catTitle: { fontWeight: '700', color: Brand.ink, fontSize: 15 },
  catSub: { color: Brand.muted, fontSize: 12, marginTop: 2 },
  cta: {
    backgroundColor: Brand.amber,
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  ctaText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  secondary: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: Brand.border,
    marginBottom: 16,
  },
  secondaryTitle: { fontWeight: '700', color: Brand.ink },
  secondarySub: { color: Brand.muted, fontSize: 12, marginTop: 2 },
  linkHow: { alignItems: 'center', paddingVertical: 8 },
  linkHowText: { color: Brand.blue, fontWeight: '700', fontSize: 15 },
});
