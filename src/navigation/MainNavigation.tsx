import {RootState} from '@/BrokerAppCore/redux/store/reducers';
import {NavigationContainer} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import HomeNavigation from './HomeNavigation';
import AuthStackNavigation from './AuthStackNavigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet'
interface MainNavigationProps {
  loggedIn: boolean;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const MainNavigation: React.FC<MainNavigationProps> = ({
  loggedIn,
  setLoggedIn,
}) => {
  const appuser = useSelector((state: RootState) => state.user);

const [isLoggedIn, setisLoggedIn] = useState(false);


  useEffect(() => {
    if(appuser.user==null)
    {setisLoggedIn(false) }
    else{
      setisLoggedIn(true)
    }
  
  }, [appuser]);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
    
        {isLoggedIn ? (
          <HomeNavigation />
        ) : (
          <AuthStackNavigation loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
        )}
       
      </NavigationContainer>

    </SafeAreaProvider>
  );
};

export default MainNavigation;
