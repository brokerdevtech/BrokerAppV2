import React, {useRef, useEffect} from 'react';
import {View, StyleSheet, Animated, FlatList} from 'react-native';
import {HStack} from '@/components/ui/hstack';
import ZText from '../ZText';
import {colors} from '../../themes';

const SkeletonLoader = ({ style, width, height, borderRadius = 0 }) => {
  return (
    <View
      style={[
        styles.skeleton,
        style,
        { width, height, borderRadius },
      ]}
    />
  );
};

 

const RecommendedBrokersSkeleton = ({}) => {
  const placeholderData = Array(5).fill({});

  return (
    <View style={styles.skeletonContainer}>
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
              width={60}
              height={60}
              style={styles.imageSkeleton}
              borderRadius={50}
            />
            <SkeletonLoader
              style={styles.priceSkeleton}
              width={'60%'}
              height={10}
            />
            {/* Price Placeholder */}
            <SkeletonLoader
              style={styles.priceSkeleton}
              width={'80%'}
              height={20}
            />

            {/* Location Placeholder */}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#e0e0e0', // Light gray as a placeholder
    opacity: 0.5, // Adjust this to simulate a subtle shimmer effect
  },
  skeletonContainer: {
    paddingVertical: 10,
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
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    width: 120,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
    alignItems: 'center',
    marginRight: 5,
  },
  imageSkeleton: {
    // borderTopLeftRadius: 12,
    // borderTopRightRadius: 12,
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

export default RecommendedBrokersSkeleton;
