import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  Animated,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  TextInputProps,
  KeyboardType,
} from 'react-native';

interface AnimatedTextInputProps extends TextInputProps {
  multiline?: boolean;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  type?: string;
}

const AnimatedTextInput: React.FC<AnimatedTextInputProps> = ({
  multiline = false,
  value,
  onChangeText,
  placeholder = 'Placeholder',
  type = 'default',
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const placeholderAnim = useState(new Animated.Value(0))[0];
  const borderColor = useState(new Animated.Value(0))[0];
  const textInputRef = React.useRef<TextInput>(null);

  useEffect(() => {
    Animated.timing(placeholderAnim, {
      toValue: isFocused || value ? 1 : 0,
      duration: 100,
      useNativeDriver: false,
    }).start();

    Animated.timing(borderColor, {
      toValue: isFocused ? 1 : 0,
      duration: 100,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const placeholderStyle = {
    top: placeholderAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [14, -10],
    }),
    fontSize: placeholderAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: placeholderAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['#aaa', '#000'],
    }),
    paddingHorizontal: 5,
    backgroundColor: 'white',
    alignSelf: 'center',
  };

  const borderStyle = {
    borderColor: borderColor.interpolate({
      inputRange: [0, 1],
      outputRange: ['#aaa', '#007AFF'],
    }),
  };

  return (
    <View>
      <View style={styles.inputWrapper}>
        <TouchableWithoutFeedback onPress={() => textInputRef.current?.focus()}>
          <Animated.Text style={[styles.placeholder, placeholderStyle]}>
            {placeholder}
          </Animated.Text>
        </TouchableWithoutFeedback>
        <Animated.View style={[styles.inputContainer, borderStyle]}>
          <TextInput
            ref={textInputRef}
            // keyboardType="default"
            style={[styles.textInput, multiline && styles.multilineTextInput]}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChangeText={onChangeText}
            value={value}
            multiline={multiline}
            {...rest}
          />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    position: 'relative',
    // flex:1
  },
  inputContainer: {
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  textInput: {
    fontSize: 16,
    height: 50,
  },
  multilineTextInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  placeholder: {
    position: 'absolute',
    left: 10,
    zIndex: 1,
    backgroundColor: 'white',
  },
});

export default AnimatedTextInput;
