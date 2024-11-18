import {RootState} from '@/BrokerAppCore/redux/store/reducers';
import {NavigationContainer, NavigationContainerRef, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import HomeNavigation from './HomeNavigation';
import AuthStackNavigation from './AuthStackNavigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import notifee, {EventType} from '@notifee/react-native';
import dynamicLinks from '@react-native-firebase/dynamic-links';
interface MainNavigationProps {
  loggedIn: boolean;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}
const navigationContainerRef = React.createRef<NavigationContainerRef>();
notifee.onBackgroundEvent(async ({detail, type}) => {
  if (type === EventType.PRESS) {
    if (Object.keys(detail.notification.data).length === 0) {
      navigationContainerRef.current?.navigate('Notification');
    } else {
      const channelId = detail.notification?.data?.channel_id;
      navigationContainerRef.current?.navigate('AppChat');
    }
    await Promise.resolve();
  }
});
const linking = {
  prefixes: [
    'brokerapp://',
    'https://www.brokerapp.com',
    'https://brokerapp.com',
  ],
  config: {
    screens: {

      ItemDetailScreen: 'ItemDetailScreen/:postId/:postType',
      ProfileDetail: 'ProfileDetails/:userId',

    },
  },
};
// const HandleDeepLinking = () => {
//   const {navigate} = useNavigation();

//   // const handleDynamicLinks = async link => {
//   //   console.log(link ,'Linking');
//   //   try {
//   //     const lastSegment = link.url.split('/').pop();
//   //     if (link.url.includes('postdetail')) {
//   //       navigate('ItemDetailScreen', {postId: lastSegment });
//   //     }else {
//   //       navigate('ProfileDetail', {userId: lastSegment});
//   //     }
//   //   } catch (error) {
//   //     console.error('Error handling dynamic link:', error);
//   //   }
//   // };

//   useEffect(() => {
//     dynamicLinks()
//       .getInitialLink()
//       .then(link => {
//         if (link) {handleDynamicLinks(link);}
//       });

//     const unsubscribe = dynamicLinks().onLink(handleDynamicLinks);
//     console.log(unsubscribe());
//     return () => unsubscribe();
//   }, []);

//   return null;
// };
const MainNavigation: React.FC<MainNavigationProps> = ({
  loggedIn,
  setLoggedIn,
}) => {
  const appuser = useSelector((state: RootState) => state.user);

const [isLoggedIn, setisLoggedIn] = useState(false);


  useEffect(() => {
    if(appuser.user == null)
    {setisLoggedIn(false); }
    else{
      setisLoggedIn(true);
    }

  }, [appuser]);

  return (
    <SafeAreaProvider>
      <NavigationContainer
       linking={linking}
       ref={navigationContainerRef}
      >

        {isLoggedIn ? (
          <>
          
           <HomeNavigation />
          </>

        ) : (
          <AuthStackNavigation loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
        )}

      </NavigationContainer>

    </SafeAreaProvider>
  );
};

export default MainNavigation;
