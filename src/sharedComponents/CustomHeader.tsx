import React, {useEffect, useState} from 'react';
import {
  Button,
  Image,
  Platform,
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
import {Badge, BadgeIcon, BadgeText} from '@/components/ui/badge';
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

const CustomHeader = () => {
  const AppLocation = useSelector((state: RootState) => state.AppLocation);
  const cityToShow = 'Noida';
  const navigation = useNavigation();
  const {
    data: marqueeText,
    status: marqueeStatus,
    error: marqueeError,
    execute: marqueeExecute,
  } = useApiRequest(fetchDashboardData);
  const [modalVisible, setModalVisible] = useState(false);

  const callPodcastList = async () => {
    const request = {pageNo: 1, pageSize: 10, cityName: cityToShow};
    await marqueeExecute('Marqueue', request);
  };
  const handlePlaceSelected = (place: any) => {
    console.log(place);
    console.log(AppLocation);

    store.dispatch(setAppLocation(place));
  };

  const ChangeCity = async () => {
    setModalVisible(true);

    // const request = { pageNo: 1, pageSize: 10, cityName: cityToShow }
    // await marqueeExecute('Marqueue', request)
  };
  useEffect(() => {
    callPodcastList();
  }, []);

  console.log('marqueeText', marqueeText);
  //onPress={() => navigation.toggleDrawer()}
  return (
    <View style={styles.headerSection}>
      <View style={styles.headerContainer}>
        <View style={styles.leftContainer}>
          <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
            <Avatar size="md">
              <AvatarImage
                source={{
                  uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
                }}
              />
              <View
                style={{
                  height: 15,
                  width: 15,
                  backgroundColor: 'white',
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  borderRadius: 30,
                  padding: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Icon as={verified_blue} size="sm" stroke="white" />
              </View>
            </Avatar>
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
          <TouchableOpacity style={styles.iconButton}>
            <Icon as={Notification_Icon} size="2xl" />
          </TouchableOpacity>
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
  );
};

const styles = StyleSheet.create({
  headerSection: {
    backgroundColor: '#fff',
  },
  subHeaderSection: {
    paddingBottom: 20,
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
