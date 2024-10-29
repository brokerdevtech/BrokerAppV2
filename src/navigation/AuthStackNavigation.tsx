import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';
import GuestDashboardScreen from '../screens/GuestDashBoardScreen';
import GuestAppTab from './GuestAppTab';
import GuestAppDrawer from './GuestAppDrawer';

const Stack = createStackNavigator();

interface StackNavigationProps {
  loggedIn: boolean;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthStackNavigation: React.FC<StackNavigationProps> = ({
  loggedIn,
  setLoggedIn,
}) => {
  return (
    <Stack.Navigator initialRouteName="LoginScreen">
      <Stack.Screen
        name="Login"
        options={{
          headerTitle: '',
          headerShown: false,
        }}>
        {props => <LoginScreen loggedIn={loggedIn} setLoggedIn={setLoggedIn} />}
      </Stack.Screen>
      <Stack.Screen
        name="Register"
        options={{
          headerTitle: '',
          headerShown: false,
        }}>
        {props => (
          <RegisterScreen loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="ForgotPassword"
        options={{
          headerTitle: '',
          headerShown: false,
        }}>
        {props => <ForgotPasswordScreen />}
      </Stack.Screen>
      <Stack.Screen
        name="GuestHome"
        options={{
          headerTitle: '',
          headerShown: false,
        }}>
        {props => <GuestAppDrawer />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default AuthStackNavigation;
