/* eslint-disable react/react-in-jsx-scope */
import {lazy, Suspense, useState} from 'react';
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
const ChatPageStack = lazy(() => import('./ChatNavigation'));
//import ChatPageStack from './ChatNavigation';
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
import {ActivityIndicator, Platform, Text} from 'react-native';
// import MyItemListScreen from '../screens/MyItemListScreen';
// import PodcastLikeList from '../sharedComponents/PodcastLikeList';
// import PodcastViewList from '../sharedComponents/PodcastViewList';
// import StoryLikeList from '../sharedComponents/StoryLikeList';
// import StoryViewList from '../sharedComponents/StoryViewList';
// import BrokerList from '../sharedComponents/BrokerList';
// import ItemFilterListScreen from '../screens/ItemFilterListScreen';
// import BuyerList from '../sharedComponents/BuyerList';
// import ProfileViewerList from '../sharedComponents/ProfileViewerList';
// import PostLeads from '../sharedComponents/PostLeads';

// import EnquiryForm from '../sharedComponents/EnquiryForm';
import React from 'react';
import StoryDetails from '../components/story/StoryDetails';
import SubscriptionPlan from '../screens/SubscriptionPlan';
import StickyHeaderWithTabs from '../screens/StickyHeaderWithTabs';
// Lazy-loaded components
const MyItemListScreen = React.lazy(
  () => import('../screens/MyItemListScreen'),
);
const PodcastLikeList = React.lazy(
  () => import('../sharedComponents/PodcastLikeList'),
);
const PodcastViewList = React.lazy(
  () => import('../sharedComponents/PodcastViewList'),
);
const StoryLikeList = React.lazy(
  () => import('../sharedComponents/StoryLikeList'),
);
const StoryViewList = React.lazy(
  () => import('../sharedComponents/StoryViewList'),
);
const BrokerList = React.lazy(() => import('../sharedComponents/BrokerList'));
const ItemFilterListScreen = React.lazy(
  () => import('../screens/ItemFilterListScreen'),
);
const BuyerList = React.lazy(() => import('../sharedComponents/BuyerList'));
const ProfileViewerList = React.lazy(
  () => import('../sharedComponents/ProfileViewerList'),
);
const PostLeads = React.lazy(() => import('../sharedComponents/PostLeads'));
const EnquiryForm = React.lazy(() => import('../sharedComponents/EnquiryForm'));
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const ChatPageStackLazy = () => (
  <Suspense fallback={<ActivityIndicator />}>
    <ChatPageStack />
  </Suspense>
);
const FallbackLoader = () => <ActivityIndicator size="large" color="#007ACC" />;
const globalScreenOptions = {
  gestureEnabled: false,
  gestureDirection: 'horizontal',
  cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid, // Example of a horizontal slide transition
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
    <OverlayProvider bottomInset={bottom} value={{style: streamChatTheme}}>
      {/* <Stack.Navigator screenOptions={globalScreenOptions}> */}
      <Stack.Navigator
        detachInactiveScreens={true}
        screenLayout={({children}) => (
          <Suspense fallback={<FallbackLoader />}>{children}</Suspense>
        )}>
        <Stack.Group screenOptions={{headerShown: false, headerTitle: ''}}>
          <Stack.Screen name="Home" component={AppDrawer} />
        </Stack.Group>
        <Stack.Screen
          options={{headerShown: false}}
          name="AppChat"
          component={ChatPageStackLazy}
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
          name="StickyHeaderWithTabs"
          component={StickyHeaderWithTabs}
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
          options={{headerShown: false}}
          name="BrokerList"
          component={BrokerList}
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
          options={{headerShown: false}}
          name="EnquiryForm"
          component={EnquiryForm}
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
          name="ItemFilterListScreen"
          component={ItemFilterListScreen}
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
          name="BuyerList"
          component={BuyerList}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="PodcastViewList"
          component={PodcastViewList}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ProfileViewerList"
          component={ProfileViewerList}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="PostLeads"
          component={PostLeads}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="PostCommentLikeList"
          component={PostCommentLikeList}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="StoryDetails"
          component={StoryDetails}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="PostCommentReplyLikeList"
          component={PostCommentReplyLikeList}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="StoryLikeList"
          component={StoryLikeList}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="StoryViewList"
          component={StoryViewList}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SubscriptionScreen"
          component={SubscriptionPlan}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </OverlayProvider>
  );
};

export default HomeNavigation;
