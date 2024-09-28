import React, {useRef, useState} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';

import strings from '../i18n/strings';

import {styles} from '../themes';
import {useSelector} from 'react-redux';

import LocationList from './LocationList';
import LoadingSpinner from './LoadingSpinner';
import {Back, Search} from '../assets/svg';
import {moderateScale} from '../config/constants';
import ZHeader from './ZHeader';
import {SearchIcon} from '../../components/ui/icon';
import ZInput from './ZInput';

const Chip = ({label, onRemove}) => {
  return (
    <View style={localstyles.chipContainer}>
      <Text style={localstyles.chipText}>{label}</Text>
      <TouchableOpacity onPress={onRemove} style={localstyles.deleteButton}>
        <Text style={localstyles.deleteButtonText}>X</Text>
      </TouchableOpacity>
    </View>
  );
};
const GooglePlacesAutocompleteModal = ({
  modalVisible,
  setModalVisible,
  onPlaceSelected,
  SetCityFilter = '',
}) => {
  const colors = useSelector(state => state.theme.theme);

  const BlurredStyle = {
    backgroundColor: colors.inputBg,
    borderColor: colors.btnColor1,
  };
  const FocusedStyle = {
    backgroundColor: colors.inputFocusColor,
    borderColor: colors.primary,
  };
  const BlurredIconStyle = colors.grayScale5;
  const FocusedIconStyle = colors.primary;
  const [search, setSearch] = useState('');
  const [searchInputStyle, setSearchInputStyle] = useState(BlurredStyle);
  const [searchIconStyle, setSearchIconStyle] = useState(BlurredIconStyle);
  const [isLoading, setIsLoading] = useState(false);
  const setLoading = param => {
    setIsLoading(param);
  };
  const LeftIcon = () => {
    return (
      <View style={styles.rowCenter}>
        <TouchableOpacity
          style={styles.pr10}
          onPress={() => {
            setModalVisible(false);
          }}>
          <Back size={moderateScale(26)} color={colors.textColor} />
        </TouchableOpacity>
      </View>
    );
  };

  const RightIcon = () => {
    return (
      <View style={styles.rowCenter}>
        {/* <TouchableOpacity style={styles.pr10} onPress={()=>{}}>
          <Ionicons
            name="add-circle-outline"
            size={moderateScale(26)}
            color={colors.textColor}
          />
        </TouchableOpacity> */}
      </View>
    );
  };
  // const renderChips = () => {
  //   return selectedPlaces.map((place) => (
  //     <Chip
  //       key={place.id}
  //       label={place.description}
  //       onRemove={() => {
  //         const newSelectedPlaces = selectedPlaces.filter(
  //           (p) => p.id !== place.id
  //         );
  //         setSelectedPlaces(newSelectedPlaces);
  //       }}
  //     />
  //   ));
  // };
  const onSearchInput = (text: string) => {
    setSearch(text);
  };
  const onHighlightInput = () => {
    setSearchInputStyle(FocusedStyle);
    setSearchIconStyle(FocusedIconStyle);
  };
  const onUnHighlightInput = () => {
    setSearchInputStyle(BlurredStyle);
    setSearchIconStyle(BlurredIconStyle);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSearch('');
    // onPlaceSelected(selectedPlaces);
  };
  let autoCompleteRef = useRef(null);

  const setLoaction = (item: any) => {
    setSearch('');
    setSearchInputStyle(BlurredStyle);
    setSearchIconStyle(BlurredIconStyle);

    onPlaceSelected(item);
    setModalVisible(false);
  };
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={modalVisible}
      onRequestClose={handleModalClose}>
      <SafeAreaView>
        <ZHeader
          title={'Place'}
          rightIcon={<RightIcon />}
          isHideBack={true}
          isLeftIcon={<LeftIcon />}
        />
      </SafeAreaView>
      <ScrollView
        keyboardShouldPersistTaps={"always"}
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={localstyles.rootContainer}>
        <View style={{paddingHorizontal: 20}}>
          <ZInput
            placeHolder={strings.search}
            _value={search}
            _autoFocus={true}
            keyBoardType={'default'}
            autoCapitalize={'none'}
            insideLeftIcon={() => <Search />}
            toGetTextFieldValue={onSearchInput}
            inputContainerStyle={[
              {backgroundColor: colors.inputBg},
              localstyles.inputContainerStyle,
              searchInputStyle,
            ]}
            inputBoxStyle={localstyles.inputBoxStyle}
            _onFocus={onHighlightInput}
            onBlur={onUnHighlightInput}
          />
        </View>
        <LocationList
          searchText={search}
          setLoading={setLoading}
          setLoaction={setLoaction}
          SetCityFilter={SetCityFilter}
        />
      </ScrollView>
      <LoadingSpinner isVisible={isLoading} />
    </Modal>
  );
};
const localstyles = StyleSheet.create({
  rootContainer: {
    //  ...styles.ph20,
    ...styles.pb20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputContainerStyle: {
    borderRadius: moderateScale(15),
    borderWidth: moderateScale(1),
  },
  inputBoxStyle: {
    ...styles.ph15,
  },
  mainContainer: {
    ...styles.rowSpaceBetween,
    width: '100%',
    ...styles.mt15,
    alignSelf: 'center',
  },
  tabItemStyle: {
    width: '49%',
    ...styles.itemsCenter,
    ...styles.pv15,
    ...styles.rowSpaceBetween,
  },
  root: {
    borderBottomWidth: moderateScale(2),
    ...styles.ph25,
  },
  chipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 4,
  },
  chipText: {
    color: '#fff',
  },
  deleteButton: {
    marginLeft: 8,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
export default GooglePlacesAutocompleteModal;
