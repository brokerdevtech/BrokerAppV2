import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MarqueeText from '../MarqueeText';


export type MarqueeBannerProps = {
  marqueeTextList: [];
};

export const MarqueeBanner: React.FC<MarqueeBannerProps> = ({ marqueeTextList }) => {
  const marqueeList = marqueeTextList !== undefined ? marqueeTextList.join(": ") : ""
  return (
   <View style={styles.marqueeBannerContainer}>
       <MarqueeText
          style={styles.marqueeBannerText}
          speed={1}
          marqueeOnStart={true}
          loop={true}
          delay={3000}
        >
         {marqueeList}
          
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
    fontFamily: 'Gilroy',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: 22
  }
});
export default MarqueeBanner;
