import {Color, GilroyFontFamily} from '../styles/GlobalStyles';
import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  TextInput,
  Animated,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  TextInputProps,
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
  const placeholderAnim = useRef(new Animated.Value(0)).current;
  const borderColor = useRef(new Animated.Value(0)).current;
  const textInputRef = useRef<TextInput>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const placeholderAnimRef = Animated.timing(placeholderAnim, {
      toValue: isFocused || value ? 1 : 0,
      duration: 100,
      useNativeDriver: false,
    });

    const borderColorAnimRef = Animated.timing(borderColor, {
      toValue: isFocused ? 1 : 0,
      duration: 100,
      useNativeDriver: false,
    });

    placeholderAnimRef.start();
    borderColorAnimRef.start();

    return () => {
      placeholderAnimRef.stop();
      borderColorAnimRef.stop();
    };
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
      outputRange: ['#000', '#000'],
    }),
    paddingHorizontal: 5,
    backgroundColor: 'white',
    alignSelf: 'center',
  };

  const borderStyle = {
    borderColor: borderColor.interpolate({
      inputRange: [0, 1],
      outputRange: [Color.borderColor, Color.borderColor],
    }),
  };

  return (
    <View>
      <View style={styles.inputWrapper}>
        <TouchableWithoutFeedback
          onPress={() => {
            if (textInputRef.current) {
              textInputRef.current.focus();
            }
          }}>
          <Animated.Text style={[styles.placeholder, placeholderStyle]}>
            {placeholder}
          </Animated.Text>
        </TouchableWithoutFeedback>
        <Animated.View style={[styles.inputContainer, borderStyle]}>
          <TextInput
            ref={textInputRef}
            style={[styles.textInput, multiline && styles.multilineTextInput]}
            onFocus={() => {
              if (isMounted.current) setIsFocused(true);
            }}
            onBlur={() => {
              if (isMounted.current) setIsFocused(false);
            }}
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
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: Color.borderColor,
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
    fontFamily: GilroyFontFamily.GilroyRegular,
    fontSize: 16,
  },
});

export default AnimatedTextInput;
