// useChatClient.js

import { useEffect, useRef, useState } from 'react';
//import { StreamChat ,PushProvider,TokenOrProvider} from 'stream-chat';
import { chatApiKey, chatUserId, chatUserName, chatUserToken } from '../config/chatConfig';
import { useSelector } from 'react-redux';

import { getItemStorage, getTokens, getfcmToken, getsfcmToken, removeItemStorage } from '../utils/utilTokens';


import { firebase } from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { StreamChat, TokenOrProvider } from 'stream-chat';
import { GetStreamToken } from '../../BrokerAppCore/services/authService';
import { RootState } from '../../BrokerAppCore/redux/store/reducers';


export const useChatClient = () => {
  const [clientIsReady, setClientIsReady] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [unreadCount, setUnreadCount] = useState<number>();
  const auth = useSelector((state: RootState) => state.auth);
  const userState = useSelector((state: RootState) => state.user)
  
  const [AppChatClient, setAppChatClient] = useState<StreamChat<any> | null>(null);

  const tokenProvider: TokenOrProvider = async () => {
    try {
      
      const response = await GetStreamToken(userState.user.userId);
      
      const streamAccessToken =response.data.getStreamAccessToken;
      return streamAccessToken;
     
    } catch (error) {
      throw error;
    }
  };


  // const tokenProvider = () => {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       const response = await GetStreamToken(userState.userId);
  
  //       if (response.status === 200) {
  //         const data = await response.json();
  //         const streamAccessToken = data.getStreamAccessToken;
  //         resolve(streamAccessToken);
  //       } else {
  //         reject(new Error(response.statusText));
  //       }
  //     } catch (error) {
  //       reject(error);
  //     }
  //   });
  // };
  // const tokenProvider = async ( Promise<string>) => {
  //   const response = await GetStreamToken(userState.userId);
  //   return response.getStreamAccessToken;
  //   if (response.status === 200) {
  //   //  ""
  //     const data = await response.json();
  //     return auth.getStreamAccessToken;
  //   } else {
  //     throw new Error(response.statusText);
  //   }
  // };


  const user = {
    id: userState?.user?.userId.toString(),
    name: `${userState?.user?.firstName.toString()} ${userState?.user?.lastName.toString()}` ,
  };




  const chatUserTokenauth=auth.getStreamAccessToken;


const chatClient = StreamChat.getInstance(chatApiKey);

  const [isReady, setIsReady] = useState(false);
  const unsubscribeTokenRefreshListenerRef = useRef<() => void>();

  const requestPermission = async () => {
    try {

    await removeItemStorage('fcmToken');
   console.log("ss");
     // await firebase.messaging().requestPermission();
      // User has authorised
      await  getfcmToken();
  } catch (error) {
      // User has rejected permissions
      
  }

   }

  useEffect(() => {
    
    // Register FCM token with stream chat server.
    const registerPushToken = async () => {
      // unsubscribe any previous listener
      unsubscribeTokenRefreshListenerRef.current?.();
      const token = await  getsfcmToken();
      const push_provider = 'firebase';
      const push_provider_name = 'firebase'; // name an alias for your push provider (optional)
      chatClient.setLocalDevice({
        id: token?.toString()!,
        push_provider,
        // push_provider_name is meant for optional multiple providers support, see: https://getstream.io/chat/docs/react/push_providers_and_multi_bundle
        push_provider_name,
      });
   
      await removeItemStorage('@current_push_token');
      await AsyncStorage.setItem('@current_push_token', token?.toString()!);

      const removeOldToken = async () => {

        const oldToken = await AsyncStorage.getItem('@current_push_token');
        if (oldToken !== null) {
          await chatClient.removeDevice(oldToken);
        }
      };
      //await removeOldToken(),
      unsubscribeTokenRefreshListenerRef.current = firebase.messaging().onTokenRefresh(async newToken => {
        
        await Promise.all([
        
          chatClient.addDevice(newToken, push_provider, userState.user.userId.toString(), push_provider_name),
          AsyncStorage.setItem('@current_push_token', newToken),
        ]);
      });
   
    };

    const init = async () => {
      //""

      setIsConnecting(true);
      const storeTokensresult =  await getTokens();
      
      await requestPermission();
      
      await registerPushToken();
   
      const connectedUser =    await chatClient.connectUser(user, await tokenProvider());
      const initialUnreadCount = connectedUser?.me?.total_unread_count;
    setUnreadCount(initialUnreadCount);
      const fcmToken :any=    await  getsfcmToken();
      const devices= await chatClient.getDevices();
      
      if (devices?.devices) {
        for (const device of devices.devices) {
          
           await chatClient.removeDevice(device.id, userState.user.userId.toString());
        }
      }
      chatClient.addDevice(fcmToken, 'firebase', userState.user.userId.toString(), 'firebase'),
      setAppChatClient(chatClient);
      setIsConnecting(false);
      setClientIsReady(true);
    };

    init();

    return async () => {
      await chatClient?.disconnectUser();
      unsubscribeTokenRefreshListenerRef.current?.();
    };
  }, []);

 



//   useEffect(() => {
//     const setupClient = async () => {
//       try {
//      //  ""
//         const storeTokensresult =  await getTokens();
//         const fcmToken :any=    await  getsfcmToken();
//         const push_provider = 'firebase';
//         const push_provider_name = 'api';
// 
// 
//         //debugger
// //         chatClient.connectUser(user,async () => {
// //           // make a request to your own backend to get the token
// //           const response = await fetch(`https://broker1.azurewebsites.net/api/v1/Users/refresh_token`, {
// //       method: `POST`,
// //       headers: {
// //         Authorization: `Bearer ${auth.accessToken}`,
// //         'Content-Type': 'application/json'
// //       },
// //       body: JSON.stringify({userId: userState.user.userId, rfreshToken: auth.refreshToken})
// //     });
// //     const data = await response.json();
// // 

// //     return auth.getStreamAccessToken;
// //       });
// //await chatClient.addDevice(fcmToken, 'firebase', userState.user.userId.toString());
// await chatClient.setLocalDevice({
//   id: fcmToken,
//   push_provider,
//   // push_provider_name is meant for optional multiple providers support, see: https://getstream.io/chat/docs/react/push_providers_and_multi_bundle
//   push_provider_name,
// });

// await chatClient.connectUser(user,storeTokensresult.getStreamAccessToken);
// 
// 
// 
// 
// Alert.alert('fcmToken',fcmToken);
// chatClient.setLocalDevice
// // const devices= await chatClient.getDevices();
// // 
// // if (devices?.devices) {
// //   for (const device of devices.devices) {
// //      await chatClient.removeDevice(device.id, userState.user.userId.toString());
// //   }
// // }


// // const result=await chatClient.addDevice(fcmToken, push_provider, userState.user.userId.toString(),push_provider_name);

// //
// // const devices= await chatClient.getDevices();
// // 
// //await chatClient.addDevice(fcmToken, push_provider, userState.user.userId.toString(),push_provider_name);
//  //await chatClient.addDevice(fcmToken, 'firebase', userState.user.userId.toString());
//         // chatClient.addDevice(fcmToken, PushProvider.firebase,userState.user.userId.toString());
//         setClientIsReady(true);
//      //   
      
//         // connectUser is an async function. So you can choose to await for it or not depending on your use case (e.g. to show custom loading indicator)
//         // But in case you need the chat to load from offline storage first then you should render chat components
//         // immediately after calling `connectUser()`.
//         // BUT ITS NECESSARY TO CALL connectUser FIRST IN ANY CASE.
//       } catch (error) {
     
//         
      
//         if (error instanceof Error) {
//           console.error(`An error occurred while connecting the user: ${error.message}`);
//         }
//       }
//     };

//     // If the chat client has a value in the field `userID`, a user is already connected
//     // and we can skip trying to connect the user again.
//     if (!chatClient.userID) {
//       setupClient();
//     }
//   }, []);

  return {
    clientIsReady,
    AppChatClient,
    unreadCount,
    isConnecting
  };
};
