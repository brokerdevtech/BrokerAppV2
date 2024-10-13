import ZText from '../../sharedComponents/ZText';
import {Color} from '../../styles/GlobalStyles';
import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const RadioButton = ({selected, onPress, disabled, children}) => {
  return (
    <TouchableOpacity
      onPress={disabled ? null : onPress}
      style={[styles.radioButtonContainer, disabled && styles.disabled]}
      disabled={disabled}>
      <View style={styles.radioButton}>
        {selected ? <View style={styles.radioButtonSelected} /> : null}
      </View>
      <ZText type="R16" style={{marginLeft: 5}}>
        {children}
      </ZText>
    </TouchableOpacity>
  );
};

const CategorySelector = ({categories, defaultCategory, onSelect}) => {
  const [selectedValue, setSelectedValue] = useState(defaultCategory);

  const handleSelect = value => {
    setSelectedValue(value);
    if (onSelect) {
      onSelect(value);
    }
  };

  return (
    <View style={styles.container}>
      <ZText type="R16" style={styles.title}>
        Select Category
      </ZText>
      <View style={styles.radioGroup}>
        {categories.map(category => (
          <RadioButton
            key={category.value}
            selected={selectedValue === category.value}
            onPress={() => handleSelect(category.value)}
            disabled={category.disabled}>
            {category.label}
          </RadioButton>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.5,
  },
  container: {
    // padding: 10,
    // borderWidth: 1,
    // borderColor: '#ddd',
    // borderRadius: 5,
    // backgroundColor: '#fff',
    margin: 20,
  },
  title: {
    bottom: -10,
    zIndex: 4,
    marginLeft: 10,
    backgroundColor: '#fff',
    width: 120,
  },
  radioGroup: {
    flexDirection: 'row',
    //justifyContent: 'space-evenly',
    padding: 20,
    borderWidth: 1,
    borderColor: '#E8EFF6',
    borderRadius: 5,
    backgroundColor: '#fff',
  //  marginRight:10
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight:10
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Color.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  radioButtonSelected: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: Color.primary,
  },
});

export default CategorySelector;
