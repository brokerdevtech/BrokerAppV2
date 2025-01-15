// StoryPreviewItem.tsx
import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {navigate, useNavigation} from '@react-navigation/native'; // Import based on your navigation setup

interface Story {
  id: string;
  type: string;
  url: string;
  createdAt: string;
  duration: number;
  viewedBy: string[];
  reactions: any[];
  metadata: any;
}

interface StoryPreviewItemProps {
  item: {
    userId: string;
    username: string;
    userAvatar: string;
    hasUnseenStories: boolean;
    stories: Story[];
  };
  index: number;
}

const StoryPreviewItem = ({item, index}: StoryPreviewItemProps) => {
  const _loadingDeg = new Animated.Value(0);
  const [seen, setSeen] = useState<boolean>(!item.hasUnseenStories);
  const [preloadingImage, setPreloadingImage] = useState<boolean>(false);
  const navigation = useNavigation();
  const _onShowStory = () => {
    if (seen) {
      return _onCompletedLoadingImage();
    }
    setPreloadingImage(true);

    // Simulate image preloading for the demo
    setTimeout(() => {
      _onCompletedLoadingImage();
    }, 1000);
  };

  const _onAnimateDeg = () => {
    Animated.timing(_loadingDeg, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      if (preloadingImage) {
        _loadingDeg.setValue(0);
        _onAnimateDeg();
      }
    });
  };

  const _onCompletedLoadingImage = () => {
    setPreloadingImage(false);
    navigation.navigate('StoryFullView', {
      groupIndex: index,
      storiesList: item.stories,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.itemWrapper}>
        {!seen ? (
          <LinearGradient
            colors={['#c62f90', '#db3072', '#f19d4c']}
            start={{x: 0.75, y: 0.25}}
            end={{x: 0.25, y: 0.75}}
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        ) : (
          <View
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#ddd',
            }}
          />
        )}
        {preloadingImage && !seen && (
          <Animated.View
            onLayout={_onAnimateDeg}
            style={{
              ...styles.pointsWrapper,
              transform: [
                {
                  rotate: _loadingDeg.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            }}>
            <View style={styles.pointWrapper}>
              <View style={styles.triagle} />
            </View>
            <View
              style={{
                ...styles.pointWrapper,
                transform: [{rotate: '30deg'}],
              }}>
              <View style={styles.triagle} />
            </View>
            <View
              style={{
                ...styles.pointWrapper,
                transform: [{rotate: '60deg'}],
              }}>
              <View style={styles.triagle} />
            </View>
            <View
              style={{
                ...styles.pointWrapper,
                transform: [{rotate: '90deg'}],
              }}>
              <View style={styles.triagle} />
            </View>
          </Animated.View>
        )}
        <View style={styles.imageContainer}>
          <TouchableOpacity
            onPress={_onShowStory}
            activeOpacity={0.8}
            style={styles.imageWrapper}>
            <Image
              style={styles.image}
              source={{uri: item.userAvatar}}
              //   defaultSource={require('../../assets/default-avatar.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.username}>
        <Text
          numberOfLines={1}
          style={{
            width: '100%',
            textAlign: 'center',
            fontSize: 12,
            color: seen ? '#666' : '#000',
          }}>
          {item.username}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 85,
    height: 98,
    marginHorizontal: 5,
  },
  itemWrapper: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    marginHorizontal: 5,
    overflow: 'hidden',
    position: 'relative',
  },
  imageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    padding: 2,
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
    borderRadius: 35,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  username: {
    width: 85,
    height: 20,
    marginTop: 3,
  },
  pointsWrapper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  pointWrapper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  triagle: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'white',
  },
});

export default StoryPreviewItem;
