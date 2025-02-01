import React, { useRef, useEffect } from 'react';
import { Animated, Text, View, StyleSheet, Easing } from 'react-native';

const AutomaticHorizontalScroll = ({ text, duration }) => {
  const scrollX = useRef(new Animated.Value(0)).current;

  // Measure the width of the text
  const textWidth = useRef(0);
  const measureText = event => {
    textWidth.current = event.nativeEvent.layout.width;
  };
  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(scrollX, {
        toValue: -textWidth.current,
        duration: duration || 5000, // Default duration is 5 seconds
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [scrollX, duration]);
  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.textContainer,
          { transform: [{ translateX: scrollX }] },
        ]}
      >
        <Text onLayout={measureText} style={styles.text}>
          {text}
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
  },
});

export default AutomaticHorizontalScroll;