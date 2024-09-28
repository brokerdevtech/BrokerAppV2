/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import './global.css';
import Geolocation from 'react-native-geolocation-service';
import { StreamChat } from 'stream-chat';
//import "./global.css";
import type {PropsWithChildren} from 'react';
import {
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Provider} from 'react-redux';
import store from './BrokerAppcore/redux/store';
import MainNavigation from './src/navigation/MainNavigation';
import {GluestackUIProvider} from '@/components/ui/gluestack-ui-provider';
import PermissionService from './src/utils/PermissionService';
import {PERMISSIONS, request} from 'react-native-permissions';
import {getAddressFromCoordinates, getAddressFromCoordinatesNew} from './BrokerAppcore/services/googleService';
import {setCity} from './BrokerAppcore/redux/store/City/citySlice';
import {setUser} from './BrokerAppcore/redux/store/user/userSlice';
import {setTokens} from './BrokerAppcore/redux/store/authentication/authenticationSlice';
import {getTokens} from './src/utils/utilTokens';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import { setAppLocation } from './BrokerAppcore/redux/store/AppLocation/appLocation';
import {NativeBaseProvider, extendTheme} from 'native-base';
import {moderateScale} from './src/config/constants';
import typography from './src/themes/typography';

const theme = extendTheme({
  colors: {
    // Add new color
    Aprimary: '#1D7BBF',
    Asecondary: '#393939',
    ABase: '#F8F8F8',
    Awhite: '#FFFFFF',
    Ablack: '#333333',
    AerrorColor: '#F54135',
    primaryfontColor: '#232323',
    secondaryfontColor: '#d9d9d9',
    primary: {
      50: '#def6ff',
      100: '#b7defa',
      200: '#8cc7f1',
      300: '#62b0e8',
      400: '#389ae1',
      500: '#1e80c7',
      600: '#13649c',
      700: '#074771',
      800: '#002b46',
      900: '#000f1d',
    },
    // Redefining only one shade, rest of the color will remain same.
  },
  fontConfig: {
    Poppins: {
      100: {
        normal: 'Poppins-Medium',
        italic: 'Poppins-MediumItalic',
      },
      200: {
        normal: 'Poppins-Medium',
        italic: 'Roboto-LightItalic',
      },
      300: {
        normal: 'Poppins-Medium',
        italic: 'Roboto-LightItalic',
      },
      400: {
        normal: 'Poppins-Medium',
        italic: 'Poppins-MediumItalic',
      },
      500: {
        normal: 'Poppins-Medium',
      },
      600: {
        normal: 'Poppins-Medium',
        italic: 'Poppins-MediumItalic',
      },
    },
  },

  // Make sure values below matches any of the keys in `fontConfig`
  fonts: {
    heading: 'InterRegular',
    body: 'InterRegular',
    mono: 'InterRegular',
  },
  components: {
    Input: {
      // Can simply pass default props to change default behaviour of components.
      baseStyle: {
        // rounded: 'lg',
        variant: 'outline',
        px: '16px',
        pt: '14px',
        pb: '14px',
        minheight: '50px',
        borderRadius: '5',
        borderColor: '#D9D9D9',
        color: 'black',
        //backgroundColor:'#F3F3F3',
        fontWeights: typography.fontWeights.Regular,
        _input: {
          // bg: '#EFF4F8',
        },
      },
      defaultProps: {
        colorScheme: 'secondaryfontColor',
        size: 'md',
      },
      sizes: {
        xl: {
          fontSize: moderateScale(64),
        },
        lg: {
          fontSize: moderateScale(32),
        },
        md: {
          fontSize: moderateScale(16),
        },
        sm: {
          fontSize: moderateScale(14),
        },
      },
    },
  },
});

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
        let relustGeolocation:any = await getCurrentPositionAsync();

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

      let resultAddress = await getAddressFromCoordinates(latitude, longitude);
      store.dispatch(setCity(resultAddress));
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
  }, []);

  return (
    <Provider store={store}>
     <NativeBaseProvider theme={theme}>
      <GestureHandlerRootView style={{flex: 1}}>
        <GluestackUIProvider mode={colorMode}>
          <MainNavigation loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
        </GluestackUIProvider>
      </GestureHandlerRootView>
    </NativeBaseProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
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
