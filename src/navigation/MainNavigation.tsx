import {RootState} from '@/BrokerAppCore/redux/store/reducers';
import {NavigationContainer} from '@react-navigation/native';
import {useEffect} from 'react';
import {useSelector} from 'react-redux';
import HomeNavigation from './HomeNavigation';
import AuthStackNavigation from './AuthStackNavigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';

interface MainNavigationProps {
  loggedIn: boolean;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const MainNavigation: React.FC<MainNavigationProps> = ({
  loggedIn,
  setLoggedIn,
}) => {
  const appuser = useSelector((state: RootState) => state.user.user);
  const isLoggedIn = useSelector(
    (state: RootState) => state.user.user !== null,
  );

  useEffect(() => {
    console.log('isLoggedIn', isLoggedIn);
  }, [isLoggedIn]);

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
