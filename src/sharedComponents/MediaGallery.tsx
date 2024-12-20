import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  memo,
  useCallback,
} from 'react';
import {View, StyleSheet, Dimensions, Text, FlatList} from 'react-native';

import VideoPlayer from './common/VideoPlayer';

import AppFastImage from './AppFastImage';
import {
  imagesBucketPath,
  imagesBucketcloudfrontPath,
} from '../config/constants';
import { FlashList } from '@shopify/flash-list';

const {width: screenWidths} = Dimensions.get('window');

const MediaGallery = forwardRef((props, ref) => {
  const {mediaItems} = props;
  const screenWidth = 375;

  const playerRef = useRef(null);
  const carouselRef = useRef(null);
  const [parentWidth, setParentWidth] = useState(0);

  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  const onScroll = event => {
    const slideIndex = Math.ceil(
      event.nativeEvent.contentOffset.x / screenWidth,
    );

    setActiveIndex(slideIndex);
  };

  const getExtension = useCallback(filename => {
    if (!filename) return '';
    return filename.slice(filename.lastIndexOf('.') + 1).toLowerCase();
  }, []);

  const renderCarouselItem = useCallback(
    ({item}) => {
      const extension = getExtension(item?.mediaBlob || item?.mediaBlobId);
      const sourceUri = `${imagesBucketcloudfrontPath}${
        item?.mediaBlob || item?.mediaBlobId
      }`;
   
      if (extension !== 'mp4') {
        return (
          <View style={[styles.card, {width: parentWidth}]}>
            <AppFastImage
              uri={sourceUri}
              hieght={item.mediaHeight}
              width={item.mediaWidth}
            />
          </View>
        );
      }
      return (
        <View style={[styles.cardV, {width: parentWidth}]}>
          <VideoPlayer
            ref={playerRef}
            sourceUri={sourceUri}
            vidStyle={styles.videoStyle}
            defaultPaused={false}
          />
        </View>
      );
    },
    [getExtension, parentWidth],
  );

  return (
    <View
      style={styles.container}
      onLayout={event => {
        const {width} = event.nativeEvent.layout;
        setParentWidth(width); // Capture the parent component's width
      }}>
      <FlatList
        data={mediaItems}
        horizontal
        pagingEnabled
        ref={flatListRef}
        onScroll={onScroll}
        renderItem={renderCarouselItem}
        keyExtractor={(item, index) => {
          if (item?.mediaBlobId === undefined) {
            return index.toString();
          }
          return item?.mediaBlobId.toString();
        }}
        showsHorizontalScrollIndicator={false}
        bounces={false}

        contentContainerStyle={{ display: 'flex',paddingTop:0}}
        scrollEventThrottle={16}
        snapToInterval={parentWidth}
        snapToAlignment="center"
        decelerationRate="fast"
        getItemLayout={(data, index) => ({
          length: parentWidth,
          offset: parentWidth * index,
          index,
        })}
        windowSize={1}// Improve performance by limiting render window
        maxToRenderPerBatch={1}
        initialNumToRender={1} // Optimize initial load
        removeClippedSubviews={true} // Optimize memory usage
      />
      {/* Pagination */}
      <View style={styles.paginationContainer}>
        <Text style={styles.paginationText}>
          {activeIndex + 1} / {mediaItems.length}
        </Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 2,
    display: 'flex',
    justifyContent: 'center',
  },

  paginationText: {
    color: 'white',
    fontSize: 14,
  },
  CenterBox: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    bottom: 10,
    left: 2,
    borderRadius: 8,
    paddingHorizontal: 3,
    paddingVertical: 2,
    display: 'flex',
    justifyContent: 'center',
  },

  card: {
    display: 'flex',

     //  backgroundColor: '#764ABC',
    borderRadius: 12,

    // padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: screenWidths,
    // marginHorizontal: 20 ,
    // height: 450,
    //  maxHeight: 450,
  },
  cardV: {
    display: 'flex',

      // backgroundColor: '#764ABC',
    // borderRadius: 16,
    // borderColor: '#764ABC',
    // borderWidth:1,
    //  padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: screenWidths,
    // marginHorizontal: 20 ,
     height: screenWidths/1.9,
  },
  container: {
    width: '100%',
    position: 'relative',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  // videoStyle: {
  //   width: 375,
  //   // marginHorizontal: 20 ,borderRadius: 12,
  //  // padding: 10,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   height:200
  // },
  videoStyle: {
    width: '100%',
    height: '100%',
   
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    //padding: 10,
    overflow: 'hidden'
  },
});

export default memo(MediaGallery);
