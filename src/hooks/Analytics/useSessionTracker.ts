import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import analytics from '@react-native-firebase/analytics';

const useSessionTracker = () => {
  const appState = useRef(AppState.currentState);
  const sessionStartTime = useRef(Date.now());

  useEffect(() => {
    const handleAppStateChange = async (nextAppState) => {
      if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
        // App is moving to the background
        const sessionDuration = (Date.now() - sessionStartTime.current) / 1000; // in seconds
        await analytics().logEvent('session_end', {
          timestamp: Date.now(),
          session_duration: sessionDuration,
        });
      } else if (nextAppState === 'active') {
        // App is resuming to the foreground
        sessionStartTime.current = Date.now();
        await analytics().logEvent('session_start', {
          timestamp: Date.now(),
        });
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Initial session start
    analytics().logEvent('session_start', { timestamp: Date.now() });

    return () => subscription.remove();
  }, []);
};

export default useSessionTracker;
