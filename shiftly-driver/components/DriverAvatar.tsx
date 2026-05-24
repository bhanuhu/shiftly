import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS } from '../theme';
import { getInitials } from '../utils/format';

interface DriverAvatarProps {
  name: string;
  photoUri?: string | null;
  size?: number;
  rating?: number;
}

export const DriverAvatar: React.FC<DriverAvatarProps> = ({
  name,
  photoUri,
  size = 56,
  rating,
}) => {
  const iconSize = size * 0.4;

  if (photoUri) {
    return (
      <Image
        source={{ uri: photoUri }}
        style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
      />
    );
  }

  return (
    <View
      style={[
        styles.placeholder,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      <Text style={[styles.initials, { fontSize: iconSize }]}>
        {getInitials(name)}
      </Text>
      {rating !== undefined && (
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>★ {rating}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  placeholder: {
    backgroundColor: COLORS.backgroundCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.borderLight,
  },
  initials: {
    color: COLORS.accent,
    ...FONTS.bold,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  ratingText: {
    color: COLORS.textPrimary,
    fontSize: 10,
    ...FONTS.bold,
  },
});
