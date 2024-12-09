/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useMemo, useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {useSelector} from 'react-redux';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {RootState} from '@reduxjs/toolkit/query';
import {HStack} from '@/components/ui/hstack';
import {Grid, GridItem} from '@/components/ui/grid';
import FastImage from '@d11/react-native-fast-image';
import {imagesBucketcloudfrontPath, PermissionKey} from '../config/constants';
import ZText from '../sharedComponents/ZText';
import {useApiRequest} from '@/src/hooks/useApiRequest';
import {fetchPodcastList} from '@/BrokerAppCore/services/new/podcastService';
import LottieView from 'lottie-react-native';
import TABCard from '../assets/svg/Tabicon/tab_card.svg';
import TABInsurance from '../assets/svg/Tabicon/tab_insurance.svg';
import TABLoan from '../assets/svg/Tabicon/tab_loan.svg';
import TABTravel from '../assets/svg/Tabicon/tab_travel.svg';
import TABWealth from '../assets/svg/Tabicon/tab_wealth.svg';
import TABHome from '../assets/svg/Tabicon/tab_home.svg';
import Footer from './Dashboard/Footer';
import BrandSection from './Dashboard/BrandSection';
import ProductSection from './Dashboard/ProductSection';
import MarqueeBanner from '../sharedComponents/profile/MarqueeBanner';
import {fetchDashboardData} from '../../BrokerAppCore/services/new/dashboardService';
import UserStories from '../components/story/UserStories';
import {colors} from '../themes';
import MarqueeScreen from '../sharedComponents/profile/Marquee';
import RecentSearchSection from './Dashboard/RecentSearchSection';
import {GetDashboardData} from '../../BrokerAppCore/services/authService';
import {setDashboard} from '../../BrokerAppCore/redux/store/Dashboard/dashboardSlice';
import store from '../../BrokerAppCore/redux/store';
import {checkPermission} from '../utils/helpers';
import {Toast, ToastDescription, useToast} from '../../components/ui/toast';
import useUserAnalytics from '../hooks/Analytics/useUserAnalytics';
import useUserJourneyTracker from '../hooks/Analytics/useUserJourneyTracker';
import AutoscrollAds from '../sharedComponents/AutoscrollAds';
import EnquiryBottomSheet from '../sharedComponents/EnquiryForm';

export default function DashboradScreen() {
  const AppLocation = useSelector((state: RootState) => state.AppLocation);
  const user = useSelector((state: RootState) => state.user.user);
  const {setUser_Analytics} = useUserAnalytics();
  const {logButtonClick} = useUserJourneyTracker('Dashborad');
  const userPermissions = useSelector(
    (state: RootState) => state.user.user.userPermissions,
  );
  const bottomSheetRef = useRef(null);
  const [toastId, setToastId] = React.useState(0);
  // const permissionGrantedPodacast = checkPermission(
  //   userPermissions,
  //   PermissionKey.AllowViewPodcast,
  // );
  // const permissionGrantedDashPost = checkPermission(
  //   userPermissions,
  //   PermissionKey.AllowViewDashboardPost,
  // );

  const permissionGrantedPodacast = true;
  const permissionGrantedDashPost = true;

  const toast = useToast();

  const {data, status, error, execute} = useApiRequest(fetchPodcastList);
  //const {data: footerData, status: footerStatus, error: footerError, execute: footerExecute} = useApiRequest(fetchDashboardFooterCount);
  const cityToShow = AppLocation.City;
  const navigation = useNavigation();

  const callPodcastList = async () => {
    execute(user.userId, 1, 4);
    //await footerExecute()
  };
  const callmarList = async () => {
    const request = {pageNo: 1, pageSize: 10, cityName: cityToShow};
    marqueeExecute('Marqueue', request);
  };
  const {
    data: marqueeText,
    status: marqueeStatus,
    error: marqueeError,
    execute: marqueeExecute,
  } = useApiRequest(fetchDashboardData);
  useEffect(() => {
    // console.log(user);
    const userS = {
      id: String(user.userId),
      firstName: String(user.firstName),
      lastName: String(user.lastName),
    };
    // console.log(userS);
    setUser_Analytics(userS);
  }, []);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     // Call the functions when the screen comes into focus
  //     callPodcastList();
  //     callmarList();

  //     // Optional cleanup logic
  //     return () => {
  //       // Add any cleanup code if necessary
  //     };
  //   }, [AppLocation]) // Add dependencies here
  // );
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          // callmarList();
          GetDashboardData(user.userId)
            .then(data => {
              store.dispatch(setDashboard(data.data));
            })
            .catch(error => {});
          callPodcastList();
        } catch (error) {
          //   console.error('Error fetching posts:', error);
        }
      };
      fetchData();

      return () => {};
    }, [AppLocation]),
  );
  const showToast = () => {
    if (!toast.isActive(toastId)) {
      const newId = Math.random();
      setToastId(newId);
      toast.show({
        id: newId,
        placement: 'bottom',
        duration: 3000,
        render: ({id}) => {
          const uniqueToastId = 'toast-' + id;
          return (
            <Toast nativeID={uniqueToastId} action="muted" variant="solid">
              <ToastDescription>
                {'You do not have permission.Contact dev@brokerapp.com.'}
              </ToastDescription>
            </Toast>
          );
        },
      });
    }
  };
  const showToastComingSoon = () => {
    if (!toast.isActive(toastId)) {
      const newId = Math.random();
      setToastId(newId);
      toast.show({
        id: newId,
        placement: 'top',
        duration: 3000,
        render: ({id}) => {
          const uniqueToastId = 'toast-' + id;
          return (
            <Toast nativeID={uniqueToastId} action="muted" variant="solid">
              <ToastDescription>
                {'This category will be available soon'}
              </ToastDescription>
            </Toast>
          );
        },
      });
    }
  };
  const handleThumbnailTap = async (item, index) => {
    permissionGrantedPodacast
      ? navigation.navigate('VideoReels', {
          podcastitem: item,
          podcastId: item.podcastId,
          podcastData: data,
          podcastIndex: index,
          podcastPage: 1,
        })
      : showToast();
  };
  const request = useMemo(
    () => ({pageNo: 1, pageSize: 10, cityName: AppLocation.City}),
    [AppLocation.City],
  );
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

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView style={styles.scrollView}>
        <View>
          <View style={styles.subHeaderSection}>
            {/* <UserProfile /> */}
            {/* <View style={{paddingHorizontal:15}}> */}
            <UserStories />
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
            {/* {marqueeText?.length > 0 && (
              <MarqueeScreen marqueeTextList={marqueeText} />
            )} */}
          </View>
          <AutoscrollAds
            onPressBottomSheet={() => bottomSheetRef.current?.expand()}
          />
          <Grid className="gap-2 p-4" _extra={{className: 'grid-cols-9'}}>
            {/* <GridItem
              className="bg-background-50 p-2 rounded-md text-center"
              _extra={{className: 'col-span-9'}}>
              <ZText type={'R18'}>Find what you are looking for</ZText>
            </GridItem> */}
            <GridItem
              style={styles.gridcontainer}
              className="bg-background-0 p-2 rounded-md text-center"
              _extra={{className: 'col-span-3'}}>
              {/* <TouchableOpacity
                onPress={() => {
                  permissionGrantedDashPost
                    ? navigation.navigate('ItemListScreen', {
                        listType: 'RealEstate',
                        categoryId: 1,
                      })
                    : showToast();
                }}> */}
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('ItemListScreen', {
                    listType: 'RealEstate',
                    categoryId: 1,
                  });
                }}>
                <View style={styles.tabItemContainer}>
                  <TABHome />
                  <ZText type={'S16'} style={styles.tabItemTitle}>
                    Property
                  </ZText>
                </View>
              </TouchableOpacity>
            </GridItem>
            <GridItem
              style={styles.gridcontainer}
              className="bg-background-0 p-2 rounded-md text-center"
              _extra={{className: 'col-span-3'}}>
              <TouchableOpacity
                onPress={() => {
                  permissionGrantedDashPost
                    ? navigation.navigate('ItemListScreen', {
                        listType: 'Car',
                        categoryId: 2,
                      })
                    : showToast();
                }}>
                <View style={styles.tabItemContainer}>
                  <TABCard />
                  <ZText type={'S16'} style={styles.tabItemTitle}>
                    Car
                  </ZText>
                </View>
              </TouchableOpacity>
            </GridItem>
            <GridItem
              style={styles.gridcontainer}
              className="bg-background-0 p-2 rounded-md text-center"
              _extra={{className: 'col-span-3'}}>
              <TouchableOpacity onPress={showToastComingSoon}>
                <View style={styles.tabItemContainer}>
                  <TABLoan />

                  <ZText type={'S16'} style={styles.tabItemTitle}>
                    Loan
                  </ZText>
                </View>
              </TouchableOpacity>
            </GridItem>
            <GridItem
              style={styles.gridcontainer}
              className="bg-background-0 p-2 rounded-md text-center"
              _extra={{className: 'col-span-3'}}>
              <TouchableOpacity onPress={showToastComingSoon}>
                <View style={styles.tabItemContainer}>
                  <TABInsurance />
                  <ZText type={'S16'} style={styles.tabItemTitle}>
                    Insurance
                  </ZText>
                </View>
              </TouchableOpacity>
            </GridItem>
            <GridItem
              style={styles.gridcontainer}
              className="bg-background-0 p-2 rounded-md text-center"
              _extra={{className: 'col-span-3'}}>
              <TouchableOpacity onPress={showToastComingSoon}>
                <View style={styles.tabItemContainer}>
                  <TABTravel />
                  <ZText type={'S16'} style={styles.tabItemTitle}>
                    Travel
                  </ZText>
                </View>
              </TouchableOpacity>
            </GridItem>
            <GridItem
              style={styles.gridcontainer}
              className="bg-background-0 p-2 rounded-md text-center"
              _extra={{className: 'col-span-3'}}>
              <TouchableOpacity onPress={showToastComingSoon}>
                <View style={styles.tabItemContainer}>
                  <TABWealth />
                  <ZText type={'S16'} style={styles.tabItemTitle}>
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
            isShowAll={false}
            request={request}
          />
          <RecentSearchSection
            heading={'Recent Search'}
            background={'#F7F8FA'}
            endpoint={`RecentSearch`}
            isShowAll={true}
            request={{
              userId: user.userId,
            }}
          />
          <ProductSection
            heading={'New In Property'}
            background={'#FFFFFF'}
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
            background={'#F7F8FA'}
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
              {/* <ZText type={'R14'} style={styles.headingLink}>
                See All
              </ZText> */}
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
          </View>

          <BrandSection
            heading={'Brands Associated'}
            background={'#FFFFFF'}
            endpoint={`BrandAssociate`}
            isShowAll={true}
            isGuest={false}
            request={{
              userId: user.userId,
            }}
          />
          <Footer />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#ff0000',
    borderRadius: 12,
  },
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
    marginTop: 5,
  },
  gridcontainer: {
    shadowOffset: {width: 0, height: 10}, // shadow offset
    shadowOpacity: 1, // shadow opacity
    // shadowRadius: 64, // blur radius (64px)
    elevation: 2,
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
    //backgroundColor:'#FFFFFF'
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
