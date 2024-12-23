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
  const {sourceUri, vidStyle, isVisible, onPress,onEnd} = props;
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const [videoDuration, setVideoDuration] = useState(0);
  
  useEffect(() => {
    if (isVisible) {
      setIsPlaying(true); // Play video when visible
      videoRef.current?.seek(0); // Restart video
    } else {
      setIsPlaying(false); // Pause video when banner is out of view
    }
  }, [isVisible]);

  const toggleMute = () => {
    setIsMuted(prev => !prev); // Toggle the mute state
  };

  useImperativeHandle(ref, () => ({
    play: () => setIsPlaying(true),
    pause: () => setIsPlaying(false),
  }));

  return (
    <TouchableOpacity
      style={{
        flex: 1,
        width: '100%',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onPress={onPress}>
      <View
        style={{
          flex: 1,
          width: '100%',
          borderRadius: 12, // Apply rounded corners
          overflow: 'hidden', // Ensure content (video) respects the borderRadius
        }}>
        <Video
          ref={videoRef}
          source={{uri: sourceUri}}
          style={vidStyle}
          paused={!isPlaying} // Play or pause based on visibility
          muted={isMuted} // Mute/unmute based on state
          resizeMode="cover"
          onEnd={() => {
            setIsPlaying(false);
            onEnd(); // Notify parent to move to the next card
          }}// Stop playback on video end
          onLoad={data => console.log('Video Loaded:', data)}
          onProgress={data => console.log('Progress:', data.currentTime)}
          bufferConfig={{
            minBufferMs: 5000, // Aim for at least 5 seconds of buffered content
            maxBufferMs: 20000, // Cap the buffer at 20 seconds
            bufferForPlaybackMs: 1000, // Require at least 1 second to start playback
            bufferForPlaybackAfterRebufferMs: 3000, // Require 3 seconds to resume after rebuffer
          }}
        />
      </View>

      {/* Mute/Unmute Button */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 10,
          right: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          padding: 5,
          borderRadius: 20,
        }}
        onPress={toggleMute}>
        <Text style={{color: 'white'}}>{isMuted ? 'Unmuted 🔇' : 'Muted 🔊'}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
});

export default AdsVideoPlayer;

