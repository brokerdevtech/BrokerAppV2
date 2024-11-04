import {moderateScale, PermissionKey} from '../config/constants';
import {useSelector} from 'react-redux';
import {Toast, ToastDescription, useToast} from '../../components/ui/toast';
import {checkPermission} from '../utils/helpers';
import {styles} from '../themes';
import {StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import ZText from './ZText';
import {Color} from '../styles/GlobalStyles';

interface ButtonWithPermissionCheckProps {
  title: string;
  textType: string;
  color?: string;
  onPress: () => void;
  containerStyle?: any;
  style?: any;
  icon?: React.ReactNode;
  frontIcon?: React.ReactNode;
  children?: React.ReactNode;
  bgColor?: string | null;
  permissionEnum: PermissionKey;
  permissionsArray: {permissionUID: number; permissionKey: string}[];
  [key: string]: any;
}

const ButtonWithPermissionCheck: React.FC<ButtonWithPermissionCheckProps> = ({
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
  permissionEnum,
  permissionsArray,
  ...props
}) => {
  const colors = useSelector(state => state.theme.theme);
  const toast = useToast();
  const permissionGranted = checkPermission(permissionsArray, permissionEnum);
  const [toastId, setToastId] = React.useState(0);
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
    }
  };

  const iconStyle = permissionGranted ? styles.icon : localStyle.iconDisabled;

  return (
    <TouchableOpacity
      style={[
        localStyle.btnContainer,
        styles.rowCenter,
        containerStyle,
        bgColor
          ? {backgroundColor: bgColor}
          : {backgroundColor: colors.primary},
        !permissionGranted && localStyle.disabledButton,
      ]}
      onPress={handlePress}
      {...props}>
      {frontIcon &&
        React.cloneElement(frontIcon, {
          style: [frontIcon.props.style, iconStyle],
        })}
      <ZText
        type={textType}
        style={[style, !permissionGranted && localStyle.textDisabled]}
        color={color}>
        {title}
      </ZText>
      {icon && React.cloneElement(icon, {style: [icon.props.style, iconStyle]})}
      {children}
    </TouchableOpacity>
  );
};

const localStyle = StyleSheet.create({
  btnContainer: {
    height: moderateScale(40),
    borderRadius: moderateScale(5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: Color.primaryDisable,
    borderColor: Color.primaryDisable,
  },
  textDisabled: {
    color: 'gray',
  },
  iconDisabled: {
    color: 'gray', // or any other color indicating the disabled state
  },
});

export default ButtonWithPermissionCheck;
