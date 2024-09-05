import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/Auth/LoginScreen';




const Stack = createStackNavigator();

interface StackNavigationProps {
  loggedIn: boolean;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthStackNavigation: React.FC<StackNavigationProps> =({loggedIn,setLoggedIn}) => {
  return (
    <Stack.Navigator 
   
    initialRouteName="LoginScreen">
     
      <Stack.Screen 
        name="Login"
        options={{
          headerTitle:'',
          headerShown: false
           }} >
        {props => <LoginScreen loggedIn={loggedIn} setLoggedIn={setLoggedIn} />}
        
      </Stack.Screen>

    </Stack.Navigator>
  );
};

export default AuthStackNavigation;