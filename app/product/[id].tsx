import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Brand } from '@/constants/Colors';
import { findItem, imageUrl, sendLead, trackEvent, whenLabel, type LeadResult } from '@/src/api/catalog';
import { Cat, PriceLine } from '@/src/components/CatalogUI';
import { useOwner } from '@/src/state/owner';

export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { stores } = useOwner();
  const found = id ? findItem(String(id)) : null;
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<LeadResult | null>(null);
  const [showVisit, setShowVisit] = useState(false);

  useEffect(() => {
    if (found) trackEvent('view_item', { store: found.item.store, item: found.item.id, category: found.item.cat });
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!found) {
    return (
      <View style={styles.center}>
        <Text style={styles.missing}>Товар уже снят с витрины. Обновите каталог.</Text>
      </View>
    );
  }
  const { item, catalog } = found;
  const store = catalog.store;
  const policies = stores?.policies ?? [];
  const isNew = item.ts >= catalog.today_from;

  async function want() {
    setSending(true);
    try {
      const res = await sendLead(item.id);
      setSent(res);
      setShowVisit(true);
    } catch (e: any) {
      Alert.alert('Не получилось', e?.message || 'Попробуйте ещё раз');
    } finally {
      setSending(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: Cat.bg }}>
      <Stack.Screen options={{ title: 'Товар' }} />
      <ScrollView contentContainerStyle={{ padding: 14, paddingBottom: 110 + insets.bottom }}>
        <View style={styles.picWrap}>
          {item.img ? (
            <Image
              source={{ uri: imageUrl(item.img) }}
              style={styles.pic}
              contentFit="contain"
              cachePolicy="memory-disk"
              transition={150}
            />
          ) : (
            <Text style={styles.noPic}>Фото скоро</Text>
          )}
          {isNew ? <Text style={styles.newBadge}>НОВИНКА ДНЯ</Text> : null}
        </View>
        <Text style={styles.name}>{item.name}</Text>
        {item.variant ? <Text style={styles.variant}>{item.variant}</Text> : null}
        <View style={styles.attrs}>
          {item.size ? <Text style={styles.attr}>Размер: {item.size}</Text> : null}
          {item.model ? <Text style={styles.attr}>Модель: {item.model}</Text> : null}
          {item.dims ? <Text style={styles.attr}>Габариты: {item.dims}</Text> : null}
        </View>
        <View style={styles.priceBox}>
          <PriceLine item={item} big />
          <Text style={styles.when}>Опубликован {whenLabel(item.ts)}</Text>
        </View>

        <View style={styles.storeBox}>
          <Text style={styles.storeTitle}>{store.name}</Text>
          {store.address ? (
            <Text style={styles.storeLine}>
              📍 {store.city ? `${store.city}, ` : ''}
              {store.address}
              {store.landmark ? ` (${store.landmark})` : ''}
            </Text>
          ) : null}
          {store.hours ? <Text style={styles.storeLine}>🕘 Ежедневно {store.hours}</Text> : null}
          <View style={{ flexDirection: 'row', gap: 16, marginTop: 6 }}>
            {store.map ? (
              <Text style={styles.link} onPress={() => Linking.openURL(store.map)}>
                Открыть на карте
              </Text>
            ) : null}
            {store.group ? (
              <Text style={styles.link} onPress={() => Linking.openURL(store.group)}>
                Группа в MAX
              </Text>
            ) : null}
          </View>
          {policies.length ? <Text style={styles.pol}>{policies.join(' · ')}</Text> : null}
        </View>
      </ScrollView>

      <View style={[styles.bottom, { paddingBottom: 12 + insets.bottom }]}>
        <Pressable
          disabled={sending}
          onPress={() => (sent ? setShowVisit(true) : want())}
          style={({ pressed }) => [styles.want, (pressed || sending) && { opacity: 0.85 }, sent && styles.wantDone]}
        >
          {sending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.wantText}>{sent ? '✓ Ждём вас в магазине' : 'Хочу посмотреть'}</Text>
          )}
        </Pressable>
      </View>

      <Modal visible={showVisit && !!sent} transparent animationType="slide" onRequestClose={() => setShowVisit(false)}>
        <Pressable style={styles.sheetBg} onPress={() => setShowVisit(false)}>
          <Pressable style={[styles.sheet, { paddingBottom: 18 + insets.bottom }]} onPress={() => {}}>
            <Text style={styles.sheetTitle}>✓ Ждём вас!</Text>
            <ScrollView style={{ maxHeight: 360 }}>
              <LinkedText text={sent?.visit ?? ''} />
              {sent?.dm ? (
                <Text style={styles.dmNote}>Это сообщение мы также отправили вам в чат бота «КАТАЛОГ ПолЦеныМаркет».</Text>
              ) : null}
            </ScrollView>
            {store.map ? (
              <Pressable style={styles.mapBtn} onPress={() => Linking.openURL(store.map)}>
                <Text style={styles.mapBtnText}>📍 Как добраться</Text>
              </Pressable>
            ) : null}
            <Pressable style={styles.okBtn} onPress={() => setShowVisit(false)}>
              <Text style={styles.okBtnText}>Хорошо</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

/** Текст сервера с кликабельными ссылками */
function LinkedText({ text }: { text: string }) {
  const parts = text.split(/(https?:\/\/\S+)/g);
  return (
    <Text style={styles.visit}>
      {parts.map((p, i) =>
        /^https?:\/\//.test(p) ? (
          <Text key={i} style={styles.visitLink} onPress={() => Linking.openURL(p)}>
            {p}
          </Text>
        ) : (
          <Text key={i}>{p}</Text>
        ),
      )}
    </Text>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: Cat.bg },
  missing: { color: Brand.muted, fontSize: 16, textAlign: 'center' },
  picWrap: {
    backgroundColor: '#FFF7CF',
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 1,
  },
  pic: { width: '100%', height: '100%' },
  noPic: { color: '#9A8A40' },
  newBadge: {
    position: 'absolute',
    left: 10,
    top: 10,
    backgroundColor: Cat.sun,
    color: '#3C3100',
    fontWeight: '900',
    fontSize: 12,
    borderRadius: 8,
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  name: { fontSize: 21, fontWeight: '900', color: Brand.ink, marginTop: 14 },
  variant: { fontSize: 15, color: Brand.muted, marginTop: 4 },
  attrs: { marginTop: 6, gap: 2 },
  attr: { fontSize: 14, fontWeight: '700', color: '#3F464C' },
  priceBox: {
    marginTop: 12,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: Cat.sun,
    borderRadius: 16,
    padding: 14,
  },
  when: { fontSize: 12.5, color: '#8A8F94', marginTop: 8 },
  storeBox: {
    marginTop: 12,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: Cat.sunLine,
    borderRadius: 16,
    padding: 14,
    gap: 3,
  },
  storeTitle: { fontSize: 16, fontWeight: '900', color: Cat.red2, marginBottom: 2 },
  storeLine: { fontSize: 14, color: Brand.ink },
  link: { color: Cat.red2, fontWeight: '800', fontSize: 14 },
  pol: { marginTop: 8, fontSize: 12.5, color: Brand.muted },
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 14,
    paddingTop: 10,
    backgroundColor: 'rgba(255,253,245,0.97)',
    borderTopWidth: 1,
    borderTopColor: Cat.sunLine,
  },
  want: {
    backgroundColor: Cat.red,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },
  wantDone: { backgroundColor: Brand.success },
  sheetBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 18, gap: 10 },
  sheetTitle: { fontSize: 22, fontWeight: '900', color: Brand.success },
  visit: { fontSize: 15.5, lineHeight: 23, color: Brand.ink },
  visitLink: { color: Cat.red2, fontWeight: '800', textDecorationLine: 'underline' },
  dmNote: { color: '#777', fontSize: 13, marginTop: 10 },
  mapBtn: { backgroundColor: Cat.sun2, borderWidth: 2, borderColor: Cat.red, borderRadius: 14, paddingVertical: 13, alignItems: 'center' },
  mapBtnText: { fontWeight: '900', fontSize: 16, color: Brand.ink },
  okBtn: { backgroundColor: Cat.red, borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  okBtnText: { color: '#fff', fontWeight: '900', fontSize: 16 },
  wantText: { color: '#fff', fontWeight: '900', fontSize: 17 },
});
