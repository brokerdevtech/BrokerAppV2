/* eslint-disable react/react-in-jsx-scope */
import {useState} from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';

import DashboradScreen from '../screens/DashboradScreen';
const Stack = createStackNavigator();

const globalScreenOptions = {
  gestureEnabled: false,
  gestureDirection: 'horizontal',
  cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS, // Example of a horizontal slide transition
};

const HomeNavigation: React.FC = () => {
  const [initialRoute, setInitialRoute] = useState('Home');

  return (
    <Stack.Navigator
      
     >
       <Stack.Screen name="HomeTab" component={DashboradScreen} />
      {/* <Stack.Group screenOptions={{headerShown: false, headerTitle: ''}}>
        <Stack.Screen name="HomeTab" component={DashboradScreen} />
      </Stack.Group> */}
    </Stack.Navigator>
  );
};

export default HomeNavigation;
