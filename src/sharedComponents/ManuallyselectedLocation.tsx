import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
} from 'react-native';

import {BottomSheetModal, BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import GooglePlacesAutocompleteModal from './PlacesAutocomplete';
import store from '../../BrokerAppCore/redux/store';
import {setAppLocation} from '../../BrokerAppCore/redux/store/AppLocation/appLocation';
import {Color} from '../styles/GlobalStyles';
import {openSettings} from 'react-native-permissions';
import ZInput from './ZInput';
import {Search} from '../assets/svg';
import LocationList from './LocationList';
import LoadingSpinner from './LoadingSpinner';

import {useSelector} from 'react-redux';
import {moderateScale} from '../config/constants';
import {styles} from '../themes';
import strings from '../i18n/strings';

const ManuallyselectedLocation = forwardRef(
  (onPlaceSelected, ref, SetCityFilter = '') => {
    const bottomSheetRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

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
    // Bottom sheet snap points
    const snapPoints = useMemo(() => ['50%', '70%', '80%'], []);

    // Expose `present` and `close` methods to the parent via `ref`
    useImperativeHandle(ref, () => ({
      open: () => {
        bottomSheetRef.current?.present();
      },
      close: () => {
        bottomSheetRef.current?.close();
      },
    }));

    const handleSheetChanges = useCallback(
      index => {
        setIsOpen(index >= 0);

        // Optional: If you want to programmatically change snap point when focused
        if (index === 0 && isInputFocused) {
          bottomSheetRef.current?.snapToIndex(2); // Snaps to 90%
        }
      },
      [isInputFocused],
    );

    const [isInputFocused, setIsInputFocused] = useState(false);

    const onSearchInput = (text: string) => {
      setSearch(text);
    };
    const onHighlightInput = () => {
      setIsInputFocused(true);
      setSearchInputStyle(FocusedStyle);
      setSearchIconStyle(FocusedIconStyle);
      bottomSheetRef.current?.snapToIndex(2);
    };
    const onUnHighlightInput = () => {
      setIsInputFocused(false);
      setSearchInputStyle(BlurredStyle);
      setSearchIconStyle(BlurredIconStyle);
      bottomSheetRef.current?.snapToIndex(0);
    };

    const renderBackdrop = useCallback(
      props => (
        <BottomSheetBackdrop
          {...props}
          pressBehavior="none"
          disappearsOnIndex={-1}
          appearsOnIndex={0}
        />
      ),
      [],
    );
    const setLoaction = (item: any) => {
      console.log(item, 'item');

      setSearch('');
      setSearchInputStyle(BlurredStyle);
      setSearchIconStyle(BlurredIconStyle);
      if (item) {
        store.dispatch(setAppLocation(item));
        // onPlaceSelected(item); // Send the selected location to the parent component
      }
      bottomSheetRef.current?.close();
    };
    return (
      <BottomSheetModal
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enableOverDrag={false}
        enablePanDownToClose={false}
        backdropComponent={renderBackdrop}>
        <View style={style.container}>
          <View style={style.locationPermission}>
            <Text style={style.locationText}>Location Permission is Off</Text>
            <Text style={style.subText}>
              Granting location permission will ensure accurate address and
              hassle-free delivery
            </Text>
            <TouchableOpacity
              onPress={() => openSettings()}
              style={style.grantButton}>
              <Text style={style.grantButtonText}>
                Gave permission from settings
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={style.addressHeading}>Select Manually Location</Text>
          <ScrollView
            keyboardShouldPersistTaps={'always'}
            showsVerticalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={style.rootContainer}>
            <View style={{paddingHorizontal: 20}}>
              <ZInput
                placeHolder={strings.search}
                _value={search}
                _autoFocus={false}
                keyBoardType={'default'}
                autoCapitalize={'none'}
                insideLeftIcon={() => <Search />}
                toGetTextFieldValue={onSearchInput}
                inputContainerStyle={[
                  {backgroundColor: colors.inputBg},
                  style.inputContainerStyle,
                  searchInputStyle,
                ]}
                inputBoxStyle={style.inputBoxStyle}
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
          {/* <GooglePlacesAutocompleteModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          onPlaceSelected={handlePlaceSelected}
        /> */}
        </View>
      </BottomSheetModal>
    );
  },
);

export default ManuallyselectedLocation;

const style = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#F5F5F5',
    padding: 16,
  },
  locationPermission: {
    backgroundColor: '#C2070733',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  locationText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  subText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  grantButton: {
    marginTop: 16,
    backgroundColor: Color.primary,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  grantButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  addressHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  addressItem: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  addressDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  manualEntry: {
    marginTop: 16,
    alignItems: 'center',
  },
  manualEntryText: {
    fontSize: 16,
    color: '#007BFF',
    fontWeight: 'bold',
  },
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
