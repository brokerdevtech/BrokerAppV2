import {imagesBucketcloudfrontPath} from '../config/constants';
import React, {useState, useRef} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Text,
} from 'react-native';

const {width, height} = Dimensions.get('window');
const PreviewImageCarousel = ({
  images,
  autoPlay = true,
  autoPlayInterval = 3000,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);
  const autoPlayRef = useRef(null);

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

  // Handle auto play
  React.useEffect(() => {
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
  const handleViewableItemsChanged = React.useRef(({viewableItems}) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const renderItem = ({item}) => {
    const imageUri = item.mediaBlob
      ? `${imagesBucketcloudfrontPath}${item.mediaBlob}`
      : `${imagesBucketcloudfrontPath}${item.mediaBlobId}`;
    // Render each image item
    return (
      <View style={[styles.slide, {width, height}]}>
        <Image
          source={{
            uri: imageUri,
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
      <Text style={styles.arrowText}>{'<'}</Text>
    </TouchableOpacity>
  );

  const RightArrow = () => (
    <TouchableOpacity
      style={[styles.arrow, styles.rightArrow]}
      onPress={scrollToNextImage}>
      <Text style={styles.arrowText}>{'>'}</Text>
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
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        windowSize={3}
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
    bottom: 40,
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
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    transform: [{translateY: -20}],
  },
  leftArrow: {
    left: 10,
  },
  rightArrow: {
    right: 10,
  },
  arrowText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default PreviewImageCarousel;
