import React from 'react';
import { Button, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Avatar, AvatarBadge, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import margin from '@/themes/margin';
import padding from '@/themes/padding';
import { HStack } from '@/components/ui/hstack';
import { Box } from '@/components/ui/box';
import { VStack } from 'native-base';
import c1 from '../../assets/images/c1.png';
import c2 from '../../assets/images/c2.png';
import p1 from '../../assets/images/p1.png';
import p2 from '../../assets/images/p2.png';



interface ProductSectionProps {
   heading: string,
   background: string
}

const ProductSection = (props: ProductSectionProps) => {
  return (
   <View style={{backgroundColor: props.background, paddingVertical: 20}}>
       <HStack space="md" reversed={false} style={styles.heading}>
            <Text style={styles.headingTitle}>{props.heading}</Text>
            <Text style={styles.link}>See All</Text>
        </HStack>
        <HStack space="md" reversed={false} style={{paddingHorizontal: 20}}>
           <VStack style={styles.itemContainer}>
             <TouchableOpacity onPress={() => console.log()}>
                <Box className="h-213 w-132" style={styles.itemContainer} >
                    <Image source={c1} style={styles.tagImage}/>
                    <View style={styles.itemFooterContainer}>
                      <Text>$ 2909</Text>
                      <Text>Dubai</Text>
                      <Text>Mercedes-benz</Text>
                    </View>
                </Box>
              </TouchableOpacity> 
           </VStack>

           <VStack style={styles.itemContainer}>
              <Box className="h-213 w-132" >
                <TouchableOpacity onPress={() => console.log()}>
                  <Image source={p2} style={styles.tagImage}/>
                   <View style={styles.itemFooterContainer}>
                    <Text>$ 2909</Text>
                    <Text>Dubai</Text>
                    <Text>Mercedes-benz</Text>
                  </View>
                </TouchableOpacity>
              </Box> 
           </VStack>

           <VStack style={styles.itemContainer}>
              <Box className="h-213 w-132" >
                <TouchableOpacity onPress={() => console.log()}>
                  <Image source={p1} style={styles.tagImage}/>
                  <View style={styles.itemFooterContainer}>
                    <Text>$ 2909</Text>
                    <Text>Dubai</Text>
                    <Text>Mercedes-benz</Text>
                  </View>
                </TouchableOpacity>
              </Box> 
           </VStack>

           <VStack style={styles.itemContainer}>
              <Box className="h-213 w-132" >
                <TouchableOpacity onPress={() => console.log()}>
                  <Image source={p2} style={styles.tagImage}/>
                    <View style={styles.itemFooterContainer}>
                      <Text>$ 2909</Text>
                      <Text>Dubai</Text>
                      <Text>Mercedes-benz</Text>
                    </View>
                </TouchableOpacity>
              </Box> 
           </VStack>
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
    marginBottom: 10,
    paddingHorizontal: 20,
    paddingVertical: 20
  },
  headingTitle: {
    color: '#263238',
    fontFamily: 'Gilroy',
    fontSize: 18,
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: 24,
  },
  link: {
    color: '#C20707',
    textAlign: 'right',
    fontFamily: 'Gilroy',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: 20 
  },

  itemContainer: {
    width: 132,
    height: 213,
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,  
    elevation: 5

  },
  itemFooterContainer: {
    backgroundColor: '#FFF',
    paddingVertical: 20,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,

  },
  tagImage: {
    width: 132,
    height: 113,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,

  }
  

  
});
export default ProductSection;
