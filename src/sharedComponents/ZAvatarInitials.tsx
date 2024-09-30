/* eslint-disable react/self-closing-comp */
import React from 'react';
import {Image, TouchableOpacity} from 'react-native';

import {useSelector} from 'react-redux';

import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from '../../components/ui/avatar';
import images from '../assets/images';
import {RootState} from '../../BrokerAppCore/redux/store/reducers';
import {imagesBucketcloudfrontPath} from '../constants/constants';
import {Color, GilroyFontFamily} from '../styles/GlobalStyles';

const ZAvatarInitials = ({
  sourceUrl,
  styles,
  iconSize,
  name,
  item,
  isDisable,
  onPress,
}) => {
  return (
    <TouchableOpacity disabled={isDisable} onPress={onPress}>
      {sourceUrl && sourceUrl.indexOf('http') === -1 ? (
        <Avatar style={{backgroundColor: Color.primary}} size={iconSize}>
          <AvatarFallbackText>{name}</AvatarFallbackText>
          <AvatarImage
            source={{
              uri: `${imagesBucketcloudfrontPath}${sourceUrl}`,
            }}
          />
        </Avatar>
      ) : (
        // Fallback to a default avatar if no image or initials available
        <Avatar size={iconSize} style={{backgroundColor: Color.primary}}>
          <AvatarFallbackText>{name}</AvatarFallbackText>
        </Avatar>
      )}
    </TouchableOpacity>
  );
};

export default React.memo(ZAvatarInitials);
