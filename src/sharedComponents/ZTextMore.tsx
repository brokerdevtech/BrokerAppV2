import React, {useState, useRef, useEffect} from 'react';
import {Platform, Text, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import Typography from '../themes/typography';
import {RootState} from '../../BrokerAppCore/redux/store/reducers';

// Text Component
const ZTextMore = ({
  type,
  style,
  align,
  color,
  children,
  numberOfLines = 2,
  ...props
}) => {
  const colors = useSelector(state => state.theme.theme);
  const [expanded, setExpanded] = useState(false);
  const [isTextTruncated, setIsTextTruncated] = useState(false);

  const fontWeights = () => {
    switch (type?.charAt(0)?.toUpperCase()) {
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
    const size = type?.slice(1);
    return Typography.fontSizes[`f${size}`] || Typography.fontSizes.f14;
  };

  const onTextLayout = e => {
    // Basic validation
    if (!e?.nativeEvent) {
      console.log('No nativeEvent in onTextLayout');
      return;
    }

    const {lines} = e.nativeEvent;

    if (!lines) {
      console.log('No lines in nativeEvent');
      return;
    }

    console.log('onTextLayout triggered', {
      numberOfLines,
      actualLines: lines.length,
      lines: lines.map(line => ({
        text: line.text,
        width: line.width,
        height: line.height,
      })),
    });

    // Simple line count check
    if (Platform.OS == 'ios') {
      const shouldTruncate = lines.length > 1;
      setIsTextTruncated(shouldTruncate);
    } else {
      const shouldTruncate = lines.length > numberOfLines;
      setIsTextTruncated(shouldTruncate);
    }
  };

  console.log('Current state:', {
    isTextTruncated,
    expanded,
    textContent: children?.substring(0, 50) + '...',
  });

  return (
    <View
      style={[{width: '100%'}, style]}
      onLayout={e => {
        console.log('Container layout:', e.nativeEvent.layout);
      }}>
      <Text
        style={[
          type && {...fontWeights(), ...fontSize()},
          {
            color: color || colors.textColor,
            ...Platform.select({
              ios: {
                lineHeight: fontSize().fontSize * 1.3,
              },
              android: {
                lineHeight: fontSize().fontSize * 1.2,
              },
            }),
          },
          align && {textAlign: align},
        ]}
        numberOfLines={expanded ? undefined : numberOfLines}
        onTextLayout={onTextLayout}
        {...props}>
        {children}
      </Text>

      {isTextTruncated && (
        <TouchableOpacity
          onPress={() => {
            console.log('Toggle expanded from:', expanded);
            setExpanded(!expanded);
          }}
          style={{
            marginTop: 5,
            paddingVertical: 5,
          }}>
          <Text
            style={{
              color: colors.primary || 'red',
              textDecorationLine: 'underline',
            }}>
            {expanded ? 'Read Less' : 'Read More'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
export default React.memo(ZTextMore);
