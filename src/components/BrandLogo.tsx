import { Image, StyleSheet, Text, View, type ImageStyle, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

const mark = require('../../assets/images/brand-mark.png');

type Props = {
  size?: number;
  showLabel?: boolean;
  label?: string;
  labelStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
};

/** Brand shop mark + optional «ПолЦены Маркет» label for headers/hero. */
export function BrandLogo({
  size = 36,
  showLabel = true,
  label = 'ПолЦены Маркет',
  labelStyle,
  style,
  imageStyle,
}: Props) {
  return (
    <View style={[styles.row, style]}>
      <Image
        source={mark}
        style={[{ width: size, height: size, borderRadius: size * 0.18 }, imageStyle]}
        accessibilityLabel="Логотип ПолЦены Маркет"
      />
      {showLabel ? <Text style={[styles.label, labelStyle]}>{label}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontWeight: '800',
    fontSize: 16,
    color: '#182130',
  },
});
