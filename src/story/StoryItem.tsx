import {imagesBucketcloudfrontPath} from '../config/constants';
import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  View,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import Video from 'react-native-video';
import StoriesAction from './StoriesActions';
import {styles as gstyles} from '../themes';
const {width, height} = Dimensions.get('window');

interface StoryItemProps {
  story: any;
  storyIndex: any;
  onLoad: () => void; // Notify when media is loaded
  onVideoEnd: () => void; // Notify when video finishes playing
  togglePause: () => void; // Notify when video finishes playing
  oncloseModal: () => void; // Notify when
  setActionAreaActive: any;
  handleNextStory: any;
  handlePreviousStory: any;
  isPaused: any;
}

const StoryItem: React.FC<StoryItemProps> = ({
  story,
  storyIndex,
  onLoad,
  onVideoEnd,
  togglePause,
  oncloseModal,
  setActionAreaActive,
  handleNextStory,
  handlePreviousStory,
  isPaused,
}) => {
  // console.log(story?.mediaType);
  const videoRef = useRef<Video>(null);
  const [loading, setLoading] = useState(true);
  const [storyStates, setStoryStates] = useState({});

  useEffect(() => {
    if (story?.mediaType.toLowerCase() === 'video') {
      videoRef.current?.seek(0);
    }
    let storystateobj = {
      likeCount: story.likeCount || 0,
      reactionCount: story.reactionCount || 0,
      viewerCount: story.viewerCount || 0,
      userLiked: story.userLiked || 0,
    };
    setStoryStates(storyStates);
  }, [story]);
  console.log(story, 'ss');

  function onPressPrevious() {
    console.log('onPressPrevious');
    handlePreviousStory();
  }
  function onPressNext() {
    console.log('onPressNext');
    handleNextStory();
  }
  return (
    <View style={styles.container}>
      {loading && (
        <ActivityIndicator size="large" color="white" style={styles.loader} />
      )}
      <View style={styles.backgroundContainer}>
        {story && story?.mediaType.toLowerCase() === 'image' ? (
          <>
            <Image
              source={{uri: `${imagesBucketcloudfrontPath}${story.mediaBlob}`}}
              style={styles.media}
              resizeMode="contain"
              onLoad={() => {
                setLoading(false);
                onLoad();
              }}
              onError={() => {
                setLoading(false);
                onLoad();
              }}
            />
          </>
        ) : (
          story && (
            <Video
              ref={videoRef}
              source={{uri: `${imagesBucketcloudfrontPath}${story.mediaBlob}`}}
              style={styles.media}
              resizeMode="contain"
              onReadyForDisplay={() => {
                setLoading(false);
                onLoad();
              }}
              paused={isPaused}
              onEnd={onVideoEnd}
              controls={false}
              muted={false}
              repeat={false}
            />
          )
        )}
      </View>
      <View style={styles.nextPreviousContainer}>
        <TouchableWithoutFeedback onPress={onPressPrevious}>
          <View style={gstyles.flex} />
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={onPressNext}>
          <View style={gstyles.flex} />
        </TouchableWithoutFeedback>
      </View>

      {story && (
        <StoriesAction
          story={story}
          storyState={storyStates}
          updateStoryState={newState => setStoryStates(newState)}
          storyIndex={storyIndex}
          togglePause={togglePause}
          closeStory={oncloseModal}
          setActionAreaActive={setActionAreaActive}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  media: {
    width,
    height,
  },
  loader: {
    position: 'absolute',
  },
  nextPreviousContainer: {
    // backgroundColor:'red',
    ...gstyles.flexRow,
    ...gstyles.flex,
  },
});

export default StoryItem;
