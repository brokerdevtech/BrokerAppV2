/* eslint-disable no-trailing-spaces */
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

import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {StackNav} from '../navigation/NavigationKeys';
import {styles as globalStyles, styles} from '../themes';
import {
  getHeight,
  imagesBucketcloudfrontPath,
  moderateScale,
} from '../config/constants';
import FastImage from '@d11/react-native-fast-image';
import ZText from './ZText';
import {CloseCircleIcon, Icon} from '../../components/ui/icon';
import {Close} from '../icons/Close';
import FollowUnfollowComponent from './FollowUnfollowButton';
import {Close_light_icon} from '../assets/svg';

import {getRecommendedBrokerList} from '../../BrokerAppCore/services/new/recomendedBroker';
import {useApiPagingRequest} from '../hooks/useApiPagingRequest';
import LoadingSpinner from './LoadingSpinner';
import {useApiRequest} from '../hooks/useApiRequest';
import AppBaseContainer from '../hoc/AppBaseContainer_old';
import ZAvatarInitials from './ZAvatarInitials';
import {Color} from '../styles/GlobalStyles';
import RectangularCardSkeleton from './Skeleton/RectangularCardSkeleton';
import RecommendedBrokersSkeleton from './Skeleton/RecomBrokerSkelton';

const RenderBrokerItem = React.memo(({item}) => {
  const navigation = useNavigation();
  const getInitials = name => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };
  const onPressUser = () => {
    navigation.navigate('ProfileDetail', {
      userName: item.userName,
      userImage: item.userImage,
      userId: item.userId,
      loggedInUserId: item.loggedInUserId,
    });
  };
  const truncatedFullName =
    item.brokerName.length > 10
      ? item.brokerName.slice(0, 10) + '...'
      : item.brokerName;
  return (
    <View style={localStyles.card}>
      <TouchableOpacity style={localStyles.closeButton}>
        {/* <Icon as={Close_light_icon} size='xl' /> */}
      </TouchableOpacity>

      <ZAvatarInitials
        sourceUrl={item.profileImage}
        name={item.brokerName}
        style={localStyles.profileImage}
        iconSize="lg"
      />

      <ZText
        type={'M14'}
        style={localStyles.name}
        align={undefined}
        color={undefined}
        children={undefined}>
        {truncatedFullName}
      </ZText>
      <TouchableOpacity
        style={localStyles.buttonContainer}
        onPress={onPressUser}>
        <ZText type={'R14'} color={Color.primary}>
          View Profile
        </ZText>
      </TouchableOpacity>
      {/* <FollowUnfollowComponent isFollowing={undefined} followedId={undefined} onFollow={undefined} onUnfollow={undefined} /> */}
    </View>
  );
});

const Recommend = React.memo(categoryIds => {
  const navigation = useNavigation();
  const route = useRoute();
  const AppLocation = useSelector((state: RootState) => state.AppLocation);
  const user = useSelector(state => state.user.user, shallowEqual);
  const [isInfiniteLoading, setInfiniteLoading] = useState(false);
  const [categoryId, setCategoryId] = useState(route.params.categoryId);
  const [brokerList, setBrokerList] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  // console.log(AppLocation)
  // console.log(user);
  const {
    data: brokersdata,
    status: brokersstatus,
    error: brokerserror,
    execute: brokersexecute,
    loadMore: brokersLoadMore,
    pageSize_Set: brokerspageSize_Set,
    currentPage_Set: brokerscurrentPage_Set,
    hasMore_Set: brokershasMore_Set,
  } = useApiPagingRequest(getRecommendedBrokerList, setInfiniteLoading);
  const getList = async () => {
    try {
      brokerscurrentPage_Set(1);
      brokershasMore_Set(true);
      brokersexecute(user.userId, categoryId, AppLocation.City);
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getList();
    }, []),
  );

  useEffect(() => {
    // Bind data to the state when the data fetch is successful
    // console.log(brokersstatus, 'redf');
    // console.log("brokersdata",brokersdata.data.records);
    if (brokersstatus === 200 && brokersdata?.data?.records?.length > 0) {
      // console.log('brokersdata', brokersdata.data.records);
      setBrokerList(brokersdata.data.records);
    } else {
      setBrokerList([]); // In case there is no data
    }
  }, [brokersstatus, brokersdata]);

  const loadMore = async () => {
    if (!isInfiniteLoading) {
      await brokersLoadMore(user.userId, categoryId, AppLocation.City);
    }
  };

  const renderBrokerItem = useCallback(({item}) => (
    <RenderBrokerItem item={item} />
  ));

  //   if (brokerList === null) {
  //     return <CarouselCardSkeleton />;
  //   }
  console.log(brokerList, 'BrokerList');
  // console.log(brokersdata);
  return (
    <View style={localStyles.container}>
      <View style={localStyles.storiesHeaderWrapper}>
        <ZText type={'R18'} style={{marginVertical: 5, marginLeft: 10}}>
          Recommended Brokers
        </ZText>
      </View>
      {/* <RecommendedBrokersSkeleton /> */}
      {brokerList?.length > 0 ? (
        <FlatList
          horizontal
          data={brokerList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderBrokerItem}
          contentContainerStyle={{paddingHorizontal: 20, paddingVertical: 5}}
          ItemSeparatorComponent={() => <View style={{marginRight: 10}} />}
          showsHorizontalScrollIndicator={false}
          onEndReachedThreshold={0.5}
          onEndReached={loadMore}
          ListFooterComponent={
            isInfiniteLoading ? (
              <LoadingSpinner isVisible={isInfiniteLoading} />
            ) : null
          }
        />
      ) : brokerList == null ? (
        <RecommendedBrokersSkeleton />
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
    // marginTop: 10,
    backgroundColor: '#F7F8FA',
    paddingVertical: 20,
  },
  storiesHeaderWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
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
    padding: 10,
    width: 120,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
    alignItems: 'center',
    marginRight: 5, // Space between cards
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  buttonContainer: {
    // ...styles.ph15,
    // height: getHeight(25),
    paddingVertical: 5,
    paddingHorizontal: 5,
    minWidth: getHeight(80),
    borderRadius: moderateScale(8),
    borderWidth: moderateScale(1),
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    borderColor: Color.primary,
    color: Color.primary,
  },
  name: {
    // fontSize: 18,
    // fontWeight: '600',
    marginBottom: 10,
    marginVertical: 15,
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
