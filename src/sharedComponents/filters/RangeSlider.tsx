import {Color} from '../../styles/GlobalStyles';
import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';

const RangeSlider = ({
  min = 0,
  max = 100,
  minValue,
  maxValue,
  preselectedItem = null,
  onChange,
}) => {
  // Determine initial values, falling back to minValue/maxValue or defaults
  const initialMinValue = preselectedItem?.minValue ?? minValue ?? min;
  const initialMaxValue = preselectedItem?.maxValue ?? maxValue ?? max;

  // Initialize state with the determined initial values
  const [localMinValue, setLocalMinValue] = useState(initialMinValue);
  const [localMaxValue, setLocalMaxValue] = useState(initialMaxValue);

  useEffect(() => {
  
    // Update local values when props or preselectedItem change
    setLocalMinValue(preselectedItem?.minValue ?? minValue ?? min);
    setLocalMaxValue(preselectedItem?.maxValue ?? maxValue ?? max);
  }, [min, max, minValue, maxValue, preselectedItem]);

  // Handle changes for the slider values
  const handleMinChange = value => {
    const validatedValue = Math.max(min, Math.min(value, localMaxValue));
    setLocalMinValue(validatedValue);
    if (onChange) onChange({min: validatedValue, max: localMaxValue});
  };

  const handleMaxChange = value => {
    const validatedValue = Math.min(max, Math.max(value, localMinValue));
    setLocalMaxValue(validatedValue);
    if (onChange) onChange({min: localMinValue, max: validatedValue});
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <View style={styles.inputBox}>
          <Text style={styles.toText}>Min</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={localMinValue.toString()}
            onChangeText={value => handleMinChange(parseInt(value) || min)}
          />
        </View>
        <Text style={styles.toText1}>to</Text>
        <View style={styles.inputBox}>
          <Text style={styles.toText}>Max</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={localMaxValue.toString()}
            onChangeText={value => handleMaxChange(parseInt(value) || max)}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
  inputContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
    padding: 20,
  },
  inputBox: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Color.borderColor,
    padding: 5,
    borderRadius: 10,
  },
  input: {
    fontSize: 16,
    flex: 1,
  },
  toText1: {
    marginHorizontal: 10,
    marginVertical: 10,
    fontSize: 16,
  },
  toText: {
    marginHorizontal: 10,
    fontSize: 16,
  },
});

export default RangeSlider;
