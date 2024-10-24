import React from 'react';
import { View,StyleSheet } from 'react-native';
import { HStack } from '../../components/ui/hstack';
import ZText from './ZText';


const KeyValueDisplay = ({ label, value }) => {
  if (!value) {
    return null; // Do not render if value doesn't exist
  }

  return (
    <HStack space="xs" reversed={false} style={{ paddingVertical: 5 }}>
      <View style={styles.LeftCol}>
        <ZText type={'R14'}>{label}</ZText>
      </View>
      <View style={styles.RightCol}>
        <ZText type={'B14'}>{value}</ZText>
      </View>
    </HStack>
  );
};
const styles = StyleSheet.create({
  
  LeftCol:{
    width:"50%"
  },
  RightCol:{
    width:"50%"
  },
  
  });
export default KeyValueDisplay;
