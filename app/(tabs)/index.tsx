import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Brand, shadow } from '@/constants/Colors';
import { NETWORK, STORES, photoUrl } from '@/src/data/stores';
import { MaxGradient } from '@/src/components/MaxGradient';

const brandMark = require('../../assets/images/brand-mark.png');
const logoMark = require('../../assets/images/logo-mark.png');

const FEATURES = [
  { icon: 'pricetag' as const, label: '−50% от карточки' },
  { icon: 'storefront' as const, label: `${STORES.length} магазинов` },
  { icon: 'chatbubbles' as const, label: 'Чаты точек' },
  { icon: 'map' as const, label: 'Кубань и Адыгея' },
];

const CATEGORIES = [
  { emoji: '🛋️', title: 'Мебель', subtitle: 'для дома и дачи', accent: 'amber' as const },
  { emoji: '📺', title: 'Техника', subtitle: 'для дома и кухни', accent: 'blue' as const },
  { emoji: '👕', title: 'Одежда и обувь', subtitle: 'для всей семьи', accent: 'blue' as const },
  { emoji: '🏠', title: 'Товары для дома', subtitle: 'и всё для быта', accent: 'amber' as const },
];

const PREVIEW_STORES = [4, 5, 0, 10].map((i) => ({ store: STORES[i], index: i })).filter((x) => x.store);

export default function HomeScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={[Brand.sky, Brand.sky2, '#243556']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.heroGlow} />
        <View style={styles.brandRow}>
          <Image source={brandMark} style={styles.brandLogo} accessibilityLabel="Логотип ПолЦены Маркет" />
          <View style={{ flex: 1 }}>
            <Text style={styles.brand}>ПолЦены Маркет</Text>
            <Text style={styles.brandTag}>товары с маркетплейсов</Text>
          </View>
          <Image source={logoMark} style={styles.brandWord} accessibilityLabel="Марка сети" />
        </View>

        <Text style={styles.heroTitle}>Товары с маркетплейсов{'\n'}по скидке</Text>
        <View style={[styles.discountPill, shadow.glowAmber]}>
          <Text style={styles.discountText}>−50%</Text>
        </View>

        <Text style={styles.heroSub}>
          Мебель, техника, одежда и товары для дома за половину цены! Найдите
          ближайший магазин и вступайте в чат — там все новинки и акции.
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featureChips}
          style={styles.featureScroll}
        >
          {FEATURES.map((f) => (
            <View key={f.label} style={styles.featureChip}>
              <Ionicons name={f.icon} size={14} color={Brand.amber} />
              <Text style={styles.featureChipText}>{f.label}</Text>
            </View>
          ))}
        </ScrollView>

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
            <Pressable
              key={c.title}
              style={({ pressed }) => [
                styles.cat,
                amber ? styles.catAmber : styles.catBlue,
                shadow.soft,
                pressed && styles.catPressed,
              ]}
            >
              <View style={[styles.catIcon, amber ? styles.catIconAmber : styles.catIconBlue]}>
                <Text style={styles.catEmoji}>{c.emoji}</Text>
              </View>
              <Text style={styles.catTitle}>{c.title}</Text>
              <Text style={styles.catSub}>{c.subtitle}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitleInline}>Магазины</Text>
        <Pressable onPress={() => router.push('/(tabs)/stores')}>
          <Text style={styles.seeAll}>Все →</Text>
        </Pressable>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.storeStrip}
      >
        {PREVIEW_STORES.map(({ store, index }) => (
          <Pressable
            key={`${store.city}-${store.addr}`}
            style={({ pressed }) => [styles.storePreview, shadow.card, pressed && { transform: [{ scale: 0.97 }] }]}
            onPress={() => router.push(`/store/${index}`)}
          >
            <Image source={{ uri: photoUrl(store.img) }} style={styles.storePreviewImg} />
            <LinearGradient
              colors={['transparent', 'rgba(16,28,51,0.92)']}
              style={styles.storePreviewGrad}
            >
              <Text style={styles.storePreviewCity} numberOfLines={1}>
                {store.city}
              </Text>
              <Text style={styles.storePreviewAddr} numberOfLines={1}>
                {store.addr}
              </Text>
            </LinearGradient>
          </Pressable>
        ))}
      </ScrollView>

      <Pressable
        style={({ pressed }) => [styles.cta, shadow.soft, pressed && { transform: [{ scale: 0.98 }], opacity: 0.95 }]}
        onPress={() => router.push('/(tabs)/stores')}
      >
        <Ionicons name="location" size={20} color={Brand.amberInk} />
        <Text style={styles.ctaText}>Найти магазин рядом</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [styles.maxCardWrap, shadow.card, pressed && { opacity: 0.94 }]}
        onPress={() => Linking.openURL(NETWORK.maxChannel)}
      >
        <MaxGradient style={styles.maxCard}>
          <View style={styles.maxIconLg}>
            <Ionicons name="chatbubbles" size={22} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.maxCardTitle}>Канал сети в MAX</Text>
            <Text style={styles.maxCardSub}>Горячие предложения со всех точек</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.85)" />
        </MaxGradient>
      </Pressable>

      <Pressable style={styles.linkHow} onPress={() => router.push('/(tabs)/how')}>
        <Text style={styles.linkHowText}>Как работает скидка −50% →</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.cream },
  content: { padding: 16, paddingBottom: 48 },
  hero: {
    borderRadius: Brand.radius,
    padding: 20,
    marginBottom: 22,
    overflow: 'hidden',
    ...shadow.card,
  },
  heroGlow: {
    position: 'absolute',
    top: -40,
    right: -30,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(231,161,27,0.18)',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandLogo: {
    width: 52,
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  brandWord: {
    width: 44,
    height: 44,
    borderRadius: 10,
    opacity: 0.95,
  },
  brand: {
    color: Brand.amber,
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  brandTag: {
    color: 'rgba(201,211,230,0.85)',
    fontSize: 12,
    marginTop: 2,
  },
  heroTitle: {
    color: Brand.cream,
    fontSize: 27,
    fontWeight: '800',
    marginTop: 16,
    lineHeight: 34,
  },
  discountPill: {
    alignSelf: 'flex-start',
    marginTop: 12,
    backgroundColor: Brand.amber,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  discountText: {
    color: Brand.amberInk,
    fontWeight: '900',
    fontSize: 22,
    letterSpacing: 0.5,
  },
  heroSub: { color: '#c9d3e6', marginTop: 14, fontSize: 15, lineHeight: 22 },
  featureScroll: { marginTop: 16, marginHorizontal: -4 },
  featureChips: { gap: 8, paddingHorizontal: 4 },
  featureChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  featureChipText: { color: Brand.cream, fontSize: 12, fontWeight: '700' },
  heroStats: { flexDirection: 'row', marginTop: 16, gap: 10 },
  stat: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    padding: 12,
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
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 4,
  },
  sectionTitleInline: {
    fontSize: 20,
    fontWeight: '800',
    color: Brand.ink,
  },
  seeAll: { color: Brand.blue, fontWeight: '700', fontSize: 14 },
  cats: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  cat: {
    width: '47%',
    flexGrow: 1,
    backgroundColor: Brand.card,
    borderRadius: Brand.radius,
    padding: 16,
    borderWidth: 1,
    borderColor: Brand.line,
  },
  catPressed: { transform: [{ scale: 0.97 }], opacity: 0.96 },
  catAmber: { borderLeftWidth: 3, borderLeftColor: Brand.amber },
  catBlue: { borderLeftWidth: 3, borderLeftColor: Brand.blue },
  catIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  catIconAmber: { backgroundColor: Brand.amberSoft },
  catIconBlue: { backgroundColor: Brand.blueSoft },
  catEmoji: { fontSize: 26 },
  catTitle: { fontWeight: '700', color: Brand.ink, fontSize: 15 },
  catSub: { color: Brand.muted, fontSize: 12, marginTop: 3 },
  storeStrip: { gap: 12, paddingBottom: 4, marginBottom: 18 },
  storePreview: {
    width: 168,
    height: 120,
    borderRadius: Brand.radius,
    overflow: 'hidden',
    backgroundColor: Brand.blueSoft,
  },
  storePreviewImg: { width: '100%', height: '100%' },
  storePreviewGrad: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 12,
    paddingTop: 28,
    paddingBottom: 10,
  },
  storePreviewCity: { color: '#fff', fontWeight: '800', fontSize: 14 },
  storePreviewAddr: { color: 'rgba(255,255,255,0.8)', fontSize: 11, marginTop: 2 },
  cta: {
    backgroundColor: Brand.amber,
    borderRadius: Brand.radius,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  ctaText: { color: Brand.amberInk, fontWeight: '800', fontSize: 16 },
  maxCardWrap: {
    borderRadius: Brand.radius,
    overflow: 'hidden',
    marginBottom: 16,
  },
  maxCard: {
    borderRadius: Brand.radius,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  maxIconLg: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  maxCardTitle: { color: '#fff', fontWeight: '800', fontSize: 16 },
  maxCardSub: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 3 },
  linkHow: { alignItems: 'center', paddingVertical: 10 },
  linkHowText: { color: Brand.blue, fontWeight: '700', fontSize: 15 },
});
