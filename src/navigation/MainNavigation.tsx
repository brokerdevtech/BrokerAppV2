import { RootState } from "@/BrokerAppcore/redux/store/reducers";
import { NavigationContainer } from "@react-navigation/native";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import HomeNavigation from "./HomeNavigation";
import AuthStackNavigation from "./AuthStackNavigation";

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
     
      
    }, []);
  
    return (
      <NavigationContainer
       >
        {isLoggedIn ? (
       
          
            <HomeNavigation />
      
        ) : (
          <AuthStackNavigation loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
        )}
      </NavigationContainer>
    );
  };
  
  export default MainNavigation;
  