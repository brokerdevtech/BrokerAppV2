import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  useWindowDimensions,
  Dimensions,
  Animated,
  TextInput,
  ActivityIndicator,
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
import MarqueeScreen from '../sharedComponents/MarqueeScreen';
import RecentSearchSection from './Dashboard/RecentSearchSection';
import {
  GetDashboardData,
  NewDeviceUpdate,
} from '../../BrokerAppCore/services/authService';
import {setDashboard} from '../../BrokerAppCore/redux/store/Dashboard/dashboardSlice';
import store from '../../BrokerAppCore/redux/store';
import {checkPermission} from '../utils/helpers';
import {Toast, ToastDescription, useToast} from '../../components/ui/toast';
import useUserAnalytics from '../hooks/Analytics/useUserAnalytics';
import useUserJourneyTracker from '../hooks/Analytics/useUserJourneyTracker';
import AutoscrollAds from '../sharedComponents/AutoscrollAds';
import EnquiryBottomSheet from '../sharedComponents/EnquiryForm';
import {getDashboardStory} from '../../BrokerAppCore/services/Story';
import ProductSectionData from './Dashboard/ProductSectionData';
import {fetchDashboardData as fetchDashboardDataBrand} from '../../BrokerAppCore/services/new/dashboardService';
import MarqueeTextCollection from '../sharedComponents/MarqueeTextCollection';
import {getfcmToken} from '../utils/utilTokens';
import StoryComponent from '../sharedComponents/StoryComponent';
import {Icon, SearchIcon} from '../../components/ui/icon';
import {Color} from '../styles/GlobalStyles';
import {
  Input,
  InputField,
  InputIcon,
  InputSlot,
} from '../../components/ui/input';
import CustomHeader from '../sharedComponents/CustomHeader';
import {StoryProvider, useStory} from '../story/StoryContext';
import StoriesFlatList from '../story/StoriesFlatList';
import StoriesCarousel from '../story/StoriesCarousel';
import StoryViewer from '../story/StoryViewer';
import { useApiPagingWithtotalRequest } from '../hooks/useApiPagingWithtotalRequest';
import SearchScreen from './Search';

export default function DashboradScreen() {
    const [isInfiniteLoading, setInfiniteLoading] = useState(false);
  const AppLocation = useSelector((state: RootState) => state.AppLocation);
  const user = useSelector((state: RootState) => state.user.user);
  const [searchText, setSearchText] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchBarAnimatedValue = useRef(new Animated.Value(0)).current;
  const {setUser_Analytics} = useUserAnalytics();
  const {logButtonClick} = useUserJourneyTracker('Dashborad');
  const userPermissions = useSelector(
    (state: RootState) => state.user?.user?.userPermissions,
  );
  const headerHeight = 60;
  const searchBarHeight = 50;
  const totalHeaderHeight = headerHeight + searchBarHeight;

  const scrollY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const isScrollingDown = useRef(true);
  const headerVisible = useRef(new Animated.Value(1)).current;
  const bottomSheetRef = useRef(null);
  const [toastId, setToastId] = React.useState(0);

  const permissionGrantedPodacast = true;
  const permissionGrantedDashPost = true;

  const toast = useToast();
  const {width} = useWindowDimensions();
  const {
    data,
    status,
    error,
    execute,
    loadMore,
    pageSize_Set,
    currentPage_Set,
    hasMore_Set,
    totalPages,
    recordCount,
    setData_Set,
  } = useApiPagingWithtotalRequest(fetchPodcastList,setInfiniteLoading, 8);
  const cityToShow = AppLocation.City;
  const navigation = useNavigation();
  const [StoryData, setStoryData]: any[] = useState(null);
  const [NewlyLaunchData, setNewlyLaunchData]: any[] = useState(null);
  const [NewInPropertyData, setNewInPropertyData]: any[] = useState(null);
  const [NewInCarData, setNewInCarData]: any[] = useState(null);
  const [isSearchVisible, setIsSearchVisible] = useState(true);
  const [BrandSectionData, setBrandSectionData]: any[] = useState(null);

  const callPodcastList = async () => {
    execute(user.userId);
  };

  const headerTranslateY = headerVisible.interpolate({
    inputRange: [0, 1],
    outputRange: [-headerHeight, 0],
    extrapolate: 'clamp',
  });

  // Create a new animated value for content translation
  const contentTranslateY = headerVisible.interpolate({
    inputRange: [0, 1],
    outputRange: [-headerHeight, 0],
    extrapolate: 'clamp',
  });

  const {
    data: marqueeText,
    status: marqueeStatus,
    error: marqueeError,
    execute: marqueeExecute,
  } = useApiRequest(fetchDashboardData);

  const animatedScrollEvent = Animated.event(
    [{nativeEvent: {contentOffset: {y: scrollY}}}],
    {useNativeDriver: true},
  );

  const handleScroll = Animated.event(
    [{nativeEvent: {contentOffset: {y: scrollY}}}],
    {
      useNativeDriver: true,
      listener: event => {
        const currentScrollY = event.nativeEvent.contentOffset.y;
        const diff = currentScrollY - lastScrollY.current;

        if (diff > 5 && !isScrollingDown.current) {
          isScrollingDown.current = true;
          Animated.timing(headerVisible, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
        } else if (diff < -5 && isScrollingDown.current) {
          isScrollingDown.current = false;
          Animated.timing(headerVisible, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }

        lastScrollY.current = currentScrollY;
      },
    },
  );
  // Then modify your ScrollView implementation to use animatedMarginTop
  const animatedMarginTop = headerVisible.interpolate({
    inputRange: [0, 1],
    outputRange: [0, totalHeaderHeight],
    extrapolate: 'clamp',
  });

  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  useEffect(() => {
    const userS = {
      id: String(user.userId),
      firstName: String(user.firstName),
      lastName: String(user.lastName),
    };
    setUser_Analytics(userS);
  }, []);

  const updateDevice = async (userId: any) => {
    const fcmToken: any = await getfcmToken();
    const updateDevice = await NewDeviceUpdate(userId, fcmToken.toString());
  };

  const {fetchStories} = useStory();

  useFocusEffect(
    useCallback(() => {
      fetchStories(); // reloads stories when screen comes into focus
    }, []),
  );

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const request = {pageNo: 1, pageSize: 10, cityName: AppLocation.City};

          const results = await Promise.allSettled([
            GetDashboardData(user.userId),
            execute(user.userId),
            getDashboardStory(user.userId, 1, 5),
            fetchDashboardData('NewlyLaunch', request),
            fetchDashboardData('Newin', {
              pageNo: 1,
              pageSize: 10,
              cityName: AppLocation.City,
              categoryId: 1,
            }),
            fetchDashboardData('Newin', {
              pageNo: 1,
              pageSize: 10,
              cityName: AppLocation.City,
              categoryId: 2,
            }),
            fetchDashboardDataBrand('BrandAssociate', {
              userId: user.userId,
            }),
            updateDevice(user.userId),
          ]);

          const [
            dashboardData,
            podcastList,
            DashboardStory,
            NewlyLaunch,
            NewInProperty,
            NewInCar,
            BrandAssociate,
          ] = results.map(result =>
            result.status === 'fulfilled' ? result.value : null,
          );
          //           console.log("DashboardStory?.data");
          // console.log(JSON.stringify(DashboardStory?.data));
          setStoryData(DashboardStory?.data);
          setNewlyLaunchData(NewlyLaunch?.data);
          setNewInPropertyData(NewInProperty?.data);
          setNewInCarData(NewInCar?.data);
          setBrandSectionData(BrandAssociate?.data);

          if (dashboardData?.data) {
            store.dispatch(setDashboard(dashboardData.data));
          }
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
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
                {'You do not have permission. Contact dev@brokerapp.com.'}
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
  //  const { isStoryViewerVisible } = useStory();

  const loadMorePodcast = async () => {
    if (!isInfiniteLoading) {
      await loadMore(user.userId);
    }
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      {/* Header */}
      {/* <Animated.View
        style={[
          styles.headerContainer,
          {
            height: totalHeaderHeight,
            transform: [{translateY: headerTranslateY}],
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            zIndex: 10,
            marginTop: 10,
          },
        ]}> */}
      {/* Header */}
      {/* <View style={{height: headerHeight}}>
          <CustomHeader />
        </View> */}

      {/* Search Bar */}
      {/* <View style={styles.searchBarContainer}>
          <Input style={styles.input}>
            <InputSlot style={{paddingLeft: 10}}>
              <InputIcon
                as={SearchIcon}
                className="text-darkBlue-500"
                stroke={Color.primary}
              />
            </InputSlot>
            <InputField
              type={'text'}
              placeholder="Search properties, cars..."
              value={searchText}
              onChangeText={handleSearch}
            />
          </Input>
        </View>
      </Animated.View> */}

      <ScrollView style={{flex: 1}}>
        <View>
          <View style={styles.subHeaderSection}>
            <View style={{flex: 1}}>
              <SearchScreen />
              <StoriesFlatList />
              {/* {<StoryViewer />} */}
            </View>

            {/* 
            {StoryData != null && StoryData != undefined && (
              <UserStories Data={StoryData} />
            )} */}

            {StoryData != null && StoryData != undefined && (
              <MarqueeTextCollection></MarqueeTextCollection>
            )}
          </View>

          <AutoscrollAds
            onPressBottomSheet={() => bottomSheetRef.current?.expand()}
          />

          <Grid className="gap-4 p-2" style={{marginBottom : 15}} _extra={{className: 'grid-cols-9'}}>
            {/* Property */}
            <GridItem
              style={styles.gridContainer}
              className="bg-background-0 p-2 rounded-md text-center"
              _extra={{className: 'col-span-3'}}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('ItemListScreen', {
                    listType: 'RealEstate',
                    categoryId: 1,
                  });
                }}>
                <View style={styles.tabItemContainer}>
                  <TABHome />
                  <ZText type="S16" style={styles.tabItemTitle}>
                    Property
                  </ZText>
                </View>
              </TouchableOpacity>
            </GridItem>

            {/* Car */}
            <GridItem
              style={styles.gridContainer}
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
                  <ZText type="S16" style={styles.tabItemTitle}>
                    Car
                  </ZText>
                </View>
              </TouchableOpacity>
            </GridItem>

            {/* Other grid items... */}
            <GridItem
              style={styles.gridContainer}
              className="bg-background-0 p-2 rounded-md text-center"
              _extra={{className: 'col-span-3'}}>
              <TouchableOpacity onPress={showToastComingSoon}>
                <View style={styles.tabItemContainer}>
                  <TABLoan />
                  <ZText type="S16" style={styles.tabItemTitle}>
                    Loan
                  </ZText>
                </View>
              </TouchableOpacity>
            </GridItem>

            <GridItem
              style={styles.gridContainer}
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
              style={styles.gridContainer}
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
              style={styles.gridContainer}
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

          {/* Content sections */}
          <ProductSectionData
            heading={'Newly Launch'}
            background={'#FFFFFF'}
            endpoint={`NewlyLaunch`}
            isShowAll={false}
            request={request}
            Data={NewlyLaunchData}
          />
          <RecentSearchSection
            heading={'Recent Search'}
            background={'#F7F8FA'}
            endpoint={`RecentSearch`}
            isShowAll={true}
            request={{
              userId: user?.userId,
            }}
          />
          <ProductSectionData
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
            Data={NewInPropertyData}
          />
          <ProductSectionData
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
            Data={NewInCarData}
          />

          {/* Podcast */}
          <View style={styles.container}>
            <HStack space="md" reversed={false} style={styles.heading}>
              <ZText type={'R18'}>Podcast</ZText>
            </HStack>
            <HStack space="md" reversed={false} style={styles.list}>
              <FlatList
                data={data}
                keyExtractor={item => item.podcastId.toString()}
                renderItem={({item, index}) => (
                  <RenderPodcastItems item={item} index={index} />
                )}
                // initialNumToRender={4}
                // maxToRenderPerBatch={5}
                // onEndReachedThreshold={0.5}
                onEndReached={loadMorePodcast}
                showsHorizontalScrollIndicator={false}
                horizontal
                ListFooterComponent={
                                isInfiniteLoading ? (
                                  <ActivityIndicator
                                    size="large"
                                    color="#0000ff"
                                  style={styles.loader}
                                  />
                                ) : null
                              }
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
              userId: user?.userId,
            }}
          />
          <Footer />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loader: {
    marginVertical: 20,
  },
  badge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#ff0000',
    borderRadius: 12,
  },
  subHeaderSection: {
    backgroundColor: '#fff',
  },
  scrollView: {
    backgroundColor: '#F7F8FA',
  },
  tabContainer: {
    backgroundColor: '#F7F8FA',
    margin: 10,
  },
  gridContainer: {
    flex: 1,
    minWidth: Dimensions.get('screen').width / 3 - 16,
    maxWidth: Dimensions.get('screen').width / 3 - 16,
    elevation: 2,
    shadowOpacity: 0.6,
    shadowOffset: {height: 0, width: 0},
  },
  tabItemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabItemTitle: {
    marginTop: 8,
    textAlign: 'center',
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
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 15,
    width: '95%',
    marginHorizontal: '2.5%',
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    height: 43,
    elevation: 2,
  },
  headerContainer: {
    // height: 80,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    justifyContent: 'center',
  },
  fixedSearchContainer: {
    height: 70,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  stickySearchContainer: {
    height: 50,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  searchBarContainer: {
    height: 60,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginTop: 10,
  },
});
