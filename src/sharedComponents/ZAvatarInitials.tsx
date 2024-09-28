/* eslint-disable react/self-closing-comp */
import React from 'react';
import {Image, TouchableOpacity} from 'react-native';

import {useSelector} from 'react-redux';

import {Avatar} from '../../components/ui/avatar';
import images from '../assets/images';
import {RootState} from '../../BrokerAppcore/redux/store/reducers';
import {imagesBucketcloudfrontPath} from '../constants/constants';
//Text Component
const getInitials = name => {
  if (!name) return ''; // Return empty if no name provided

  let initials = name.match(/\b\w/g) || [];
  initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
  return initials;
};

// ZAvatar Component
const ZAvatarInitials = ({
  sourceUrl,
  styles,
  iconSize,
  name,
  item,
  isDisable,
  onPress,
}) => {
  const colors = useSelector((state: RootState) => state.theme.theme);
  const user = useSelector((state: RootState) => state.user.user);
  // const navigation = useNavigation();
  // const onPressUser = CommentUser => {
  //   if (CommentUser?.userId === user.userId) {
  //     navigation.navigate(TabNav.Profile);
  //   } else {
  //     navigation.push(StackNav.ProfileDetail, {
  //       userName: CommentUser?.postedBy,
  //       userImage: CommentUser?.profileImage,
  //       userId: CommentUser?.userId,
  //       loggedInUserId: user.userId,
  //       // connectionId: connectionId,
  //     });
  //   }
  // };
  // console.log(item);

  return (
    <TouchableOpacity disabled={isDisable} onPress={() => onPress()}>
      {sourceUrl && sourceUrl.indexOf('http') === -1 ? (
        <Avatar
          //   alignSelf="center"
          //   bg="primary.500"
          size={iconSize}
          source={{
            uri: `${imagesBucketcloudfrontPath}${sourceUrl}`,
          }}
        />
      ) : !sourceUrl ||
        sourceUrl.trim() === '' ||
        sourceUrl.indexOf('http') !== -1 ? (
        <Avatar
          //   alignSelf="center"
          //   bg={Color.primary}
          //   size={iconSize}
          _text={{
            color: 'white',
            fontSize: 'md',
          }}>
          {getInitials(name)}
        </Avatar>
      ) : (
        <Avatar
          //   alignSelf="center"
          //   bg={Color.primary}
          size={iconSize}
          source={colors.dark ? images.userDark : images.userLight}></Avatar>
        // If you prefer to use Image component, uncomment the following:
        // <Image
        //     source={colors.dark ? images.userDark : images.userLight}
        //     style={iconSize}
        // />
      )}
    </TouchableOpacity>
  );
};

export default React.memo(ZAvatarInitials);
