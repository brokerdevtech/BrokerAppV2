/* eslint-disable react/self-closing-comp */
import React from 'react';
import {TouchableOpacity} from 'react-native';

import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from '../../components/ui/avatar';
import {imagesBucketcloudfrontPath} from '../constants/constants';
import {Color} from '../styles/GlobalStyles';

const ZAvatarInitials = ({
  sourceUrl,
  styles,
  iconSize,
  name,
  isDisable,
  onPress,
}) => {
  const hasValidImage = sourceUrl && sourceUrl.indexOf('http') === -1;

  return (
    <TouchableOpacity disabled={isDisable} onPress={onPress}>
      <Avatar style={{backgroundColor: Color.primary}} size={iconSize}>
        {hasValidImage ? (
          <AvatarImage
            source={{
              uri: `${imagesBucketcloudfrontPath}${sourceUrl}`,
            }}
          />
        ) : (
          <AvatarFallbackText>{name}</AvatarFallbackText>
        )}
      </Avatar>
    </TouchableOpacity>
  );
};

export default React.memo(ZAvatarInitials);
