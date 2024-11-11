import React, {useRef, useState} from 'react';

import {View, TouchableOpacity, StyleSheet, Text} from 'react-native';
import {checkPermission} from '../utils/helpers';

import {PermissionKey} from '../config/constants';
import {Color} from '../styles/GlobalStyles';
import {useToast, Toast} from '@/components/ui/toast';
import {ToastDescription} from '../../components/ui/toast';

interface TouchableOpacityWithPermissionCheckProps {
  permissionEnum: PermissionKey;
  permissionsArray: {permissionUID: number; permissionKey: string}[];
  children: React.ReactNode;
  onPress: () => void;
  style?: any;
  tagNames?: any[];
  type?: string;
  fontColor?: string;
}

const enhanceChildrenWithColorPermissionGranted = (
  children: React.ReactNode,
  permissionGranted: boolean,
  tagNames?: any[],
  fontColor?: string,
): React.ReactNode => {
  return React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      const newProps: any = {};
      if (tagNames && tagNames.includes(child.type)) {
        newProps.color = permissionGranted ? 'black' : Color.primaryDisable;
      }
      if (child.type === Text || (tagNames && tagNames.includes(child.type))) {
        newProps.style = [
          child.props.style,
          {
            color: permissionGranted
              ? fontColor || 'black'
              : Color.primaryDisable,
          },
        ];
      }
      if (child.props && child.props.children) {
        newProps.children = enhanceChildrenWithColorPermissionGranted(
          child.props.children,
          permissionGranted,
          tagNames,
          fontColor,
        );
      }
      return React.cloneElement(child, newProps);
    }
    return child;
  });
};

const TouchableOpacityWithPermissionCheck: React.FC<
  TouchableOpacityWithPermissionCheckProps
> = ({
  permissionEnum,
  permissionsArray,
  children,
  onPress,
  style,
  tagNames = [],
  type,
  fontColor = 'black',
}) => {
  const permissionGranted = checkPermission(permissionsArray, permissionEnum);
  // const toastVisible = useRef(false);
  const [toastId, setToastId] = React.useState(0);
  // const [toastMessage, setToastMessage] = useState('');
  const toast = useToast();

  // const showToast = message => {
  //   if (!toastVisible.current) {
  //     toastVisible.current = true;
  //     setToastMessage(message);
  //     Toast.show({
  //       description: message,
  //       duration: 3000,
  //       onCloseComplete: () => {
  //         toastVisible.current = false;
  //         setToastMessage('');
  //       },
  //     });
  //   }
  // };

  const handlePress = () => {
    if (permissionGranted == false) {
      // showToast(`Permission ${PermissionKey[permissionEnum]} is not granted.`);
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
    }
  };

  const enhancedChildren = enhanceChildrenWithColorPermissionGranted(
    children,
    permissionGranted,
    tagNames,
    fontColor,
  );
  // console.log(permissionGranted);
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress} style={style}>
        {enhancedChildren}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
});

export default TouchableOpacityWithPermissionCheck;
