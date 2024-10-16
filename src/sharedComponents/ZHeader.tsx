import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Back, SearchFill} from '../assets/svg';
import React, { useState } from 'react';
import {styles} from '../themes';
import {CommonActions, useNavigation} from '@react-navigation/native';
import ZText from './ZText';

import {useSelector} from 'react-redux';
import {moderateScale} from '../config/constants';

import {Text} from 'react-native';

import ArrowLeftIcon from '../assets/svg/icons/arrow-left.svg' 
import { Icon, SearchIcon } from '../../components/ui/icon';
import { Input, InputField, InputIcon, InputSlot } from '../../components/ui/input';
function ZHeader(props) {
  const {
    title,
    onPressBack,
    rightIcon,
    isHideBack,
    isLeftIcon,
    goNext,
    onNextPress,
    isSearch,
    type,
  } = props;
  const navigation = useNavigation();
  const colors = useSelector((state: RootState) => state.theme.theme);
  const [showSearchBox,setShowSearchBox]=useState(false);
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
            <View
          style={{
            // ...styles.appTitleMain,
            // color: '#007acc',
            padding: 8,
            borderWidth: 1,
            borderColor: '#E5E5E5',
            borderRadius: 40,
          }}>
                  <ArrowLeftIcon />
              {/* <Back accessible={true} accessibilityLabel="Back" /> */}
              </View>
          </TouchableOpacity>
        )}
        {!!isLeftIcon && isLeftIcon}
        {showSearchBox ? (
          <Input style={[localStyles.input, {flex: 1}]}>
            <InputField
              type='text'
              placeholder="Search"
            />
            <InputSlot style={{paddingRight: 10}}>
              <InputIcon as={SearchIcon} stroke="#000" />
            </InputSlot>
          </Input>
        ) : (
          <ZText
            numberOfLines={1}
            style={[styles.pr10, styles.ml20, localStyles.titleText]}
            type={'R18'}>
            {title}
          </ZText>
        )}
      </View>
      {isSearch && !showSearchBox &&    <TouchableOpacity
           
           onPress={()=>setShowSearchBox((showBox)=>!showBox)}>
       
              <Icon as={SearchIcon} size='xl'/>

       
         </TouchableOpacity>}
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
    width: moderateScale(300),
  },
  input: {
    borderWidth: 0,
    borderColor: '#ddd',
    borderRadius: 5,
    // padding: 10,
    // marginBottom: 20,
    backgroundColor: '#f9f9f9',
    height: 43,
    marginLeft:10
  },
});
