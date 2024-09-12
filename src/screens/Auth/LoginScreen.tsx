/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */

import {Image, StyleSheet, Text} from 'react-native';
import {Button, ButtonIcon, ButtonText} from '@/components/ui/button';

import ZSafeAreaView from '@/src/sharedComponents/ZSafeAreaView';
import {useNavigation} from '@react-navigation/native';
import {VStack} from '@/components/ui/vstack';
import {Box} from '@/components/ui/box';

import React from 'react';

import {FaceBookIcon, GoogleIcon} from '@/src/assets/customicons/authicons';

import LoginModal from './LoginModal';
import CustomHeader from '@/src/sharedComponents/CustomHeader';
import AppPageContainer from '@/src/hoc/AppPageContainer';
interface LoginProps {
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  loggedIn: boolean;
}
const LoginScreen : React.FC<LoginProps> = ({setLoggedIn}) => {
  const navigation = useNavigation();
  const [showActionsheet, setShowActionsheet] = React.useState(false);
  const handleClose = () => setShowActionsheet(false);
  return (
    <ZSafeAreaView style={styles.container}>
      <CustomHeader></CustomHeader>

      <VStack space="lg">
        <Box style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require('../../assets/images/BA.png')}
          />
        </Box>

        <Box style={styles.headingContainer}>
          <Text style={styles.headingText}>Log in to BrokerApp</Text>
        </Box>

        <VStack space="md" style={styles.buttonContainer}>
          <Button variant="outline" style={styles.button}>
            <ButtonIcon as={FaceBookIcon} />
            <ButtonText style={styles.buttonText}>
              Continue with Facebook
            </ButtonText>
          </Button>

          <Button variant="outline" style={styles.button}>
            <ButtonIcon as={GoogleIcon} />
            <ButtonText style={styles.buttonText}>
              Continue with Google
            </ButtonText>
          </Button>

          <Button
            variant="outline"
            style={styles.button}
            onPress={() => setShowActionsheet(true)}>
            <ButtonText style={styles.buttonText}>
              Continue with Email
            </ButtonText>
          </Button>
          <LoginModal
            showActionsheet={showActionsheet}
            handleClose={handleClose}
            setLoggedIn={setLoggedIn}
          />
        </VStack>

        <Box style={styles.footerContainer}>
          <Text style={styles.footerText}>
            Don’t have an account?
            <Text style={styles.footerLinkText}> Create one</Text>
          </Text>
          <Text style={styles.termsText}>
            By logging in I agree to the{' '}
            <Text style={styles.linkText}>Terms and Conditions</Text> and{' '}
            <Text style={styles.linkText}>Privacy Policy</Text>.
          </Text>
        </Box>
      </VStack>
    </ZSafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 96, // 24 * 4
    height: 96,
    resizeMode: 'contain',
  },
  headingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  headingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4a4a4a',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 30,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    // paddingVertical: 12,
    marginBottom: 15,
    height: 50,
  },
  buttonText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#000',
  },
  footerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    paddingHorizontal: 30,
  },
  footerText: {
    fontSize: 14,
    color: '#808080',
  },
  footerLinkText: {
    color: '#e53935',
    fontWeight: 'bold',
  },
  termsText: {
    fontSize: 12,
    color: '#a0a0a0',
    marginTop: 10,
    textAlign: 'center',
  },
  linkText: {
    color: '#1e88e5',
  },
});
export default LoginScreen;
