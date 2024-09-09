import {useState} from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import LoginScreen from '../NEWUI/screensUi/Auth/LoginScreen';
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
      screenOptions={globalScreenOptions}
      initialRouteName={initialRoute}></Stack.Navigator>
  );
};

export default HomeNavigation;
