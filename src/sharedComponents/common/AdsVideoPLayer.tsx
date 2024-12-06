import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
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

import PlayIcon from '../../assets/svg/icons/iconsplay.svg';
import {Progress} from '../../../components/ui/progress';

const AdsVideoPlayer = forwardRef((props, ref) => {
  const {sourceUri, vidStyle} = props;
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [vpaused, setvpaused] = useState(false); // Start playing
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);
  const [hasEnded, setHasEnded] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Start muted

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
  }));

  useEffect(() => {
    setvpaused(false);
    setHasEnded(false);
    return () => {
      if (videoRef.current) {
        setvpaused(true);
      }
    };
  }, [props]);

  const handleEnd = () => {
    setvpaused(true);
    setCurrentTime(0);
    setHasEnded(true);
  };

  const handleLoad = data => {
    setDuration(data.duration);
  };

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{uri: sourceUri}}
        playInBackground={false}
        style={vidStyle}
        controls={false}
        repeat={false}
        paused={vpaused}
        playWhenInactive={true}
        resizeMode={'cover'}
        onProgress={onProgress}
        onEnd={handleEnd}
        onLoad={handleLoad}
        muted={isMuted}
      />

      <TouchableOpacity
        style={styles.muteButton}
        onPress={() => setIsMuted(!isMuted)}>
        <Text style={styles.muteButtonText}>{isMuted ? '🔇' : '🔊'}</Text>
      </TouchableOpacity>

      {vpaused && (
        <TouchableOpacity
          style={styles.playButtonContainer}
          onPress={() => setIsFullscreen(true)}>
          <PlayIcon />
        </TouchableOpacity>
      )}

      <Modal
        animationType="slide"
        transparent={false}
        visible={isFullscreen}
        onRequestClose={() => setIsFullscreen(false)}>
        <View style={styles.fullscreenContainer}>
          <Video
            source={{uri: sourceUri}}
            style={vidStyle}
            controls={true}
            repeat={false}
            paused={false}
            resizeMode={'contain'}
            muted={false}
          />

          <TouchableOpacity
            onPress={() => setIsFullscreen(false)}
            style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <View style={styles.controls}>
        <View style={styles.progressBar}>
          <Progress
            value={progress * 100}
            colorScheme="primary"
            h="100%"
            bg="white"
            w="100%"
          />
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  muteButton: {
    position: 'absolute',
    left: 16,
    bottom: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    borderRadius: 20,
    zIndex: 999,
  },
  muteButtonText: {
    color: 'white',
    fontSize: 20,
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 100 : 20,
    right: Platform.OS === 'ios' ? 15 : 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
    zIndex: 10,
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
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 5,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  progressBar: {
    width: '100%',
    height: '100%',
    backgroundColor: 'gray',
  },
});

export default AdsVideoPlayer;
