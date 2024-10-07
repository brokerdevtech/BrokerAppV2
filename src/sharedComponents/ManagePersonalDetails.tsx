import React, {useEffect, useRef, useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';

import {styles} from '../themes';
import {Formik} from 'formik';
import * as yup from 'yup';

import DatePicker from 'react-native-date-picker';

import DateTimePicker from '@react-native-community/datetimepicker';
import AppBaseContainer from '../hoc/AppBaseContainer_old';
import {Color} from '../styles/GlobalStyles';
import typography from '../themes/typography';
import {Box} from '../../components/ui/box';
import ZText from './ZText';
import {Input, InputField} from '../../components/ui/input';
import {HStack} from '../../components/ui/hstack';
import {Button} from '../../components/ui/button';
import SingleSelectComponent from './SingleSelectComponent';
import {Icon} from '../../components/ui/icon';
import {Calender_Icon} from '../assets/svg';
import LocalityTag from './LocalityTag';
import MultiSelectComponent from './MultiSelectModal';

const validationSchema = yup.object().shape({
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is required'),
  email: yup
    .string()
    .matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/, 'Invalid email')
    .required('Email is required'),
  contactNo: yup
    .string()
    .required('Phone Number is required')
    .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
  country: yup.string().required('Country is required'),
  state: yup.string().required('State is required'),
  city: yup.string().required('City is required'),
  industry: yup
    .array()
    .of(yup.mixed()) // Ensure that it's an array of objects
    .min(1, 'Please select at least one item'),
  experienceInYears: yup
    .number()
    .min(0, 'Experience needs to be greater than zero')
    .required('Experience is required')
    .typeError('Experience must be a number'),
  reraExpiryDate: yup.date().required('Rera Expiry Date is required '),
  uid: yup.string().required('UID is required'),
});

const PersonalDetailsForm = ({
  isPageSkeleton,
  toggleSkeletonoff,
  toggleSkeletonOn,
  setLoading,
  navigation,
  user,
  color,
  route,
  toast,
}) => {
  // const route = useRoute();
  // const user = useSelector((state: RootState) => state.user.user);
  const PageTitle = route.params?.title;
  const Profiledata = route.params?.data || {};
  const [selectedRole, setselectedRole] = useState(
    Profiledata?.roles[0].roleId,
  );
  const [CountryData, setCountryData] = useState([]);
  const [statesData, setstatesData] = useState([]);
  const [cityData, setcityData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(
    Profiledata?.countryId,
  );
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  // const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedState, setSelectedState] = useState(Profiledata?.stateId);
  const [selectedcity, setselectedcity] = useState(Profiledata?.cityId);

  const [openCountry, setOpenCountry] = useState(false);

  const [openState, setOpenState] = useState(false);

  const [openCity, setOpenCity] = useState(false);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectDate, setselectDate] = useState(
    Profiledata?.reraExpiryDate
      ? new Date(`${Profiledata.reraExpiryDate}T00:00:00`)
      : '',
  );
  const minDate = new Date();
  const formikRef = useRef();
  //useEffect for CountryData
  // useEffect(() => {
  //   setLoading(true);
  // }, []);
  const onFiltersLocalityChange = Localitys => {
    //
    //

    formikRef.current.handleBlur('Location');
    formikRef.current.setFieldValue('Location', Localitys);
    setLocalities(Localitys);
  };
  const handleSubmit = async values => {
    try {
      // Handle form submission here
      Keyboard.dismiss();
      const year = selectDate.getFullYear().toString();
      const month = (selectDate.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-based, so add 1
      const day = selectDate.getDate().toString().padStart(2, '0');

      // Create the formatted date string as "yyyy-mm-dd"
      const formattedDate = `${year}-${month}-${day}`;

      const updateObj = {
        cityId: values.city,
        stateId: values.state,
        countryId: values.country,
        contactNo: values.contactNo,
        experience: values.experienceInYears,
        reraExpiryDate: formattedDate,
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        uid: values.uid,
      };
      const deletions = [
        'roles',
        'industries',
        'specializations',
        'userLocations',
      ];
      let Result: any = updateNestedObject(Profiledata, updateObj, deletions);
      const selectedSkills = new Set(values.industry);
      const updatedArr2 = Profiledata.industries.map(item => ({
        ...item,
        isSelected: selectedSkills.has(item.industryId) ? 1 : 0,
      }));

      Result = {
        ...Result,
        industry: getList(updatedArr2),
        specialization: getList(Profiledata.specializations),
        userLocation: [],
      };

      setLoading(true);
      let k = await UpdateProfile(Result);
      if (k.error) {
        toast.show({
          description: k.error,
        });
        setLoading(false);
        return;
      } else {
        toast.show({
          description: 'Profile updated successfully',
        });
        setLoading(false);
      }

      let obj = {
        ...user,
        firstName: k.data.firstName,
        lastName: k.data.lastName,
      };

      await store.dispatch(setUser(obj));

      setLoading(false);
      navigation.navigate('Profile');
    } catch (error) {}
  };

  const CountryDataForSelect = CountryData.map(country => ({
    label: country.countryName,
    value: country.countryId,
  }));

  const StatesDataForSelect = statesData.map(state => ({
    label: state.stateName,
    value: state.stateId,
  }));
  const CityDataForSelect = cityData.map(city => ({
    label: city.cityName,
    value: city.cityId,
  }));
  const IndustryDataForSelect = Profiledata.industries.map(industry => ({
    label: industry.industryName,
    value: industry.industryId,
  }));
  const handleCityChange = value => {
    setselectedcity(value);
  };
  console.log(Profiledata.industries);
  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS == 'ios' ? 'padding' : ''}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        bounces={false}
        showsVerticalScrollIndicator={false}
        style={localStyles.root}>
        <Formik
          innerRef={formikRef}
          initialValues={{
            firstName: Profiledata.firstName,
            lastName: Profiledata.lastName,
            email: Profiledata.email,
            contactNo: Profiledata.contactNo,
            country: Profiledata.countryId,
            state: Profiledata.stateId,
            city: Profiledata.cityId,
            industry: Profiledata.industries,
            experienceInYears: Number(Profiledata.experience),
            reraExpiryDate: Profiledata.reraExpiryDate,
            uid: Profiledata.uid,
          }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}>
          {({
            formikProps,
            values,
            handleChange,
            handleSubmit,
            errors,
            setFieldValue,
            touched,
            isValid,
            dirty,
            handleBlur,
          }) => (
            <>
              <ZText type={'R16'} style={localStyles.label}>
                First Name
              </ZText>

              <Input style={localStyles.input}>
                <InputField
                  placeholder="First Name"
                  value={values.firstName}
                  onChangeText={handleChange('firstName')}
                />
              </Input>
              {errors.firstName && (
                <ZText type={'R12'} style={styles.errorText}>
                  {errors.firstName}
                </ZText>
              )}

              <ZText type={'R16'} style={localStyles.label}>
                Last Name
              </ZText>

              <Input style={localStyles.input}>
                <InputField
                  placeholder="Last Name"
                  value={values.lastName}
                  onChangeText={handleChange('lastName')}
                />
              </Input>
              {errors.lastName && (
                <ZText type={'R12'} style={styles.errorText}>
                  {errors.lastName}
                </ZText>
              )}

              <ZText type={'R16'} style={localStyles.label}>
                Email
              </ZText>

              <Input style={localStyles.input}>
                <InputField
                  placeholder="Email"
                  value={values.email}
                  onChangeText={handleChange('email')}
                />
              </Input>
              {errors.email && (
                <ZText type={'R12'} style={styles.errorText}>
                  {errors.email}
                </ZText>
              )}

              <ZText type={'R16'} style={localStyles.label}>
                Phone Number
              </ZText>

              <Input style={localStyles.input}>
                <InputField
                  placeholder="Phone Number"
                  keyboardType="phone-pad"
                  value={values.contactNo}
                  onChangeText={handleChange('contactNo')}
                />
              </Input>
              {errors.contactNo && (
                <ZText type={'R12'} style={styles.errorText}>
                  {errors.contactNo}
                </ZText>
              )}

              <ZText type={'R16'} style={localStyles.label}>
                Industry
              </ZText>

              {/* <DBMultiSelectPicker
                    data={Profiledata.industries}
                    id={'industryId'}
                    TextValue={'industryName'}
                    pickerName="Select Industry"
                    onSelectionChange={value => {
                      setFieldValue('industry', value);
                    }}></DBMultiSelectPicker> */}
              <MultiSelectComponent
                data={IndustryDataForSelect}
                onSelectionChange={value => {
                  setFieldValue('industry', value);
                }}
                displayText={
                  selectedCountry
                    ? Profiledata.countryName
                    : 'Select Industries'
                }
                title={'Select Industry'}
                keyProperty="value"
                valueProperty="label"
                // selectedValue={selectedCountry}
              />
              {errors.industry && (
                <ZText type={'R12'} style={styles.errorText}>
                  {errors.industry}
                </ZText>
              )}
              <Box mb="5" style={localStyles.BoxStyles}>
                <LocalityTag
                  onLocalityChange={onFiltersLocalityChange}
                  isMandatory={true}></LocalityTag>
                {/* {errors.Location && touched.Location && (
                  <Box pl="3" mt="2">
                    <Text style={styles.errorText}>{errors.Location}</Text>
                  </Box>
                )} */}
              </Box>
              <ZText type={'R16'} style={localStyles.label}>
                experience
              </ZText>

              <Input style={localStyles.input}>
                <InputField
                  placeholder="Experience"
                  keyboardType="phone-pad"
                  value={values.experienceInYears.toString()}
                  onChangeText={handleChange('experienceInYears')}
                />
              </Input>

              {errors.experienceInYears && (
                <ZText type={'R12'} style={styles.errorText}>
                  {errors.experienceInYears}
                </ZText>
              )}

              <HStack>
                <ZText type={'R16'} style={localStyles.label}>
                  Rera Expiry Date:
                  {selectDate != '' ? selectDate.toDateString() : ''}
                </ZText>

                <Icon as={Calender_Icon} />
              </HStack>

              {Platform.OS === 'android' && showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  is24Hour={true}
                  display="spinner"
                  minimumDate={minDate}
                  onChange={handleDateChange}
                />
              )}
              {/* {Platform.OS === 'ios' && (
                  <DatePicker
                    modal
                    mode="date"
                    open={showDatePicker}
                    date={date}
                    onConfirm={selectedDate => {
                      setShowDatePicker(false);
                      if (selectedDate) {
                        formikRef.current.setFieldValue(
                          'reraExpiryDate',
                          selectedDate,
                        );
                        setselectDate(selectedDate);
                      }
                    }}
                    onCancel={() => {
                      setShowDatePicker(false);
                    }}
                    minimumDate={minDate}
                  />
                )} */}
              {errors.reraExpiryDate && (
                <ZText type={'R12'} style={styles.errorText}>
                  {errors.reraExpiryDate}
                </ZText>
              )}

              <ZText type={'R16'} style={localStyles.label}>
                uid
              </ZText>

              <Input style={localStyles.input}>
                <InputField
                  placeholder="Uid"
                  value={values.uid}
                  onChangeText={handleChange('uid')}
                />
              </Input>
              {errors.uid && (
                <ZText type={'R12'} style={styles.errorText}>
                  {errors.uid}
                </ZText>
              )}

              <Button
                mt="5"
                mb="5"
                bg="primary.600"
                block
                style={[
                  styles.button,
                  dirty && isValid && styles.validButton, // Apply validButton style when form is valid
                ]}
                onPress={handleSubmit}
                disabled={!dirty || !isValid}>
                <ZText type="M14" color="white">
                  Update
                </ZText>
              </Button>
            </>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const localStyles = StyleSheet.create({
  button: {
    padding: 10,
    backgroundColor: '#C4C4C4', // Default color
    color: 'black', // Text color
    fontSize: 16,
    borderRadius: 5,
  },
  validButton: {
    backgroundColor: '#1D7BBF', // Color when form is valid
  },
  root: {
    ...styles.flex,
    ...styles.ph20,
    ...styles.mb20,
  },
  errorText: {
    color: 'red',
  },
  label: {
    textTransform: 'capitalize',
    marginBottom: 10,
    // ...typography.fontWeights.Medium,
    // ...typography.fontSizes.f16,
  },
  InputFont: {
    borderColor: Color.primary,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    // paddingVertical:14,
    // ...typography.fontWeights.Regular,
    ...typography.fontSizes.f14,
    // borderWidth: 0,
  },
  selectContainer: {
    flex: 1, // Ensure it takes up all available space
    marginRight: 0, // Adjust as needed
    backgroundColor: '#ffffff',
    borderColor: Color.primary,
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
});

export default AppBaseContainer(PersonalDetailsForm, 'Personal Details');
//export default PersonalDetailsForm;
