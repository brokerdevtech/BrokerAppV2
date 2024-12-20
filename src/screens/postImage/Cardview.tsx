/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Dimensions, StyleSheet, Platform} from 'react-native';
import {View} from 'react-native';
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
const {width, height} = Dimensions.get('window');

const CARD_WIDTH = width;
const CARD_HEIGHT = height * 0.4;

const SNAP_TO_INTERVAL = CARD_WIDTH + width * 0.1;

export const CardView = ({
  item,
  index,
  contentOffset,
}: {
  item: any;
  index: number;
  contentOffset: SharedValue<number>;
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * CARD_WIDTH,
      index * CARD_WIDTH,
      (index + 1) * CARD_WIDTH,
    ];

    const outputRange = [-CARD_WIDTH * 0.9, 0, CARD_WIDTH * 0.9];

    const translateX = interpolate(
      contentOffset.value,
      inputRange,
      outputRange,
      Extrapolation.CLAMP,
    );

    return {
      transform: [{translateX}],
    };
  });

  return (
    <View
      style={{
        shadowOffset: {
          height: 10,
          width: 2,
        },
        shadowColor: '#000000',
        shadowOpacity: 0.1,
        padding: 5,
        backgroundColor: '#ffffff',

        marginLeft: 5,
      }}>
      <View
        style={[
          {
            width: CARD_WIDTH - 15,
            height: CARD_HEIGHT,
            overflow: 'hidden',
            backgroundColor: 'white',
            alignItems: 'center',
            borderRadius: 30,
            borderWidth: 0,
            borderColor: 'white',
          },
        ]}>
        <Animated.Image
          {...(Platform.OS === 'ios'
            ? {sharedTransitionTag: `image_${item.id}`}
            : {})}
          source={{uri: item?.uri}}
          style={[styles.image, animatedStyle]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  image: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    resizeMode: 'cover',
  },
  listView: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
