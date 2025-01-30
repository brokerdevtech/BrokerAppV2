import React, {useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

const Marquee = ({duration = 5000, texts = [], style}) => {
  const [parentWidth, setParentWidth] = useState(0);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const offset = useSharedValue(parentWidth);

  // Update the animation whenever the parent width or current text changes
  React.useEffect(() => {
    if (parentWidth > 0) {
      offset.value = withTiming(-parentWidth, {duration}, () => {
        // Switch to the next text and reset the offset
        runOnJS(setCurrentTextIndex)((currentTextIndex + 1) % texts.length);
        offset.value = parentWidth;
      });
    }
  }, [parentWidth, currentTextIndex]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: offset.value}],
    };
  });

  return (
    <View
      style={[styles.container, style]}
      onLayout={ev => {
        setParentWidth(ev.nativeEvent.layout.width);
      }}>
      <Animated.View style={[animatedStyle, {flexDirection: 'row'}]}>
        <Text style={styles.text}>{texts[currentTextIndex]}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    height: 40, // Adjust height as needed
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    whiteSpace: 'nowrap',
  },
});

export default function MarqueeTextList() {
  const texts = [
    'Sample Text 1 Sample Text 1 Sample Text 1',
    'Sample Text 2 Sample Text 2 Sample Text 2',
    'Sample Text 3 Sample Text 3 Sample Text 3',
    'Sample Text 4 Sample Text 4 Sample Text 4',
  ];

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Marquee texts={texts} duration={8000} style={{width: '100%'}} />
    </View>
  );
}
