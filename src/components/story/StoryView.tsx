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
} from 'react-native';

import {CommentWhite, TrashWhite} from '../../assets/svg';

import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import LinearGradient from 'react-native-linear-gradient';
import Video from 'react-native-video';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
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

const {width, height} = Dimensions.get('window');

const StoryView: React.FC = ({route}) => {
  const navigation = useNavigation();
  const user = useSelector((state: RootState) => state.user.user);
  const colors = useSelector(state => state.theme.theme);
  const [isLoading, setIsLoading] = useState(true);
  const [storyId, setstoryId] = useState(0);

  const [StoryState, setStoryState] = useState({
    likeCount: 0,
    reactionCount: 0,
    viewerCount: 0,
    userLiked: 0,
  });

  const videoRef = useRef(null);
  const progress = useRef(new Animated.Value(0)).current;
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [isScreenFocused, setIsScreenFocused] = useState(true);
  const isFocused = useIsFocused();
  const [userImage, setuserImage] = useState(route.params.userImage);
  const [content, setContent] = useState([
    ...route.params.userImage.storyDetails,
  ]);

  const [isReturningFromScreen, setIsReturningFromScreen] = useState(false);
  const [current, setCurrent] = useState(0);
  const reversedContent = content.slice().reverse();
  const userPermissions = useSelector(
    (state: RootState) => state.user.user.userPermissions,
  );
  const toast = useToast();
  const [isLiked, setisLiked] = useState(reversedContent[current].userLiked);
  const [end, setEnd] = useState(0);
  const [actionSheetKey, setActionSheetKey] = useState(0);
  const [load, setLoad] = useState(false);
  const [KeybordShow, setKeybordShow] = useState(false);
  const [isOpen, setOpen] = useState(false);

  const isPlayingRef = useRef(true);
  const lastValueRef = useRef(0);

  const [isPaused, setIsPaused] = useState(false);

  const commentSheetRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      setIsScreenFocused(true);
      setIsPaused(false);
      setIsReturningFromScreen(true);

      // Resume content based on type with proper progress tracking
      if (reversedContent[current]?.mediaType === 'video') {
        if (videoRef.current) {
          const videoPosition = lastValueRef.current * videoDuration;
          videoRef.current.seek(videoPosition);

          // Add small delay to ensure video seeks properly
          setTimeout(() => {
            start(videoDuration * (1 - lastValueRef.current));
          }, 100);
        }
      } else if (lastValueRef.current > 0 && isPlayingRef.current) {
        start(lastValueRef.current * end);
      }

      const onFocus = () => {
        setKeybordShow(true);
      };

      const onBlur = () => {
        setKeybordShow(false);
      };

      const keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        onFocus,
      );
      const keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        onBlur,
      );

      return () => {
        setIsScreenFocused(false);
        setIsPaused(true);

        progress.stopAnimation(currentValue => {
          lastValueRef.current = currentValue;
        });

        keyboardDidShowListener.remove();
        keyboardDidHideListener.remove();
      };
    }, [current, videoDuration, end]),
  );

  useEffect(() => {
    if (isFocused) {
      setIsPaused(false);
      if (reversedContent[current]?.mediaType === 'video' && videoRef.current) {
        const videoPosition = lastValueRef.current * videoDuration;
        videoRef.current.seek(videoPosition);
        console.log('start', videoPosition);
        start(videoDuration * (1 - lastValueRef.current));
      } else if (lastValueRef.current > 0 && isPlayingRef.current) {
        start(lastValueRef.current * end);
        console.log('end');
      }
    } else {
      setIsPaused(true);
      progress.stopAnimation(currentValue => {
        lastValueRef.current = currentValue;
      });
    }
  }, [isFocused]);

  function start(duration) {
    if (!isScreenFocused || isPaused) return;
    console.log('jjk', isFocused);
    duration = duration || 5000;
    progress.setValue(lastValueRef.current); // Start from last saved progress

    Animated.timing(progress, {
      toValue: 1,
      duration: duration * (1 - lastValueRef.current), // Adjust duration
      useNativeDriver: false,
    }).start(({finished}) => {
      if (finished && isScreenFocused) {
        onPressNext(); // Move to the next story if finished
      }
    });
  }

  const navigateWithPause = (screenName: string, params: any) => {
    setIsPaused(true);
    progress.stopAnimation(currentValue => {
      lastValueRef.current = currentValue;
    });
    isPlayingRef.current = true;
    navigation.push(screenName, params);
  };

  const onLoadVideo = status => {
    const duration = secondsToMilliseconds(status.duration);
    setVideoDuration(duration);
    setIsLoading(false);
    setEnd(duration);

    if (isReturningFromScreen && lastValueRef.current > 0) {
      const videoPosition = lastValueRef.current * status.duration;
      videoRef.current?.seek(videoPosition);

      setTimeout(() => {
        if (isPlayingRef.current) {
          start(duration * (1 - lastValueRef.current));
        }
        setIsReturningFromScreen(false);
      }, 100);
    } else {
      lastValueRef.current = 0;
      if (isPlayingRef.current) {
        play(duration);
      }
    }
  };

  function play(duration) {
    setstoryId(reversedContent[current].storyId);
    AddStoryViewer(user.userId, reversedContent[current].storyId);
    setStoryState({
      likeCount: reversedContent[current].likeCount,
      reactionCount: reversedContent[current].reactionCount,
      viewerCount: reversedContent[current].viewerCount,
      userLiked: reversedContent[current].userLiked,
    });

    if (isReturningFromScreen) {
      // If returning, start from saved position
      start(duration * (1 - lastValueRef.current));
    } else {
      // Otherwise start from beginning
      start(duration);
    }
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
      progress.stopAnimation(currentValue => {
        lastValueRef.current = currentValue; // Save current progress
      });
    } else {
      isPlayingRef.current = true;
      start(
        lastValueRef.current *
          (reversedContent[current]?.mediaType === 'video'
            ? videoDuration
            : end),
      ); // Resume
    }
  };
  // handle playing the animation

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
    // progress.setValue(0);
    setLoad(false);
    navigation.goBack();
  }

  const storyLikeList = (item: any) => {
    navigateWithPause('StoryLikeList', {
      ActionId: item.storyId,
      userId: user.userId,
    });
  };

  const storyviewList = (item: any) => {
    navigateWithPause('StoryViewList', {
      ActionId: item.storyId,
      userId: user.userId,
    });
  };

  const StoryComment = () => {
    isPlayingRef.current = false; // Pause playback when opening comment
    setIsPaused(true);
    progress.stopAnimation(currentValue => {
      lastValueRef.current = currentValue;
    });
    commentSheetRef.current?.open();
    setOpen(true);
  };
  const closeModal = async (item: any) => {
    // Close the modal and update state
    setOpen(false);
    isPlayingRef.current = true; // Ensure playback is resumed
    setIsPaused(false);

    // Update the story state
    setStoryState(item);

    // Small delay to ensure state updates are processed
    await new Promise(resolve => setTimeout(resolve, 100));

    // Resume playback based on content type
    if (reversedContent[current]?.mediaType === 'video' && videoRef.current) {
      const videoPosition = lastValueRef.current * videoDuration;
      videoRef.current.seek(Math.round(videoPosition)); // Resume from last paused position

      start(videoDuration * (1 - lastValueRef.current)); // Resume animation from where it left off
    } else {
      start(end * (1 - lastValueRef.current)); // For images, restart progress
    }
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

  const handlenavigateToProfile = item => {
    navigateWithPause(
      user.userId === item.userId ? 'ProfileScreen' : 'ProfileDetail',
      user.userId === item.userId
        ? undefined
        : {
            userName: item.userName,
            userImage: item.userImage,
            userId: item.userId,
            loggedInUserId: user.userId,
            connectionId: '',
          },
    );
  };
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
          {!isLoading &&
          reversedContent[current] &&
          reversedContent[current].mediaType == 'video' ? (
            <Video
              ref={videoRef}
              source={{
                uri: `${imagesBucketcloudfrontPath}${reversedContent[current].mediaBlob}`,
              }}
              rate={1.0}
              volume={1.0}
              resizeMode="cover"
              onLoad={onLoadVideo}
              style={{height: height, width: width}}
              onProgress={data => {
                setVideoProgress(data.currentTime);
              }}
              paused={isPaused || !isScreenFocused || !isFocused}
              onEnd={() => {
                onPressNext();
              }}
            />
          ) : (
            <FastImage
              onLoadStart={onLoadStartImage}
              onLoadEnd={onLoadEndImage}
              source={{
                uri: `${imagesBucketcloudfrontPath}${reversedContent[current].mediaBlob}`,
                priority: FastImage.priority.high,
              }}
              resizeMode={FastImage.resizeMode.contain}
              style={{width: width, height: height}}
            />
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
              onPress={() => storyLike(reversedContent[current])}>
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
              onPress={() => storyLikeList(reversedContent[current])}>
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
                onPress={() => storyviewList(reversedContent[current])}>
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
                onPress={() => onDeleteStory(reversedContent[current].storyId)}>
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

        <StoryCommentBottomSheet
          ref={commentSheetRef}
          StoryStateParam={StoryState}
          postItem={reversedContent[current]}
          User={user}
          listTypeData={''}
          userPermissions={userPermissions}
          onClose={closeModal}
        />
      </BottomSheetModalProvider>
    </SafeAreaView>
  );
};

export default StoryView;

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
