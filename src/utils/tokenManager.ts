import AsyncStorage from '@react-native-async-storage/async-storage';

const tokenManager = (() => {
  let tokens: {
    accessToken: string | null;
    refreshToken: string | null;
    getStreamAccessToken: string | null;
  } = {
    accessToken: null,
    refreshToken: null,
    getStreamAccessToken: null,
  };

  let isLoaded = false;

  const loadTokens = async () => {
    if (isLoaded) {
      // Return cached tokens if already loaded
      return tokens;
    }

    try {
   let k=     await    AsyncStorage.getAllKeys();
   console.log(k);
        const [accessToken, refreshToken, getStreamAccessToken] = await Promise.all([
            AsyncStorage.getItem('access_token'),
            AsyncStorage.getItem('refresh_token'),
            AsyncStorage.getItem('getStreamAccessToken'),
          ]);
          console.log('getStreamAccessToken');
          console.log(accessToken);
      tokens = {
        accessToken,
        refreshToken,
        getStreamAccessToken,
      };

      isLoaded = true; // Mark tokens as loaded
      console.log('getStreamAccessToken');
      console.log(tokens);
      return tokens;
    } catch (error) {
      console.error('Failed to fetch tokens:', error);
      return { accessToken: null, refreshToken: null, getStreamAccessToken: null };
    }
  };

  const clearTokenCache = () => {
    tokens = {
      accessToken: null,
      refreshToken: null,
      getStreamAccessToken: null,
    };
    isLoaded = false;
  };

  return {
    getTokens: loadTokens,
    clearTokenCache,
  };
})();

export const getTokens = tokenManager.getTokens;
export const clearTokenCache = tokenManager.clearTokenCache;
