import {imagesBucketcloudfrontPath} from '../config/constants';
import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  View,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import Video from 'react-native-video';
import StoriesAction from './StoriesActions';

const {width, height} = Dimensions.get('window');

interface StoryItemProps {
  story: any;
  storyIndex: any;
  onLoad: () => void; // Notify when media is loaded
  onVideoEnd: () => void; // Notify when video finishes playing
  togglePause: () => void; // Notify when video finishes playing
  oncloseModal: () => void; // Notify when
}

const StoryItem: React.FC<StoryItemProps> = ({
  story,
  storyIndex,
  onLoad,
  onVideoEnd,
  togglePause,
  oncloseModal,
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
  return (
    <View style={styles.container}>
      {loading && (
        <ActivityIndicator size="large" color="white" style={styles.loader} />
      )}

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
            onEnd={onVideoEnd}
            controls={false}
            muted={false}
            repeat={false}
          />
        )
      )}
      {/* Pass handlers to track when touch is over action area */}
      {story && (
        <StoriesAction
          story={story}
          storyState={storyStates}
          updateStoryState={newState => setStoryStates(newState)}
          storyIndex={storyIndex}
          togglePause={togglePause}
          closeStory={oncloseModal}
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
  media: {
    width,
    height,
  },
  loader: {
    position: 'absolute',
  },
});

export default StoryItem;
