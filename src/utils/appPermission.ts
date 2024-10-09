import {Alert, PermissionsAndroid} from 'react-native';
import {openSettings} from 'react-native-permissions';

export async function requestStoragePermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
      {
        title: 'App Storage Permission',
        message: 'App needs access to your storage',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else {
      showRationaleAndRequest(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES);
      return false;
    }
  } catch (err) {
    console.warn(err);
  }
}

export const showRationaleAndRequest = async permission => {
  Alert.alert('Permission', `This app needs ${permission} access`, [
    {
      text: 'Cancel',
      style: 'cancel',
    },
    {
      text: 'OK',
      onPress: () => requestPermission(permission),
    },
  ]);
};
const requestPermission = async permission => {
  openSettings().catch(() => console.warn('cannot open settings'));
};
export async function performStorageOperation() {
  const hasPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
  );
  if (hasPermission) {
    return true;
  } else {
    return await requestStoragePermission();
    // Optionally, check again and proceed
  }
}
