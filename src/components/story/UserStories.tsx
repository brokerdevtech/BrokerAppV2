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
import {getDashboardStory} from '../../../BrokerAppCore/services/Story';
import {VStack} from '../../../components/ui/vstack';

const StoriesSkeleton = () => {
  return (
    <HStack space={2} style={globalStyles.p5}>
      {Array.from({length: 8}).map((_, index) => (
        <Skeleton key={index} variant="rounded" />
      ))}
    </HStack>
  );
};

const UserStories = React.memo(({}) => {
  const user = useSelector((state: RootState) => state.user.user);
  const navigation = useNavigation();

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
  const fetchMoreData = async () => {
    if (loading || !hasMoreData || !permissionGrantedDashBoard) return; // Check if already loading or no more data

    setLoading(true); // Set loading state
    try {
      //
      // Fetch next page of data
      const nextPage = page + 1;
      const result = await getDashboardStory(user.userId, nextPage, 5);

      if (result.data.storyList.length > 0) {
        setStoryData(prevData => [...prevData, ...result.data.storyList]);
        setPage(nextPage);
      } else {
        setHasMoreData(false); // Set flag when no more data is available
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching more data:', error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };
  const getStory = async () => {
    if (!permissionGrantedDashBoard) {
      setStoryData([]);
      setLoading(false);
      return;
    }
    try {
      const result = await getDashboardStory(user.userId, 1, 5);
      //
      if (result.data) {
        setStoryData(result?.data?.storyList);

        //  setLoading(false);
      } else {
        //  setLoading(false);
        setStoryData([]);
      }
    } catch (error) {
      setStoryData([]);
      console.error('Error fetching data:', error);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        // toggleSkeletonOn();

        setHasMoreData(true);

        setPage(1);
        setLoading(true);

        try {
          // Await for the getPosts function to complete

          await getStory();
        } catch (error) {
          console.error('Error fetching posts:', error);
          // Handle the error appropriately
        }

        // After fetching data, set loading to false
        setLoading(false);
      };
      fetchData();
    }, []),
  );

  // useFocusEffect(
  //   React.useCallback(() => {
  //   setStoryData(stories);
  //  setPage(1);
  //  setLoading(false);
  // }, []));
  // const onPressStory = useCallback(
  //   userImage => {
  //     navigation.navigate(StackNav.StoryView, {
  //       userImage: userImage,
  //     });
  //   },
  //   [navigation],
  // );

  // const onPressStory = item => {
  //   if (item?.userId === user.userId) {
  //     navigation.navigate(TabNav.Profile);
  //   } else {
  //     navigation.push(StackNav.ProfileDetail, {
  //       userName: item?.postedBy,
  //       userImage: item?.profileImage,
  //       userId: item?.userId,
  //       loggedInUserId: user.userId,
  //       // connectionId: connectionId,
  //     });
  //   }
  // };
  const onPressStory = item => {
    // navigation.navigate(StackNav.StoryView, {
    //   userImage: item,
    // });
    if (item.userId == user.userId && !permissionGrantedmyStory) {
      Alert.alert("You don't have permission to view Story");
    } else {
      navigation.navigate('StoryView', {userImage: item});
    }
  };
  const renderItem = ({item}) => (
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
  );
  const EmptyListComponent = () => (
    <View style={localStyles.emptyContainer}>
      <Text style={localStyles.emptyText}>No Stories available</Text>
    </View>
  );
  return (
    <VStack style={{ paddingHorizontal: 20}}>
      {/* <ZText type="b22" style={{...globalStyles.mt8}}>
        Stories
      </ZText> */}
      <HStack>
        {StoryData === null ? (
          <StoriesSkeleton />
        ) : (
          <FlatList
            data={StoryData}
            style={{flex: 1}}
            keyExtractor={item => item.userId}
            renderItem={renderItem}
            horizontal={true}
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
            contentContainerStyle={localStyles.mainContainer}
            onEndReached={fetchMoreData}
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
  // ... other styles
});

export default UserStories;
