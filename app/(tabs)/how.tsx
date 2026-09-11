import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Brand } from '@/constants/Colors';

export default function HowScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Как работает скидка −50%</Text>
      <Text style={styles.lead}>
        Всё прозрачно — вы смотрите цену прямо с карточки товара на маркетплейсе,
        и на кассе платите ровно половину.
      </Text>

      <View style={styles.card}>
        <View style={styles.iconWrap}>
          <Ionicons name="barcode-outline" size={28} color={Brand.amberDark} />
        </View>
        <Text style={styles.cardTitle}>Штрихкод есть и читается</Text>
        <Text style={styles.cardBody}>
          Сканируем его на Ozon и смотрим цену в карточке товара. Именно от неё —
          полцены.
        </Text>
        <View style={styles.pill}>
          <Text style={styles.pillText}>Ozon → половина цены</Text>
        </View>
      </View>

      <Text style={styles.or}>или</Text>

      <View style={styles.card}>
        <View style={[styles.iconWrap, { backgroundColor: Brand.softBlue }]}>
          <Ionicons name="camera-outline" size={28} color={Brand.blue} />
        </View>
        <Text style={styles.cardTitle}>Штрихкода нет или не считывается</Text>
        <Text style={styles.cardBody}>
          Ищем товар по фото на Wildberries с доставкой до 5 дней!
        </Text>
        <View style={[styles.pill, { backgroundColor: Brand.softBlue }]}>
          <Text style={[styles.pillText, { color: Brand.blue }]}>WB → поиск по фото</Text>
        </View>
      </View>

      <View style={styles.note}>
        <Ionicons name="information-circle" size={20} color={Brand.blue} />
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
  content: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: '800', color: Brand.ink, marginBottom: 8 },
  lead: { fontSize: 15, color: Brand.muted, lineHeight: 22, marginBottom: 18 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Brand.softAmber,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  cardTitle: { fontSize: 17, fontWeight: '800', color: Brand.ink, marginBottom: 6 },
  cardBody: { fontSize: 15, color: Brand.ink, lineHeight: 22 },
  pill: {
    alignSelf: 'flex-start',
    marginTop: 12,
    backgroundColor: Brand.softAmber,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  pillText: { color: Brand.amberDark, fontWeight: '700', fontSize: 13 },
  or: {
    textAlign: 'center',
    marginVertical: 14,
    color: Brand.muted,
    fontWeight: '700',
  },
  note: {
    marginTop: 18,
    flexDirection: 'row',
    gap: 10,
    backgroundColor: Brand.softBlue,
    borderRadius: 12,
    padding: 14,
  },
  noteText: { flex: 1, color: Brand.ink, fontSize: 14, lineHeight: 20 },
});
