/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {StreamChat, TokenOrProvider} from 'stream-chat';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import {GetStreamToken} from './BrokerAppCore/services/authService';
import {chatApiKey} from './src/config/chatConfig';
const tokenProvider: TokenOrProvider = async userId => {
  try {
    const response = await GetStreamToken(userId);

    const streamAccessToken = response.data.getStreamAccessToken;
    return streamAccessToken;
  } catch (error) {
    throw error;
  }
};
messaging().onMessage(async remoteMessage => {
  await notifee.requestPermission();
  if (Object.keys(remoteMessage.data).length === 0) {
    const channelId = await notifee.createChannel({
      id: 'app-messages',
      name: 'App Messages',
      vibration: true, // Ensure vibration is enabled
      // importance: AndroidImportance.HIGH,
    });

    const data = {};
    console.log('onMessage', remoteMessage);
    await notifee.displayNotification({
      android: {
        channelId,
        pressAction: {
          id: 'default',
        },
      },

      body: remoteMessage.notification.body,
      data,
      title: remoteMessage.notification.title,
      sound: 'default',
    });
  } else {
    const messageId = remoteMessage.data?.id;
    if (!messageId) return;
    const chatClient = StreamChat.getInstance(chatApiKey);
    const user = {
      id: remoteMessage.data?.receiver_id,
    };
    let token = await tokenProvider(remoteMessage.data?.receiver_id);

    await chatClient._setToken(user, token);
    const message = await chatClient.getMessage(messageId);
    // console.log("setBackgroundMessageHandler");
    const channelId = await notifee.createChannel({
      id: 'chat-messages',
      name: 'Chat Messages',
    });

    if (message.message.user?.name && message.message.text) {
      const {stream, ...rest} = remoteMessage.data ?? {};
      const data = {
        ...rest,
        ...(stream ?? {}), // extract and merge stream object if present
      };
      //  console.log("setBackgroundMessageHandler");
      await notifee.displayNotification({
        android: {
          channelId,
          pressAction: {
            id: 'default',
          },
        },

        body: message.message.text,
        data: data,
        title: 'New message from ' + message.message.user.name,

        sound: 'default',
      });
    }
  }
});

messaging().setBackgroundMessageHandler(async remoteMessage => {
  // console.log(remoteMessage);
  await notifee.requestPermission();
  console.log('setBackgroundMessageHandler', remoteMessage);
  if (Object.keys(remoteMessage.data).length === 0) {
    const channelId = await notifee.createChannel({
      id: 'app-messages',
      name: 'App Messages',
    });

    const data = {};
    // console.log("setBackgroundMessageHandler");
    await notifee.displayNotification({
      android: {
        channelId,
        pressAction: {
          id: 'default',
        },
      },

      body: remoteMessage.notification.body,
      data,
      title: remoteMessage.notification.title,
    });
  } else {
    const messageId = remoteMessage.data?.id;
    if (!messageId) return;
    const chatClient = StreamChat.getInstance(chatApiKey);
    const user = {
      id: remoteMessage.data?.receiver_id,
    };
    let token = await tokenProvider(remoteMessage.data?.receiver_id);

    await chatClient._setToken(user, token);
    const message = await chatClient.getMessage(messageId);
    // console.log("setBackgroundMessageHandler");
    const channelId = await notifee.createChannel({
      id: 'chat-messages',
      name: 'Chat Messages',
    });

    if (message.message.user?.name && message.message.text) {
      const {stream, ...rest} = remoteMessage.data ?? {};
      const data = {
        ...rest,
        ...(stream ?? {}), // extract and merge stream object if present
      };
      //  console.log("setBackgroundMessageHandler");
      await notifee.displayNotification({
        android: {
          channelId,
          pressAction: {
            id: 'default',
          },
        },

        body: message.message.text,
        data: data,
        title: 'New message from ' + message.message.user.name,

        sound: 'default',
      });
    }
  }
});
AppRegistry.registerComponent(appName, () => App);
