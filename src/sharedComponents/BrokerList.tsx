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
import { useApiPagingRequest } from '../hooks/useApiPagingRequest';
import { useApiPagingWithtotalRequest } from '../hooks/useApiPagingWithtotalRequest';

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

      currentPage_Set(1);
      hasMore_Set(true);
   console.log(user);
        await execute(user.userId, searchText);
    
      pageTitle(`Brokers`);
    } catch (error) {}
  };




  useEffect(() => {
    // Bind data to the state when the data fetch is successful
//console.log(followerdata);

setuserLists(data);
     // console.log(followerdata);
   
  }, [data]);


  const loadMorefaltlist = async () => {
    if(!isInfiniteLoading)
  {  

    await loadMore(user.userId, searchText);

  }
  };

 


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
     <View style={{ flex: 1 }}>
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
            )}
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
export default AppBaseContainer(BrokerList, '', true);
