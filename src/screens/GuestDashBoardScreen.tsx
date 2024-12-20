/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
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

import Footer from './Dashboard/Footer';
import BrandSection from './Dashboard/BrandSection';
import ProductSection from './Dashboard/ProductSection';
import MarqueeBanner from '../sharedComponents/profile/MarqueeBanner';
import {fetchDashboardData} from '../../BrokerAppCore/services/new/dashboardService';
import UserStories from '../components/story/UserStories';
import {colors} from '../themes';
import MarqueeScreen from '../sharedComponents/profile/Marquee';
import UserProfile from '../sharedComponents/profile/UserProfile';
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
} from '../../components/ui/alert-dialog';
import {Button} from '../../components/ui/button';
import {Color} from '../styles/GlobalStyles';
import useUserJourneyTracker from '@/hooks/Analytics/useUserJourneyTracker';

export default function GuestDashboardScreen({isGuest = false}) {
  const AppLocation = useSelector((state: RootState) => state.AppLocation);
  //   const user = useSelector((state: RootState) => state.user.user);

  const {data, status, error, execute} = useApiRequest(fetchPodcastList);
  //const {data: footerData, status: footerStatus, error: footerError, execute: footerExecute} = useApiRequest(fetchDashboardFooterCount);
  const cityToShow = 'Noida';
  const navigation = useNavigation();

  const callPodcastList = async () => {
    await execute(user.userId, 1, 4);
    //await footerExecute()
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

  const RenderPodcastItems = React.memo(({item, index}) => {
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
              type="B14"
              style={{
                color: colors.light.white,
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
  });
  const handleGuestOverlayClick = () => {
    Alert.alert('Restricted Access', 'Please log in to access this feature.');
  };
  const [showAlertDialog, setShowAlertDialog] = React.useState(false);
  const handleClose = () => setShowAlertDialog(false);
  const onPressSignUp = () => {
    //  onOpen();
    setShowAlertDialog(false);
    navigation.navigate('Login');
  };
  // console.log(user, 'marqueeText');
  return (
    <SafeAreaView style={{flex: 1}}>
      {isGuest && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0)',
            zIndex: 1,
          }}
          onPress={handleGuestOverlayClick}
          activeOpacity={1} // Prevents other components from receiving touches
        />
      )}
      <ScrollView style={styles.scrollView}>
        <View>
          <View style={styles.subHeaderSection}>
            {/* <UserProfile /> */}
            {/* <View style={{paddingHorizontal:15}}> */}
            {/* <UserStories /> */}
            {/* </View> */}
            {/* {marqueeText?.length > 0 && (
              <MarqueeBanner
                marqueeTextList={marqueeText.map((item: any) => ({
                  marqueeText: item.marqueueText,
                  postId: item.postId,
                  categoryId: item.categoryId,
                }))}
              />
            )} */}
            {marqueeText?.length > 0 && (
              <View style={{marginTop: 20}}>
                <MarqueeScreen marqueeTextList={marqueeText} />
              </View>
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
              <TouchableOpacity onPress={() => setShowAlertDialog(true)}>
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
              <TouchableOpacity onPress={() => setShowAlertDialog(true)}>
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
              <TouchableOpacity onPress={() => setShowAlertDialog(true)}>
                <View style={styles.tabItemContainer}>
                  <TABLoan />
                  <ZText type={'R16'} style={styles.tabItemTitle}>
                    Loan
                  </ZText>
                </View>
              </TouchableOpacity>
            </GridItem>
            <GridItem
              className="bg-background-0 p-4 rounded-md text-center"
              _extra={{className: 'col-span-3'}}>
              <TouchableOpacity onPress={() => setShowAlertDialog(true)}>
                <View style={styles.tabItemContainer}>
                  <TABInsurance />
                  <ZText type={'R16'} style={styles.tabItemTitle}>
                    Insurance
                  </ZText>
                </View>
              </TouchableOpacity>
            </GridItem>
            <GridItem
              className="bg-background-0 p-4 rounded-md text-center"
              _extra={{className: 'col-span-3'}}>
              <TouchableOpacity onPress={() => setShowAlertDialog(true)}>
                <View style={styles.tabItemContainer}>
                  <TABTravel />
                  <ZText type={'R16'} style={styles.tabItemTitle}>
                    Travel
                  </ZText>
                </View>
              </TouchableOpacity>
            </GridItem>
            <GridItem
              className="bg-background-0 p-4 rounded-md text-center"
              _extra={{className: 'col-span-3'}}>
              <TouchableOpacity onPress={() => setShowAlertDialog(true)}>
                <View style={styles.tabItemContainer}>
                  <TABWealth />
                  <ZText type={'R16'} style={styles.tabItemTitle}>
                    Wealth
                  </ZText>
                </View>
              </TouchableOpacity>
            </GridItem>
          </Grid>
          <ProductSection
            heading={'Newly Launch'}
            background={'#FFFFFF'}
            endpoint={`NewlyLaunch`}
            isGuest={true}
            isShowAll={false}
            request={{pageNo: 1, pageSize: 10, cityName: AppLocation.City}}
          />
          <ProductSection
            heading={'New In Property'}
            background={'#F7F8FA'}
            endpoint={`Newin`}
            isGuest={true}
            isShowAll={false}
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
            isGuest={true}
            endpoint={`Newin`}
            isShowAll={false}
            request={{
              pageNo: 1,
              pageSize: 10,
              cityName: AppLocation.City,
              categoryId: 2,
            }}
          />
          {/* Podcast */}
          {/* <View style={styles.container}>
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
                renderItem={({item, index}) => (
                  <RenderPodcastItems item={item} index={index} />
                )}
                initialNumToRender={3}
                showsHorizontalScrollIndicator={false}
                horizontal
                // onEndReachedThreshold={0.8}
                // onEndReached={fetchMoreData}
              />
            </HStack>
          </View> */}
          <BrandSection
            heading={'Brands Associated'}
            background={'#FFFFFF'}
            endpoint={`BrandAssociate`}
            isShowAll={true}
            isGuest={true}
            request={{
              pageNo: 1,
              pageSize: 10,
              cityName: AppLocation.City,
              categoryId: 2,
            }}
          />

          <Footer />
        </View>
        <AlertDialog isOpen={showAlertDialog} onClose={handleClose} size="md">
          <AlertDialogBackdrop />
          <AlertDialogContent>
            <AlertDialogBody className="mt-3 mb-4 ">
              <ZText type="S18" style={{marginBottom: 20, textAlign: 'center'}}>
                Discover endless premium listing with BrokerApp
              </ZText>
              <ZText type="R16" style={{marginBottom: 20, textAlign: 'center'}}>
                your trusted partner for properties and cars.Join us and turn
                your dreams into reality!
              </ZText>
            </AlertDialogBody>
            <AlertDialogFooter
              style={{justifyContent: 'center', alignItems: 'center'}}>
              <Button
                variant="outline"
                action="secondary"
                style={{borderColor: Color.primary}}
                onPress={handleClose}
                size="md">
                <ZText
                  type="R16"
                  color={Color.primary}
                  style={{textAlign: 'center'}}>
                  Cancel
                </ZText>
              </Button>
              <Button
                size="md"
                onPress={onPressSignUp}
                style={{backgroundColor: Color.primary, marginLeft: 10}}>
                <ZText type="R16" style={{color: 'white', textAlign: 'center'}}>
                  Login
                </ZText>
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  subHeaderSection: {
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
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
    margin: 20,
    marginRight: 10,
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
