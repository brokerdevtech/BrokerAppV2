import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {styles} from '../../themes';
import ZText from '../ZText';
import typography from '../../themes/typography';
import {
  Amenities,
  Balcony,
  Bathroom,
  Bed,
  Builder,
  Calender,
  Construction,
  Developer,
  Map_pin,
  Property,
} from '../../assets/svg';
import {Color} from '../../styles/GlobalStyles';
import {HStack} from '../../../components/ui/hstack';

const MultiSelectTag = ({
  data,
  filterName,
  displayName,
  onSelect,
  resetAllFilters,
  selecteditem,
}) => {
  const [selectedOption, setSelectedOption] = useState([]);
  const isInitialMount = useRef(true);
  // useEffect(() => {
  //   if (isInitialMount.current=false) {

  //
  //   if (resetAllFilters && Object.keys(resetAllFilters).length === 0) {
  //     setSelectedOption([]);
  //   }}
  // }, [resetAllFilters]);

  const isObjectEmpty = obj => {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false; // The object has at least one property, so it's not empty
      }
    }
    return true; // The object has no properties, so it's empty
  };

  const handleSelectedSetOption = option => {
    if (selectedOption.includes(option)) {
      // Tag is already selected, so remove it from the selected options
      setSelectedOption(prevState => prevState.filter(item => item !== option));
    } else {
      // Tag is not selected, so add it to the selected options
      setSelectedOption(prevState => [...prevState, option]);
    }
  };

  // const handleSelectedSetOption = (option) => {
  //   if (selectedOption.includes(option)) {
  //     setSelectedOption((prevState) =>
  //       prevState.filter((item) => item !== option)
  //     );
  //   } else {
  //     setSelectedOption((prevState) => [...prevState, option]);
  //   }
  // };
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      onSelect(selectedOption, filterName, selecteditem);
    }
  }, [selectedOption]);
  // useEffect(() => {
  //   if (isInitialMount.current) {
  //     isInitialMount.current = false;
  //   } else {
  //     onSelect(selectedOption, filterName, selecteditem);
  //   }
  // }, [selectedOption]);
  // useEffect(() => {
  //   // if (!isObjectEmpty(selectedOption)) {
  //   //   onSelect(selectedOption, filterName, selecteditem);
  //   // }
  //   onSelect(selectedOption, filterName, selecteditem);
  // }, [selectedOption]);
  const getIconForDisplayName = displayName => {
    const iconSize = 20;

    switch (displayName) {
      case 'Country':
        return (
          <Map_pin
            width={iconSize}
            height={iconSize}
            accessible={true}
            accessibilityLabel="Mappin"
          />
        );
      case 'State':
        return (
          <Map_pin
            width={iconSize}
            height={iconSize}
            accessible={true}
            accessibilityLabel="Mappin"
          />
        );
      case 'Property Type':
        return (
          <Property
            width={25}
            height={25}
            accessible={true}
            accessibilityLabel="Property type"
            style={{color: 'black'}}
          />
        );
      case 'Developer':
        return (
          <Developer
            width={iconSize}
            height={iconSize}
            accessible={true}
            accessibilityLabel="Developer"
          />
        );
      case 'City':
        return (
          <Map_pin
            width={iconSize}
            height={iconSize}
            accessible={true}
            accessibilityLabel="Mappin"
          />
        );
      case 'Project':
        return (
          <Builder
            width={iconSize}
            height={iconSize}
            accessible={true}
            accessibilityLabel="Builder"
          />
        );
      case 'Bedroom':
        return (
          <Bed
            width={iconSize}
            height={iconSize}
            accessible={true}
            accessibilityLabel="Bed"
          />
        );
      case 'Bathroom':
        return (
          <Bathroom
            width={iconSize}
            height={iconSize}
            accessible={true}
            accessibilityLabel="Bathroom"
          />
        );
      case 'Balcony':
        return (
          <Balcony
            width={iconSize}
            height={iconSize}
            accessible={true}
            accessibilityLabel="Balcony"
          />
        );
      case 'Amenities':
        return (
          <Amenities
            width={25}
            height={25}
            accessible={true}
            accessibilityLabel="Amenities"
          />
        );
      case 'Sales/Transaction Type':
        return (
          <Property
            width={iconSize}
            height={iconSize}
            accessible={true}
            accessibilityLabel="sales"
          />
        );
      case 'Age of Property':
        return (
          <Calender
            width={iconSize}
            height={iconSize}
            accessible={true}
            accessibilityLabel="Age of Property"
          />
        );
      case 'Property Status':
        return (
          <Calender
            width={iconSize}
            height={iconSize}
            accessible={true}
            accessibilityLabel="Property Status"
          />
        );
      case 'Construction Status':
        return (
          <Construction
            width={iconSize}
            height={iconSize}
            accessible={true}
            accessibilityLabel="Construction Status"
          />
        );
      case 'Nearby Facilities':
        return (
          <Map_pin
            width={iconSize}
            height={iconSize}
            accessible={true}
            accessibilityLabel="Nearby Facilities"
          />
        );
      default:
        return null; // Return null or a default icon if the display name is not in the switch statement
    }
  };
  return (
    <View>
      <HStack
        style={(styles.flexRow, styles.contentCenter, {marginBottom: 10})}>
        {getIconForDisplayName(displayName)}
        <ZText
          type={'r16'}
          style={[
            typography.fontSizes.f16,
            {
              fontWeight: '600',
              // marginBottom: 10,
              color: '#000000',
              marginLeft: 10,
            },
          ]}>
          {displayName}
        </ZText>
        {selecteditem.isMandatory && (
          <Text style={[typography.fontSizes.f16, {color: 'red'}]}> *</Text>
        )}
      </HStack>
      <View style={localstyles.tagContainer}>
        {data.map(option => (
          <TouchableOpacity
            key={option.key}
            style={[
              localstyles.tagsWrap,
              selectedOption.includes(option) && localstyles.selectedTag,
            ]}
            onPress={() => handleSelectedSetOption(option)}>
            <ZText
              type={'r16'}
              style={[
                selectedOption.includes(option)
                  ? localstyles.selectedTagText
                  : localstyles.unselectedTagText,
              ]}>
              {option.value}
            </ZText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const localstyles = StyleSheet.create({
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
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
    height: 40,
    backgroundColor: '#F3F3F3',
    borderColor: Color.primary,
    alignItems: 'center',
    borderWidth: 1,
    color: Color.primary,
  },
  tag: {
    backgroundColor: 'gray',
    borderRadius: 20,

    paddingHorizontal: 10,
    paddingVertical: 6,
    margin: 5,
    elevation: 2,
  },
  selectedTag: {
    backgroundColor: Color.primary,
    color: 'white',
    borderColor: Color.primary,
  },
  unselectedTagText: {
    backgroundColor: 'transparent',
    color: Color.primary,
    borderColor: Color.primary,
  },
  selectedTagText: {color: '#fff'},
  tagText: {
    color: '#007dc5',
  },
});

export default MultiSelectTag;
