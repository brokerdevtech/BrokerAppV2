import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Back} from '../assets/svg';
import React from 'react';
import {styles} from '../themes';
import {CommonActions, useNavigation} from '@react-navigation/native';
import ZText from './ZText';

import {useSelector} from 'react-redux';
import {moderateScale} from '../config/constants';

import {Text} from 'react-native';

import ArrowLeftIcon from '../assets/svg/icons/arrow-left.svg' 
function ZHeader(props) {
  const {
    title,
    onPressBack,
    rightIcon,
    isHideBack,
    isLeftIcon,
    goNext,
    onNextPress,

    type,
  } = props;
  const navigation = useNavigation();
  const colors = useSelector((state: RootState) => state.theme.theme);

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 0, // Indicates the first route in the array is the active route.
          routes: [
            {name: 'Home'}, // Replace 'Home' with the name of your home route.
          ],
        }),
      );
      // Replace 'Home' with the name of your home screen
    }
  };
  return (
    <View style={[localStyles.container, !!isHideBack && styles.pr10]}>
      <View
        style={[
          styles.rowStart,
          styles.flex,
          // (!!isLeftIcon || !!rightIcon) && styles.justifyBetween,
        ]}>
        {!isHideBack && (
          <TouchableOpacity
           
            onPress={onPressBack || goBack}>
           
                  <ArrowLeftIcon />
              {/* <Back accessible={true} accessibilityLabel="Back" /> */}
           
          </TouchableOpacity>
        )}
        {!!isLeftIcon && isLeftIcon}

        <ZText
          numberOfLines={1}
          style={[styles.pr10, styles.ml20, localStyles.titleText]}
          type={'R18'}>
          {title}
        </ZText>
      </View>
      {!!rightIcon && rightIcon}
      <Text
        onPress={onNextPress}
        numberOfLines={1}
        style={{color: 'blue', fontSize: 18, fontWeight: 700}}
        type={'B20'}>
        {goNext}
      </Text>
    </View>
  );
}

export default React.memo(ZHeader);

const localStyles = StyleSheet.create({
  container: {
    ...styles.rowSpaceBetween,
    ...styles.ph20,
    ...styles.pv15,
    ...styles.center,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  titleText: {
    width: moderateScale(200),
  },
});
