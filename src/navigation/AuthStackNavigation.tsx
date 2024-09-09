import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
//import LoginScreen from '../NEWUI/screensUi/Auth/LoginScreen';
import RegisterScreen from '../NEWUI/screensUi/Auth/RegisterScreen';
import ForgotPasswordComponent from '../NEWUI/screensUi/Auth/ForgotPassword';
import LoginScreen from '../screens/Auth/LoginScreen';

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
      {/* <Stack.Screen 
        name="Login"
        options={{
          headerTitle:'',
          headerShown: false
           }} >
        {props => <LoginScreen loggedIn={loggedIn} setLoggedIn={setLoggedIn} />}
        
      </Stack.Screen> */}
      <Stack.Screen
        name="Login"
        options={{
          headerTitle: '',
          headerShown: false,
        }}>
        {props => <LoginScreen loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>}
      </Stack.Screen>
      <Stack.Screen
        name="Register"
        options={{
          headerTitle: '',
          headerShown: false,
        }}>
        {props => <RegisterScreen />}
      </Stack.Screen>
      <Stack.Screen
        name="ForgotPassword"
        options={{
          headerTitle: '',
          headerShown: false,
        }}>
        {props => <ForgotPasswordComponent />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default AuthStackNavigation;
