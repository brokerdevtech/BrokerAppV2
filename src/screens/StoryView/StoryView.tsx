import React, {useState, useRef, useEffect} from 'react';
import {
  Animated,
  ScrollView,
  Keyboard,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  StyleSheet,
  View,
  YellowBox,
} from 'react-native';

import {useKeyboardStatus} from '../../hooks/useKeyboardStatus';
import {ExtraStory, seenTypes} from '../../reducers/storyReducer';
import StoryItem from './StoryItem';
import {goBack} from '../../navigations/rootNavigation';
import {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '../StoryPreviewList/StoryPreviewList';
//constant
const perspective = 500;
const A = Math.atan(perspective / (SCREEN_WIDTH / 2));
const ratio = Platform.OS === 'ios' ? 2 : 1.2;
export interface StoryViewProps {
  data: ExtraStory[];
  groupIndex: number;
}
export type StoryController = {
  currentGroupIndex: number;
};
const mockData = {
  stories: [
    {
      ownUser: {
        username: 'johndoe',
        avatarURL: 'https://example.com/avatar1.jpg',
      },
      storyList: [
        {
          uid: 'story1',
          source: 'https://example.com/story1.jpg',
          seen: 0,
          seenList: ['user1', 'user2', 'user3', 'user4', 'user5'],
          create_at: {
            toMillis: function () {
              return 1705305600000;
            },
          },
        },
        {
          uid: 'story2',
          source: 'https://example.com/story2.jpg',
          seen: 0,
          seenList: ['user1', 'user2', 'user3'],
          create_at: {
            toMillis: function () {
              return 1705309200000;
            },
          },
        },
        {
          uid: 'story3',
          source: 'https://example.com/story3.jpg',
          seen: 0,
          seenList: ['user1', 'user4', 'user5', 'user6', 'user7'],
          create_at: {
            toMillis: function () {
              return 1705312800000;
            },
          },
        },
      ],
    },
    {
      ownUser: {
        username: 'janedoe',
        avatarURL: 'https://example.com/avatar2.jpg',
      },
      storyList: [
        {
          uid: 'story4',
          source: 'https://example.com/story4.jpg',
          seen: 0,
          seenList: ['user1', 'user2'],
          create_at: {
            toMillis: function () {
              return 1705316400000;
            },
          },
        },
        {
          uid: 'story5',
          source: 'https://example.com/story5.jpg',
          seen: 0,
          seenList: ['user1', 'user3', 'user4'],
          create_at: {
            toMillis: function () {
              return 1705320000000;
            },
          },
        },
      ],
    },
  ],
  controller: {
    currentGroupIndex: 0,
  },
  seenTypes: {
    SEEN: 1,
    NOTSEEN: 0,
  },
};
const StoryView = ({groupIndex, data}: StoryViewProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [storyControllers, setStoryControllers] = useState<StoryController[]>(
    [],
  );
  const animX = React.useMemo(() => new Animated.Value(1), []);
  const _scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const controllerList = data.map(() => ({
      currentGroupIndex: groupIndex,
    }));
    setStoryControllers(controllerList);
    setLoading(false);
  }, [data, groupIndex]);

  const _onScrollHandler = ({
    nativeEvent: {
      contentOffset: {x},
    },
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    animX.setValue(x);
  };

  const _onScrollEndHandler = ({
    nativeEvent: {
      contentOffset: {x},
    },
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextIndex = Math.floor(x / SCREEN_WIDTH);
    if (nextIndex !== storyControllers[0].currentGroupIndex) {
      setStoryControllers(prev => {
        return prev.map(controller => ({
          ...controller,
          currentGroupIndex: nextIndex,
        }));
      });
    }
  };

  if (loading) return null;

  return (
    <View style={styles.container}>
      <ScrollView
        ref={_scrollRef}
        contentContainerStyle={{width: SCREEN_WIDTH * data.length}}
        horizontal
        snapToInterval={SCREEN_WIDTH}
        decelerationRate="fast"
        onScroll={_onScrollHandler}
        onMomentumScrollEnd={_onScrollEndHandler}
        showsHorizontalScrollIndicator={false}
        bounces={false}
        scrollEventThrottle={16}>
        {data.map((story, index) => (
          <Animated.View key={index} style={{width: SCREEN_WIDTH}}>
            <StoryItem
              item={mockData.stories[0]}
              index={0}
              maxIndex={mockData.stories.length - 1}
              controller={mockData.controller}
              setController={(prevIndex, nextIndex) => {
                _scrollRef.current?.scrollTo({
                  x: nextIndex * SCREEN_WIDTH,
                  animated: true,
                });
              }}
            />
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
};

export default StoryView;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
});
