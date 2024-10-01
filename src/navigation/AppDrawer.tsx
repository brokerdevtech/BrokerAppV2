import {useState} from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import AppTab from './AppTab';
import CustomHeader from '../sharedComponents/CustomHeader';
import CustomDrawerContent from '../sharedComponents/CustomDrawerProfile';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const AppDrawer: React.FC = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={({route, navigation}) => ({
        header: () => <CustomHeader />, // Custom header for all screens
      })}>
      <Drawer.Screen name="HomeDrawer" component={AppTab} />
      <Drawer.Screen name="Profile" component={AppTab} />
    </Drawer.Navigator>
  );
};

export default AppDrawer;
