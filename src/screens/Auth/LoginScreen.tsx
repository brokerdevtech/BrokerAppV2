
import FullScreenSkeleton from "../../sharedComponents/Skeleton/FullScreenSkeleton";
import AppPageContainer from "../../hoc/AppPageContainer";
import { useRef } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";

import { Skeleton } from "@/components/ui/skeleton";
import { VStack } from "@/components/ui/vstack";

interface LoginProps {
    setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    loggedIn: boolean;
  }
const LoginScreen: React.FC<LoginProps> = ({setLoggedIn}) => {
  const containerRef = useRef();
  
    return (
 
      <AppPageContainer  ref={containerRef}>


      <View>
    
      <Text>Login</Text>
   
 
      </View></AppPageContainer>
    );
  };
  const styles = StyleSheet.create({
    wrapper: {
     display:'flex',
     flexDirection:'column'
    },
  });
  
  export default LoginScreen;