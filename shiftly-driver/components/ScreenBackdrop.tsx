import React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '../theme';

export const ScreenBackdrop: React.FC = () => {
  return (
    <View style={styles.backdrop} pointerEvents="none">
      <View style={styles.topWash} />
      <View style={[styles.speedStrip, styles.stripOne]} />
      <View style={[styles.speedStrip, styles.stripTwo]} />
      <View style={[styles.speedStrip, styles.stripThree]} />
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.background,
    overflow: 'hidden',
  },
  topWash: {
    position: 'absolute',
    top: -70,
    left: -24,
    right: -24,
    height: 230,
    backgroundColor: COLORS.accentLight,
    borderBottomLeftRadius: 42,
    borderBottomRightRadius: 42,
    opacity: 0.62,
  },
  speedStrip: {
    position: 'absolute',
    height: 22,
    borderRadius: 3,
    backgroundColor: 'rgba(79, 111, 36, 0.08)',
    transform: [{ rotate: '-7deg' }],
  },
  stripOne: {
    width: 220,
    top: 96,
    right: -90,
  },
  stripTwo: {
    width: 180,
    top: 152,
    left: -86,
  },
  stripThree: {
    width: 280,
    bottom: 96,
    right: -140,
  },
});
