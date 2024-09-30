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
  const [hasMoreData, setHasMoreData] = useState(true);
  const [page, setPage] = useState(1);
  const [searchText, setSearch] = useState('');
  const [userLists, setuserLists] = useState();
  const listType = route.params?.type;
  const {
    data: followerdata,
    status: followerstatus,
    error: followererror,
    execute: followerexecute,
  } = useApiRequest(getFollowerList);
  const {
    data: followingdata,
    status: followingstatus,
    error: followingerror,
    execute: followingexecute,
  } = useApiRequest(getFollowingList);
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

  const onSearchInput = (text: string) => {
    //
    setSearch(text);
    setPage(1);
  };

  const onHighlightInput = () => {
    setSearchInputStyle(FocusedStyle);
    setSearchIconStyle(FocusedIconStyle);
  };
  const onUnHighlightInput = () => {
    setSearchInputStyle(BlurredStyle);
    setSearchIconStyle(BlurredIconStyle);
  };
  useFocusEffect(
    React.useCallback(() => {
      const getList = async () => {
        try {
          setPage(1); // Reset page when focus changes
          if (listType === 'Followers') {
            await followerexecute(route.params.userId, '', page);
          } else {
            await followingexecute(route.params.userId, '', page);
          }
          pageTitle(`${listType}`);
        } catch (error) {}
      };
      getList();
    }, [listType, route.params.userId, pageTitle]),
  );

  useEffect(() => {
    if (followerstatus === 200) {
      setuserLists(followerdata.data.followerList);
    } else if (followingstatus === 200) {
      setuserLists(followingdata.data.followingList);
    }
  }, [followerstatus, followingstatus]);

  const loadMore = async () => {
    if (
      !isInfiniteLoading &&
      (followerstatus === 200 || followingstatus === 200)
    ) {
      setInfiniteLoading(true);
      const nextPage = page + 1;
      try {
        if (listType === 'Followers') {
          await followerexecute(route.params.userId, '', nextPage);
        } else {
          await followingexecute(route.params.userId, '', nextPage);
        }
        setPage(nextPage);
      } catch (error) {}
      setInfiniteLoading(false);
    }
  };

  useEffect(() => {
    if (followerstatus === 200 && followerdata?.data.followerList.length > 0) {
      setuserLists(prevLists => [
        ...prevLists,
        ...followerdata?.data.followerList,
      ]);
    } else if (
      followingstatus === 200 &&
      followingdata?.data.followingList.length > 0
    ) {
      setuserLists(prevLists => [
        ...prevLists,
        ...followingdata?.data.followingList,
      ]);
    }
  }, [followerdata, followingdata]);

  console.log(userLists, 'list');
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
        <View>
          <FlatList
            data={userLists}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
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
              paddingBottom: 60,
            }}
            keyExtractor={(item, index) => index.toString()}
            onEndReachedThreshold={0.1}
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
});
export default AppBaseContainer(FollowerList, '', true);
