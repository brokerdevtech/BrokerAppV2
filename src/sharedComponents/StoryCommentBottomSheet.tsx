/* eslint-disable react-native/no-inline-styles */
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
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
  AddComment,
  AddstoryComment,
  GetCommentList,
  GetStoryCommentList,
  ReplyComment,
  SetPostCommentLikeUnLike,
  SetStoryCommentLikeUnLike,
} from '../../BrokerAppCore/services/new/postServices';
import LoadingSpinner from './LoadingSpinner';
import ZAvatarInitials from './ZAvatarInitials';
import moment from 'moment';
import TextWithPermissionCheck from './TextWithPermissionCheck';
import {useSelector} from 'react-redux';
import {RootState} from '../../BrokerAppCore/redux/store/reducers';
import {moderateScale, PermissionKey} from '../config/constants';
import TouchableOpacityWithPermissionCheck from './TouchableOpacityWithPermissionCheck';
import {Like, UnLike, Send, CloseIcon} from '../assets/svg';
import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from '../../components/ui/toast';
import {useNavigation} from '@react-navigation/native';
import ReplyCommentList from './ReplyCommentList';

const StoryCommentBottomSheet = forwardRef(
  (
    {postItem, User, listTypeData, StoryStateParam, userPermissions, onClose},
    ref,
  ) => {
    const navigation = useNavigation();
    const bottomSheetModalRef = useRef(null);
    const snapPoints = useMemo(() => ['60%'], []);
    const [newComment, setNewComment] = useState('');
    const [replyCommentId, setreplyCommentId] = useState(0);
    const [StoryState, setStoryState] = useState(StoryStateParam);
    const [postId, setpostId] = useState(postItem.storyId);
    const [Reset, setReset] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const toast = useToast();
    const [toastId, setToastId] = React.useState(0);
    const [isInfiniteLoading, setInfiniteLoading] = useState(false);
    const [replyCommentIndex, setreplyCommentIndex] = useState(0);
    const [isDataRef, setisDataRef] = useState(false);
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
    } = useApiPagingWithtotalRequest(
      GetStoryCommentList,
      setInfiniteLoading,
      5,
    );
    const [isOpenArray, setisOpenArray] = useState([]);
    // console.log(data, 'story');
    const showNewToast = NewToasttext => {
      const newId = Math.random();
      setToastId(newId);
      toast.show({
        id: newId,
        placement: 'top',
        duration: 3000,
        render: ({id}) => {
          const uniqueToastId = 'toast-' + id;
          return (
            <Toast nativeID={uniqueToastId} action="muted" variant="solid">
              <ToastDescription>{NewToasttext}</ToastDescription>
            </Toast>
          );
        },
      });
    };
    // console.log(postItem, 'cur');
    async function callCommentList() {
      await pageSize_Set(5);
      await currentPage_Set(0);
      await hasMore_Set(true);

      await execute(User.userId, postItem.storyId);
    }
    const loadMorepage = async () => {
      if (!isInfiniteLoading) {
        await loadMore(User.userId, postItem.storyId);
      }
    };
    useEffect(() => {
      //   console.log("===========callCommentList===========")
      //   console.log(postItem)
      //  callCommentList();
      if (isOpen) {
        setInfiniteLoading(true);
        setNewComment('');
        setreplyCommentId(0);
        setreplyCommentIndex(0);
        setToastId(0);
        callCommentList();
      }
    }, [Reset, isOpen]);

    useEffect(() => {
      //   console.log("===========callCommentList===========")
      //   console.log(postItem)
      //  callCommentList();
      setStoryState(StoryStateParam);
    }, [StoryStateParam]);
    // console.log(postItem, 'com');
    const renderBackdrop = useCallback(
      props => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
        />
      ),
      [],
    );

    useImperativeHandle(ref, () => ({
      open: () => {
        bottomSheetModalRef.current?.present();
      },
    }));

    const handleSheetChanges = useCallback(
      index => {
        setIsOpen(index >= 0);
        if (index == -1) {
          onClose(StoryState);
        }
      },
      [StoryState],
    );

    // const handleSheetChanges =(index) => {
    //   console.log('handleSheetChanges', index);
    //   setIsOpen(index >= 0);
    //   if(index-1)
    //   {
    //     onClose(StoryState);
    //   }
    // }

    const renderCommentItem = ({item, index}) => {
      return (
        <View key={index} style={styles.mainContainer}>
          <View styles={styles.profileWrap}>
            {/* <ZAavatar
            sourceUrl={item.profileImage}
            styles={localStyles.profileImage}
            iconSize="40px"
          /> */}
            <ZAvatarInitials
              // item={item}
              sourceUrl={item.profileImage}
              onPress={() => onPressUser(item)}
              iconSize="s"
              styles={styles.profileImage}
              name={item.viewerName}
            />
          </View>
          <View style={{marginLeft: 10, flex: 1}}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  // justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '700',
                    color: '#000',
                    textTransform: 'capitalize',
                  }}>
                  {item.viewerName}
                </Text>
              </View>
            </View>
            <Text>{item.reaction}</Text>
            <Text>{getTimeDifference(item.reactionDate)}</Text>
            {/* <TextWithPermissionCheck
            type="comment"
            permissionsArray={userPermissions}
            permissionEnum={PermissionKey.AllowReplyPostComment}
            style={{width: '100%', fontWeight: '800'}}
            onPress={() => handleReplyClick(item, index)}>
            Reply
          </TextWithPermissionCheck> */}
            {/* {item.replyCount > 0 && isOpenArray.includes(item.commentId) && (
            <View style={{marginTop: 20}}>
<ReplyCommentList
commentId={item.commentId}
listType={listTypeData}
module="Post"
></ReplyCommentList>



            </View>
          )} */}
            {/* {item.replyCount > 0 && ! isOpenArray.includes(item.commentId) && (
            <TextWithPermissionCheck
              permissionsArray={userPermissions}
              type="comment"
              permissionEnum={PermissionKey.AllowViewPostCommentReplies}
              style={{width: '100%', fontWeight: '600'}}
              onPress={() => handleViewReply(item)}>
              View {item.replyCount} Replies
            </TextWithPermissionCheck>
          )} */}
          </View>
          {/* <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'end',
          }}>
          <TouchableOpacityWithPermissionCheck
            tagNames={[Like, UnLike]}
            permissionEnum={
              item?.userLiked
                ? PermissionKey.AllowUnlikePostComment
                : PermissionKey.AllowLikePostComment
            }
            permissionsArray={userPermissions}
            type="comment"
            onPress={() => handleCommentLike(item)}>
            {item?.userLiked ? <Like /> : <UnLike />}
          </TouchableOpacityWithPermissionCheck>
          {item.likeCount > 0 && (
            <TouchableOpacity onPress={() =>{handleListView(item)}}>
              <ZText type={'L12'}>{item.likeCount}</ZText>
            </TouchableOpacity>
          )}
        </View> */}
        </View>
      );
    };

    const handleListView = async item => {
      navigation.navigate('PostCommentLikeList', {
        type: listTypeData,
        userId: User?.userId,
        ActionId: item.commentId,
      });
    };

    const onPressUser = CommentUser => {
      // if (CommentUser.userId === user.userId) {
      //   navigation.navigate(TabNav.Profile);
      //   onClose(commentsCount);
      // } else {
      //   navigation.push(StackNav.ProfileDetail, {
      //     userName: CommentUser.postedBy,
      //     userImage: CommentUser.profileImage,
      //     userId: CommentUser.userId,
      //     loggedInUserId: user.userId,
      //     // connectionId: connectionId,
      //   });
      //   onClose(commentsCount);
      // }
    };
    const getTimeDifference = createdAt => {
      const now = moment().local();
      const created = moment(createdAt).local();

      const daysDifference = now.diff(created, 'days');

      if (daysDifference >= 7) {
        const weeks = Math.floor(daysDifference / 7);
        return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
      }

      // Convert createdAt to local time before using fromNow()
      return created.fromNow();
    };
    const handleReplyClick = (comment, index) => {
      setNewComment(`@${comment.firstName} ${comment.lastName} `);

      setreplyCommentId(comment.commentId);
      setreplyCommentIndex(index);
    };

    const handleViewReply = item => {
      // //

      let listArray = [];
      // console.log("list ",  listArray)
      listArray.push(item.commentId);

      setisOpenArray([...isOpenArray, ...listArray]);
      // setisDataRef(!isDataRef);
    };
    const handleCommentLike = async item => {
      let result;
      let endpoint = '';
      if (!isInfiniteLoading) {
        setInfiniteLoading(true);

        if (item?.userLiked && item?.userLiked == 1) {
          result = await SetStoryCommentLikeUnLike(
            'UnLike',
            User.userId,
            item.commentId,
          );
          if (result?.success == true) {
            item.likeCount = item.likeCount - 1;
            item.userLiked = false;
            //  setisLiked(false);
          }
        } else {
          result = await SetStoryCommentLikeUnLike(
            'Like',
            User.userId,
            item.commentId,
          );
          if (result?.success == true) {
            item.likeCount = item.likeCount + 1;
            item.userLiked = true;
            //  setisLiked(false);
          }
        }

        setisDataRef(!isDataRef);
        setInfiniteLoading(false);
      }
    };
    const handleSendPress = () => {
      handleAddComment();
    };
    const renderFooter = () => (
      <KeyboardAvoidingView>
        <View style={styles.footerContainer}>
          <HStack
            style={{
              justifyContent: 'center',
              marginBottom: Platform.OS == 'ios' ? 30 : 0,
            }}>
            <TextInput
              style={{flex: 1}}
              placeholder="Add a comment..."
              value={newComment}
              onChangeText={text => setNewComment(text)}
              returnKeyType="go"
              returnKeyLabel="post"
              onSubmitEditing={handleAddComment}
              multiline={true}
            />
            <Box style={{justifyContent: 'center'}}>
              <TouchableOpacityWithPermissionCheck
                permissionsArray={userPermissions}
                permissionEnum={PermissionKey.AllowAddStoryReaction}
                tagNames={[View, Send]}
                onPress={handleSendPress}
                type="comment"
                disabled={isInfiniteLoading}>
                <View>
                  <Send />
                </View>
              </TouchableOpacityWithPermissionCheck>
              {/* <Button size="lg" style={{ backgroundColor: 'red' }} onPress={handleSendPress}>
                <ButtonIcon as={ArrowUpIcon} color="white" stroke="white" />
              </Button> */}
            </Box>
          </HStack>
        </View>
      </KeyboardAvoidingView>
    );

    const handleAddComment = async () => {
      if (!isInfiniteLoading) {
        setInfiniteLoading(true);

        if (newComment.length < 1) {
          if (!toast.isActive(toastId)) {
            showNewToast('Please enter some text.');
          }

          setInfiniteLoading(false);
          return;
        }
        let endpoint = '';

        if (listTypeData == 'RealEstate') {
          //pageTitle("Property");
        }
        if (listTypeData == 'Car') {
          endpoint = 'Car';
        }
        // setLoading(true);
        if (replyCommentId === 0) {
          if (postId != 0 && newComment !== '') {
            const postComment = await AddstoryComment(
              User.userId,
              postItem.storyId,
              newComment,
            );
            //
            // console.log(postId, 'id');
            await setStoryState({
              likeCount: postComment.data.data.storyDetails[0].likeCount,
              reactionCount:
                postComment.data.data.storyDetails[0].reactionCount,
              viewerCount: postComment.data.data.storyDetails[0].viewerCount,
              userLiked: postComment.data.data.storyDetails[0].userLiked,
            });

            setReset(!Reset);
          }
        } else {
          if (postId != 0 && newComment !== '') {
            const postComment = await ReplyComment(
              User.userId,
              replyCommentId,
              newComment,
              endpoint,
            );

            setReset(!Reset);
            //   //  await getCommentData();
            //   setisSubmitPressed(true);
            //   setNewComment('');

            //   // handleViewReply({commentId:replyCommentId});
            //   // setLoading(false);
            //   setfullloading(false);

            //   setComments(comments => {
            //     return comments.map(item => {
            //       if (item.commentId === postComment.data.commentId) {
            //         return {...item, ...postComment.data};
            //       }
            //       return item;
            //     });
            //   });
            //   setreplyCommentId(0);
            //   setreplyCommentIndex(0);
            //   handleViewReply(postComment.data);

            //scrollToItem(replyCommentIndex) ;
            //  handleViewReply({commentId:replyCommentId})
          }
        }
      }
    };

    return (
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enableOverDrag={false}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
        enableHandlePanningGesture={false}
        // footerComponent={renderFooter}
        enableDynamicSizing={false}>
        {isInfiniteLoading && (
          <View style={styles.spinnerView}>
            <ActivityIndicator size="large" color="blue" />
          </View>
        )}

        <VStack style={styles.sheetContent}>
          <Box style={{width: '100%', flex: 2}}>
            <BottomSheetFlatList
              data={data}
              renderItem={renderCommentItem}
              contentContainerStyle={styles.contentContainer}
              onEndReachedThreshold={0.2}
              onEndReached={loadMorepage}
              extraData={isDataRef}
            />
          </Box>
          <Box style={{marginTop: 'auto', minHeight: 50}}>{renderFooter()}</Box>
        </VStack>
      </BottomSheetModal>
    );
  },
);

const styles = StyleSheet.create({
  spinnerView: {
    position: 'absolute',
    zIndex: 1,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5FCFF88',
  },
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

export default StoryCommentBottomSheet;
