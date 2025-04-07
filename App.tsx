/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useRef, useState} from 'react';
import './global.css';
import Geolocation from 'react-native-geolocation-service';
import crashlytics from '@react-native-firebase/crashlytics';
import notifee, {AuthorizationStatus} from '@notifee/react-native';
//import "./global.css";
import type {PropsWithChildren} from 'react';
import {
  Alert,
  Animated,
  AppState,
  Button,
  Easing,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Provider} from 'react-redux';
import store from './BrokerAppCore/redux/store';
import MainNavigation from './src/navigation/MainNavigation';
import {GluestackUIProvider} from '@/components/ui/gluestack-ui-provider';
import PermissionService from './src/utils/PermissionService';
import {
  check,
  openSettings,
  PERMISSIONS,
  request,
  RESULTS,
} from 'react-native-permissions';
import {
  getAddressFromCoordinates,
  getAddressFromCoordinatesNew,
} from './BrokerAppCore/services/googleService';
import {setCity} from './BrokerAppCore/redux/store/City/citySlice';
import {setUser} from './BrokerAppCore/redux/store/user/userSlice';
import {setTokens} from './BrokerAppCore/redux/store/authentication/authenticationSlice';
import {getTokens} from './src/utils/utilTokens';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {setAppLocation} from './BrokerAppCore/redux/store/AppLocation/appLocation';
import {S3Provider} from './src/Context/S3Context';
import NetInfo from '@react-native-community/netinfo';
import OfflineAlert from './src/hoc/OfflineAlert';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import useSessionTracker from './src/hooks/Analytics/useSessionTracker';
import useUserAnalytics from './src/hooks/Analytics/useUserAnalytics';
import analytics from '@react-native-firebase/analytics';
import ManuallyselectedLocation from './src/sharedComponents/ManuallyselectedLocation';

type SectionProps = PropsWithChildren<{
  title: string;
}>;
let defaultTheme: 'dark' | 'light' = 'light';
type ThemeContextType = {
  colorMode?: 'dark' | 'light';
  toggleColorMode?: () => void;
};
const defaultAdress = {
  City: 'Noida',
  Country: 'India',
  State: 'Uttar Pradesh',
  geoLocationLatitude: 28.5355161,
  geoLocationLongitude: 77.3910265,
  placeID: 'ChIJezVzMaTlDDkRP8B8yDDO_zc',
  placeName: 'Noida, Uttar Pradesh, India',
  viewportNorthEastLat: 28.63587813404002,
  viewportNorthEastLng: 77.50655660125601,
  viewportSouthWestLat: 28.40852545946161,
  viewportSouthWestLng: 77.2970943490685,
};
export const ThemeContext = React.createContext<ThemeContextType>({
  colorMode: 'light',
  toggleColorMode: () => {},
});
function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  //useSessionTracker();

  //  NativeModules.DevSettings.setIsDebuggingRemotely(true);
  const [isConnected, setIsConnected] = useState<null | boolean>(null);
  const isDarkMode = useColorScheme() === 'dark';
  const [loggedIn, setLoggedIn] = useState(false);
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [appState, setAppState] = useState(AppState.currentState);
  // Create animated values
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const alertShown = useRef(false);
  const [colorMode, setColorMode] = React.useState<'dark' | 'light'>(
    defaultTheme,
  );
  const bottomSheetRef = useRef(null);

  const openBottomSheet = () => {
    bottomSheetRef.current?.open();
  };

  const toggleColorMode = async () => {
    setColorMode(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const [locationPermission, setLocationPermission] = useState('unknown');

  const retryAction = async () => {
    const state = await NetInfo.fetch();

    setColorMode(state.isConnected);
  };
  const checkUser = async () => {
    const keys = await AsyncStorage.getAllKeys();
    const AsyncStoragedata = await AsyncStorage.multiGet(keys);

    const storedUser = await AsyncStorage.getItem('User');
    const storeTokensresult = await getTokens();

    if (storedUser) {
      const user = JSON.parse(storedUser);

      //   await analytics().setUserId( String(user.userId) );
      await store.dispatch(
        setTokens({
          accessToken: storeTokensresult?.accessToken!,
          refreshToken: storeTokensresult?.refreshToken!,
          getStreamAccessToken: storeTokensresult?.getStreamAccessToken!,
        }),
      );
      await store.dispatch(setUser(user));
      setLoggedIn(true);

      setTimeout(() => {
        // setLoggedIn(true);
        setIsSplashVisible(false);
      }, 1000);
    } else {
      setIsSplashVisible(false);
    }
    // setIsSplashVisible(false);
  };
  const requestNotificationPermission = async () => {
    if (Platform.OS === 'ios') {
      try {
        // const result = await notifee.requestPermission();
        const settings = await notifee.requestPermission();

        if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
          // console.log('Permission settings:', settings);
        } else {
          Alert.alert(
            'Permission Blocked',
            'Notification permissions are blocked. Please enable them in settings.',
            [
              {text: 'Cancel', style: 'cancel'},
              {text: 'Open Settings', onPress: openSettings},
            ],
          );
   
        }
      } catch (error) {
        console.error('Error requesting notification permissions:', error);
      }
    } else {
  
    }
  };
  const getCurrentPositionAsync = () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => resolve(position),
        error => reject(error),
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    });
  };
  const getUserLocation = async (granted: any) => {
    if (Platform.OS === 'android') {
      if (
        granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
        PermissionsAndroid.RESULTS.GRANTED
      ) {
        let relustGeolocation: any = await getCurrentPositionAsync();

        const {latitude, longitude} = relustGeolocation.coords;

        let resultAddress = await getAddressFromCoordinatesNew(
          latitude,
          longitude,
        );

        store.dispatch(
          setAppLocation(resultAddress !== null ? resultAddress : 'Noida'),
        );
      }
    }
    if (Platform.OS === 'ios') {
      let relustGeolocation = await getCurrentPositionAsync();

      const {latitude, longitude} = relustGeolocation.coords;

      let resultAddress = await getAddressFromCoordinatesNew(
        latitude,
        longitude,
      );
   
      store.dispatch(setAppLocation(resultAddress));
    }
  };
  const handleAppStateChange = async nextAppState => {
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      // Check permission status when the app comes back to the foreground

      if (alertShown.current == false) {
        let granted = await checkPermission();

        //  let UserLocation = await getUserLocation(granted);
      }
    }
    setAppState(nextAppState);
  };

  const checkPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const permissions = [
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ];

        if (Platform.Version >= 33) {
          permissions.push(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
        }

        const permissionStatusesArray = await Promise.all(
          permissions.map(permission => PermissionsAndroid.check(permission)),
        );

        // Creating an object with permission names as keys and their statuses as values
        const permissionStatuses = Object.fromEntries(
          permissions.map((permission, index) => [
            permission,
            permissionStatusesArray[index] ? 'granted' : 'denied',
          ]),
        );

        // Filter permissions that need to be requested
        const permissionsToRequest = permissions.filter(
          (_, index) => !permissionStatusesArray[index],
        );

        if (permissionsToRequest.length > 0) {
          const requestResults = await PermissionsAndroid.requestMultiple(
            permissionsToRequest,
          );

          // Update permissionStatuses with results of requested permissions
          Object.entries(requestResults).forEach(([key, value]) => {
            permissionStatuses[key] = value;

            // Show alert if permission is permanently denied
            if (value === 'never_ask_again') {
              showBlockedPermissionAlert(key);
            }
          });

          return permissionStatuses;
        }

        return permissionStatuses;
      } catch (err) {
        console.warn(err);
      }
    } else if (Platform.OS === 'ios') {
      try {
        const locationPermissionStatus = await check(
          PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        );

        const permissionStatuses = {
          'ios.location_permission': locationPermissionStatus,
        };

        if (locationPermissionStatus === RESULTS.BLOCKED) {
          await showBlockedPermissionAlert('Location');
          // store.dispatch(setAppLocation(defaultAdress));
        } else if (locationPermissionStatus !== RESULTS.GRANTED) {
          const locationPermission = await request(
            PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
          );
          permissionStatuses['ios.location_permission'] = locationPermission;
        }

        return permissionStatuses;
      } catch (err) {
        console.warn(err);
      }
    }
  };
  const showBlockedPermissionAlert = permissionName => {
    return new Promise(resolve => {
      if (!alertShown.current) {
        alertShown.current = true; // Set the alert shown flag

        Alert.alert(
          `LOCATION Permission Blocked`,
          `It looks like you have blocked the ${permissionName} permission. To enable it, go to your app settings.`,
          [
            {
              text: 'Open Settings',
              onPress: async () => {
                try {
                  alertShown.current = false;
                  await openSettings();
                  resolve('settings');
                } catch (error) {
                  console.warn('Cannot open settings', error);
                  resolve('error');
                } finally {
                  alertShown.current = false; // Reset the flag after opening settings
                }
              },
            },
            {
              text: 'Select Manually',
              onPress: () => {
                openBottomSheet(); // Open the bottom sheet
                resolve('manual_selection');
              },
            },
          ],
        );
      } else {
        resolve('already_shown'); // Return a different response if the alert was already shown
      }
    });
  };

  // const showBlockedPermissionAlert = async (permissionName) => {
  //   return new Promise((resolve) => {
  //     Alert.alert(
  //       `${permissionName} Permission Blocked`,
  //       `It looks like you have blocked the ${permissionName} permission. To enable it, go to your app settings.`,
  //       [
  //         {
  //           text: 'Cancel',
  //           style: 'cancel',
  //           onPress: () => resolve('cancel'),
  //         },
  //         {
  //           text: 'Open Settings',
  //           onPress: () => {
  //             openSettings().catch(() => console.warn('Cannot open settings'));
  //             resolve('settings');
  //           },
  //         },
  //       ],
  //       { cancelable: true }
  //     );
  //   });
  // };
  const allPermission = async () => {
    let granted = await checkPermission();
    requestNotificationPermission();
    let UserLocation = await getUserLocation(granted);
  };
  // useEffect(() => {
  //   Animated.parallel([
  //     Animated.timing(opacityAnim, {
  //       toValue: 1,
  //       duration: 1000,
  //       easing: Easing.out(Easing.quad),
  //       useNativeDriver: true,
  //     }),
  //     Animated.spring(scaleAnim, {
  //       toValue: 1,
  //       friction: 3,
  //       useNativeDriver: true,
  //     }),
  //   ]).start();
  //   await allPermission();
  //  await checkUser();

  //   const unsubscribe = NetInfo.addEventListener(state => {
  //     setIsConnected(state.isConnected);
  //   });
  //   setIsSplashVisible(false);

  // }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, [appState]);

  useEffect(() => {
    const runAsyncFunctions = async () => {
      try {
        crashlytics().setCrashlyticsCollectionEnabled(true);

        //  console.log("checkUser0");
        crashlytics().log('Testing Crashlytics in debug mode');
        //  crashlytics().crash();
        allPermission();
        await checkUser();
        // console.log("checkUser");
      } catch (error) {
        console.error('Error in permission or user check:', error);
      }
    };
    // runAsyncFunctions();
    // Run animations in parallel
    // Animated.parallel([
    //   Animated.timing(opacityAnim, {
    //     toValue: 1,
    //     duration: 100,
    //     easing: Easing.out(Easing.quad),
    //     useNativeDriver: true,
    //   }),
    //   Animated.spring(scaleAnim, {
    //     toValue: 1,
    //     friction: 3,
    //     useNativeDriver: true,
    //   }),
    // ]).start();
    // Animated.spring(opacityAnim, {
    //   toValue: 1, // Final value
    //   friction: 3, // Resistance to motion
    //   tension: 40, // How stiff the spring is
    //   useNativeDriver: true, // Offloads animation to the native thread
    // }).start();
    // Execute async functions
    runAsyncFunctions();

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    // Subscribe to network state changes
    // const unsubscribe = NetInfo.addEventListener(state => {
    //   // setIsConnected(state.isConnected && state.isInternetReachable);
    //   setIsConnected(state.isInternetReachable === true);
    // });
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isInternetReachable !== null) {
        setIsConnected(state.isInternetReachable);
      }
    });
    // Set splash visibility
    // setIsSplashVisible(false);

    // Cleanup on unmount
    return () => {
      subscription.remove();
      unsubscribe();
    };
  }, []);
  const handlePlaceSelected = (place: any) => {

    store.dispatch(setAppLocation(place));
  };
  return (
    <>
      {isSplashVisible ? (
        <View style={styles.splashContainer}>
          {/* <Animated.Image
            source={require('./src/assets/images/BANew.png')}
            style={[
              styles.logo,
              {
                opacity: opacityAnim,
                transform: [{scale: scaleAnim}],
              },
            ]}
            resizeMode="contain"
          /> */}
          <Image
            source={require('./src/assets/images/BANew.png')}
            style={[styles.logo]}
            resizeMode="contain"
          />
        </View>
      ) : (
        <Provider store={store}>
          <S3Provider>
            <GestureHandlerRootView style={{flex: 1}}>
              <BottomSheetModalProvider>
                <OfflineAlert></OfflineAlert>

                <GluestackUIProvider>
                  <MainNavigation
                    loggedIn={loggedIn}
                    setLoggedIn={setLoggedIn}
                  />
                </GluestackUIProvider>
                <ManuallyselectedLocation
                  ref={bottomSheetRef}
                  onPlaceSelected={handlePlaceSelected}
                  SetCityFilter={''}
                />
              </BottomSheetModalProvider>
            </GestureHandlerRootView>
          </S3Provider>
        </Provider>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Customize splash background color
  },
  logo: {
    width: 250, // Adjust size according to your needs
    height: 250,
  },
});

export default App;
