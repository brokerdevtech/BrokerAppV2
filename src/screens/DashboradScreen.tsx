import React, {useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {RootState} from '@reduxjs/toolkit/query';
import {HStack} from '@/components/ui/hstack';
import {Grid, GridItem} from '@/components/ui/grid';
import FastImage from '@d11/react-native-fast-image';
import {imagesBucketcloudfrontPath} from '../config/constants';
import ZText from '../sharedComponents/ZText';
import {useApiRequest} from '@/src/hooks/useApiRequest';
import {fetchPodcastList} from '@/BrokerAppCore/services/new/podcastService';

import TABCard from '../assets/svg/Tabicon/tab_card.svg';
import TABInsurance from '../assets/svg/Tabicon/tab_insurance.svg';
import TABLoan from '../assets/svg/Tabicon/tab_loan.svg';
import TABTravel from '../assets/svg/Tabicon/tab_travel.svg';
import TABWealth from '../assets/svg/Tabicon/tab_wealth.svg';

import {Card} from '@/components/ui/card';
import {Image} from '@/components/ui/image';
import {VStack} from '@/components/ui/vstack';
import {Heading} from '@/components/ui/heading';
import {Box} from '@/components/ui/box';
import {Button} from '@/components/ui/button';
import Footer from './Dashboard/Footer';
import BrandSection from './Dashboard/BrandSection';
import ProductSection from './Dashboard/ProductSection';
import UserProfile from '../sharedComponents/profile/UserProfile';
import MarqueeBanner from '../sharedComponents/profile/MarqueeBanner';
import {fetchDashboardData} from '../../BrokerAppCore/services/new/dashboardService';

export default function DashboradScreen() {
  const AppLocation = useSelector((state: RootState) => state.AppLocation);
  const user = useSelector((state: RootState) => state.user.user);
  console.log(user);
  const {data, status, error, execute} = useApiRequest(fetchPodcastList);
  // const {data: marqueeText, status: marqueeStatus, error: marqueeError, execute: marqueeExecute} = useApiRequest(fetchDashboardData);
  const cityToShow = 'Noida';
  const navigation = useNavigation();

  const callPodcastList = async () => {
    await execute(user.userId, 1, 4);
    // await marqueeExecute(1, 5, 'Marqueue', 'Noida')
    // console.log('marqueeText :-', marqueeText);
    // console.log('marqueeStatus :-', marqueeStatus);
    // console.log('marqueeError :-', marqueeError);
  };
  const callmarList = async () => {
    const request = {pageNo: 1, pageSize: 10, cityName: cityToShow};
    await marqueeExecute('Marqueue', request);
  };
  const {
    data: marqueeText,
    status: marqueeStatus,
    error: marqueeError,
    execute: marqueeExecute,
  } = useApiRequest(fetchDashboardData);
  useEffect(() => {
    callPodcastList();
    callmarList();
  }, []);

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
          source={{uri: `${imagesBucketcloudfrontPath}${item.mediaThumbnail}`}}
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
        <View style={styles.subHeaderSection}>
          <UserProfile />
          {marqueeText?.length > 0 && (
            <MarqueeBanner
              marqueeTextList={marqueeText.map(
                (item: any) => item.marqueueText,
              )}
            />
          )}
        </View>
        <Grid className="gap-3 p-4" _extra={{className: 'grid-cols-9'}}>
          <GridItem
            className="bg-background-50 p-2 rounded-md text-center"
            _extra={{className: 'col-span-9'}}>
            <ZText type={'R18'}>Find what you are looking for</ZText>
          </GridItem>
          <GridItem
            className="bg-background-0 p-4 rounded-md text-center"
            _extra={{className: 'col-span-3'}}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('ItemListScreen', {listType: 'RealEstate'})
              }>
              <View style={styles.tabItemContainer}>
                <TABTravel />
                <ZText type={'R16'} style={styles.tabItemTitle}>
                  Property
                </ZText>
              </View>
            </TouchableOpacity>
          </GridItem>
          <GridItem
            className="bg-background-0 p-4 rounded-md text-center"
            _extra={{className: 'col-span-3'}}>
        <TouchableOpacity
              onPress={() =>
                navigation.navigate('ItemListScreen', {listType: 'Car'})
              }>
              <View style={styles.tabItemContainer}>
                <TABCard />
                <ZText type={'R16'} style={styles.tabItemTitle}>
                  Car
                </ZText>
              </View>
            </TouchableOpacity>
          </GridItem>
          <GridItem
            className="bg-background-0 p-4 rounded-md text-center"
            _extra={{className: 'col-span-3'}}>
            <View style={styles.tabItemContainer}>
              <TABLoan />
              <ZText type={'R16'} style={styles.tabItemTitle}>
                Loan
              </ZText>
            </View>
          </GridItem>
          <GridItem
            className="bg-background-0 p-4 rounded-md text-center"
            _extra={{className: 'col-span-3'}}>
            <View style={styles.tabItemContainer}>
              <TABInsurance />
              <ZText type={'R16'} style={styles.tabItemTitle}>
                Insurance
              </ZText>
            </View>
          </GridItem>
          <GridItem
            className="bg-background-0 p-4 rounded-md text-center"
            _extra={{className: 'col-span-3'}}>
            <View style={styles.tabItemContainer}>
              <TABTravel />
              <ZText type={'R16'} style={styles.tabItemTitle}>
                Travel
              </ZText>
            </View>
          </GridItem>
          <GridItem
            className="bg-background-0 p-4 rounded-md text-center"
            _extra={{className: 'col-span-3'}}>
            <View style={styles.tabItemContainer}>
              <TABWealth />
              <ZText type={'R16'} style={styles.tabItemTitle}>
                Wealth
              </ZText>
            </View>
          </GridItem>
        </Grid>
        <ProductSection
          heading={'Newly Launch'}
          background={'#FFFFFF'}
          endpoint={`NewlyLaunch`}
          isShowAll={false}
          request={{pageNo: 1, pageSize: 10, cityName: AppLocation.City}}
        />
        <ProductSection
          heading={'New In Property'}
          background={'#F7F8FA'}
          endpoint={`Newin`}
          isShowAll={true}
          request={{
            pageNo: 1,
            pageSize: 10,
            cityName: AppLocation.City,
            categoryId: 1,
          }}
        />
        <ProductSection
          heading={'New In Car'}
          background={'#FFFFFF'}
          endpoint={`Newin`}
          isShowAll={true}
          request={{
            pageNo: 1,
            pageSize: 10,
            cityName: AppLocation.City,
            categoryId: 2,
          }}
        />
        {/* Podcast */}
        <View style={styles.container}>
          <HStack space="md" reversed={false} style={styles.heading}>
            <ZText type={'R18'}>Podcast</ZText>
            <ZText type={'R14'} style={styles.headingLink}>
              See All
            </ZText>
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
        <BrandSection
          heading={'Brands Associated'}
          background={'#FFFFFF'}
          endpoint={`Newin`}
          isShowAll={true}
          request={{
            pageNo: 1,
            pageSize: 10,
            cityName: AppLocation.City,
            categoryId: 2,
          }}
        />
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
    margin: 10,
  },
  tabItemTitle: {
    marginTop: 10,
  },
  tabItemContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  container: {
    flexDirection: 'column',
    margin: 10,
  },
  heading: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    marginBottom: 10,
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
