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
    console.error('Token provider error:', error);
    throw error;
  }
};

async function handleNotification(remoteMessage, isBackground = false) {
  // Ensure we have a notification payload
  // console.log(remoteMessage);
  if (Platform.OS !== 'ios') {
    if (remoteMessage?.data?.id) {
      // console.log('handleChatNotification');
      await handleChatNotification(remoteMessage);
    }
  }

  if (!remoteMessage.notification) {
    return;
  }

  try {
    // Create a channel for iOS notifications
    const channelId = await notifee.createChannel({
      id: 'app-messages',
      name: 'App Messages',
      // importance: notifee.Importance.HIGH,
    });

    // Prepare notification display options
    const notificationOptions = {
      id: Date.now().toString(), // Unique ID to prevent notification overwriting
      title: remoteMessage.notification.title || 'New Notification',
      body: remoteMessage.notification.body || '',
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
        critical: true, // Ensure high priority on iOS
      },
      data: remoteMessage.data || {},
    };

    // Display the notification
    await notifee.displayNotification(notificationOptions);

    // Optional: Handle specific message data if needed
  } catch (error) {
    console.error('Notification display error:', error);
  }
}

async function handleChatNotification(remoteMessage) {
  try {
    const chatClient = StreamChat.getInstance(chatApiKey);
    const user = {
      id: remoteMessage.data?.receiver_id,
    };

    let token = await tokenProvider(remoteMessage.data?.receiver_id);
    await chatClient._setToken(user, token);
    const channelId = await notifee.createChannel({
      id: 'app-messages-chat',
      name: 'App Messages chat',
      // importance: notifee.Importance.HIGH,
    });
    const message = await chatClient.getMessage(remoteMessage.data.id);
    // console.log(message);
    if (message.message.user?.name && message.message.text) {
      // console.log('2');
      const notificationOptions = {
        id: Date.now().toString(), // Unique ID to prevent notification overwriting
        title: `New message from ${message.message.user.name}`,
        body: message.message.text,
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
          critical: true, // Ensure high priority on iOS
        },
        data: remoteMessage.data || {},
      };

      await notifee.displayNotification(notificationOptions);
    }
  } catch (error) {
    console.error('Chat notification handling error:', error);
  }
}

// Foreground message handler
messaging().onMessage(async remoteMessage => {
  // console.log('Foreground message:', remoteMessage);
  await handleNotification(remoteMessage, false);
});

// Background message handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  // console.log('Background message:', remoteMessage);
  await handleNotification(remoteMessage, true);
});

// Request notification permissions (critical for iOS)
async function requestNotificationPermissions() {
  const authStatus = await messaging().requestPermission({
    sound: true,
    badge: true,
    alert: true,
    provisional: false,
  });

  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    // console.log('Authorization status:', authStatus);
  }
}

// Call permission request when app starts
requestNotificationPermissions();

AppRegistry.registerComponent(appName, () => App);
