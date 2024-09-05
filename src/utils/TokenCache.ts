// TokenCache.js
const tokenCache = {
    accessToken: null,
    refreshToken: null,
    getStreamAccessToken: null,
    lastUpdated: null,
    isValid() {
      // Assuming tokens are refreshed every hour, for example
      const ONE_HOUR = 1000 * 60 * 60; 
      const now = new Date();
      return this.lastUpdated && (now - this.lastUpdated) < ONE_HOUR;
    },
    update(tokens) {
      const { accessToken, refreshToken, getStreamAccessToken } = tokens;
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      this.getStreamAccessToken = getStreamAccessToken;
      this.lastUpdated = new Date();
    }
  };
  export default tokenCache;