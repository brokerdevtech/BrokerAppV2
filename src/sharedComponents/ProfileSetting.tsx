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
import {Icon} from '../../components/ui/icon';
import {moderateScale} from '../config/constants';
import {Button} from '../../components/ui/button';
import {Input} from '../../components/ui/input';

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
      style={localStyles.root}>
      {pr.map((item, index) => {
        return (
          <TouchableOpacity
            disabled={item.title === strings.darkMode}
            onPress={() => onPressItem(item)}
            key={index}
            activeOpacity={item.rightIcon ? 1 : 0.5}
            style={localStyles.settingsContainer}>
            {/* <Icon
              name={item.icon}
              size={moderateScale(24)}
              color={color.dark ? color.white : color.darkColor}
            /> */}
            <ZText type="M16" style={styles.ml15}>
              {item.title}
            </ZText>
            <Box>
              <Icon
                name={'chevron-forward-outline'}
                size={moderateScale(24)}
                color={color.dark ? color.white : color.darkColor}
              />
            </Box>
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity
        onPress={handleResetPassword}
        style={localStyles.settingsContainer}>
        {/* <Icon
          name={'lock-closed-outline'}
          size={moderateScale(24)}
          color={color.dark ? color.white : color.darkColor}
        /> */}
        <ZText type="M16" style={styles.ml15}>
          Reset Password
        </ZText>
        <Box>
          {/* <Icon
            name={'chevron-forward-outline'}
            size={moderateScale(24)}
            color={color.dark ? color.white : color.darkColor}
          /> */}
        </Box>
      </TouchableOpacity>

      <View style={localStyles.list}>
        {/* <Icon
          style={localStyles.listicons}
          name={'reader-outline'}
          size={moderateScale(24)}
          color={color.dark ? color.white : color.darkColor}
        /> */}

        {/* <DBMultiSelectPicker
          data={Profiledata?.specializations}
          id={'skillId'}
          TextValue={'skillName'}
          pickerName="Specialization"
          onSelectionChange={onPressSelectionChange}></DBMultiSelectPicker> */}
      </View>
      {/* <Box ></Box> */}

      <TouchableOpacity
        onPress={() => setDeleteAccountModalVisible(true)}
        style={localStyles.settingsContainer}>
        {/* <Icon
          name={'trash-bin-outline'}
          size={moderateScale(24)}
          color={color.dark ? color.white : color.darkColor}
        /> */}
        <Text style={styles.ml15}>Delete Account</Text>
        <Box>
          {/* <Icon
            name={'chevron-forward-outline'}
            size={moderateScale(24)}
            color={color.dark ? color.white : color.darkColor}
          /> */}
        </Box>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onPressLogOutBtn}
        style={localStyles.settingsContainer}>
        {/* <Icon
          name={'log-out-outline'}
          size={moderateScale(30)}
          color={color.dark ? color.white : color.darkColor}
        /> */}
        <ZText type="M16" style={styles.ml15}>
          {strings.logout}
        </ZText>
        <Box>
          <Icon
            name={'chevron-forward-outline'}
            size={moderateScale(24)}
            color={color.dark ? color.white : color.darkColor}
          />
        </Box>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={resetModal}
        onRequestClose={handleModalClose}>
        <View style={localStyles.modalContainer}>
          <TouchableOpacity
            onPress={handleModalClose}
            style={localStyles.closeButton}>
            <Icon
              name={'close-outline'}
              size={moderateScale(30)}
              color={color.dark ? color.white : color.darkColor}
            />
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
                  <Stack>
                    <Input
                      InputRightElement={
                        <Pressable
                          onPress={() => setShowOldPassword(!showOldPassword)}>
                          <Icon
                            as={<Icon name="eye-outline" />}
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
                  </Stack>
                </Box>

                <Box mb="5">
                  <Stack>
                    <Input
                      type={show ? 'text' : 'password'}
                      InputRightElement={
                        <Pressable onPress={() => setShow(!show)}>
                          <Icon
                            as={<Icon name="eye-outline" />}
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
                  </Stack>
                </Box>

                <Box mb="5">
                  <Stack>
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      InputRightElement={
                        <Pressable
                          onPress={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }>
                          <Icon
                            as={<Icon name="eye-outline" />}
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
                  </Stack>
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
      </Modal>

      {/* <NModal
        isOpen={deleteAccountModalVisible}
        onClose={() => setDeleteAccountModalVisible(false)}
        avoidKeyboard
        justifyContent="center"
        bottom="10"
        size="lg">
        <NModal.Content>
          <NModal.CloseButton />
          <NModal.Header>Delete Account</NModal.Header>
          <NModal.Body>
            <Text>
              Are you sure you want to delete your account? This action cannot
              be undone.
            </Text>
          </NModal.Body>
          <NModal.Footer>
            <Button flex="1" onPress={handleDeleteAccountConfirm}>
              Delete Account
            </Button>
          </NModal.Footer>
        </NModal.Content>
      </NModal> */}
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
