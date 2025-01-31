import { Color } from '../styles/GlobalStyles';
import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Animated,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@reduxjs/toolkit/dist/query';
import { useApiPagingWithtotalRequest } from '../hooks/useApiPagingWithtotalRequest';
import { fetchAdApi } from '../../BrokerAppCore/services/new/dashboardService';

const screenWidth = Dimensions.get('window').width;
const SCROLL_SPEED = 100;

const AnimatedTextScroller = ({ text, onScrollEnd }) => {
  const scrollAnim = useRef(new Animated.Value(screenWidth)).current;

  useEffect(() => {
    Animated.timing(scrollAnim, {
      toValue: -text.length * 15,
      duration: 8000,
      useNativeDriver: true,
    }).start(() => {
      onScrollEnd();
    });
  }, [text]);

  return (
    <View style={{ overflow: 'hidden', width: screenWidth - 50 }}>
      <Animated.Text
        style={{
          position: 'absolute',
          color: 'white',
          fontSize: 18,
          transform: [{ translateX: scrollAnim }],
        }}>
        {text}
      </Animated.Text>
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
    const nextIndex = (currentIndex + 1) % (Addata?.length || 1);
    setCurrentIndex(nextIndex);
    flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
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
            <AnimatedTextScroller text={item.marqueueText} onScrollEnd={handleScrollEnd} />
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
});
