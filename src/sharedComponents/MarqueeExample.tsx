//import { Marquee } from '@animatereactnative/marquee';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TextTicker from 'react-native-text-ticker'
import MarqueeView from 'react-native-marquee-view';
const MarqueeExample = () => {
  const contents = [
    "Short Text This is a slightly longer scrolling text slightly longer scrolling text ",
    "This is a slightly.",
    "A much longer text that should take more time to."
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMarquee, setShowMarquee] = useState(true);
  
  // Function to determine duration based on text length
  const getDuration = (text: string) => Math.max(text.length * 100, 2000); // Min duration of 2 seconds

  useEffect(() => {
    const duration = getDuration(contents[currentIndex]);

    // const interval = setTimeout(() => {
    //   setShowMarquee(false); // Hide marquee after animation ends

    //   setTimeout(() => {
    //     setCurrentIndex((prevIndex) => (prevIndex + 1) % contents.length);
    //     setShowMarquee(true); // Show marquee after delay
    //   }, 1000); // Pause before switching text

    // }, duration); // Adjust duration dynamically based on text length

    // return () => clearTimeout(interval);
  }, [currentIndex]);
  const onMarqueeComplete = () => {
   console.log("onMarqueeComplete");
setCurrentIndex((prevIndex) => (prevIndex + 1) % contents.length);
  };
  return (
    <View style={styles.container}>
      {showMarquee && (
    //     <TextTicker
    //     style={{ fontSize: 24 }}
    //     scrollSpeed={18}
    //     animationType={'auto'}
    //     loop
      
    //   >
    //     Super long piece of text is long. The quick brown fox jumps over the lazy dog.
    //   </TextTicker> 
      <TextTicker
    style={{ fontSize: 24 }}
   // scrollSpeed={18}
    animationType={'auto'}
    duration={150*contents[currentIndex].length}
    onMarqueeComplete={onMarqueeComplete}
    marqueeDelay={1}
    
    >
       
       
          <Text style={styles.text}>{contents[currentIndex]}</Text>
        </TextTicker>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'red',
    alignItems: 'center',
    width:'100%',
    paddingHorizontal:10
  },
  marquee: {
    width: '90%',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color:'white'
  },
});

export default MarqueeExample;
