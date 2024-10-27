import {Color} from '../../styles/GlobalStyles';
import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  Button,
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useFrameCallback,
  useSharedValue,
} from 'react-native-reanimated';
import ZText from '../ZText';

const MeasureElement = ({onLayout, children}) => (
  <Animated.ScrollView
    horizontal
    style={marqueeStyles.hidden}
    pointerEvents="box-none">
    <View onLayout={ev => onLayout(ev.nativeEvent.layout.width)}>
      {children}
    </View>
  </Animated.ScrollView>
);

const TranslatedElement = ({index, children, offset, childrenWidth}) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      left: (index - 1) * childrenWidth,
      transform: [
        {
          translateX: -offset.value,
        },
      ],
    };
  });
  return (
    <Animated.View style={[styles.animatedStyle, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

const getIndicesArray = length => Array.from({length}, (_, i) => i);

const Cloner = ({count, renderChild}) => (
  <>{getIndicesArray(count).map(renderChild)}</>
);

const ChildrenScroller = ({
  duration,
  childrenWidth,
  parentWidth,
  reverse,
  children,
}) => {
  const offset = useSharedValue(0);
  const coeff = useSharedValue(reverse ? 1 : -1);

  React.useEffect(() => {
    coeff.value = reverse ? 1 : -1;
  }, [reverse]);

  useFrameCallback(i => {
    // prettier-ignore
    offset.value += (coeff.value * ((i.timeSincePreviousFrame ?? 1) * childrenWidth)) / duration;
    offset.value = offset.value % childrenWidth;
  }, true);

  const count = Math.round(parentWidth / childrenWidth) + 2;
  const renderChild = index => (
    <TranslatedElement
      key={`clone-${index}`}
      index={index}
      offset={offset}
      childrenWidth={childrenWidth}>
      {children}
    </TranslatedElement>
  );

  return <Cloner count={count} renderChild={renderChild} />;
};

const Marquee = ({duration = 40000, reverse = true, children, style}) => {
  const [parentWidth, setParentWidth] = React.useState(0);
  const [childrenWidth, setChildrenWidth] = React.useState(0);

  return (
    <View
      style={style}
      onLayout={ev => {
        setParentWidth(ev.nativeEvent.layout.width);
      }}
      pointerEvents="box-none">
      <View style={marqueeStyles.row} pointerEvents="box-none">
        <MeasureElement onLayout={setChildrenWidth}>{children}</MeasureElement>

        {childrenWidth > 0 && parentWidth > 0 && (
          <ChildrenScroller
            duration={duration}
            parentWidth={parentWidth}
            childrenWidth={childrenWidth}
            reverse={reverse}>
            {children}
          </ChildrenScroller>
        )}
      </View>
    </View>
  );
};

const marqueeStyles = StyleSheet.create({
  hidden: {opacity: 0, zIndex: -1},
  row: {flexDirection: 'row', overflow: 'hidden'},
});

function MarqueeScreen(marqueeTextList: any) {
  const navigation = useNavigation();
  const [reverse, setReverse] = useState(false);

  const handlePress = (postId, categoryId) => {
    navigation.navigate('ItemDetailScreen', {
      postId: postId,
      postType: categoryId == 2 ? 'Car/Post' : 'Post',
    });
  };
  return (
    <View style={styles.container}>
      <View style={styles.safeArea}>
        <Marquee reverse={true} style={styles.marqueeContainer}>
          <View style={styles.marqueeContent}>
            {marqueeTextList.marqueeTextList.map(item => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handlePress(item.postId, item.categoryId)}>
                <ZText
                  type={'B18'}
                  style={{color: '#fff', paddingHorizontal: 10}}>
                  {item.marqueueText}
                </ZText>
              </TouchableOpacity>
            ))}
          </View>
        </Marquee>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  horseImage: {
    width: 140,
    height: 80,
    marginRight: 80,
  },
  marqueeContainer: {
    minWidth: '90%', // Set a fixed or minimum width
  },
  marqueeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  container: {
    flex: 1,
  },
  safeArea: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,

    backgroundColor: Color.primary,
  },
  animatedStyle: {
    position: 'absolute',
  },
  circle: {
    marginTop: 4,
    borderRadius: 100,
    height: 120,
    width: 160,
    backgroundColor: '#b58df1',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MarqueeScreen;
