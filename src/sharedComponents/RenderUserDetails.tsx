import React, {useState} from 'react';
import {View, Pressable} from 'react-native';

import {styles} from '../themes';
import {StackNav} from '../navigation/NavigationKeys';
import {useNavigation} from '@react-navigation/native';
import {debounce} from 'lodash';

import {useSelector} from 'react-redux';
import TouchableOpacityWithPermissionCheck from './TouchableOpacityWithPermissionCheck';
import {PermissionKey} from '../config/constants';
import ZText from './ZText';

export default function RenderUserDetail({item, ParentUserData}) {
  //
  const userPermissions = useSelector(
    (state: RootState) => state.user.user.userPermissions,
  );
  // console.log('RenderUserDetail', item);
  const [isPressableDisabled, setIsPressableDisabled] = useState(false);
  const navigation = useNavigation();
  const viewFollower = () => {
    if (isPressableDisabled) {
      return;
    }
    console.log(ParentUserData.userId, item.title);
    navigation.navigate('FollowerList', {
      userName: ParentUserData.userName,
      userImage: ParentUserData.userImage,
      userId: ParentUserData.userId,
      type: item.title,
    });
    setIsPressableDisabled(true);
    // Re-enable the pressable after a delay
  };
  const debouncedHandleButtonClick = debounce(viewFollower, 500, {
    leading: true,
    trailing: true,
  });
  // console.log(debouncedHandleButtonClick);
  return (
    <View style={(styles.itemsCenter, styles.justifyCenter, styles.flexCenter)}>
      <TouchableOpacityWithPermissionCheck
        permissionEnum={
          item.title == 'Followers'
            ? PermissionKey.AllowViewFollowers
            : PermissionKey.AllowViewFollowings
        }
        tagNames={[ZText]}
        permissionsArray={userPermissions}
        onPress={debouncedHandleButtonClick}>
        <ZText type="R20" align={'center'}>
          {item.value}
        </ZText>
        <ZText type="R18" align={'center'} style={styles.mt10}>
          {item.title}
        </ZText>
      </TouchableOpacityWithPermissionCheck>
      {/* )} */}
    </View>
  );
}
