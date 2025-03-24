import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, Dimensions, ActivityIndicator, FlatList} from 'react-native';
import Video from 'react-native-video';
import {fetchInstagramVideos} from '../../../BrokerAppCore/services/new/podcastService';
import {Padding} from '@/styles/GlobalStyles';

const {height: screenHeight, width} = Dimensions.get('window');

const FACEBOOK_API_URL = 'https://graph.facebook.com/v22.0';
const ACCOUNT_ID = '17841458791630720'; // Replace with your account ID
const ACCESS_TOKEN =
  'EAAYJ6U4AIAQBO4UCcbd5jZBPioEGZBdZBPrAKEfkiggHmMA5UZBAAX5QA3mdo7oGmy05TUxz9vnFWzqf4GPbNPNWKcvWrgOU48LyGKJ2aEGCUPmIGvCSkP4NvWSxMpWKp2d8VyOX2gZAet2K1dZA9XOb5uWhdU92zUab6LJDXA96ssqM7zdSXFmgZDZD'; // Replace with your token
// Define approximate header and tab heights
const HEADER_HEIGHT = 60; // Adjust as per your UI
const TAB_BAR_HEIGHT = 60; // Adjust based on your bottom tab bar
const VIDEO_HEIGHT = screenHeight - HEADER_HEIGHT - TAB_BAR_HEIGHT; // Available height for video

const InstagramReels = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextPage, setNextPage] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const onVideoEndRef = useRef(false);
  // const [videos, setVideos] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  // Fetch Instagram videos
  const fetchVideos = async (
    url = `${FACEBOOK_API_URL}/${ACCOUNT_ID}/tags?fields=id,media_type,media_url,permalink,timestamp&access_token=${ACCESS_TOKEN}&limit=5`,
  ) => {
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        console.error('Error fetching data: ', data.error);
        return;
      }

      // Filter only VIDEO items
      const filteredVideos = data.data.filter(
        item => item.media_type === 'VIDEO',
      );

      setVideos(prevVideos => [...prevVideos, ...filteredVideos]);
      setNextPage(data.paging?.next || null);
      setLoading(false);
      setLoadingMore(false);
    } catch (error) {
      console.error('Fetch error: ', error);
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const fetchInstagram = async () => {
    await fetchInstagramVideos(
      'EAAYJ6U4AIAQBO4UCcbd5jZBPioEGZBdZBPrAKEfkiggHmMA5UZBAAX5QA3mdo7oGmy05TUxz9vnFWzqf4GPbNPNWKcvWrgOU48LyGKJ2aEGCUPmIGvCSkP4NvWSxMpWKp2d8VyOX2gZAet2K1dZA9XOb5uWhdU92zUab6LJDXA96ssqM7zdSXFmgZDZD',
      '17841458791630720',
      (newVideos, isFirstBatch) => {
        setVideos(prevVideos =>
          isFirstBatch ? newVideos : [...prevVideos, ...newVideos],
        );
        setLoading(false);
      },
    );
    // await fetchInstagramVideos(
    //   "EAAYJ6U4AIAQBO6GxSVXZB9ZBS6x4Y10WsCzGVkBIYRjybfzfKFwSlZC1VijrxqWxnBthy8PmZArvhYAedo3l933GnOwy8YgAeZCg5eGIBJB7lzKASB6VvWfvAL3YafR7A2zSgauGcmIUh97uBfRu9czLGJjlYxKptarxk1n8GRwZAybqT0YO8MhgZDZD",
    //   "17841458791630720",
    //   (newVideos, isFirstBatch) => {
    //     setVideos((prevVideos) => isFirstBatch ? newVideos : [...prevVideos, ...newVideos]);
    //     setLoading(false);
    //   }
    // );
    // const result:any = await fetchInstagramVideos("EAAYJ6U4AIAQBO6GxSVXZB9ZBS6x4Y10WsCzGVkBIYRjybfzfKFwSlZC1VijrxqWxnBthy8PmZArvhYAedo3l933GnOwy8YgAeZCg5eGIBJB7lzKASB6VvWfvAL3YafR7A2zSgauGcmIUh97uBfRu9czLGJjlYxKptarxk1n8GRwZAybqT0YO8MhgZDZD","17841458791630720");
    // if (result.length > 0) {
    //   console.log(result);
    //   setVideos(result);
    //   setLoading(false);
    //   return result;
    // }
  };
  const loadMoreVideos = () => {
    console.log('Loading more videos');
    if (nextPage && !loadingMore) {
      setLoadingMore(true);
      fetchVideos(nextPage);
    }
  };
  useEffect(() => {
    fetchVideos();
  }, []);
  const handleVideoEnd = () => {
    console.log('Video Ended');
    if (currentIndex < videos.length - 1) {
      onVideoEndRef.current = true; // Prevents onMomentumScrollEnd from interfering
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);

      flatListRef.current?.scrollToIndex({index: nextIndex, animated: true});
    }
    setTimeout(() => {
      onVideoEndRef.current = false; // Reset flag after transition
    }, 500); // Adjust delay if needed
  };
  const renderItem = useCallback(
    ({item, index}) => (
      <View
        style={{
          height: VIDEO_HEIGHT,
          width,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {currentIndex == index && (
          <Video
            source={{uri: item.media_url}}
            style={{width, height: VIDEO_HEIGHT}} // Responsive aspect ratio
            resizeMode="cover"
            controls={false}
            repeat={false} // Don't loop, move to the next video instead
            paused={currentIndex !== index} // Auto-play when in view
            onEnd={handleVideoEnd}
            muted={false}
            volume={2.0}
            // Play next video when the current one ends
          />
        )}
      </View>
    ),
    [currentIndex],
  );
  // Function to track user swipe and update current index
  const onViewableItemsChanged = useCallback(({viewableItems}) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }, []);
  return (
    <View style={{flex: 1, backgroundColor: 'black'}}>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#fff"
          style={{flex: 1, justifyContent: 'center'}}
        />
      ) : (
        <FlatList
          ref={flatListRef}
          data={videos}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.id}_${index}`}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          snapToInterval={VIDEO_HEIGHT} // Ensure snapping
          snapToAlignment="start"
          decelerationRate="fast"
          //  contentContainerStyle={{ display:"flex",gap:10,flexDirection:"column" }}
          getItemLayout={(data, index) => ({
            length: VIDEO_HEIGHT,
            offset: VIDEO_HEIGHT * index,
            index,
          })}
          onScrollToIndexFailed={info => {
            console.warn('ScrollToIndex Failed: ', info);
            setTimeout(() => {
              flatListRef.current?.scrollToIndex({
                index: info.index,
                animated: true,
              });
            }, 500);
          }}
          // onMomentumScrollEnd={(e) => {
          //   const index = Math.round(e.nativeEvent.contentOffset.y / VIDEO_HEIGHT);
          //   if (index !== currentIndex) {
          //     setCurrentIndex(index);
          //   }
          // }}
          initialNumToRender={1}
          maxToRenderPerBatch={2}
          windowSize={7}
          onEndReached={loadMoreVideos}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            loadingMore ? <ActivityIndicator size="small" color="blue" /> : null
          }
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{itemVisiblePercentThreshold: 80}}
          removeClippedSubviews={false}
        />
      )}
    </View>
  );
};

export default InstagramReels;
