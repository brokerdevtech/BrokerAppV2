import React, {useEffect, useState, useCallback, useMemo} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import {useSelector, shallowEqual} from 'react-redux';
import {FlatList} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {StackNav} from '../navigation/NavigationKeys';
import {styles as globalStyles} from '../themes';
import {imagesBucketcloudfrontPath} from '../config/constants';
import FastImage from '@d11/react-native-fast-image';
import ZText from './ZText';
import {Icon} from '../../components/ui/icon';
import {Close} from '../icons/Close';
import FollowUnfollowComponent from './FollowUnfollowButton';

// Moved outside to prevent re-definition on each render
const brokerData = [
  {
    id: '1',
    name: 'Design Hunter',
    username: 'faizur.rh',
    profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    id: '2',
    name: 'Design Hunter',
    username: 'dzhunter',
    profileImage: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
  {
    id: '3',
    name: 'Tech Guru',
    username: 'tech.guru',
    profileImage: 'https://randomuser.me/api/portraits/men/2.jpg',
  },
  {
    id: '4',
    name: 'Creative Pro',
    username: 'creative.pro',
    profileImage: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
];
const RenderBrokerItem = React.memo(({item, onPressBroker}) => {
  const getInitials = name => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };
  return (
    <View style={localStyles.card}>
      {/* Close button (X) */}
      <TouchableOpacity style={localStyles.closeButton}>
        <Icon name={Close} color="gray" />
      </TouchableOpacity>

      {/* Profile Image */}
      <Image
        source={{uri: item.profileImage}}
        style={localStyles.profileImage}
      />

      {/* Name and Username */}
      <ZText type={'M14'} style={localStyles.name}>
        {item.name}
      </ZText>
      <ZText type={'R12'} style={localStyles.username}>
        {item.username}
      </ZText>

      {/* Follow Button */}
      <FollowUnfollowComponent />
    </View>
  );
});

const Recommend = React.memo(() => {
  const navigation = useNavigation();
  const APPcity = useSelector(state => state.city, shallowEqual);
  const user = useSelector(state => state.user.user, shallowEqual);

  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [brokerList, setBrokerList] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const cityToShow = APPcity || (user && user.cityName);
  const onPressBroker = useCallback(
    (brokerName, profileImage, userId) => {
      navigation.push(StackNav.ProfileDetail, {
        userName: brokerName,
        userImage: profileImage,
        userId: userId,
        loggedInUserId: user.userId,
      });
    },
    [navigation, user.userId],
  );

  const renderBrokerItem = useCallback(
    ({item}) => <RenderBrokerItem item={item} onPressBroker={onPressBroker} />,
    [onPressBroker],
  );

  //   if (brokerList === null) {
  //     return <CarouselCardSkeleton />;
  //   }

  return (
    <View style={localStyles.container}>
      <View style={localStyles.storiesHeaderWrapper}>
        <ZText type={'R18'} style={{marginVertical: 20, marginLeft: 10}}>
          Recommended Brokers
        </ZText>
      </View>
      {brokerData?.length > 0 ? (
        <FlatList
          horizontal
          data={brokerData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderBrokerItem}
          contentContainerStyle={{paddingHorizontal: 20, paddingVertical: 10}}
          ItemSeparatorComponent={() => <View style={{marginRight: 10}} />}
          showsHorizontalScrollIndicator={false}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : null
          }
        />
      ) : (
        <Text style={localStyles.noDataText}>
          No recommended broker in your city.
        </Text>
      )}
    </View>
  );
});

export default Recommend;

const localStyles = StyleSheet.create({
  initialsBackground: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#CCCCCC', // You can choose a default color
  },
  initialsText: {
    marginTop: -20,
    fontSize: 20,
    color: '#FFFFFF', // White color for the initials
  },
  container: {
    flex: 1,
    width: '100%',
    marginTop: 10,
  },
  storiesHeaderWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginLeft: 10,
  },
  otherStories: {
    width: 100,
    height: 120,
    borderRadius: 10,
  },
  otherStoriesB: {
    width: 100,
    height: 120,
    borderRadius: 10,
  },
  storyRound: {
    height: 120,
    width: 100,
    borderRadius: 10,
  },
  otherStoryImageWrapper: {
    margin: 6,
    borderRadius: 10,
  },
  profileName: {
    fontSize: 14,
    textAlign: 'center',
    color: 'white',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
    padding: 5,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  noDataText: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: 160,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
    alignItems: 'center',
    marginRight: 10, // Space between cards
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  name: {
    // fontSize: 18,
    // fontWeight: '600',
    marginBottom: 5,
    textAlign: 'center',
  },
  username: {
    color: 'gray',
    marginBottom: 20,
    textAlign: 'center',
  },
  followButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ff3d00',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  followText: {
    color: '#ff3d00',
    fontSize: 14,
    marginRight: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});
