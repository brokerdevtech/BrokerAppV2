import React, {useState, useEffect, useMemo} from 'react';
import {FlatList, ScrollView, StyleSheet, View} from 'react-native';

import {useSelector} from 'react-redux';
import {styles} from '../themes';

import {useFocusEffect} from '@react-navigation/native';

import ZSafeAreaView from './ZSafeAreaView';
import ZInput from './ZInput';
import {Icon, SearchIcon} from '../../components/ui/icon';
import UserAvartarWithNameComponent from './UserAvartarWithNameComponent';
import LoadingSpinner from './LoadingSpinner';
import {moderateScale} from '../config/constants';
import AppBaseContainer from '../hoc/AppBaseContainer_old';
import {Color} from '../styles/GlobalStyles';
import {useApiRequest} from '../hooks/useApiRequest';
import {
  getFollowerList,
  getFollowingList,
} from '../../BrokerAppCore/services/new/profileServices';
import {useApiPagingRequest} from '../hooks/useApiPagingRequest';
import ZText from './ZText';
import useUserJourneyTracker from '../hooks/Analytics/useUserJourneyTracker';

const DEBOUNCE_DELAY = 300;
const staticData = [
  {
    profileImg: '',
    fullName: 'Deepika Sharma',
    city: 'New Delhi',
    following: true,
    userId: 8,
  },
];

const FollowerList: React.FC = ({
  isPageSkeleton,
  toggleSkeletonoff,
  toggleSkeletonOn,
  setLoading,
  navigation,
  user,
  color,
  route,
  pageTitle,
}) => {
  const colors = useSelector(state => state.theme.theme);
  const [issearch, setissearch] = useState(false);
  const [ListType, setlistType] = useState(route.params?.type);
  const [paramsuserId, setparamsuserId] = useState(route.params?.userId);
  const [isInfiniteLoading, setInfiniteLoading] = useState(false);

  const [searchText, setSearch] = useState('');
  const [userLists, setuserLists] = useState();
  const listType = route.params?.type;
  const {logButtonClick} = useUserJourneyTracker(
    `My ${route.params.listType} Page`,
  );
  const {
    data: followerdata,
    status: followerstatus,
    error: followererror,
    execute: followerexecute,
    loadMore: followerLoadMore,
    pageSize_Set: followerpageSize_Set,
    currentPage_Set: followercurrentPage_Set,
    hasMore_Set: followerhasMore_Set,
  } = useApiPagingRequest(getFollowerList, setInfiniteLoading);
  const {
    data: followingdata,
    status: followingstatus,
    error: followingerror,
    execute: followingexecute,
    loadMore: followingoadMore,
    pageSize_Set: followingpageSize_Set,
    currentPage_Set: followingcurrentPage_Set,
    hasMore_Set: followinghasMore_Set,
  } = useApiPagingRequest(getFollowingList, setInfiniteLoading);
  const BlurredStyle = {
    backgroundColor: colors.inputBg,
    borderColor: colors.btnColor1,
  };
  const FocusedStyle = {
    backgroundColor: colors.inputFocusColor,
    borderColor: colors.primary,
  };
  const BlurredIconStyle = colors.grayScale5;
  const FocusedIconStyle = colors.primary;
  const [searchInputStyle, setSearchInputStyle] = useState(BlurredStyle);
  const [searchIconStyle, setSearchIconStyle] = useState(BlurredIconStyle);

  const onSearchInput = async (text: string) => {
    //

    setSearch(text);

    await getList();
  };

  const onHighlightInput = () => {
    setSearchInputStyle(FocusedStyle);
    setSearchIconStyle(FocusedIconStyle);
  };
  const onUnHighlightInput = () => {
    setSearchInputStyle(BlurredStyle);
    setSearchIconStyle(BlurredIconStyle);
  };
  const getList = async () => {
    try {
      if (listType === 'Followers') {
        followercurrentPage_Set(1);
        followerhasMore_Set(true);
        await followerexecute(route.params.userId, searchText);
      } else {
        followingcurrentPage_Set(1);
        followinghasMore_Set(true);
        await followingexecute(route.params.userId, searchText);
      }
      pageTitle(`${listType}`);
    } catch (error) {}
  };

  useFocusEffect(
    React.useCallback(() => {
      setSearch('');
      getList();
    }, [listType, route.params.userId, pageTitle]),
  );

  useEffect(() => {
    // Bind data to the state when the data fetch is successful
    //console.log(followerdata);

    if (followerstatus === 200 && followerdata?.length > 0) {
      // console.log(followerdata);
      setuserLists(followerdata);
    } else if (followingstatus === 200 && followingdata?.length > 0) {
      setuserLists(followingdata);
    }
  }, [followerstatus, followerdata, followingstatus, followingdata]);

  const loadMore = async () => {
    if (!isInfiniteLoading) {
      if (listType === 'Followers') {
        await followerLoadMore(route.params.userId, searchText);
      } else {
        await followingoadMore(route.params.userId, searchText);
      }
    }
  };

  const EmptyListComponent = () => (
    <View style={localStyles.emptyContainer}>
      <ZText type={'R16'} style={localStyles.emptyText}>
        No data available
      </ZText>
    </View>
  );

  return (
    <ZSafeAreaView>
      <View style={localStyles.rootContainer}>
        <ZInput
          placeHolder={String.search}
          _value={searchText}
          keyBoardType={'default'}
          autoCapitalize={'none'}
          insideLeftIcon={() => <Icon as={SearchIcon} />}
          toGetTextFieldValue={onSearchInput}
          inputContainerStyle={[
            {backgroundColor: colors.inputBg},
            localStyles.inputContainerStyle,
            // searchInputStyle,
          ]}
          inputBoxStyle={localStyles.inputBoxStyle}
          _onFocus={onHighlightInput}
          onBlur={onUnHighlightInput}
        />
        <View style={{flex: 1}}>
          <FlatList
            data={userLists}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            // initialNumToRender={2}
            // maxToRenderPerBatch={4} // Default is 10
          //  removeClippedSubviews={true}
            renderItem={({item, index}) => (
              <View
                style={{
                  paddingVertical: 8,
                  borderBottomWidth: 1,
                  borderColor: Color.borderColor,
                }}>
                <UserAvartarWithNameComponent
                  userName={item?.firstName + ' ' + item?.lastName}
                  userImage={item?.profileImage}
                  userDescription={item?.city}
                  isFollowed={item?.following}
                  userId={
                    ListType == 'Following'
                      ? item.followingUserId
                      : item.followerId
                  }
                  loggedInUserId={user.userId}
                  type=""
                  key={index}
                />
              </View>
            )}
            contentContainerStyle={{
              paddingBottom: 50,
              flexGrow: 1,
            }}
            ListEmptyComponent={<EmptyListComponent />}
            keyExtractor={(item, index) => index.toString()}
            onEndReachedThreshold={0.5}
            onEndReached={loadMore}
            ListFooterComponent={
              isInfiniteLoading ? (
                <LoadingSpinner isVisible={isInfiniteLoading} />
              ) : null
            }
          />
          {/* {userLists !== null && userLists.length < 1 && <NoDataFound />} */}
        </View>

        {/* <>
    
    {userLists.length < 1 && search.length>3 && issearch && (<NoDataFound />)}
    {userLists.length < 1 && search.length<3 && ( <ZText
          type={'s18'}
          align={'center'}
          style={styles.pb20}
          color={colors.primary}>
          {`Enter minimum 3 characters to search`}
        </ZText>)}
  </> */}
      </View>
    </ZSafeAreaView>
  );
};
const localStyles = StyleSheet.create({
  rootContainer: {
    ...styles.ph20,
    ...styles.pb20,
    flex: 1,
  },
  inputContainerStyle: {
    borderRadius: moderateScale(15),
    borderWidth: moderateScale(1),
  },
  inputBoxStyle: {
    ...styles.ph15,
  },
  emptyContainer: {
    display: 'flex',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flex: 1,
  },
  emptyText: {
    fontSize: 18,
    color: 'grey',
  },
});
export default AppBaseContainer(FollowerList, '', true);
