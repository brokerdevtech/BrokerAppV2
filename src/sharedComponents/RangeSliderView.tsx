import React, {useEffect, useState} from 'react';
import {View, PanResponder, StyleSheet, Text} from 'react-native';
import {Color} from '../styles/GlobalStyles';

const VerticalRangeSlider = ({
  min,
  max,
  minValue,
  maxValue,
  setMinValue,
  setMaxValue,
}) => {
  const [minThumbY, setMinThumbY] = useState(0);
  const [maxThumbY, setMaxThumbY] = useState(0);

  const sliderHeight = 300;
  const thumbRadius = 10;

  useEffect(() => {
    // Calculate initial positions for the thumbs
    const initialMinThumbY = ((minValue - min) / (max - min)) * sliderHeight;
    const initialMaxThumbY = ((maxValue - min) / (max - min)) * sliderHeight;

    setMinThumbY(initialMinThumbY);
    setMaxThumbY(initialMaxThumbY);
  }, [minValue, maxValue]);

  const formatValue = value => {
    const roundedValue = Math.round(value);
    if (roundedValue >= 10000000) {
      return `${(roundedValue / 10000000).toFixed(0)} Cr`;
    } else if (roundedValue >= 100000) {
      return `${(roundedValue / 100000).toFixed(0)} Lakh`;
    } else if (roundedValue >= 1000) {
      return `${(roundedValue / 1000).toFixed(0)} Th`;
    } else {
      return `₹${roundedValue}`;
    }
  };

  const panResponderMin = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      let newMinThumbY = Math.min(
        Math.max(gestureState.dy + minThumbY, 0),
        maxThumbY - thumbRadius * 2,
      );
      setMinThumbY(newMinThumbY);
      const newValue = min + (newMinThumbY / sliderHeight) * (max - min);
      setMinValue(Math.round(newValue));
    },
    onPanResponderRelease: () => {},
  });

  const panResponderMax = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      let newMaxThumbY = Math.max(
        Math.min(gestureState.dy + maxThumbY, sliderHeight),
        minThumbY + thumbRadius * 2,
      );
      setMaxThumbY(newMaxThumbY);
      const newValue = min + (newMaxThumbY / sliderHeight) * (max - min);
      setMaxValue(Math.round(newValue));
    },
    onPanResponderRelease: () => {
      if (maxThumbY >= sliderHeight) {
        setMaxThumbY(sliderHeight);
        setMaxValue(max);
      }
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.ValueCont}>
        <Text style={styles.ValueItem}>{formatValue(minValue)}</Text>
        <Text>-</Text>
        <Text style={styles.ValueItem}>{formatValue(maxValue)}</Text>
      </View>

      <View style={styles.slider}>
        <View style={styles.track} />
        <View
          style={[
            styles.range,
            {
              top: minThumbY,
              height: maxThumbY - minThumbY,
            },
          ]}
        />
        <View
          style={[styles.thumb, {top: minThumbY - thumbRadius}]}
          {...panResponderMin.panHandlers}
        />
        <View
          style={[styles.thumb, {top: maxThumbY - thumbRadius}]}
          {...panResponderMax.panHandlers}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  slider: {
    height: 300,
    width: 40,
    justifyContent: 'center',
  },
  track: {
    width: 6,
    backgroundColor: '#d3d3d3',
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
  },
  range: {
    width: 6,
    backgroundColor: Color.primary,
    position: 'absolute',
    left: '50%',
  },
  thumb: {
    backgroundColor: Color.primary,
    position: 'absolute',
    left: '50%',
    marginLeft: -8,
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'white',
    elevation: 8,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
    shadowRadius: 7.49,
  },
  ValueCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  ValueItem: {
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 10,
  },
});

export default VerticalRangeSlider;
