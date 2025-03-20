import React, {useRef, useState} from 'react';
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
  DeleteStory,
  StoryLike,
  StoryUnLIke,
} from '../../BrokerAppCore/services/Story';
import {useToast} from '../../components/ui/toast';
import {useNavigation} from '@react-navigation/native';
import StoryCommentBottomSheet from '../sharedComponents/StoryCommentBottomSheet';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
const StoriesAction = ({
  story,
  storyState,
  updateStoryState,
  storyIndex,
  togglePause,
  colors = {white: '#FFFFFF'},
  setActionAreaActive,
  closeStory,
}) => {
  const {stories, currentStoryIndex} = useStory();
  const user = useSelector((state: RootState) => state.user.user);

  const toast = useToast();
  const isStoryOwner = user.userId === stories[currentStoryIndex]?.userId;
  const navigation = useNavigation();
  const commentSheetRef = useRef(null);
  const userPermissions = useSelector(
    (state: RootState) => state.user.user.userPermissions,
  );
  const [isOpen, setOpen] = useState(false);

  const closeModal = async (item: any) => {
    setOpen(false);
    updateStoryState(item);
    await new Promise(resolve => setTimeout(resolve, 200));
    togglePause();
  };
  const handleActionPress = callback => {
    return event => {
      console.log('handleActionPress');
      event.stopPropagation(); // Prevents tapGesture from triggering
      setActionAreaActive(true); // Mark action area as active
      callback();
    };
  };
  const handleStoryLike = async () => {
    console.log('handleStoryLike', story.storyId);

    togglePause(); // Pause the story when action starts
    console.log('user', user.userId, story.storyId);
    console.log('user', user);
    try {
      let result;
      if (storyState?.userLiked && storyState?.userLiked == 1) {
        result = await StoryUnLIke(user.userId, story.storyId);
      } else {
        result = await StoryLike(user.userId, story.storyId);
      }
      console.log(result, 'result');
      updateStoryState({
        likeCount: result.data.storyDetails[0].likeCount,
        reactionCount: result.data.storyDetails[0].reactionCount,
        viewerCount: result.data.storyDetails[0].viewerCount,
        userLiked: result.data.storyDetails[0].userLiked,
      });
      togglePause();
    } catch (error) {
      console.log(error);
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
    togglePause();
    commentSheetRef.current?.open();
    setOpen(true);
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
                closeStory();
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
  console.log(stories, 'kmm');
  return (
    <BottomSheetModalProvider>
      {/* Only render action buttons when bottom sheet is not open */}
      {!isOpen && (
        <View style={styles.actionContainer}>
          {/* Like Button */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleActionPress(handleStoryLike)}>
            <View
              style={[
                styles.iconContainer,
                storyState.userLiked ? styles.likedIcon : {},
              ]}>
              {storyState.userLiked ? (
                <LikeWhite accessible={true} accessibilityLabel="Like White" />
              ) : (
                <UnLikeWhite
                  accessible={true}
                  accessibilityLabel="unlike white"
                />
              )}
            </View>

            <TouchableOpacity onPress={navigateToStoryLikeList}>
              <Text style={styles.countText}>{storyState.likeCount}</Text>
            </TouchableOpacity>
          </TouchableOpacity>

          {/* Comment Button */}
          <TouchableOpacity style={styles.actionButton} onPress={handleComment}>
            <View style={styles.iconContainer}>
              <CommentWhite
                accessible={true}
                accessibilityLabel="comment white"
              />
            </View>
            <Text style={styles.countText}>{storyState.reactionCount}</Text>
          </TouchableOpacity>

          {isStoryOwner && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={navigateToStoryViewList}>
              <View style={styles.iconContainer}>
                <OpenEye accessible={true} accessibilityLabel="open eye" />
              </View>
              <Text style={styles.countText}>{storyState.viewerCount}</Text>
            </TouchableOpacity>
          )}

          {/* Delete Button (only for story owner) */}
          {isStoryOwner && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleDeleteStory}>
              <View style={styles.iconContainer}>
                <TrashWhite
                  accessible={true}
                  accessibilityLabel="trash white"
                />
              </View>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Always render the bottom sheet */}

      <StoryCommentBottomSheet
        ref={commentSheetRef}
        StoryStateParam={storyState}
        postItem={story}
        User={user}
        listTypeData={''}
        userPermissions={userPermissions}
        onClose={closeModal}
      />
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
    borderRadius: 25,
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
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default StoriesAction;
