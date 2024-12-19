import React, {useState, useEffect, useMemo} from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

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
import {
  getPodcastLikeList,
  getPodcastViewList,
  getPostLikeList,
  getProfileViewerList,
} from '../../BrokerAppCore/services/new/postServices';
import {useApiPagingWithtotalRequest} from '../hooks/useApiPagingWithtotalRequest';
import UserAvartarWithName from './UserAvartarWithName';

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

const ProfileViewerList: React.FC = ({
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
  const [isPageLoading, setPageLoading] = useState(true);
  const [isInfiniteLoading, setInfiniteLoading] = useState(false);
  const [userLists, setuserLists] = useState();

  const {
    data,
    status,
    error,
    execute,
    loadMore: executeloadMore,
    pageSize_Set,
    currentPage_Set,
    hasMore_Set,
  } = useApiPagingWithtotalRequest(
    getProfileViewerList,
    setInfiniteLoading,
    15,
  );

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
      currentPage_Set(1);
      hasMore_Set(true);
      setPageLoading(true);
      await execute(user.userId);

      pageTitle(`Profile Viewers`);
    } catch (error) {
    } finally {
      setPageLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getList();
    }, [user, pageTitle]),
  );

  useEffect(() => {
    // Bind data to the state when the data fetch is successful
    //console.log(followerdata);

    if (status === 200 && data?.length > 0) {
      // console.log(followerdata);
      setuserLists(data);
    }
  }, [status, data]);

  const loadMore = async () => {
    if (!isInfiniteLoading) {
      console.log('loadMore');
      await executeloadMore(user.userId);
    }
  };
  if (isPageLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.background,
        }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  return (
    <ZSafeAreaView>
      <View style={localStyles.rootContainer}>
        <View style={{flex: 1}}>
          <FlatList
            data={userLists}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            initialNumToRender={5}
            maxToRenderPerBatch={5} // Default is 10
            removeClippedSubviews={true}
            renderItem={({item, index}) => (
              <View
                style={{
                  paddingVertical: 8,
                  borderBottomWidth: 1,
                  borderColor: Color.borderColor,
                }}>
                <UserAvartarWithName
                  userName={item?.viewerName}
                  userImage={item?.viewerProfileImage}
                  userId={item.viewerUserId}
                  loggedInUserId={user.userId}
                  isProfileView={true}
                  Viewon={item?.viewedOn}
                  key={index}
                />
              </View>
            )}
            contentContainerStyle={{
              paddingBottom: 50,
              flexGrow: 1,
            }}
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
});
export default AppBaseContainer(ProfileViewerList, '', true);
