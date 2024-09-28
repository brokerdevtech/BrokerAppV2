import React, {useState, useRef} from 'react';
import {
  FlatList,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  View,
  Text,
} from 'react-native';
import {useInfiniteScrollWithData} from '../../hooks/useInfiniteScrollWithData';
import {useSelector} from 'react-redux';
import {RootState} from '../../../BrokerAppCore/redux/store/reducers';
import Ionicons from 'react-native-vector-icons/Ionicons'; //Ionicons
import {moderateScale} from '../../config/constants';
import {Color} from '../../styles/GlobalStyles';
import {useNavigation} from '@react-navigation/native';
import SingleReel from './SingleReel';
import { fetchPodcastList } from '@/BrokerAppcore/services/new/podcastService';
const {width, height} = Dimensions.get('window');

const VideoReels: React.FC = ({route}) => {
  const navigation = useNavigation();
  const user = useSelector((state: RootState) => state.user.user);
  const {
    podcastitem,
    podcastId,
    podcastData,
    podcastIndex,
    podcastPage,
  } = route.params;
  
  const [currentVisibleIndex, setCurrentVisibleIndex] = useState(0);
  const viewabilityConfigRef = useRef({viewAreaCoveragePercentThreshold: 70});
  const initialIndex = podcastIndex; // Adjust as needed
  const onViewableItemsChangedRef = useRef(({viewableItems}) => {
    if (viewableItems.length > 0) {
      setCurrentVisibleIndex(viewableItems[0].index);
    }
  });

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
  const {data, loading, hasMore, fetchMoreData} = useInfiniteScrollWithData(
    fetchDataFunction,
    3,
    podcastData,
    podcastitem,
    podcastPage,
  );
  const DimensionStyles = { width: width, height: height};
  
  const VideoItem = ({item, index}) => {
    return (
      <View style={[styles.videoContainer, DimensionStyles]}>
        <Text style={styles.videoItemNumber}>
          {index}
        </Text>
        <SingleReel
          item={item}
          index={index}
          currentIndex={currentVisibleIndex}
        />
      </View>
    );
  };

  return (
    <View style={[DimensionStyles]}>
      <View style={styles.container}>
        <Ionicons
          name="arrow-back"
          size={moderateScale(30)}
          onPress={() => navigation.goBack()}
          color={Color.white}
        />
        <Text style={styles.titleText}>Podcasts</Text>
      </View>
      <FlatList
        data={data}
        renderItem={VideoItem}
        initialNumToRender={1}
        keyExtractor={item => item.podcastId}
        pagingEnabled
        horizontal={false}
        snapToAlignment="start"
        snapToInterval={height}
        initialScrollIndex={initialIndex}
        decelerationRate={0.9}
        getItemLayout={(data, index) => ({
          length: height,
          offset: height * index,
          index,
        })}
        onViewableItemsChanged={onViewableItemsChangedRef.current}
        viewabilityConfig={viewabilityConfigRef.current}
        showsVerticalScrollIndicator={false}
        onEndReached={fetchMoreData}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() =>
          loading ? <ActivityIndicator size="large" color="#0000ff" /> : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    zIndex: 1,
    padding: 10,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 20,
  },
  videoContainer: {
    backgroundColor: 'black',
    position: 'absolute',
  }, 
  videoItemNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 20,
  },
  video: {
    width,
    height,
    backgroundColor: 'black',
  },
});

export default VideoReels;
