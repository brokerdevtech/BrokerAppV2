import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {RootState} from '../../BrokerAppCore/redux/store/reducers';
import {Icon} from '@/components/ui/icon';
import {Map_pin} from '../assets/svg';
import ZAvatarInitials from './ZAvatarInitials';
import TouchableOpacityWithPermissionCheck from './TouchableOpacityWithPermissionCheck';
import {PermissionKey} from '../config/constants';
import {Notification_Icon, Chat_icon} from '../assets/svg';
import {Badge, BadgeText} from '../../components/ui/badge';
import {Color} from '../styles/GlobalStyles';
import {checkPermission} from '../utils/helpers';
import GooglePlacesAutocompleteModal from './PlacesAutocomplete';
import store from '../../BrokerAppCore/redux/store';
import {setAppLocation} from '../../BrokerAppCore/redux/store/AppLocation/appLocation';

const CustomHeader2 = () => {
  const AppLocation = useSelector((state: RootState) => state.AppLocation);
  const user = useSelector((state: RootState) => state.user.user);
  const dashboard = useSelector((state: RootState) => state.dashboard);
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const userPermissions = useSelector(
    (state: RootState) => state.user.user.userPermissions,
  );

  const handlePlaceSelected = (place: any) => {
    store.dispatch(setAppLocation(place));
  };

  const permissionGrantedNotification = checkPermission(
    userPermissions,
    PermissionKey.AllowViewNotification,
  );

  const onPressUser = () => {
    navigation.toggleDrawer();
  };

  const ChangeCity = () => {
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.locationContainer} onPress={ChangeCity}>
          <Icon as={Map_pin} size="xxl" color="#FF0000" />
          <Text style={styles.locationText}>
            156 sector 21c Faridabad, Sector 21C, Faridabad
          </Text>
        </TouchableOpacity>

        <View style={styles.rightContainer}>
          <TouchableOpacityWithPermissionCheck
            permissionEnum={PermissionKey.AllowViewNotification}
            permissionsArray={userPermissions}
            onPress={() => navigation.navigate('Notification')}
            style={styles.notificationButton}>
            {dashboard.notificationCount > 0 && (
              <Badge
                style={[
                  styles.notificationBadge,
                  {
                    backgroundColor: permissionGrantedNotification
                      ? '#bc4a50'
                      : Color.primaryDisable,
                  },
                ]}
                variant="solid">
                <BadgeText style={styles.notificationBadgeText}>
                  {dashboard.notificationCount}
                </BadgeText>
              </Badge>
            )}
            <Notification_Icon height="25" width="25" />
          </TouchableOpacityWithPermissionCheck>

          <TouchableOpacity
            style={styles.chatButton}
            onPress={() => navigation.navigate('AppChat')}>
            <Chat_icon height="25" width="25" />
          </TouchableOpacity>

          <TouchableOpacity onPress={onPressUser}>
            <ZAvatarInitials
              onPress={onPressUser}
              sourceUrl={user.profileImage}
              iconSize="md"
              name={`${user.firstName} ${user.lastName}`}
            />
          </TouchableOpacity>
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
  safeArea: {
    backgroundColor: 'white',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  locationText: {
    marginLeft: 5,
    fontSize: 14,
    color: 'black',
    flexShrink: 1,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    position: 'relative',
    marginRight: 15,
  },
  notificationBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    zIndex: 10,
    minWidth: 20,
    minHeight: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 10,
  },
  chatButton: {
    marginRight: 15,
  },
});

export default CustomHeader2;
