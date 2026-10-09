import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Brand } from '@/constants/Colors';
import { findItem, imageUrl, sendLead, trackEvent, whenLabel } from '@/src/api/catalog';
import { Cat, PriceLine } from '@/src/components/CatalogUI';
import { useOwner } from '@/src/state/owner';

export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { stores } = useOwner();
  const found = id ? findItem(String(id)) : null;
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<string | null>(null);

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
      const msg = await sendLead(item.id);
      setSent(msg);
      Alert.alert('Готово', msg);
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
          onPress={want}
          style={({ pressed }) => [styles.want, (pressed || sending) && { opacity: 0.85 }, sent && styles.wantDone]}
        >
          {sending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.wantText}>{sent ? '✓ Заявка отправлена' : 'Хочу посмотреть'}</Text>
          )}
        </Pressable>
      </View>
    </View>
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
  wantText: { color: '#fff', fontWeight: '900', fontSize: 17 },
});
