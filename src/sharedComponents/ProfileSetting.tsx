/* eslint-disable react-native/no-inline-styles */
// Library import
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  Platform,
  Text,
  Modal,
  Pressable,
  TextInput,
} from 'react-native';

import React, {useState} from 'react';
import {useDispatch} from 'react-redux';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {Formik} from 'formik';
import * as yup from 'yup';

import ZText from './ZText';
import {ProfileSetting as pr} from '../constants/constants';

import {getList, updateNestedObject} from '../utils/helpers';

import {useFocusEffect} from '@react-navigation/native';

import AppBaseContainer from '../hoc/AppBaseContainer_old';
import {
  UpdateProfile,
  getProfile,
} from '../../BrokerAppCore/services/profileService';

import {clearTokens} from '../utils/utilTokens';
import {
  logoutUser,
  setUser,
} from '../../BrokerAppCore/redux/store/user/userSlice';

import {Toast, ToastDescription, useToast} from '../../components/ui/toast';
import {Box} from '../../components/ui/box';
import {styles} from '../themes';
import {
  ChevronRightIcon,
  CloseCircleIcon,
  EyeIcon,
  EyeOffIcon,
  Icon,
} from '../../components/ui/icon';

import {Button, ButtonText} from '../../components/ui/button';
import {
  Input,
  InputField,
  InputIcon,
  InputSlot,
} from '../../components/ui/input';
import {Delete_Account_Icon, logout_icon, Reset_Pass_Icon} from '../assets/svg';
import {Color} from '../styles/GlobalStyles';
import {useApiRequest} from '../hooks/useApiRequest';
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from '../../components/ui/alert-dialog';
import {UpdateNewPassword} from '../../BrokerAppCore/services/new/profileServices';
import {
  DeactivateUser,
  Logout,
} from '../../BrokerAppCore/services/new/authService';

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
  const [showAlertDialog, setShowAlertDialog] = React.useState(false);
  const [showAlertDelete, setShowAlertDelete] = React.useState(false);
  const [toastId, setToastId] = React.useState(0);
  const {
    data: logoutData,
    status: logoutStatus,
    error: logouterror,
    execute: logoutExecute,
  } = useApiRequest(Logout);
  const {
    data: deleteUserData,
    status: deleteUserStatus,
    error: deleteUsererror,
    execute: deleteUserExecute,
  } = useApiRequest(DeactivateUser);
  const {
    data: UpdateUserPassData,
    status: UpdateUserPassStatus,
    error: UpdateUserPasserror,
    execute: UpdateUserPassExecute,
  } = useApiRequest(UpdateNewPassword);
  const handleClose = () => setShowAlertDialog(false);
  const handleCloseDelete = () => setShowAlertDelete(false);
  const LogoutProceed = async () => {
    await logoutExecute();
    await AsyncStorage.removeItem('User');
    await clearTokens();
    await AsyncStorage.clear();

    await dispatch(logoutUser());
    await new Promise(resolve => setTimeout(resolve, 100));
    // Reset navigation stack or redirect as necessary here
  };
  const DeleteUserProceed = async () => {
    await deleteUserExecute(user.userId);

    LogoutProceed();
  };
  const handleInputChange = (field, value, setFieldValue) => {
    setFieldValue(field, value);
  };

  const handleSubmit = async (values, {setSubmitting}) => {
    try {
      setSubmitting(false);

      await UpdateUserPassExecute(
        values.oldpassword,
        values.newpassword,
        values.confirmPassword,
      );

      if (UpdateUserPassStatus == 200) {
        setResetModal(false);
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
                  <ToastDescription>Reset Password Success</ToastDescription>
                </Toast>
              );
            },
          });
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
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
        onPress={() => setShowAlertDelete(true)}
        style={localStyles.setting_option}>
        <View style={styles.flexRow}>
          <Icon as={Delete_Account_Icon} />
          <ZText type={'R16'} style={localStyles.setting_label}>
            Delete Account
          </ZText>
        </View>
        <Icon as={ChevronRightIcon} />
      </TouchableOpacity>
      <AlertDialog
        isOpen={showAlertDelete}
        onClose={handleCloseDelete}
        size="md">
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <ZText
              type={'S18'}
              style={{marginBottom: 20}}
              // className="text-typography-950 font-semibold"
            >
              Are you sure you want to delete account?
            </ZText>
          </AlertDialogHeader>
          <AlertDialogBody className="mt-3 mb-4">
            <ZText type={'R16'} style={{marginBottom: 20}} size="sm">
              Please confirm if you want to proceed.
            </ZText>
          </AlertDialogBody>
          <AlertDialogFooter style={{justifyContent: 'center'}}>
            <Button
              variant="outline"
              action="secondary"
              style={{borderColor: Color.primary}}
              onPress={handleCloseDelete}
              size="md">
              <ZText type={'R16'} color={Color.primary}>
                Cancel
              </ZText>
            </Button>
            <Button
              size="md"
              style={{backgroundColor: Color.primary}}
              onPress={DeleteUserProceed}>
              <ButtonText>Delete</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Logout Button */}

      <Modal
        animationType="slide"
        transparent={true}
        visible={resetModal}
        onRequestClose={handleModalClose}>
        <View style={localStyles.modalContainer}>
          <TouchableOpacity
            onPress={handleModalClose}
            style={localStyles.closeButton}>
            <Icon as={CloseCircleIcon} size="xl" />
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
                <ZText type={'R16'} style={localStyles.label}>
                  Current Password
                </ZText>
                <Input style={localStyles.input}>
                  <InputField
                    type={showOldPassword ? 'text' : 'password'}
                    placeholder="Current Password"
                    value={values.oldpassword}
                    onChangeText={value =>
                      handleInputChange('oldpassword', value, setFieldValue)
                    }
                    onBlur={handleBlur('oldpassword')}
                  />
                  <InputSlot
                    style={{marginRight: 10}}
                    onPress={() => setShowOldPassword(!showOldPassword)}>
                    <InputIcon
                      as={showOldPassword ? EyeIcon : EyeOffIcon}
                      stroke="#000"
                    />
                  </InputSlot>
                </Input>

                {errors.oldpassword && touched.oldpassword && (
                  <ZText type={'R12'} style={styles.errorText}>
                    {errors.oldpassword}
                  </ZText>
                )}

                <ZText type={'R16'} style={localStyles.label}>
                  New Password
                </ZText>
                <Input style={localStyles.input}>
                  <InputField
                    type={show ? 'text' : 'password'}
                    placeholder="New Password"
                    value={values.newpassword}
                    onChangeText={value =>
                      handleInputChange('newpassword', value, setFieldValue)
                    }
                    onBlur={handleBlur('newpassword')}
                    disabled={isSubmitting}
                  />
                  <InputSlot
                    style={{marginRight: 10}}
                    onPress={() => setShow(!show)}>
                    <InputIcon as={show ? EyeIcon : EyeOffIcon} stroke="#000" />
                  </InputSlot>
                </Input>
                {errors.newpassword && touched.newpassword && (
                  <ZText type={'R12'} style={styles.errorText}>
                    {errors.newpassword}
                  </ZText>
                )}

                <ZText type={'R16'} style={localStyles.label}>
                  Confirm Password
                </ZText>
                <Input style={localStyles.input}>
                  <InputField
                    type={showConfirmPassword ? 'text' : 'password'}
                    // type={showOldPassword ? 'text' : 'password'}
                    placeholder="Confirm Password"
                    value={values.confirmPassword}
                    onChangeText={value =>
                      handleInputChange('confirmPassword', value, setFieldValue)
                    }
                    onBlur={handleBlur('confirmPassword')}
                    disabled={isSubmitting}
                  />
                  <InputSlot
                    style={{marginRight: 10}}
                    onPress={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }>
                    <InputIcon
                      as={showConfirmPassword ? EyeIcon : EyeOffIcon}
                      stroke="#000"
                    />
                  </InputSlot>
                </Input>
                {errors.confirmPassword && touched.confirmPassword && (
                  <ZText type={'R12'} style={styles.errorText}>
                    {errors.confirmPassword}
                  </ZText>
                )}

                <Button
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
  input: {
    borderWidth: 0,
    borderColor: '#ddd',
    borderRadius: 5,
    // padding: 10,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    height: 43,
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
  label: {
    marginBottom: 10,
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
