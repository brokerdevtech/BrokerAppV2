import React from 'react';
import { Button, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Avatar, AvatarBadge, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import margin from '@/themes/margin';
import padding from '@/themes/padding';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Divider } from '@/components/ui/divider';

import HomeIcon from '../../assets/svg/icons/home.svg'
import CarIcon from '../../assets/svg/icons/car.svg';
import LoanIcon from '../../assets/svg/icons/loan.svg';



const Footer = () => {
  return (
   <View style={styles.footerContainer}>
      <View>
        <Text style={styles.footerAppDescription}>
            Single platform having community of brokers from multiple industries to create collaboration for growth of business by fulfilling their business requirements
        </Text>
       </View>  
       <View style={styles.productContainer}>
           <HStack style={styles.productRowContainer}>
              <VStack style={styles.productColContainer}>
                 <View>
                    <HomeIcon />
                 </View>
                 <Text style={styles.productTitle}>Property Brokers</Text>
                 <Text style={styles.productCount}>5000</Text>
              </VStack>
              <VStack style={styles.productColContainer}>
                 <View>
                    <CarIcon />
                 </View>
                 <Text style={styles.productTitle}>Car Brokers</Text>
                 <Text style={styles.productCount}>2000</Text>
              </VStack>
           </HStack>
       </View>
       <Divider className="my-0.5" style={{ marginLeft: 20, marginRight: 20 }}/>
       <View style={styles.productContainer}>
           <HStack style={styles.productRowContainer}>
              <VStack style={styles.productColContainer}>
                 <View>
                    <LoanIcon />
                 </View>
                 <Text style={styles.productTitle}>Loan Brokers</Text>
                 <Text style={styles.productCount}>800</Text>
              </VStack>
              <VStack style={styles.productColContainer}>
                 <View>
                    <HomeIcon />
                 </View>
                 <Text style={styles.productTitle}>Insurance Brokers</Text>
                 <Text style={styles.productCount}>5000</Text>
              </VStack>
           </HStack>
       </View>
       <Divider className="my-0.5" style={{ marginLeft: 20, marginRight: 20 }} />
       <View style={styles.productContainer}>
           <HStack style={styles.productRowContainer}>
              <VStack style={styles.productColContainer}>
                 <View>
                    <HomeIcon />
                 </View>
                 <Text>Travel Brokers</Text>
                 <Text>2000</Text>
              </VStack>
              <VStack style={styles.productColContainer}>
                 <View>
                    <CarIcon />
                 </View>
                 <Text style={styles.productTitle}>Wealth Brokers</Text>
                 <Text style={styles.productCount}>500</Text>
              </VStack>
           </HStack>
       </View>
       <View style={styles.appFooterContainer}>
          <View style={styles.appContainer}>
             <Text style={styles.appHeading}>BrokerApp</Text>  
             <Text style={styles.appDetail}>Our vision is to dive the brokers into a world of opportunity to gain access to thousands of other brokers to elevate their business with our exclusive platform, offering a diverse range of projects across industry.</Text>  
          </View>  
       </View> 
   </View> 
  );
};
const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: '#F7F8FA',
  },
  footerAppDescription: {
    color: '#263238',
    fontFamily: 'Gilroy',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: 20,
    padding: 20
  },
  productContainer: {
    padding: 20,
  },
  
  productRowContainer: {
    flex: 0,
    justifyContent: 'space-between'
  },
  productColContainer: {
    width: 130
  },
  productTitle: {
    paddingTop: 5,
    color: '#7C8091',
    fontFamily: 'Gilroy',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: 24
  },
  productCount: {
    paddingTop: 5,
    color: '#263238',
    fontFamily: 'Gilroy',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: 600,
    lineHeight: 24
  },
  appFooterContainer: {
    backgroundColor: "#8E0707",
  },
  appContainer: {
    paddingTop: 30,
    paddingLeft: 20,
    paddingRight: 12,
    paddingBottom: 34,
  },
  appHeading: {
    color: "#FFF",
    fontFamily: 'Gilroy-Bold',
    fontSize: 28,
    fontStyle: 'normal',
    fontWeight: 400, //
    lineHeight: 34
  },
  appDetail: {
    color: '#FFF',
    fontFamily: 'Gilroy',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: 20,
    paddingTop: 12 
  }
  
});
export default Footer;
