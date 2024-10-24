import React, {useEffect, useRef, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {styles} from '../../themes';
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
import ZText from '../ZText';

const SingleSelectTag = ({
  data,
  filterName,
  displayName,
  onSelect,
  resetAllFilters,
  selecteditem,
}) => {
  const [selectedOption, setSelectedOption] = useState({});
  const isInitialMount = useRef(true);
  // useEffect(() => {
  //   if (isInitialMount.current=false) {

  //
  //   if (isObjectEmpty(resetAllFilters)) {
  //     setSelectedOption({});
  //   }

  // }
  // }, [resetAllFilters]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      onSelect(selectedOption, filterName, selecteditem);
    }
  }, [selectedOption]);

  const isObjectEmpty = obj => {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  };
  const handleAvailabilitySelect = option => {
    //
    setSelectedOption(prevSelectedOption => {
      if (prevSelectedOption === option) {
        // Toggle off the selection
        return {};
      } else {
        // Toggle on the selection
        return option;
      }
    });
  };
  // const handleAvailabilitySelect = (option) => {
  //   setSelectedOption(option);
  // };
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
            width={25}
            height={25}
            accessible={true}
            accessibilityLabel="Sales type"
            style={{color: 'black'}}
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
  // console.log(data, 'pp');
  return (
    <View>
      <HStack
        style={(styles.flexRow, styles.contentCenter, {marginBottom: 10})}>
        {getIconForDisplayName(displayName)}
        <ZText
          type={'M16'}
          style={[
            typography.fontSizes.f14,
            {
              fontWeight: '600',
              // marginBottom: 10,
              marginLeft: 10,
              color: '#000000',
            },
          ]}>
          {displayName}
        </ZText>
        {selecteditem.isMandatory && (
          <Text style={[typography.fontSizes.f16, {color: 'red'}]}> *</Text>
        )}
        {displayName == 'Developer' && (
          <ZText
            type={'r14'}
            style={[
              typography.fontSizes.f14,
              {
                // marginBottom: 10,
                marginLeft: 'auto',
                paddingTop: 10,
                color: 'grey',
              },
            ]}>
            {'Dependent on localities'}
          </ZText>
        )}
        {displayName == 'Project' && (
          <ZText
            type={'r14'}
            style={[
              typography.fontSizes.f14,
              {
                // marginBottom: 10,
                marginLeft: 'auto',
                paddingTop: 10,
                color: 'grey',
              },
            ]}>
            {'Dependent on Developer'}
          </ZText>
        )}
      </HStack>
      <View style={localstyles.tagContainer}>
        {data.map(option => (
          <TouchableOpacity
            key={option.key}
            style={[
              localstyles.tagsWrap,
              selectedOption === option && localstyles.selectedTag,
            ]}
            onPress={() => handleAvailabilitySelect(option)}>
            <ZText
              type={'r14'}
              style={[
                selectedOption === option
                  ? localstyles.selectedTag
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
    padding: 10,
    borderRadius: 8, // Rounded corners
    borderWidth: 2,
    borderColor: '#E8E8E8',
    // borderColor: '#E8E8E8',
    marginRight: 5,
    marginBottom: 5,
    alignItems: 'center', // Centers the text horizontally
    justifyContent: 'center',
  },
  tag: {
    padding: 10,
    borderRadius: 8, // Rounded corners
    borderWidth: 2,
    // borderColor: '#E8E8E8',
    // borderColor: '#E8E8E8',
    marginRight: 5,
    marginBottom: 5,
    alignItems: 'center', // Centers the text horizontally
    justifyContent: 'center',
  },
  selectedTag: {
    // backgroundColor: Color.primary,
    color: '#E00000',
    borderColor: Color.primary,
  },
  unselectedTagText: {
    // backgroundColor: '#F3F3F3',
    borderColor: '#E8E8E8',
    color: Color.primary,
  },
  tagText: {
    color: 'white',
  },
});

export default SingleSelectTag;
