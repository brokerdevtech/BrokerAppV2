import React, {useState, useEffect} from 'react';

import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import typography from '../themes/typography';
import {Color} from '../styles/GlobalStyles';
import {HStack} from '../../components/ui/hstack';
import ZText from './ZText';
import {styles} from '../themes';
import {LocationFetchIcon, Search} from '../assets/svg';
import GooglePlacesAutocompleteModal from './PlacesAutocomplete';

interface LocalityTagProps {
  onLocalityChange: (locality: any) => void;
  isMandatory?: boolean;
  resetSignal: any;
}

const LocalityTag: React.FC<LocalityTagProps> = ({
  onLocalityChange,
  isMandatory = false,
  resetSignal,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [localities, setLocalities] = useState([]);
  useEffect(() => {
    setLocalities([]);
    // Add any other state resets here
  }, [resetSignal]);
  const handleModalOpen = () => {
    setModalVisible(true);
  };
  const handlePlaceSelected = (place: any) => {
    setLocalities([{place}]);
    // setModalVisible(false);

    onLocalityChange(place);
    // setModalVisible(false);
    //
    //
  };
  const removeLocality = (placeId: string) => {
    const updatedLocalities = localities.filter(
      loc => loc.place.placeId !== placeId,
    );
    setLocalities(updatedLocalities);
    onLocalityChange(localities);
  };
  return (
    <TouchableOpacity onPress={handleModalOpen}>
      <HStack style={(styles.flexRow, styles.contentCenter, localStyles.input)}>
        {/* <MapPin onPress={handleModalOpen} /> */}
        <ZText
          type={'R16'}
          style={[
            typography.fontSizes.f16,
            {
              fontWeight: '600',
              // marginBottom: 10,
              color: '#000000',
              marginLeft: 0,
            },
          ]}>
          Location
        </ZText>
        {isMandatory && (
          <Text style={[typography.fontSizes.f16, {color: 'red'}]}> *</Text>
        )}
        <LocationFetchIcon
          style={{marginLeft: 'auto'}}
          onPress={handleModalOpen}
        />
      </HStack>
      <View style={localStyles.tagContainer}>
        {localities.map(option => (
          <TouchableOpacity
            key={option.place.placeId}
            style={[localStyles.tagsWrap, localStyles.selectedTag]}
            // onPress={() =>  removeLocality(option.place.placeId)}
          >
            <ZText type={'r16'} style={[localStyles.selectedTagText]}>
              {option.place.name}
            </ZText>
          </TouchableOpacity>
        ))}
      </View>
      <GooglePlacesAutocompleteModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onPlaceSelected={handlePlaceSelected}
        SetCityFilter={''}
      />
    </TouchableOpacity>
  );
};

const localStyles = StyleSheet.create({
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
    marginTop: 10,
    width: 400,
  },
  input: {
    borderColor: Color.borderColor,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    // height: 40,
  },
  tagsWrap: {
    // borderWidth: 1,
    // borderColor: '#1D7BBF',
    ...styles.ph10,
    ...styles.pt10,
    ...styles.pb10,
    ...styles.flexRow,
    borderRadius: 5,
    margin: 5,
    minHeight: 40,
    backgroundColor: '#F3F3F3',

    alignItems: 'center',
  },
  tag: {
    backgroundColor: '#gray',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'gray',
    paddingHorizontal: 10,
    paddingVertical: 6,
    margin: 5,
    elevation: 2,
  },
  selectedTag: {
    backgroundColor: Color.primary,
    color: 'white',
    // borderColor: '#007dc5',
  },
  unselectedTagText: {
    backgroundColor: 'transparent',
    color: '#1D7BBF',
    borderColor: '#1D7BBF',
  },
  selectedTagText: {color: '#fff'},
  tagText: {
    color: '#007dc5',
  },
});

export default LocalityTag;
