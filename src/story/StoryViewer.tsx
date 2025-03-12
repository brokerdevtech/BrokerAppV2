import React, { useEffect, useRef, useState } from 'react';
import { View, Modal, Dimensions, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import StoryItem from './StoryItem';
import ProgressBar from './ProgressBar';
import { useStory } from './StoryContext';
import { runOnJS } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

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

  const isTransitioning = useRef(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setIsPaused(false); // Reset pause state when the story changes
  }, [currentMediaIndex, currentStoryIndex]);

  if (currentStoryIndex === -1) return null;

  const currentUserStories = stories[currentStoryIndex]?.storyDetails || [];

  // Handles transitioning between stories
  const handleNextStory = () => {
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
  };

  // Handles transitioning to the previous story
  const handlePreviousStory = () => {
    if (!isTransitioning.current) {
      isTransitioning.current = true;
      goToPreviousStory();
      setTimeout(() => {
        isTransitioning.current = false;
      }, 50);
    }
  };

  // Tap Gesture for Navigation (Right → Next, Left → Previous)
  const tapGesture = Gesture.Tap()
    .runOnJS(true)
    .onEnd((event) => {
      if (event.x > width / 2) {
        runOnJS(handleNextStory)();
      } else {
        runOnJS(handlePreviousStory)();
      }
    });

  // Long Press to Pause ProgressBar
  const longPressGesture = Gesture.LongPress()
    .minDuration(200)
    .shouldCancelWhenOutside(false)
    .onStart(() => runOnJS(setIsPaused)(true)) // Pause progress
    .onEnd(() => runOnJS(setIsPaused)(false)); // Resume progress

  // Swipe Down Gesture to Close Story Viewer
  const swipeDownGesture = Gesture.Pan()
    .shouldCancelWhenOutside(false)
    .onEnd((event) => {
      if (event.translationY > 50) {
        runOnJS(setCurrentUser)(-1); // Close the story viewer
      }
    });

  return (
    <Modal visible={isStoryViewerVisible} animationType="fade" transparent>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <GestureDetector gesture={Gesture.Simultaneous(swipeDownGesture, tapGesture, longPressGesture)}>
          <View style={styles.container}>
            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={() => setCurrentUser(-1)}>
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
              story={currentUserStories[currentMediaIndex]}
              onLoad={() => runOnJS(setIsPaused)(false)}
              onVideoEnd={handleNextStory}
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
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 50,
  },
  closeText: {
    fontSize: 22,
    color: '#fff',
  },
});

export default StoryViewer;
