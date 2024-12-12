import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Share,
} from 'react-native';
import {SetPostLikeUnLike} from '../../BrokerAppCore/services/new/dashboardService';
import {HStack} from '../../components/ui/hstack';
import {VStack} from '../../components/ui/vstack';
import {
  ArrowUpIcon,
  EditIcon,
  FavouriteIcon,
  Icon,
  MessageCircleIcon,
} from '../../components/ui/icon';
import {bookmark_icon, share_PIcon} from '../assets/svg';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import ZText from './ZText';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetFooter,
  BottomSheetTextInput,
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet';
import {Box} from '../../components/ui/box';
import {Button, ButtonIcon} from '../../components/ui/button';
import {useApiPagingWithtotalRequest} from '../hooks/useApiPagingWithtotalRequest';
import {
  addHaveABuyer,
  GetCommentList,
  GetPostInsights,
  RemoveHaveABuyer,
} from '../../BrokerAppCore/services/new/postServices';
import LoadingSpinner from './LoadingSpinner';
import ZAvatarInitials from './ZAvatarInitials';
import moment from 'moment';
import TextWithPermissionCheck from './TextWithPermissionCheck';
import {useSelector} from 'react-redux';
import {RootState} from '../../BrokerAppCore/redux/store/reducers';
import {moderateScale, PermissionKey} from '../config/constants';
import TouchableOpacityWithPermissionCheck from './TouchableOpacityWithPermissionCheck';
import {Like, UnLike, Send, CloseIcon, BuyerActive, Buyer,filter} from '../assets/svg';
import CommentBottomSheet from './CommentBottomSheet';
import {useNavigation} from '@react-navigation/native';
import {
  PostUnLIke,
  PostLike as PostLikeApi,
} from '../../BrokerAppCore/services/postService';
const PostActions = ({
  item,
  User,
  listTypeData,
  onUpdateLikeCount,
  PageName = 'ItemList',
  isrefresh=0,
}) => {
 //console.log(item);
  const [isInfiniteLoading, setInfiniteLoading] = useState(false);
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
  } = useApiPagingWithtotalRequest(GetCommentList, setInfiniteLoading, 15);
  const [isOpenArray, setisOpenArray] = useState([]);
  const navigation = useNavigation();
  const [PostLike, SetPostLike] = useState(item.userLiked === 1);
  const [israisedPostBuyerHand, setisraisedPostBuyerHand] = useState(
    item?.raisedPostBuyerHand === 0 ? false : true,
  );
  const [PostlikesCount, SetPostlikesCount] = useState(item.likes);

  const commentSheetRef = useRef(null);
  const [cardComment, setCardComment] = useState(item.comments);
  const snapPoints = useMemo(() => ['60%'], []);

  const userPermissions = useSelector(
    (state: RootState) => state.user.user.userPermissions,
  );

  useEffect(() => {
    const fetchData = async () => {
      if (isrefresh > 0) {
      //  console.log('isrefresh', item);
        let k = await GetPostInsights(listTypeData,item.postId);
     //   console.log(k)
        setisraisedPostBuyerHand(k.data?.raisedPostBuyerHand === 0 ? false : true)
        SetPostLike(k.data?.userLiked === 1)
        SetPostlikesCount(k.data?.likes);
        setCardComment(k.data?.comments);
        // You can use the value of k here, e.g., set state with it
      }
    };
  
    fetchData();
  }, [isrefresh]);

  useEffect(() => {
  
    setisraisedPostBuyerHand(item?.raisedPostBuyerHand === 0 ? false : true)
    SetPostLike(item.userLiked === 1)
    SetPostlikesCount(item.likes);
    setCardComment(item.comments);
  }, [item]);

  // TouchableOpacity onPress={() => navigation.navigate('ItemDetailScreen', { postId: item.postId , postType: item.hasOwnProperty('fuelType') ? 'Car/Post' : 'Post'})}
  const generateLink = async () => {
    let postType = listTypeData === 'RealEstate' ? 'Post' : 'Car/Post';

    try {
      const response = await fetch(
        `https://tinyurl.com/api-create.php?url=${encodeURIComponent(
          `brokerapp://ItemDetailScreen/${item?.postId}/${postType}`,
        )}`,
      );
      const text = await response.text();

      return text;
    } catch (error) {}
  };

  const [isSharing, setIsSharing] = useState(false);
  const sharePost = async () => {
    if (isSharing) {
      return;
    }
    setIsSharing(true);

    const getLink = await generateLink();

    try {
      await Share.share({
        message: getLink,
      });
    } catch (error) {
    } finally {
      setIsSharing(false); // Reset the flag after sharing is done or fails
    }
  };
  const handleListView = async () => {
    navigation.navigate('PostLikeList', {
      type: listTypeData,
      userId: User?.userId,
      ActionId: item?.postId,
    });
  };

  const handleLike = async () => {
    let endpoint = 'RealEstate';
    if (listTypeData === 'RealEstate') {
      endpoint = 'post';
    } else {
      endpoint = 'Car';
    }
    const result = await SetPostLikeUnLike(
      endpoint,
      'Like',
      User.userId,
      item.postId,
    );

    if (result.success) {
      SetPostLike(true);
      SetPostlikesCount(PostlikesCount + 1);
      onUpdateLikeCount(PostlikesCount + 1);
    }
  };

  const handleUnLike = async () => {
    let endpoint = 'RealEstate';
    if (listTypeData === 'RealEstate') {
      endpoint = 'post';
    } else {
      endpoint = 'Car';
    }
    const result = await SetPostLikeUnLike(
      endpoint,
      'UnLike',
      User.userId,
      item.postId,
    );

    if (result.success) {
      SetPostLike(false);
      SetPostlikesCount(PostlikesCount - 1);
      onUpdateLikeCount(PostlikesCount - 1);
    }
  };
  const handlePresentModalPress = useCallback(() => {
    commentSheetRef.current?.open();
  }, []);

  async function callCommentList() {
    pageSize_Set(15);
    currentPage_Set(0);
    hasMore_Set(true);

    let endpoint = '';

    if (listTypeData == 'RealEstate') {
      //pageTitle("Property");
    }
    if (listTypeData == 'Car') {
      endpoint = 'Car';
    }

    await execute(endpoint, User.userId, item.postId);
  }
  const closeModal = useCallback(item => {
    setCardComment(item);
  }, []);
  useEffect(() => {
    callCommentList();
  }, []);
  const HaveBuyerList = async () => {
    //
    //
    navigation.navigate('BuyerList', {
      ActionId: item.postId,
      userId: User.userId,
    });
  };
  const HaveLeadsList = async () => {
    //
    //
    navigation.navigate('PostLeads', {
      listTypeData:listTypeData,
      postId:item.postId,
      userId: User.userId,
    });
  };
  const postHaveBuyer = async () => {

    if (item?.raisedPostBuyerHand && item?.raisedPostBuyerHand == 1) {
      // console.log()

      const result = await RemoveHaveABuyer(User.userId, item.postId);

      //
      if (result?.status) {
        item.buyers = item.buyers - 1;
        item.raisedPostBuyerHand = 0;
        setisraisedPostBuyerHand(false);
      }
    } else {


      const result = await addHaveABuyer(User.userId, item.postId);
   
      if (result.success) {
 
        item.buyers = item.buyers + 1;
        item.raisedPostBuyerHand = 1;
        setisraisedPostBuyerHand(true);
      }
    }
  };

  return (
    <>
      <HStack style={{marginRight: 20, marginTop: 10}}>
        <VStack style={{marginRight: 10}}>
          <HStack style={{justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacityWithPermissionCheck
              tagNames={[Like, UnLike]}
              permissionEnum={
                item?.userLiked
                  ? PermissionKey.AllowUnlikePostComment
                  : PermissionKey.AllowLikePostComment
              }
              permissionsArray={userPermissions}
              onPress={PostLike ? handleUnLike : handleLike}>
              <Icon
                as={FavouriteIcon}
                size="xxl"
                style={{marginRight: 5}}
                color={PostLike ? 'red' : undefined}
              />
            </TouchableOpacityWithPermissionCheck>
            {PostlikesCount > 0 && (
              <TouchableOpacityWithPermissionCheck
                tagNames={[ZText]}
                permissionEnum={PermissionKey.AllowViewPostLikes}
                permissionsArray={userPermissions}
                onPress={handleListView}>
                <ZText type={'R16'}>{PostlikesCount}</ZText>
              </TouchableOpacityWithPermissionCheck>
            )}
          </HStack>
        </VStack>

        <VStack style={{marginRight: 10}}>
          <HStack style={{justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacityWithPermissionCheck
              tagNames={[Icon]}
              permissionEnum={PermissionKey.AllowViewPostComment}
              permissionsArray={userPermissions}
              onPress={handlePresentModalPress}>
              <Icon
                as={MessageCircleIcon}
                style={{marginRight: 5}}
                size="xxl"
              />
            </TouchableOpacityWithPermissionCheck>
            {cardComment > 0 && <ZText type={'R16'}>{cardComment}</ZText>}
          </HStack>
        </VStack>

        <VStack style={{marginRight: 10}}>
          <TouchableOpacity onPress={sharePost}>
            <Icon as={share_PIcon} size="xxl" />
          </TouchableOpacity>
        </VStack>
        {listTypeData === 'RealEstate' && User.userId !== item.userId && (
          <VStack style={{marginRight: 10}}>
            <HStack style={{justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity
                // tagNames={[Icon]}
                // permissionEnum={false}
                // permissionsArray={userPermissions}
                onPress={postHaveBuyer}>
                <Icon
                  as={Buyer}
                  size="xxl"
                  style={{marginRight: 5}}
                  color={israisedPostBuyerHand ? 'red' : 'black'}
                />

                {/* <Icon as={Buyer} size="xxl" /> */}
              </TouchableOpacity>
            </HStack>
          </VStack>
        )}


        {/* {listTypeData === 'RealEstate' &&
          PageName !== 'MyItemList' &&
          User.userId === item.userId && (
            <VStack style={{marginRight: 10}}>
              <HStack style={{justifyContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity onPress={HaveBuyerList}>
                  <Icon
                    as={Buyer}
                    size="xxl"
                    style={{marginRight: 5}}
                    color={'red'}
                  />

                </TouchableOpacity>
                <ZText type={'R16'}>{item.raisedPostBuyerHand}</ZText>
              </HStack>
            </VStack>
          )} */}

        {listTypeData === 'RealEstate' &&
    item.buyers>0 &&
          User.userId == item.userId &&
        (
            <VStack style={{marginRight: 10}}>
              <HStack style={{justifyContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity onPress={HaveBuyerList}>
                  <Icon
                    as={Buyer}
                    size="xxl"
                    style={{marginRight: 5}}
                    color={'red'}
                  />
                </TouchableOpacity>
                <ZText type={'R16'}>{item.buyers}</ZText>
              </HStack>
            </VStack>
          )}


{PageName == 'MyItemList' &&
   
          User.userId == item.userId &&
        (
            <VStack style={{marginRight: 10}}>
              <HStack style={{justifyContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity onPress={HaveLeadsList}>
                  <Icon
                    as={filter}
                    size="xxxl"
                    style={{marginRight: 5}}
               
                    color={'red'}
                  />
                </TouchableOpacity>
              
              </HStack>
            </VStack>
          )}



        {/* <VStack style={{ marginLeft: 'auto' }}>
        <Icon as={bookmark_icon} />
      </VStack> */}
      </HStack>

      <CommentBottomSheet
        ref={commentSheetRef}
        postItem={item}
        User={User}
        listTypeData={listTypeData}
        userPermissions={userPermissions}
        onClose={closeModal}
      />
    </>
  );
};
const styles = StyleSheet.create({
  textInput: {
    alignSelf: 'stretch',
    marginHorizontal: 12,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'grey',
    color: 'white',
    textAlign: 'center',
  },
  bottomcontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: 'grey',
  },
  sheetContent: {
    flex: 1,
    width: '100%',
  },
  contentContainer: {
    // paddingBottom: 20,
  },
  //   contentContainer: {
  //     height:"90%",
  // //     flex: 1,
  // //   //  alignItems: 'center',  // or 'center'
  // //    height:'100%',
  // //  //  backgroundColor: 'red',
  //  paddingBottom: 20,
  //  marginBottom:200
  //   },
  footerContainer: {
    minHeight: 50,
    padding: 12,

    borderRadius: 12,

    borderTopWidth: 1, // Adds a top border
    borderTopColor: '#ccc', // Sets the top border color
    backgroundColor: 'white', // Sets background color
    shadowColor: '#000', // iOS shadow color
    shadowOffset: {width: 0, height: -2}, // iOS shadow offset for top shadow
    shadowOpacity: 0.2, // iOS shadow opacity
    shadowRadius: 4, // iOS shadow blur
    elevation: 5,
  },
  footerText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '800',
  },
  ////////////////////////////////////////////////////////////////
  mainContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 20,
    alignItems: 'flex-start',
    verticalAlign: 'top',
    paddingHorizontal: 10,
  },
  profileWrap: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
    verticalAlign: 'top',
    marginRight: 5,
  },
  profileImage: {
    width: moderateScale(20),
    height: moderateScale(20),
    borderRadius: moderateScale(20),
    verticalAlign: 'top',
  },
});
export default PostActions;
