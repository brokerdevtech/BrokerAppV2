import React, { useEffect } from 'react';
import { Button, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Avatar, AvatarBadge, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import margin from '@/themes/margin';
import padding from '@/themes/padding';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Divider } from '@/components/ui/divider';
import { useApiRequest } from '@/src/hooks/useApiRequest';
import { fetchDashboardFooterCount} from '../../../BrokerAppCore/services/new/dashboardService';

import HomeIcon from '../../assets/svg/icons/home.svg'
import CarIcon from '../../assets/svg/icons/car.svg';
import LoanIcon from '../../assets/svg/icons/loan.svg';
import ZText from '../../sharedComponents/ZText';



const Footer = () => {
  const {data, status, error, execute} = useApiRequest(fetchDashboardFooterCount);
  const callFooterList = async () => { await execute() };
  useEffect(() => {
   callFooterList();
  }, []);
  console.log("Footer Data ====>", data)
  return (
   <View style={styles.footerContainer}>
       <View style={styles.footerAppDescription}>
         <ZText type={'M14'}>Single platform having community of brokers from multiple industries to create collaboration for growth of business by fulfilling their business requirements</ZText>
       </View>  
       {data !== null && (
         <View style={styles.productFooterContainer}>
            <View style={styles.productContainer}>
               <HStack style={styles.productRowContainer}>
                  <VStack style={styles.productColContainer}>
                     <View style={{ paddingBottom: 10 }}>
                        <HomeIcon />
                     </View>
                     <ZText type={'R16'}>{data[0].categoryName}</ZText>
                     <ZText type={'S16'}>{data[0].brokerCount}</ZText>
                  </VStack>
                  <VStack style={styles.productColContainer}>
                     <View style={{ paddingBottom: 10 }}>
                        <CarIcon />
                     </View>
                     <ZText type={'R16'}>{data[1].categoryName}</ZText>
                     <ZText type={'S16'}>{data[1].brokerCount}</ZText>
                  </VStack>
               </HStack>
            </View>
            <Divider className="my-0.5"/>
            <View style={styles.productContainer}>
               <HStack style={styles.productRowContainer}>
                  <VStack style={styles.productColContainer}>
                     <View style={{ paddingBottom: 10 }}>
                        <LoanIcon />
                     </View>
                     <ZText type={'R16'}>{data[2].categoryName}</ZText>
                     <ZText type={'S16'}>{data[2].brokerCount}</ZText>
                  </VStack>
                  <VStack style={styles.productColContainer}>
                     <View style={{ paddingBottom: 10 }}>
                        <HomeIcon />
                     </View>
                     <ZText type={'R16'}>{data[3].categoryName}</ZText>
                     <ZText type={'S16'}>{data[3].brokerCount}</ZText>
                  </VStack>
               </HStack>
            </View>
            <Divider className="my-0.5"/>
            <View style={styles.productContainer}>
               <HStack style={styles.productRowContainer}>
                  <VStack style={styles.productColContainer}>
                     <View style={{ paddingBottom: 10 }}>
                        <HomeIcon />
                     </View>
                     <ZText type={'R16'}>{data[4].categoryName}</ZText>
                     <ZText type={'S16'}>{data[4].brokerCount}</ZText>
                  </VStack>
                  <VStack style={styles.productColContainer}>
                     <View style={{ paddingBottom: 10 }}>
                        <CarIcon />
                     </View>
                     <ZText type={'R16'}>{data[5].categoryName}</ZText>
                     <ZText type={'S16'}>{data[5].brokerCount}</ZText>
                  </VStack>
               </HStack>
            </View>
       </View>)}
       <View style={styles.appFooterContainer}>
          <View style={styles.appContainer}>
            <ZText type={'B28'} style={styles.appHeading}>BrokerApp</ZText>
            <ZText type={'M14'} style={styles.appDetail}>Our vision is to dive the brokers into a world of opportunity to gain access to thousands of other brokers to elevate their business with our exclusive platform, offering a diverse range of projects across industry.</ZText>
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
    padding: 20
  },
  productFooterContainer: {
   paddingHorizontal: 20
  },
  productContainer: {
    padding: 20,
  },
  dividerContainer: {
   marginHorizontal: 20
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
    lineHeight: 34
  },
  appDetail: {
    color: '#FFF',
    lineHeight: 20,
    paddingTop: 12 
  }
  
});
export default Footer;
