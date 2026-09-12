import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Brand } from '@/constants/Colors';
import { NETWORK, STORES } from '@/src/data/stores';
import { MaxGradient } from '@/src/components/MaxGradient';

const brandMark = require('../../assets/images/brand-mark.png');

const CATEGORIES = [
  { emoji: '🛋️', title: 'Мебель', subtitle: 'для дома и дачи', accent: 'amber' as const },
  { emoji: '📺', title: 'Техника', subtitle: 'для дома и кухни', accent: 'blue' as const },
  { emoji: '👕', title: 'Одежда и обувь', subtitle: 'для всей семьи', accent: 'blue' as const },
  { emoji: '🏠', title: 'Товары для дома', subtitle: 'и всё для быта', accent: 'amber' as const },
];

export default function HomeScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <LinearGradient
        colors={[Brand.sky, Brand.sky2]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.brandRow}>
          <Image source={brandMark} style={styles.brandLogo} accessibilityLabel="Логотип ПолЦены Маркет" />
          <Text style={styles.brand}>ПолЦены Маркет</Text>
        </View>
        <Text style={styles.heroTitle}>
          {'Товары с маркетплейсов\nпо скидке '}
          <Text style={styles.heroAccent}>−50%</Text>
        </Text>
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
            <Text style={[styles.statNum, styles.statAccent]}>−50%</Text>
            <Text style={styles.statLabel}>от карточки</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNum}>Кубань</Text>
            <Text style={styles.statLabel}>и Адыгея</Text>
          </View>
        </View>
      </LinearGradient>

      <Text style={styles.sectionTitle}>Категории</Text>
      <View style={styles.cats}>
        {CATEGORIES.map((c) => {
          const amber = c.accent === 'amber';
          return (
            <View
              key={c.title}
              style={[styles.cat, amber ? styles.catAmber : styles.catBlue]}
            >
              <View style={[styles.catIcon, amber ? styles.catIconAmber : styles.catIconBlue]}>
                <Text style={styles.catEmoji}>{c.emoji}</Text>
              </View>
              <Text style={styles.catTitle}>{c.title}</Text>
              <Text style={styles.catSub}>{c.subtitle}</Text>
            </View>
          );
        })}
      </View>

      <Pressable style={styles.cta} onPress={() => router.push('/(tabs)/stores')}>
        <Ionicons name="location" size={20} color={Brand.amberInk} />
        <Text style={styles.ctaText}>Найти магазин рядом</Text>
      </Pressable>

      <Pressable
        style={styles.secondary}
        onPress={() => Linking.openURL(NETWORK.maxChannel)}
      >
        <MaxGradient style={styles.maxIcon}>
          <Ionicons name="chatbubbles" size={18} color="#fff" />
        </MaxGradient>
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
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandLogo: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  brand: {
    color: Brand.amber,
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: Brand.cream,
    fontSize: 26,
    fontWeight: '800',
    marginTop: 8,
    lineHeight: 32,
  },
  heroAccent: { color: Brand.amber },
  heroSub: { color: '#c9d3e6', marginTop: 10, fontSize: 15, lineHeight: 22 },
  heroStats: { flexDirection: 'row', marginTop: 18, gap: 10 },
  stat: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  statNum: { color: Brand.cream, fontWeight: '800', fontSize: 16 },
  statAccent: { color: Brand.amber },
  statLabel: { color: '#9fabc4', fontSize: 12, marginTop: 2 },
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
    backgroundColor: Brand.cream,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Brand.line,
  },
  catAmber: { borderLeftWidth: 3, borderLeftColor: Brand.amber },
  catBlue: { borderLeftWidth: 3, borderLeftColor: Brand.blue },
  catIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  catIconAmber: { backgroundColor: Brand.amberSoft },
  catIconBlue: { backgroundColor: Brand.blueSoft },
  catEmoji: { fontSize: 24 },
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
  ctaText: { color: Brand.amberInk, fontWeight: '800', fontSize: 16 },
  secondary: {
    backgroundColor: Brand.card,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: Brand.line,
    marginBottom: 16,
  },
  maxIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryTitle: { fontWeight: '700', color: Brand.ink },
  secondarySub: { color: Brand.muted, fontSize: 12, marginTop: 2 },
  linkHow: { alignItems: 'center', paddingVertical: 8 },
  linkHowText: { color: Brand.blue, fontWeight: '700', fontSize: 15 },
});
