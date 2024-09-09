import AsyncStorage from '@react-native-async-storage/async-storage';
// import {firebase} from '@react-native-firebase/messaging';
import {Alert, DevSettings} from 'react-native';
import { logoutUser, setUser } from '../../BrokerAppcore/redux/store/user/userSlice';


import { useNavigation } from '@react-navigation/native';

// Store tokens after login
import {useDispatch} from 'react-redux';
import store from '../../BrokerAppcore/redux/store';

export const clearlogoutUser = async () => {
  try {
    
  

    await clearAll();
    // Use React Navigation to navigate to the login screen
    const navigation = useNavigation();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  } catch (error) {
    console.error('Failed to log out:', error);
    // Handle errors, for example, by showing an alert to the user
    // alert('Logout failed. Please try again.');
  }
}


export const storeTokens = async (
  accessToken: any,
  refreshToken: any,
  getStreamAccessToken: any,
) => {
  await AsyncStorage.setItem('access_token', accessToken);
  await AsyncStorage.setItem('refresh_token', refreshToken);
  await AsyncStorage.setItem('getStreamAccessToken', getStreamAccessToken);
};


export const storeUserPermissions = async (
  userPermissions: any,
  accessToken: any,
  refreshToken: any,
  getStreamAccessToken: any,
 ) => {

  let user:any=  await AsyncStorage.getItem('User');
  let storedUser:any = JSON.parse(user);
  storedUser.userPermissions=userPermissions;
  storedUser.accessToken=accessToken;
  storedUser.refreshToken=refreshToken;
  storedUser.getStreamAccessToken=getStreamAccessToken;
  const storeUserresult = AsyncStorage.setItem('User', JSON.stringify(storedUser));
  await store.dispatch(setUser(storedUser));
};

export const storeUser = async (User: any) => {
  await AsyncStorage.setItem('User', User);
};
export const getstoreUser = async () => {
 let user:any=  await AsyncStorage.getItem('User');
   return JSON.parse(user);
};

// Retrieve tokens
// export const getTokens = async () => {
//   // Check if the cache is valid
//   if (tokenCache.isValid()) {
//     return {
//       accessToken: tokenCache.accessToken,
//       refreshToken: tokenCache.refreshToken,
//       getStreamAccessToken: tokenCache.getStreamAccessToken,
//     };
//   }

//   try {
//     const [accessToken, refreshToken, getStreamAccessToken] = await Promise.all([
//       AsyncStorage.getItem('access_token'),
//       AsyncStorage.getItem('refresh_token'),
//       AsyncStorage.getItem('getStreamAccessToken'),
//     ]);

//     const tokens = { accessToken, refreshToken, getStreamAccessToken };
//     tokenCache.update(tokens); // Update the cache with new tokens

//     return tokens;
//   } catch (error) {
//     console.error("Failed to fetch tokens:", error);
//     return { accessToken: null, refreshToken: null, getStreamAccessToken: null };
//   }
// };

export const getTokens = async () => {

  const [accessToken, refreshToken, getStreamAccessToken] = await Promise.all([
    AsyncStorage.getItem('access_token'),
    AsyncStorage.getItem('refresh_token'),
    AsyncStorage.getItem('getStreamAccessToken'),
  ]);

  return { accessToken, refreshToken, getStreamAccessToken };
};

// Clear tokens on logout
export const clearTokens = async () => {
  await AsyncStorage.removeItem('access_token');
  await AsyncStorage.removeItem('refresh_token');
  await AsyncStorage.removeItem('getStreamAccessToken');
  await  AsyncStorage.removeItem('fcmToken');
};
export const clearTokensfcmToken = async () => {
  await  AsyncStorage.removeItem('fcmToken');
}
export const clearAll = async () => {

  await AsyncStorage.clear();
 // await dispatch(logoutUser());

  // await new Promise(resolve => setTimeout(resolve, 100));
 // DevSettings.reload();
  await store.dispatch(logoutUser());
 // reset(0, [{ name: 'Login' }]);
   await new Promise(resolve => setTimeout(resolve, 100));
  // console.log('clear');
  // reset(0, [{ name: 'Login' }]);

};
export const Checkerror = async (result) => {
if(result.status =="error" && result.error=="Invalid refresh token")
  {await AsyncStorage.clear();
 // await dispatch(logoutUser());

  // await new Promise(resolve => setTimeout(resolve, 100));
 // DevSettings.reload();
  await store.dispatch(logoutUser());
 // reset(0, [{ name: 'Login' }]);
  // await new Promise(resolve => setTimeout(resolve, 100));
  // console.log('clear');
  // reset(0, [{ name: 'Login' }]);
  }
};
// export const getfcmToken = async () => {
//   let fcmToken = await AsyncStorage.getItem('fcmToken');

//   if (!fcmToken) {
    
//     fcmToken = await firebase.messaging().getToken();
//     if (fcmToken) {
//       // user has a device token
//       await AsyncStorage.setItem('fcmToken', fcmToken);
//     }
//     return fcmToken;
//   }
// };

// export const getsfcmToken = async () => {
//   const fcmToken = await AsyncStorage.getItem('fcmToken');
//   // user has a device token

//   return fcmToken;
// };


