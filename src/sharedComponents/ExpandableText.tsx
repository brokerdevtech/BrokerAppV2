import {moderateScale} from '../config/constants';
import {Color} from '../styles/GlobalStyles';
import React, {useState, useRef} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
} from 'react-native';
import ZText from './ZText';

const ExpandableText = ({text, initialNumberOfLines = 3}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const textRef = useRef(null);

  const onTextLayout = event => {
    const {height} = event.nativeEvent.layout;
    const lineHeight = moderateScale(24); // You can adjust this to match your text line height
    const maxInitialHeight = lineHeight * initialNumberOfLines;

    if (height > maxInitialHeight) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  const toggleExpansion = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.container}>
      <ZText
        type={'l16'}
        ref={textRef}
        style={styles.text}
        numberOfLines={isExpanded ? undefined : initialNumberOfLines}
        onLayout={isExpanded ? null : onTextLayout}>
        {text}
      </ZText>
      {showButton && (
        <TouchableOpacity onPress={toggleExpansion}>
          <Text style={styles.buttonText}>
            {isExpanded ? 'Show Less' : 'Show More'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingRight: 40,
  },
  text: {
    fontWeight: '400',
    fontSize: moderateScale(18),
    lineHeight: moderateScale(24), // Ensure this matches the lineHeight used in onTextLayout
  },
  buttonText: {
    marginTop: 5,
    fontSize: 16,
    color: Color.primary,
  },
});

export default ExpandableText;
