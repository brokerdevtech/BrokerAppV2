//Library Imports
import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';

//Local Imports

import ZText from './ZText';
import {moderateScale} from '../config/constants';
import {styles} from '../themes';

export default function ZButton({
  title,
  textType,
  color,
  onPress,
  containerStyle,
  style,
  icon = null,
  frontIcon = null,
  children,
  bgColor = null,
  ...props
}) {
  const colors = useSelector(state => state.theme.theme);
  return (
    <TouchableOpacity
      style={[
        localStyle.btnContainer,
        styles.rowCenter,
        containerStyle,
        bgColor
          ? {backgroundColor: bgColor}
          : {backgroundColor: colors.primary},
      ]}
      onPress={onPress}
      {...props}>
      {/* If Icon Added In Button Front Side */}
      {frontIcon}
      {/* Text In Button */}
      <ZText type={textType} style={style} color={color}>
        {title}
      </ZText>
      {/* If Icon Added In Button Back Side */}
      {icon}
      {children}
    </TouchableOpacity>
  );
}

const localStyle = StyleSheet.create({
  btnContainer: {
    height: moderateScale(50),
    borderRadius: moderateScale(25),
  },
});
