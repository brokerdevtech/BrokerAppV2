import { useFocusEffect } from '@react-navigation/native';
import { useRef } from 'react';
import analytics from '@react-native-firebase/analytics';
import React from 'react';

const useUserJourneyTracker = (screenName) => {
  const screenStartTimeRef = useRef(null);

  // Track screen views and time spent
  useFocusEffect(
    React.useCallback(() => {
      // Log screen view
      analytics().logScreenView({
        screen_name: screenName,
        screen_class: screenName,
      });

      // Start time tracking
      screenStartTimeRef.current = Date.now();

      return () => {
        // Log time spent on the screen
        const timeSpent = (Date.now() - screenStartTimeRef.current) / 1000; // in seconds
        analytics().logEvent('time_on_screen', {
          screen_name: screenName,
          time_spent: timeSpent,
        });
      };
    }, [screenName])
  );

  // Helper to log button clicks or other interactions
  const logButtonClick = async (buttonName) => {
    await analytics().logEvent('button_click', { button_name: buttonName });
  };

  return { logButtonClick };
};

export default useUserJourneyTracker;
