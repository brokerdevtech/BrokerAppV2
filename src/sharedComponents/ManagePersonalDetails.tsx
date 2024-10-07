import React, {useEffect, useRef, useState} from 'react';
import {Keyboard, Platform, StyleSheet} from 'react-native';

import {styles} from '../themes';
import {Formik} from 'formik';
import * as yup from 'yup';

import DatePicker from 'react-native-date-picker';

import DateTimePicker from '@react-native-community/datetimepicker';
import AppBaseContainer from '../hoc/AppBaseContainer_old';
import {Color} from '../styles/GlobalStyles';
import typography from '../themes/typography';

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
  useEffect(() => {
    setLoading(true);
  }, []);

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
  const handleCityChange = value => {
    setselectedcity(value);
  };

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
              <Box mb="5">
                <Stack>
                  <ZText type={'M16'} style={localStyles.label}>
                    First Name
                  </ZText>
                  <Input
                    style={localStyles.InputFont}
                    placeholder="First Name"
                    value={values.firstName}
                    onChangeText={handleChange('firstName')}
                  />
                  {errors.firstName && (
                    <Box pl="3" mt="2">
                      <ZText type={'R12'} style={styles.errorText}>
                        {errors.firstName}
                      </ZText>
                    </Box>
                  )}
                </Stack>
              </Box>
              <Box mb="5">
                <Stack>
                  <ZText type={'M16'} style={localStyles.label}>
                    Last Name
                  </ZText>
                  <Input
                    style={localStyles.InputFont}
                    placeholder="Last Name"
                    value={values.lastName}
                    onChangeText={handleChange('lastName')}
                  />
                  {errors.lastName && (
                    <Box pl="3" mt="2">
                      <ZText type={'R12'} style={styles.errorText}>
                        {errors.lastName}
                      </ZText>
                    </Box>
                  )}
                </Stack>
              </Box>

              <Box mb="5">
                <ZText type={'M16'} style={localStyles.label}>
                  Email
                </ZText>
                <Stack>
                  <Input
                    style={localStyles.InputFont}
                    placeholder="Email"
                    value={values.email}
                    onChangeText={handleChange('email')}
                  />
                  {errors.email && (
                    <Box pl="3" mt="2">
                      <ZText type={'R12'} style={styles.errorText}>
                        {errors.email}
                      </ZText>
                    </Box>
                  )}
                </Stack>
              </Box>

              <Box mb="5">
                <Stack>
                  <ZText type={'M16'} style={localStyles.label}>
                    Phone Number
                  </ZText>
                  <Input
                    style={localStyles.InputFont}
                    placeholder="Phone Number"
                    value={values.contactNo}
                    onChangeText={handleChange('contactNo')}
                  />
                  {errors.contactNo && (
                    <Box pl="3" mt="2">
                      <ZText type={'R12'} style={styles.errorText}>
                        {errors.contactNo}
                      </ZText>
                    </Box>
                  )}
                </Stack>
              </Box>
              <Box mb="5">
                <ZText type={'M16'} style={localStyles.label}>
                  Industry
                </ZText>
                <Stack>
                  {/* <DBMultiSelectPicker
                    data={Profiledata.industries}
                    id={'industryId'}
                    TextValue={'industryName'}
                    pickerName="Select Industry"
                    onSelectionChange={value => {
                      setFieldValue('industry', value);
                    }}></DBMultiSelectPicker> */}
                </Stack>
                {errors.industry && (
                  <Box pl="3" mt="2">
                    <ZText type={'R12'} style={styles.errorText}>
                      {errors.industry}
                    </ZText>
                  </Box>
                )}
              </Box>
              <Box mb="5">
                <Stack>
                  <ZText type={'M16'} style={localStyles.label}>
                    Country
                  </ZText>

                  {/* <DropDownPicker
                  placeholder="Select Country"
                  open={openCountry}
                  value={selectedCountry}
                  items={CountryData}
                  setOpen={setOpenCountry}
                  setValue={setSelectedCountry}
                  searchable={true}
                  // setItems={CountryData}
                  schema={{
                    label: 'countryName', // required
                    value: 'countryId', // required
                  }}
                  onChangeValue={value => {
                    // console.log("onChangeValue");
                    // handleCountryChange(value);
                    // setFieldValue('country', value);
                    //setFieldValue('state', '');
                  }}
                  onSelectItem={item => {
                    console.log('onSelectItem');
                    console.log(item);
                    handleCountryChange(item.countryId);
                    setFieldValue('country', item.countryId);
                    setFieldValue('state', '');
                    console.log(item);
                  }}
                  style={{
                    borderRadius: 5,
                    borderColor: '#D9D9D9',
                    paddingLeft: 15,
                    ...localStyles.InputFont,
                  }}
                  textStyle={{
                    color: 'black',
                    fontSize: 14,
                  }}
                  listMode="MODAL"
                  searchPlaceholder="Search Country..."
                  CloseIconComponent={() => (
                    <Ionicons name="close-outline" size={35} color={'#000'} />
                  )}
                  searchTextInputStyle={{
                    color: '#000',
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                  }}
                /> */}
                  {/* <DropDownHandler
                  alreadySelected={selectedCountry}
                  data={CountryDataForSelect}
                  onValueChange={value => {
                    setFieldValue('country', value);
                    handleCountryChange(value);
                  }}
                  placeholder={'Select Country'}
                  isDisabled={false}
                /> */}
                  <SingleSelectComponent
                    data={CountryDataForSelect}
                    onSelectionChange={value => {
                      // console.log('Country', value);
                      setFieldValue('country', value);
                      handleCountryChange(value);
                      handleBlur('country');
                    }}
                    displayText={
                      selectedCountry
                        ? Profiledata.countryName
                        : 'Select Country'
                    }
                    title={'Select Country'}
                    selectedValue={selectedCountry}
                  />
                  {/* <Select
                  style={localStyles.InputFont}
                  placeholder="Select Country"
                  selectedValue={selectedCountry}
                  onValueChange={value => {
                    handleCountryChange(value);
                    setFieldValue('country', value);
                    setFieldValue('state', '');
                    // setFieldValue('city', '');
                  }}>
                  {CountryData.map(country => (
                    <Select.Item
                      key={country.countryId}
                      label={country.countryName}
                      value={country.countryId}
                    />
                  ))}
                </Select> */}
                  {errors.country && (
                    <Box pl="3" mt="2">
                      <ZText type={'R12'} style={styles.errorText}>
                        {errors.country}
                      </ZText>
                    </Box>
                  )}
                </Stack>
              </Box>
              <Box mb="5">
                <Stack>
                  <ZText type={'M16'} style={localStyles.label}>
                    State
                  </ZText>
                  {/* <DropDownHandler
                  alreadySelected={selectedState}
                  data={StatesDataForSelect}
                  onValueChange={value => {
                    setFieldValue('state', value);
                    handleStateChange(value);
                  }}
                  placeholder={'Select State'}
                  isDisabled={!selectedCountry}
                /> */}
                  <SingleSelectComponent
                    selectedValue={selectedState}
                    data={StatesDataForSelect}
                    onSelectionChange={value => {
                      setFieldValue('state', value);
                      handleStateChange(value);
                      handleBlur('state');
                    }}
                    isDisabled={!selectedCountry}
                    displayText={
                      selectedState ? Profiledata.stateName : 'Select state'
                    }
                    title={'Select state'}
                  />
                  {/* <DropDownPicker
                  placeholder="Select State"
                  disabled={statesData.length === 0}
                  open={openState}
                  value={selectedState}
                  items={statesData}
                  setOpen={setOpenState}
                  setValue={setSelectedState}
                  searchable={true}
                  // setItems={CountryData}
                  schema={{
                    label: 'stateName', // required
                    value: 'stateId', // required
                  }}
                  onChangeValue={value => {
                    console.log('State');
                    console.log(value);
                    // handleStateChange(value);
                    // setFieldValue('state', value);

                    //setFieldValue('city', '');
                  }}
                  onSelectItem={item => {
                    console.log('onSelectItem');
                    handleStateChange(item.stateId);
                    setFieldValue('state', item.stateId);
                    setFieldValue('city', '');
                    console.log(item);
                  }}
                  style={{
                    borderRadius: 5,
                    borderColor: '#D9D9D9',
                    paddingLeft: 15,
                  }}
                  textStyle={{
                    color: 'black',
                    fontSize: 14,
                  }}
                  listMode="MODAL"
                  zIndex={10000}
                  searchPlaceholder="Search State..."
                  CloseIconComponent={() => (
                    <Ionicons name="close-outline" size={35} color={'#000'} />
                  )}
                  searchTextInputStyle={{
                    color: '#000',
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                  }}
                /> */}

                  {/* <Select
                  style={localStyles.InputFont}
                  isDisabled={statesData.length === 0}
                  placeholder="Select State"
                  selectedValue={selectedState}
                  onValueChange={value => {
                    handleStateChange(value);
                    setFieldValue('state', value);

                    setFieldValue('city', '');
                  }}>
                  {statesData.map(state => (
                    <Select.Item
                      key={state.stateId}
                      label={state.stateName}
                      value={state.stateId}
                    />
                  ))}
                </Select> */}
                  {errors.state && (
                    <Box pl="3" mt="2">
                      <ZText type={'R12'} style={styles.errorText}>
                        {errors.state}
                      </ZText>
                    </Box>
                  )}
                </Stack>
              </Box>
              <Box mb="5">
                <ZText type={'M16'} style={localStyles.label}>
                  city
                </ZText>
                <Stack>
                  {/* <DropDownPicker
                  placeholder="Select city"
                  disabled={cityData.length === 0}
                  open={openCity}
                  value={selectedcity}
                  items={cityData}
                  setOpen={setOpenCity}
                  setValue={setselectedcity}
                  searchable={true}
                  // setItems={CountryData}
                  schema={{
                    label: 'cityName', // required
                    value: 'cityId', // required
                  }}
                  onChangeValue={value => {
                    // setselectedcity(value);
                    // setFieldValue('city', value);
                    // handleBlur('city');
                  }}
                  onSelectItem={item => {
                    setselectedcity(item.cityId);
                    setFieldValue('city', item.cityId);
                  }}
                  style={{
                    borderRadius: 5,
                    borderColor: '#D9D9D9',
                    paddingLeft: 15,
                  }}
                  textStyle={{
                    color: 'black',
                    fontSize: 14,
                  }}
                  listMode="MODAL"
                  searchPlaceholder="Search City..."
                  CloseIconComponent={() => (
                    <Ionicons name="close-outline" size={35} color={'#000'} />
                  )}
                  searchTextInputStyle={{
                    color: '#000',
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                  }}
                /> */}
                  <SingleSelectComponent
                    data={CityDataForSelect}
                    selectedValue={selectedcity}
                    onSelectionChange={value => {
                      setFieldValue('city', value);
                      handleCityChange(value);
                      handleBlur('city');
                    }}
                    isDisabled={!selectedState}
                    displayText={
                      selectedcity ? Profiledata.cityName : 'Select City'
                    }
                    title={'Select City'}
                  />
                  {/* <DropDownHandler
                  data={CityDataForSelect}
                  alreadySelected={selectedcity}
                  onValueChange={value => {
                    setFieldValue('city', value);
                    handleCityChange(value);
                  }}
                  placeholder={'Select City'}
                  isDisabled={!selectedState}
                /> */}
                  {/* <Select
                  style={(localStyles.InputFont, localStyles.selectContainer)}
                  isDisabled={cityData.length === 0}
                  placeholder="Select city"
                  selectedValue={selectedcity}
                  onValueChange={value => {
                    setselectedcity(value);
                    setFieldValue('city', value);
                  }}>
                  {cityData.map(city => (
                    <Select.Item
                      key={city.cityId}
                      label={city.cityName}
                      value={city.cityId}
                    />
                  ))}
                </Select> */}
                </Stack>
                {errors.city && (
                  <Box pl="3" mt="2">
                    <ZText type={'R12'} style={styles.errorText}>
                      {errors.city}
                    </ZText>
                  </Box>
                )}
              </Box>
              {/* <Box mb="5">
              <ZText type={'M16'} style={localStyles.label}>
                Industry
              </ZText>
              <Stack>
                <DBMultiSelectPicker
                  data={Profiledata.industries}
                  id={'industryId'}
                  TextValue={'industryName'}
                  pickerName="Select Industry"
                  onSelectionChange={value => {
                    setFieldValue('industry', value);
                  }}></DBMultiSelectPicker>
              </Stack>
              {errors.industry && (
                <Box pl="3" mt="2">
                  <ZText type={'R12'} style={styles.errorText}>
                    {errors.industry}
                  </ZText>
                </Box>
              )}
            </Box> */}
              <Box mb="5">
                <ZText style={localStyles.label}>experience</ZText>
                <Stack>
                  <Input
                    style={localStyles.InputFont}
                    placeholder="Experience"
                    keyboardType="numeric"
                    min
                    value={values.experienceInYears.toString()}
                    onChangeText={handleChange('experienceInYears')}
                  />
                  {errors.experienceInYears && (
                    <Box pl="3" mt="2">
                      <ZText type={'R12'} style={styles.errorText}>
                        {errors.experienceInYears}
                      </ZText>
                    </Box>
                  )}
                </Stack>
              </Box>
              <Box mb="5">
                <Stack>
                  <HStack space={3} justifyContent="space-between">
                    <ZText type={'M16'} style={localStyles.label}>
                      Rera Expiry Date:
                      {selectDate != '' ? selectDate.toDateString() : ''}
                    </ZText>
                    <Ionicons
                      name="calendar-outline"
                      size={moderateScale(20)}
                      color={color.primary}
                      style={styles.mr5}
                      onPress={() => {
                        setShowDatePicker(true);
                      }}
                    />
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
                  {Platform.OS === 'ios' && (
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
                  )}
                  {errors.reraExpiryDate && (
                    <Box pl="3" mt="2">
                      <ZText type={'R12'} style={styles.errorText}>
                        {errors.reraExpiryDate}
                      </ZText>
                    </Box>
                  )}
                </Stack>
              </Box>
              <Box mb="5">
                <Stack>
                  <ZText type={'M16'} style={localStyles.label}>
                    uid
                  </ZText>
                  <Input
                    style={localStyles.InputFont}
                    placeholder="Uid"
                    value={values.uid}
                    onChangeText={handleChange('uid')}
                  />
                  {errors.uid && (
                    <Box pl="3" mt="2">
                      <ZText type={'R12'} style={styles.errorText}>
                        {errors.uid}
                      </ZText>
                    </Box>
                  )}
                </Stack>
              </Box>
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
});

export default AppBaseContainer(PersonalDetailsForm, 'Personal Details');
//export default PersonalDetailsForm;
