import {lazy, Suspense, useEffect, useRef, useState} from 'react';

import {Chat, useOverlayContext} from 'stream-chat-react-native';
import {AppOverlayProvider} from '../Context/AppOverlayProvider';
import {UserSearchProvider} from '../Context/UserSearchContext';
import {createStackNavigator} from '@react-navigation/stack';
import {useNavigation, useRoute} from '@react-navigation/native';
import {ActivityIndicator, Platform, View} from 'react-native';
import React from 'react';
import {useChatClient} from './useChatClient';
import FastImage from '@d11/react-native-fast-image';
import {ChannelListScreen} from '../screens/Chat/ChannelListScreen';
import {NewDirectMessagingScreen} from '../screens/Chat/NewDirectMessagingScreen';
import {ChannelScreen} from '../screens/Chat/ChannelScreen';
import {NewGroupChannelAddMemberScreen} from '../screens/Chat/NewGroupChannelAddMemberScreen';
import {NewGroupChannelAssignNameScreen} from '../screens/Chat/NewGroupChannelAssignNameScreen';
import {OneOnOneChannelDetailScreen} from '../screens/Chat/OneOnOneChannelDetailScreen';
import {GroupChannelDetailsScreen} from '../screens/Chat/GroupChannelDetailsScreen';
import {ChannelImagesScreen} from '../screens/Chat/ChannelImagesScreen';
import {ChannelFilesScreen} from '../screens/Chat/ChannelFilesScreen';
import {ChannelPinnedMessagesScreen} from '../screens/Chat/ChannelPinnedMessagesScreen';
import {SharedGroupsScreen} from '../screens/Chat/SharedGroupsScreen';
import {ThreadScreen} from '../screens/Chat/ThreadScreen';
import {AppProvider} from '../Context/AppContext';

const LazyWrapper = ({children, ...props}) => (
  <Suspense
    fallback={
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    }>
    {React.cloneElement(children, props)}
  </Suspense>
);

// const ChannelListScreen = lazy(() =>
//     import('../screens/Chat/ChannelListScreen').then(module => ({
//       default: module.ChannelListScreen,
//     })),
//   );

// const NewDirectMessagingScreen = lazy(() =>
//   import('../screens/Chat/NewDirectMessagingScreen').then(module => ({
//     default: module.NewDirectMessagingScreen,
//   })),
// );
// const ChannelScreen = lazy(() =>
//   import('../screens/Chat/ChannelScreen').then(module => ({
//     default: module.ChannelScreen,
//   })),
// );
// const NewGroupChannelAddMemberScreen = lazy(() =>
//   import('../screens/Chat/NewGroupChannelAddMemberScreen').then(module => ({
//     default: module.NewGroupChannelAddMemberScreen,
//   })),
// );
// const NewGroupChannelAssignNameScreen = lazy(() =>
//   import('../screens/Chat/NewGroupChannelAssignNameScreen').then(module => ({
//     default: module.NewGroupChannelAssignNameScreen,
//   })),
// );
// const OneOnOneChannelDetailScreen = lazy(() =>
//   import('../screens/Chat/OneOnOneChannelDetailScreen').then(module => ({
//     default: module.OneOnOneChannelDetailScreen,
//   })),
// );
// const GroupChannelDetailsScreen = lazy(() =>
//   import('../screens/Chat/GroupChannelDetailsScreen').then(module => ({
//     default: module.GroupChannelDetailsScreen,
//   })),
// );
// const ChannelImagesScreen = lazy(() =>
//   import('../screens/Chat/ChannelImagesScreen').then(module => ({
//     default: module.ChannelImagesScreen,
//   })),
// );
// const ChannelFilesScreen = lazy(() =>
//   import('../screens/Chat/ChannelFilesScreen').then(module => ({
//     default: module.ChannelFilesScreen,
//   })),
// );
// const ChannelPinnedMessagesScreen = lazy(() =>
//   import('../screens/Chat/ChannelPinnedMessagesScreen').then(module => ({
//     default: module.ChannelPinnedMessagesScreen,
//   })),
// );
// const SharedGroupsScreen = lazy(() =>
//   import('../screens/Chat/SharedGroupsScreen').then(module => ({
//     default: module.SharedGroupsScreen,
//   })),
// );
// const ThreadScreen = lazy(() =>
//   import('../screens/Chat/ThreadScreen').then(module => ({
//     default: module.ThreadScreen,
//   })),
// );

const Stack = createStackNavigator();

const ChatPageStack = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {defaultScreen, defaultParams,defaultchannelSubject} = route.params || {};
  const {clientIsReady, unreadCount, AppChatClient, isConnecting} =
    useChatClient();
  const [isClientReady, setIsClientReady] = useState(false);
  const {overlay} = useOverlayContext();
  const currentChannel = useRef<StreamChatChannel<StreamChatGenerics>>();
  const isDraft = useRef(true);
  useEffect(() => {
    if (AppChatClient) {
      setIsClientReady(true);
    }
  }, [AppChatClient]);

  useEffect(() => {
    const handleChannelSetup = async () => {
      if (defaultScreen === 'ChannelScreen') {
        const channel = AppChatClient.channel('messaging', {
          members: defaultParams,
        });
        await channel.create();
        if(defaultchannelSubject)
          await   channel.sendMessage({ text: defaultchannelSubject });
        navigation.navigate('ChannelScreen', {
          channelId: channel?.id,
        });
      }
 
   



    };

    if (isClientReady) {
      handleChannelSetup();
    }
  }, [isClientReady, defaultScreen, defaultParams, AppChatClient]);

  if (!isClientReady) {
    // Render a loading indicator or similar UI element
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#000000" />
        {/* Or any other placeholder content */}
      </View>
    );
  }

  return (
    <AppProvider chatClient={AppChatClient} unreadCount={unreadCount}>
      <Chat client={AppChatClient} ImageComponent={FastImage}>
        <AppOverlayProvider>
          <UserSearchProvider>
            <Stack.Navigator initialRouteName="Chat">
              <Stack.Screen
                name="Chat"
                options={{headerShown: false}}
                component={ChannelListScreen}
                // component={(props: any) => (
                //   <LazyWrapper>
                //     <ChannelListScreen {...props} />
                //   </LazyWrapper>
                // )}
              />
              <Stack.Screen
                component={NewDirectMessagingScreen}
                name="NewDirectMessagingScreen"
                options={{
                  headerShown: false,
                }}
              />

              <Stack.Screen
                component={ChannelScreen}
                name="ChannelScreen"
                options={{
                  gestureEnabled: Platform.OS === 'ios' && overlay === 'none',
                  headerShown: false,
                }}
              />
              <Stack.Screen
                component={NewGroupChannelAddMemberScreen}
                name="NewGroupChannelAddMemberScreen"
                options={{headerShown: false}}
              />
              <Stack.Screen
                component={NewGroupChannelAssignNameScreen}
                name="NewGroupChannelAssignNameScreen"
                options={{headerShown: false}}
              />
              <Stack.Screen
                component={OneOnOneChannelDetailScreen}
                name="OneOnOneChannelDetailScreen"
                options={{headerShown: false}}
              />
              <Stack.Screen
                component={GroupChannelDetailsScreen}
                name="GroupChannelDetailsScreen"
                options={{headerShown: false}}
              />
              <Stack.Screen
                component={ChannelImagesScreen}
                name="ChannelImagesScreen"
                options={{headerShown: false}}
              />
              <Stack.Screen
                component={ChannelFilesScreen}
                name="ChannelFilesScreen"
                options={{headerShown: false}}
              />
              <Stack.Screen
                component={ChannelPinnedMessagesScreen}
                name="ChannelPinnedMessagesScreen"
                options={{headerShown: false}}
              />
              <Stack.Screen
                // component={(props: any) => (
                //   <LazyWrapper>
                //     <SharedGroupsScreen {...props} />
                //   </LazyWrapper>
                // )}
                component={SharedGroupsScreen}
                name="SharedGroupsScreen"
                options={{headerShown: false}}
              />
              <Stack.Screen
                // component={(props: any) => (
                //   <LazyWrapper>
                //     <ThreadScreen {...props} />
                //   </LazyWrapper>
                // )}
                component={ThreadScreen}
                name="ThreadScreen"
                options={{
                  gestureEnabled: Platform.OS === 'ios' && overlay === 'none',
                  headerShown: false,
                }}
              />

              {/* <Stack.Screen
         options={{headerShown: false}}
           name="ChannelScreen"
           component={ChatListScreen}
         />
  
         <Stack.Screen
           options={{headerShown: false}}
           name="CreateChatScreen"
           component={CreateChatScreen}
         /> */}
            </Stack.Navigator>
          </UserSearchProvider>
        </AppOverlayProvider>
      </Chat>
    </AppProvider>
  );
};

export default ChatPageStack;
