/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/react-in-jsx-scope */
import {useState} from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import AppTab from './AppTab';
import CustomHeader from '../sharedComponents/CustomHeader';
import CustomDrawerContent from '../sharedComponents/CustomDrawerProfile';
import {Platform, SafeAreaView} from 'react-native';
import {NavigationProvider} from '../Context/NavigationContext';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import CustomHeader2 from '../sharedComponents/CustomHeader2';
const Drawer = createDrawerNavigator();

const getActiveRouteName = (route) => {
  if (!route || !route.state) return route?.name;

  const nestedRoute = route.state.routes[route.state.index];

  // Recursive call
  return getActiveRouteName(nestedRoute);
};
const AppDrawer: React.FC = () => {
  return (
    <NavigationProvider>
      <Drawer.Navigator
        drawerContent={props => <CustomDrawerContent {...props} />}
        screenOptions={({route}) => ({
          drawerType: 'front',
          header: route.name === '' ? undefined : () => <CustomHeader />,
          headerStyle: {
            height: Platform.OS === 'android' ? 65 : 120,
          },
        })}>
        <Drawer.Screen
          name="HomeDrawer"
          component={AppTab}
          options={({route}) => {
            // Determine the active tab; default to "AppTabHome" if not set.
            const routeName =
              getFocusedRouteNameFromRoute(route) ?? 'AppTabHome';
console.log("==============routeName");
console.log(routeName);
console.log(getActiveRouteName(route));
            // When "Favourite" tab is active, hide the header.
            if (routeName === 'Favourite') {
              return {headerShown: false};
            }
            if (routeName === 'ItemListScreen') {
              return {headerShown: false};
            }
            // Otherwise, show the custom header.
            return {
              headerShown: false,
              header: () => <CustomHeader />,
              headerStyle: {
                height: Platform.OS === 'android' ? 65 : 120,
              },
            };
          }}
        />
        {/* <Drawer.Screen name="Profile" component={AppTab} /> */}
        <Drawer.Screen
          name="Favourite"
          component={AppTab}
          options={{unmountOnBlur: true, headerShown: false}}
        />
      </Drawer.Navigator>
    </NavigationProvider>
  );
};

export default AppDrawer;
