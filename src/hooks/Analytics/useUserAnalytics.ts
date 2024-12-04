import { useCallback } from 'react';
import analytics from '@react-native-firebase/analytics';

const useUserAnalytics = () => {
  // Add or update user properties
  const setUser_Analytics = useCallback(async (user) => {

    if (user?.id) {
       
     await analytics().setUserId(user.id); // Set user ID
      await analytics().setUserProperties({
        firstName: user.firstName || 'unknown', // Optional property
        lastName: user.lastName || 'anonymous', // Optional property
      });
    } else {
      console.log('No user ID provided to setUser');
    }
  }, []);

  // Clear user properties (e.g., on logout)
  const clearUser = useCallback(async () => {
    await analytics().setUserId(null); // Clear user ID
    await analytics().setUserProperties({}); // Clear user properties
  }, []);

  return { setUser_Analytics, clearUser };
};

export default useUserAnalytics;
