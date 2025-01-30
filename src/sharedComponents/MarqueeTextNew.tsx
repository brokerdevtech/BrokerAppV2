import {Color} from '../styles/GlobalStyles';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Linking,
  Dimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import ZText from './ZText';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {RootState} from '@reduxjs/toolkit/dist/query';
import {useSelector} from 'react-redux';
import {useApiPagingWithtotalRequest} from '../hooks/useApiPagingWithtotalRequest';
import {fetchAdApi} from '../../BrokerAppCore/services/new/dashboardService';

const screenWidth = Dimensions.get('window').width;

const Marquee = ({duration = 5000, data = [], style, onCycleComplete}) => {
  const [parentWidth, setParentWidth] = useState(0);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const cycleCountRef = useRef(0);
  const navigation = useNavigation();
  const offset = useSharedValue(screenWidth);

  const handlePress = useCallback(
    item => {
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
    },
    [navigation],
  );

  const handleAnimationComplete = useCallback(() => {
    const nextIndex = (currentTextIndex + 1) % data.length;
    setCurrentTextIndex(nextIndex);

    // If we've completed a full cycle through all items
    if (nextIndex === 0) {
      cycleCountRef.current += 1;

      // After 3 cycles, notify parent to load more
      if (cycleCountRef.current % 3 === 0) {
        onCycleComplete?.();
      }
    }
  }, [currentTextIndex, data.length, onCycleComplete]);

  useEffect(() => {
    if (parentWidth > 0) {
      // Reset animation
      offset.value = screenWidth;
      // Start animation
      offset.value = withTiming(-parentWidth, {duration}, () => {
        runOnJS(handleAnimationComplete)();
      });
    }
  }, [parentWidth, currentTextIndex, data.length]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: offset.value}],
    };
  });

  if (!data.length) return null;

  const currentItem = data[currentTextIndex];

  return (
    <View
      style={[styles.container, style]}
      onLayout={ev => {
        setParentWidth(ev.nativeEvent.layout.width);
      }}>
      <Animated.View style={[styles.animatedContainer, animatedStyle]}>
        <TouchableOpacity onPress={() => handlePress(currentItem)}>
          <ZText
            type={'B14'}
            numberOfLines={1}
            color={'#fff'}
            style={styles.text}>
            {currentItem.marqueueText}
          </ZText>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default function MarqueeTextList() {
  const AppLocation = useSelector((state: RootState) => state.AppLocation);
  const cityToShow = AppLocation.City;
  const [isInfiniteLoading, setInfiniteLoading] = useState(false);
  const [page, setPage] = useState(1);

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

  const loadMorepage = async () => {
    if (!isInfiniteLoading) {
      await AdsloadMore(2, cityToShow);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getList();

      return () => {};
    }, [cityToShow]),
  );

  return (
    <View style={styles.mainContainer}>
      <Marquee
        data={Addata || []}
        duration={15000}
        style={styles.marquee}
        onCycleComplete={loadMorepage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.primary,
  },
  marquee: {
    width: '100%',
  },
  container: {
    overflow: 'hidden',
    height: 40,
    justifyContent: 'center',
    width: '100%',
  },
  animatedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
  },
  text: {
    fontSize: 16,
    whiteSpace: 'nowrap',
  },
});
