import { Color } from '../styles/GlobalStyles';
import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Dimensions,Text,
  Animated
} from 'react-native';
import { Marquee } from '@animatereactnative/marquee';
import { useSelector } from 'react-redux';
import { RootState } from '@reduxjs/toolkit/dist/query';
import { useApiPagingWithtotalRequest } from '../hooks/useApiPagingWithtotalRequest';
import { fetchAdApi } from '../../BrokerAppCore/services/new/dashboardService';
import MarqueeText from 'react-native-marquee';
import  {
  useAnimatedStyle,
  useFrameCallback,
  useSharedValue,
} from 'react-native-reanimated';
const screenWidth = Dimensions.get('window').width;

const MeasureElement = ({ onLayout, children }) => (
  <Animated.ScrollView
    horizontal
    style={marqueeStyles.hidden}
    pointerEvents="box-none">
    <View onLayout={(ev) => onLayout(ev.nativeEvent.layout.width)}>
      {children}
    </View>
  </Animated.ScrollView>
);
const marqueeStyles = StyleSheet.create({
  hidden: { opacity: 0, zIndex: -1 },
  row: { flexDirection: 'row', overflow: 'hidden' },
});
const TranslatedElement = ({ index, children, offset, childrenWidth }) => {
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

const getIndicesArray = (length) => Array.from({ length }, (_, i) => i);

const Cloner = ({ count, renderChild }) => (
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

  useFrameCallback((i) => {
    var _a;
    // prettier-ignore
    offset.value += (coeff.value * (((_a = i.timeSincePreviousFrame) !== null && _a !== void 0 ? _a : 1) * childrenWidth)) / duration;
    offset.value = offset.value % childrenWidth;
  }, true);

  const count = Math.round(parentWidth / childrenWidth) + 2;
  const renderChild = (index) => (
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
const Marquee = ({ duration = 2000, reverse = false, children, style }) => {
  const [parentWidth, setParentWidth] = React.useState(0);
  const [childrenWidth, setChildrenWidth] = React.useState(0);

  return (
    <View
      style={style}
      onLayout={(ev) => {
        setParentWidth(ev.nativeEvent.layout.width);
      }}
      pointerEvents="box-none">
      <View style={marqueeStyles.row} pointerEvents="box-none">
        <MeasureElement onLayout={setChildrenWidth}>{children}</MeasureElement>

        {childrenWidth > 0 && parentWidth > 0 && (
          <ChildrenScroller
            duration={duration}
            parentWidth={parentWidth}
            childrenWidth={childrenWidth}
            reverse={reverse}>
            {children}
          </ChildrenScroller>
        )}
      </View>
    </View>
  );
};
const MarqueeFlatList = () => {
  const AppLocation = useSelector((state: RootState) => state.AppLocation);
  const cityToShow = AppLocation.City;
  const [isLoading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const { data: Addata, execute: fetchData, loadMore } = useApiPagingWithtotalRequest(fetchAdApi, setLoading, 3);

  useEffect(() => {
    fetchData(2, cityToShow);
  }, [cityToShow]);

  const loadMoreData = () => {
    if (!isLoading) {
      loadMore(2, cityToShow);
    }
  };

  const handleScrollEnd = () => {
    if (!Addata || Addata.length === 0) return;

    const nextIndex = (currentIndex + 1) % Addata.length;
    setCurrentIndex(nextIndex);

    if (flatListRef.current && nextIndex < Addata.length) {
      flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
    }
  };

  return (
    <View style={styles.mainContainer}>
      <FlatList
        ref={flatListRef}
        data={Addata || []}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        snapToAlignment="center"
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={styles.marqueeContainer}>
        <MeasureElement>

        </MeasureElement>
            {/* <MarqueeText
              style={styles.text}
              speed={0.2}
              loop={false}
              delay={0}
              onMarqueeComplete={handleScrollEnd}
            >
              {item.marqueueText}
            </MarqueeText> */}
          </View>
        )}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
        initialNumToRender={1}
        getItemLayout={(data, index) => ({
          length: screenWidth,
          offset: screenWidth * index,
          index,
        })}
      />
    </View>
  );
};

export default MarqueeFlatList;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.primary,
  },
  marqueeContainer: {
    width: screenWidth,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});
