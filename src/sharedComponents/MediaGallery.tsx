

import React, {
    useState,
    useRef,
    useEffect,
    forwardRef,
    useImperativeHandle,
    memo,
    useCallback,
  } from 'react';
  import { View, StyleSheet, Dimensions,Text, FlatList } from 'react-native';


  import VideoPlayer from './common/VideoPlayer';

  import AppFastImage from './AppFastImage';
  import { imagesBucketPath, imagesBucketcloudfrontPath } from '../config/constants';



  //const { width: screenWidth } = Dimensions.get('window');

  const MediaGallery = forwardRef((props, ref) => {
    const { mediaItems } = props;
    const screenWidth  =375;
    console.log(mediaItems)
    const playerRef = useRef(null);
    const carouselRef = useRef(null);


  

    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef(null);
  

    const onScroll = (event) => {
 
      const slideIndex = Math.ceil(event.nativeEvent.contentOffset.x / screenWidth);
 
      setActiveIndex(slideIndex);
    };
  






  
  
  
    const getExtension = useCallback((filename) => {
      if (!filename) return '';
      return filename.slice(filename.lastIndexOf('.') + 1).toLowerCase();
    }, []);
  
    const renderCarouselItem = useCallback(
      ({ item }) => {
        const extension = getExtension(item.mediaBlob || item.mediaBlobId);
        const sourceUri = `${imagesBucketcloudfrontPath}${item.mediaBlob || item.mediaBlobId}`;
        
        if (extension !== 'mp4') {
          return (    
            <View style={styles.card}>
         
            <AppFastImage
              uri={sourceUri}
            
            /></View>
          );
        }
        return (
          <View style={styles.card}>
          <VideoPlayer
            ref={playerRef}
            sourceUri={sourceUri}
            vidStyle={styles.videoStyle}
            defaultPaused={false}
          /></View>
        );
      },
      [getExtension]
    );



    return (
   
      <View style={styles.container}>
 <FlatList
        data={mediaItems}
        horizontal
        pagingEnabled
        ref={flatListRef}
        onScroll={onScroll}
        renderItem={renderCarouselItem}
        keyExtractor={(item) =>item.mediaBlobId.toString()}
        showsHorizontalScrollIndicator={false}
        bounces={false}
    

        scrollEventThrottle={16}
        snapToInterval={screenWidth}
        snapToAlignment="center"
        decelerationRate="fast"
        getItemLayout={(data, index) => ({
          length: screenWidth,
          offset: screenWidth * index,
          index,
        })}
        removeClippedSubviews={true}
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
       borderRadius:8,
       paddingHorizontal:5,
       paddingVertical:2,
       display:'flex',
       justifyContent: 'center',
    },
 
    paginationText: {
      color: 'white',
      fontSize: 14,
    },
CenterBox:{
  backgroundColor: 'rgba(0,0,0,0.5)',
  position:'absolute',
  bottom:10,
  left:2,
  borderRadius:8,
  paddingHorizontal:3,
  paddingVertical:2,
  display:'flex',
  justifyContent: 'center',
},


    card: {
  //    backgroundColor: '#764ABC',
  borderRadius: 12,
     // padding: 10,
      justifyContent: 'center',
      alignItems: 'center',
      width: 375,
      // marginHorizontal: 20 ,
      height:200
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
    },
  });
  
  export default memo(MediaGallery);
  