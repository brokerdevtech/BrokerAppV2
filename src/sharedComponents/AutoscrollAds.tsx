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
const {width: screenWidths} = Dimensions.get('window');
const AutoscrollAds: React.FC = ({onPressBottomSheet}) => {
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
      await Adexecute(cityToShow);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getList();
  }, [cityToShow]);

  useEffect(() => {
   console.log(Addata);
  }, [Addata]);

  useEffect(() => {
    if (Addata?.length > 1) {
      const interval = setInterval(() => {
        const nextIndex = (activeIndex + 1) % Addata?.length;
        flatListRef.current?.scrollToIndex({index: nextIndex, animated: true});
        setActiveIndex(nextIndex);
      }, 6000);

      return () => clearInterval(interval);
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
      await AdsloadMore(cityToShow);
    }
  };
  // const loadMorePage = async () => {
  //   if (!isInfiniteLoading && \\\) {
  //     await AdsloadMore(fetchAdApi, cityToShow, 3);
  //   }
  // };

  const renderCarouselItem = useCallback(
    ({item}) => {
      console.log("renderCarouselItem")
      console.log(item);
      const extension = getExtension(item?.postMedias[0]?.mediaBlobId);
      const sourceUri = `${imagesBucketcloudfrontPath}${
        item?.postMedias[0].mediaBlob || item?.postMedias[0]?.mediaBlobId
      }`;
      // console.log(item?.mediaBlob);
      if (item?.postMedias[0]?.mediaBlobId === '') {
        return (
          <TouchableOpacity onPress={() => handleAdsPress(item)}>
            <View
              style={[
                localStyles.card,
                {
                  width: parentWidth,
                  backgroundColor: Color.primary,
                  paddingHorizontal: 25,
                  paddingVertical: 25,
                  height: 250,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}>
              <ZText
                type={'R20'}
                style={{flex: 1, flexWrap: 'wrap', color: 'white'}}>
                {item.marqueueText || 'Default Text'}
              </ZText>
            </View>
          </TouchableOpacity>
        );
      }

      if (extension !== 'mp4') {
        return (
          <View style={[localStyles.card, {width: parentWidth}]}>
            <AdsBannerIMage
              uri={sourceUri}
              onPress={() => handleAdsPress(item)}
            />
          </View>
        );
      }

      return (
        <View style={[localStyles.card, {width: parentWidth}]}>
          <AdsVideoPlayer
            ref={playerRef}
            sourceUri={sourceUri}
            vidStyle={localStyles.videoStyle}
            defaultPaused={true}
            onPress={() => handleAdsPress(item)}
          />
        </View>
      );
    },
    [getExtension, parentWidth],
  );

  const renderPaginationDots = () => {
    const progressAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(progressAnim, {
        toValue: 100,
        duration: 3000,
        useNativeDriver: false,
      }).start();

      return () => progressAnim.setValue(0);
    }, [activeIndex]);

    return (
      <View style={localStyles.paginationContainer}>
        {Addata?.map((_, index) => {
          if (index === activeIndex) {
            return (
              <View key={index} style={localStyles.paginationTrack}>
                <Animated.View
                  style={[
                    localStyles.paginationProgressBar,
                    {
                      width: progressAnim.interpolate({
                        inputRange: [0, 100],
                        outputRange: [0, 50],
                      }),
                    },
                  ]}
                />
              </View>
            );
          }

          return <View key={index} style={localStyles.paginationDotInactive} />;
        })}
      </View>
    );
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
          ListFooterComponent={
            isInfiniteLoading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : null
          }
          contentContainerStyle={{marginBottom: 30}}
        />
      ) : (
        <LoadingSpinner />
      )}

      {renderPaginationDots()}
    </View>
  );
};

export default AutoscrollAds;

const localStyles = StyleSheet.create({
  rootContainer: {
    // ...styles.ph10,
    // ...styles.pb10,
    flex: 0.8,
    width: '100%',
    // height: 00,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: moderateScale(10),
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
  card: {
    display: 'flex',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: screenWidths,
    paddingHorizontal: 10,
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

    // backgroundColor: '#764ABC',
    borderRadius: 12,

    // padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: screenWidths,
    // marginHorizontal: 20,
    // marginLeft: 10,
    // height: screenWidths - 40,q
    paddingHorizontal: 10,
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

export default AutoscrollAds;
