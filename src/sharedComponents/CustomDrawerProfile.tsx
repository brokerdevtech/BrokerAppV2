/* eslint-disable react/no-unstable-nested-components */
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from 'react-native';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {
  Ads_Icon,
  City_icon,
  Follower_Icon,
  Globe,
  info_icon,
  logout_icon,
  Network,
  Network_icon,
  settings_icon,
} from '../assets/svg';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Icon,
  SearchIcon,
} from '../../components/ui/icon';
import ZText from './ZText';
import {Color} from '../styles/GlobalStyles';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../BrokerAppCore/redux/store/reducers';
import {imagesBucketcloudfrontPath, PermissionKey} from '../config/constants';
import {useNavigation} from '@react-navigation/native';
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from '../../components/ui/alert-dialog';
import {Heading} from '../../components/ui/heading';
import {Button} from '../../components/ui/button';
import {logoutUser} from '../../BrokerAppCore/redux/store/user/userSlice';
import {Logout} from '../../BrokerAppCore/services/new/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {clearTokens} from '../utils/utilTokens';
import {useApiRequest} from '../hooks/useApiRequest';
import ZAvatarInitials from './ZAvatarInitials';
import {checkPermission} from '../utils/helpers';
import {Toast, ToastDescription, useToast} from '../../components/ui/toast';

const CustomDrawerItem = ({label, onPress, leftIcon, rightIcon}) => {
  return (
    <TouchableOpacity
      style={[styles.drawerItem, styles.bottomBorder]}
      onPress={onPress}>
      {leftIcon && <Icon as={leftIcon} style={styles.leftIcon} />}

      <ZText type={'R18'} style={styles.drawerLabel}>
        {label}
      </ZText>
      {rightIcon && <Icon as={rightIcon} style={styles.rightIcon} />}
    </TouchableOpacity>
  );
};
const CustomDrawerContent = props => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);

  const userPermissions = useSelector(
    (state: RootState) => state.user?.user?.userPermissions,
  );
  const showToast = () => {
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
              <ToastDescription>
                {'You do not have permission.Contact dev@brokerapp.com.'}
              </ToastDescription>
            </Toast>
          );
        },
      });
    }
  };
  const [isloading, setIsloading] = useState(false);
  const {
    data: logoutData,
    status: logoutStatus,
    error: logouterror,
    execute: logoutExecute,
  } = useApiRequest(Logout);
  const navigation = useNavigation();
  const viewFollower = type => {
    navigation.navigate('FollowerList', {
      userName: user.userName,
      userImage: user.userImage,
      userId: user.userId,
      type: type,
    });
  };
  const toast = useToast();
  const permissionGranted = checkPermission(
    userPermissions,
    PermissionKey?.AllowViewConnection,
  );
  const FollowerpermissionGranted = checkPermission(
    userPermissions,
    PermissionKey?.AllowViewFollowers,
  );
  const FollowingpermissionGranted = checkPermission(
    userPermissions,
    PermissionKey?.AllowViewFollowings,
  );
  const SearchpermissionGranted = checkPermission(
    userPermissions,
    PermissionKey?.AllowSearchUser,
  );
  const [showAlertDialog, setShowAlertDialog] = React.useState(false);
  const handleClose = () => setShowAlertDialog(false);
  const dashboard = useSelector((state: RootState) => state.dashboard);
  console.log("dashboard",dashboard);
  const LogoutProceed = async () => {
    setIsloading(true);
    await logoutExecute();
    await AsyncStorage.removeItem('User');
    await clearTokens();
    await AsyncStorage.clear();

    await dispatch(logoutUser());
    await new Promise(resolve => setTimeout(resolve, 100));
    // Reset navigation stack or redirect as necessary here
    setIsloading(false);
  };
  const [toastId, setToastId] = React.useState(0);
  return (
    <DrawerContentScrollView {...props} style={{marginLeft: 10}}>
      <View style={[styles.drawerHeader, styles.bottomBorder]}>
        <ZAvatarInitials
          sourceUrl={user?.profileImage}
          name={`${user?.firstName} ${user?.lastName}`}
          style={styles.profileImage}
          iconSize={'xl'}
        />
        <ZText type={'R18'} style={styles.nameText}>
          {user?.firstName} {user?.lastName}
        </ZText>
        <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
          <ZText type={'R16'} style={styles.viewProfileText}>
            View Profile
          </ZText>
        </TouchableOpacity>
        {/* <Text style={styles.profileViewers}>300 Profile Viewers</Text> */}
      </View>

      <View style={styles.drawerItemsContainer}>
        <TouchableOpacity style={[styles.drawerItem, styles.bottomBorder]}>
          <ZText type={'S16'} style={styles.drawerLabel}>
            {dashboard?.profileViews}
            <ZText type={'R16'} style={styles.viewProfileText}>
              {' '}
              Profile Viewers
            </ZText>
          </ZText>
        </TouchableOpacity>
        <CustomDrawerItem
          label={`Followers (${dashboard?.followers})`}
          onPress={() => {
            if (FollowerpermissionGranted) {
              viewFollower('Followers');
            } else {
              showToast();
            }
          }}
          leftIcon={Follower_Icon}
          rightIcon={ChevronRightIcon}
        />
        <CustomDrawerItem
        label={`Following (${dashboard?.followings})`}
        
          onPress={() => {
            if (FollowingpermissionGranted) {
              viewFollower('Following');
            } else {
              showToast();
            }
          }}
          leftIcon={Follower_Icon}
          rightIcon={ChevronRightIcon}
        />
        <CustomDrawerItem
          label="Search Brokers"
          onPress={() => {
            SearchpermissionGranted
              ? navigation.navigate('BrokerList')
              : showToast();
          }}
          leftIcon={SearchIcon}
          rightIcon={ChevronRightIcon}
        />
        <CustomDrawerItem
          label="My Network"
          onPress={() => {
            if (permissionGranted) {
              navigation.navigate('ConnectionScreen');
            } else {
              showToast();
            }
          }}
          leftIcon={Network_icon}
          rightIcon={ChevronRightIcon}
        />
        {/* <CustomDrawerItem
          label="My Ads"
          onPress={() => {}}
          leftIcon={Ads_Icon}
          rightIcon={ChevronRightIcon}
        /> */}
        {/* <CustomDrawerItem
          label="Language"
          onPress={() => {}}
          leftIcon={Globe}
          rightIcon={ChevronRightIcon}
        />
        <CustomDrawerItem
          label="Support"
          onPress={() => {}}
          leftIcon={settings_icon}
          rightIcon={ChevronRightIcon}
        />
        <CustomDrawerItem
          label="City"
          onPress={() => {}}
          leftIcon={City_icon}
          rightIcon={ChevronRightIcon}
        />
        <CustomDrawerItem
          label="Terms & Conditions"
          onPress={() => {}}
          leftIcon={info_icon}
          rightIcon={ChevronRightIcon}
        /> */}
        <CustomDrawerItem
          label="Log out"
          onPress={() => setShowAlertDialog(true)}
          leftIcon={logout_icon}
          rightIcon={ChevronRightIcon}
        />
      </View>
      <AlertDialog isOpen={showAlertDialog} onClose={handleClose} size="md">
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogBody className="mt-3 mb-4 ">
            <ZText type="S18" style={{marginBottom: 20, textAlign: 'center'}}>
              Are you sure you want to logout?
            </ZText>
            <ZText type="R16" style={{marginBottom: 20, textAlign: 'center'}}>
              Please confirm if you want to proceed.
            </ZText>
          </AlertDialogBody>
          <AlertDialogFooter
            style={{justifyContent: 'center', alignItems: 'center'}}>
            <Button
              variant="outline"
              action="secondary"
              style={{borderColor: Color.primary}}
              onPress={handleClose}
              size="md">
              <ZText
                type="R16"
                color={Color.primary}
                style={{textAlign: 'center'}}>
                Cancel
              </ZText>
            </Button>
            <Button
              size="md"
              style={{backgroundColor: Color.primary, marginLeft: 10}}
              onPress={LogoutProceed}>
              <ZText type="R16" style={{color: 'white', textAlign: 'center'}}>
                Logout
              </ZText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {isloading && (
        <Modal transparent={true} animationType="fade">
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={Color.primary} />
          </View>
        </Modal>
      )}
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background to highlight the loader
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    justifyContent: 'space-between', // This will push the icons to the sides
  },
  leftIcon: {
    marginRight: 10,
  },
  drawerLabel: {
    flex: 1, // This allows the text to take up the space between icons
    fontSize: 16,
  },
  rightIcon: {
    marginLeft: 10,
  },
  nameText: {
    fontSize: 18,
    // fontWeight: 'bold',
  },
  bottomBorder: {
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
    paddingVertical: 18,
  },
  viewProfileText: {
    color: '#7C8091',
  },
  profileViewers: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
  },
  drawerItemsContainer: {
    paddingVertical: 10,
  },
});

export default CustomDrawerContent;
