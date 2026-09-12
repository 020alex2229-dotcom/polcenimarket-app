import { Image, StyleSheet, Text, View } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Brand } from '@/constants/Colors';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

const brandMark = require('../../assets/images/brand-mark.png');

function HeaderTitle({ title }: { title: string }) {
  return (
    <View style={styles.headerTitle}>
      <Image source={brandMark} style={styles.headerMark} accessibilityLabel="Логотип" />
      <Text style={styles.headerText} numberOfLines={1}>
        {title}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Brand.amberDark,
        tabBarInactiveTintColor: Brand.muted,
        tabBarStyle: {
          backgroundColor: Brand.card,
          borderTopColor: Brand.line,
        },
        headerStyle: { backgroundColor: Brand.cream },
        headerTintColor: Brand.ink,
        headerTitleStyle: { fontWeight: '700', color: Brand.ink },
        headerShadowVisible: false,
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Главная',
          headerTitle: () => <HeaderTitle title="ПолЦены Маркет" />,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="stores"
        options={{
          title: 'Магазины',
          headerTitle: () => <HeaderTitle title="Магазины" />,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="storefront" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="how"
        options={{
          title: '−50%',
          headerTitle: () => <HeaderTitle title="Скидка −50%" />,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="pricetag" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'Ещё',
          headerTitle: () => <HeaderTitle title="Ещё" />,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ellipsis-horizontal-circle" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerMark: {
    width: 28,
    height: 28,
    borderRadius: 6,
  },
  headerText: {
    fontWeight: '700',
    fontSize: 17,
    color: Brand.ink,
  },
});
