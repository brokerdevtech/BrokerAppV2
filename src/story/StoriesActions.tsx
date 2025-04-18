import React, {useEffect, useRef, useState} from 'react';
import {View, TouchableOpacity, StyleSheet, Alert, Text} from 'react-native';
import {runOnJS} from 'react-native-reanimated';
import {useStory} from './StoryContext';

// You'll need to import these from your project
import {
  LikeWhite,
  UnLikeWhite,
  CommentWhite,
  OpenEye,
  TrashWhite,
} from '../assets/svg';

import {useSelector} from 'react-redux';
import {
  AddStoryViewer,
  DeleteStory,
  StoryLike,
  StoryUnLIke,
} from '../../BrokerAppCore/services/Story';
import {useToast} from '../../components/ui/toast';
import {useNavigation} from '@react-navigation/native';
import StoryCommentBottomSheet from '../sharedComponents/StoryCommentBottomSheet';
import {
  BottomSheetModalProvider,
  useBottomSheetModal,
} from '@gorhom/bottom-sheet';
import {RootState} from '../../BrokerAppCore/redux/store/reducers';
import TouchableOpacityWithPermissionCheck from '../sharedComponents/TouchableOpacityWithPermissionCheck';
import {PermissionKey} from '../config/constants';
import TextWithPermissionCheck from '../sharedComponents/TextWithPermissionCheck';
const StoriesAction = ({
  story,
  storyState,

  storyIndex,
  togglePause,
  colors = {white: '#FFFFFF'},
  setActionAreaActive,
  closeStory,
}) => {
  const {stories, currentStoryIndex, updateCurrentStory, deleteCurrentStory} =
    useStory();
  const [ActionStoryStates, setActionStoryStates] = useState({});
  const user = useSelector((state: RootState) => state.user.user);
  const {dismiss, dismissAll} = useBottomSheetModal();
  const toast = useToast();
  let isStoryOwner = user.userId === stories[currentStoryIndex]?.userId;
  const navigation = useNavigation();
  const commentSheetRef = useRef(null);
  const userPermissions = useSelector(
    (state: RootState) => state.user.user.userPermissions,
  );

  useEffect(() => {
 
    isStoryOwner = user.userId === stories[currentStoryIndex]?.userId;
    console.log("============================stories[currentStoryIndex]?.storyId");
    console.log(stories[currentStoryIndex].storyDetails);
    console.log(story);
   AddStoryViewer(user.userId, story?.storyId);
    let storystateobj = {
      likeCount: storyState?.likeCount || 0,
      reactionCount: storyState?.reactionCount || 0,
      viewerCount: storyState?.viewerCount || 0,
      userLiked: storyState?.userLiked || 0,
    };
    setActionStoryStates(storystateobj);

  }, [story, storyState, currentStoryIndex]);

  const [isOpen, setOpen] = useState(false);

  const closeModal = async (item: any) => {
    // updateCurrentStory(item)
    setOpen(false);

    setActionStoryStates(item);
    //  dismissAll();
    commentSheetRef.current?.dismiss();
    //updateCurrentStory(item)
    // await new Promise(resolve => setTimeout(resolve, 200));
    // togglePause();
    //   commentSheetRef.current?.close();
    setTimeout(() => {
      updateCurrentStory(item);
    }, 200); // optional delay to avoid open loop

    setTimeout(() => {
      togglePause(); // resume playback after close
    }, 300);
  };

  const handleActionPress = callback => {
    return event => {
      // console.log('handleActionPress');
      event.stopPropagation(); // Prevents tapGesture from triggering
      // setActionAreaActive(true); // Mark action area as active
      callback();
    };
  };
  const handleStoryLike = async () => {
    // console.log('handleStoryLike', story.storyId);

    togglePause(); // Pause the story when action starts
    // console.log('user', user.userId, story.storyId);
    // console.log('user', user);
    try {
      let result;
      if (storyState?.userLiked && storyState?.userLiked == 1) {
        result = await StoryUnLIke(user.userId, story.storyId);
      } else {
        result = await StoryLike(user.userId, story.storyId);
      }
      // console.log(result, 'result');
      setActionStoryStates({
        likeCount: result.data.storyDetails[0].likeCount,
        reactionCount: result.data.storyDetails[0].reactionCount,
        viewerCount: result.data.storyDetails[0].viewerCount,
        userLiked: result.data.storyDetails[0].userLiked,
      });
      updateCurrentStory({
        likeCount: result.data.storyDetails[0].likeCount,
        reactionCount: result.data.storyDetails[0].reactionCount,
        viewerCount: result.data.storyDetails[0].viewerCount,
        userLiked: result.data.storyDetails[0].userLiked,
      });
      togglePause();
    } catch (error) {

      console.error('Error liking/unliking story:', error);
      togglePause();
    }
  };

  const navigateToStoryLikeList = () => {
    togglePause();
    navigation.navigate('StoryLikeList', {
      ActionId: story.storyId,
      userId: user.userId,
    });
  };

  const navigateToStoryViewList = () => {
    togglePause();
    // In a real app, you'd navigate to the viewers list:
    navigation.navigate('StoryViewList', {
      ActionId: story.storyId,
      userId: user.userId,
    });
  };

  const handleComment = () => {
    setOpen(true);
    togglePause();
    commentSheetRef.current?.open();
  };
  const handleComment1 = () => {
    if (!isOpen) {
      setOpen(true);
      togglePause();
      //   commentSheetRef.current?.open();
    }
  };
  const handleDeleteStory = () => {
    // Pause the story while showing the alert
    togglePause();

    // Show the confirmation alert
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this story?',
      [
        {
          text: 'No',
          style: 'cancel',
          onPress: () => {
            // Resume the story if user cancels
            togglePause();
          },
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              const deleteResponse = await DeleteStory(
                user.userId,
                story.storyId,
              );
              if (deleteResponse.status === 'success') {
                toast.show({
                  description: deleteResponse.statusMessage,
                });
                deleteCurrentStory();
                togglePause();
                //  closeStory();
              } else {
                togglePause();
              }
            } catch (error) {
              console.error('Error deleting story:', error);

              togglePause();
            }
          },
        },
      ],
      {cancelable: false},
    );
  };
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        commentSheetRef.current?.open(); // safer for @gorhom/bottom-sheet v5+
      }, 0);
    }
  }, [isOpen]);
  // console.log(stories, 'kmm');
  return (
    <BottomSheetModalProvider>
      {/* Only render action buttons when bottom sheet is not open */}
      {!isOpen && (
        <View style={styles.actionContainer}>
          {/* Like Button */}
          <TouchableOpacityWithPermissionCheck
            style={styles.actionButton}
            fontColor={colors.white}
            tagNames={[View, LikeWhite, UnLikeWhite]}
            permissionEnum={
              ActionStoryStates.userLiked
                ? PermissionKey.AllowUnLikeStory
                : PermissionKey.AllowLikeStory
            }
            permissionsArray={userPermissions}
            onPress={() => handleStoryLike()}>
            <View style={[styles.iconContainer]}>
              {ActionStoryStates?.userLiked ? (
                <LikeWhite accessible={true} accessibilityLabel="Like White" />
              ) : (
                <UnLikeWhite
                  accessible={true}
                  accessibilityLabel="unlike white"
                />
              )}
              {ActionStoryStates?.likeCount>0 &&
              <TextWithPermissionCheck
                permissionEnum={PermissionKey.AllowViewStoryLikes}
                permissionsArray={userPermissions}
                onPress={navigateToStoryLikeList}>
                <Text style={styles.countText}>
                  {ActionStoryStates.likeCount}
                </Text>
              </TextWithPermissionCheck>}
            </View>
          </TouchableOpacityWithPermissionCheck>

          {/* Comment Button */}

          <TouchableOpacityWithPermissionCheck
            tagNames={[View, CommentWhite]}
            permissionsArray={userPermissions}
            permissionEnum={PermissionKey.AllowViewStoryReaction}
            style={styles.actionButton}
            onPress={handleComment}>
            <View style={styles.iconContainer}>
              <CommentWhite
                accessible={true}
                accessibilityLabel="comment white"
              />
              <Text style={styles.countText}>
                {ActionStoryStates?.reactionCount}
              </Text>
            </View>
          </TouchableOpacityWithPermissionCheck>

          {isStoryOwner && (
            <TouchableOpacityWithPermissionCheck
              style={styles.actionButton}
              onPress={navigateToStoryViewList}
              permissionsArray={userPermissions}
              tagNames={[View, OpenEye, Text]}
              permissionEnum={PermissionKey.AllowViewStoryViewers}>
              <View style={styles.iconContainer}>
                <OpenEye accessible={true} accessibilityLabel="open eye" />
                <Text style={styles.countText}>
                  {ActionStoryStates?.viewerCount}
                </Text>
              </View>
            </TouchableOpacityWithPermissionCheck>
          )}

          {/* Delete Button (only for story owner) */}
          {isStoryOwner && (
            <TouchableOpacityWithPermissionCheck
              style={styles.actionButton}
              tagNames={[View, TrashWhite]}
              permissionEnum={PermissionKey.AllowDeleteStory}
              permissionsArray={userPermissions}
              onPress={handleDeleteStory}>
              <View style={styles.iconContainer}>
                <TrashWhite
                  accessible={true}
                  accessibilityLabel="trash white"
                />
              </View>
            </TouchableOpacityWithPermissionCheck>
          )}
        </View>
      )}

      {/* Always render the bottom sheet */}
      {isOpen && (
        <StoryCommentBottomSheet
          ref={commentSheetRef}
          StoryStateParam={ActionStoryStates}
          postItem={story}
          User={user}
          listTypeData={''}
          userPermissions={userPermissions}
          onClose={closeModal}
        />
      )}
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  actionContainer: {
    position: 'absolute',
    right: 20,
    bottom: 80,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: 15,
  },
  iconContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 5,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  likedIcon: {
    backgroundColor: 'rgba(255, 0, 0, 0.3)',
  },
  iconText: {
    fontSize: 22,
  },
  countText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 2,
  },
});

export default StoriesAction;
