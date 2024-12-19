import React from 'react';
import {StyleSheet, View} from 'react-native';

const CircularSkeleton = ({size = 60}) => {
  return (
    <View
      style={[
        styles.skeleton,
        {width: size, height: size, borderRadius: size / 2},
      ]}
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#e0e0e0',
    opacity: 0.5,
  },
});

export default CircularSkeleton;
