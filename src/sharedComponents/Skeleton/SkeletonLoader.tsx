import React, {useEffect, useRef} from 'react';
import {View, Animated, StyleSheet} from 'react-native';

const SkeletonLoader = ({width, height, borderRadius = 8}) => {
  // Animated value to control the shimmer effect
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [shimmerAnim]);

  // Interpolate shimmer animation
  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <View style={[styles.skeletonContainer, {width, height, borderRadius}]}>
      <Animated.View
        style={[
          styles.shimmerEffect,
          {
            transform: [{translateX: shimmerTranslate}],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonContainer: {
    backgroundColor: '#e0e0e0', // Light grey background for skeleton
    overflow: 'hidden',
  },
  shimmerEffect: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Light shimmer color
  },
});

export default SkeletonLoader;
