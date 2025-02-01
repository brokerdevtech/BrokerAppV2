import React, { useState } from 'react';
import { Button, StyleSheet, View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useFrameCallback,
  useSharedValue,
} from 'react-native-reanimated';

const MeasureElement = ({ onLayout, children }) => (
  <Animated.ScrollView horizontal style={marqueeStyles.hidden} pointerEvents="box-none">
    <View onLayout={(ev) => onLayout(ev.nativeEvent.layout.width)}>{children}</View>
  </Animated.ScrollView>
);

const TranslatedElement = ({ index, children, offset, childrenWidth }) => {
  const animatedStyle = useAnimatedStyle(() => ({
    left: index * childrenWidth, // Place clones sequentially
    transform: [{ translateX: -offset.value }],
  }));

  return <Animated.View style={[styles.animatedStyle, animatedStyle]}>{children}</Animated.View>;
};

const getIndicesArray = (length) => Array.from({ length }, (_, i) => i);

const Cloner = ({ count, renderChild }) => <>{getIndicesArray(count).map(renderChild)}</>;

const ChildrenScroller = ({ duration, speedFactor, childrenWidth, parentWidth, children }) => {
  const offset = useSharedValue(childrenWidth); // Start from rightmost position
  const speed = useSharedValue(-1); // Always moving left

  useFrameCallback((frame) => {
    const deltaTime = frame.timeSincePreviousFrame ?? 1;
    offset.value += (speed.value * deltaTime * childrenWidth * speedFactor) / duration;

    if (offset.value < 0) {
      offset.value = childrenWidth; // Reset to rightmost when fully off-screen
    }
  }, true);

  const count = Math.round(parentWidth / childrenWidth) + 2;
  const renderChild = (index) => (
    <TranslatedElement key={`clone-${index}`} index={index} offset={offset} childrenWidth={childrenWidth}>
      {children}
    </TranslatedElement>
  );

  return <Cloner count={count} renderChild={renderChild} />;
};

const Marquee = ({ duration = 2000, speedFactor = 1, children, style }) => {
  const [parentWidth, setParentWidth] = useState(0);
  const [childrenWidth, setChildrenWidth] = useState(0);

  return (
    <View style={style} onLayout={(ev) => setParentWidth(ev.nativeEvent.layout.width)} pointerEvents="box-none">
      <View style={marqueeStyles.row} pointerEvents="box-none">
        <MeasureElement onLayout={setChildrenWidth}>{children}</MeasureElement>

        {childrenWidth > 0 && parentWidth > 0 && (
          <ChildrenScroller duration={duration} speedFactor={speedFactor} parentWidth={parentWidth} childrenWidth={childrenWidth}>
            {children}
          </ChildrenScroller>
        )}
      </View>
    </View>
  );
};

const marqueeStyles = StyleSheet.create({
  hidden: { opacity: 0, zIndex: -1 },
  row: { flexDirection: 'row', overflow: 'hidden' },
});

function MarqueeScreen() {
  const [speed, setSpeed] = useState(0.2); // Default speed factor

  return (
    <View style={styles.container}>
      <View style={styles.safeArea}>
        <Marquee speedFactor={speed}>
          <Text style={styles.text}>This is the first marquee text. Adjust speed dynamically.</Text>
        </Marquee>

        {/* Speed Control */}
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: 'red',
  },
  safeArea: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  animatedStyle: {
    position: 'absolute',
  },
  controls: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  speedText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default MarqueeScreen;
