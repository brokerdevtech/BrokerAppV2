/**
 * @format
 */

import {AppRegistry, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {StreamChat, TokenOrProvider} from 'stream-chat';
import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance} from '@notifee/react-native';
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
async function handleNotification(remoteMessage, isBackground = false) {
  if (isBackground && Object.keys(remoteMessage.data).length == 0) {
    const channelId = await notifee.createChannel({
      id: 'app-messages',
      name: 'App Messages',
    });

    const data = {};
    await notifee.displayNotification({
      android: {
        channelId,
        pressAction: {
          id: 'default',
        },
      },
      ios: {
        foregroundPresentationOptions: {
          badge: true,
          sound: true,
          banner: true,
          list: true,
        },
      },
      body: remoteMessage.notification.body,
      data,
      title: remoteMessage.notification.title,
    });
  }

  if (Object.keys(remoteMessage.data).length > 0) {
    const messageId = remoteMessage.data?.id;
    console.log(messageId);
    if (!messageId) return;

    const chatClient = StreamChat.getInstance(chatApiKey);
    const user = {
      id: remoteMessage.data?.receiver_id,
    };
    let token = await tokenProvider(remoteMessage.data?.receiver_id);

    await chatClient._setToken(user, token);
    const message = await chatClient.getMessage(messageId);

    if (message.message.user?.name && message.message.text) {
      const channelId = await notifee.createChannel({
        id: 'chat-messages',
        name: 'Chat Messages',
      });

      const {stream, ...rest} = remoteMessage.data ?? {};
      const data = {
        ...rest,
        ...(stream ?? {}),
      };

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
  } else {
    console.log('remoteMessage');

    const channelId = await notifee.createChannel({
      id: 'app-messages',
      name: 'App Messages',
    });

    const data = {};
    await notifee.displayNotification({
      android: {
        channelId,
        pressAction: {
          id: 'default',
        },
      },
      ios: {
        foregroundPresentationOptions: {
          badge: true,
          sound: true,
          banner: true,
          list: true,
        },
      },
      body: remoteMessage.notification.body,
      data,
      title: remoteMessage.notification.title,
    });
  }
}

messaging().onMessage(async remoteMessage => {
  console.log(remoteMessage);
  if (Platform.OS === 'ios') {
    if (remoteMessage.notification) {
    } else {
      await handleNotification(remoteMessage, false);
    }

    if (remoteMessage.notification) {
    } else {
      await handleNotification(remoteMessage, false);
    }
  }
});

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log(remoteMessage);

  if (remoteMessage.notification) {
  } else {
    await handleNotification(remoteMessage, true);
  }
});
AppRegistry.registerComponent(appName, () => App);
