import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MarqueeText from '../MarqueeText';


export type MarqueeBannerProps = {
  marqueeTextList: [];
};

export const MarqueeBanner: React.FC<MarqueeBannerProps> = ({ marqueeTextList }) => {
  const marqueeList = marqueeTextList !== undefined ? marqueeTextList.join(": ") : ""
  const [indexText, setIndexText] = useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIndexText(index => {
        if(index > (marqueeTextList.length -2)) {
          return 0
        } else {
          return index + 1
        }
      });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
   <View style={styles.marqueeBannerContainer}>
       <MarqueeText
          style={styles.marqueeBannerText}
          speed={1}
          marqueeOnStart={true}
          loop={true}
          delay={3000}
        >
         {`${marqueeTextList[indexText]}`}
        </MarqueeText>
   </View>
  );
};
const styles = StyleSheet.create({
  marqueeBannerContainer: {
    flex: 0,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 42,
    flexShrink: 0,
    backgroundColor: '#D23434',
  },
  marqueeBannerText: {
    color: '#FFF',
  }
});
export default MarqueeBanner;


