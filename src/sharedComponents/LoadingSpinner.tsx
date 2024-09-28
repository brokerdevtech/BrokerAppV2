import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

import Animated from 'react-native-reanimated';
import {Heading} from '../../components/ui/heading';

const LoadingSpinner = ({
  isVisible,
  message = 'Loading...',
  color = '#007dc5',
  imageSource,
}) => {
  if (!isVisible) {
    return null; // If isVisible is false, don't render anything
  }

  return (
    <View style={styles.overlay}>
      <View style={styles.imageWrapper}>
        <Animated.View
          animation="pulse"
          easing="ease-out"
          iterationCount="infinite"
          style={{alignItems: 'center'}}>
          <ActivityIndicator size="large" color={color} />
          <Heading color="#333333" fontSize="sm" style={styles.text}>
            {message}
          </Heading>
        </Animated.View>

        {imageSource && (
          <Animated.Image
            animation="flipInX"
            iterationCount="infinite"
            duration={1000}
            easing="linear"
            source={imageSource}
            style={styles.image}
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
    backgroundColor: 'rgba(255,255,255,0.85)',
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
