import {useState} from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AppTab from './AppTab';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();



const AppDrawer: React.FC = () => { 
    return (
      <Drawer.Navigator>
        <Drawer.Screen name="HomeDrawer" component={AppTab} />
       
      </Drawer.Navigator>
    );
  }

  export default AppDrawer;