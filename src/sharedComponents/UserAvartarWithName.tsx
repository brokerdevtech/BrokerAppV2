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

function UserAvartarWithName({
  userName,
  userImage,

}) {
  const appuser = useSelector((state: RootState) => state.user.user);
  const navigation = useNavigation();

  const userPermissions = useSelector(
    (state: RootState) => state.user.user.userPermissions,
  );
  const colors = useSelector(state => state.theme.theme);
  const [isModalVisible, setModalVisible] = useState(false);

  const onPressUser = () => {
    if (appuser.userId === userId) {
      navigation.navigate('ProfileScreen');
    } else {
      navigation.navigate('ProfileDetail', {
        userName: userName,
        userImage: userImage,
        userId: userId,
        loggedInUserId: loggedInUserId,
       
      });
    }
  };

 



  return (
    <View style={localStyles.rootContainer}>
      <TouchableOpacity
        onPress={onPressUser}
        style={localStyles.userItem}
>
        <ZAvatarInitials
          onPress={onPressUser}
          sourceUrl={userImage}
          iconSize="md"
          name={userName}
        />
        {/* {userImage !== '' && userImage !== null ? (
          <Avatar
            source={{
              uri: `${imagesBucketcloudfrontPath}${userImage}`,
            }}>
            <FastImage
              source={colors.dark ? images.userDark : images.userLight}
              style={localStyles.userImage}
            />
          </Avatar>
        ) : (
          <FastImage
            source={colors.dark ? images.userDark : images.userLight}
            style={localStyles.userImage}
          />
        
        )} */}
        <View style={localStyles.userDescription}>
          <ZText type="R16" numberOfLines={1}>
            {userName}
          </ZText>
      
        </View>
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
