import React, {useState, useRef} from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  View,
  PanResponder,
  Platform,
} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../../BrokerAppCore/redux/store/reducers';
import {useInfiniteScrollWithData} from '../../hooks/useInfiniteScrollWithData';
import SingleReel from './SingleReel';
//import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {moderateScale} from '../../config/constants';
import {Color} from '../../styles/GlobalStyles';
import { fetchPodcastList } from '../../../BrokerAppCore/services/new/podcastService';
import ArrowLeftIcon from '../../assets/svg/icons/arrow-left.svg' 

const {width, height} = Dimensions.get('window');

const VideoCarousel = ({route}) => {
  const navigation = useNavigation();
  const user = useSelector((state: RootState) => state.user.user);
  const {podcastitem, podcastId, podcastData, podcastIndex, podcastPage} =
    route.params;

    const fetchDataFunction = async (page: any, pageSize: any) => {
      try {
        const result = await fetchPodcastList(user.userId, page, pageSize);
        if (result.length > 0) {
          return result;
        } else {
          return []; // Set flag when no more data is available
        }
      } catch (error) {
        console.error('Error fetching more data:', error);
      } finally {
      }
    };

  const {data, fetchMoreData} = useInfiniteScrollWithData(
    fetchDataFunction,
    3,
    podcastData,
    podcastitem,
    podcastPage,
  );
  const [currentIndex, setCurrentIndex] = useState(podcastIndex);
  const position = useRef(new Animated.ValueXY()).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gesture) => {
      position.setValue({x: 0, y: gesture.dy});
    },
    onPanResponderRelease: (event, gesture) => {
      if (gesture.dy < -50) {
        // Swiping up
        if (currentIndex >= data.length - 1) {
          // Check if it's the last item
          navigation.goBack(); // Navigate back if swiping up on the last item
        } else {
          Animated.parallel([
            Animated.spring(position, {
              toValue: {x: 0, y: -height},
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start(() => {
            setCurrentIndex(currentIndex + 1);
            position.setValue({x: 0, y: 0});
            opacity.setValue(1);
            if (currentIndex >= data.length - 2) {
              fetchMoreData();
            }
          });
        }
      } else if (gesture.dy > 50) {
        // Swiping down
        if (currentIndex === 0) {
          // Check if it's the first item
          navigation.goBack(); // Navigate back if swiping down on the first item
        } else {
          Animated.parallel([
            Animated.spring(position, {
              toValue: {x: 0, y: height},
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start(() => {
            setCurrentIndex(currentIndex - 1);
            position.setValue({x: 0, y: 0});
            opacity.setValue(1);
          });
        }
      } else {
        // Return to original position
        Animated.spring(position, {
          toValue: {x: 0, y: 0},
          friction: 5,
          useNativeDriver: true,
        }).start();
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  return (
    <View style={{width, height, backgroundColor: 'black'}}>
      <View style={styles.header}>
        {/* <Ionicons
          name="arrow-back"
          size={moderateScale(30)}
          onPress={() => navigation.goBack()}
          color={Color.white}
        /> */}
        <ArrowLeftIcon onPress={() => navigation.goBack()} />
      </View>
      {data.map((item, index) => {
        let isActive = index === currentIndex;
        let animatedStyle = {
          opacity: isActive ? opacity : 1,
          transform: isActive ? position.getTranslateTransform() : [],
        };

        return isActive ? (
          <Animated.View
            {...panResponder.panHandlers}
            key={item.id}
            style={[styles.videoContainer, animatedStyle]}>
            <SingleReel item={item} index={index} currentIndex={currentIndex} />
          </Animated.View>
        ) : null;
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: Platform.OS == 'ios' ? 60 : 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    zIndex: 1,
    padding: 10,
  },
  videoContainer: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VideoCarousel;
