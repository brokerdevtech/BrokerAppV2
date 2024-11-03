import React, {useEffect, useState} from 'react';
import {
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
import {Button} from '../../components/ui/button';
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
import ZAvatarInitials from './ZAvatarInitials';
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from '../../components/ui/alert-dialog';
import ZText from './ZText';
import {Color} from '../styles/GlobalStyles';

const GuestCustomHeader = () => {
  const AppLocation = useSelector((state: RootState) => state.AppLocation);
  const navigation = useNavigation();
  const [showAlertDialog, setShowAlertDialog] = React.useState(false);
  const handleClose = () => setShowAlertDialog(false);
  const onPressSignUp = () => {
    //  onOpen();
    setShowAlertDialog(false);
    navigation.navigate('Login');
  };
  return (
    <SafeAreaView>
      <View style={styles.headerSection}>
        <View style={styles.headerContainer}>
          <View style={styles.leftContainer}>
            <TouchableOpacity onPress={() => setShowAlertDialog(true)}>
              <ZAvatarInitials
                onPress={() => setShowAlertDialog(true)}
                //   sourceUrl={user.profileImage}
                iconSize="md"
                name={`Guest`}
              />
            </TouchableOpacity>
            <View style={styles.appName}>
              <View style={styles.appTitleWrapper}>
                <Text style={styles.appTitleMain}>Broker</Text>
                <Text style={styles.appTitle}>App</Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowAlertDialog(true)}
                style={styles.cityContainer}>
                <Icon as={Map_pin} size="2xl" />
                <Text style={{marginLeft: 5}}>{AppLocation.City}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.rightContainer}>
            <TouchableOpacity
              onPress={() => setShowAlertDialog(true)}
              style={styles.iconButton}>
              <Icon as={Notification_Icon} size="2xl" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setShowAlertDialog(true)}>
              <Icon as={Chat_icon} size="2xl" />
            </TouchableOpacity>
          </View>
        </View>
        <AlertDialog isOpen={showAlertDialog} onClose={handleClose} size="md">
          <AlertDialogBackdrop />
          <AlertDialogContent>
            <AlertDialogBody className="mt-3 mb-4 ">
              <ZText type="S18" style={{marginBottom: 20, textAlign: 'center'}}>
                Want to see More ?
              </ZText>
              <ZText type="R16" style={{marginBottom: 20, textAlign: 'center'}}>
                Hurry up create an account with us now.
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
                onPress={onPressSignUp}
                style={{backgroundColor: Color.primary, marginLeft: 10}}>
                <ZText type="R16" style={{color: 'white', textAlign: 'center'}}>
                Login
                </ZText>
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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
export default GuestCustomHeader;
