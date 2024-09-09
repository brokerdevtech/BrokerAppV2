
import FullScreenSkeleton from "../../sharedComponents/Skeleton/FullScreenSkeleton";
import AppPageContainer from "../../hoc/AppPageContainer";
import { useRef } from "react";
import {  Image, Pressable, StyleSheet, Text, View } from "react-native";

import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";

import { Skeleton } from "@/components/ui/skeleton";
import { VStack } from "@/components/ui/vstack";
import { useApiRequest } from "@/src/hooks/useApiRequest ";
import { login } from "@/BrokerAppcore/services/new/authService";
import { createIcon } from "@gluestack-ui/icon";
import { Icon } from "@/components/ui/icon";
import { Path, Rect } from "react-native-svg";

import {Back} from '../../assets/svg';
import { GoogleIcon } from "@/src/sharedComponents/appIcon";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";







interface LoginProps {
    setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    loggedIn: boolean;
  }
const LoginScreen: React.FC<LoginProps> = ({setLoggedIn}) => {
  const containerRef = useRef();
  

  const handleLoading = (isLoading: boolean) => {
    // if(containerRef.current)
    // {
    //   // containerRef.current.setLoader();


    // }
  };

  // Pass the handleLoading function to the hook
  const { data, error, execute } = useApiRequest(login, handleLoading);
  const K = () => {
    return (
      <Icon as={GoogleIcon} size="xl" className="text-typography-black" />
    );
  };

    return (
 
      // <AppPageContainer  ref={containerRef}>


      <View>
      {/* <Icon as={GluestackIcon} size="xl" className="text-typography-black" /> */}
      <Text>Login</Text>
      <Icon as={GoogleIcon} size="xl" className="text-typography-black" />
      <Button variant="outline" >
            <ButtonIcon as={K} />
            <ButtonText >
              Continue with Google
            </ButtonText>
          </Button>
      </View>
      
      // </AppPageContainer>
    );
  };
  const styles = StyleSheet.create({
    wrapper: {
     display:'flex',
     flexDirection:'column'
    },
  });
  
  export default LoginScreen;