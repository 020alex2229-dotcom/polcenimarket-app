import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Brand } from '@/constants/Colors';
import { OwnerProvider } from '@/src/state/owner';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <OwnerProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Brand.cream },
          headerTintColor: Brand.ink,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: Brand.cream },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="store/[id]"
          options={{ title: 'Магазин', headerBackTitle: 'Назад' }}
        />
        <Stack.Screen name="product/[id]" options={{ title: 'Товар', headerBackTitle: 'Назад' }} />
        <Stack.Screen name="owner" options={{ title: 'Режим владельца', headerBackTitle: 'Назад' }} />
      </Stack>
    </OwnerProvider>
  );
}
