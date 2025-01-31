import React, { useState, useRef } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import Typography from '../themes/typography';
import { RootState } from '../../BrokerAppCore/redux/store/reducers';

// Text Component
const ZTextMore = ({ type, style, align, color, children, numberOfLines = 3, ...props }) => {
  const colors = useSelector((state: RootState) => state.theme.theme);
  const [expanded, setExpanded] = useState(false);
  const [isTextTruncated, setIsTextTruncated] = useState(false);
  const textRef = useRef(null);

  const fontWeights = () => {
    switch (type.charAt(0).toUpperCase()) {
      case 'L':
        return Typography.fontWeights.Light;
      case 'R':
        return Typography.fontWeights.Regular;
      case 'M':
        return Typography.fontWeights.Medium;
      case 'S':
        return Typography.fontWeights.SemiBold;
      case 'B':
        return Typography.fontWeights.Bold;
      default:
        return Typography.fontWeights.Regular;
    }
  };

  const fontSize = () => {
    switch (type.slice(1)) {
      case '10':
        return Typography.fontSizes.f10;
      case '12':
        return Typography.fontSizes.f12;
      case '14':
        return Typography.fontSizes.f14;
      case '16':
        return Typography.fontSizes.f16;
      case '18':
        return Typography.fontSizes.f18;
      case '20':
        return Typography.fontSizes.f20;
      case '22':
        return Typography.fontSizes.f22;
      case '24':
        return Typography.fontSizes.f24;
      case '26':
        return Typography.fontSizes.f26;
      case '28':
        return Typography.fontSizes.f28;
      case '30':
        return Typography.fontSizes.f30;
      case '32':
        return Typography.fontSizes.f32;
      case '34':
        return Typography.fontSizes.f34;
      case '35':
        return Typography.fontSizes.f35;
      case '36':
        return Typography.fontSizes.f36;
      case '40':
        return Typography.fontSizes.f40;
      case '46':
        return Typography.fontSizes.f46;
      default:
        return Typography.fontSizes.f14;
    }
  };

  const onTextLayout = (e) => {
    const { lines } = e.nativeEvent;
    if (lines.length > numberOfLines) {
      setIsTextTruncated(true);
    }
  };

  return (
    <React.Fragment>
      <Text
        style={[
          type && { ...fontWeights(), ...fontSize() },
          { color: color ? color : colors.textColor },
          align && { textAlign: align },
          style,
        ]}
        numberOfLines={expanded ? undefined : numberOfLines} // Limit lines if not expanded
        onTextLayout={onTextLayout} // Check if text exceeds the limit
        ref={textRef}
        {...props}
      >
        {children}
      </Text>
      {isTextTruncated && (
        <TouchableOpacity onPress={() => setExpanded(!expanded)}>
          <Text style={{ color: 'red', marginTop: 5, textDecorationLine: 'underline' }}>
            {expanded ? 'Read Less' : 'Read More'}
          </Text>
        </TouchableOpacity>
      )}
    </React.Fragment>
  );
};

export default React.memo(ZTextMore);
