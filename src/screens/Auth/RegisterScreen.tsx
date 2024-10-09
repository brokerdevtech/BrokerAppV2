import React, {useEffect, useMemo, useState} from 'react';

import {VStack} from '../../../components/ui/vstack';

import {Input, InputField} from '../../../components/ui/input';
import {useApiRequest} from '../../../src/hooks/useApiRequest';
import {Formik} from 'formik';
import {useNavigation} from '@react-navigation/native';
import {getBrokerCategoryList} from '../../../BrokerAppCore/services/new/authService';
import {
  ActivityIndicator,
  Keyboard,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {storeTokens, storeUser} from '../../../src/utils/utilTokens';
import store from '../../../BrokerAppCore/redux/store';
import {setUser} from '../../../BrokerAppCore/redux/store/user/userSlice';
import {setTokens} from '../../../BrokerAppCore/redux/store/authentication/authenticationSlice';

import {CheckIcon, CircleIcon, Icon} from '@/components/ui/icon';

import * as yup from 'yup';
import UserRegistration from '../../../BrokerAppCore/types/userRegistration';
import {Color, GilroyFontFamily} from '../../styles/GlobalStyles';
import {InputIcon, InputSlot} from '../../../components/ui/input';
import {
  ChevronDownIcon,
  EyeIcon,
  EyeOffIcon,
} from '../../../components/ui/icon';
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from '../../../components/ui/select';

import {useSelector} from 'react-redux';

import RadioGroup from '../../sharedComponents/RadioGroup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getfcmToken} from '../../utils/utilTokens';
import DeviceInfo from 'react-native-device-info';
import {signup} from '../../../BrokerAppCore/services/new/authService';
import {Toast, ToastDescription, useToast} from '../../../components/ui/toast';
const CustomCheckbox = ({label, checked, onChange}) => {
  return (
    <TouchableOpacity
      onPress={() => onChange(!checked)}
      style={styles.checkboxContainer}
      activeOpacity={0.8}>
      <View style={[styles.checkbox, checked && styles.checked]}>
        {checked && <Icon as={CheckIcon} stroke="#fff" />}
      </View>
      <Text style={styles.Checklabel}>{label}</Text>
    </TouchableOpacity>
  );
};

const validationSchema = yup.object().shape({
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is required'),
  email: yup
    .string()
    .matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/, 'Invalid email')
    .required('Email is required'),
  phoneNumber: yup
    .string()
    .required('Phone Number is required')
    .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
    .test(
      'not-starting-with-zero',
      'Phone number must not start with 0',
      value => value && value[0] !== '0',
    ),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    ),
  confirmPassword: yup
    .string()
    .required('Confirm password is required')
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
  BrokerCategory: yup.number().required('Required'),

  acceptTerms: yup
    .boolean()
    .oneOf([true], 'You must accept the terms and privacy policy'),
});

export default function RegisterScreen({setLoggedIn}) {
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setConfirmShowPassword] = React.useState(false);
  const [selecteRadioId, setSelectedRadioId] = useState('1');
  const [toastId, setToastId] = React.useState(0);
  const toast = useToast();
  const AppLocation = useSelector((state: RootState) => state.AppLocation);
  const navigation = useNavigation();
  const radioButtons = useMemo(
    () => [
      {
        id: '1', // acts as primary key, should be unique and non-empty string
        label: 'Individual',
        value: 'individual',
      },
      {
        id: '2',
        label: 'Organization',
        value: 'organization',
      },
    ],
    [],
  );
  const handleStateConfirm = () => {
    setConfirmShowPassword(showState => {
      return !showState;
    });
  };
  const showToast = message => {
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
              <ToastDescription>{message}</ToastDescription>
            </Toast>
          );
        },
      });
    }
  };
  const {
    data: categorydata,
    status: categorystatus,
    error: categoryerror,
    execute: categoryexecute,
  } = useApiRequest(getBrokerCategoryList, setLoading);
  const {
    data: registerdata,
    status: registerstatus,
    error: registererror,
    execute: registerexecute,
  } = useApiRequest(signup, setLoading);

  const fetchCategoryData = async () => {
    await categoryexecute();
  };

  useEffect(() => {
    fetchCategoryData();
  }, []);

  // Toggle password visibility
  const handleState = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (values, broker) => {
    try {
      Keyboard.dismiss();
      setLoading(true); // Uncomment when handling loading state

      await AsyncStorage.removeItem('fcmToken');
      const deviceId = await DeviceInfo.getUniqueId();
      const fcmToken = await getfcmToken();

      let user: UserRegistration = {
        email: values.email,
        contactNo: values.phoneNumber,
        password: values.password,
        confirmPassword: values.confirmPassword,
        firstName: values.firstName,
        lastName: values.lastName,
        cityName: AppLocation.City,
        stateName: AppLocation.State,
        countryName: AppLocation.Country,
        placeID: AppLocation.placeID,
        placeName: AppLocation.placeName,
        geoLocationLatitude: AppLocation.geoLocationLatitude,
        geoLocationLongitude: AppLocation.geoLocationLongitude,
        viewportNorthEastLat: AppLocation.viewportNorthEastLat,
        viewportNorthEastLng: AppLocation.viewportNorthEastLng,
        viewportSouthWestLat: AppLocation.viewportSouthWestLat,
        viewportSouthWestLng: AppLocation.viewportSouthWestLng,
        deviceId: fcmToken.toString(),
        brokerCategorId: values.BrokerCategory,
        isOrg: values.organizationType == '1' ? false : true,
      };

      // console.log(user);

      await registerexecute(user);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    } finally {
      setLoading(false); // Uncomment when handling loading state
    }
  };
  // console.log(AppLocation);
  useEffect(() => {
    const createuser = async () => {
      try {
        if (registerdata) {
          await storeUser(JSON.stringify(registerdata.data));
          await storeTokens(
            registerdata.data.accessToken,
            registerdata.data.refreshToken,
            registerdata.data.getStreamAccessToken,
          );
          await store.dispatch(setUser(registerdata.data));
          await store.dispatch(
            setTokens({
              accessToken: registerdata.data.accessToken,
              refreshToken: registerdata.data.refreshToken,
              getStreamAccessToken: registerdata.data.getStreamAccessToken,
            }),
          );

          setLoggedIn(true);
          navigation.navigate('Home');
          showToast(registerdata.statusMessage);
        }
      } catch (error) {
        console.log(error);
      }
    };
    createuser();
  }, [registerdata]);
  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}} style={styles.container}>
      <Text style={styles.header}>Create An Account</Text>
      <Text style={styles.subHeader}>
        Please enter your credentials to access your account and details
      </Text>

      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          password: '',
          confirmPassword: '',
          BrokerCategory: 1,
          organizationType: '1',
          acceptTerms: false,
        }}
        validationSchema={validationSchema}
        validateOnMount={true}
        onSubmit={handleSubmit}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isValid,
          setFieldValue,
        }) => (
          <View>
            {/* First Name */}
            <Text style={styles.label}>First Name</Text>
            <Input style={styles.input}>
              <InputField
                placeholder="Enter your First Name"
                onChangeText={handleChange('firstName')}
                onBlur={handleBlur('firstName')}
                value={values.firstName}
              />
            </Input>
            {errors.firstName && touched.firstName && (
              <Text style={styles.errorText}>{errors.firstName}</Text>
            )}

            {/* Last Name */}
            <Text style={styles.label}>Last Name</Text>
            <Input style={styles.input}>
              <InputField
                placeholder="Enter your Last Name"
                onChangeText={handleChange('lastName')}
                onBlur={handleBlur('lastName')}
                value={values.lastName}
              />
            </Input>
            {errors.lastName && touched.lastName && (
              <Text style={styles.errorText}>{errors.lastName}</Text>
            )}

            {/* Email */}
            <Text style={styles.label}>Email</Text>
            <Input style={styles.input}>
              <InputField
                placeholder="Enter your Email"
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

            {/* Mobile */}
            <Text style={styles.label}>Mobile</Text>
            <Input style={styles.input}>
              <InputField
                placeholder="Enter your Phone Number"
                onChangeText={handleChange('phoneNumber')}
                onBlur={handleBlur('phoneNumber')}
                value={values.phoneNumber}
                keyboardType="phone-pad"
              />
            </Input>
            {errors.phoneNumber && touched.phoneNumber && (
              <Text style={styles.errorText}>{errors.phoneNumber}</Text>
            )}

            {/* Password */}
            <Text style={styles.label}>Password</Text>
            <Input style={styles.input}>
              <InputField
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter Password"
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
              />
              <InputSlot onPress={handleState}>
                <InputIcon
                  as={showPassword ? EyeIcon : EyeOffIcon}
                  stroke="#000"
                />
              </InputSlot>
            </Input>
            {errors.password && touched.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            {/* Confirm Password */}
            <Text style={styles.label}>Confirm Password</Text>
            <Input style={styles.input}>
              <InputField
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                value={values.confirmPassword}
              />
              <InputSlot onPress={handleStateConfirm}>
                <InputIcon
                  as={showConfirmPassword ? EyeIcon : EyeOffIcon}
                  stroke="#000"
                />
              </InputSlot>
            </Input>
            {errors.confirmPassword && touched.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}

            {/* Category Selection */}
            <Text style={styles.label}>Select Category</Text>
            <Select
              selectedValue={'Real Estate Sector'}
              onValueChange={(selectedValue: any) => {
                console.log('Selected category ID:', selectedValue); // Log the category ID
                setFieldValue('BrokerCategory', selectedValue);
                handleBlur('BrokerCategory');
              }}>
              <SelectTrigger variant="outline" size="md" style={styles.input}>
                <SelectInput placeholder="Select option" />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  {categorydata?.data?.categories.map((item, index) => (
                    <SelectItem
                      key={index} // Ensure to add a key to avoid warnings
                      label={item.categoryName}
                      value={item.categoryId} // This ensures the categoryId is passed as selectedValue
                    />
                  ))}
                </SelectContent>
              </SelectPortal>
            </Select>

            {errors.BrokerCategory && touched.BrokerCategory && (
              <Text style={styles.errorText}>{errors.BrokerCategory}</Text>
            )}

            {/* Radio Group */}
            <RadioGroup
              radioButtons={radioButtons}
              // onPress={setSelectedRadioId}
              selectedId={selecteRadioId}
              layout="row"
              onPress={value => {
                setSelectedRadioId(value);
                setFieldValue('organizationType', value);
              }}
            />

            {/* Checkbox */}
            <VStack>
              <CustomCheckbox
                label="Agree with Terms & Conditions"
                checked={values.acceptTerms}
                onChange={() => {
                  setFieldValue('acceptTerms', !values.acceptTerms);
                  handleBlur('acceptTerms');
                }}
              />
              {errors.acceptTerms && touched.acceptTerms && (
                <Text>{errors.acceptTerms}</Text>
              )}
            </VStack>

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.signInButton,
                !isValid ? styles.disabledButton : null,
              ]}
              disabled={!isValid}
              onPress={handleSubmit}>
              <Text style={styles.signInText}>Sign Up</Text>
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
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    // paddingVertical: 100,
    // paddingBottom: 200,
    // justifyContent: 'center',
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
  Checklabel: {
    fontSize: 16,
    // marginBottom: 10,
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
    marginVertical: 20,
    // marginTop: 30,
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
    marginBottom: 100,
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: Color.primary,
    borderColor: Color.primary,
  },
  innerBox: {
    width: 12,
    height: 12,
    backgroundColor: '#fff',
  },

  signUpButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background to highlight the loader
  },
});
