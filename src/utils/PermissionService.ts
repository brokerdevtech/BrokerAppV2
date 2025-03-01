import store from '../../BrokerAppCore/redux/store/index';
import { setAppPermissionStatus } from '../../BrokerAppCore/redux/store/AppPermissions/permissionsSlice';
import { Platform, Alert, AppState } from 'react-native';
import {
  request,
  PERMISSIONS,
  RESULTS,
  check,
  openSettings,
} from 'react-native-permissions';

class PermissionService {
  static async requestLocationPermission() {
    try {
      const result = await request(
        Platform.select({
          android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        })
      );
      store.dispatch(setAppPermissionStatus({ permission: 'location', status: result }));
      return this.handlePermissionResult(result, 'Location');
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  }

  static async checkPermissionStatus(permissionType, permissionName) {
    try {
      const status = await check(permissionType);
      return this.handlePermissionResult(status, permissionName);
    } catch (error) {
      console.error(`Error checking ${permissionName} permission status:`, error);
    }
  }

  static async handlePermissionResult(result, permissionName) {
    switch (result) {
      case RESULTS.GRANTED:
        return 'granted';
      case RESULTS.DENIED:
        return 'denied';
      case RESULTS.BLOCKED:
        return await this.showBlockedPermissionAlert(permissionName);
      case RESULTS.UNAVAILABLE:
        return 'unavailable';
      default:
        return 'unknown';
    }
  }

  static async showBlockedPermissionAlert(permissionName) {
    let permissionGranted = false;

    // Show alert until permission is granted or canceled
    while (!permissionGranted) {
      const action = await new Promise((resolve) => {
        Alert.alert(
          `${permissionName} Permission Blocked`,
          `It looks like you have blocked the ${permissionName} permission. To enable it, go to your app settings.`,
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => resolve('cancel'),
            },
            {
              text: 'Open Settings',
              onPress: () => {
                openSettings().catch(() => console.warn('Cannot open settings'));
                this.waitForAppForeground().then((updatedPermissionStatus) => {
                  resolve(updatedPermissionStatus);
                });
              },
            },
          ],
          { cancelable: true }
        );
      });

      // Exit the loop if the user cancels
      if (action === 'cancel') {
        break;
      }

      // After returning from settings or cancel, check the permission status again
      if (action === RESULTS.GRANTED) {
        permissionGranted = true;
        return 'granted'; // Exit the loop when permission is granted
      }
    }
  }
const checkPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      ];
      
      const permissionStatuses = await Promise.all(
        permissions.map((permission) => PermissionsAndroid.check(permission))
      );

      const permissionsToRequest = permissions.filter(
        (_, index) => !permissionStatuses[index]
      );

      if (permissionsToRequest.length > 0) {
        const result = await PermissionsAndroid.requestMultiple(permissionsToRequest);
        
        // Check if any permission is permanently denied (blocked)
        for (const [key, value] of Object.entries(result)) {
          if (value === 'never_ask_again') {
            await showBlockedPermissionAlert(key);
          }
        }
        return result;
      }
      
      return permissionStatuses;
    } catch (err) {
      console.warn(err);
    }
  } else if (Platform.OS === 'ios') {
    try {
      const locationPermissionStatus = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

      if (locationPermissionStatus === RESULTS.BLOCKED) {
        await showBlockedPermissionAlert('Location');
      } else if (locationPermissionStatus !== RESULTS.GRANTED) {
        const locationPermission = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        return locationPermission;
      }
      
      return RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
    }
  }
};
  static waitForAppForeground() {
    return new Promise((resolve) => {
      const subscription = AppState.addEventListener('change', async (nextAppState) => {
        if (nextAppState === 'active') {
          subscription.remove(); // Clean up the event listener

          // When the app becomes active again, check the permission status
          const status = await check(
            Platform.select({
              android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
              ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
            })
          );
          resolve(status); // Return the updated permission status
        }
      });
    });
  }
}

export default PermissionService;
