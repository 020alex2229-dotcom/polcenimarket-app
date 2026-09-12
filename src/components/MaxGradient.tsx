import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import { Brand } from '@/constants/Colors';

type Props = {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function MaxGradient({ children, style }: Props) {
  return (
    <LinearGradient
      colors={[Brand.maxA, Brand.maxB]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.base, style]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  base: { overflow: 'hidden' },
});
