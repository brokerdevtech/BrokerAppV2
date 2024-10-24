import React from 'react';
import { View,StyleSheet } from 'react-native';
import { HStack } from '../../components/ui/hstack';
import ZText from './ZText';
import { Icon } from '../../components/ui/icon';
import { bathroomType} from '../assets/svg';
import { balconyType} from '../assets/svg';
import { bedroomType} from '../assets/svg';
import { propertySize} from '../assets/svg';
const iconMap = {
  bathroomType: bathroomType,
  balconyType: balconyType,
  bedroomType: bedroomType,
  propertySize: propertySize,
};
const IconValueDisplay = ({ IconKey, value }) => {
  if (!value) {
    return null; // Do not render if value doesn't exist
  }
  const IconComponent = iconMap[IconKey];

  // If the icon is not found in the mapping, do not render
  if (!IconComponent) {
    console.warn(`Icon for key "${IconKey}" not found`);
    return null;
  }
  return (
    <HStack space="xs" reversed={false} style={{ paddingVertical: 10 , marginRight:10}}>
      <View style={styles.LeftCol}>
      <Icon as={IconComponent} size='md'  />
      
      </View>
      <View style={styles.RightCol}>
        <ZText type={'R14'}>{value}</ZText>
      </View>
    </HStack>
  );
};
const styles = StyleSheet.create({
  
  LeftCol:{
    marginRight:5
  },
  RightCol:{
    marginRight:5
  },
  
  });
export default IconValueDisplay;
