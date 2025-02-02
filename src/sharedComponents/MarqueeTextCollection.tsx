import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withDelay, withTiming, runOnJS } from 'react-native-reanimated';
import MarqueeText from 'react-native-marquee';
import MarqueeView from 'react-native-marquee-view';
import { useApiPagingWithtotalRequest } from '../hooks/useApiPagingWithtotalRequest';
import { fetchAdApi } from '../../BrokerAppCore/services/new/dashboardService';
import { useSelector } from 'react-redux';
import { RootState } from '../../BrokerAppCore/redux/store/reducers';
import { useNavigation } from '@react-navigation/native';
const { width } = Dimensions.get('window');



const MarqueeTextCollection = ({  duration = 5000 }) => {
  const AppLocation = useSelector((state: RootState) => state.AppLocation);
  const cityToShow = AppLocation.City;
    const [isLoading, setLoading] = useState(false);
  const { data: Addata, execute: fetchData, loadMore } = useApiPagingWithtotalRequest(fetchAdApi, setLoading, 30);
 const navigation = useNavigation();




  useEffect(() => {
    fetchData(2, cityToShow);
  }, [cityToShow]);

  useEffect(() => {
  console.log(Addata)
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
    <View style={{ flex: 1, justifyContent: 'center' }}>
     <MarqueeView
	style={{
		backgroundColor: 'red',
		width: '100%',
	}}>
	<View style={{flex:1,display:'flex',flexDirection:'row',gap:300,paddingHorizontal:10 }}>
    {Addata!=null && Addata.map((Item:any, index) => (
       <Text 
       key={ index} 
       style={{color:'white',fontSize: 16}} onPress={() => handlePress(Item)}>
        {Item.marqueueText}
       </Text>
      ))}
    
    	
	</View>
</MarqueeView>
    </View>
  );
};

export default MarqueeTextCollection;
