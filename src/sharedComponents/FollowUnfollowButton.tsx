// Library import
import {Keyboard, StyleSheet, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import React from 'react';

// Local import
import ZButton from './common/ZButton';

import {styles} from '../themes';
import {setFollowUnfollow} from '../../BrokerAppCore/services/followunfollowService';
import ButtonWithPermissionCheck from './ButtonWithPermissionCheck';
import {getHeight, moderateScale, PermissionKey} from '../config/constants';

export default function FollowUnfollowComponent({
  isFollowing,
  followedId,
  onFollow,
  onUnfollow,
}) {
  const user = useSelector((state: RootState) => state.user.user);
  const userPermissions = useSelector(
    (state: RootState) => state.user.user.userPermissions,
  );

  const colors = useSelector(state => state.theme.theme);
  const [isFollow, setIsFollow] = React.useState(isFollowing);

  React.useEffect(() => {
    setIsFollow(isFollowing);
  }, [isFollowing]);

  const onPressFollow = async () => {
    Keyboard.dismiss();
    if (!isFollow) {
      const result = await setFollowUnfollow(user.userId, followedId, true);

      if (result) {
        setIsFollow(true);
        onFollow();
      }
    } else {
      const result = await setFollowUnfollow(user.userId, followedId, false);

      if (result) {
        setIsFollow(false);
        onUnfollow();
      }
    }
  };

  return (
    <ButtonWithPermissionCheck
      title={isFollow ? strings.unfollow : strings.follow}
      permissionsArray={userPermissions}
      color={isFollow ? colors.white : colors.primary}
      textType="r16"
      containerStyle={[
        localStyles.buttonContainer,
        {borderColor: colors.primary},
      ]}
      bgColor={isFollow ? colors.primary : colors.tranparent}
      onPress={onPressFollow}
      permissionEnum={
        isFollow ? PermissionKey.AllowUnfollow : PermissionKey.AllowFollow
      }
    />
  );
}

const localStyles = StyleSheet.create({
  buttonContainer: {
    ...styles.ph15,
    height: getHeight(45),
    minWidth: getHeight(120),
    borderRadius: moderateScale(10),
    borderWidth: moderateScale(1),
  },
});
