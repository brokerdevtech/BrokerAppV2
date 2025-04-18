/* eslint-disable react/no-unstable-nested-components */
import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  Pressable,
  FlatList,
  View,
  Text,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

import {styles as globalStyles} from '../../themes';

import {useSelector} from 'react-redux';

import ZText from '../../sharedComponents/ZText';
import ZAvatarInitials from '../../sharedComponents/ZAvatarInitials';

import {checkPermission} from '../../utils/helpers';
import {moderateScale, PermissionKey} from '../../config/constants';
import {HStack} from '../../../components/ui/hstack';

import {RootState} from '../../../BrokerAppCore/redux/store/reducers';

import {VStack} from '../../../components/ui/vstack';
import CircularSkeleton from '../../sharedComponents/Skeleton/CircularSkeleton';
import {getDashboardStory} from '../../../BrokerAppCore/services/new/story';


import {Color} from '../../styles/GlobalStyles';
import LoadingSpinner from '../../sharedComponents/LoadingSpinner';
import { useApiPagingWithDataRequestState } from '../../hooks/useApiPagingWithDataRequestState';

const SkeletonPlaceholder = () => {
  return (
    <HStack space={10} style={localStyles.skeletonContainer}>
      {Array.from({length: 6}).map((_, index) => (
        <View key={index} style={localStyles.skeletonItem}>
          <CircularSkeleton size={60} />
          <View style={localStyles.skeletonText} />
        </View>
      ))}
    </HStack>
  );
};

const UserStories = (Data) =>  {
  // console.log("UserStories");
  // console.log(Data);
  const user = useSelector((state: RootState) => state.user.user);
  const navigation = useNavigation();
  const [isInfiniteLoading, setInfiniteLoading] = useState(false);
  const userPermissions = useSelector(
    (state: RootState) => state.user.user.userPermissions,
  );
  const permissionGrantedDashBoard = checkPermission(
    userPermissions,
    PermissionKey.AllowViewDashboardStory,
  );
  const permissionGrantedmyStory = checkPermission(
    userPermissions,
    PermissionKey.AllowViewMyStory,
  );
  const [StoryData, setStoryData]: any[] = useState(Data.Data.data);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  let {
    data: Storiesdata,
    status: Storiesstatus,
    error: Storieserror,
    execute: Storiesexecute,
    loadMore: StoriesLoadMore,
    pageSize_Set: StoriespageSize_Set,
    currentPage_Set: StoriescurrentPage_Set,
    hasMore_Set: StorieshasMore_Set,
  } = useApiPagingWithDataRequestState(
    getDashboardStory,
    setInfiniteLoading,
    Data.Data.data,
  );
  const getList = async () => {
    try {
      setLoading(true);
      StoriescurrentPage_Set(1);
      StoriespageSize_Set(5);
      StorieshasMore_Set(true);
      if (Data != null && Data.Data != null) {
        setStoryData(Data.Data.data);
        set
        setLoading(false);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };


  // useFocusEffect(
  //   useCallback(() => {
  //     const fetchData = async () => {
  //       console.log('Fetch', Data);
  //       await getList();
  //       // console.log('Fetch', Data);
  //     };
  
  //     fetchData();
  //   }, [Data])
  // );
  useEffect(() => {
    const fetchData = async () => {
      await getList();

    };

    fetchData();
  }, [Data]);

  const loadMore = async () => {
 
    if (!isInfiniteLoading) {
      await StoriesLoadMore(user.userId);
    }
  };

  const onPressStory = item => {
    if (item.userId == user.userId && !permissionGrantedmyStory) {
      Alert.alert("You don't have permission to view Story");
    } else if (item.userId !== user.userId && !permissionGrantedDashBoard) {
      Alert.alert("You don't have permission to view Story");
    } else {
      navigation.navigate('StoryView', {userImage: item});
    }
  };
  const renderItem = useCallback(({item}) => {
    const displayName = item.postedBy;
    // const maxNameLength = Math.floor(Dimensions.get('window').width / 40);
    return (
      <Pressable
        style={localStyles.itemContainer}
        onPress={() => onPressStory(item)}>
        <View style={localStyles.avatarWrapper}>
          <View style={localStyles.itemInnerContainer}>
            <ZAvatarInitials
              item={item}
              onPress={() => onPressStory(item)}
              sourceUrl={item.profileImage}
              iconSize="md"
              name={item.postedBy}
            />
          </View>
        </View>
        <ZText
          type={'r14'}
          style={localStyles.itemUsername}
          numberOfLines={1} // Ensure ellipsis
          ellipsizeMode="tail">
          {/* {displayName.length > maxNameLength
            ? `${displayName.slice(0, maxNameLength)}...`
            : displayName} */}
          {displayName}
        </ZText>
      </Pressable>
    );
  }, []);

  const EmptyListComponent = () => (
    <View style={localStyles.emptyContainer}>
      <Text style={localStyles.emptyText}>No Stories available</Text>
    </View>
  );

  return (
    <VStack style={{paddingHorizontal: 20, backgroundColor: 'white'}}>
      <HStack>
        {loading ? (
          <SkeletonPlaceholder />
        ) : Storiesdata.length === 0 ? (
          <EmptyListComponent />
        ) : (
          <FlatList
            data={Storiesdata}
            style={{flex: 1}}
            keyExtractor={item => item.userId}
            renderItem={renderItem}
            horizontal
            initialNumToRender={5}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={localStyles.mainContainer}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              isInfiniteLoading ? (
                <ActivityIndicator
                  size="large"
                  color="#0000ff"
                  style={localStyles.loader}
                />
              ) : null
            }
          />
        )}
      </HStack>
    </VStack>
  );
};

const localStyles = StyleSheet.create({
  loader: {
    marginVertical: 20,
  },
  storiesHeaderWrapper: {
    marginLeft: 10,
  },
  emptyContainer: {
    display: 'flex',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  emptyText: {
    fontSize: 18,
    color: 'grey',
  },
  mainContainer: {
    ...globalStyles.pv10,
    ...globalStyles.ph9,
    flexGrow: 1,
  },
  itemContainer: {
    alignItems: 'center',
    ...globalStyles.mr10,
    width: 65,
  },
  avatarWrapper: {
    backgroundColor: '#bc4a50',
    padding: moderateScale(3),
    borderRadius: moderateScale(50),
  },
  itemUsername: {
    marginTop: 5,
    maxWidth: Dimensions.get('window').width * 0.3, // Limit text width to 30% of screen
    textAlign: 'center',
  },
  itemInnerContainer: {
    padding: moderateScale(4),
    borderRadius: moderateScale(50),
    backgroundColor: '#FFF',
  },
  itemImage: {
    height: 80,
    width: 80,
  },
  skeletonContainer: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  skeletonItem: {
    alignItems: 'center',
    marginLeft: 10,
  },
  skeletonText: {
    width: 50,
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginTop: 8,
  },
  // ... other styles
});

export default UserStories;
