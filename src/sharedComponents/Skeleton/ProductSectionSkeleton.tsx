import React, {useRef, useEffect} from 'react';
import {View, StyleSheet, Animated, FlatList} from 'react-native';
import {HStack} from '@/components/ui/hstack';
import ZText from '../../sharedComponents/ZText';
import {colors} from '../../themes';

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

const ProductSectionSkeleton = ({heading, isShowAll}) => {
  const placeholderData = Array(5).fill({});
  console.log(heading, isShowAll, 'peof');
  return (
    <View style={styles.skeletonContainer}>
      {/* Header */}
      <HStack space="md" style={styles.heading}>
        <ZText type={'R18'}>{heading}</ZText>
        {isShowAll && (
          <SkeletonLoader
            style={styles.seeAllSkeleton}
            width={60}
            height={20}
            borderRadius={10}
          />
        )}
      </HStack>

      {/* Horizontal List */}
      <FlatList
        data={placeholderData}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{paddingVertical: 10}}
        renderItem={() => (
          <View style={styles.cardContainer}>
            {/* Image Placeholder */}
            <SkeletonLoader
              width={132}
              height={100}
              style={styles.imageSkeleton}
              borderRadius={12}
            />

            {/* Price Placeholder */}
            <SkeletonLoader
              style={styles.priceSkeleton}
              width={'60%'}
              height={20}
            />

            {/* Location Placeholder */}
            <View style={styles.locationContainer}>
              <SkeletonLoader width={16} height={16} borderRadius={8} />
              <SkeletonLoader
                style={styles.locationTextSkeleton}
                width={'80%'}
                height={16}
              />
            </View>

            {/* Title Placeholder */}
            <SkeletonLoader
              style={styles.titleSkeleton}
              width={'80%'}
              height={18}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonContainer: {
    paddingVertical: 10,
  },
  skeleton: {
    backgroundColor: '#e0e0e0',
  },
  heading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  seeAllSkeleton: {
    marginTop: 4,
  },
  cardContainer: {
    width: 132,
    borderRadius: 12,
    backgroundColor: '#FFF',
    marginHorizontal: 8,
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 4,
  },
  imageSkeleton: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 8,
  },
  priceSkeleton: {
    marginTop: 10,
    marginHorizontal: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 4,
  },
  locationTextSkeleton: {
    marginLeft: 4,
  },
  titleSkeleton: {
    marginTop: 8,
    marginHorizontal: 10,
    marginBottom: 10,
  },
});

export default ProductSectionSkeleton;
