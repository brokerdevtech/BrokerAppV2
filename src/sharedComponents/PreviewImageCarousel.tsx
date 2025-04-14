/* eslint-disable react/no-unstable-nested-components */
import {imagesBucketcloudfrontPath} from '../config/constants';
import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Text,
} from 'react-native';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  Icon,
} from '../../components/ui/icon';

const {width, height} = Dimensions.get('window');
const PreviewImageCarousel = ({
  images,
  initialIndex = 0, // New prop to specify which image to show first
  autoPlay = true,
  autoPlayInterval = 3000,
}) => {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const flatListRef = useRef(null);
  const autoPlayRef = useRef(null);
  const initialScrollDone = useRef(false);

  // Get screen dimensions for responsive sizing
  const {width, height} = Dimensions.get('window');

  // Function to scroll to next image
  const scrollToNextImage = () => {
    if (images.length <= 1) return;

    const nextIndex = (activeIndex + 1) % images.length;
    flatListRef.current?.scrollToIndex({
      animated: true,
      index: nextIndex,
    });
    setActiveIndex(nextIndex);
  };

  // Initialize with the initial index provided from parent
  useEffect(() => {
    if (
      flatListRef.current &&
      initialIndex > 0 &&
      !initialScrollDone.current &&
      images.length > initialIndex
    ) {
      // Use a small timeout to ensure the FlatList has rendered
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          animated: false, // Don't animate initial positioning
          index: initialIndex,
        });
        initialScrollDone.current = true;
      }, 100);
    }
  }, [initialIndex, images.length]);

  // Handle auto play
  useEffect(() => {
    if (autoPlay && images.length > 1) {
      autoPlayRef.current = setInterval(scrollToNextImage, autoPlayInterval);

      return () => {
        if (autoPlayRef.current) {
          clearInterval(autoPlayRef.current);
        }
      };
    }
  }, [activeIndex, autoPlay, autoPlayInterval, images.length]);

  // Handler for when scroll ends
  const handleViewableItemsChanged = useRef(({viewableItems}) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  // Define getItemLayout to help FlatList calculate positions
  const getItemLayout = (data, index) => ({
    length: width,
    offset: width * index,
    index,
  });

  // Handle scroll failure
  const handleScrollToIndexFailed = info => {
    const wait = new Promise(resolve => setTimeout(resolve, 500));
    wait.then(() => {
      flatListRef.current?.scrollToIndex({
        index: info.index,
        animated: true,
      });
    });
  };

  const renderItem = ({item}) => {
    // Render each image item
    return (
      <View style={[styles.slide, {width, height}]}>
        <Image
          source={{
            uri: item,
          }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    );
  };

  // Arrow button components
  const LeftArrow = () => (
    <TouchableOpacity
      style={[styles.arrow, styles.leftArrow]}
      onPress={() => {
        const prevIndex =
          activeIndex === 0 ? images.length - 1 : activeIndex - 1;
        flatListRef.current?.scrollToIndex({
          animated: true,
          index: prevIndex,
        });
      }}>
      {/* <Text style={styles.arrowText}>{'<'}</Text> */}
      <Icon as={ChevronLeftIcon} color="white" size="xxl" />
    </TouchableOpacity>
  );

  const RightArrow = () => (
    <TouchableOpacity
      style={[styles.arrow, styles.rightArrow]}
      onPress={scrollToNextImage}>
      <Icon as={ChevronRightIcon} color="white" size="xxl" />
    </TouchableOpacity>
  );

  // Dots indicator
  const Pagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {images.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.paginationDot,
              index === activeIndex ? styles.paginationDotActive : {},
            ]}
            onPress={() => {
              flatListRef.current?.scrollToIndex({
                animated: true,
                index,
              });
            }}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={images}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        initialNumToRender={Math.min(images.length, initialIndex + 1)}
        maxToRenderPerBatch={1}
        windowSize={3}
        getItemLayout={getItemLayout}
        onScrollToIndexFailed={handleScrollToIndexFailed}
      />

      {images.length > 1 && <LeftArrow />}
      {images.length > 1 && <RightArrow />}
      {images.length > 1 && <Pagination />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width * 0.9, // Use 90% of the screen width
    height: height * 0.7, // Use 70% of the screen height
    alignSelf: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  paginationDotActive: {
    backgroundColor: 'white',
  },
  arrow: {
    position: 'absolute',
    top: '50%',
    width: 60,
    height: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    transform: [{translateY: -20}],
  },
  leftArrow: {
    left: 5,
  },
  rightArrow: {
    right: 5,
  },
  arrowText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default PreviewImageCarousel;
