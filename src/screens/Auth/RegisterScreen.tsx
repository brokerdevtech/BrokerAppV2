import React, {useEffect, useState} from 'react';
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetScrollView,
} from '@/components/ui/actionsheet';
import {VStack} from '@/components/ui/vstack';

import {Heading} from '@/components/ui/heading';
import {FormControl} from '@/components/ui/form-control';
import {HStack} from '@/components/ui/hstack';
import {Link, LinkText} from '@/components/ui/link';
import {Button, ButtonText} from '@/components/ui/button';

import {Input, InputField} from '@/components/ui/input';
import {useApiRequest} from '@/src/hooks/useApiRequest';
import {Formik} from 'formik';
import {useNavigation} from '@react-navigation/native';
import {
  getBrokerCategoryList,
  getCityList,
  getCountryList,
  getStateList,
  login,
} from '@/BrokerAppcore/services/new/authService';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {storeTokens, storeUser} from '@/src/utils/utilTokens';
import store from '@/BrokerAppcore/redux/store';
import {setUser} from '@/BrokerAppcore/redux/store/user/userSlice';
import {setTokens} from '@/BrokerAppcore/redux/store/authentication/authenticationSlice';
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from '@/components/ui/checkbox';
import {CheckIcon, CircleIcon, Icon} from '@/components/ui/icon';
import SelectComponent from '@/src/sharedComponents/SelectComponent';
import {
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from '@/components/ui/radio';

import * as yup from 'yup';
import UserRegistration from '@/BrokerAppcore/types/userRegistration';
import {Color, GilroyFontFamily} from '../../styles/GlobalStyles';
import {InputIcon, InputSlot} from '../../../components/ui/input';
import {EyeIcon, EyeOffIcon} from '../../../components/ui/icon';

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
  BrokerCategory: yup.array().min(1).required('Required'),
  country: yup.string().required('Country is required'),
  state: yup.string().required('State is required'),
  city: yup.string().required('City is required'),

  acceptTerms: yup
    .boolean()
    .oneOf([true], 'You must accept the terms and privacy policy'),
});
export default function RegisterScreen({setLoggedIn}) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const navigation = useNavigation();
  const handleState = () => {
    setShowPassword(showState => {
      return !showState;
    });
  };
  const {
    data: categorydata,
    status: categorystatus,
    error: categoryerror,
    execute: categoryexecute,
  } = useApiRequest(getBrokerCategoryList);

  const {
    data: countrydata,
    status: countrystatus,
    error: countryerror,
    execute: countryexecute,
  } = useApiRequest(getCountryList);

  const {
    data: statedata,
    status: statestatus,
    error: staterror,
    execute: statexecute,
  } = useApiRequest(getStateList);
  const {
    data: citydata,
    status: citystatus,
    error: cityerror,
    execute: cityexecute,
  } = useApiRequest(getCityList);
  const fetchCountryData = async () => {
    await countryexecute();
  };
  const fetchCategoryData = async () => {
    await categoryexecute();
  };
  const fetchStateData = async () => {
    await statexecute(selectedCountry);
  };
  const fetchCityData = async () => {
    await cityexecute(selectedState);
  };
  useEffect(() => {
    fetchCountryData();
    fetchCategoryData();
    if (selectedCountry) fetchStateData();
    if (selectedState) fetchCityData();
  }, [selectedCountry, selectedState]);

  const CountryDataForSelect = countrydata?.data?.map(country => ({
    label: country.countryName,
    value: country.countryId,
  }));

  const CategoryDataForSelect = categorydata?.data?.categories?.map(
    category => ({
      label: category.categoryName,
      value: category.categoryId,
    }),
  );

  const StatesDataForSelect = statedata?.data?.map(state => ({
    label: state.stateName,
    value: state.stateId,
  }));
  const CityDataForSelect = citydata?.data?.map(city => ({
    label: city.cityName,
    value: city.cityId,
  }));
  const handleCountryChange = value => {
    setSelectedCountry(value);
  };
  const handleStateChange = value => {
    setSelectedState(value);
  };
  const handleCityChange = value => {
    setSelectedCity(value);
  };
  const handleSubmit = async (values, country, state, city, broker) => {
    console.log('Form Values:', values);
    console.log('Selected Country:', country);
    console.log('Selected State:', state);
    console.log('Selected City:', city);
    console.log('Selected Broker Category:', broker);
  };
  const [values, setValues] = React.useState('Eng');
  return (
    // <SafeAreaView style={{flex: 1}}>
    <ScrollView contentContainerStyle={{flexGrow: 1}} style={styles.container}>
      <Text style={styles.header}>Create An Account</Text>
      <Text style={styles.subHeader}>
        Please enter your credentials to access your account and details
      </Text>

      <Formik
        initialValues={{email: '', password: ''}}
        validationSchema={validationSchema}
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
            <Text style={styles.label}>Full Name</Text>
            <Input style={styles.input}>
              <InputField
                type="text"
                placeholder="Enter your Full Name"
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
            <Text style={styles.label}>Mobile</Text>
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
            <TouchableOpacity>
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

      {/* <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <Icon as={AppleIcon} stroke="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Icon as={GoogleIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Icon as={FBIcon} />
        </TouchableOpacity>
      </View> */}

      {/* Sign Up Option */}
      <Text style={styles.footerText}>
        Don't have an account?{' '}
        <Text
          style={styles.signUpText}
          onPress={() => navigation.navigate('SignUp')}>
          Sign Up
        </Text>
      </Text>
    </ScrollView>
    // </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    // paddingVertical: 100,
    paddingBottom: 200,
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
});
