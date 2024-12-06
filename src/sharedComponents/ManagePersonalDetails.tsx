import React, {useEffect, useRef, useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
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
import {useApiRequest} from '../hooks/useApiRequest';
import {getBrokerCategoryList} from '../../BrokerAppCore/services/new/authService';
import {UpdateProfile} from '../../BrokerAppCore/services/new/profileServices';
import {setUser} from '../../BrokerAppCore/redux/store/user/userSlice';
import store from '../../BrokerAppCore/redux/store';
import {getList, updateNestedObject} from '../utils/helpers';
import {Toast, ToastDescription} from '../../components/ui/toast';
import {useSelector} from 'react-redux';
import {RootState} from '../../BrokerAppCore/redux/store/reducers';
import useUserJourneyTracker from '../hooks/Analytics/useUserJourneyTracker';

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
  Location: yup.object().required('Location is required'),
  officeLocation: yup.object().required('Location is required'),
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
  toastMessage,
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
  const [toastId, setToastId] = React.useState(0);
  const AppLocation = useSelector((state: RootState) => state.AppLocation);
  const [selectedCountry, setSelectedCountry] = useState(
    Profiledata?.countryId,
  );
  const {logButtonClick} = useUserJourneyTracker(`Manage Personal Details`);
  const [localities, setLocalities] = useState({});
  const [officeLocalities, setOfficeLocalities] = useState({});
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const {
    data: categorydata,
    status: categorystatus,
    error: categoryerror,
    execute: categoryexecute,
  } = useApiRequest(getBrokerCategoryList, setLoading);
  const {
    data: profileUpdatedata,
    status: profileUpdatestatus,
    error: profileUpdateerror,
    execute: profileUpdateexecute,
  } = useApiRequest(UpdateProfile, setLoading);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectDate, setselectDate] = useState(
    Profiledata?.reraExpiryDate
      ? new Date(`${Profiledata.reraExpiryDate}T00:00:00`)
      : '',
  );

  const minDate = new Date();
  const formikRef = useRef();
  // console.log(user, 'user');
  const onFiltersLocalityChange = Localitys => {
    formikRef.current.handleBlur('Location');
    formikRef.current.setFieldValue('Location', Localitys);
    setLocalities(Localitys);
  };
  const onFiltersOfficeLocalityChange = Localitys => {
    formikRef.current.handleBlur('officeLocation');
    formikRef.current.setFieldValue('officeLocation', Localitys);
    setOfficeLocalities(Localitys);
  };
  const fetchCategoryData = async () => {
    await categoryexecute();
  };

  useEffect(() => {
    fetchCategoryData();
  }, []);
  useEffect(() => {
    if (profileUpdatestatus == 200) {
      const fetdata = async () => {
        let obj = {
          ...user,
          firstName: profileUpdatedata.data.firstName,
          lastName: profileUpdatedata.data.lastName,
        };

        store.dispatch(setUser(obj));

        navigation.navigate('ProfileScreen');
      };
      fetdata();
    }
  }, [profileUpdatestatus]);
  const IndustryDataForSelect = categorydata?.data?.categories.map(
    industry => ({
      label: industry.categoryName,
      value: industry.categoryId,
    }),
  );
  const handleSubmit = async values => {
    try {
      Keyboard.dismiss();
      const year = selectDate.getFullYear().toString();
      const month = (selectDate.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-based, so add 1
      const day = selectDate.getDate().toString().padStart(2, '0');
      const isLocationchanged = Profiledata.location === values.location;

      // Create the formatted date string as "yyyy-mm-dd"
      const formattedDate = `${year}-${month}-${day}`;

      // const mappedIndustries = values.industry.map(id => {
      //   const matchedIndustry = IndustryDataForSelect.find(
      //     industry => industry.value === id,
      //   );
      //   return {
      //     industryName: matchedIndustry.label,
      //     industryId: matchedIndustry.value,
      //   };
      // });
      const updateObj = {
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
        // industry: mappedIndustries,
        cityName: values.Location.City || values.Location.cityName,
        stateName: values.Location.State || values.Location.stateName,
        countryName: values.Location.Country || values.Location.countryName,
        officeCountryName:
          values.officeLocation.Country || values.Location.countryName,
        officeStateName:
          values.officeLocation.State || values.Location.stateName,
        officeCityName: values.officeLocation.City || values.Location.cityName,
        officeAddress: values.officeLocation.placeName,
        specialization: getList(Profiledata.specializations),
        userLocation: [],
      };
      delete Result['location'];
      delete Result['officeLocation'];
      delete Result['userPermissions'];

      await profileUpdateexecute(Result);

      if (profileUpdatestatus == 200) {
        toastMessage('Profile Updated');
      }
    } catch (error) {}
  };

  const AlreadySelectIndustry = Profiledata.industries.map(industry => {
    return industry.industryId;
  });
  // console.log(categorystatus, 'pd');
  const locationData = [
    {
      place: {
        ...Profiledata.location,
        placeName: Profiledata.location.cityName,
      },
    },
  ];
  const OfficeLocationData = [
    {
      place: {
        ...Profiledata.officeLocation,
        placeName: Profiledata.officeLocation.cityName,
      },
    },
  ];
  useEffect(() => {
    const catedate = async () => {
      if (categorystatus) {
        await categorydata;
      }
    };
    catedate();
  }, [categorystatus]);

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
            Location: Profiledata.location,
            officeLocation: Profiledata.officeLocation,
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
              <ZText type={'R15'} style={localStyles.label}>
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

              <ZText type={'R15'} style={localStyles.label}>
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

              <ZText type={'R15'} style={localStyles.label}>
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

              <ZText type={'R15'} style={localStyles.label}>
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

              <ZText type={'R15'} style={localStyles.label}>
                Industry
              </ZText>
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
                alreadySelected={AlreadySelectIndustry}
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

              <ZText type={'R15'} style={localStyles.label}>
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

              <ZText type={'R15'} style={localStyles.label}>
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
              <Box mb="5" style={localStyles.BoxStyles}>
                <ZText type={'R15'} style={localStyles.label}>
                  Your Location
                </ZText>
                <LocalityTag
                  screenType="personal"
                  selectedLocation={locationData}
                  onLocalityChange={onFiltersLocalityChange}
                  isMandatory={true}
                />
              </Box>
              <Box mb="5" style={localStyles.BoxStyles}>
                <ZText type={'R15'} style={localStyles.label}>
                  Office Location
                </ZText>
                <LocalityTag
                  screenType="personal"
                  selectedLocation={OfficeLocationData}
                  placeholder="Office Location"
                  onLocalityChange={onFiltersOfficeLocalityChange}
                  isMandatory={true}
                />
              </Box>

              <TouchableOpacity
                onPress={() => {
                  setShowDatePicker(true);
                }}
                style={{justifyContent: 'space-between', flexDirection: 'row'}}>
                <ZText type={'R16'} style={localStyles.label}>
                  Rera Expiry Date:
                  {selectDate != '' ? selectDate.toDateString() : ''}
                </ZText>

                <Icon as={Calender_Icon} size="xl" />
              </TouchableOpacity>

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

              {errors.reraExpiryDate && (
                <ZText type={'R12'} style={styles.errorText}>
                  {errors.reraExpiryDate}
                </ZText>
              )}

              <Button
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
    color: '#E00000',
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
