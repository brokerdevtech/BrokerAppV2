import React, { useState } from 'react';
import { View, Input, Icon, Box, VStack, Stack, HStack, InputGroup, InputLeftAddon, InputRightAddon, IconButton } from 'native-base';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { moderateScale } from '../common/constants';
//import { colors } from '../themes/index';
import { useSelector } from 'react-redux';
import { RootState } from '../../BrokerAppCore/redux/store/reducers';
import ZInput from './common/ZInput';
import { StyleSheet } from 'react-native';
import {Control} from '../assets/svgs';
import {styles} from '../themes';






const SearchBar = ({ onSearch }) => {
  const colors = useSelector((state: RootState) => state.theme.theme);
  const [search, setSearch] = useState('');
  const [searchInputStyle, setSearchInputStyle] = useState(BlurredStyle);
  const [searchIconStyle, setSearchIconStyle] = useState(BlurredIconStyle);

  const BlurredStyle = {
    backgroundColor: colors.inputBg,
    borderColor: colors.btnColor1,
  };
  const FocusedStyle = {
    backgroundColor: colors.inputFocusColor,
    borderColor: colors.primary,
  };
  const onHighlightInput = () => {
    setSearchInputStyle(FocusedStyle);
    setSearchIconStyle(FocusedIconStyle);
  };
  const onUnHighlightInput = () => {
    setSearchInputStyle(BlurredStyle);
    setSearchIconStyle(BlurredIconStyle);
  };
  const BlurredIconStyle = colors.placeHolderColor;
  const FocusedIconStyle = colors.primary;
  const SearchIcon = () => {
    return (
      <Ionicons
        name="search-outline"
        size={moderateScale(20)}
        color={searchIconStyle}
      />
    );
  };

  const onSearchInput = (text:any) =>
  
  {setSearch(text);
    
   
    onSearch(text);
    
  }


  const handleSearch = () => {
    
    // Perform the search with searchText
    if (search.length >= 3) {
      onSearch(search);
    }
  };

  return (
   
    <ZInput
    placeHolder={'Search'}
    _value={search}
    keyBoardType={'default'}
    autoCapitalize={'none'}
    insideLeftIcon={() => <SearchIcon />}
    toGetTextFieldValue={onSearchInput}
    inputContainerStyle={[
      {backgroundColor: colors.inputBg},
      localStyles.inputContainerStyle,
      searchInputStyle,
    ]}
    inputBoxStyle={styles.ph15}
    _onFocus={onHighlightInput}
    onBlur={onUnHighlightInput}
    // rightAccessory={() => <Control />}
  />

    

  );
};
const localStyles = StyleSheet.create({
  inputContainerStyle: {
    borderRadius: moderateScale(15),
    borderWidth: moderateScale(1),
  },
  userImage: {
    width: moderateScale(64),
    height: moderateScale(64),
    borderWidth: moderateScale(2),
    borderRadius: moderateScale(32),
  },
  flatListStoryContainer: {
    ...styles.mt20,
    ...styles.mb10,
  },
  storyContainer: {
    ...styles.mr15,
    ...styles.nonFlexCenter,
  },
  renderItemCoontainer: {
    ...styles.rowCenter,
    ...styles.mt20,
  },
  userMsgImage: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
  },
  userName: {
    ...styles.mh10,
    ...styles.flex,
    ...styles.rowSpaceBetween,
  },
  pendingContainer: {
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(5),
    borderRadius: 20,
  },
});
export default SearchBar;