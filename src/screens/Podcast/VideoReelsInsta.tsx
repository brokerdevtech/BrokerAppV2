import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Dimensions,
  ActivityIndicator,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import Video from 'react-native-video';
import {fetchInstagramVideos} from '../../../BrokerAppCore/services/new/podcastService';
import {Color, Padding} from '../../styles/GlobalStyles';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {useApiPagingWithtotalRequest} from '../../hooks/useApiPagingWithtotalRequest';
import {getThreadsList} from '../../../BrokerAppCore/services/new/threads';
import {
  formatDate,
  imagesBucketcloudfrontPath,
  imagesBucketPath,
} from '../../constants/constants';
import FastImage from '@d11/react-native-fast-image';
import ImageCarousel from './ImageCarousel';
import {Like, share_PIcon, UnLike, UnLikeWhite} from '../../assets/svg';
import {
  FavouriteIcon,
  Icon,
  MessageCircleIcon,
} from '../../../components/ui/icon';
import {ReelActions} from './ReelActions';

const {height: screenHeight, width} = Dimensions.get('window');

const FACEBOOK_API_URL = 'https://graph.facebook.com/v22.0';
const ACCOUNT_ID = '17841458791630720'; // Replace with your account ID
const ACCESS_TOKEN =
  'EAAYJ6U4AIAQBO4UCcbd5jZBPioEGZBdZBPrAKEfkiggHmMA5UZBAAX5QA3mdo7oGmy05TUxz9vnFWzqf4GPbNPNWKcvWrgOU48LyGKJ2aEGCUPmIGvCSkP4NvWSxMpWKp2d8VyOX2gZAet2K1dZA9XOb5uWhdU92zUab6LJDXA96ssqM7zdSXFmgZDZD'; // Replace with your token
// Define approximate header and tab heights
const HEADER_HEIGHT = 60; // Adjust as per your UI
const TAB_BAR_HEIGHT = 60; // Adjust based on your bottom tab bar
const VIDEO_HEIGHT =
  Platform.OS === 'ios'
    ? screenHeight - HEADER_HEIGHT - TAB_BAR_HEIGHT + 40
    : screenHeight - HEADER_HEIGHT - TAB_BAR_HEIGHT; // Available height for video
const formatPostDate = dateString => {
  if (!dateString) return '';

  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    return `${Math.floor(diffDays / 7)} week${
      Math.floor(diffDays / 7) > 1 ? 's' : ''
    } ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
};
const ReelProfile = ({username, profileImage, postDate}) => {
  const formattedDate = formatPostDate(postDate);
  console.log(profileImage);
  return (
    <View style={styles.profileContainer}>
      <FastImage
        source={require('../../assets/images/userDark.png')}
        style={styles.profileImage}
        resizeMode={FastImage.resizeMode.cover}
      />
      <View style={styles.userInfoContainer}>
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.postDate}>Posted {formattedDate}</Text>
      </View>
    </View>
  );
};

// Caption component with see more/less functionality
const ReelCaption = ({caption}) => {
  const [expanded, setExpanded] = useState(false);
  const MAX_CAPTION_LENGTH = 100;

  if (!caption) return null;

  const shouldTruncate = caption.length > MAX_CAPTION_LENGTH;
  const displayText =
    !expanded && shouldTruncate
      ? caption.substring(0, MAX_CAPTION_LENGTH) + '...'
      : caption;

  return (
    <View style={styles.captionContainer}>
      <Text style={styles.captionText}>{displayText}</Text>
      {shouldTruncate && (
        <TouchableOpacity onPress={() => setExpanded(!expanded)}>
          <Text style={styles.seeMoreLess}>
            {expanded ? 'See less' : 'See more'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Reel actions component (like, comment, share, etc.)

const InstagramReels = () => {
  const [videos, setVideos] = useState([]);
  const user = useSelector(state => state.user.user);
  const [loading, setLoading] = useState(false);
  const [isInfiniteLoading, setInfiniteLoading] = useState(false);
  const [nextPage, setNextPage] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedReels, setLikedReels] = useState({});
  const previousRouteName = useSelector(
    (state: RootState) => state.navigation.previousRouteName,
  );
  const previousRouteParams = useSelector(
    (state: RootState) => state.navigation.previousRouteParams,
  );
  const flatListRef = useRef(null);
  const onVideoEndRef = useRef(false);
  let categoryId;

  if (previousRouteName === 'ItemListScreen') {
    // Extract categoryId from previous route params
    categoryId = previousRouteParams?.categoryId;
  } else {
    // Default value if coming from any other route
    categoryId = 7;
  }
  let {
    data,
    status,
    error,
    execute,
    loadMore,
    pageSize_Set,
    currentPage_Set,
    hasMore_Set,
    totalPages,
    recordCount,
    setData_Set,
  } = useApiPagingWithtotalRequest(getThreadsList, setInfiniteLoading, 5);

  let obj = {
    userId: user.userId,
    categoryId: categoryId,
  };

  const loadMorepage = async () => {
    if (!isInfiniteLoading) {
      await loadMore(obj);
    }
  };

  useFocusEffect(
    useCallback(() => {
      execute(obj);
      console.log('Previous screen:', previousRouteName);
      console.log('Previous params:', previousRouteParams);
      return () => {
        // Pause video when screen is unfocused
        setCurrentIndex(-1); // This will pause all videos
      };
    }, []),
  );

  const handleVideoEnd = () => {
    if (currentIndex < videos.length - 1) {
      onVideoEndRef.current = true; // Prevents onMomentumScrollEnd from interfering
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);

      flatListRef.current?.scrollToIndex({index: nextIndex, animated: true});
    }
    setTimeout(() => {
      onVideoEndRef.current = false; // Reset flag after transition
    }, 500);
  };

  const handleLikeReel = id => {
    setLikedReels(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderItem = useCallback(
    ({item, index}) => {
      const isLiked = likedReels[item.id] || false;
      const images = [
        'https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?cs=srgb&dl=pexels-anjana-c-169994-674010.jpg&fm=jpg',
        'https://thumbs.dreamstime.com/b/planet-earth-space-night-some-elements-image-furnished-nasa-52734504.jpg',
        'https://images.pexels.com/photos/1054655/pexels-photo-1054655.jpeg?cs=srgb&dl=pexels-hsapir-1054655.jpg&fm=jpg',
        'https://cdn.pixabay.com/photo/2017/10/20/10/58/elephant-2870777_640.jpg',
      ];
      return (
        <View style={styles.reelContainer}>
          {/* Video or Image content */}
          <View style={styles.mediaContainer}>
            {item.mediaType === 'VIDEO' ? (
              <Video
                source={{uri: item.mediaUrls[0]}}
                style={styles.media}
                resizeMode="cover"
                controls={false}
                repeat={false}
                paused={currentIndex !== index}
                onEnd={handleVideoEnd}
                muted={false}
                volume={2.0}
              />
            ) : (
              <ImageCarousel images={item.mediaUrls} autoPlay={false} />
            )}
          </View>

          {/* User info and caption overlay */}
          <View style={styles.overlay}>
            <ReelProfile
              username={item.username || 'User'}
              profileImage={item.profileImage}
              postDate={item.postedOn}
            />

            <ReelCaption caption={item.caption} />

            <ReelActions
              likes={item.likeCount || 0}
              shares={item.shares || 0}
              onLike={() => handleLikeReel(item.id)}
              isLiked={isLiked}
            />
          </View>
        </View>
      );
    },
    [currentIndex, likedReels],
  );

  // Function to track user swipe and update current index
  const onViewableItemsChanged = useCallback(({viewableItems}) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }, []);

  return (
    <View style={styles.container}>
      {isInfiniteLoading ? (
        <ActivityIndicator size="large" color="#fff" style={styles.loader} />
      ) : data && data.length > 0 ? (
        <FlatList
          ref={flatListRef}
          data={data || []}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.id}_${index}`}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          snapToInterval={VIDEO_HEIGHT}
          snapToAlignment="start"
          decelerationRate="fast"
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
          initialNumToRender={1}
          maxToRenderPerBatch={2}
          windowSize={7}
          onEndReached={loadMorepage}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            loadingMore ? <ActivityIndicator size="small" color="#fff" /> : null
          }
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{itemVisiblePercentThreshold: 80}}
          removeClippedSubviews={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No videos available</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: 'white',
  },
  reelContainer: {
    height: VIDEO_HEIGHT,
    width,
    position: 'relative',
  },
  mediaContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  media: {
    width,
    height: VIDEO_HEIGHT,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 16,
    paddingBottom: 10, // Extra padding for bottom navigation
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  userInfoContainer: {
    flexDirection: 'column',
  },
  username: {
    color: '#eee',
    fontWeight: 'bold',
    fontSize: 16,
  },
  postDate: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 2,
  },
  captionContainer: {
    marginBottom: 15,
  },
  captionText: {
    color: '#eee',
    fontSize: 14,
  },
  seeMoreLess: {
    color: '#bbb',
    fontWeight: 'bold',
    marginTop: 3,
  },
});

export default InstagramReels;
