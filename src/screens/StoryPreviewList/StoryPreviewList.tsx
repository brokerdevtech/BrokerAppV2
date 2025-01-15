import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
// import { useSelector } from '../../reducers'
import StoryAdderItem from './StoryAdderItem';
// import StoryPreviewItem from './StoryPreviewItem';

import {useDispatch} from 'react-redux';
import StoryPreviewItem from './StoryPreviewItem';
// import {storiesData} from '../../constants/constants';
// import { FetchStoryListRequest } from '../../actions/storyActions'
export const SCREEN_HEIGHT: number = Math.round(
  Dimensions.get('window').height,
);
const storiesData = {
  stories: [
    {
      userId: '1',
      username: 'john_doe',
      userAvatar:
        'https://st.depositphotos.com/2001755/3622/i/450/depositphotos_36220949-stock-photo-beautiful-landscape.jpg',
      hasUnseenStories: true,
      stories: [
        {
          id: 'story1',
          type: 'image',
          url: 'https://cdn.pixabay.com/photo/2024/05/26/10/15/bird-8788491_1280.jpg',
          createdAt: '2025-01-14T10:00:00Z',
          duration: 5,
          viewedBy: ['user2', 'user3', 'user4', 'user5'],
          reactions: [
            {
              userId: 'user2',
              type: 'heart',
              timestamp: '2025-01-14T10:01:00Z',
            },
            {
              userId: 'user3',
              type: 'clap',
              timestamp: '2025-01-14T10:02:00Z',
            },
          ],
          metadata: {
            location: 'New York City',
            filter: 'clarendon',
            mentions: ['@jane_smith', '@mike_wilson'],
            hashtags: ['#newyork', '#city', '#weekend'],
            music: {
              title: 'City Lights',
              artist: 'Urban Dreams',
              duration: 15,
            },
          },
        },
        {
          id: 'story2',
          type: 'video',
          url: 'https://images.panda.org/assets/images/pages/welcome/orangutan_1600x1000_279157.jpg',
          thumbnailUrl: 'https://example.com/stories/thumb1.jpg',
          createdAt: '2025-01-14T11:30:00Z',
          duration: 15,
          viewedBy: ['user2', 'user6', 'user7'],
          reactions: [
            {
              userId: 'user6',
              type: 'fire',
              timestamp: '2025-01-14T11:35:00Z',
            },
          ],
          metadata: {
            location: 'Central Park',
            filter: 'gingham',
            mentions: ['@sarah_jones'],
            hashtags: ['#centralpark', '#nature'],
          },
        },
      ],
    },
    {
      userId: '2',
      username: 'jane_smith',
      userAvatar:
        'https://images.panda.org/assets/images/pages/welcome/orangutan_1600x1000_279157.jpg',
      hasUnseenStories: false,
      stories: [
        {
          id: 'story3',
          type: 'image',
          url: 'https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp',
          createdAt: '2025-01-14T09:00:00Z',
          duration: 5,
          viewedBy: ['user1', 'user3', 'user4', 'user8'],
          reactions: [
            {
              userId: 'user8',
              type: 'laugh',
              timestamp: '2025-01-14T09:05:00Z',
            },
          ],
          metadata: {
            poll: {
              question: 'Best brunch spot?',
              options: [
                {
                  text: 'Cafe Delight',
                  votes: 245,
                },
                {
                  text: 'Morning Glory',
                  votes: 189,
                },
              ],
              expiresAt: '2025-01-15T09:00:00Z',
            },
            location: 'Brooklyn',
            filter: 'valencia',
          },
        },
      ],
    },
    {
      userId: '3',
      username: 'mike_wilson',
      userAvatar: 'https://th.bing.com/th/id/OIG2._JJ7jEND0UMuzHjwBeTh',
      hasUnseenStories: true,
      stories: [
        {
          id: 'story4',
          type: 'video',
          url: 'https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4',
          thumbnailUrl: 'https://example.com/stories/thumb2.jpg',
          createdAt: '2025-01-14T12:00:00Z',
          duration: 20,
          viewedBy: ['user1', 'user2', 'user5', 'user9'],
          reactions: [],
          metadata: {
            quiz: {
              question: 'Guess where I am?',
              options: [
                {
                  text: 'Paris',
                  isCorrect: true,
                  votes: 156,
                },
                {
                  text: 'London',
                  isCorrect: false,
                  votes: 89,
                },
                {
                  text: 'Rome',
                  isCorrect: false,
                  votes: 67,
                },
              ],
            },
            location: 'Paris, France',
            filter: 'perpetua',
          },
        },
      ],
    },
    {
      userId: '4',
      username: 'sarah_jones',
      userAvatar:
        'https://static.gettyimages.com/display-sets/creative-landing/images/GettyImages-2181662163.jpg',
      hasUnseenStories: true,
      stories: [
        {
          id: 'story5',
          type: 'image',
          url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-_E9TLVzTnyqVmnVHgN_8t9264bPYuAeNaw&s',
          createdAt: '2025-01-14T13:30:00Z',
          duration: 5,
          viewedBy: ['user1', 'user2', 'user3'],
          reactions: [],
          metadata: {
            countdown: {
              event: 'Beach Party',
              endsAt: '2025-01-20T18:00:00Z',
              reminderCount: 45,
            },
            location: 'Miami Beach',
            filter: 'mayfair',
            hashtags: ['#beach', '#party', '#weekend'],
          },
        },
        {
          id: 'story6',
          type: 'video',
          url: 'https://videos.pexels.com/video-files/4114797/4114797-uhd_2560_1440_25fps.mp4',
          thumbnailUrl: 'https://example.com/stories/thumb3.jpg',
          createdAt: '2025-01-14T14:00:00Z',
          duration: 10,
          viewedBy: ['user1', 'user7', 'user8'],
          reactions: [
            {
              userId: 'user7',
              type: 'heart',
              timestamp: '2025-01-14T14:05:00Z',
            },
          ],
          metadata: {
            music: {
              title: 'Summer Vibes',
              artist: 'Beach Boys',
              duration: 10,
              albumCover: 'https://example.com/albums/summer.jpg',
            },
            location: 'Miami Beach',
            filter: 'hudson',
          },
        },
      ],
    },
    {
      userId: '5',
      username: 'alex_turner',
      userAvatar:
        'https://static.vecteezy.com/system/resources/thumbnails/041/166/062/small/ai-generated-hawk-high-quality-image-free-photo.jpg',
      hasUnseenStories: true,
      stories: [
        {
          id: 'story7',
          type: 'image',
          url: 'https://helpx.adobe.com/content/dam/help/en/photoshop/using/convert-color-image-black-white/jcr_content/main-pars/before_and_after/image-before/Landscape-Color.jpg',
          createdAt: '2025-01-14T15:00:00Z',
          duration: 5,
          viewedBy: ['user2', 'user3', 'user4'],
          reactions: [],
          metadata: {
            slider: {
              question: 'Rate this sunset!',
              emoji: '🌅',
              votes: [
                {
                  userId: 'user2',
                  value: 9,
                },
                {
                  userId: 'user3',
                  value: 10,
                },
              ],
              averageRating: 9.5,
            },
            location: 'Malibu',
            filter: 'rise',
            hashtags: ['#sunset', '#malibu', '#views'],
          },
        },
      ],
    },
  ],
};
export const SCREEN_WIDTH: number = Math.round(Dimensions.get('window').width);
const StoryPreviewList = () => {
  const [loadingStoryList, setLoadingStoryList] = useState<boolean>(true);
  // const storyList = useSelector(state => state.storyList)
  const _loadingDeg = new Animated.Value(0);
  const _onAnimateDeg = () => {
    Animated.timing(_loadingDeg, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      if (loadingStoryList) {
        _loadingDeg.setValue(0);
        _onAnimateDeg();
      }
    });
  };
  //   const dispatch = useDispatch();
  //   useEffect(() => {
  //     (async () => {
  //       await dispatch(FetchStoryListRequest());
  //       setLoadingStoryList(false);
  //     })();
  //   }, []);
  return (
    <View style={styles.container}>
      {loadingStoryList && (
        <Animated.Image
          onLayout={_onAnimateDeg}
          style={{
            ...styles.loading,
            transform: [
              {
                rotate: _loadingDeg.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          }}
          // source={require('../../assets/icons/waiting.png')}
        />
      )}
      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        bounces={false}>
        {/* <StoryAdderItem /> */}
        {storiesData.stories.map((item, index) => {
          // Add debug log for each story
          console.log('Processing story:', index, item);

          // if (!story) {
          //   console.warn(`Undefined story at index ${index}`);
          //   return null;
          // }

          return (
            <StoryPreviewItem
              key={item.userId || index}
              index={index}
              item={item}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

export default StoryPreviewList;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    // paddingVertical: 20,
    height: 104,
  },
  loading: {
    position: 'absolute',
    width: 30,
    height: 30,
    left: (SCREEN_WIDTH - 30) / 2,
    top: (104 - 30) / 2,
    zIndex: 999,
  },
});
