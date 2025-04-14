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
import {debounce} from 'lodash';

const {height: screenHeight, width} = Dimensions.get('window');

const FACEBOOK_API_URL = 'https://graph.facebook.com/v22.0';
const ACCOUNT_ID = '17841458791630720';
const ACCESS_TOKEN =
  'EAAYJ6U4AIAQBO4UCcbd5jZBPioEGZBdZBPrAKEfkiggHmMA5UZBAAX5QA3mdo7oGmy05TUxz9vnFWzqf4GPbNPNWKcvWrgOU48LyGKJ2aEGCUPmIGvCSkP4NvWSxMpWKp2d8VyOX2gZAet2K1dZA9XOb5uWhdU92zUab6LJDXA96ssqM7zdSXFmgZDZD'; // Replace with your token

const HEADER_HEIGHT = 60;
const TAB_BAR_HEIGHT = 60;
const VIDEO_HEIGHT =
  Platform.OS === 'ios'
    ? screenHeight - HEADER_HEIGHT - TAB_BAR_HEIGHT + 40-20
    : screenHeight - HEADER_HEIGHT - TAB_BAR_HEIGHT + 60-20;

const formatPostDate = dateString => {
  if (!dateString) return '';

  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now - date;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 1) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  }
};

const ReelProfile = ({username, profileImage, postDate}) => {
  const formattedDate = formatPostDate(postDate);
  return (
    <View style={styles.profileContainer}>
      {/* <FastImage
        source={require('../../assets/images/userDark.png')}
        style={styles.profileImage}
        resizeMode={FastImage.resizeMode.cover}
      /> */}
      <View style={styles.userInfoContainer}>
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.postDate}>Posted {formattedDate}</Text>
      </View>
    </View>
  );
};
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

const InstagramReels = () => {
  const [videos, setVideos] = useState([]);
  const [isMuted, setIsMuted] = useState(true);
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

  const loadedPostIds = useRef(new Set());

  const userScrollingRef = useRef(false);
  const lastManualScrollTimestamp = useRef(0);

  let categoryId;

  if (previousRouteName === 'ItemListScreen') {
    categoryId = previousRouteParams?.categoryId;
  } else {
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
  } = useApiPagingWithtotalRequest(getThreadsList, setInfiniteLoading, 20);

  const loadMorepage = useCallback(
    debounce(async () => {
      if (!isInfiniteLoading) {
        setLoadingMore(true);
        try {
          await loadMore(user.userId, categoryId);

          if (data && data.length > 0) {
            const uniqueData = data.filter(item => {
              if (loadedPostIds.current.has(item.postId)) {
                return false;
              }
              loadedPostIds.current.add(item.postId);
              return true;
            });

            if (uniqueData.length !== data.length) {
              setData_Set(uniqueData);
            }
          }
        } catch (err) {
          console.error('Error loading more reels:', err);
        } finally {
          setLoadingMore(false);
        }
      }
    }, 200),
    [isInfiniteLoading, loadMore, data, setData_Set, user.userId, categoryId],
  );

  useFocusEffect(
    useCallback(() => {
      loadedPostIds.current = new Set();
      execute(user.userId, categoryId);
      console.log('Previous screen:', previousRouteName);
      console.log('Previous params:', previousRouteParams);

      return () => {
        setCurrentIndex(-1);
      };
    }, [
      user.userId,
      categoryId,
      execute,
      previousRouteName,
      previousRouteParams,
    ]),
  );

  const handleVideoEnd = () => {
    const currentTime = new Date().getTime();
    const timeSinceLastScroll = currentTime - lastManualScrollTimestamp.current;

    if (timeSinceLastScroll > 500 && !userScrollingRef.current) {
      if (currentIndex < (data?.length || 0) - 1) {
        onVideoEndRef.current = true;
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);

        flatListRef.current?.scrollToIndex({index: nextIndex, animated: true});

        setTimeout(() => {
          onVideoEndRef.current = false;
        }, 500);
      }
    }
  };

  const handleLikeReel = id => {
    setLikedReels(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const handleScroll = useCallback(() => {
    userScrollingRef.current = true;
    lastManualScrollTimestamp.current = new Date().getTime();

    setTimeout(() => {
      userScrollingRef.current = false;
    }, 500);
  }, []);

  const renderItem = useCallback(
    ({item, index}) => {
      const isLiked = item.userLiked === 1 ? true : false;

      return (
        <View style={styles.reelContainer}>
          <View style={styles.mediaContainer}>
            {item.mediaType === 'VIDEO' ? (
              <Video
                source={{uri: item.mediaUrls[0]}}
                style={styles.media}
                resizeMode="cover"
                controls={false}
                repeat={true}
                paused={currentIndex !== index}
                onEnd={handleVideoEnd}
                muted={isMuted}
                volume={2.0}
              />
            ) : (
              <ImageCarousel images={item.mediaUrls} autoPlay={false} />
            )}
          </View>

          <View style={styles.overlay}>
            <ReelProfile
              username={item.username || 'User'}
              profileImage={item.profileImage}
              postDate={item.postedOn}
            />

            <ReelCaption caption={item.caption} />

            <ReelActions
              likes={item.likeCount || 0}
              shares={item.permalink || 0}
              postId={item.postId || 0}
              onLike={() => handleLikeReel(item.id)}
              isLiked={isLiked}
              isMuted={isMuted}
              onToggleMute={toggleMute}
              mediaType={item.mediaType}
            />
          </View>
        </View>
      );
    },
    [currentIndex, isMuted, toggleMute, data?.length],
  );

  const onViewableItemsChanged = useCallback(({viewableItems}) => {
    if (viewableItems.length > 0 && !onVideoEndRef.current) {
      lastManualScrollTimestamp.current = new Date().getTime();
      setCurrentIndex(viewableItems[0].index);
    }
  }, []);

  return (
    <View style={styles.container}>
      {isInfiniteLoading && !data?.length ? (
        <ActivityIndicator size="large" color="#fff" style={styles.loader} />
      ) : data && data.length > 0 ? (
        <FlatList
          ref={flatListRef}
          data={data}
          renderItem={renderItem}
          keyExtractor={item => `${item.postId}`}
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
          initialNumToRender={3}
          maxToRenderPerBatch={3}
          windowSize={7}
          onEndReached={loadMorepage}
          onEndReachedThreshold={0.5}
          onScroll={handleScroll}
          onMomentumScrollBegin={() => {
            userScrollingRef.current = true;
            lastManualScrollTimestamp.current = new Date().getTime();
          }}
          onMomentumScrollEnd={() => {
            userScrollingRef.current = false;
          }}
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
 //backgroundColor:'white'
  },
  media: {
    width,
    height: VIDEO_HEIGHT,
  },
  overlay: {
    position: 'absolute',
    bottom: Platform.OS == 'ios' ? 0 : 10,
    width: '100%',
    padding: 16,
    paddingBottom: 10,
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
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  postDate: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 0.5, height: 0.5},
    textShadowRadius: 2,
  },
  captionContainer: {
    marginBottom: 15,
  },
  captionText: {
    color: '#eee',
    fontSize: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 0.5, height: 0.5},
    textShadowRadius: 3,
  },
  seeMoreLess: {
    color: '#bbb',
    fontWeight: 'bold',
    marginTop: 3,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 0.5, height: 0.5},
    textShadowRadius: 2,
  },
  muteOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    backgroundColor: 'transparent',

    height: '60%',
  },
  navigationContainer: {
    position: 'absolute',
    right: 16,
    top: '40%',
    zIndex: 10,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  navButtonNext: {
    marginTop: 8,
  },
  navButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
});

export default InstagramReels;
