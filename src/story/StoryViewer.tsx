import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Modal,
  Dimensions,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
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
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';

const {width} = Dimensions.get('window');

const StoryViewer = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { index } = route.params;

  const {
    stories,
    currentStoryIndex,
    currentMediaIndex,
    isStoryViewerVisible,
    setCurrentUser,
    goToNextStory,
    goToPreviousStory,
    goToNextUser,
    goToPreviousUser,
  } = useStory();

  const user = useSelector((state: RootState) => state.user.user);
  const isTransitioning = useRef(false);
  const [isPaused, setIsPaused] = useState(true);
  const [isLoadingMedia, setIsLoadingMedia] = useState(true);
  const [isStoryReady, setIsStoryReady] = useState(false);
  // Add this ref to track if touch is happening over actions
  const actionAreaRef = useRef(false);
  // Track story states individually for each story
  const [storyStates, setStoryStates] = useState({});
  const [currentStory, setcurrentStory] = useState({});
  const [currentUserStories, setcurrentUserStories] = useState({});

  useEffect(() => {
    if (index !== undefined) {
      setCurrentUser(index); // this sets story viewer state
    }
  }, [index]);

  useFocusEffect(
    useCallback(() => {
      // Screen is focused (coming back)
      console.log('StoryViewer focused - resume playback');
      setIsPaused(false);
  
      return () => {
        // Screen is unfocused (navigating away)
        console.log('StoryViewer unfocused - pause playback');
        setIsPaused(true);
      };
    }, [])
  );
  useEffect(() => {
    setIsPaused(false);
  }, [currentMediaIndex, currentStoryIndex]);

  useEffect(() => {
    setIsLoadingMedia(true); // every time story index or user changes
    setIsStoryReady(false);
  }, [currentMediaIndex, currentStoryIndex]);
  // Initialize story states when stories change
  // useEffect(() => {
  //    // Get the current story being displayed
  //    let  currentUserStoriesEffect = stories[currentStoryIndex]?.storyDetails || [];
  //    setcurrentUserStories(currentUserStoriesEffect);
  //    setcurrentStory(currentUserStoriesEffect[currentMediaIndex]);
 
  // }, [currentMediaIndex, currentStoryIndex]);
  useEffect(() => {
    if (currentStoryIndex >= 0) {
      const currentUserStoriesEffect = stories[currentStoryIndex]?.storyDetails || [];
  
      setcurrentUserStories(currentUserStoriesEffect);
  
      if (currentMediaIndex >= 0 && currentMediaIndex < currentUserStoriesEffect.length) {
        setcurrentStory(currentUserStoriesEffect[currentMediaIndex]);
      } else {
        setcurrentStory(null); // optional: prevent out-of-bounds error
      }
    } else {
      // Story viewer is closed
      setcurrentUserStories([]);
      setcurrentStory(null);
    }
  }, [currentMediaIndex, currentStoryIndex, stories]);
  if (currentStoryIndex === -1 || !Array.isArray(currentUserStories)) return null;
  const currentUser = stories[currentStoryIndex] || {};
//  const currentUserStories = stories[currentStoryIndex]?.storyDetails || [];
  const togglePause = () => {
    console.log('Toggle pause called, current state:', isPaused);
    // if(isPaused== true){
    //   runOnJS(setIsPaused)(false);
    // }else{
    //   runOnJS(setIsPaused)(true);
    // }
    setIsPaused(prev => {
      console.log('Setting isPaused to:', !prev);
      return !prev;
    });
  };
  // Handles transitioning between stories
  const handleNextStory = () => {
     console.log('handleNextStory');
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

  const longPressGesture = Gesture.LongPress()
    .minDuration(400)
    .shouldCancelWhenOutside(false)
    .onStart(() => {
      console.log('Long press started - pausing video');
  
      runOnJS(setIsPaused)(true);
    })
    .onEnd(() => {
      console.log('Long press ended - resuming video');
  
      runOnJS(setIsPaused)(false);
    });
  const swipeDownGesture = Gesture.Pan()
    .shouldCancelWhenOutside(false)
    .onEnd(event => {
      if (event.translationY > 50) {
        runOnJS(setCurrentUser)(-1); // Close the story viewer
      }
    });
  const closeModal = () => {
    setCurrentUser(-1);
    // navigation.goBack();
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Home'); // or whatever your main screen is
    }
  };
  const horizontalSwipeGesture = Gesture.Pan()
  .onEnd((event) => {
    if (Math.abs(event.translationX) > 50) {
      if (event.translationX < 0) {
        // Swipe left → next user
        console.log('➡️ Swipe left: Next user');
        runOnJS(goToNextUser)();
      } else {
        // Swipe right → previous user
        console.log('⬅️ Swipe right: Previous user');
        runOnJS(goToPreviousUser)();
      }
    }
  });
  return (
  
      <GestureHandlerRootView style={{flex: 1}}>
        <GestureDetector
          gesture={Gesture.Exclusive(
            longPressGesture,
            Gesture.Simultaneous(
              swipeDownGesture,
              horizontalSwipeGesture // ✅ Add here
              // tapGesture removed as it might interfere
            ),
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
              {currentUserStories.map((item, index) => (
                <ProgressBar
                key={item.storyId?.toString() ?? index.toString()}
                  duration={(currentStory?.mediaDuration > -1 ? currentStory.mediaDuration : 10000)}
                  isActive={index === currentMediaIndex}
                  isPaused={isPaused  || isLoadingMedia|| !isStoryReady}
                  hasCompleted={index < currentMediaIndex} // Mark previous stories as completed
                  onComplete={handleNextStory}
                />
              ))}
            </View>
            {isLoadingMedia && (
              <ActivityIndicator
                size="large"
                color="white"
                style={{ position: 'absolute', alignSelf: 'center' }}
              />
            )}
            {/* Story Content */}
            <StoryItem
              story={currentStory}
              storyIndex={currentMediaIndex}
              onLoad={() => {
                setIsLoadingMedia(false);
                setIsPaused(false); // resume only after loading completes
                setIsStoryReady(true);
              }}
             // onLoad={() => runOnJS(setIsPaused)(false)}
              onVideoEnd={handleNextStory}
              togglePause={togglePause}
              oncloseModal={closeModal}
              setActionAreaActive={handleActionAreaActive}
              handleNextStory={handleNextStory}
              handlePreviousStory={handlePreviousStory}
              isPaused={isPaused }
            />
          </View>
        </GestureDetector>
      </GestureHandlerRootView>
   
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
    flex: 1, // Left 50% of the screen
  },
  rightTap: {
    flex: 1, // Right 50% of the screen
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
