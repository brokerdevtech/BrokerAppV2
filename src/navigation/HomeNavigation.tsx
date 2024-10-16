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

import PostWizardScreen from '../screens/postImage/PostWizardScreen';

import ChatPageStack from './ChatNavigation';
import {OverlayProvider} from 'stream-chat-react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useStreamChatTheme} from '../hooks/useStreamChatTheme';
import VideoCarousel from '../screens/Podcast/VideoCarousel';

import EditImagesScreen from '../screens/postImage/EditImageScreen';
import FilterTagsScreen from '../sharedComponents/FilterTagsScreen';
import PropertyPostPreview from '../screens/postImage/previewScreens/PropertyPostPreview';
import GenericPostPreview from '../screens/postImage/previewScreens/GenericPostPreview';
import NotificationScreen from '../screens/NotificationScreen';
import CarFilterScreen from '../sharedComponents/carSearchFilter';
import FollowerList from '../sharedComponents/FollowerList';
import MyConnectionScreen from '../sharedComponents/MyConnections';
import ProfileScreen from '../sharedComponents/ProfileScreen';
import ItemListScreen from '../screens/ItemListScreen';
import ProfileSetting from '../sharedComponents/ProfileSetting';
import ItemDetailScreen from '../screens/ItemDetailScreen';
import ManagePersonalDetails from '../sharedComponents/ManagePersonalDetails';
import ProfileKyc from '../sharedComponents/ProfileKyc';
import OtherProfileScreen from '../sharedComponents/OtherProfileScreen';
import CarPostPreview from '../screens/postImage/previewScreens/CarPostPreview';
import PostLikeList from '../sharedComponents/PostLikeList';
import PostCommentLikeList from '../sharedComponents/PostCommentLikeList';
import PostCommentReplyLikeList from '../sharedComponents/PostCommentReplyLikeList';
import { Platform } from 'react-native';
import MyItemListScreen from '../screens/MyItemListScreen';
import PodcastLikeList from '../sharedComponents/PodcastLikeList';
import PodcastViewList from '../sharedComponents/PodcastViewList';
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
  let streamChatTheme = useStreamChatTheme();
  // streamChatTheme.channel.selectChannel.backgroundColor="#000000";
  // streamChatTheme.messageInput.backgroundColor="#000000";

  // console.log('strea============================');
  // console.log(streamChatTheme);
  return (
    // <SafeAreaView style={{flex:1}}>
    <OverlayProvider bottomInset={bottom} value={{style: streamChatTheme}}>
      <Stack.Navigator >
        <Stack.Group screenOptions={{headerShown: false, headerTitle: ''}}>
          <Stack.Screen name="Home" component={AppDrawer} />
        </Stack.Group>
        <Stack.Screen
          options={{headerShown: false}}
          name="AppChat"
          component={ChatPageStack}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="VideoReels"
          component={VideoCarousel}
        />
        {/* <Stack.Group screenOptions={{headerShown: false, headerTitle: ''}}>
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
          name="ProfileDetail"
          component={OtherProfileScreen}
        />
        <Stack.Screen
          name="FollowerList"
          component={FollowerList}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ProfileSettings"
          component={ProfileSetting}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ConnectionScreen"
          component={MyConnectionScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ManagePersonalDetails"
          component={ManagePersonalDetails}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ProfileKyc"
          component={ProfileKyc}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Carfilters"
          component={CarFilterScreen}
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
          name="CarPostPreview"
          component={CarPostPreview}
          options={{headerShown: false}}
        />
            <Stack.Screen
          name="GenericPostPreview"
          component={GenericPostPreview}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Notification"
          component={NotificationScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ItemListScreen"
          component={ItemListScreen}
          options={{headerShown: false}}
        />
             <Stack.Screen
          name="MyItemListScreen"
          component={MyItemListScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ItemDetailScreen"
          component={ItemDetailScreen}
          options={{headerShown: false}}
        />
 <Stack.Screen
          name="PostLikeList"
          component={PostLikeList}
          options={{headerShown: false}}
        />
 <Stack.Screen
          name="PodcastLikeList"
          component={PodcastLikeList}
          options={{headerShown: false}}
        />
         <Stack.Screen
          name="PodcastViewList"
          component={PodcastViewList}
          options={{headerShown: false}}
        />
<Stack.Screen
          name="PostCommentLikeList"
          component={PostCommentLikeList}
          options={{headerShown: false}}
        />


<Stack.Screen
          name="PostCommentReplyLikeList"
          component={PostCommentReplyLikeList}
          options={{headerShown: false}}
        />

      </Stack.Navigator>
    </OverlayProvider>
    // </SafeAreaView>
  );
};

export default HomeNavigation;
