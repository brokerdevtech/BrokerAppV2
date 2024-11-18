/* eslint-disable no-catch-shadow */
import React, {useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {Color, GilroyFontFamily} from '../../styles/GlobalStyles';
import {
  Input,
  InputField,
  InputIcon,
  InputSlot,
} from '../../../components/ui/input';
import {EyeIcon, EyeOffIcon, Icon} from '../../../components/ui/icon';
import {AppleIcon, FBIcon, GoogleIcon} from '../../assets/svg';
import {clearTokensfcmToken, getfcmToken, storeTokens, storeUser} from '../../utils/utilTokens';
import {setUser} from '../../../BrokerAppCore/redux/store/user/userSlice';
import store from '../../../BrokerAppCore/redux/store';
import {setTokens} from '../../../BrokerAppCore/redux/store/authentication/authenticationSlice';
import {useApiRequest} from '../../hooks/useApiRequest';
import {
  login,
  SocialLogin,
} from '../../../BrokerAppCore/services/new/authService';
import {Toast, ToastDescription, useToast} from '../../../components/ui/toast';
import {useNavigation} from '@react-navigation/native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {useSelector} from 'react-redux';
import {RootState} from '../../../BrokerAppCore/redux/store/reducers';
import {handleApiError} from '../../../BrokerAppCore/services/new/ApiResponse';
import { NewDeviceUpdate } from '../../../BrokerAppCore/services/authService';

// Configure Google Sign-In
// GoogleSignin.configure({
//   webClientId:
//     '291590546828-c6i0jsih7jphgfoe3ej1tgvangloc5h5.apps.googleusercontent.com', // From the Google Developer Console
//   offlineAccess: true,

 
//   // iosClientId:'291590546828-ll1pnno0vmbog94lkhfvkoda38lf93sg.apps.googleusercontent.com',
// });

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId:
    '291590546828-c6i0jsih7jphgfoe3ej1tgvangloc5h5.apps.googleusercontent.com', // From the Google Developer Console
  offlineAccess: true,
  forceCodeForRefreshToken:true
  // iosClientId:'291590546828-ll1pnno0vmbog94lkhfvkoda38lf93sg.apps.googleusercontent.com',
});
// Validation schema using Yup
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .required('UserName is required')
    .matches(
      /^(?:\d{10}|[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,4})$/,
      'Please enter a valid email',
    ),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
});
interface LoginProps {
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  loggedIn: boolean;
}
const LoginScreen: React.FC<LoginProps> = ({setLoggedIn}) => {
  const AppLocation = useSelector((state: RootState) => state.AppLocation);
  const [showPassword, setShowPassword] = React.useState(false);
  const [toastId, setToastId] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const isGuest = false;
  const toast = useToast();
  const navigation = useNavigation();
  const handleState = () => {
    setShowPassword(showState => {
      return !showState;
    });
  };
  const clearGoogleSignInCache = async () => {
    try {
      // First check if Google Play Services are available
      await GoogleSignin.hasPlayServices();

      // Then check if user is signed in
      const isSignedIn = await GoogleSignin.hasPreviousSignIn();

      if (isSignedIn) {
        try {
          await GoogleSignin.revokeAccess();
          await GoogleSignin.signOut();
        } catch (signOutError) {
          console.error('Error signing out:', signOutError);
          // Continue with sign in even if sign out fails
        }
      }
    } catch (error) {
      console.error('Error checking Google Sign-In status:', error);
      // Don't throw error, just log it and continue with sign in
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();

      // Try to clear cache but don't let it block sign in if it fails
   await clearGoogleSignInCache().catch(console.error);




      const userInfo = await GoogleSignin.signIn();

      const fcmToken = await getfcmToken();

      // if (!userInfo.data?.user ) {
      //   throw new Error('Failed to get user email from Google Sign In');
      // }

      await SocialLoginexecute(
        userInfo.data?.user.email,
        'Google',
        userInfo.data?.idToken,
        fcmToken?.toString(),
        AppLocation.City,
        AppLocation.State,
        AppLocation.Country,
        AppLocation.placeID,
        AppLocation.placeName,
        AppLocation.geoLocationLatitude,
        AppLocation.geoLocationLongitude,
        AppLocation.viewportNorthEastLat,
        AppLocation.viewportNorthEastLng,
        AppLocation.viewportSouthWestLat,
        AppLocation.viewportSouthWestLng,
      );
    } catch (error) {
      console.error( error);
      setLoading(false);
      console.error('Google Sign In Error:', error);

      let errorMessage = 'Failed to sign in with Google';
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        errorMessage = 'Sign in cancelled';
      } else if (error.code === statusCodes.IN_PROGRESS) {
        errorMessage = 'Sign in already in progress';
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        errorMessage = 'Google Play Services not available';
      }

      toast.show({
        id: Math.random(),
        placement: 'bottom',
        duration: 3000,
        render: ({id}) => (
          <Toast nativeID={`toast-${id}`} action="error" variant="solid">
            <ToastDescription>{errorMessage}</ToastDescription>
          </Toast>
        ),
      });
    }
  };

  const {data, status, error, execute} = useApiRequest(login, setLoading);
  const {
    data: SocialLogindata,
    status: SocialLoginstatus,
    error: SocialLoginerror,
    execute: SocialLoginexecute,
  } = useApiRequest(SocialLogin, setLoading);
  const handleLogin = async values => {
    // console.log(values, 'values');
    const {email, password} = values;
    setLoading(true);
    await execute(email, password);
    setLoading(false);
   
  };
  const updateDevice = async (userId: any) => {
    //
    console.log('updateDevice')
    console.log(userId)
    await clearTokensfcmToken();
    const fcmToken: any = await getfcmToken();
    console.log('fcmToken===================')
    console.log(fcmToken);
    const updateDevice = await NewDeviceUpdate(userId, fcmToken.toString());
  };
  useEffect(() => {
    if (error) {
      if (!toast.isActive(toastId)) {
        const newId = Math.random();
        setToastId(newId);
        toast.show({
          id: newId,
          placement: 'bottom',
          duration: 3000,
          render: ({id}) => {
            const uniqueToastId = 'toast-' + id;
            return (
              <Toast nativeID={uniqueToastId} action="muted" variant="solid">
                <ToastDescription>
                  {'Please check Username or Password'}
                </ToastDescription>
              </Toast>
            );
          },
        });
      }
    }
  }, [error]);
  const afterhandleLogin = async () => {
    setLoading(true);
    if (data) {
    
      const storeUserresult = await storeUser(JSON.stringify(data.data));
      const storeTokensresult = await storeTokens(
        data.data.accessToken,
        data.data.refreshToken,
        data.data.getStreamAccessToken,
      );
      await store.dispatch(setUser(data.data));
      await store.dispatch(
        setTokens({
          accessToken: data.data.accessToken,
          refreshToken: data.data.refreshToken,
          getStreamAccessToken: data.data.getStreamAccessToken,
        }),
      );
      await   updateDevice(data.data.userId);
      setLoggedIn(true);
      setLoading(false);
      navigation.navigate('Home');
      if (!toast.isActive(toastId)) {
        const newId = Math.random();
        setToastId(newId);
        toast.show({
          id: newId,
          placement: 'bottom',
          duration: 3000,
          render: ({id}) => {
            const uniqueToastId = 'toast-' + id;
            return (
              <Toast nativeID={uniqueToastId} action="muted" variant="solid">
                <ToastDescription>Login Success</ToastDescription>
              </Toast>
            );
          },
        });
      }
    }
  };
  const afterhandleSocialLogin = async () => {
    if (SocialLogindata) {
      const storeUserresult = await storeUser(
        JSON.stringify(SocialLogindata.data),
      );
      const storeTokensresult = await storeTokens(
        SocialLogindata.data.accessToken,
        SocialLogindata.data.refreshToken,
        SocialLogindata.data.getStreamAccessToken,
      );
      await store.dispatch(setUser(SocialLogindata.data));
      await store.dispatch(
        setTokens({
          accessToken: SocialLogindata.data.accessToken,
          refreshToken: SocialLogindata.data.refreshToken,
          getStreamAccessToken: SocialLogindata.data.getStreamAccessToken,
        }),
      );

      setLoggedIn(true);

      navigation.navigate('Home');
      if (!toast.isActive(toastId)) {
        const newId = Math.random();
        setToastId(newId);
        toast.show({
          id: newId,
          placement: 'bottom',
          duration: 3000,
          render: ({id}) => {
            const uniqueToastId = 'toast-' + id;
            return (
              <Toast nativeID={uniqueToastId} action="muted" variant="solid">
                <ToastDescription>Login Success</ToastDescription>
              </Toast>
            );
          },
        });
      }
    }
  };
  useEffect(() => {
    if (SocialLogindata) {
      afterhandleSocialLogin();
      // Proceed with storing tokens and user data
    }
    setLoading(false);
  }, [SocialLogindata]);
  useEffect(() => {
    if (data) {
      afterhandleLogin();
      // Proceed with storing tokens and user data
    }
  }, [data]);
  useEffect(() => {
    if (SocialLoginerror) {
      setLoading(false);

      if (!toast.isActive(toastId)) {
        const newId = Math.random();
        setToastId(newId);
        toast.show({
          id: newId,
          placement: 'bottom',
          duration: 3000,
          render: ({id}) => {
            const uniqueToastId = 'toast-' + id;
            return (
              <Toast nativeID={uniqueToastId} action="muted" variant="solid">
                <ToastDescription>{SocialLoginerror}</ToastDescription>
              </Toast>
            );
          },
        });
      }
    }
  }, [SocialLoginerror]);
  // console.log(SocialLoginstatus, 'jdk');
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login Account</Text>
      <Text style={styles.subHeader}>
        Please enter your credentials to access your account and details
      </Text>

      <Formik
        initialValues={{email: '', password: ''}}
        validationSchema={LoginSchema}
        validateOnMount={true}
        onSubmit={values => {
          handleLogin(values); // Handle login logic here
        }}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isValid,
        }) => (
          <View>
            <Text style={styles.label}>Email</Text>
            <Input style={styles.input}>
              <InputField
                type="text"
                placeholder="Enter your email"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </Input>
            {errors.email && touched.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}

            {/* Password Input */}
            <Text style={styles.label}>Password</Text>

            <Input style={styles.input}>
              <InputField
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter Password"
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
              />
              <InputSlot style={{paddingRight: 10}} onPress={handleState}>
                {/* EyeIcon, EyeOffIcon are both imported from 'lucide-react-native' */}
                <InputIcon
                  as={showPassword ? EyeIcon : EyeOffIcon}
                  className="text-darkBlue-500"
                  stroke="#000"
                />
              </InputSlot>
            </Input>
            {errors.password && touched.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            {/* Forgot Password */}
            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.signInButton,
                !isValid ? styles.disabledButton : null,
              ]}
              disabled={!isValid}
              onPress={handleSubmit}>
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
      <TouchableOpacity
        style={[styles.signInButton]}
        onPress={() => {
          navigation.navigate('GuestHome');
        }}>
        <Text style={styles.signInText}>Continue As Guest</Text>
      </TouchableOpacity>
      {/* Social Media Sign In Options */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginBottom: 30,
        }}>
        <View style={styles.frameChild} />
        <Text style={styles.textTypo}>Or sign in with</Text>
        <View style={styles.frameChild} />
      </View>

      <View style={styles.socialContainer}>
        {/* <TouchableOpacity style={styles.socialButton}>
          <Icon as={AppleIcon} stroke="#000" />
        </TouchableOpacity> */}
        <TouchableOpacity
          style={styles.socialButton}
          onPress={signInWithGoogle}>
          <Icon as={GoogleIcon} />
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.socialButton}>
          <Icon as={FBIcon} />
        </TouchableOpacity> */}
      </View>

      {/* Sign Up Option */}
      <Text style={styles.footerText}>
        Don't have an account?{' '}
        <Text
          style={styles.signUpText}
          onPress={() => {
      
            navigation.navigate('Register');
          }}>
          Sign Up
        </Text>
      </Text>

      {loading && (
        <Modal transparent={true} animationType="fade">
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={Color.primary} />
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  frameChild: {
    backgroundColor: '#7c8091',
    borderStyle: 'solid',
    borderColor: '#e2ebff',
    borderTopWidth: 1,
    width: 75,
    height: 1,
  },

  header: {
    fontSize: 24,

    paddingHorizontal: 56,
    textAlign: 'center',
    fontFamily: GilroyFontFamily.GilroyRegular,
    marginVertical: 10,
  },
  subHeader: {
    fontSize: 14,
    paddingHorizontal: 56,
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: GilroyFontFamily.GilroyRegular,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderWidth: 0,
    borderColor: '#ddd',
    borderRadius: 5,
    // padding: 10,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    height: 43,
  },
  disabledButton: {
    backgroundColor: '#aaa', // Change color when disabled
  },
  errorText: {
    fontSize: 12,
    color: Color.primary,
    marginBottom: 10,
  },
  forgotPassword: {
    color: Color.primary,
    textAlign: 'right',
    marginBottom: 20,
    // textDecorationLine: 1,
  },
  signInButton: {
    backgroundColor: Color.primary,
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 40,
    // marginTop: 56,
  },
  signInText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orText: {
    textAlign: 'center',
    marginBottom: 40,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  socialButton: {
    backgroundColor: '#fff',
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  footerText: {
    textAlign: 'center',
  },
  signUpText: {
    color: Color.primary,
    fontWeight: 'bold',
  },
  textTypo: {
    fontFamily: GilroyFontFamily.GilroyRegular,
    color: Color.secondryTextColor,
    // fontSize: FontSize.size_xs,
    textAlign: 'center',
    bottom: 8,
  },
  parentPosition: {
    left: '50%',
    top: '10%',
    position: 'absolute',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background to highlight the loader
  },
});

export default LoginScreen;
