import React from 'react';
import { Image, ImageStyle, StyleSheet, View } from 'react-native';
import { COLORS } from '../theme';

const logoMark = require('../assets/shiftly-logo-main.png');

interface BrandLogoProps {
  size?: number;
  showText?: boolean;
  compact?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 180,
}) => {
  return (
    <View style={styles.container}>
      <Image
        source={logoMark}
        resizeMode="contain"
        style={[
          styles.mark,
          {
            width: size,
            height: size * 0.72,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  mark: {
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
  } as ImageStyle,
});
