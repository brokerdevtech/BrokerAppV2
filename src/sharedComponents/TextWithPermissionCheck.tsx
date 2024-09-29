import React, {useRef, useState} from 'react';
// import {Toast, useToast} from 'native-base';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {checkPermission} from '../utils/helpers';
import {PermissionKey} from '../config/constants';
import {Color} from '../styles/GlobalStyles';
import ZText from './ZText';
import { useToast } from '../../components/ui/toast';

interface TextWithPermissionCheckProps {
  permissionEnum: PermissionKey;
  permissionsArray: {permissionUID: number; permissionKey: string}[];
  children: string;
  onPress: () => void;
  style?: any;
  type?: string;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  color?: string;
}

const TextWithPermissionCheck: React.FC<TextWithPermissionCheckProps> = ({
  permissionEnum,
  permissionsArray,
  children,
  onPress,
  style,
  type = 'R14',
  align,
  color,
  fontColor = 'black',
}) => {
  const permissionGranted = checkPermission(permissionsArray, permissionEnum);
  const toast = useToast();

  const handlePress = () => {
    if (permissionGranted == false) {
      if (!toast.isActive(2)) {
        toast.show({
          id: 2,
          description: `You do not have permission.Contact dev@brokerapp.com.`,
          placement: type === 'comment' ? 'top' : 'bottom',
        });
      }
    } else {
      onPress && onPress();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress} style={style}>
        <ZText
          type={type}
          style={{color: permissionGranted ? fontColor : Color.primaryDisable}}
          align={align}
          color={color}>
          {children}
        </ZText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
});

export default TextWithPermissionCheck;
