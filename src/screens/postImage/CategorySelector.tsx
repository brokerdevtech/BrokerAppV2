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
      <Text style={styles.radioButtonText}>{children}</Text>
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
      <Text style={styles.title}>Select Category</Text>
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
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BC4A4F',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  radioButtonSelected: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#BC4A4F',
  },
  radioButtonText: {
    fontSize: 16,
  },
});

export default CategorySelector;
