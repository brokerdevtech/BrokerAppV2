import React from 'react';
import { Button, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Avatar, AvatarBadge, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import margin from '@/themes/margin';
import padding from '@/themes/padding';
import { HStack } from '@/components/ui/hstack';

const BrandAssociated = () => {
  return (
   <View style={styles.footerContainer}>
       <HStack space="md" reversed={false} style={styles.heading}>
            <Text style={styles.headingTitle}>Brands Associated</Text>
        </HStack>
       
   </View>
  );
};
const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: '#FFF',
  },
  heading: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    marginBottom: 10
  },
  headingTitle: {
    color: '#263238',
    fontFamily: 'Gilroy',
    fontSize: 18,
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: 24,
    padding: 20
  }
  
});
export default BrandAssociated;
