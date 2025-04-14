import remoteConfig from '@react-native-firebase/remote-config';
import DeviceInfo from 'react-native-device-info';
import { Alert, Linking, Platform } from 'react-native';

export const checkAppUpdate = async () => {
  // Optional: Defaults in case fetch fails
  await remoteConfig().setDefaults({
    latest_version_android: '1.0.0',
    latest_version_ios: '1.0.0',
    force_update: false,
    update_message: 'Update available!',
  });
//   await remoteConfig().setConfigSettings({
//     minimumFetchIntervalMillis: 0, // <-- Forces fresh fetch for debugging
//   });
  await remoteConfig().fetchAndActivate();

  const currentVersion = DeviceInfo.getVersion(); // e.g. "1.0.0"
  const latestVersion = remoteConfig().getValue(
    Platform.OS === 'ios' ? 'latest_version_ios' : 'latest_version_android'
  ).asString().trim();
console.log("latestVersion",latestVersion);
console.log("currentVersion",currentVersion);
console.log(compareVersions(currentVersion, latestVersion));
  const forceUpdate = remoteConfig().getValue('force_update').asBoolean();
  const updateMessage = remoteConfig().getValue('update_message').asString();

  if (compareVersions(currentVersion, latestVersion) < 0) {
    Alert.alert(
      'Update Available',
      updateMessage,
      [
        {
          text: 'Update Now',
          onPress: () => {
            const storeURL = Platform.OS === 'ios'
              ? 'itms-apps://itunes.apple.com/app/id6480364900'
              : 'https://play.google.com/store/apps/details?id=com.brokerapp.broker&pli=1';
            Linking.openURL(storeURL);
          },
        },
      ],
      { cancelable: !forceUpdate }
    );
  }
};

// Compare versions like "1.0.0" vs "1.2.0"
const compareVersions = (v1: string, v2: string): number => {
    const a = v1.split('.').map(num => parseInt(num, 10));
    const b = v2.split('.').map(num => parseInt(num, 10));
    const length = Math.max(a.length, b.length);
  
    for (let i = 0; i < length; i++) {
      const aVal = a[i] || 0;
      const bVal = b[i] || 0;
  
      if (aVal < bVal) return -1;
      if (aVal > bVal) return 1;
    }
  
    return 0;
  };
  
