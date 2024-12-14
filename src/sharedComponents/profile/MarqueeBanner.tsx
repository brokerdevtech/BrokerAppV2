import React, {useEffect, useRef, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import MarqueeText from '../MarqueeText';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {useApiPagingWithtotalRequest} from '../../hooks/useApiPagingWithtotalRequest';
import {fetchAdApi} from '../../../BrokerAppCore/services/new/dashboardService';

export const MarqueeBanner: React.FC = ({}) => {
  const AppLocation = useSelector((state: RootState) => state.AppLocation);
  const cityToShow = AppLocation.City;
  const navigation = useNavigation();
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
  } = useApiPagingWithtotalRequest(fetchAdApi, setInfiniteLoading, 3);
  const loadMorepage = async () => {
    if (!isInfiniteLoading) {
      await AdsloadMore(cityToShow);
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
    console.log(Addata, 'add');
  }, [Addata]);
  // React.useEffect(() => {
  //   const interval = setInterval(() => {
  //     setIndexText(index => {
  //       if (index > marqueeTextList.length - 2) {
  //         return 0;
  //       } else {
  //         return index + 1;
  //       }
  //     });
  //   }, 10000);
  //   return () => clearInterval(interval);
  // }, []);
  const handlePress = () => {
    // const selectedItem = marqueeTextList[indexText];
    navigation.navigate('ItemDetailScreen', {
      postId: selectedItem.postId,
      postType: selectedItem.categoryId == 2 ? 'Car/Post' : 'Post',
    });
  };
  return (
    <View style={styles.marqueeBannerContainer}>
      <MarqueeText
        style={styles.marqueeBannerText}
        onPress={handlePress}
        speed={1}
        marqueeOnStart={true}
        loop={true}
        delay={3000}>
        {/* {Addata?.length > 0 && (
          
        )} */}
        {Addata?.map((item, index) => {
          return item.marqueueText;
        })}
      </MarqueeText>
    </View>
  );
};
const styles = StyleSheet.create({
  marqueeBannerContainer: {
    flex: 0,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 42,
    flexShrink: 0,
    backgroundColor: '#D23434',
  },
  marqueeBannerText: {
    color: '#FFF',
  },
});
export default MarqueeBanner;
