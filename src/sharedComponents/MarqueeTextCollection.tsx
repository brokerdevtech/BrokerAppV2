import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, Dimensions, Linking} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withDelay,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import MarqueeText from 'react-native-marquee';
import MarqueeView from 'react-native-marquee-view';
import {useApiPagingWithtotalRequest} from '../hooks/useApiPagingWithtotalRequest';
import {fetchAdApi} from '../../BrokerAppCore/services/new/dashboardService';
import {useSelector} from 'react-redux';
import {RootState} from '../../BrokerAppCore/redux/store/reducers';
import {useNavigation} from '@react-navigation/native';
import {Color} from '../styles/GlobalStyles';
import ZText from './ZText';
const {width} = Dimensions.get('window');

const MarqueeTextCollection = ({duration = 5000}) => {
  const AppLocation = useSelector((state: RootState) => state.AppLocation);
  const cityToShow = AppLocation.City;
  const [isLoading, setLoading] = useState(false);
  const {
    data: Addata,
    execute: fetchData,
    loadMore,
  } = useApiPagingWithtotalRequest(fetchAdApi, setLoading, 30);
  const navigation = useNavigation();

  useEffect(() => {
    fetchData(2, cityToShow);
  }, [cityToShow]);

  useEffect(() => {

  }, [Addata]);

  const [currentIndex, setCurrentIndex] = React.useState(0);

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
  const handleNext = () => {
    if (currentIndex < texts.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    } else {
      setCurrentIndex(0); // Loop back to the first text
    }
  };


  return (
    <>
      {Addata != null && Addata.length > 0 && (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <MarqueeView
            style={{
              backgroundColor: Color.primary,
              width: '100%',
            }}>
            <View
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'row',
                gap: 300,
                paddingHorizontal: 10,
                paddingVertical: 5,
              }}>
              {Addata != null &&
                Addata.map((Item: any, index) => (
                  <ZText
                    key={index}
                    type={'S16'}
                    style={{color: 'white'}}
                    onPress={() => handlePress(Item)}>
                    {Item.marqueueText}
                  </ZText>
                ))}
            </View>
          </MarqueeView>
        </View>
      )}
    </>
  );
};

export default MarqueeTextCollection;
