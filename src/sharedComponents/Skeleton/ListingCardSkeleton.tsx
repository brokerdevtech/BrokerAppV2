import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Animated} from 'react-native';

const SkeletonLoader = ({style, width, height, borderRadius}) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [opacity]);

  const SkeletonLoader = ({ style, width = 100, height = 20, borderRadius = 4 }) => {
    return (
      <View
        style={[
          styles.skeleton,
          { width, height, borderRadius },
          style
        ]}
      />
    );
  };


  return (
    <Animated.View
      style={[
        styles.skeleton,
        style,
        {opacity, width, height, borderRadius: borderRadius || 0},
      ]}
    />
  );
};

const ListingCardSkeleton = () => {
  return (
    <View style={styles.cardContainer}>
      {/* Image placeholder */}
      <SkeletonLoader
        width={'100%'}
        height={180}
        style={styles.imageSkeleton}
        borderRadius={10}
      />

      {/* Price placeholder */}
      <SkeletonLoader style={styles.priceSkeleton} width={'60%'} height={20} />
      <SkeletonLoader style={styles.priceSkeleton} width={'60%'} height={20} />

      {/* Location placeholder */}
      <View style={styles.row}>
        <SkeletonLoader width={16} height={16} borderRadius={8} />
        <SkeletonLoader
          style={styles.textSkeleton}
          width={'90%'}
          height={16}
          borderRadius={4}
        />
      </View>

      {/* Title placeholder */}
      <View style={styles.row}>
        <SkeletonLoader width={16} height={16} borderRadius={8} />
        <SkeletonLoader
          style={styles.textSkeleton}
          width={'90%'}
          height={16}
          borderRadius={4}
        />
      </View>

      {/* Bottom Action Buttons */}
      <View style={styles.row}>
        <SkeletonLoader
          style={styles.buttonSkeleton}
          width={'45%'}
          height={40}
          borderRadius={8}
        />
        <SkeletonLoader
          style={styles.buttonSkeleton}
          width={'45%'}
          height={40}
          borderRadius={8}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#E1E9EE',
    opacity: 0.5,  // You can adjust this for a lighter or darker shimmer
    borderRadius: 4,
  },
  cardContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 8,
  },
  // skeleton: {
  //   backgroundColor: '#e0e0e0',
  // },
  imageSkeleton: {
    width: '100%',
    height: 180,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  actionSkeleton: {
    marginLeft: 16,
    height: 16,
  },
  priceSkeleton: {
    width: '60%',
    height: 20,
    marginBottom: 12,
  },
  textSkeleton: {
    marginLeft: 10,
    height: 16,
  },
  buttonSkeleton: {
    height: 40,
    marginVertical: 12,
    marginLeft: 10,
  },
});

export default ListingCardSkeleton;
