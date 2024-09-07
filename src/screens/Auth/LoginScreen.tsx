import {Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
interface LoginProps {
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  loggedIn: boolean;
}
const LoginScreen: React.FC<LoginProps> = ({setLoggedIn}) => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <Text>Login</Text>
    </SafeAreaView>
  );
};

export default LoginScreen;
