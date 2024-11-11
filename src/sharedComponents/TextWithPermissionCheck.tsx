import React, {useRef, useState} from 'react';
// import {Toast, useToast} from 'native-base';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {checkPermission} from '../utils/helpers';
import {PermissionKey} from '../config/constants';
import {Color} from '../styles/GlobalStyles';
import ZText from './ZText';
import {Toast, ToastDescription, useToast} from '../../components/ui/toast';

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
  const [toastId, setToastId] = useState(0);
  const handlePress = () => {
    if (permissionGranted == false) {
      if (!toast.isActive(toastId)) {
        const newId = Math.random();
        setToastId(newId);
        toast.show({
          id: newId,
          placement: 'bottom',
          duration: 3000,
          render: ({id}) => {
            const uniqueToastId = 'toast-' + id;
            return (
              <Toast nativeID={uniqueToastId} action="muted" variant="solid">
                <ToastDescription>
                  {'You do not have permission.Contact dev@brokerapp.com.'}
                </ToastDescription>
              </Toast>
            );
          },
        });
      }
    } else {
      onPress && onPress();
      console.log('press');
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
