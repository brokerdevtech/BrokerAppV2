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
import {useApiRequest} from '@/src/hooks/useApiRequest ';
import {Formik} from 'formik';
import {useNavigation} from '@react-navigation/native';
import {
  getBrokerCategoryList,
  getCityList,
  getCountryList,
  getStateList,
  login,
} from '@/BrokerAppcore/services/new/authService';
import {Text} from 'react-native';
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
export default function RegisterModal({
  showActionsheet,
  handleClose,
  setLoggedIn,
}) {
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

  const navigation = useNavigation();
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
  return (
    <Actionsheet
      isOpen={showActionsheet}
      onClose={handleClose}
      className="h-50">
      <ActionsheetBackdrop />

      <ActionsheetContent>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
        <ActionsheetScrollView>
          <VStack className="max-w-[440px] w-full" space="md">
            <VStack space="md" className="justify-center items-center mt-4">
              <Heading className="md:text-center" size="xl">
                Create An Account
              </Heading>
            </VStack>
            <Formik
              initialValues={{
                firstName: '',
                lastName: '',
                email: '',
                phoneNumber: '',
                password: '',
                confirmPassword: '',
                country: '',
                state: '',
                city: '',
                BrokerCategory: [],
                organizationType: 'Individual',
                acceptTerms: false,
              }}
              validationSchema={validationSchema}
              onSubmit={values =>
                handleSubmit(
                  values,
                  selectedCountry,
                  selectedState,
                  selectedCity,
                  selectedCategory,
                )
              }>
              {({
                handleChange,
                handleSubmit,
                values,
                handleBlur,
                errors,
                setFieldValue,
                setFieldTouched,
                isValid,
                touched,
                dirty,
              }) => (
                <VStack className="w-full">
                  <VStack space="xl" className="w-full">
                    <FormControl className="w-full">
                      <Input className="h-12 rounded-lg">
                        <InputField
                          placeholder="First Name"
                          value={values.firstName}
                          onChangeText={handleChange('firstName')}
                          onBlur={handleBlur('firstName')}
                          returnKeyType="done"
                        />
                      </Input>
                      {touched.firstName && errors.firstName ? (
                        <Text>{errors.firstName}</Text>
                      ) : null}
                    </FormControl>

                    <FormControl className="w-full">
                      <Input className="h-12 rounded-lg">
                        <InputField
                          placeholder="Last Name"
                          value={values.lastName}
                          onChangeText={handleChange('lastName')}
                          onBlur={handleBlur('lastName')}
                          returnKeyType="done"
                        />
                      </Input>
                      {touched.lastName && errors.lastName ? (
                        <Text>{errors.lastName}</Text>
                      ) : null}
                    </FormControl>
                    <FormControl className="w-full">
                      <Input className="h-12 rounded-lg">
                        <InputField
                          placeholder="Email"
                          value={values.email}
                          onChangeText={handleChange('email')}
                          onBlur={handleBlur('email')}
                          returnKeyType="done"
                        />
                      </Input>
                      {touched.email && errors.email ? (
                        <Text>{errors.email}</Text>
                      ) : null}
                    </FormControl>
                    <FormControl className="w-full">
                      <Input className="h-12 rounded-lg">
                        <InputField
                          placeholder="Phone Number"
                          value={values.phoneNumber}
                          onChangeText={handleChange('phoneNumber')}
                          onBlur={handleBlur('phoneNumber')}
                          keyboardType="numeric"
                          returnKeyType="done"
                        />
                      </Input>
                      {touched.phoneNumber && errors.phoneNumber ? (
                        <Text>{errors.phoneNumber}</Text>
                      ) : null}
                    </FormControl>
                    <FormControl className="w-full">
                      <Input className="h-12 rounded-lg">
                        <InputField
                          placeholder="Password"
                          value={values.password}
                          onChangeText={handleChange('password')}
                          onBlur={handleBlur('password')}
                          secureTextEntry
                          returnKeyType="done"
                        />
                      </Input>
                      {touched.password && errors.password ? (
                        <Text>{errors.password}</Text>
                      ) : null}
                    </FormControl>
                    <FormControl className="w-full">
                      <Input className="h-12 rounded-lg">
                        <InputField
                          placeholder="Confirm Password"
                          value={values.confirmPassword}
                          onChangeText={handleChange('confirmPassword')}
                          onBlur={handleBlur('confirmPassword')}
                          secureTextEntry
                          returnKeyType="done"
                        />
                      </Input>
                      {touched.confirmPassword && errors.confirmPassword ? (
                        <Text>{errors.confirmPassword}</Text>
                      ) : null}
                    </FormControl>
                    <FormControl className="w-full">
                      <SelectComponent
                        placeholder="Select Category"
                        data={CategoryDataForSelect}
                        onSelect={(selectedValues: any) => {
                          setFieldValue(
                            'BrokerCategory',
                            Array.isArray(selectedValues)
                              ? selectedValues
                              : [selectedValues],
                          );
                          handleBlur('BrokerCategory');
                        }}
                      />
                      {touched.BrokerCategory && errors.BrokerCategory ? (
                        <Text>{errors.BrokerCategory}</Text>
                      ) : null}
                    </FormControl>

                    <FormControl className="w-full">
                      <SelectComponent
                        placeholder="Select Country"
                        data={CountryDataForSelect}
                        onSelect={value => {
                          setFieldValue('country', value);
                          handleCountryChange(value);
                          handleBlur('country');
                        }}
                      />
                      {errors.country && touched.country ? (
                        <Text>{errors.country}</Text>
                      ) : null}
                    </FormControl>
                    <FormControl className="w-full">
                      <SelectComponent
                        isdisabled={!selectedCountry}
                        placeholder="Select State"
                        data={StatesDataForSelect}
                        onSelect={value => {
                          setFieldValue('state', value);
                          handleStateChange(value);
                          handleBlur('state');
                        }}
                      />
                      {errors.state && touched.state ? (
                        <Text>{errors.state}</Text>
                      ) : null}
                    </FormControl>
                    <FormControl className="w-full">
                      <SelectComponent
                        isdisabled={!selectedState}
                        placeholder="Select City"
                        data={CityDataForSelect}
                        onSelect={value => {
                          setFieldValue('city', value);
                          handleCityChange(value);
                          handleBlur('city');
                        }}
                      />
                      {errors.city && touched.city ? (
                        <Text>{errors.city}</Text>
                      ) : null}
                    </FormControl>
                    <Checkbox
                      size="md"
                      aria-label="Remember me"
                      value={values.acceptTerms}
                      onPress={() => {
                        setFieldValue('acceptTerms', !values.acceptTerms);
                        handleBlur('acceptTerms');
                      }}
                      className="mb-4 mr-2">
                      <CheckboxIndicator>
                        <Icon as={CheckIcon} color="white" size="sm" />
                      </CheckboxIndicator>
                      <CheckboxLabel>
                        I accept the Terms of Use & Privacy Policy
                      </CheckboxLabel>
                    </Checkbox>
                    {errors.acceptTerms && touched.acceptTerms ? (
                      <Text>{errors.acceptTerms}</Text>
                    ) : null}
                  </VStack>

                  <VStack className="w-full my-7" space="lg">
                    <Button
                      className="w-full rounded-md"
                      size="xl"
                      onPress={handleSubmit}
                      accessibilityLabel="Submit the form">
                      <ButtonText className="font-medium">
                        Create Account
                      </ButtonText>
                    </Button>
                  </VStack>
                </VStack>
              )}
            </Formik>
          </VStack>
        </ActionsheetScrollView>
      </ActionsheetContent>
    </Actionsheet>
  );
}
