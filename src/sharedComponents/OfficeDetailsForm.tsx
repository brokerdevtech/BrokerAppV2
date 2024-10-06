import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import {
  Select,
  Stack,
  Button,
  Text,
  ScrollView,
  Box,
  Input,
  HStack,
  TextArea,
} from 'native-base';
import ZSafeAreaView from '../../components/common/ZSafeAreaView';
import ZHeader from '../../components/common/ZHeader';
import {useRoute} from '@react-navigation/native';
import {colors, styles} from '../../themes';
import {Formik} from 'formik';
import * as yup from 'yup';
import DBMultiSelectPicker from '../../components/DBMultiSelectPicker';
import AppBaseContainer from '../../Hoc/AppBaseContainer';
import {
  getCityList,
  getCountryList,
  getStateList,
} from '../../../BrokerAppCore/services/authService';
import {getList, updateNestedObject} from '../../utils/helpers';
import {UpdateProfile} from '../../../BrokerAppCore/services/profileService';
import typography from '../../themes/typography';
import ZText from '../../components/common/ZText';
import DropDownPicker from 'react-native-dropdown-picker';
import DropDownHandler from '../../components/DropDownHandler';
import SingleSelectComponent from '../../components/Genric/SingleSelectComponent';
// Other imports...

const validationSchema = yup.object().shape({
  officeAddress: yup.string().strict().required('office Address is required'),
  officeCityId: yup.string().required('City is required'),
  officeCountryId: yup.string().required('Country is required'),
  officeStateId: yup.string().required('State is required'),
  officeWebsite: yup.string().strict().url('Invalid URL'),
});

const OfficeDetailsForm = ({
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
  const Profiledata = route.params?.data || {};
  const [CountryData, setCountryData] = useState([]);
  const [statesData, setStatesData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(
    Profiledata?.officeCountryId,
  );
  const [selectedState, setSelectedState] = useState(
    Profiledata?.officeStateId,
  );
  const [selectedCity, setSelectedCity] = useState(Profiledata?.officeCityId);
  const [openCountry, setOpenCountry] = useState(false);

  const [openState, setOpenState] = useState(false);

  const [openCity, setOpenCity] = useState(false);
  const formikRef = useRef();
  useEffect(() => {
    setLoading(true);
  }, []);
  // useEffect for CountryData
  useEffect(() => {
    const getCountryListFromApi = async () => {
      try {
        const result = await getCountryList();
        setCountryData(result.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    getCountryListFromApi();
    //  setLoading(true);
    //  getCountryListFromApi();
    // setTimeout(() => { setLoading(false);},1000);
  }, []);

  // useEffect for statesData
  useEffect(() => {
    if (selectedCountry) {
      const getStateListFromApi = async () => {
        try {
          const result = await getStateList(selectedCountry);
          setStatesData(result.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      getStateListFromApi();
    }
  }, [selectedCountry]);

  // useEffect for selectedCity
  useEffect(() => {
    if (selectedState) {
      const getCityListFromApi = async () => {
        try {
          const result = await getCityList(selectedState);
          setLoading(false);
          setCityData(result.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      getCityListFromApi();
    }
  }, [selectedState]);

  const handleCountryChange = value => {
    if (value != selectedCountry) {
      setSelectedState('');
      setStatesData([]);
      setSelectedCity('');
      setCityData([]);
    }
    setSelectedCountry(value);
  };

  const handleStateChange = value => {
    if (value != selectedCity) {
      setSelectedCity('');
      setCityData([]);
    }
    setSelectedState(value);
  };
  const handleCityChange = value => {
    setSelectedCity(value);

  };
  const handleSubmit = async values => {

    try {
      const officeDetails = {
        officeAddress: values.officeAddress,

        officeCityId: values.officeCityId,
        officeCountryId: values.officeCountryId,
        officeStateId: values.officeStateId,
        officeWebsite: values.officeWebsite,
      };

      const deletions = [
        'roles',
        'industries',
        'specializations',
        'userLocations',
      ];
      let Result: any = updateNestedObject(
        Profiledata,
        officeDetails,
        deletions,
      );

      Result = {
        ...Result,
        industry: getList(Profiledata.industries),
        specialization: getList(Profiledata.specializations),
        userLocation: [],
      };

      setLoading(true);
      let k = await UpdateProfile(Result);
      toast.show({
        description: 'Office Details updated successfully',
      });
      setLoading(false);
      navigation.navigate('Profile');

      // Handle the submission of office details here
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

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      bounces={false}
      showsVerticalScrollIndicator={false}
      style={localStyles.root}>
      <Formik
        innerRef={formikRef}
        initialValues={{
          officeAddress: Profiledata?.officeAddress || '',
          officeCityId: Profiledata.officeCityId,
          officeCountryId: Profiledata.officeCountryId,
          officeStateId: Profiledata.officeStateId,
          officeWebsite: Profiledata?.officeWebsite || '',
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}>
        {({
          values,
          handleChange,
          handleSubmit,
          setFieldValue,
          errors,
          touched,
          isValid,
          dirty,
          handleBlur,
        }) => (
          <>
            <Box mb="5">
              <ZText type={'M16'} style={localStyles.label}>
                Office Address
              </ZText>
              <Stack>
                <TextArea
                  h={20}
                  placeholder="Office Address"
                  value={values.officeAddress}
                  onChangeText={handleChange('officeAddress')}
                />

                {errors.officeAddress && (
                  <Box pl="3" mt="2">
                    <ZText type={'R12'} style={styles.errorText}>
                      {errors.officeAddress}
                    </ZText>
                  </Box>
                )}
              </Stack>
            </Box>
            <Box mb="5">
              <ZText type={'M16'} style={localStyles.label}>
                Country
              </ZText>
              <Stack>
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
      onChangeValue={(value) => {
        // console.log("onChangeValue");
        // handleCountryChange(value);
        // setFieldValue('country', value);
        //setFieldValue('state', '');
      }}
      onSelectItem={(item) => {
        console.log("onSelectItem");
        console.log(item);
        handleCountryChange(item.countryId);
        setFieldValue('officeCountryId', item.countryId);
        
        console.log(item);
      }}
      style={{
        borderRadius: 5,
        borderColor: '#D9D9D9',
        paddingLeft:15,
        ...localStyles.InputFont
      }}
      textStyle={{
        color: 'black',
        fontSize: 14
      }}
      listMode="SCROLLVIEW"
      zIndex={3000}
    zIndexInverse={1000}
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
                  selectedValue={selectedCountry}
                  onSelectionChange={value => {
                    // console.log('Country', value);
                    setFieldValue('country', value);
                    handleCountryChange(value);
                    handleBlur('country');
                  }}
                  displayText={
                    selectedCountry ? Profiledata.countryName : 'Select Country'
                  }
                  title={'Select Country'}
                />
                {/* <Select
                  placeholder="Select Country"
                  selectedValue={selectedCountry}
                  onValueChange={value => {
                    handleCountryChange(value);
                    setFieldValue('officeCountryId', value);
                    // Manually set the field value
                  }}>
                  {CountryData.map(country => (
                    <Select.Item
                      key={country.countryId}
                      label={country.countryName}
                      value={country.countryId}
                    />
                  ))}
                </Select> */}
                {errors.officeCountryId && (
                  <Box pl="3" mt="2">
                    <ZText type={'R12'} style={styles.errorText}>
                      {errors.officeCountryId}
                    </ZText>
                  </Box>
                )}
              </Stack>
            </Box>
            <Box mb="5">
              <ZText type={'M16'} style={localStyles.label}>
                State
              </ZText>
              <Stack>
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
      onChangeValue={(value) => {
        console.log("State");
        console.log(value);
        // handleStateChange(value);
        // setFieldValue('state', value);

        //setFieldValue('city', '');
                         
      }}
      onSelectItem={(item) => {
        console.log("onSelectItem");
        handleStateChange(item.stateId);
        setFieldValue('officeStateId', item.stateId);
        //setFieldValue('officeCityId', '');
        console.log(item);
      }}
      style={{
        borderRadius: 5,
        borderColor: '#D9D9D9',
        paddingLeft:15
      }}
      textStyle={{
        color: 'black',
        fontSize: 14
      }}
      listMode="SCROLLVIEW"
      zIndex={2000}
      zIndexInverse={2000}
 
    /> */}
                {/* <DropDownHandler
                  data={StatesDataForSelect}
                  alreadySelected={selectedState}
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
                {/* <Select
                  isDisabled={statesData.length === 0}
                  placeholder="Select State"
                  selectedValue={selectedState}
                  onValueChange={value => {
                    handleStateChange(value);
                    setFieldValue('officeStateId', value);
                  }}>
                  {statesData.map(state => (
                    <Select.Item
                      key={state.stateId}
                      label={state.stateName}
                      value={state.stateId}
                    />
                  ))}
                </Select> */}
                {errors.officeStateId && (
                  <Box pl="3" mt="2">
                    <ZText type={'R12'} style={styles.errorText}>
                      {errors.officeStateId}
                    </ZText>
                  </Box>
                )}
              </Stack>
            </Box>
            <Box mb="5">
              <ZText type={'M16'} style={localStyles.label}>
                City
              </ZText>
              <Stack>
                {/* <DropDownPicker
                     placeholder="Select city"
                     disabled={cityData.length === 0}
      open={openCity}
      value={selectedCity}
      items={cityData}
      setOpen={setOpenCity}
      setValue={setSelectedCity}
      searchable={true}
     // setItems={CountryData}
      schema={{
        label: 'cityName', // required
        value: 'cityId', // required
      
      }}
      onChangeValue={(value) => {
        // setselectedcity(value);
        // setFieldValue('city', value);
       // handleBlur('city');
      }}
      onSelectItem={(item) => {
        setSelectedCity(item.cityId);
        setFieldValue('officeCityId', item.cityId);
      }}
      style={{
        borderRadius: 5,
        borderColor: '#D9D9D9',
        paddingLeft:15
      }}
      textStyle={{
        color: 'black',
        fontSize: 14
      }}
      listMode="SCROLLVIEW"
      zIndex={1000}
      zIndexInverse={3000}
    /> */}
                {/* <DropDownHandler
                  data={CityDataForSelect}
                  alreadySelected={selectedCity}
                  onValueChange={value => {
                    setFieldValue('city', value);
                    handleCityChange(value);
                  }}
                  placeholder={'Select City'}
                  isDisabled={!selectedState}
                /> */}
                <SingleSelectComponent
                   selectedValue={selectedCity}
                  data={CityDataForSelect}
                  onSelectionChange={value => {
                    setFieldValue('city', value);
                    handleCityChange(value);
                    handleBlur('city');
                  }}
                  isDisabled={!selectedState}
                  displayText={
                    Profiledata?.officeCityId
                      ? Profiledata?.cityName
                      : 'Select City'
                  }
                  title={'Select City'}
                />
                {/* <Select
                  isDisabled={cityData.length === 0}
                  placeholder="Select City"
                  selectedValue={selectedCity}
                  onValueChange={value => {
                    setSelectedCity(value);
                    setFieldValue('officeCityId', value);
                    // Manually set the field value
                  }}>
                  {cityData.map(city => (
                    <Select.Item
                      key={city.cityId}
                      label={city.cityName}
                      value={city.cityId}
                    />
                  ))}
                </Select> */}
                {errors.officeCityId && (
                  <Box pl="3" mt="2">
                    <ZText type={'R12'} style={styles.errorText}>
                      {errors.officeCityId}
                    </ZText>
                  </Box>
                )}
              </Stack>
            </Box>
            <Box mb="5">
              <ZText type={'M16'} style={localStyles.label}>
                Website
              </ZText>
              <Stack>
                <Input
                  placeholder="Website"
                  value={values.officeWebsite}
                  onChangeText={handleChange('officeWebsite')}
                />
                {errors.officeWebsite && (
                  <Box pl="3" mt="2">
                    <ZText type={'R12'} style={styles.errorText}>
                      {errors.officeWebsite}
                    </ZText>
                  </Box>
                )}
              </Stack>
            </Box>
            <Button
              mt="5"
              mb="5"
              block
              style={[
                styles.button,
                dirty && isValid && styles.validButton, // Apply validButton style when form is valid
              ]}
              onPress={handleSubmit}
              disabled={!isValid}>
              <ZText type={'M14'} color="white" fontWeight="bold">
                Update
              </ZText>
            </Button>
          </>
        )}
      </Formik>
    </ScrollView>
  );
};

const localStyles = StyleSheet.create({
  root: {
    ...styles.flex,
    ...styles.ph20,
    ...styles.mb20,
  },
  label: {
    textTransform: 'capitalize',
    marginBottom: 10,
    ...typography.fontWeights.Medium,
    ...typography.fontSizes.f16,
  },
});

export default AppBaseContainer(OfficeDetailsForm, 'Office Details');
