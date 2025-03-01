/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import ZSafeAreaView from './ZSafeAreaView';
import LoadingSpinner from './LoadingSpinner';
import {
  imagesBucketcloudfrontPath,
  imagesBucketPath,
  moderateScale,
} from '../config/constants';
import {styles} from '../themes';
import {fetchAdApi} from '../../BrokerAppCore/services/new/dashboardService';
import {useApiPagingWithtotalRequest} from '../hooks/useApiPagingWithtotalRequest';
import {RootState} from '../../BrokerAppCore/redux/store/reducers';
import AppFastImage from './AppFastImage';
import VideoPlayer from './common/VideoPlayer';
import ZText from './ZText';
import AdsBannerIMage from './AdsBannerIMage';
import {Color} from '../styles/GlobalStyles';
import AdsVideoPlayer from './common/AdsVideoPLayer';
import CommentBottomSheet from './CommentBottomSheet';
import EnquiryBottomSheet from './EnquiryForm';
import NoDataFoundScreen from './NoDataFoundScreen';
import { useAnimatedStyle, useFrameCallback, useSharedValue } from 'react-native-reanimated';
const {width: screenWidths} = Dimensions.get('window');

const screenWidth = Dimensions.get('window').width;


const MarqueeText = ({index, text, duration = 5000, onComplete}) => {
  const translateX = useRef(new Animated.Value(screenWidth)).current;
  const [textWidth, setTextWidth] = useState(0);

  useEffect(() => {
    if (textWidth > 0) {
      const animation = Animated.timing(translateX, {
        toValue: -textWidth,
        duration,
        useNativeDriver: true,
      });

      animation.start(() => {
        onComplete?.(index);
        translateX.setValue(screenWidth);
      });

      return () => animation.stop();
    }
  }, [textWidth, duration, onComplete, translateX]);

  return (
    <View style={localStyles.marqueeContainer}>
      <Animated.Text
      numberOfLines={1} // Ensures the text stays in one line
      ellipsizeMode="clip" // Prevents truncation or ellipsis
        style={[localStyles.marqueeText, {transform: [{translateX}]}]}
        onLayout={(e) => setTextWidth(e.nativeEvent.layout.width)}>
        {text}
      </Animated.Text>
    </View>
  );
};

const AutoscrollAdsText: React.FC = ({onPressBottomSheet}) => {
  const colors = useSelector(state => state.theme.theme);
  const AppLocation = useSelector((state: RootState) => state.AppLocation);
  const cityToShow = AppLocation.City;
  const navigation = useNavigation();
  const [isInfiniteLoading, setInfiniteLoading] = useState(false);
  const [parentWidth, setParentWidth] = useState(0);
  const [adsToshow, setAdsToshow] = useState([]);
  const flatListRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const playerRef = useRef(null);

  const {
    data: Addata,
    status: Adstatus,
    execute: Adexecute,
    currentPage,
    hasMore,
    loadMore: AdsloadMore,
    totalPages,
  } = useApiPagingWithtotalRequest(fetchAdApi, setInfiniteLoading, 3);

  const getList = async () => {
    try {
      await Adexecute(2, cityToShow);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getList();
  }, [cityToShow]);

  useEffect(() => {
 
  }, [Addata]);

  useEffect(() => {
    if (Addata?.length > 1) {
      // const interval = setInterval(() => {
      //   const nextIndex = (activeIndex + 1) % Addata?.length;
      //   flatListRef.current?.scrollToIndex({index: nextIndex, animated: true});
      //   setActiveIndex(nextIndex);
      // }, 6000);

      // return () => clearInterval(interval);
    }
  }, [Addata, activeIndex]);

  const getExtension = useCallback(filename => {
    if (!filename) return '';
    return filename.slice(filename.lastIndexOf('.') + 1).toLowerCase();
  }, []);

  const handleAdsPress = item => {
    if (item?.actionType === 1) {
      navigation.navigate('ItemDetailScreen', {
        postId: item.postId,
        postType: item.categoryId == 2 ? 'Car/Post' : 'Post',
      });
    } else if (item?.actionType == 2) {
      navigation.navigate('EnquiryForm', {item});
    } else {
      if (item?.targetUrl) {
        Linking.openURL(item.targetUrl).catch(err =>
          console.error('Error opening URL:', err),
        );
      }
    }
  };

  const loadMorepage = async () => {
    if (!isInfiniteLoading) {
      await AdsloadMore(2, cityToShow);
    }
  };
  // const loadMorePage = async () => {
  //   if (!isInfiniteLoading && \\\) {
  //     await AdsloadMore(fetchAdApi, cityToShow, 3);
  //   }
  // };
  const handleAdCompletion = (index) => {
 //   console.log(index);
    if (index < Addata?.length - 1) {
    flatListRef.current?.scrollToIndex({index: index + 1, animated: true});
    setActiveIndex(index + 1);
  }
    // if (index < adsToShow.length - 1) {
    //   flatListRef.current?.scrollToIndex({index: index + 1, animated: true});
    // } else if (!isFetchingMore) {
    //   setFetchingMore(true);
    //   loadMoreAds().finally(() => setFetchingMore(false));
    // }
  };
  // const renderCarouselItem = useCallback(
  //   ({item,index}) => {
     
  //      console.log(index);
    
  //       return (
  //         <TouchableOpacity
  //           onPress={() => handleAdsPress(item)}
  //           style={{
           
  //             alignItems: 'center',
  //             justifyContent: 'center',
  //           }}>
  //           <View
  //             style={[
  //               localStyles.card,
  //               {
  //                 width: parentWidth,
  //                 backgroundColor: Color.primary,
  //                 // paddingHorizontal: 25,
  //                 // paddingVertical: 25,
  //                  height: 50,
  //                 alignItems: 'center', // Center children horizontally
  //                 justifyContent: 'center', // Center children vertically
  //                 flex: 1,
  //               },
  //             ]}>
  //               <MarqueeText index={index} text="This is a sample marquee text scrolling left to right!" duration={3000}  onComplete={() => handleAdCompletion(index)}/>
  //                 {/* <Marquee text={item.marqueueText} onComplete={() => handleAdCompletion(index)} /> */}
  //             {/* <ZText
  //               type={'R20'}
  //               style={{
  //                 color: 'white', // Text color
  //                 textAlign: 'center', // Center text horizontally
  //               }}>
  //               {item.marqueueText || 'Default Text'}
  //             </ZText> */}
  //           </View>
  //         </TouchableOpacity>
  //       );
  //     }

    
  //   ,[parentWidth,index],
  // );
  const renderCarouselItem = ({item, index}) => {
    console.log('Rendering item at index:', index);
  
    return (
      <TouchableOpacity
        onPress={() => handleAdsPress(item)}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={[
            localStyles.card,
            {
              width: parentWidth,
              backgroundColor: Color.primary,
              
              alignItems: 'center', // Center children horizontally
              justifyContent: 'center', // Center children vertically
              flex: 1,
              overflow: 'hidden',
            },
          ]}>
          <MarqueeText
            index={index}
            text={item.marqueueText}
            duration={10000}
            onComplete={() => handleAdCompletion(index)}
          />
        </View>
      </TouchableOpacity>
    );
  };
  const renderPaginationDots = () => {
    const progressAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      // Reset animation on every activeIndex change
      progressAnim.setValue(0);

      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 6000, // Match the auto-scroll interval (6 seconds)
        useNativeDriver: false,
      }).start();

      return () => {
        progressAnim.stopAnimation();
      };
    }, [activeIndex]); // Re-run animation when the active index changes
    const visibleDots = Addata?.slice(
      Math.max(0, activeIndex - 2), // Show 2 dots before the active index
      Math.min(Addata.length, activeIndex + 3), // Show 2 dots after the active index
    );
    return (
      <View style={localStyles.paginationContainer}>
        {visibleDots?.map((_, index) => {
          const isActive = index + Math.max(0, activeIndex - 2) === activeIndex;

          if (isActive) {
            return (
              <View key={index} style={localStyles.paginationTrack}>
                <Animated.View
                  style={[
                    localStyles.paginationProgressBar,
                    {
                      width: progressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 50], // Animate from 0 to full width
                      }),
                    },
                  ]}
                />
              </View>
            );
          }

          // Inactive dot for non-active items
          return <View key={index} style={localStyles.paginationDotInactive} />;
        })}
      </View>
    );
  };
  const onMomentumScrollEnd = event => {
    const newIndex = Math.round(
      event.nativeEvent.contentOffset.x / screenWidths,
    );
    setActiveIndex(newIndex);
  };

  return (
    <View
      style={localStyles.rootContainer}
      onLayout={event => {
        const {width} = event.nativeEvent.layout;
        setParentWidth(width);
      }}>
      {Addata?.length > 0 ? (
        <FlatList
          data={Addata}
          horizontal
          pagingEnabled
          ref={flatListRef}
          renderItem={renderCarouselItem}
          keyExtractor={(item, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          snapToInterval={parentWidth}
          snapToAlignment="center"
          decelerationRate="fast"
          onEndReachedThreshold={0.6}
          onEndReached={loadMorepage}
          onMomentumScrollEnd={onMomentumScrollEnd}
          ListFooterComponent={
            isInfiniteLoading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : null
          }
        
          showsVerticalScrollIndicator={false}
         
        />
      ) : (
        <LoadingSpinner />
      )}

      {/* {renderPaginationDots()} */}
    </View>
  );
};

//export default AutoscrollAdsText;

const localStyles = StyleSheet.create({
  marqueeContainer: {
    overflow: 'hidden',
    width: screenWidth , // Adjust width as needed
    height: 50,
    justifyContent: 'center',
 
  },
  marqueeTextWrapper: {
    flexDirection: 'row',
  },
  marqueeText: {
    fontSize: 18,
    color: 'white',
    fontWeight:400,

  },
  rootContainer: {
    // ...styles.ph10,
    // ...styles.pb10,
  
    width: '100%',
     height: 50,
     maxHeight:50,
    borderColor:'red',
    borderBottomWidth:1
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
   
  },
  adItem: {
    width: 200,
    // height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginHorizontal: 10,
  },
  paginationContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    alignItems: 'center',
  },
  paginationTrack: {
    width: 50,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    marginHorizontal: 4,
    overflow: 'hidden',
  },
  paginationProgressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#000',
  },
  paginationDotInactive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    marginHorizontal: 4,
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
  
    justifyContent: 'center',
    alignItems: 'center',
    width: screenWidths,
    // backgroundColor: '#764ABC',
    //borderRadius: 12,

    // padding: 10,
    
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
  },
});

export default AutoscrollAdsText;
