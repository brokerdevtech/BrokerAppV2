import React, { useCallback, useState } from 'react';
import { FlatList, TouchableOpacity, Image, View, Button,StyleSheet, Alert, Pressable,Text, ActivityIndicator, Dimensions } from 'react-native';
import { useStory } from './StoryContext';
import { HStack } from '../../components/ui/hstack';
import CircularSkeleton from '../sharedComponents/Skeleton/CircularSkeleton';
import { useSelector } from 'react-redux';
import { RootState } from '../../BrokerAppCore/redux/store/reducers';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import { checkPermission } from '../utils/helpers';
import { moderateScale, PermissionKey } from '../config/constants';
import ZAvatarInitials from '../sharedComponents/ZAvatarInitials';
import ZText from '../sharedComponents/ZText';
import { VStack } from '../../components/ui/vstack';
import {styles as globalStyles} from '../themes';
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
  
const StoriesFlatList = () => {
  const { stories, loadMoreStories, totalPages, recordCount,loading,setCurrentUser  } = useStory();
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

const onPressStory = (item,index) => {

    if (item.userId == user.userId && !permissionGrantedmyStory) {
      Alert.alert("You don't have permission to view Story");
    } else if (item.userId !== user.userId && !permissionGrantedDashBoard) {
      Alert.alert("You don't have permission to view Story");
    } else {
      console.log("onPressStoryonPressStoryonPressStoryonPressStory");
      // console.log(item);
      // console.log(index);
      navigation.navigate('StoryViewer', { index });
      //  setCurrentUser(index) 
     // navigation.navigate('StoryView', {userImage: item});
    }
  };
  const renderItem = useCallback(({item,index}) => {
    // console.log("renderItem",index);
    const displayName = item.postedBy;
    // const maxNameLength = Math.floor(Dimensions.get('window').width / 40);
    return (
      <Pressable
        style={localStyles.itemContainer}
        onPress={() => onPressStory(item,index)}>
        <View style={localStyles.avatarWrapper}>
          <View style={localStyles.itemInnerContainer}>
            <ZAvatarInitials
              item={item}
              onPress={() => onPressStory(item,index)}
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
  }, [stories]);

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
        ) : stories?.length === 0 ? (
          <EmptyListComponent />
        ) : (
          <FlatList
            data={stories}
            style={{flex: 1}}
            keyExtractor={(item) => item.userId.toString()}
            renderItem={renderItem}
            horizontal
            initialNumToRender={5}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={localStyles.mainContainer}
             onEndReached={loadMoreStories}
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


    // <View>
    //   <FlatList
    //     data={stories}
    //     keyExtractor={(item) => item.userId.toString()}
    //     horizontal
    //     renderItem={({ item, index }) => (
    //       <TouchableOpacity onPress={() => onStoryPress(index)}>
    //         <Image source={{ uri: `https://your-api.com${item.profileImage}` }} style={{ width: 60, height: 60, borderRadius: 30, marginRight: 10 }} />
    //       </TouchableOpacity>
    //     )}
    //     ListFooterComponent={totalPages > stories.length / recordCount ? <Button title="Load More" onPress={loadMoreStories} /> : null}
    //   />
    // </View>
  );
};

export default StoriesFlatList;
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