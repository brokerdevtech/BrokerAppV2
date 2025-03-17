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

const {width, height} = Dimensions.get('window');

interface StoryItemProps {
  story: {mediaBlob: string; mediaType: 'image' | 'video'};
  onLoad: () => void; // Notify when media is loaded
  onVideoEnd: () => void; // Notify when video finishes playing
}

const StoryItem: React.FC<StoryItemProps> = ({story, onLoad, onVideoEnd}) => {
  // console.log(story?.mediaType);
  const videoRef = useRef<Video>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (story?.mediaType.toLowerCase() === 'video') {
      videoRef.current?.seek(0);
    }
  }, [story]);

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
