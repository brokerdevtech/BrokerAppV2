/* eslint-disable react-native/no-inline-styles */
import React, {useState, useRef, useCallback} from 'react';
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
} from 'react-native';

// import {
//   LikeWhite,
//   UnLikeWhite,
//   OpenEye,
//   CommentWhite,
//   TrashWhite,
// } from '../assets/svgs';

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
import {CloseIcon} from '../../assets/svg';
import {Icon} from '../../../components/ui/icon';

const {width, height} = Dimensions.get('window');
const avatars = [
  {
    src: 'https://gratisography.com/wp-content/uploads/2024/01/gratisography-cyber-kitty-800x525.jpg',
    alt: 'Sandeep Srivastva',
    color: 'bg-emerald-600',
  },
  {
    src: 'https://gratisography.com/wp-content/uploads/2024/01/gratisography-cyber-kitty-800x525.jpg',
    alt: 'Arjun Kapoor',
    color: 'bg-cyan-600',
  },
  {
    src: 'https://gratisography.com/wp-content/uploads/2024/01/gratisography-cyber-kitty-800x525.jpg',
    alt: 'Ritik Sharma ',
    color: 'bg-indigo-600',
  },
  {
    src: 'https://gratisography.com/wp-content/uploads/2024/01/gratisography-cyber-kitty-800x525.jpg',
    alt: 'Akhil Sharma',
    color: 'bg-gray-600',
  },
  {
    src: 'https://gratisography.com/wp-content/uploads/2024/01/gratisography-cyber-kitty-800x525.jpg',
    alt: 'Rahul Sharma ',
    color: 'bg-red-400',
  },
];
//const AppTab: React.FC =
const StoryView: React.FC = ({route}) => {
  const navigation = useNavigation();
  const user = useSelector((state: RootState) => state.user.user);
  const colors = useSelector(state => state.theme.theme);
  const [storyId, setstoryId] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [StoryState, setStoryState] = useState({
    likeCount: 0,
    reactionCount: 0,
    viewerCount: 0,
    userLiked: 0,
  });
  const extraAvatars = avatars.slice(3);
  const remainingCount = extraAvatars.length;
  //console.log(route.params.userImage);
  const [userImage, setuserImage] = useState(route.params.userImage);
  const [content, setContent] = useState([
    ...route.params.userImage.storyDetails,
  ]);

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
  const progress = useRef(new Animated.Value(0)).current;
  const [isInputFocused, setIsInputFocused] = useState(false);
  const isPlayingRef = useRef(true);
  const lastValueRef = useRef(0);
  const [isViewListOpen, setIsViewListOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const animationProgress = useRef(new Animated.Value(0));
  const animation = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [scaleValue] = useState(new Animated.Value(1));
  useFocusEffect(
    useCallback(() => {
      // Initial setup that you want to run when the component gains focus
      const resetContentAndProgress = () => {
        //setCurrent(0); // Reset current index to initial
        progress.setValue(0); // Reset progress to initial value
        // Reset other states as needed
        play();
        // const resetContent = route.params.userImage.storyDetails.map((item, index) => {
        //   if (current === index) { // Assuming 'current' is defined somewhere in your scope
        //     return ({
        //       ...item,
        //       finish: 0, // Assuming 0 indicates not finished
        //     });
        //   }
        //   if (current > index) { // Assuming 'current' is defined somewhere in your scope
        //     return ({
        //       ...item,
        //       finish: 1, // Assuming 0 indicates not finished
        //     });
        //   }
        //   return item;
        // });
        //   setContent(resetContent);
        // setContent([...route.params.userImage.storyDetails]);
        setStoryState({
          likeCount: 0,
          reactionCount: 0,
          viewerCount: 0,
          userLiked: 0,
        });
        setStoryState({
          likeCount: reversedContent[current].likeCount,
          reactionCount: reversedContent[current].reactionCount,
          viewerCount: reversedContent[current].viewerCount,
          userLiked: reversedContent[current].userLiked,
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
    }, [route.params.userImage.storyDetails]),
  );

  // start() is for starting the animation bars at the top
  function start1(n) {
    if (content[current].mediaType == 'video') {
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
  function start(duration) {
    // Ensure duration is not zero
    duration = duration || 5000; // Default duration for images if not set
    Animated.timing(progress, {
      toValue: 1,
      duration: duration,
      useNativeDriver: false,
    }).start(({finished}) => {
      if (finished) {
        // console.log("Animated");
        onPressNext(); // Move to the next item
      }
    });
  }

  const onLoadVideo = status => {
    // console.log('Video loaded, duration:', status.duration);
    const videoDuration = secondsToMilliseconds(status.duration);
    // console.log('Duration in ms:', videoDuration);
    setEnd(videoDuration); // Set the end based on video duration
    play(videoDuration); // Start playing the story with the correct duration
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
    start(duration); // Pass the actual content duration
  }
  const onLoadEndImage = () => {
    progress.setValue(0);
    play(5000); // Default duration for images, adjust as necessary
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
    setstoryId(reversedContent[current].storyId);
    AddStoryViewer(user.userId, reversedContent[current].storyId);
    setStoryState({
      likeCount: reversedContent[current].likeCount,
      reactionCount: reversedContent[current].reactionCount,
      viewerCount: reversedContent[current].viewerCount,
      userLiked: reversedContent[current].userLiked,
    });
    start(end);
  }

  // next() is for changing the content of the current content to +1
  function onPressNext() {
    // console.log("onPressNext");

    if (KeybordShow) {
      Keyboard.dismiss();
      return;
    }

    // check if the next content is not empty
    if (current !== content.length - 1) {
      let data = [...content];
      data[current].finish = 1;
      setContent(data);
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

  const onLoadVideo1 = status => {
    // console.log('Video loaded, duration:', status.duration);

    const videoDuration = secondsToMilliseconds(status.duration);
    // console.log('Duration in ms:', videoDuration);
    setEnd(videoDuration);

    progress.setValue(0);
    play();
    // setEnd(secondsToMilliseconds(status.duration));
  };
  const StoryComment = () => {
    setActionSheetKey(prevKey => prevKey + 1);
    setstoryId(reversedContent[current].storyId);
    togglePlayPause();
    setOpen(true);
    // togglePlayPause();
  };
  const closeModal = async (item: any) => {
    //setCardComment(item);
    // console.log("closeModal");
    setOpen(false);
    await new Promise(resolve => setTimeout(resolve, 200));

    setStoryState(item);
    togglePlayPause();
    // setPostId(0);
  };

  const storyLike = async item => {
    //

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
              console.error('Error deleting connection:', error);
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

  // console.log('___________****************___________*********______');
  // console.log(userImage);
  return (
    <SafeAreaView style={localStyles.containerModal}>
      <StatusBar backgroundColor="black" barStyle="light-content" />

      <View style={localStyles.backgroundContainer}>
        {reversedContent[current] &&
        reversedContent[current].mediaType == 'video' ? (
          <Video
            source={{
              uri: `${imagesBucketcloudfrontPath}${reversedContent[current].mediaBlob}`,
            }}
            rate={1.0}
            volume={1.0}
            resizeMode="cover"
            //onReadyForDisplay={play}
            onLoad={onLoadVideo}
            style={{height: height, width: width}}
          />
        ) : (
          <FastImage
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
          <TouchableOpacity style={localStyles.userAvatarContainer}>
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
          {/* <TouchableOpacityWithPermissionCheck
            fontColor={colors.white}
            // tagNames={[LikeWhite, UnLikeWhite]}
            permissionEnum={
              StoryState.userLiked
                ? PermissionKey.AllowUnLikeStory
                : PermissionKey.AllowLikeStory
            }
            permissionsArray={userPermissions}
            onPress={() => storyLike(reversedContent[current])}>
            {StoryState.userLiked ? (
              // <LikeWhite accessible={true} accessibilityLabel="Like White" />
            ) : (
              // <UnLikeWhite
              //   accessible={true}
              //   accessibilityLabel="unlike white"
              // />
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
          </TextWithPermissionCheck> */}
        </Box>

        <Box
          display="flex"
          alignItems="center"
          style={localStyles.likeBtnStyle}>
          {/* <TouchableOpacityWithPermissionCheck
            fontColor={colors.white}
            tagNames={[Center, OpenEye, ZText]}
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
          </TouchableOpacityWithPermissionCheck> */}
        </Box>
        {user.userId === userImage.userId && (
          <Box
            display="flex"
            alignItems="center"
            style={localStyles.likeBtnStyle}>
            {/* <TouchableOpacityWithPermissionCheck
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
            </TouchableOpacityWithPermissionCheck> */}
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
    borderColor: 'red',

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
});
