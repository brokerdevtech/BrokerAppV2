/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import "./global.css";
import type {PropsWithChildren} from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { Provider } from 'react-redux';
import store from './BrokerAppcore/redux/store';
import MainNavigation from './src/navigation/MainNavigation';
import {GluestackUIProvider} from '@/components/ui/gluestack-ui-provider';
import PermissionService from './src/utils/PermissionService';
import { PERMISSIONS } from 'react-native-permissions';
type SectionProps = PropsWithChildren<{
  title: string;
}>;
let defaultTheme: "dark" | "light" = "light";
type ThemeContextType = {
  colorMode?: "dark" | "light";
  toggleColorMode?: () => void;
};
export const ThemeContext = React.createContext<ThemeContextType>({
  colorMode: "light",
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
  const isDarkMode = useColorScheme() === 'dark';
  const [loggedIn, setLoggedIn] = useState(false);
  const [colorMode, setColorMode] = React.useState<"dark" | "light">(
    defaultTheme
  );

  const toggleColorMode = async () => {
    setColorMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const [locationPermission, setLocationPermission] = useState('unknown');

  // Define the function to check permission status
  const checkLocationPermissionStatus = async () => {
    const status = await PermissionService.checkPermissionStatus(
      Platform.select({
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      }),
      'Location'
    );

    setLocationPermission(status);
    if (status === 'denied') {
      // Handle permission blocked and loop until granted
      const newStatus = await PermissionService.showBlockedPermissionAlert('Location');
      setLocationPermission(newStatus); // Update status after returning from settings
    }
    if (status === 'blocked') {
      // Handle permission blocked and loop until granted
      const newStatus = await PermissionService.showBlockedPermissionAlert('Location');
      setLocationPermission(newStatus); // Update status after returning from settings
    }
  };

  // Use useEffect to check permission when the component mounts
  useEffect(() => {
    checkLocationPermissionStatus(); // Call the function inside useEffect
  }, [])


  return (
    <Provider store={store}>
  
    <GluestackUIProvider mode={colorMode}>
      
    <MainNavigation
                    loggedIn={loggedIn}
                    setLoggedIn={setLoggedIn}
                  />
      
      </GluestackUIProvider>
      
   
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


