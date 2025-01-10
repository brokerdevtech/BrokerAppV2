/* eslint-disable react-native/no-inline-styles */
import React, {useState, useRef, useCallback, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableWithoutFeedback,
  Animated,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  Keyboard,
  Alert,
  ActivityIndicator,
  Text,
} from 'react-native';

import {CommentWhite, TrashWhite} from '../../assets/svg';

import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import LinearGradient from 'react-native-linear-gradient';
import Video from 'react-native-video';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {RootState} from '@/BrokerAppCore/redux/store/reducers';
import {secondsToMilliseconds} from '@/src/utils/helpers';
import {
  AddStoryViewer,
  StoryLike,
  StoryUnLIke,
} from '@/BrokerAppCore/services/Story';
import {imagesBucketcloudfrontPath} from '@/src/constants/constants';
import FastImage from '@d11/react-native-fast-image';
import {styles} from '@/src/themes';
import ZText from '@/src/sharedComponents/ZText';
import {Box} from '@/components/ui/box';
import TouchableOpacityWithPermissionCheck from '@/src/sharedComponents/TouchableOpacityWithPermissionCheck';
import {getHeight, moderateScale, PermissionKey} from '@/src/config/constants';
import {useToast} from '@/components/ui/toast';
import {
  Avatar,
  AvatarFallbackText,
  AvatarGroup,
  AvatarImage,
} from '@/components/ui/avatar';
import {CloseIcon, LikeWhite, OpenEye, UnLikeWhite} from '../../assets/svg';
import {Icon} from '../../../components/ui/icon';
import TextWithPermissionCheck from '../../sharedComponents/TextWithPermissionCheck';
import {Center} from '../../../components/ui/center';
import StoryCommentBottomSheet from '../../sharedComponents/StoryCommentBottomSheet';
import {DeleteStory} from '../../../BrokerAppCore/services/Story';
import {useApiRequest} from '../../hooks/useApiRequest';
import {getStoryDetails} from '../../../BrokerAppCore/services/new/story';

const {width, height} = Dimensions.get('window');

const StoryDetails: React.FC = ({route}) => {
  const navigation = useNavigation();
  const user = useSelector((state: RootState) => state.user.user);

  const colors = useSelector(state => state.theme.theme);
  const [isLoading, setIsLoading] = useState(true);
  const [storyId, setstoryId] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [StoryState, setStoryState] = useState({
    likeCount: 0,
    reactionCount: 0,
    viewerCount: 0,
    userLiked: 0,
  });

  const [content, setContent] = useState([]);
  const [reversedContent, setReversedContent] = useState([]);
  const [userImage, setUserImage] = useState({});
  const [current, setCurrent] = useState(0);

  const userPermissions = useSelector(
    (state: RootState) => state.user.user.userPermissions,
  );
  const toast = useToast();
  //   const [isLiked, setisLiked] = useState(content.userLiked);
  const [end, setEnd] = useState(0);

  const [load, setLoad] = useState(false);
  const [KeybordShow, setKeybordShow] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;

  const isPlayingRef = useRef(true);
  const lastValueRef = useRef(0);

  const [modalVisible, setModalVisible] = useState(false);
  const [scaleValue] = useState(new Animated.Value(1));
  const commentSheetRef = useRef(null);
  //   console.log(route, 'userimage');
  const {data, status, error, execute} = useApiRequest(
    getStoryDetails,
    setLoad,
  );
  useEffect(() => {
    if (route.params?.userId && route.params?.storyId) {
      execute(route.params.userId, route.params.storyId);
    }
  }, []);

  useEffect(() => {
    if (status === 200 && data?.data) {
      setUserImage(data.data);
      setContent(data.data?.storyDetails || []);
      setReversedContent(data.data?.storyDetails.slice().reverse() || []);
      setIsLoading(false);
    } else if (error) {
      console.error('Error fetching story details:', error);
      setIsLoading(false);
    }
  }, [status, data, error]);

  useFocusEffect(
    useCallback(() => {
      // Initial setup that you want to run when the component gains focus
      const resetContentAndProgress = () => {
        //setCurrent(0); // Reset current index to initial
        progress.setValue(0); // Reset progress to initial value

        setStoryState({
          likeCount: 0,
          reactionCount: 0,
          viewerCount: 0,
          userLiked: 0,
        });
        setStoryState({
          likeCount: content?.[0]?.likeCount,
          reactionCount: content?.[0]?.reactionCount,
          viewerCount: content?.[0]?.viewerCount,
          userLiked: content?.[0]?.userLiked,
        });
      };

      resetContentAndProgress(); // Call reset function

      // Merged Keyboard event listeners from useEffect
      const onFocus = () => {
        setKeybordShow(true);
        // togglePlayPause(); // Pause the animation when input is in focus
      };

      const onBlur = () => {
        setKeybordShow(false);
        // togglePlayPause(); // Resume the animation when input loses focus
      };

      const keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        onFocus,
      );
      const keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        onBlur,
      );
      toast.closeAll();
      // Cleanup function
      return () => {
        // Remove keyboard event listeners
        keyboardDidShowListener.remove();
        keyboardDidHideListener.remove();
      };
    }, [route.params.userId]),
  );

  // start() is for starting the animation bars at the top
  function start1(n) {
    if (content.mediaType == 'video') {
      // type video

      Animated.timing(progress, {
        toValue: 1,
        duration: 10000 * (1 - lastValueRef.current),
        useNativeDriver: false,
      }).start(({finished}) => {
        if (finished) {
          onPressNext();
        }
      });
    } else {
      // type image
      Animated.timing(progress, {
        toValue: 1,
        duration: 10000 * (1 - lastValueRef.current),
        useNativeDriver: false,
      }).start(({finished}) => {
        if (finished) {
          lastValueRef.current = 0;
          progress.setValue(0);
          onPressNext();
        }
      });
    }
  }

  console.log(content, 'conj');
  function start(duration) {
    // Ensure duration is not zero
    duration = duration || 5000;

    Animated.timing(progress, {
      toValue: 1,
      duration: duration,
      useNativeDriver: false,
    }).start(({finished}) => {
      if (finished) {
        onPressNext(); // Move to the next item
      }
    });
  }

  const onLoadVideo = status => {
    const videoDuration = secondsToMilliseconds(status.duration);
    setIsLoading(false);
    setEnd(videoDuration); // Set the end based on video duration
    play(videoDuration); // Start playing the story with the correct duration
  };
  const handleLongPress = () => {
    isPlayingRef.current = false; // Pause the play state
    progress.stopAnimation(currentValue => {
      lastValueRef.current = currentValue; // Save the current progress value
    });
  };

  // Add this handler to resume the story and progress bar
  const handlePressOut = () => {
    isPlayingRef.current = true; // Resume the play state
    start(lastValueRef.current * end); // Resume from the saved progress
  };
  function play(duration) {
    setstoryId(content.storyId);
    AddStoryViewer(user.userId, content.storyId);
    setStoryState({
      likeCount: content?.[0]?.likeCount,
      reactionCount: content?.[0]?.reactionCount,
      viewerCount: content?.[0]?.viewerCount,
      userLiked: content?.[0]?.userLiked,
    });
    start(duration); // Pass the actual content duration
  }
  function play(duration) {
    setstoryId(content.storyId);
    AddStoryViewer(user.userId, content.storyId);
    setStoryState({
      likeCount: content?.[0]?.likeCount,
      reactionCount: content?.[0]?.reactionCount,
      viewerCount: content?.[0]?.viewerCount,
      userLiked: content?.[0]?.userLiked,
    });
    start(duration); // Pass the actual content duration
  }
  const onLoadStartImage = () => {
    setIsLoading(true);
  };
  const onLoadEndImage = () => {
    setIsLoading(false);
    progress.setValue(0);
    setTimeout(() => {
      play();
    }, 1000);
    //  play(); // Default duration for images, adjust as necessary
  };
  const togglePlayPause = () => {
    if (isPlayingRef.current) {
      isPlayingRef.current = false;
      // If currently playing, stop the animation for pausing
      progress.stopAnimation(currentValue => {
        lastValueRef.current = currentValue;
        // Optionally, you can store the currentValue if needed
      });
    } else {
      isPlayingRef.current = true;
      start(lastValueRef.current);
      //progress.setValue(lastValueRef.current);
      //start(lastValueRef.current);
    }
  };
  // handle playing the animation
  function play1() {
    setstoryId(content.storyId);
    AddStoryViewer(user.userId, content.storyId);
    setStoryState({
      likeCount: content.likeCount,
      reactionCount: content.reactionCount,
      viewerCount: content.viewerCount,
      userLiked: content.userLiked,
    });
    start(end);
  }

  // next() is for changing the content of the current content to +1
  function onPressNext() {
    if (KeybordShow) {
      Keyboard.dismiss();
      return;
    }

    // check if the next content is not empty
    if (current !== content.length - 1) {
      let data = [...content];
      data[current].finish = 1;
      setContent(data);
      setIsLoading(true);
      setCurrent(current + 1);
      setLoad(false);
      progress.setValue(0);
    } else {
      // the next content is empty
      onCloseStory();
    }
  }

  // previous() is for changing the content of the current content to -1
  function onPressPrevious() {
    if (KeybordShow) {
      Keyboard.dismiss();
      return;
    }
    // checking if the previous content is not empty
    if (current - 1 >= 0) {
      let data = [...content];
      data[current].finish = 0;
      setContent(data);
      setCurrent(current - 1);
      progress.setValue(0);
      setLoad(false);
    } else {
      // the previous content is empty
      onCloseStory();
    }
  }

  // closing the modal set the animation progress to 0
  function onCloseStory() {
    if (KeybordShow) {
      Keyboard.dismiss();
      return;
    }
    progress.setValue(0);
    setLoad(false);
    navigation.goBack();
  }

  // const onLoadEndImage1 = () => {
  //   progress.setValue(0);
  //   play();
  // };
  const storyLikeList = (item: any) => {
    togglePlayPause();
    navigation.push('StoryLikeList', {
      ActionId: item.storyId,
      userId: user.userId,
    });
  };
  const storyviewList = (item: any) => {
    togglePlayPause();
    navigation.push('StoryViewList', {
      ActionId: item.storyId,
      userId: user.userId,
    });
  };
  const onLoadVideo1 = status => {
    const videoDuration = secondsToMilliseconds(status.duration);

    setEnd(videoDuration);

    progress.setValue(0);
    play();
    // setEnd(secondsToMilliseconds(status.duration));
  };
  const StoryComment = () => {
    // setActionSheetKey(prevKey => prevKey + 1);
    // setstoryId(content.storyId);
    togglePlayPause();
    commentSheetRef.current?.open();
    setOpen(true);
    // togglePlayPause();
  };
  const closeModal = async (item: any) => {
    setOpen(false);
    // await new Promise(resolve => setTimeout(resolve, 200));

    setStoryState(item);
    await new Promise(resolve => setTimeout(resolve, 200));
    togglePlayPause();
    // setPostId(0);
  };

  const storyLike = async item => {
    //
    //console.log(user);
    if (StoryState?.userLiked && StoryState?.userLiked == 1) {
      const result = await StoryUnLIke(user.userId, item.storyId);

      setStoryState({
        likeCount: result.data.storyDetails[0].likeCount,
        reactionCount: result.data.storyDetails[0].reactionCount,
        viewerCount: result.data.storyDetails[0].viewerCount,
        userLiked: result.data.storyDetails[0].userLiked,
      });
    } else {
      const result = await StoryLike(user.userId, item.storyId);
      //

      setStoryState({
        likeCount: result.data.storyDetails[0].likeCount,
        reactionCount: result.data.storyDetails[0].reactionCount,
        viewerCount: result.data.storyDetails[0].viewerCount,
        userLiked: result.data.storyDetails[0].userLiked,
      });
    }
  };

  const onDeleteStory = async (storyId: any) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this story?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              const deleteResponse = await DeleteStory(user.userId, storyId);
              if (deleteResponse.status === 'success') {
                toast.show({
                  description: deleteResponse.statusMessage,
                });
                navigation.goBack();
              }
            } catch (error) {
              //  console.error('Error deleting connection:', error);
            }
          },
        },
      ],
      {cancelable: false},
    );
    togglePlayPause();
  };
  const openStoryView = () => {
    // Animate the shrink
    Animated.timing(scaleValue, {
      toValue: 0.8, // Shrinks the screen
      duration: 300, // Animation duration
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(true); // Show the modal when animation is done
    });
  };

  const closeStoryView = () => {
    // Close the list and scale the screen back to normal
    Animated.timing(scaleValue, {
      toValue: 1, // Scale back to normal
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
    });
  };
  const handlenavigateToProfile = item => {
    if (user.userId === item.userId) {
      navigation.navigate('ProfileScreen');
    } else {
      navigation.navigate('ProfileDetail', {
        userName: item.userName,
        userImage: item.userImage,
        userId: item.userId,
        loggedInUserId: user.userId,
        connectionId: '',
      });
    }
  };
  console.log(content?.[current], 'im');
  return (
    <SafeAreaView style={localStyles.containerModal}>
      <BottomSheetModalProvider>
        <StatusBar backgroundColor="black" barStyle="light-content" />

        <View style={localStyles.backgroundContainer}>
          {isLoading && (
            <View style={localStyles.loaderContainer}>
              <ActivityIndicator size="large" color="white" />
            </View>
          )}
          {reversedContent[current]?.mediaBlob ? (
            reversedContent[current]?.mediaType === 'video' ? (
              <Video
                source={{
                  uri: `${imagesBucketcloudfrontPath}${reversedContent[current]?.mediaBlob}`,
                }}
                onLoad={onLoadVideo}
                style={{height: height, width: width}}
              />
            ) : (
              <FastImage
                onLoadStart={onLoadStartImage}
                onLoadEnd={onLoadEndImage}
                source={{
                  uri: `${imagesBucketcloudfrontPath}${content?.[0].mediaBlob}`,
                  priority: FastImage.priority.high,
                }}
                resizeMode={FastImage.resizeMode.contain}
                style={{width: width, height: height}}
              />
            )
          ) : (
            <Text style={{color: 'white'}}>No media available</Text>
          )}
        </View>
        <View style={localStyles.mainContainer}>
          <LinearGradient
            colors={['rgba(0,0,0,1)', 'transparent']}
            style={localStyles.gradientView}
          />
          {/* ANIMATION BARS */}
          <View style={localStyles.animationBar}>
            {content.map((index, key) => {
              return (
                <View key={key} style={localStyles.barItemContainer}>
                  {/* THE ANIMATION OF THE BAR*/}
                  <Animated.View
                    style={{
                      flex: current == key ? progress : content[key].finish,
                      height: 2,
                      backgroundColor: colors.white,
                    }}
                  />
                </View>
              );
            })}
          </View>

          {/* END OF ANIMATION BARS */}
          <View style={localStyles.header}>
            {/* THE AVATAR AND USERNAME  */}
            <TouchableOpacity
              style={localStyles.userAvatarContainer}
              onPress={() => handlenavigateToProfile(userImage)}>
              {!!userImage?.profileImage && (
                <FastImage
                  style={localStyles.userImage}
                  source={{
                    uri: `${imagesBucketcloudfrontPath}${userImage.profileImage}`,
                  }}
                  resizeMode={FastImage.resizeMode.contain}
                />
              )}
              <ZText type={'S14'} style={{...styles.pl10, color: 'white'}}>
                {userImage.postedBy}
              </ZText>
            </TouchableOpacity>
            {/* END OF THE AVATAR AND USERNAME */}
            {/* THE CLOSE BUTTON */}
            <TouchableOpacity onPress={onCloseStory}>
              <View style={localStyles.closeContainer}>
                {/* <Ionicons name="close-outline" size={28} color="white" /> */}
                <Icon as={CloseIcon} />
              </View>
            </TouchableOpacity>
            {/* END OF CLOSE BUTTON */}
          </View>

          {/* HERE IS THE HANDLE FOR PREVIOUS AND NEXT PRESS */}
          <View style={localStyles.nextPreviousContainer}>
            <TouchableWithoutFeedback onPress={onPressPrevious}>
              <View style={styles.flex} />
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={onPressNext}>
              <View style={styles.flex} />
            </TouchableWithoutFeedback>
          </View>
          {/* END OF THE HANDLE FOR PREVIOUS AND NEXT PRESS */}
        </View>
        <View style={localStyles.actionButtons}>
          <Box
            display="flex"
            alignItems="center"
            style={localStyles.likeBtnStyle}>
            <TouchableOpacityWithPermissionCheck
              fontColor={colors.white}
              tagNames={[LikeWhite, UnLikeWhite]}
              permissionEnum={
                StoryState.userLiked
                  ? PermissionKey.AllowUnLikeStory
                  : PermissionKey.AllowLikeStory
              }
              permissionsArray={userPermissions}
              onPress={() => storyLike(content?.[0])}>
              {StoryState.userLiked ? (
                <LikeWhite accessible={true} accessibilityLabel="Like White" />
              ) : (
                <UnLikeWhite
                  accessible={true}
                  accessibilityLabel="unlike white"
                />
              )}
            </TouchableOpacityWithPermissionCheck>
            <TextWithPermissionCheck
              permissionEnum={PermissionKey.AllowViewStoryLikes}
              permissionsArray={userPermissions}
              type={'L16'}
              color={colors.white}
              fontColor={colors.white}
              onPress={() => storyLikeList(content?.[0])}>
              {StoryState.likeCount}
            </TextWithPermissionCheck>
          </Box>
          {user.userId === userImage.userId && (
            <Box
              display="flex"
              alignItems="center"
              style={localStyles.likeBtnStyle}>
              <TouchableOpacityWithPermissionCheck
                fontColor={colors.white}
                permissionsArray={userPermissions}
                tagNames={[Center, OpenEye, ZText]}
                permissionEnum={PermissionKey.AllowViewStoryViewers}
                onPress={() => storyviewList(content?.[0])}>
                <Center>
                  <OpenEye accessible={true} accessibilityLabel="open eye" />
                  <ZText type={'L16'} style={{color: colors.white}}>
                    {StoryState.viewerCount}
                  </ZText>
                </Center>
              </TouchableOpacityWithPermissionCheck>
            </Box>
          )}

          <Box
            display="flex"
            alignItems="center"
            style={localStyles.likeBtnStyle}>
            <TouchableOpacityWithPermissionCheck
              fontColor={colors.white}
              tagNames={[CommentWhite]}
              permissionsArray={userPermissions}
              permissionEnum={PermissionKey.AllowViewStoryReaction}
              onPress={() => StoryComment()}>
              <CommentWhite
                accessible={true}
                accessibilityLabel="comment white"
              />
              <Center>
                <ZText type={'L16'} style={{color: colors.white}}>
                  {StoryState.reactionCount}
                </ZText>
              </Center>
            </TouchableOpacityWithPermissionCheck>
          </Box>
          {user.userId === userImage.userId && (
            <Box
              display="flex"
              alignItems="center"
              style={localStyles.likeBtnStyle}>
              <TouchableOpacityWithPermissionCheck
                tagNames={[View, TrashWhite]}
                permissionEnum={PermissionKey.AllowDeleteStory}
                permissionsArray={userPermissions}
                onPress={() => onDeleteStory(content?.[0]?.storyId)}>
                <View style={localStyles.deleteContainer}>
                  <TrashWhite
                    accessible={true}
                    accessibilityLabel="trash white"
                  />
                </View>
              </TouchableOpacityWithPermissionCheck>
            </Box>
          )}
        </View>

        {/* <View style={localStyles.avatarGroupContainer}>
        <AvatarGroup>
          <Avatar size="sm">
            <AvatarFallbackText>John Doe</AvatarFallbackText>
            <AvatarImage
              source={{
                uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
              }}
            />
          </Avatar>
          <Avatar size="sm">
            <AvatarFallbackText>John Doe</AvatarFallbackText>
            <AvatarImage
              source={{
                uri: 'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
              }}
            />
          </Avatar>
        </AvatarGroup>
      </View> */}
        {reversedContent[current] && (
          <StoryCommentBottomSheet
            ref={commentSheetRef}
            StoryStateParam={StoryState}
            postItem={reversedContent[current]}
            User={user}
            listTypeData={''}
            userPermissions={userPermissions}
            onClose={closeModal}
          />
        )}
      </BottomSheetModalProvider>
    </SafeAreaView>
  );
};

export default StoryDetails;

const localStyles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  containerModal: {
    flex: 1,
    backgroundColor: '#000',
  },
  likeBtnStyle: {
    flex: 1,
    marginBottom: 20,
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#00000080',
    right: 0,
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  submitBtn: {
    ...styles.p5,
  },
  commentInput: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 20,
    borderColor: 'white',
    color: 'white',
    padding: 10,
    marginBottom: 10,

    placeholder: {
      color: 'white',
      opacity: 1,
    },
  },
  commentFooter: {
    flexDirection: 'row',
    gap: 10,
    borderColor: '#E00000',

    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  actionButtons: {
    position: 'absolute',
    right: 10,
    bottom: 20,
    width: 50,
    flex: 1,
  },
  animationBar: {
    flexDirection: 'row',
    ...styles.pt10,
    ...styles.ph10,
  },
  barItemContainer: {
    height: 2,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(117, 117, 117, 0.5)',
    marginHorizontal: 2,
  },
  nextPreviousContainer: {
    ...styles.flexRow,
    ...styles.flex,
  },
  closeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: getHeight(50),
    ...styles.ph15,
  },
  userAvatarContainer: {flexDirection: 'row', alignItems: 'center'},
  userImage: {
    height: moderateScale(30),
    width: moderateScale(30),
    borderRadius: 25,
  },
  header: {
    height: getHeight(50),
    flexDirection: 'row',
    justifyContent: 'space-between',
    ...styles.ph15,
  },
  gradientView: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: getHeight(100),
  },
  deleteContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: getHeight(50),
    // ...styles.ph15,
  },
  avatarGroupContainer: {
    position: 'absolute',
    left: 30,
    bottom: 30,
    zIndex: 1,
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional dimming effect
    zIndex: 1,
  },
});
