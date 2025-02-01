import React, { useEffect } from 'react';
import { View, Text, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withDelay, withTiming, runOnJS } from 'react-native-reanimated';
import MarqueeText from 'react-native-marquee';
import MarqueeView from 'react-native-marquee-view';
const { width } = Dimensions.get('window');



const MarqueeTextCollection = ({  duration = 5000 }) => {
    const contents = [
        "This is the first marquee text. It should move smoothly across the screen without truncation or clipping.",
        "Second marquee text, ensuring it is fully visible and does not break into multiple lines.",
        "Another example of a long text to confirm it scrolls properly without getting clipped.",
      ];
    const [currentIndex, setCurrentIndex] = React.useState(0);

  const handleNext = () => {
    if (currentIndex < texts.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    } else {
      setCurrentIndex(0); // Loop back to the first text
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
     <MarqueeView
	style={{
		backgroundColor: 'red',
		width: '100%',
	}}>
	<View style={{flex:1,display:'flex',flexDirection:'row',gap:300 }}>
    {contents.map((text, index) => (
       <Text style={{color:'white'}}>
        {text}
       </Text>
      ))}
    
    	
	</View>
</MarqueeView>
    </View>
  );
};

export default MarqueeTextCollection;
