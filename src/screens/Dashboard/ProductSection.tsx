import React, { useEffect } from 'react';
import { FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Box } from '@/components/ui/box';
import { useApiRequest } from '@/src/hooks/useApiRequest';
import { fetchDashboardData, ListDashboardPostRequest } from '@/BrokerAppCore/services/new/dashboardService';

import ZText from '../../sharedComponents/ZText';
import c1 from '../../assets/images/c1.png';
import c2 from '../../assets/images/c2.png';
import p1 from '../../assets/images/p1.png';
import p2 from '../../assets/images/p2.png';


interface ProductSectionProps {
   heading: string,
   background: string,
   endpoint: string,
   request: ListDashboardPostRequest
}

const ProductSection = (props: ProductSectionProps) => {

  const { data, status, error, execute } = useApiRequest(fetchDashboardData);

  const callPodcastList = async () => {
    await execute(props.endpoint, props.request);
    console.log(props.heading, 'data :-', data);
    
    
    console.log('status :-', status);
    console.log('error :-', error);
  };
 
  useEffect(() => {
     callPodcastList();
  }, [])

  const renderProductItems = ({item, index}) => {
    return(
      <VStack style={styles.itemContainer} key={index}>
          <TouchableOpacity onPress={() => console.log()}>
            <Box className="h-213 w-132" style={styles.itemContainer} >
                <Image source={c1} style={styles.tagImage}/>
                <VStack space="sm" style={styles.itemFooterContainer}>
                  <ZText type={'M14'}>$ {item.price}</ZText>
                  <ZText type={'M14'}>{item.city}</ZText>
                  <ZText type={'M14'}>{item.title}</ZText>
                </VStack>
            </Box>
          </TouchableOpacity> 
      </VStack>
    )
  }

  return (
   <View style={{backgroundColor: props.background, paddingVertical: 20}}>
       <HStack space="md" reversed={false} style={styles.heading}>
            <ZText type={'R18'}>{props.heading}</ZText>
            <ZText type={'R14'} style={styles.link}>See All</ZText>
        </HStack>
        <HStack space="md" reversed={false} style={{paddingHorizontal: 20}}>
            <FlatList
              data={data} 
              keyExtractor={item => item.postId.toString()}
              renderItem={renderProductItems}
              initialNumToRender={3}
              showsHorizontalScrollIndicator={false}
              horizontal
              onEndReachedThreshold={0.8}
            />           
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
    paddingLeft: 10,
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
