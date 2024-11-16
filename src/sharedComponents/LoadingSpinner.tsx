import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View, Image } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat } from 'react-native-reanimated';
import { Heading } from '../../components/ui/heading';

const LoadingSpinner = ({
  isVisible,
  message = 'Loading...',
  color = '#007dc5',
  imageSource,
}) => {
  // Shared value for scale animation (pulsing effect)
  const scale = useSharedValue(1);

  // Define the animation style using Reanimated's `useAnimatedStyle`
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  // Start the animation on mount
  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.2, { duration: 500 }), // Increase scale to 1.2 over 500ms
      -1, // Repeat indefinitely
      true // Reverse the animation on each iteration
    );
  }, [scale]);

  if (!isVisible) {
    return null; // If isVisible is false, don't render anything
  }

  return (
    <View style={styles.overlay}>
      <View style={styles.imageWrapper}>
        {/* Pulser animation applied to ActivityIndicator and message */}
        <Animated.View style={[animatedStyle, { alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={color} />
          <Heading color="#333333" fontSize="sm" style={styles.text}>
            {message}
          </Heading>
        </Animated.View>

        {/* Optional image with animation */}
        {imageSource && (
          <Animated.Image
            source={imageSource}
            style={[styles.image, animatedStyle]} // Apply the same pulsing effect to the image
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.80)',
  },
  imageWrapper: {
    backgroundColor: 'transparent',
    borderRadius: 5,
    textAlign: 'center',
    padding: 10,
  },
  text: {
    textAlign: 'center',
  },
  image: {
    width: 100,
    height: 100,
  },
});

export default LoadingSpinner;
