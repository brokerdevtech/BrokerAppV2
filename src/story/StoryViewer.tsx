import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Modal,
  Dimensions,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import StoryItem from './StoryItem';
import ProgressBar from './ProgressBar';
import {useStory} from './StoryContext';
import {runOnJS} from 'react-native-reanimated';
import {imagesBucketcloudfrontPath} from '../config/constants';
import StoriesAction from './StoriesActions';
import {useSelector} from 'react-redux';

const {width} = Dimensions.get('window');

const StoryViewer = () => {
  const {
    stories,
    currentStoryIndex,
    currentMediaIndex,
    isStoryViewerVisible,
    setCurrentUser,
    goToNextStory,
    goToPreviousStory,
    goToNextUser,
  } = useStory();
  const user = useSelector((state: RootState) => state.user.user);
  const isTransitioning = useRef(false);
  const [isPaused, setIsPaused] = useState(false);
  // Add this ref to track if touch is happening over actions
  const actionAreaRef = useRef(false);
  // Track story states individually for each story
  const [storyStates, setStoryStates] = useState({});

  useEffect(() => {
    setIsPaused(false);
  }, [currentMediaIndex, currentStoryIndex]);

  // Initialize story states when stories change
  useEffect(() => {
    // const initialStates = {};
    // stories.forEach(userStories => {
    //   if (userStories?.storyDetails) {
    //     userStories.storyDetails.forEach(story => {
    //       initialStates[story.storyId] = {
    //         likeCount: story.likeCount || 0,
    //         reactionCount: story.reactionCount || 0,
    //         viewerCount: story.viewerCount || 0,
    //         userLiked: story.userLiked || 0,
    //       };
    //     });
    //   }
    // });
    // setStoryStates(initialStates);
  }, [stories]);

  if (currentStoryIndex === -1) return null;
  const currentUser = stories[currentStoryIndex] || {};
  const currentUserStories = stories[currentStoryIndex]?.storyDetails || [];
  const togglePause = () => {
    // console.log('Toggle ');
     runOnJS(setIsPaused)(true);

   // setIsPaused(prev => !prev);
  };
  // Handles transitioning between stories
  const handleNextStory = () => {
    console.log('next');
    if (isPaused === false) {
      if (!isTransitioning.current) {
        isTransitioning.current = true;
        setTimeout(() => {
          if (currentMediaIndex < currentUserStories.length - 1) {
            goToNextStory();
          } else {
            goToNextUser(); // Move to next user's stories when last story is done
          }
          isTransitioning.current = false;
        }, 50);
      }
    }
  };

  // Handles transitioning to the previous story
  const handlePreviousStory = () => {
    if (isPaused === false) {
      if (!isTransitioning.current) {
        isTransitioning.current = true;
        goToPreviousStory();
        setTimeout(() => {
          isTransitioning.current = false;
        }, 50);
      }
    }
  };

  // Set action area active state
  const handleActionAreaActive = active => {
    actionAreaRef.current = active;
  };

  // Update individual story state
  const updateStoryState = (storyId, newState) => {
    setStoryStates(prev => ({
      ...prev,
      [storyId]: newState,
    }));
  };

  // Tap Gesture for Navigation (Right → Next, Left → Previous)
  // const tapGesture = Gesture.Tap()
  //   .runOnJS(true)
  //   .onEnd(event => {
  //     console.log("tapGesture")
  //     console.log(actionAreaRef.current);
  //     // Only handle navigation if not tapping on action area
  //     if (!actionAreaRef.current) {  // Ignore taps on action buttons
  //       if (event.x > width / 2) {
  //         console.log("handleNextStory");
  //       //  runOnJS(handleNextStory)();
  //       } else {
  //         console.log("handlePreviousStory");
  //       //  runOnJS(handlePreviousStory)();
  //       }
  //     }
  //     actionAreaRef.current = false; // Reset after tap
  //     console.log("tapGesture")
  //     console.log(actionAreaRef.current);
  //   });

  // Long Press to Pause ProgressBar
  const longPressGesture = Gesture.LongPress()
    .minDuration(200)
    .shouldCancelWhenOutside(false)
    .onStart(() => runOnJS(setIsPaused)(true)) // Pause progress
    .onEnd(() => runOnJS(setIsPaused)(false)); // Resume progress

  const swipeDownGesture = Gesture.Pan()
    .shouldCancelWhenOutside(false)
    .onEnd(event => {
      if (event.translationY > 50) {
        runOnJS(setCurrentUser)(-1); // Close the story viewer
      }
    });
  const closeModal = () => {
    setCurrentUser(-1);
  };
  // Get the current story being displayed
  const currentStory = currentUserStories[currentMediaIndex];
  console.log(isPaused, 'current');
  return (
    <Modal visible={isStoryViewerVisible} animationType="fade" transparent>
      <GestureHandlerRootView style={{flex: 1}}>
        <GestureDetector
          gesture={Gesture.Simultaneous(
            swipeDownGesture,
           // tapGesture,
            longPressGesture,
          )}>
          <View style={styles.container}>
            <View style={styles.userInfoContainer}>
              <Image
                source={{
                  uri: `${imagesBucketcloudfrontPath}${currentUser.profileImage}`,
                }}
                style={styles.profileImage}
              />
              <Text style={styles.username}>{currentUser.postedBy}</Text>
            </View>

            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>

            {/* Progress Bars */}
            <View style={styles.progressBarContainer}>
              {currentUserStories.map((_, index) => (
                <ProgressBar
                  key={index}
                  duration={5000}
                  isActive={index === currentMediaIndex}
                  isPaused={isPaused}
                  hasCompleted={index < currentMediaIndex} // Mark previous stories as completed
                  onComplete={handleNextStory}
                />
              ))}
            </View>

            {/* Story Content */}
            <StoryItem
              story={currentStory}
              storyIndex={currentMediaIndex}
              onLoad={() => runOnJS(setIsPaused)(false)}
              onVideoEnd={handleNextStory}
              togglePause={togglePause}
              oncloseModal={closeModal}
              setActionAreaActive={handleActionAreaActive}  
              handleNextStory={handleNextStory}
              handlePreviousStory={handlePreviousStory}
            />
          </View>
        </GestureDetector>
      </GestureHandlerRootView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
  },
  leftTap: {
    flex: 1,  // Left 50% of the screen
  },
  rightTap: {
    flex: 1,  // Right 50% of the screen
  },
  progressBarContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: 20,
    width: '90%',
    alignSelf: 'center',
    zIndex: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    padding: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 100,
    height: 35,
    width: 35,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 14,
    color: '#fff',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default StoryViewer;
