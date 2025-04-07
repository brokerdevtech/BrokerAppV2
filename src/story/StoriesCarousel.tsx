// import React, { useEffect, useRef, useState } from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import StoryViewer from './StoryViewer';
import { useStory } from './StoryContext';
import { useEffect, useRef, useState } from 'react';

const { width, height } = Dimensions.get('window');

const StoriesCarousel = () => {
  const { stories, currentStoryIndex, goToNextStory, goToPreviousStory } = useStory();
  const scrollViewRef = useRef<ScrollView>(null);
  const [isStoryVisible, setStoryVisible] = useState(true);

  // Ensure `currentStoryIndex` is valid
  const isValidIndex = stories.length > 0 && currentStoryIndex >= 0 && currentStoryIndex < stories.length;

  useEffect(() => {
    if (scrollViewRef.current && isValidIndex) {
      scrollViewRef.current.scrollTo({
        x: currentStoryIndex * width,
        animated: true,
      });

      setStoryVisible(true);
    }
  }, [currentStoryIndex, isValidIndex]);

  if (!isValidIndex) return null;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false} // Prevent manual swiping
      >
        {stories.map((item, index) => (
          <View key={item.userId} style={{ width, height }}>
            {isStoryVisible && index === currentStoryIndex && (
              <StoryViewer
                storyDetails={item.storyDetails}
                onClose={() => setStoryVisible(false)}
                
              />
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default StoriesCarousel;
