
import AppPageContainer from "../../hoc/AppPageContainer";
import { useRef } from "react";
import { Text, View } from "react-native";
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

  
  export default LoginScreen;