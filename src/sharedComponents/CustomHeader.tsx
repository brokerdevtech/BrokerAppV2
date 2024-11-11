/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  Button,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  BellIcon,
  Icon,
  InfoIcon,
  MenuIcon,
  MessageCircleIcon,
} from '@/components/ui/icon';
import {Box} from '@/components/ui/box';
import {HStack} from '@/components/ui/hstack';
import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarImage,
} from '@/components/ui/avatar';
import {VStack} from '@/components/ui/vstack';
import {
  Chat_icon,
  Map_pin,
  Notification_Icon,
  verified_blue,
} from '../assets/svg';
import {Badge, BadgeIcon, BadgeText} from '../../components/ui/badge';
import {useNavigation} from '@react-navigation/native';
import UserProfile from './profile/UserProfile';
import MarqueeBanner from './profile/MarqueeBanner';
import {useApiRequest} from '@/src/hooks/useApiRequest';
import {fetchDashboardData} from '@/BrokerAppCore/services/new/dashboardService';
import GooglePlacesAutocompleteModal from './PlacesAutocomplete';
import {useSelector} from 'react-redux';
import {RootState} from '../../BrokerAppCore/redux/store/reducers';
import {set} from 'react-hook-form';
import store from '../../BrokerAppCore/redux/store';
import {setAppLocation} from '../../BrokerAppCore/redux/store/AppLocation/appLocation';
import ZAvatarInitials from './ZAvatarInitials';
import {Color} from '../styles/GlobalStyles';
import TouchableOpacityWithPermissionCheck from './TouchableOpacityWithPermissionCheck';
import {PermissionKey} from '../config/constants';
import {checkPermission} from '../utils/helpers';

const CustomHeader = () => {
  const AppLocation = useSelector((state: RootState) => state.AppLocation);
  const user = useSelector((state: RootState) => state.user.user);
  let cityToShow = AppLocation.City;
  const navigation = useNavigation();
  const {
    data: marqueeText,
    status: marqueeStatus,
    error: marqueeError,
    execute: marqueeExecute,
  } = useApiRequest(fetchDashboardData);
  const [modalVisible, setModalVisible] = useState(false);
  const dashboard = useSelector((state: RootState) => state.dashboard);
  const callPodcastList = async (cityToShow: any) => {
    const request = {pageNo: 1, pageSize: 10, cityName: cityToShow};
    await marqueeExecute('Marqueue', request);
  };
  const handlePlaceSelected = (place: any) => {
    store.dispatch(setAppLocation(place));
  };
  const userPermissions = useSelector(
    (state: RootState) => state.user.user.userPermissions,
  );
  const ChangeCity = async () => {
    setModalVisible(true);

    // const request = { pageNo: 1, pageSize: 10, cityName: cityToShow }
    // await marqueeExecute('Marqueue', request)
  };
  useEffect(() => {
    // console.log("AppLocation");
    // console.log(AppLocation);
    callPodcastList(AppLocation.City);
    cityToShow = AppLocation.City;
  }, [AppLocation]);
  const onPressUser = () => {
    navigation.toggleDrawer();
  };
  // console.log('marqueeText', marqueeText);
  //onPress={() => navigation.toggleDrawer()}
  console.log(dashboard);
  const permissionGrantedNotification = checkPermission(
    userPermissions,
    PermissionKey.AllowViewNotification,
  );
  return (
    <SafeAreaView>
      <View style={styles.headerSection}>
        <View style={styles.headerContainer}>
          <View style={styles.leftContainer}>
            <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
              <ZAvatarInitials
                onPress={onPressUser}
                sourceUrl={user.profileImage}
                iconSize="md"
                name={`${user.firstName} ${user.lastName}`}
              />
            </TouchableOpacity>
            <View style={styles.appName}>
              <View style={styles.appTitleWrapper}>
                <Text style={styles.appTitleMain}>Broker</Text>
                <Text style={styles.appTitle}>App</Text>
              </View>
              <TouchableOpacity
                onPress={() => ChangeCity()}
                style={styles.cityContainer}>
                <Icon as={Map_pin} size="2xl" />
                <Text style={{marginLeft: 5}}>{AppLocation.City}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.rightContainer}>
            <TouchableOpacityWithPermissionCheck
              permissionEnum={PermissionKey.AllowViewNotification}
              permissionsArray={userPermissions}
              style={{
                marginLeft: 10,
                marginRight: 10,
                marginTop: 5,
              }}
              tagNames={[Notification_Icon, VStack, Badge]}
              onPress={() => {
                navigation.navigate('Notification');
              }}>
              <VStack>
                {dashboard.notificationCount > 0 && (
                  <Badge
                    style={{
                      zIndex: 10,
                      alignSelf: 'flex-end',
                      height: 22,
                      width: 22,
                      backgroundColor: permissionGrantedNotification
                        ? '#bc4a50'
                        : Color.primaryDisable, // Hex color for red-600
                      borderRadius: 50,
                      marginBottom: -10, // Converts -3.5 to px
                      marginRight: -10,
                    }}
                    variant="solid">
                    <BadgeText style={{color: 'white'}}>
                      {dashboard.notificationCount}
                    </BadgeText>
                  </Badge>
                )}

                {/* <Icon as={Notification_Icon} size="2xl" /> */}
                <Notification_Icon height="25" width="25" />
              </VStack>
            </TouchableOpacityWithPermissionCheck>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => {
                navigation.navigate('AppChat');
              }}>
              <Icon as={Chat_icon} size="2xl" />
            </TouchableOpacity>
          </View>
        </View>

        <GooglePlacesAutocompleteModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          onPlaceSelected={handlePlaceSelected}
          SetCityFilter={''}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerSection: {
    backgroundColor: '#fff',
  },
  subHeaderSection: {
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 60,
    paddingHorizontal: 15,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  titleContainer: {
    marginLeft: 20,
    flexDirection: 'column',
    alignItems: 'center',
  },
  appTitleMain: {
    color: '#000',
    fontSize: 20,
    fontWeight: '400',
  },
  appTitle: {
    color: '#b71c1c',
    fontSize: 20,
    fontWeight: '400',
  },
  cityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationIcon: {
    fontSize: 16,
    color: '#000',
  },
  cityText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 5,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 20,
  },
  appName: {
    flexDirection: 'column',

    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginLeft: 15,
  },
  icon: {
    fontSize: 24,
    color: '#000',
  },
  appTitleWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
});
export default CustomHeader;
