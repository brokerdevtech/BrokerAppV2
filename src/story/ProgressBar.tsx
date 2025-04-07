import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

interface ProgressBarProps {
  duration: number;
  isActive: boolean;
  isPaused: boolean;
  hasCompleted: boolean; // Marks progress as completed externally
  onComplete: () => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ duration, isActive, isPaused, hasCompleted, onComplete }) => {
  const progress = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);
  const pauseTime = useRef(0); // Stores progress at pause
  const remainingTime = useRef(duration); // Remaining time after pause

  useEffect(() => {
    if (hasCompleted) {
      // If marked as completed externally, fill the progress bar instantly
      progress.setValue(1);
      return;
    }

    if (isActive) {
      if (!isPaused) {
        progress.setValue(pauseTime.current); // Resume from where paused
        animationRef.current = Animated.timing(progress, {
          toValue: 1,
          duration: remainingTime.current, // Resume with remaining duration
          useNativeDriver: false,
        });

        animationRef.current.start(({ finished }) => {
          if (finished && !isPaused) {
            onComplete();
          }
        });
      } else {
        // Pause animation and store progress
        progress.stopAnimation((value) => {
          pauseTime.current = value;
          remainingTime.current = (1 - value) * duration;
        });
        animationRef.current?.stop();
      }
    } else {
      progress.setValue(0); // Reset when switching stories
      remainingTime.current = duration;
      pauseTime.current = 0;
    }

    return () => {
      animationRef.current?.stop();
    };
  }, [isActive, isPaused, hasCompleted]);

  return (
    <View style={styles.progressBar}>
      <Animated.View
        style={[
          styles.filledProgress,
          {
            width: progress.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#555',
    marginHorizontal: 2,
    borderRadius: 3,
  },
  filledProgress: {
    height: '100%',
    backgroundColor: '#fff',
    position: 'absolute',
    left: 0,
    borderRadius: 3,
  },
});

export default ProgressBar;
