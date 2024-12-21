/* eslint-disable react/no-unstable-nested-components */
// Library import
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Pressable,
  Alert,
} from 'react-native';

import {useSelector} from 'react-redux';

// Local import
import React, {useState} from 'react';

import {styles} from '../themes';
import {StackNav, TabNav} from '../navigation/NavigationKeys';
import {useNavigation} from '@react-navigation/native';

import {deleteConnections} from '../../BrokerAppCore/services/connections';

import {RootState} from '../../BrokerAppCore/redux/store/reducers';
import ZText from './ZText';
import FollowUnfollowComponent from './FollowUnfollowButton';
import {getHeight, moderateScale, PermissionKey} from '../config/constants';
import ZAvatarInitials from './ZAvatarInitials';
import {Menu, MenuItem} from '../../components/ui/menu';
import TextWithPermissionCheck from './TextWithPermissionCheck';
import ButtonWithPermissionCheck from './ButtonWithPermissionCheck';
import {AddIcon, Icon, ThreeDotsIcon} from '../../components/ui/icon';
import {Button, ButtonText} from '../../components/ui/button';
import {secondsToMilliseconds} from '@/utils/helpers';

function UserAvartarWithName({
  userName,
  userImage,
  userId,
  loggedInUserId,
  isProfileView = false,
  Viewon = '',
}) {
  const appuser = useSelector((state: RootState) => state.user.user);
  const navigation = useNavigation();

  const formatDateTime = dateString => {
    // Convert the timestamp string into a Date object
    const date = new Date(dateString);

    // Options for formatting time
    const timeOptions = {
      second: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };

    const formattedTime = date.toLocaleTimeString('en-IN', timeOptions);

    const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}/${date.getFullYear()}`;

    return {formattedTime, formattedDate};
  };
  const {formattedTime, formattedDate} = formatDateTime(Viewon);
  console.log(Viewon);

  const userPermissions = useSelector(
    (state: RootState) => state.user.user.userPermissions,
  );
  const colors = useSelector(state => state.theme.theme);
  const [isModalVisible, setModalVisible] = useState(false);

  // const onPressUser = () => {
  //   if (appuser.userId === userId) {
  //     navigation.navigate('ProfileScreen');
  //   } else {
  //     navigation.navigate('ProfileDetail', {
  //       userName: userName,
  //       userImage: userImage,
  //       userId: userId,
  //       loggedInUserId: loggedInUserId,
  //     });
  //   }
  // };
  const onPressUser = () => {
    if (appuser.userId === userId) {
      navigation.navigate('ProfileScreen');
    } else {
      navigation.navigate('ProfileDetail', {
        userName: userName,
        userImage: userImage,
        userId: userId,
        loggedInUserId: loggedInUserId,
        // connectionId: connectionId,
      });
    }
  };
  console.log(userName, userImage, userId, loggedInUserId);
  return (
    <View style={localStyles.rootContainer}>
      <TouchableOpacity onPress={onPressUser} style={localStyles.userItem}>
        <ZAvatarInitials
          onPress={onPressUser}
          sourceUrl={userImage}
          iconSize="md"
          name={userName}
        />

        <View style={localStyles.userDescription}>
          <ZText type="S16" numberOfLines={1}>
            {userName}
          </ZText>
        </View>
        {isProfileView && (
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'flex-end',
            }}>
            <ZText type="R14">{formattedTime}</ZText>
            <ZText type="R12">{formattedDate}</ZText>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}
export default React.memo(UserAvartarWithName);

const localStyles = StyleSheet.create({
  rootContainer: {
    ...styles.rowSpaceBetween,
    ...styles.mt15,
    ...styles.flex,
  },
  userItem: {
    flex: 1,
    ...styles.rowCenter,
  },
  userImage: {
    width: moderateScale(50),
    height: moderateScale(50),
  },
  imageStyle: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
    resizeMode: 'cover',
  },
  userDescription: {
    ...styles.mh10,
    ...styles.flex,
    textTransform: 'capitalize',
  },
  removeBtn: {
    borderWidth: 1,
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#eee',
    padding: moderateScale(20),
    borderTopLeftRadius: moderateScale(15),
    borderTopRightRadius: moderateScale(15),
    alignItems: 'center',
    height: '20%',
  },
  buttonContainer: {
    ...styles.ph15,
    ...styles.pv15,
    height: getHeight(50),
    minWidth: getHeight(120),
    borderRadius: moderateScale(5),
    borderWidth: moderateScale(1),
  },
  connectContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
});
