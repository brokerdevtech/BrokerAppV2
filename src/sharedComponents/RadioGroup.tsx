import React from 'react';
import {StyleProp, StyleSheet, TextStyle, View, ViewStyle} from 'react-native';
import CustomRadioButton, {RadioButtonProps} from './CutomRadioButton';

export type RadioGroupProps = {
  accessibilityLabel?: string;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  layout?: 'row' | 'column';
  onPress?: (selectedId: string) => void;
  radioButtons: RadioButtonProps[];
  selectedId?: string;
  testID?: string;
};

export default function RadioGroup({
  accessibilityLabel,
  containerStyle,
  labelStyle,
  layout = 'column',
  onPress,
  radioButtons,
  selectedId,
  testID,
}: RadioGroupProps) {
  function handlePress(id: string) {
    if (id !== selectedId) {
      if (onPress) {
        onPress(id);
      }
      const button = radioButtons.find(rb => rb.id === id);
      if (button?.onPress) {
        button.onPress(id);
      }
    }
  }

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="radiogroup"
      style={[styles.container, {flexDirection: layout}, containerStyle]}
      testID={testID}>
      {radioButtons.map(button => (
        <CustomRadioButton
          {...button}
          key={button.id}
          labelStyle={button.labelStyle || labelStyle}
          selected={button.id === selectedId}
          onPress={handlePress}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
  },
});
