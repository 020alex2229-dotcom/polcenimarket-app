import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Brand, shadow } from '@/constants/Colors';

export default function HowScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={[Brand.sky, Brand.sky2]} style={styles.hero}>
        <View style={[styles.heroPill, shadow.glowAmber]}>
          <Text style={styles.heroPillText}>−50%</Text>
        </View>
        <Text style={styles.title}>Как работает скидка</Text>
        <Text style={styles.lead}>
          Всё прозрачно — вы смотрите цену прямо с карточки товара на маркетплейсе,
          и на кассе платите ровно половину.
        </Text>
      </LinearGradient>

      <View style={[styles.card, shadow.card]}>
        <View style={styles.cardTop}>
          <View style={[styles.numBadge, shadow.glowAmber]}>
            <Text style={styles.numText}>1</Text>
          </View>
          <View style={styles.iconWrap}>
            <Ionicons name="barcode-outline" size={28} color={Brand.amberDark} />
          </View>
        </View>
        <Text style={styles.cardTitle}>Штрихкод есть и читается</Text>
        <Text style={styles.cardBody}>
          Сканируем его на Ozon и смотрим цену в карточке товара. Именно от неё —
          полцены.
        </Text>
        <View style={styles.pill}>
          <Ionicons name="checkmark-circle" size={16} color={Brand.amberDark} />
          <Text style={styles.pillText}>Ozon → половина цены</Text>
        </View>
      </View>

      <View style={styles.orRow}>
        <View style={styles.orLine} />
        <Text style={styles.or}>или</Text>
        <View style={styles.orLine} />
      </View>

      <View style={[styles.card, shadow.card]}>
        <View style={styles.cardTop}>
          <View style={[styles.numBadge, styles.numBlue]}>
            <Text style={[styles.numText, styles.numTextBlue]}>2</Text>
          </View>
          <View style={[styles.iconWrap, { backgroundColor: Brand.blueSoft }]}>
            <Ionicons name="camera-outline" size={28} color={Brand.blue} />
          </View>
        </View>
        <Text style={styles.cardTitle}>Штрихкода нет или не считывается</Text>
        <Text style={styles.cardBody}>
          Ищем товар по фото на Wildberries с доставкой до 5 дней!
        </Text>
        <View style={[styles.pill, { backgroundColor: Brand.blueSoft }]}>
          <Ionicons name="image-outline" size={16} color={Brand.blue} />
          <Text style={[styles.pillText, { color: Brand.blue }]}>WB → поиск по фото</Text>
        </View>
      </View>

      <View style={[styles.note, shadow.soft]}>
        <Ionicons name="information-circle" size={22} color={Brand.blue} />
        <Text style={styles.noteText}>
          Тот же товар, что и на маркетплейсах, только дешевле. Можно проверить
          цену по штрихкоду прямо в магазине.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.cream },
  content: { padding: 16, paddingBottom: 48 },
  hero: {
    borderRadius: Brand.radius,
    padding: 20,
    marginBottom: 18,
    ...shadow.card,
  },
  heroPill: {
    alignSelf: 'flex-start',
    backgroundColor: Brand.amber,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 12,
  },
  heroPillText: { color: Brand.amberInk, fontWeight: '900', fontSize: 18 },
  title: { fontSize: 24, fontWeight: '800', color: Brand.cream, marginBottom: 8 },
  lead: { fontSize: 15, color: '#c9d3e6', lineHeight: 22 },
  card: {
    backgroundColor: Brand.card,
    borderRadius: Brand.radius,
    padding: 18,
    borderWidth: 1,
    borderColor: Brand.line,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  numBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: Brand.amber,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numBlue: { backgroundColor: Brand.blue },
  numText: { color: Brand.amberInk, fontWeight: '900', fontSize: 16 },
  numTextBlue: { color: '#fff' },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: Brand.amberSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { fontSize: 17, fontWeight: '800', color: Brand.ink, marginBottom: 8 },
  cardBody: { fontSize: 15, color: Brand.ink, lineHeight: 22 },
  pill: {
    alignSelf: 'flex-start',
    marginTop: 14,
    backgroundColor: Brand.amberSoft,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pillText: { color: Brand.amberDark, fontWeight: '700', fontSize: 13 },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 16,
  },
  orLine: { flex: 1, height: 1, backgroundColor: Brand.line },
  or: { color: Brand.muted, fontWeight: '700' },
  note: {
    marginTop: 18,
    flexDirection: 'row',
    gap: 12,
    backgroundColor: Brand.blueSoft,
    borderRadius: Brand.radius,
    padding: 16,
  },
  noteText: { flex: 1, color: Brand.ink, fontSize: 14, lineHeight: 20 },
});
