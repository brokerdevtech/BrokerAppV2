/* eslint-disable react-native/no-inline-styles */
// Library import
import {
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
  ScrollView,
  DevSettings,
  KeyboardAvoidingView,
  Platform,
  Text,
  Modal,
  Pressable,
  Alert,
  TextInput,
} from 'react-native';

import React, {createRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {Formik} from 'formik';
import * as yup from 'yup';
// Local import

import strings from '../i18n/strings';

import ZText from './ZText';
import {ProfileSetting as pr} from '../constants/constants';

import {
  getList,
  setAsyncStorageData,
  updateNestedObject,
} from '../utils/helpers';

// import DBMultiSelectPicker from '../../components/DBMultiSelectPicker';
// import flex from '../../themes/flex';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
// import {StackActions} from '@react-navigation/native';
// import FileUpload from '../../components/common/FileUpload';
// import LoadingSpinner from '../../components/LoadingSpinner';
import AppBaseContainer from '../hoc/AppBaseContainer_old';
import {
  UpdateProfile,
  getProfile,
  UpdateNewPassword,
} from '../../BrokerAppCore/services/profileService';
import {DeactivateUser, Logout} from '../../BrokerAppCore/services/authService';
import {clearTokens} from '../utils/utilTokens';
import {
  logoutUser,
  setUser,
} from '../../BrokerAppCore/redux/store/user/userSlice';

import {Toast, useToast} from '../../components/ui/toast';
import {Box} from '../../components/ui/box';
import {styles} from '../themes';
import {ChevronRightIcon, EyeIcon, Icon} from '../../components/ui/icon';
import {moderateScale} from '../config/constants';
import {Button} from '../../components/ui/button';
import {Input} from '../../components/ui/input';
import {
  Delete_Account_Icon,
  logout_icon,
  Reset_Pass_Icon,
  settings_icon,
} from '../assets/svg';
import {Color} from '../styles/GlobalStyles';

const validationSchema = yup.object().shape({
  oldpassword: yup
    .string()
    .required('Old Password is required')
    .min(8, 'Password must be at least 8 characters'),
  newpassword: yup
    .string()
    .required('New Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    ),
  confirmPassword: yup
    .string()
    .required('Confirm password is required')
    .oneOf([yup.ref('newpassword'), null], 'Passwords must match'),
});

const ProfileSetting: React.FC = ({
  isPageSkeleton,
  toggleSkeletonoff,
  toggleSkeletonOn,
  setLoading,
  navigation,
  user,
  color,
  route,
}) => {
  // const [isLoading, setIsLoading] = useState(false);
  // const navigation = useNavigation();
  //const color = useSelector(state => state.theme.theme);
  // const route = useRoute();
  //const Profiledata = route.params?.data || {}; // Access the passed data
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [resetModal, setResetModal] = useState(false);

  const handleModalOpen = () => {
    setModalVisible(true);
  };

  const handlePlaceSelected = place => {
    setSelectedPlace(place);
  };
  const handleResetPassword = () => {
    setResetModal(true);
  };

  const handleModalClose = () => {
    setResetModal(false);
  };
  const data = [
    {isSelected: 1, roleId: 1, roleName: 'Broker'},
    {isSelected: 1, roleId: 2, roleName: 'Broke1'},
    {isSelected: 0, roleId: 3, roleName: 'Broke3'},
  ];
  const toast = useToast();
  const dispatch = useDispatch();
  const [Profiledata, setProfiledata] = useState(route.params?.data || {});
  const [ProfileDataRest, setProfileDataRest] = useState(false);
  const [show, setShow] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleInputChange = (field, value, setFieldValue) => {
    setFieldValue(field, value);
  };

  const handleSubmit = async (values, {setSubmitting}) => {
    try {
      setSubmitting(false);
      setLoading(true);
      const result = await UpdateNewPassword(
        values.oldpassword,
        values.newpassword,
        values.confirmPassword,
      );
      //     console.log("-----------result");
      // console.log(result);

      if (result.status == 200) {
        setLoading(false);
        toast.show({
          description: 'Password has been changed.',
        });
        setResetModal(false);
      }
      if (result.status == 'error') {
        setLoading(false);
        Toast.show({
          description: result.error,
        });
        setResetModal(false);
      }
    } catch (error) {
      console.error('Error submitting form:', error);

      Toast.show({
        description: 'Your password is incorrect. Please try again.',
      });

      setSubmitting(false);
      setResetModal(false);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      toggleSkeletonOn();
      const getUserProfile = async () => {
        try {
          const result = await getProfile(user.userId);

          setProfiledata(result.data);

          // setCountryData(result.data);
          toggleSkeletonoff();
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      getUserProfile();
      return () => {
        // Code to execute when the screen loses focus (optional)
      };
    }, [ProfileDataRest]),
  );

  const onPressItem = item => {
    if (item.route === 'ManagePersonalDetails') {
      navigation.navigate(item.route, {title: item.title, data: Profiledata});
    }
    if (item.route === 'ProfileKyc') {
      navigation.navigate(item.route, {title: item.title, data: Profiledata});
    }
    if (item.route === 'OfficeDetails') {
      navigation.navigate(item.route, {title: item.title, data: Profiledata});
    }
  };
  const onPressSelectionChange = async items => {
    try {
      const selectedSkills = new Set(items);

      const updatedArr2 = Profiledata.specializations.map(item => ({
        ...item,
        isSelected: selectedSkills.has(item.skillId) ? 1 : 0,
      }));

      let officeDetails = {};
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
        specialization: getList(updatedArr2),
        userLocation: [],
      };

      setLoading(true);
      let k = await UpdateProfile(Result);
      setLoading(false);
      setProfileDataRest(!ProfileDataRest);

      // Handle the submission of office details here
    } catch (error) {}
  };
  const onPressLogOutBtn = async () => {
    Alert.alert(
      'Confirm Logout', // Title of the alert
      'Are you sure you want to log out?', // Message of the alert
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Logout cancelled'),
          style: 'cancel',
        },
        {
          text: 'Log Out',
          onPress: async () => {
            setLoading(true);
            await Logout();
            await AsyncStorage.removeItem('User');
            await clearTokens();
            await AsyncStorage.clear();
            setLoading(false);
            await dispatch(logoutUser());
            await new Promise(resolve => setTimeout(resolve, 100));
            // Reset navigation stack or redirect as necessary here
          },
        },
      ],
      {cancelable: false},
    );
  };
  const [deleteAccountModalVisible, setDeleteAccountModalVisible] =
    useState(false);

  // Handle account deletion confirmation
  const handleDeleteAccountConfirm = async () => {
    // Close the modal
    setLoading(true);
    await DeactivateUser(user.userId);

    setDeleteAccountModalVisible(false);
    onPressLogOutBtn();
  };
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      bounces={false}
      showsVerticalScrollIndicator={false}
      style={{flex: 1, padding: 20}}>
      {pr.map((item, index) => (
        <TouchableOpacity
          key={index}
          disabled={item.title === 'Dark Mode'}
          onPress={() => onPressItem(item)}
          activeOpacity={item.rightIcon ? 1 : 0.5}
          style={localStyles.setting_option}>
          <View style={styles.flexRow}>
            <Icon as={item.icon} />
            <ZText type={'R16'} style={localStyles.setting_label}>
              {item.title}
            </ZText>
          </View>

          <Icon as={item.icon2} />
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        onPress={handleResetPassword}
        style={localStyles.setting_option}>
        <View style={styles.flexRow}>
          <Icon as={Reset_Pass_Icon} size={'xl'} />
          <ZText type={'R16'} style={localStyles.setting_label}>
            Reset Password
          </ZText>
        </View>
        <Icon as={ChevronRightIcon} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => console.log('Delete Account')}
        style={localStyles.setting_option}>
        <View style={styles.flexRow}>
          <Icon as={Delete_Account_Icon} />
          <ZText type={'R16'} style={localStyles.setting_label}>
            Delete Account
          </ZText>
        </View>
        <Icon as={ChevronRightIcon} />
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity
        onPress={() => console.log('Logout')}
        style={localStyles.setting_option}>
        <View style={styles.flexRow}>
          <Icon as={logout_icon} size={'xl'} />
          <ZText type={'R16'} style={localStyles.setting_label}>
            Logout
          </ZText>
        </View>
        <Icon as={ChevronRightIcon} />
      </TouchableOpacity>

      {/* Reset Password Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={resetModal}
        onRequestClose={handleModalClose}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View
            style={{
              width: '80%',
              backgroundColor: '#fff',
              padding: 20,
              borderRadius: 10,
            }}>
            <TouchableOpacity
              onPress={handleModalClose}
              style={{alignSelf: 'flex-end'}}>
              <Text style={{fontSize: 24}}>X</Text>
            </TouchableOpacity>

            <Formik
              initialValues={{
                oldpassword: '',
                newpassword: '',
                confirmPassword: '',
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}>
              {({
                handleChange,
                handleSubmit,
                handleBlur,
                values,
                errors,
                setFieldValue,
                touched,
                isValid,
                isSubmitting,
              }) => (
                <View style={localStyles.containerView}>
                  <Box mb="5">
                    <Input
                      InputRightElement={
                        <Pressable
                          onPress={() => setShowOldPassword(!showOldPassword)}>
                          <Icon
                            as={EyeIcon}
                            size={5}
                            mr="2"
                            color="muted.400"
                          />
                        </Pressable>
                      }
                      type={showOldPassword ? 'text' : 'password'}
                      placeholder="Current Password"
                      value={values.oldpassword}
                      onChangeText={value =>
                        handleInputChange('oldpassword', value, setFieldValue)
                      }
                      onBlur={handleBlur('oldpassword')}
                      disabled={isSubmitting}
                    />
                    {errors.oldpassword && touched.oldpassword && (
                      <Box pl="3" mt="2">
                        <ZText type={'R12'} style={styles.errorText}>
                          {errors.oldpassword}
                        </ZText>
                      </Box>
                    )}
                  </Box>

                  <Box mb="5">
                    <Input
                      type={show ? 'text' : 'password'}
                      InputRightElement={
                        <Pressable onPress={() => setShow(!show)}>
                          <Icon
                            as={EyeIcon}
                            size={5}
                            mr="2"
                            color="muted.400"
                          />
                        </Pressable>
                      }
                      placeholder="New Password"
                      value={values.newpassword}
                      onChangeText={value =>
                        handleInputChange('newpassword', value, setFieldValue)
                      }
                      onBlur={handleBlur('newpassword')}
                      disabled={isSubmitting}
                    />
                    {errors.newpassword && touched.newpassword && (
                      <Box pl="3" mt="2">
                        <ZText type={'R12'} style={styles.errorText}>
                          {errors.newpassword}
                        </ZText>
                      </Box>
                    )}
                  </Box>

                  <Box mb="5">
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      InputRightElement={
                        <Pressable
                          onPress={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }>
                          <Icon
                            as={EyeIcon}
                            size={5}
                            mr="2"
                            color="muted.400"
                          />
                        </Pressable>
                      }
                      // type={showOldPassword ? 'text' : 'password'}
                      placeholder="Confirm Password"
                      value={values.confirmPassword}
                      onChangeText={value =>
                        handleInputChange(
                          'confirmPassword',
                          value,
                          setFieldValue,
                        )
                      }
                      onBlur={handleBlur('confirmPassword')}
                      disabled={isSubmitting}
                    />
                    {errors.confirmPassword && touched.confirmPassword && (
                      <Box pl="3" mt="2">
                        <ZText type={'R12'} style={styles.errorText}>
                          {errors.confirmPassword}
                        </ZText>
                      </Box>
                    )}
                  </Box>

                  <Button
                    mt="5"
                    mb="5"
                    bg="primary.600"
                    block
                    style={[styles.button, isValid && styles.validButton]}
                    onPress={handleSubmit}
                    disabled={!isValid || isSubmitting}>
                    <Text style={{color: '#ffffff'}} fontWeight="bold">
                      {isSubmitting ? 'Submitting...' : 'Submit'}
                    </Text>
                  </Button>
                </View>
              )}
            </Formik>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const localStyles = StyleSheet.create({
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: '#2196F3', // A nice shade of blue
    marginTop: 10, // Adds space between the buttons
    width: 200, // Sets a fixed width for the buttons
    alignItems: 'center', // Centers button text
  },
  setting_option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Color.borderColor,
  },
  setting_label: {
    marginLeft: 15,
  },
  root: {
    ...styles.flex,
    ...styles.ph20,
    ...styles.mb20,
    ...styles.mt25,
  },
  settingsContainer: {
    ...styles.flexRow,
    ...styles.itemsCenter,
    // ...styles.mb30,
  },
  rightContainer: {
    ...styles.flex,
    ...styles.rowEnd,
  },
  list: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',

    width: '100%',
    ...styles.mb30,
  },
  listicons: {
    width: '10%',
    marginBottom: 0,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS == 'ios' ? 60 : 10,
    right: Platform.OS == 'ios' ? 20 : 10,
  },
  containerView: {
    marginTop: Platform.OS == 'ios' ? 100 : 50,
  },
});

export default AppBaseContainer(ProfileSetting, 'Profile Setting');
