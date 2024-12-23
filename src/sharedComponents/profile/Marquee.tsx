import {Color} from '../../styles/GlobalStyles';
import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Button,
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  Linking,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useFrameCallback,
  useSharedValue,
} from 'react-native-reanimated';
import ZText from '../ZText';
import {useSelector} from 'react-redux';
import {useApiPagingWithtotalRequest} from '../../hooks/useApiPagingWithtotalRequest';
import {fetchAdApi} from '../../../BrokerAppCore/services/new/dashboardService';
import LoadingSpinner from '../LoadingSpinner';

const MeasureElement = ({onLayout, children}) => (
  <Animated.ScrollView
    horizontal
    style={marqueeStyles.hidden}
    pointerEvents="box-none">
    <View onLayout={ev => onLayout(ev.nativeEvent.layout.width)}>
      {children}
    </View>
  </Animated.ScrollView>
);

const TranslatedElement = ({index, children, offset, childrenWidth}) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      left: (index - 1) * childrenWidth,
      transform: [
        {
          translateX: -offset.value,
        },
      ],
    };
  });
  return (
    <Animated.View style={[styles.animatedStyle, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

const getIndicesArray = length => Array.from({length}, (_, i) => i);

const Cloner = ({count, renderChild}) => (
  <>{getIndicesArray(count).map(renderChild)}</>
);

const ChildrenScroller = ({
  duration,
  childrenWidth,
  parentWidth,
  reverse,
  children,
}) => {
  const offset = useSharedValue(0);
  const coeff = useSharedValue(reverse ? 1 : -1);

  React.useEffect(() => {
    coeff.value = reverse ? 1 : -1;
  }, [reverse]);

  useFrameCallback(i => {
    // prettier-ignore
    offset.value += (coeff.value * ((i.timeSincePreviousFrame ?? 1) * childrenWidth)) / duration;
    offset.value = offset.value % childrenWidth;
  }, true);

  const count = Math.round(parentWidth / childrenWidth) + 2;
  const renderChild = index => (
    <TranslatedElement
      key={`clone-${index}`}
      index={index}
      offset={offset}
      childrenWidth={childrenWidth}>
      {children}
    </TranslatedElement>
  );

  return <Cloner count={count} renderChild={renderChild} />;
};

const Marquee = ({
  baseSpeed = 2000,
  maxSpeed = 50000,
  reverse = true,
  children,
  style,
}) => {
  const [parentWidth, setParentWidth] = React.useState(0);
  const [childrenWidth, setChildrenWidth] = React.useState(0);

  // Adjust duration dynamically based on childrenWidth
  const duration =
    childrenWidth > 0
      ? Math.min(maxSpeed, Math.max(baseSpeed, childrenWidth * 40))
      : 0;

  // Calculate the effective width for scrolling
  const effectiveWidth =
    childrenWidth > parentWidth ? childrenWidth : parentWidth;

  return (
    <View
      style={style}
      onLayout={ev => {
        setParentWidth(ev.nativeEvent.layout.width);
      }}
      pointerEvents="box-none">
      <View style={marqueeStyles.row} pointerEvents="box-none">
        {/* Measure the content */}
        <MeasureElement onLayout={setChildrenWidth}>{children}</MeasureElement>

        {/* Render the scroller only if widths are available */}
        {childrenWidth > 0 && parentWidth > 0 && (
          <ChildrenScroller
            duration={duration}
            parentWidth={parentWidth}
            childrenWidth={effectiveWidth} // Use adjusted width
            reverse={reverse}>
            {children}
          </ChildrenScroller>
        )}
      </View>
    </View>
  );
};
const MarqueeNew = ({text, onComplete, reverse = true, duration = 5000}) => {
  const offset = useSharedValue(0);
  const containerWidth = useSharedValue(0);
  const textWidth = useSharedValue(0);

  useEffect(() => {
    const interval = setInterval(() => {
      onComplete?.();
    }, duration);

    return () => clearInterval(interval);
  }, [onComplete, duration]);

  useFrameCallback((frame) => {
    if (textWidth.value > containerWidth.value) {
      const distance = frame.timeSincePreviousFrame
        ? frame.timeSincePreviousFrame * (textWidth.value / duration)
        : 0;

      offset.value = reverse
        ? Math.max(offset.value - distance, -(textWidth.value - containerWidth.value))
        : Math.min(offset.value + distance, textWidth.value - containerWidth.value);
    }
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateX: offset.value}],
  }));

  return (
    <View
      style={styles.marqueeContainer}
      onLayout={(e) => (containerWidth.value = e.nativeEvent.layout.width)}>
      <Animated.View
        style={[styles.marqueeTextContainer, animatedStyle]}
        onLayout={(e) => (textWidth.value = e.nativeEvent.layout.width)}>
        <ZText style={styles.marqueeText}>{text}</ZText>
      </Animated.View>
    </View>
  );
};

const marqueeStyles = StyleSheet.create({
  hidden: {opacity: 0, zIndex: -1},
  row: {flexDirection: 'row', overflow: 'hidden'},
});

function MarqueeScreen() {
  const navigation = useNavigation();
  const [reverse, setReverse] = useState(false);
  const AppLocation = useSelector((state: RootState) => state.AppLocation);
  const cityToShow = AppLocation.City;
  // const navigation = useNavigation();
  const [isInfiniteLoading, setInfiniteLoading] = useState(false);
  const [parentWidth, setParentWidth] = useState(0);
  const [adsToshow, setAdsToshow] = useState([]);
  const flatListRef = useRef<FlatList>(null);
  const [indexText, setIndexText] = useState(0);
  const {
    data: Addata,
    status: Adstatus,
    execute: Adexecute,
    currentPage,
    hasMore,
    loadMore: AdsloadMore,
    totalPages,
  } = useApiPagingWithtotalRequest(fetchAdApi, setInfiniteLoading, 1);
  const loadMorepage = async () => {
    if (!isInfiniteLoading) {
      await AdsloadMore(2, cityToShow);
    }
  };
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
 //   console.log(Addata, 'add');
  }, [Addata]);

  const handlePress = item => {
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
  const handleAdCompletion = (index) => {
    if (index < Addata.length - 1) {
      flatListRef.current?.scrollToIndex({index: index + 1, animated: true});
    }
  };
  const renderAdItem = useCallback(
    ({item, index}) => {
     // console.log('renderAdItem',item); // Log the item to the console
      return (
        <TouchableOpacity key={item.id} onPress={() => handlePress(item)}>
           <ZText
            type={'B18'}
            style={{
              color: '#fff',
              paddingHorizontal: 10,
            }}>
            {item.marqueueText}
          </ZText>
          {/* Uncomment the Marquee component if needed */}
          {/* <MarqueeNew text={item.marqueeText} onComplete={() => handleAdCompletion(index)} /> */}
        </TouchableOpacity>
      );
    },
    [parentWidth]
  );
  // const onMomentumScrollEnd = event => {
  //   const newIndex = Math.round(
  //     event.nativeEvent.contentOffset.x / screenWidths,
  //   );
  //   setActiveIndex(newIndex);
  // };
  const renderCarouselItem = useCallback(
    ({item}) => {
      return (
        <TouchableOpacity key={item.id} onPress={() => handlePress(item)}>
          <ZText
            type={'B18'}
            style={{
              color: '#fff',
              paddingHorizontal: 10,
            }}>
            {item.marqueueText}
          </ZText>
        </TouchableOpacity>
      );
    },
    [parentWidth],
  );
  return (
    <View style={styles.container}>
   
  
          {/* {Addata?.map((item, index) => {
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => handlePress(item)}>
                  <ZText
                    type={'B18'}
                    style={{color: '#fff', paddingHorizontal: 10}}>
                    {item.marqueueText}
                  </ZText>
                </TouchableOpacity>
              );
            })} */}
       
            {Addata?.length > 0 ? (
              <FlatList
                data={Addata}
                horizontal
                 pagingEnabled
                 ref={flatListRef}
                renderItem={renderCarouselItem}
                keyExtractor={(item, index) => index.toString()}
                showsHorizontalScrollIndicator={false}
                // snapToInterval={parentWidth}
                // snapToAlignment="center"
                // decelerationRate="fast"
                // onEndReachedThreshold={0.6}
                onEndReached={loadMorepage}
                // onMomentumScrollEnd={onMomentumScrollEnd}
                // ListFooterComponent={
                //   isInfiniteLoading ? (
                //     <ActivityIndicator size="large" color="#0000ff" />
                //   ) : null
                // }
                // contentContainerStyle={{marginBottom: 30}}
              />
            ) : (
              <LoadingSpinner />
            )}
       
          {/* {marqueeTextList.marqueeTextList.map(item => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handlePress(item.postId, item.categoryId)}>
                <ZText
                  type={'B18'}
                  style={{color: '#fff', paddingHorizontal: 10}}>
                  {item.marqueueText}
                </ZText>
              </TouchableOpacity>
            ))} */}
   
    </View>
  );
}

const styles = StyleSheet.create({
  marqueeTextContainer: {
    flexDirection: 'row',
  },
  marqueeText: {
    fontSize: 18,
    color: '#333',
  },
  horseImage: {
    width: 140,
    height: 80,
    marginRight: 80,
  },
  marqueeContainer: {
    minWidth: '90%', // Set a fixed or minimum width
  },
  marqueeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  container: {
    flex: 1,
  },
  safeArea: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
color:Color.black,
   backgroundColor: Color.gray,
  },
  animatedStyle: {
    position: 'absolute',
  },
  circle: {
    marginTop: 4,
    borderRadius: 100,
    height: 120,
    width: 160,
    backgroundColor: '#b58df1',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MarqueeScreen;
