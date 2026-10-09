import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { Brand } from '@/constants/Colors';
import { Cat } from '@/src/components/CatalogUI';
import { useOwner } from '@/src/state/owner';

/** Скрытый вход владельца: «Ещё» → долгое нажатие на версию, или ссылка polcenimarket://owner?k=… */
export default function OwnerScreen() {
  const params = useLocalSearchParams<{ k?: string }>();
  const { unlocked, unlock, lock } = useOwner();
  const [key, setKey] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function tryUnlock(k: string) {
    setBusy(true);
    setMsg(null);
    try {
      const ok = await unlock(k);
      if (ok) {
        setKey('');
        router.replace('/catalog');
      } else setMsg('Ключ не подошёл. Проверьте и попробуйте ещё раз.');
    } catch (e: any) {
      setMsg(e?.message || 'Нет связи с сервером. Попробуйте позже.');
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (params.k) tryUnlock(String(params.k));
  }, [params.k]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ title: 'Режим владельца' }} />
      {unlocked ? (
        <>
          <Text style={styles.title}>Каталог открыт</Text>
          <Text style={styles.text}>На этом телефоне включён режим владельца: вкладка «Каталог» показывает товары.</Text>
          <Pressable style={styles.btn} onPress={() => router.replace('/catalog')}>
            <Text style={styles.btnText}>Открыть каталог</Text>
          </Pressable>
          <Pressable style={styles.btnGhost} onPress={() => lock()}>
            <Text style={styles.btnGhostText}>Выйти из режима владельца</Text>
          </Pressable>
        </>
      ) : (
        <>
          <Text style={styles.title}>Вход владельца</Text>
          <Text style={styles.text}>Вставьте ключ владельца каталога. Он сохранится только в защищённом хранилище этого телефона.</Text>
          <TextInput
            value={key}
            onChangeText={setKey}
            placeholder="Ключ владельца"
            placeholderTextColor="#9AA0A6"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
            onSubmitEditing={() => tryUnlock(key)}
          />
          {msg ? <Text style={styles.err}>{msg}</Text> : null}
          <Pressable style={[styles.btn, (!key.trim() || busy) && { opacity: 0.6 }]} disabled={!key.trim() || busy} onPress={() => tryUnlock(key)}>
            {busy ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Открыть каталог</Text>}
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 20, backgroundColor: Brand.cream, gap: 12 },
  title: { fontSize: 24, fontWeight: '900', color: Brand.ink, marginTop: 10 },
  text: { fontSize: 15, color: Brand.muted, lineHeight: 21 },
  input: {
    borderWidth: 2,
    borderColor: Cat.sunLine,
    borderRadius: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: Brand.ink,
  },
  err: { color: Cat.red2, fontWeight: '700' },
  btn: { backgroundColor: Cat.red, borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '900', fontSize: 16 },
  btnGhost: { borderWidth: 2, borderColor: Brand.line, borderRadius: 14, paddingVertical: 13, alignItems: 'center' },
  btnGhostText: { color: Brand.ink, fontWeight: '800' },
});
