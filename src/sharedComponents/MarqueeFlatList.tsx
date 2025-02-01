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
import TextTicker from 'react-native-text-ticker';
const screenWidth = Dimensions.get('window').width;


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
  const getDuration = (text: string) => Math.max(text.length * 100, 2000);
  const handleScrollEnd = () => {
    if (!Addata || Addata.length === 0) return;

    const nextIndex = (currentIndex + 1) % Addata.length;
    setCurrentIndex(nextIndex);

    if (flatListRef.current && nextIndex < Addata.length) {
      flatListRef.current.scrollToIndex({ index: nextIndex});
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
        renderItem={({ item,index }) => (
          <View style={styles.marqueeContainer}>
<MarqueeText
          style={styles.text}
          speed={0.2}
          marqueeOnStart={true}
          loop={true}
          delay={1000}
          onMarqueeComplete={handleScrollEnd}
        >  
         {index}-{item.marqueueText}
        </MarqueeText>


        {/* <TextTicker
           style={{ fontSize: 24 }}
         
           animationType='auto'
         duration={getDuration(item.marqueueText)}
           onMarqueeComplete={handleScrollEnd}
           marqueeDelay={1}
           bounce={false}
           loop={false}
           
           >
              
              
                 <Text style={styles.text}>{index}-{item.marqueueText}</Text>
               </TextTicker> */}
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
