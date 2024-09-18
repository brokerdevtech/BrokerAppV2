/* eslint-disable react/react-in-jsx-scope */
import {useState} from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';

import DashboradScreen from '../screens/DashboradScreen';
import AppDrawer from './AppDrawer';
import ChooseImage from '../screens/postImage/ChooseImage';
import StoryView from '../components/story/StoryView';
import Screen1 from '../components/story/screen1';
import Screen2 from '../components/story/screen2';
import PostWizardScreen from '../screens/postImage/PostWizardScreen';
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const globalScreenOptions = {
  gestureEnabled: false,
  gestureDirection: 'horizontal',
  cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS, // Example of a horizontal slide transition
};

const HomeNavigation: React.FC = () => {
  const [initialRoute, setInitialRoute] = useState('Home');

  return (
    <Stack.Navigator>
      <Stack.Group screenOptions={{headerShown: false, headerTitle: ''}}>
        <Stack.Screen name="Home" component={AppDrawer} />
      </Stack.Group>
      {/* <Stack.Group screenOptions={{headerShown: false, headerTitle: ''}}>
        <Stack.Screen name="HomeTab" component={DashboradScreen} />
      </Stack.Group> */}
      <Stack.Screen
        name="ChooseImage"
        component={ChooseImage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="StoryView"
        component={StoryView}
      />
      <Stack.Screen name="Screen1" component={Screen1} />
      <Stack.Screen name="Screen2" component={Screen2} />
      <Stack.Screen name="PostWizard" component={PostWizardScreen} />
    </Stack.Navigator>
  );
};

export default HomeNavigation;
