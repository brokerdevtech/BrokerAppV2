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
import {getfcmToken, storeTokens, storeUser} from '../../utils/utilTokens';
import {setUser} from '../../../BrokerAppCore/redux/store/user/userSlice';
import store from '../../../BrokerAppCore/redux/store';
import {setTokens} from '../../../BrokerAppCore/redux/store/authentication/authenticationSlice';
import {useApiRequest} from '../../hooks/useApiRequest';
import {
  ForgotPassword,
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
import {Box} from '../../../components/ui/box';
import ZText from '../../sharedComponents/ZText';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required('Email is required')
    .email('Please enter a valid email'),
  phone: Yup.string()
    .required('Phone number is required')
    .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
});
interface LoginProps {
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  loggedIn: boolean;
}
const ForgotPasswordScreen: React.FC<LoginProps> = ({setLoggedIn}) => {
  const [loading, setLoading] = React.useState(false);
  const [toastId, setToastId] = React.useState(0);
  const navigation = useNavigation();
  const toast = useToast();
  const {data, status, error, execute} = useApiRequest(
    ForgotPassword,
    setLoading,
  );
  useEffect(() => {
    if (status === 200 && !error) {
      if (!toast.isActive(toastId)) {
        const newId = Math.random();
        setToastId(newId);
        toast.show({
          id: newId,
          placement: 'bottom',
          duration: 3000,
          render: ({id}) => {
            return (
              <Toast nativeID={`toast-${id}`} action="muted" variant="solid">
                <ToastDescription>
                  New password has been sent to your email
                </ToastDescription>
              </Toast>
            );
          },
        });
      }
      navigation.navigate('Login');
    } else if (status && status !== 200) {
      if (!toast.isActive(toastId)) {
        const newId = Math.random();
        setToastId(newId);
        toast.show({
          id: newId,
          placement: 'bottom',
          duration: 3000,
          render: ({id}) => {
            return (
              <Toast nativeID={`toast-${id}`} action="muted" variant="solid">
                <ToastDescription>
                  Please enter correct EmailAddress & ContactNo
                </ToastDescription>
              </Toast>
            );
          },
        });
      }
    }
  }, [status, error, toastId]);

  const handleSubmit = async values => {
    await execute(values.email, values.phone);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Forgot Password</Text>
      <Text style={styles.subHeader}>
        Please enter your credentials to access your account and details
      </Text>

      <Formik
        initialValues={{
          email: '',
          phone: '',
        }}
        validationSchema={validationSchema}
        onSubmit={values => {
          handleSubmit(values);
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
            {/* Email Input */}
            <Text style={styles.label}>Email</Text>
            <Input style={styles.input}>
              <InputField
                type="text"
                placeholder="Enter your email"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
              />
            </Input>
            {errors.email && touched.email && (
              <Box>
                <ZText type="R12" style={styles.errorText}>
                  {errors.email}
                </ZText>
              </Box>
            )}

            {/* Phone Input */}
            <Text style={styles.label}>Mobile</Text>
            <Input style={styles.input}>
              <InputField
                placeholder="Enter your phone number"
                onChangeText={handleChange('phone')}
                onBlur={handleBlur('phone')}
                value={values.phone}
                keyboardType="phone-pad"
              />
            </Input>
            {errors.phone && touched.phone && (
              <Text style={styles.errorText}>{errors.phone}</Text>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.signInButton,
                !isValid ? styles.disabledButton : null,
              ]}
              disabled={!isValid}
              onPress={handleSubmit}>
              <Text style={styles.signInText}>Submit</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>

      <Text style={styles.footerText}>
        Already have an account?{' '}
        <Text
          style={styles.signUpText}
          onPress={() => navigation.navigate('Login')}>
          Sign In
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
    marginBottom: 50,
    marginTop: 56,
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

export default ForgotPasswordScreen;
