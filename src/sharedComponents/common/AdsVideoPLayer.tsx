/* eslint-disable react-native/no-inline-styles */
import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from 'react';
import Video from 'react-native-video';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
} from 'react-native';

// import {Center, Progress} from 'native-base';

import PlayIcon from '../../assets/svg/icons/iconsplay.svg';

import {Progress} from '../../../components/ui/progress';
import { useFocusEffect } from '@react-navigation/native';
const AdsVideoPlayer = forwardRef((props, ref) => {
  const {sourceUri, vidStyle, onPress} = props;
  const [isFullscreen, setIsFullscreen] = useState(false);
  // const [vpaused, setvpaused] = useState(defaultPaused);
  const [vpaused, setvpaused] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);
  const [hasEnded, setHasEnded] = useState(false);

  const onProgress = data => {
    setProgress(data.currentTime / data.seekableDuration);
  };
  const handlePlayPause = () => {
    setvpaused(!vpaused);
  };

  useImperativeHandle(ref, () => ({
    play: () => {
      setvpaused(false);
    },
    pause: () => {
      setvpaused(true);
    },

    toggleMute: () => {
      setIsMuted(prev => !prev);
    },
    // Add other controls you might need
  }));
  useFocusEffect(
    useCallback(() => {
      setvpaused(true);
      setHasEnded(false);
  
      return () => {
        if (videoRef.current) {
          setvpaused(true);
        }
      };
    }, [props])
  );
  // useEffect(() => {
  //   // console.log('VideoPlayer:',defaultPaused);
  //   setvpaused(true);
  //   setHasEnded(false);
  //   return () => {
  //     //  console.log('clear');
  //     // Cleanup actions when the component unmounts or props change
  //     // Ensure the video is paused
  //     if (videoRef.current) {
  //       setvpaused(true);
  //     }
  //   };
  // }, [props]);

  const handleProgress = data => {
    setCurrentTime(data.currentTime);
  };
  const handleEnd = () => {
    setvpaused(true);
    setCurrentTime(0);
    setHasEnded(true);
  };

  const handleLoad = data => {
    setDuration(data.duration);
  };
  const handleSeek = time => {
    videoRef.current.seek(time);
  };

  const handlerepeat = () => {
    setHasEnded(false);
    videoRef.current.seek(0);

    setvpaused(false);
  };

  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };
  return (
    <TouchableOpacity
      style={{
        flex: 1,
        width: '100%',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        // padding: 10,
      }}
      onPress={() => onPress()}>
        <View
      style={{
        flex: 1,
        width: '100%',
        borderRadius: 12, // Apply rounded corners
        overflow: 'hidden', // Ensure content (video) respects the borderRadius
      }}
    >
      <Video
        ref={videoRef}
        source={{uri: sourceUri}}
        playInBackground={false}
        style={vidStyle}
        controls={false}
        repeat={true}
        playWhenInactive={false}
        autoplay={true}
        resizeMode={'cover'}
        focusable={true}
        disableFocus={true}
        onProgress={onProgress}
        onEnd={handleEnd}
        onLoad={handleLoad}
        muted={false}
        bufferConfig={{
          minBufferMs: 5000, // Aim for at least 5 seconds of buffered content
          maxBufferMs: 20000, // Cap the buffer at 20 seconds to avoid overloading memory with unwatched content
          bufferForPlaybackMs: 1000, // Require at least 1 second of content to start playback
          bufferForPlaybackAfterRebufferMs: 3000, // After a rebuffer, require 3 seconds of content to resume playback
        }}
      />
</View>
      {/* {vpaused && (
        <TouchableOpacity
          style={styles.playButtonContainer}
          onPress={() => setIsFullscreen(true)}>
          <PlayIcon />
        </TouchableOpacity>
      )} */}

   

    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  fullscreenContainer: {
    flex: 1,
    backgroundColor: 'black', // Change as needed
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS == 'ios' ? 100 : 20,
    right: Platform.OS == 'ios' ? 15 : 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
    zIndex: 10, // Ensure the button is above other elements
  },
  closeButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  playButtonContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controls: {
    flexDirection: 'row',
    // justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    //  paddingLeft:45,
    height: 5,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  progressBar: {
    width: '100%',
    height: '100%',
    backgroundColor: 'gray',
    // marginLeft: 10,
    // marginRight: 10,
  },
});

export default AdsVideoPlayer;
