/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useRef, useState} from 'react';
import './global.css';
import Geolocation from 'react-native-geolocation-service';

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
type SectionProps = PropsWithChildren<{
  title: string;
}>;
let defaultTheme: 'dark' | 'light' = 'light';
type ThemeContextType = {
  colorMode?: 'dark' | 'light';
  toggleColorMode?: () => void;
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

  const toggleColorMode = async () => {
    setColorMode(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const [locationPermission, setLocationPermission] = useState('unknown');

  // Define the function to check permission status
  // const checkLocationPermissionStatus = async () => {
  //   const status = await PermissionService.checkPermissionStatus(
  //     Platform.select({
  //       android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  //       ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  //     }),
  //     'Location'
  //   );

  //   setLocationPermission(status);
  //   if (status === 'denied') {
  //     // Handle permission blocked and loop until granted
  //     const newStatus = await PermissionService.showBlockedPermissionAlert('Location');
  //     setLocationPermission(newStatus); // Update status after returning from settings
  //   }
  //   if (status === 'blocked') {
  //     // Handle permission blocked and loop until granted
  //     const newStatus = await PermissionService.showBlockedPermissionAlert('Location');
  //     setLocationPermission(newStatus); // Update status after returning from settings
  //   }
  // };
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

  //   // setTimeout(() => {
  //   //   setIsSplashVisible(false);
  //   // }, 3000);
  // }, []);

  const retryAction = async () => {
    // Implement your retry logic here
    // For example, you can attempt to fetch data from an API
    // or perform any action that requires an internet connection
    // If successful, update the UI accordingly
    // If not, you can display an error message or handle it as needed
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

      await store.dispatch(
        setTokens({
          accessToken: storeTokensresult?.accessToken!,
          refreshToken: storeTokensresult?.refreshToken!,
          getStreamAccessToken: storeTokensresult?.getStreamAccessToken!,
        }),
      );
      await store.dispatch(setUser(user));
      setLoggedIn(true);
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

        store.dispatch(setAppLocation(resultAddress));
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
  // const checkPermission = async () => {
  //   if (Platform.OS === 'android') {
  //     try {
  //       const granted = await PermissionsAndroid.requestMultiple([
  //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //         PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  //       ]);
  //       return granted;
  //     } catch (err) {
  //       console.warn(err);
  //     }
  //   } else if (Platform.OS === 'ios') {
  //     try {
  //       const locationPermission = await request(
  //         PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  //       );
  //       return locationPermission;
  //     } catch (err) {
  //       console.warn(err);
  //     }
  //   }
  // };
  // const checkPermission = async () => {
  //   if (Platform.OS === 'android') {
  //     try {
  //       const permissions = [
  //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //         PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  //       ];

  //       const granted = await PermissionsAndroid.check(permissions[0]) && await PermissionsAndroid.check(permissions[1]);
  //       console.log("===============granted")
  //       console.log(granted)
  //       if (!granted) {
  //         const result = await PermissionsAndroid.requestMultiple(permissions);
  //         return result;
  //       }
  //       return granted;
  //     } catch (err) {
  //       console.warn(err);
  //     }
  //   } else if (Platform.OS === 'ios') {
  //     try {
  //       const locationPermissionStatus = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

  //       if (locationPermissionStatus !== RESULTS.GRANTED) {
  //         const locationPermission = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
  //         return locationPermission;
  //       }
  //       return RESULTS.GRANTED;
  //     } catch (err) {
  //       console.warn(err);
  //     }
  //   }
  // };

  const checkPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const permissions = [
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
        ];

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
    //    const alertShown = useRef(false); // Use a ref to track alert display status

    return new Promise(resolve => {
      if (!alertShown.current) {
        alertShown.current = true; // Set the alert shown flag

        Alert.alert(
          `LOCATION Permission Blocked`,
          `It looks like you have blocked the ${permissionName} permission. To enable it, go to your app settings.`,
          [
            // {
            //   text: 'Cancel',
            //   style: 'cancel',
            //   onPress: () => {
            //     alertShown.current = false; // Reset the flag when alert is dismissed
            //     resolve('cancel');
            //   },
            // },
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
          ],
          {cancelable: false},
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
        await allPermission();
        await checkUser();
        setIsSplashVisible(false);
      } catch (error) {
        console.error('Error in permission or user check:', error);
      }
    };

    // Run animations in parallel
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();

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
  return (
    <>
   
        {isSplashVisible ? (
          <View style={styles.splashContainer}>
            <Animated.Image
              source={require('./src/assets/images/BA.png')}
              style={[
                styles.logo,
                {
                  opacity: opacityAnim,
                  transform: [{scale: scaleAnim}],
                },
              ]}
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
                </BottomSheetModalProvider>
              </GestureHandlerRootView>
            </S3Provider>
          </Provider>
        )
}
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
    width: 200, // Adjust size according to your needs
    height: 200,
  },
});

export default App;
