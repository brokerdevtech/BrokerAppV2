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
import GuestAppTab from './GuestAppTab';
import GuestCustomHeader from '../sharedComponents/GuestCustomHeader';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const GuestAppDrawer: React.FC = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={({route, navigation}) => ({
        header: () => <GuestCustomHeader />,
        headerStyle: {
          height: Platform.OS === 'android' ? 65 : 120,
        }, // Custom header for all screens
      })}>
      <Drawer.Screen name="HomeDrawer" component={GuestAppTab} />
      {/* <Drawer.Screen name="Profile" component={AppTab} /> */}
    </Drawer.Navigator>
  );
};

export default GuestAppDrawer;
