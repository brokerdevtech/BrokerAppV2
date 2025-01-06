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
  getUserList,
} from '../../BrokerAppCore/services/new/profileServices';
import {useApiPagingRequest} from '../hooks/useApiPagingRequest';
import {useApiPagingWithtotalRequest} from '../hooks/useApiPagingWithtotalRequest';
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

const BrokerList: React.FC = ({
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
  const {logButtonClick} = useUserJourneyTracker(`Search Broker Page`);
  const [searchText, setSearch] = useState('');
  const [userLists, setuserLists] = useState();
  const listType = route.params?.type;
  const {
    data,
    status,
    error,
    execute,
    loadMore,
    pageSize_Set,
    currentPage_Set,
    hasMore_Set,
    totalPages,
    recordCount,
  } = useApiPagingWithtotalRequest(getUserList, setInfiniteLoading, 5);

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
  //  console.log(text);
    setSearch(text);
    setInfiniteLoading(true);
    await getList(text);
  };

  const onHighlightInput = () => {
    setSearchInputStyle(FocusedStyle);
    setSearchIconStyle(FocusedIconStyle);
  };
  const onUnHighlightInput = () => {
    setSearchInputStyle(BlurredStyle);
    setSearchIconStyle(BlurredIconStyle);
  };
  const getList = async text => {
    try {
      currentPage_Set(1);
      hasMore_Set(true);

      await execute(user.userId, text);

      pageTitle(`Brokers`);
    } catch (error) {}
  };

  useEffect(() => {
    if (data) {
 //     console.log(data, 'data broker');
      setuserLists(data);
    }
  }, [data]);

  const loadMorefaltlist = async () => {
    if (!isInfiniteLoading) {
      await loadMore(user.userId, searchText);
    }
  };

  return (
    <ZSafeAreaView>
      <View style={localStyles.rootContainer}>
        <ZInput
          placeHolder={'Search first/last name'}
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
            extraData={data}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            initialNumToRender={5}
            maxToRenderPerBatch={5} // Default is 10
            // removeClippedSubviews={true}
            renderItem={({item, index}) => {
        //      console.log('Rendering item:', item);
              return (
                <View
                  style={{
                    paddingVertical: 8,
                    borderBottomWidth: 1,
                    borderColor: Color.borderColor,
                  }}>
                  <UserAvartarWithNameComponent
                    userName={item.fullName}
                    userImage={item?.profileImg}
                    userDescription={item?.city}
                    isFollowed={item?.following}
                    userId={item.userId}
                    loggedInUserId={user.userId}
                    type="search"
                    key={index}
                  />
                </View>
              );
            }}
            contentContainerStyle={{
              paddingBottom: 50,
              flexGrow: 1,
            }}
            keyExtractor={(item, index) => index.toString()}
            onEndReachedThreshold={0.5}
            onEndReached={loadMorefaltlist}
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
export default AppBaseContainer(BrokerList, 'Search Brokers', true);
