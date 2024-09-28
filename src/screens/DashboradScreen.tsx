import React, { useEffect } from 'react';
import {View, Text, ScrollView, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {RootState} from '@reduxjs/toolkit/query';
import { HStack } from '@/components/ui/hstack';
import { Grid, GridItem  } from '@/components/ui/grid';
import FastImage from '@d11/react-native-fast-image';
import { imagesBucketcloudfrontPath } from '../config/constants';
import ZText from '../sharedComponents/ZText';
import {useApiRequest} from '@/src/hooks/useApiRequest';
import { fetchPodcastList } from '@/BrokerAppcore/services/new/podcastService';

import TABCard from '../assets/svg/Tabicon/tab_card.svg' 
import TABInsurance from '../assets/svg/Tabicon/tab_insurance.svg';
import TABLoan from '../assets/svg/Tabicon/tab_loan.svg';
import TABTravel from '../assets/svg/Tabicon/tab_travel.svg';
import TABWealth from '../assets/svg/Tabicon/tab_wealth.svg';

import { Card } from '@/components/ui/card';
import { Image } from '@/components/ui/image';
import { VStack } from '@/components/ui/vstack';
import { Heading } from '@/components/ui/heading';
import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import Footer from './Dashboard/Footer';
import BrandAssociated from './Dashboard/BrandAssociated';
import ProductSection from './Dashboard/ProductSection';





export default function DashboradScreen() {
  const AppLocation = useSelector((state: RootState) => state.AppLocation);
  const user = useSelector((state: RootState) => state.user.user);
  const {data, status, error, execute} = useApiRequest(fetchPodcastList);
  const navigation = useNavigation();

  const callPodcastList = async () => {
    await execute(user.userId, 1, 4);
    console.log('Data :-', data);
    console.log('Error :-', error);
    console.log('Status :-', status);
  };
 
  useEffect(() => {
     callPodcastList();
  }, [])
  
  
  const handleThumbnailTap = async (item, index) => {
    navigation.navigate('VideoReels', {
      podcastitem: item,
      podcastId: item.podcastId,
      podcastData: data,
      podcastIndex: index,
      podcastPage: 1,
    });
  };


  const renderPodcastItems = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => handleThumbnailTap(item, index)}
        style={{
          position: 'relative',
          height: 180,
          width: 120,
          marginRight: 8,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <FastImage
          source={{ uri: `${imagesBucketcloudfrontPath}${item.mediaThumbnail}` }}
          style={{
            borderRadius: 8,
            width: '100%',
            height: '100%',
          }}
        />
  
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'flex-end',
            padding: 8,
          }}>
          <View>
            <ZText
              type={'r14'}
              style={{
                color: 'white',
                textShadowColor: 'rgba(0, 0, 0, 0.1)',
                textShadowOffset: {width: 0, height: 2},
                textShadowRadius: 4,
              }}>
              {item.viewerCount} views
            </ZText>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.scrollView}>
    <View>
      {/* <Text>DashboradScreen</Text>
      <Text>{AppLocation.city}</Text>
      <Text>{AppLocation.state}</Text>
      <Text>{AppLocation.country}</Text>
      <Text>{AppLocation.placeID}</Text>
      <Text>{AppLocation.placeName}</Text> */}


        <Grid className="gap-3 p-4" _extra={{className: "grid-cols-9",}}>
          <GridItem className="bg-background-50 p-2 rounded-md text-center" _extra={{ className: "col-span-9",}}>
            <Text className="text-md" style={styles.headingTitle}>Find what you are looking for</Text>
          </GridItem>
          <GridItem className="bg-background-0 p-4 rounded-md text-center" _extra={{ className: "col-span-3",}}>
            <View style={styles.tabItemContainer}>
              <TABTravel />
              <Text className="text-sm mt-1" style={styles.tabItemTitle}>Property</Text>
            </View>
          </GridItem>
          <GridItem className="bg-background-0 p-4 rounded-md text-center" _extra={{ className: "col-span-3",}}>
            <View style={styles.tabItemContainer}>
             
             <TABCard />
             <Text className="text-md" style={styles.tabItemTitle}>Car</Text>
            </View>
          </GridItem>
          <GridItem className="bg-background-0 p-4 rounded-md text-center" _extra={{ className: "col-span-3",}}>
            <View style={styles.tabItemContainer}>
              <TABLoan />
              <Text className="text-md" style={styles.tabItemTitle}>Loan</Text>
            </View>
          </GridItem>
          <GridItem className="bg-background-0 p-4 rounded-md text-center" _extra={{ className: "col-span-3",}}>
            <View style={styles.tabItemContainer}>
              <TABInsurance />
              <Text className="text-md" style={styles.tabItemTitle}>Insurance</Text>
            </View>
          </GridItem>
          <GridItem className="bg-background-0 p-4 rounded-md text-center" _extra={{ className: "col-span-3",}}>
            <View style={styles.tabItemContainer}>
              <TABTravel />
              <Text className="text-md" style={styles.tabItemTitle}>Travel</Text>
            </View>
          </GridItem>
          <GridItem className="bg-background-0 p-4 rounded-md text-center" _extra={{ className: "col-span-3",}}>
            <View style={styles.tabItemContainer}>
              <TABWealth />
              <Text className="text-md" style={styles.tabItemTitle}>Wealth</Text>
            </View>
          </GridItem>
        </Grid>   
        <ProductSection heading={'Newly Launch'} background={'#FFFFFF'} />
        <ProductSection heading={'Recent Search'} background={'#F7F8FA'} />
        <ProductSection heading={'New In Property'} background={'#FFFFFF'} />
        <ProductSection heading={'New In Car'} background={'#F7F8FA'} />
        <ProductSection heading={'New In Loan'} background={'#FFFFFF'} />

      {/* Podcast */}
      <View style={styles.container}>
        <HStack space="md" reversed={false} style={styles.heading}>
            <Text style={styles.headingTitle}>Podcast</Text>
            <Text style={styles.headingLink}>See All</Text>
        </HStack>
        <HStack space="md" reversed={false} style={styles.list}>
            <FlatList
              data={data} 
              keyExtractor={item => item.podcastId.toString()}
              renderItem={renderPodcastItems}
              initialNumToRender={3}
              showsHorizontalScrollIndicator={false}
              horizontal
              onEndReachedThreshold={0.8}
              // onEndReached={fetchMoreData}
            />
        </HStack>
      </View>
      <BrandAssociated />
      <Footer />
    </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#F7F8FA',
  },
  tabContainer: {
    backgroundColor: '#F7F8FA',
    margin: 10
  },
  tabItemTitle: {
    color: '#000',
    fontSize: 16,
  },
  tabItemContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center'
  },
  container: {
    flexDirection: 'column',
    margin: 10
  },
  heading: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    marginBottom: 10
  },
  headingTitle: {
    color: '#000',
    fontSize: 20,
  },

  headingLink: {
    color: '#b71c1c',
    fontSize: 16,
  },
  list: {
    flexDirection: 'row',
    flex: 2,
    justifyContent: 'space-between',
  },
  

});