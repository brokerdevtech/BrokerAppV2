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
  getPostLikeList,
  getStoryLikeList,
} from '../../BrokerAppCore/services/new/postServices';
import {useApiPagingWithtotalRequest} from '../hooks/useApiPagingWithtotalRequest';
import UserAvartarWithName from './UserAvartarWithName';
import NoDataFoundScreen from './NoDataFoundScreen';

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

const StoryLikeList: React.FC = ({
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

  const [paramsuserId, setparamsuserId] = useState(route.params?.userId);
  const [ActionId, setActionId] = useState(route.params?.ActionId);
  const [isInfiniteLoading, setInfiniteLoading] = useState(false);

  const [userLists, setuserLists] = useState();
  const listType = route.params?.type;
  const {
    data,
    status,
    error,
    execute,
    loadMore: executeloadMore,
    pageSize_Set,
    currentPage_Set,
    hasMore_Set,
  } = useApiPagingWithtotalRequest(getStoryLikeList, setInfiniteLoading, 10);

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
      await execute(ActionId, paramsuserId);

      pageTitle(`Likes`);
    } catch (error) {}
  };

  useFocusEffect(
    React.useCallback(() => {
      getList();
    }, [listType, route.params.userId, pageTitle]),
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
      await executeloadMore(ActionId, paramsuserId);
    }
  };

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
            // removeClippedSubviews={true}
            renderItem={({item, index}) => (
              <View
                style={{
                  paddingVertical: 8,
                  borderBottomWidth: 1,
                  borderColor: Color.borderColor,
                }}>
                <UserAvartarWithName
                  userName={item?.userName}
                  userImage={item?.profileImage}
                  userId={item.userId}
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
            ListEmptyComponent={() =>
              isInfiniteLoading ? null : data == null ? (
                <ActivityIndicator
                  size="large"
                  color="#0000ff"
                  style={localStyles.loader}
                />
              ) : (
                <NoDataFoundScreen />
              )
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
  loader: {
    marginVertical: 20,
  },
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
export default AppBaseContainer(StoryLikeList, '', true);
