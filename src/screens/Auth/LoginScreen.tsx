import { Text, View } from "react-native";
interface LoginProps {
    setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    loggedIn: boolean;
  }
const LoginScreen: React.FC<LoginProps> = ({setLoggedIn}) => {
 
  
    return (
      <View style={{flex: 1}}>
      <Text>Login</Text>
      </View>
    );
  };

  
  export default LoginScreen;