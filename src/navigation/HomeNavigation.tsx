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

import ChatPageStack from './ChatNavigation';
import {OverlayProvider} from 'stream-chat-react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useStreamChatTheme} from '../hooks/useStreamChatTheme';
import EditImagesScreen from '../screens/postImage/EditImageScreen';
import FilterTagsScreen from '../sharedComponents/FilterTagsScreen';
import PropertyPostPreview from '../screens/postImage/previewScreens/PropertyPostPreview';
import GenericPostPreview from '../screens/postImage/previewScreens/GenericPostPreview';
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const globalScreenOptions = {
  gestureEnabled: false,
  gestureDirection: 'horizontal',
  cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS, // Example of a horizontal slide transition
};

const HomeNavigation: React.FC = () => {
  const [initialRoute, setInitialRoute] = useState('Home');
  const {bottom} = useSafeAreaInsets();

  // const navigation = useNavigation();
  //const {clientIsReady} = useChatClient();
  const streamChatTheme = useStreamChatTheme();
  return (
    <OverlayProvider bottomInset={bottom} value={{style: streamChatTheme}}>
      <Stack.Navigator>
        <Stack.Group screenOptions={{headerShown: false, headerTitle: ''}}>
          <Stack.Screen name="Home" component={AppDrawer} />
        </Stack.Group>
        <Stack.Screen
          options={{headerShown: false}}
          name="AppChat"
          component={ChatPageStack}
        />
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

        <Stack.Screen
          options={{headerShown: false}}
          name="PostWizard"
          component={PostWizardScreen}
        />
        <Stack.Screen
          name="FilterTags"
          options={{headerShown: false}}
          component={FilterTagsScreen}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="EditImagesScreen"
          component={EditImagesScreen}
        />
        <Stack.Screen
          name="PropertyPostPreview"
          component={PropertyPostPreview}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="GenericPostPreview"
          component={GenericPostPreview}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </OverlayProvider>
  );
};

export default HomeNavigation;
