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
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

import {styles as globalStyles} from '../../themes';

import {useSelector} from 'react-redux';

import ZText from '../../sharedComponents/ZText';
import ZAvatarInitials from '../../sharedComponents/ZAvatarInitials';

import {checkPermission} from '../../utils/helpers';
import {moderateScale, PermissionKey} from '../../config/constants';
import {HStack} from '../../../components/ui/hstack';
import {Skeleton} from '../../../components/ui/skeleton';
import {RootState} from '../../../BrokerAppCore/redux/store/reducers';

import {VStack} from '../../../components/ui/vstack';
import CircularSkeleton from '../../sharedComponents/Skeleton/CircularSkeleton';
import {getDashboardStory} from '../../../BrokerAppCore/services/new/story';
import {useApiRequest} from '../../hooks/useApiRequest';
import {useApiPagingRequest} from '../../hooks/useApiPagingRequest';

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

const UserStories = React.memo(() => {
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
  const [StoryData, setStoryData]: any[] = useState(null);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const {
    data: Storiesdata,
    status: Storiesstatus,
    error: Storieserror,
    execute: Storiesexecute,
    loadMore: StoriesLoadMore,
    pageSize_Set: StoriespageSize_Set,
    currentPage_Set: StoriescurrentPage_Set,
    hasMore_Set: StorieshasMore_Set,
  } = useApiPagingRequest(getDashboardStory, setInfiniteLoading);
  const getList = async () => {
    try {
      StoriescurrentPage_Set(1);
      StorieshasMore_Set(true);
      Storiesexecute(user.userId);
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
    if (Storiesstatus === 200) {
      setStoryData(Storiesdata.data.storyList);
    }
  }, [Storiesstatus, Storiesdata]);

  const loadMore = async () => {
    if (!isInfiniteLoading) {
      await StoriesLoadMore(user.userId);
    }
  };

  const onPressStory = item => {
    if (item.userId == user.userId && !permissionGrantedmyStory) {
      Alert.alert("You don't have permission to view Story");
    } else {
      navigation.navigate('StoryView', {userImage: item});
    }
  };
  const renderItem = useCallback(
    ({item}) => (
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
        <ZText type={'r16'} style={localStyles.itemUsername}>
          {item.postedBy}
        </ZText>
      </Pressable>
    ),
    [],
  );
  const EmptyListComponent = () => (
    <View style={localStyles.emptyContainer}>
      <Text style={localStyles.emptyText}>No Stories available</Text>
    </View>
  );
  console.log(StoryData, 'dat');
  return (
    <VStack style={{paddingHorizontal: 20, backgroundColor: 'white'}}>
      {/* <ZText type="b22" style={{...globalStyles.mt8}}>
        Stories
      </ZText> */}
      <HStack>
        {StoryData === null || loading ? (
          <SkeletonPlaceholder />
        ) : (
          <FlatList
            data={StoryData}
            style={{flex: 1}}
            keyExtractor={item => item.userId}
            renderItem={renderItem}
            horizontal={true}
            initialNumToRender={2}
            maxToRenderPerBatch={4}
            ListEmptyComponent={
              permissionGrantedDashBoard ? (
                <EmptyListComponent />
              ) : (
                <View style={localStyles.emptyContainer}>
                  <Text style={localStyles.emptyText}>
                    You don't Have Permission to see stories
                  </Text>
                </View>
              )
            }
            showsHorizontalScrollIndicator={false}
            removeClippedSubviews={true}
            contentContainerStyle={localStyles.mainContainer}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : null
            }
          />
        )}
      </HStack>
    </VStack>
  );
});

const localStyles = StyleSheet.create({
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
  },
  avatarWrapper: {
    backgroundColor: '#bc4a50',
    padding: moderateScale(3),
    borderRadius: moderateScale(50),
  },
  itemUsername: {
    ...globalStyles.mt5,
    textTransform: 'capitalize',
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
