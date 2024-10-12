/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import './global.css';
import Geolocation from 'react-native-geolocation-service';
import {StreamChat} from 'stream-chat';
//import "./global.css";
import type {PropsWithChildren} from 'react';
import {
  Button,
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
import {PERMISSIONS, request} from 'react-native-permissions';
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
import NetInfo from "@react-native-community/netinfo";
import RNRestart from 'react-native-restart';
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
  const [isConnected, setIsConnected] = useState(true);
  const isDarkMode = useColorScheme() === 'dark';
  const [loggedIn, setLoggedIn] = useState(false);
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
  const checkPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        ]);
        return granted;
      } catch (err) {
        console.warn(err);
      }
    } else if (Platform.OS === 'ios') {
      try {
        const locationPermission = await request(
          PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        );
        return locationPermission;
      } catch (err) {
        console.warn(err);
      }
    }
  };
  const allPermission = async () => {
    let granted = await checkPermission();
    let UserLocation = await getUserLocation(granted);
  };
  useEffect(() => {
    allPermission();
    checkUser();

    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });


  }, []);

  return (
    <>
    {isConnected ? (
    <Provider store={store}>
      <S3Provider>
        <GestureHandlerRootView style={{flex: 1}}>
          <GluestackUIProvider mode={colorMode}>
            <MainNavigation loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
          </GluestackUIProvider>
        </GestureHandlerRootView>
      </S3Provider>
    </Provider>): (
      <View style={styles.container}>
        <Text style={styles.text}>
          You are not connected to the internet.
        </Text>
        <Button title="Retry" onPress={retryAction} />
      </View>
    )}</>
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
});

export default App;
