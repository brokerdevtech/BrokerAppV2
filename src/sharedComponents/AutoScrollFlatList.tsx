import React, { useState, useEffect } from "react";
import { View, Text, Animated, Easing, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const MarqueeTextItems = ({ items, speed = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const animatedValue = new Animated.Value(width); // Start from the right

  useEffect(() => {
    const startAnimation = () => {
      animatedValue.setValue(width);
      Animated.timing(animatedValue, {
        toValue: -width, // Move to the left
        duration: speed,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
        startAnimation();
      });
    };

    startAnimation();
  }, [currentIndex]);

  return (
    <View style={{ overflow: "hidden", width }}>
      <Animated.Text
        style={{
          transform: [{ translateX: animatedValue }],
          fontSize: 18,
          fontWeight: "bold",
        }}
      >
        {items[currentIndex]}
      </Animated.Text>
    </View>
  );
};

export default MarqueeTextItems;