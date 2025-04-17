/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-trailing-spaces */
/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@reduxjs/toolkit/query';
import CustomHeader from '../sharedComponents/CustomHeader';
import ZText from '../sharedComponents/ZText';

import {HStack} from '@/components/ui/hstack';

import {
  Card_check_icon,
  Location_Icon,
  Chat_Icon,
  Telephone_Icon,
  description_icon,
  MenuThreeDots,
} from '../assets/svg';

import {
  fetchDashboardData,
  fetchItemList,
  RecentSearchSData,
} from '../../BrokerAppCore/services/new/dashboardService';
import {Icon} from '../../components/ui/icon';

import {VStack} from '@/components/ui/vstack';
import MediaGallery from '../sharedComponents/MediaGallery';
import {useApiPagingWithtotalRequest} from '../../src/hooks/useApiPagingWithtotalRequest';
import AppBaseContainer from '../../src/hoc/AppBaseContainer_old';

import {Box} from '../../components/ui/box';
import FilterChips from '../sharedComponents/FilterChips';

import PostActions from '../sharedComponents/PostActions';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import UserStories from '../components/story/UserStories';
import Recommend from '../sharedComponents/RecomendedBrokers';

import {FlashList} from '@shopify/flash-list';

import {colors} from '../themes';

import ZHeaderFliter from '../sharedComponents/ZHeaderFliter';
//import FilterBottomSheet from '../sharedComponents/FilterBottomSheet';

import ListingCardSkeleton from '../sharedComponents/Skeleton/ListingCardSkeleton';

import {formatNumberToIndianSystem} from '../utils/helpers';

import NoDataFoundScreen from '../sharedComponents/NoDataFoundScreen';
import useUserJourneyTracker from '../hooks/Analytics/useUserJourneyTracker';
import {getDashboardStory} from '../../BrokerAppCore/services/Story';
import ProductSectionData from './Dashboard/ProductSectionData';
import RecentSearchSectionData from './Dashboard/RecentSearchSectionData';
import {
  getRecommendedBrokerList,
  getSuggestionBrokerList,
} from '../../BrokerAppCore/services/new/recomendedBroker';
import ZAvatarInitials from '../sharedComponents/ZAvatarInitials';
import ItemHeader from './ItemHeader';
import ReportScreen from '../sharedComponents/ReportScreen';
import SuggestedUsers from '../sharedComponents/SuggestedUsers';
import StoriesFlatList from '../story/StoriesFlatList';
import { resetPreviousRoute, setPreviousRoute } from '../../BrokerAppCore/redux/store/navigation/navigationSlice';

//const MediaGallery = React.lazy(() => import('../sharedComponents/MediaGallery'));
//const UserStories = React.lazy(() => import('../components/story/UserStories'));
//const ProductSectionData = React.lazy(() => import('./Dashboard/ProductSectionData'));
//const Recommend = React.lazy(() => import('../sharedComponents/RecomendedBrokers'));
//const RecentSearchSectionData = React.lazy(() => import('./Dashboard/RecentSearchSectionData'));
const FilterBottomSheet = React.lazy(
  () => import('../sharedComponents/FilterBottomSheet'),
);

const SkeletonPlaceholder = () => {
  return (
    <HStack space={10} style={styles.skeletonContainer}>
      {Array.from({length: 6}).map((_, index) => (
        <ListingCardSkeleton key={index} size={60} />
      ))}
    </HStack>
  );
};
const RederListHeader = React.memo(
  ({
    categoryId,
    AppLocation,
    FilterChipsData,
    recordCount,
    user,
    StoryData,
    NewIncategoryData,
    RecentSearchData,
    RenderBrokerData,
    SuggestionData,
  }) => {
    return (
      <>
        {/* {StoryData != null && <UserStories Data={StoryData} />} */}
        <View style={{flex: 1}}>
          <StoriesFlatList />
          {/* {<StoryViewer />} */}
        </View>
        <Recommend categoryId={categoryId} Data={RenderBrokerData} />
        <SuggestedUsers categoryId={categoryId} Data={SuggestionData} />
        <ProductSectionData
          heading={'Newly Launch'}
          background={'#FFFFFF'}
          endpoint={'Newin'}
          isShowAll={false}
          request={{
            pageNo: 1,
            pageSize: 10,
            cityName: AppLocation.City,
            categoryId: categoryId,
          }}
          Data={NewIncategoryData}
        />

        <RecentSearchSectionData
          heading={'Recent Search'}
          background={'#F7F8FA'}
          endpoint={`/RecentSearch/Categorywise`}
          isShowAll={false}
          request={{
            userId: user.userId,
            categoryId: categoryId,
          }}
          Data={RecentSearchData}
        />

        {/* <FilterChips filters={FilterChipsData} recordsCount={recordCount}></FilterChips> */}
      </>
    );
  },
);
// const ListHeader = React.memo(({ FilterChipsData, recordsCount }) => (
//   <>
//     <View>
//       <UserStories />
//     </View>
//     <Recommend  />
//     <FilterChips filters={FilterChipsData} recordsCount={recordsCount} />
//   </>
// ));

const ProductItem = React.memo(
  ({item, listTypeData, User, menuPress, navigation, OnGoBack}) => {
    const [isrefresh, setisrefresh] = useState(0);
    const MediaGalleryRef = useRef(null);
    //  console.log(item);

    const ProductItemOnGoBack = item => {
      //  console.log('ProductItemOnGoBack');
      if (item.Action != 'Delete') {
        setisrefresh(isrefresh + 1);
      }
      OnGoBack(item);
    };

    const openWhatsApp = useCallback((phoneNumber, message) => {
      const url = `whatsapp://send?text=${encodeURIComponent(
        message,
      )}&phone=${phoneNumber}`;

      Linking.canOpenURL(url)
        .then(supported => {
          if (supported) {
            Linking.openURL(url);
          } else {
            Alert.alert('Error', 'WhatsApp is not installed on this device');
          }
        })
        .catch(err => console.error('Error opening WhatsApp', err));
    }, []);
    const chatProfilePress = useCallback(async () => {
      const members = [User.userId.toString(), item.userId.toString()];

      navigation.navigate('AppChat', {
        defaultScreen: 'ChannelScreen',
        defaultParams: members,
        //  defaultchannelSubject: `Hi,i want to connect on ${item.title}`,
      });
    }, []);
    const makeCall = useCallback(async phoneNumber => {
      // console.log(phoneNumber, 'phone');
      const url = `tel:${phoneNumber}`;

      const checkPermissionAndOpen = async () => {
        const hasPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.CALL_PHONE,
        );
        if (hasPermission) {
          Linking.openURL(url);
        } else {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CALL_PHONE,
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            Linking.openURL(url);
          } else {
            Alert.alert(
              'Permission Denied',
              'You need to enable call permissions to use this feature',
            );
          }
        }
      };

      if (Platform.OS === 'android') {
        await checkPermissionAndOpen();
      } else {
        Linking.canOpenURL(url)
          .then(supported => {
            if (supported) {
              Linking.openURL(url);
            } else {
              Alert.alert(
                'Oops! ',
                'No contact info available for this post. Try reaching out through other channels!',
              );
            }
          })
          .catch(err => console.error('Error opening dialer', err));
      }
    }, []);
    console.log(item?.postMedias, 'itemlist');
    return (
      <View style={styles.WrapcardContainer}>
        <View style={styles.cardContainer}>
          <ItemHeader item={item}></ItemHeader>
          <MediaGallery
            ref={MediaGalleryRef}
            mediaItems={item?.postMedias}
            paused={false}
          />

          {/* <Image
        source={{
          uri: `${imagesBucketcloudfrontPath}${item.postMedias[0].mediaBlobId}`,
        }}
        style={styles.carImage}
      /> */}

          {/* Check and Heart Icons */}

          <View style={styles.iconContainer}>
            <TouchableOpacity onPress={menuPress} style={styles.checkIcon}>
              <MenuThreeDots height={20} width={20} />
            </TouchableOpacity>
          </View>

          <View style={{marginLeft: 20}}>
            <PostActions
              item={item}
              User={User}
              listTypeData={listTypeData}
              isrefresh={isrefresh}
              onUpdateLikeCount={newCount => {
                // console.log(newCount);
              }}
            />
          </View>
          {/* Car Details */}
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ItemDetailScreen', {
                onGoBack: ProductItemOnGoBack,
                postId: item.postId,
                postType: item.hasOwnProperty('fuelType') ? 'Car/Post' : 'Post',
              })
            }>
            <VStack space="xs" style={styles.detailsContainer}>
              <HStack>
                <Box style={{marginLeft: 4}}>
                  <ZText type={'M16'} style={{color: colors.light.appred}}>
                    {'\u20B9'}{' '}
                  </ZText>
                </Box>
                <Box>
                  <ZText type={'M16'} style={{color: colors.light.appred}}>
                    {formatNumberToIndianSystem(item.price)}
                  </ZText>
                </Box>
              </HStack>

              {item.location?.cityName && (
                <HStack>
                  <Box>
                    <Icon as={Location_Icon} size="xl" />
                  </Box>
                  <Box style={{width: '100%', flex: 1}}>
                    <ZText
                      type={'R16'}
                      numberOfLines={1} // Limits to 2 lines
                      ellipsizeMode="tail">
                      {' '}
                      {item.location.placeName}
                    </ZText>
                  </Box>
                </HStack>
              )}

              <HStack style={{width: '100%', flex: 1}}>
                <Box>
                  <Icon as={description_icon} fill="black" size="xl" />
                </Box>
                <Box style={{width: '100%', flex: 1}}>
                  <ZText
                    type={'R16'}
                    numberOfLines={1} // Limits to 2 lines
                    ellipsizeMode="tail">
                    {' '}
                    {item.title}
                  </ZText>
                </Box>
              </HStack>
            </VStack>
          </TouchableOpacity>
          {/* <Divider  className="my-0.5" /> */}

          <View style={styles.detailsContainerBottom}>
            <HStack
            // space="md"
            >
              <HStack
                style={{
                  alignItems: 'center',
                  width: '50%',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  style={styles.callbtn}
                  onPress={() => makeCall(item.contactNo)}>
                  <View style={{alignItems: 'center'}}>
                    <Icon
                      as={Telephone_Icon}
                      color={colors.light.appred}
                      size={'xxl'}
                    />
                  </View>
                  <View style={{alignItems: 'center', paddingVertical: 10}}>
                    <ZText type={'M14'}>Call</ZText>
                  </View>
                </TouchableOpacity>
              </HStack>
              <HStack
                style={{
                  alignItems: 'center',
                  width: '50%',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  style={styles.Chatbtn}
                  onPress={() => chatProfilePress()}>
                  <View style={{alignItems: 'center', marginRight: 10}}>
                    <Icon as={Chat_Icon} color={'#0F5DC4'} size={'xxl'} />
                  </View>
                  <View style={{alignItems: 'center', paddingVertical: 10}}>
                    <ZText type={'M14'}>Chat</ZText>
                  </View>
                </TouchableOpacity>
              </HStack>
            </HStack>
          </View>
        </View>
      </View>
    );
  },

  (prevProps, nextProps) => {
    // Perform shallow comparison on key props
    return (
      prevProps.item === nextProps.item &&
      prevProps.listTypeData === nextProps.listTypeData &&
      prevProps.User === nextProps.User &&
      prevProps.updateItem === nextProps.updateItem
    );
  },
);

const ItemListScreen: React.FC<any> = ({
  isPageSkeleton,
  toggleSkeletonoff,
  toggleSkeletonOn,
  setLoading,
  navigation,
  user,
  toastMessage,
  color,
  route,
  pageTitle,
  isLoading,
  listType,
}) => {
  const [isInfiniteLoading, setInfiniteLoading] = useState(false);
  const [FilterChipsData, setFilterChipsData] = useState([]);
  const [listTypeData, setlistTypeData] = useState(route.params.listType);
  const [brandfilters, setbrandfilters] = useState(route.params.brandfilters);
  const [isrest, setisrest] = useState(false);
  const [listApiobj, setlistApiobj] = useState({});
  const [ApppageTitle, setApppageTitle] = useState('');
  const [searchKeyword, setsearchKeyword] = useState('');
  const [Itemslocalities, setItemslocalities] = useState(null);
  const [PopUPFilter, setPopUPFilter] = useState(null);
  const [categoryId, setCategoryId] = useState(route.params.categoryId);
  const [StoryData, setStoryData]: any[] = useState(null);
  const [NewIncategoryData, setNewIncategoryData]: any[] = useState(null);
  const [RecentSearchData, setRecentSearchData]: any[] = useState(null);
  const [RenderBrokerData, setRenderBrokerData]: any[] = useState(null);
  const [suggestionData, setSuggestionData]: any[] = useState(null);
  const dispatch = useDispatch();
  const brandName =
    route.params.brandName !== undefined ? route.params.brandName : '';
  const AppLocation = useSelector((state: RootState) => state.AppLocation);
  const {logButtonClick} = useUserJourneyTracker(
    `${route.params.listType} Page`,
  );
  const [selectedItem, setSelectedItem] = useState(null);
  const reportSheetRef = useRef(null);

  const handlePresentModalPress = useCallback(item => {
    setSelectedItem(item);
    reportSheetRef.current?.open();
  }, []);

  const closeModalReport = useCallback(() => {
    setSelectedItem(null);
  }, []);
  // console.log('=============user=============');
  // console.log(user);
  const FilterSheetRef = useRef(null);
  const closeModal = useCallback(
    item => {
      if (Object.keys(item).length > 0) {
        // setPopUPFilter(item);
        // setLoading(true);
        // pageSize_Set(5);
        // currentPage_Set(1);
        // hasMore_Set(true);
        let tags = getFilterTags(item);
        tags.frontendFilters = JSON.stringify(item);
        // callPodcastList(tags);

        navigation.navigate('ItemFilterListScreen', {
          listType: listTypeData,
          categoryId: categoryId,
          Filters: item,
          listApiobj: tags,
        });
      }
    },
    [searchKeyword],
  );

  const flatListRef = useRef(null);
  const OnGoBack = updatedItem => {
    //  console.log(data);
    //  let newd=  data.map((item) =>
    //     item.postId === updatedItem?.postId ? updatedItem : item
    //   )

    //   data=[...newd]
    //   console.log(data);
    //   // setData(newd);
    if (updatedItem.Action == 'Delete') {
      flatListRef.current?.scrollToOffset({animated: true, offset: 0});
      setisrest(!isrest);
    }
  };

  const getTags = (name, Item) => {
    return {
      name: name,
      values: Item.map(item => {
        return {
          key: String(item.key),
          value: item.value,
        };
      }),
    };
  };

  const getFilterTags = input => {
    // Initialize an array to hold the transformed results
    const transformedArray = [];

    // Loop over each key in the input object
    for (const key in input) {
      if (input.hasOwnProperty(key)) {
        let values;

        // Use a switch-case to handle different keys
        switch (key) {
          case 'Location':
            break;

          case 'Budget':
            break;
          case 'Area':
            break;
          case 'RegistrationYear':
            break;
          case 'ManufactureYear':
            break;
          case 'KmsDriven':
            break;
          // Add more cases as needed
          default:
            // Default case if key doesn't match any predefined cases

            values = getTags(key, input[key]);
            break;
        }
        if (values) {
          transformedArray.push(values);
        }
      }
    }

    let obj: any = {
      keyWord: searchKeyword,
      cityName: AppLocation.City,
      userId: user.userId,
      placeID: AppLocation.placeID,
      placeName: AppLocation.placeName,
      geoLocationLatitude: AppLocation.geoLocationLatitude,
      geoLocationLongitude: AppLocation.geoLocationLongitude,
      isSearch: false,
      filters: {tags: transformedArray},
    };

    if (input.hasOwnProperty('Location')) {
      obj.cityName = input.Location[0].place.City;
      obj.placeID = input.Location[0].place.placeID;
      obj.placeName = input.Location[0].place.placeName;
      obj.geoLocationLatitude = input.Location[0].place.geoLocationLongitude;
      obj.geoLocationLongitude = input.Location[0].place.geoLocationLongitude;
    }
    if (input.hasOwnProperty('Budget') && input.Budget.isDefault == false) {
      obj.minPrice = input.Budget.minValue;
      obj.maxPrice = input.Budget.maxValue;
    }
    if (input.hasOwnProperty('Area') && input.Area.isDefault == false) {
      obj.propertySizeMin = input.Area.minValue;
      obj.propertySizeMax = input.Area.maxValue;
    }

    if (input.hasOwnProperty('ManufactureYear')) {
      // console.log(input.RegistrationYear);
      // console.log("RegistrationYear");
      obj.makeYear = String(input.ManufactureYear[0].value);
      // obj.propertySizeMax = input.Area.maxValue;
    }
    if (input.hasOwnProperty('KmsDriven')) {
      // console.log(input.RegistrationYear);
      // console.log("RegistrationYear");
      obj.kilometerDriven = String(input.KmsDriven[0].key);
      // obj.propertySizeMax = input.Area.maxValue;
    }
    // console.log('sssssssss');
    // console.log(obj);

    setlistApiobj(obj);

    return obj;
  };

  const userPermissions = useSelector(
    (state: RootState) => state.user.user.userPermissions,
  );
  let {
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
  } = useApiPagingWithtotalRequest(fetchItemList, setInfiniteLoading, 5);
  //const {data, status, error, execute} = useApiPagingRequest5(fetchItemList);
  const renderItem = useCallback(
    ({item}) => (
      <ProductItem
        item={item}
        listTypeData={listTypeData}
        User={user}
        menuPress={handlePresentModalPress}
        navigation={navigation}
        OnGoBack={OnGoBack}
      />
    ),
    [data],
  );
  async function set_FilterChipsData(obj) {
    let FilterChipsData = [];
    // console.log('set_FilterChipsData', obj);
    if (obj.keyWord !== '') {
      FilterChipsData.push({label: 'Search:' + obj.keyWord});
    }
    if (obj.cityName !== '') {
      FilterChipsData.push({label: 'Location:' + obj.cityName});
    }
    if (obj.minPrice != undefined && obj.minPrice !== '') {
      FilterChipsData.push({label: 'Min:' + obj.minPrice});
    }
    if (obj.maxPrice != undefined && obj.maxPrice !== '') {
      FilterChipsData.push({label: 'Max:' + obj.maxPrice});
    }
    // console.log(obj.propertySizeMin);
    // console.log("obj.propertySizeMin");
    if (obj.propertySizeMin != undefined && obj.propertySizeMin !== '') {
      FilterChipsData.push({label: 'Size Min:' + obj.propertySizeMin});
    }
    if (obj.propertySizeMax != undefined && obj.propertySizeMax !== '') {
      FilterChipsData.push({label: 'Size Max:' + obj.propertySizeMax});
    }

    if (obj.makeYear != undefined && obj.makeYear !== '') {
      FilterChipsData.push({label: 'Manufacture Year:' + obj.makeYear});
    }
    if (obj.kilometerDriven != undefined && obj.kilometerDriven !== '') {
      FilterChipsData.push({label: 'Km:' + obj.kilometerDriven + ' or less'});
    }
    if (obj.filters && obj.filters.tags && Array.isArray(obj.filters.tags)) {
      obj.filters.tags.forEach(tag => {
        if (Array.isArray(tag.values)) {
          const labelValues = tag.values
            .map(val => `${tag.name}: ${val.value}`)
            .join(', ');
          FilterChipsData.push({label: labelValues});
        }
      });
    }

    //   if(brandName !== "")
    //   {
    //     FilterChipsData.push({label: 'Brand:' + brandName});
    //   }

    //   FilterChipsData.push({label: 'Location:' + AppLocation.placeName});
    // // if(brandName !== "") {
    // //   FilterChipsData.push({label: 'Brands Associated :' + brandName});
    // // }
    setFilterChipsData(FilterChipsData);
  }
  // async function set_FilterChipsData(Keyword:any='') {
  //   let FilterChipsData = [];
  //   console.log('searchKeyword',Keyword);
  //     if(Keyword !== "")
  //     {
  //       FilterChipsData.push({label: 'Search:' + Keyword});
  //     }

  //     if(brandName !== "")
  //     {
  //       FilterChipsData.push({label: 'Brand:' + brandName});
  //     }

  //     FilterChipsData.push({label: 'Location:' + AppLocation.placeName});
  //   // if(brandName !== "") {
  //   //   FilterChipsData.push({label: 'Brands Associated :' + brandName});
  //   // }
  //   setFilterChipsData(FilterChipsData);
  // }

  async function callPodcastList(APiobj) {
    // pageSize_Set(5);
    // currentPage_Set(1);
    // hasMore_Set(true);
    setLoading(true);
    set_FilterChipsData(APiobj);
    //     console.log("=APiobj");
    // console.log(APiobj);
    // console.log(user);

    //  execute(listTypeData, {
    //   keyWord: searchKeyword !== "" ? searchKeyword : brandName,
    //   cityName: AppLocation.City,
    //   userId: user.userId,
    //   placeID: AppLocation.placeID,
    //   placeName: AppLocation.placeName,
    //   geoLocationLatitude: AppLocation.geoLocationLatitude,
    //   geoLocationLongitude: AppLocation.geoLocationLongitude,
    //   isSearch:false
    // });
    const results = await Promise.allSettled([
      execute(listTypeData, APiobj),
      getDashboardStory(user.userId, 1, 5),
      fetchDashboardData('Newin', {
        pageNo: 1,
        pageSize: 10,
        cityName: AppLocation.City,
        categoryId: categoryId,
      }),
      RecentSearchSData(`/RecentSearch/Categorywise`, {
        userId: user.userId,
        categoryId: categoryId,
      }),
      getRecommendedBrokerList(
        user.userId,
        categoryId,
        AppLocation.City,
        1,
        10,
      ),
      getSuggestionBrokerList(1, 10),
    ]);

    const [
      ListData,
      DashboardStory,
      NewIncategory,
      RecentSearch,
      RecommendedBroker,
      SuggestionBrokers,
    ] = results.map(result =>
      result.status === 'fulfilled' ? result.value : null,
    );
    console.log('DashboardStory');
    console.log(RecentSearch);
    setStoryData(DashboardStory.data);
    setNewIncategoryData(NewIncategory.data);
    setRecentSearchData(RecentSearch.data);
    setRenderBrokerData(RecommendedBroker.data);
    setSuggestionData(SuggestionBrokers.data);
    setLoading(false);
  }

  const convertTagsToNewFormat = tags => {
    // console.log('tags');
    // console.log(tags);
    return tags.reduce((acc, tag) => {
      const transformedValues = tag.values.map(item => ({
        key: item.key, // Assign the new key value

        value: item.value, // Set the new value
      }));
      acc[tag.name] = transformedValues;
      return acc;
    }, {});
  };

  useEffect(() => {
    setLoading(true);
    let categoryId=7
    if (listTypeData == 'RealEstate') {
      pageTitle('Properties');
      setApppageTitle('Properties');
      categoryId=1
    }
    if (listTypeData == 'Car') {
      pageTitle('Cars');
      setApppageTitle('Cars');
      categoryId=2
    }
    setItemslocalities(AppLocation);

    let obj: any = {
      keyWord: searchKeyword,
      cityName: AppLocation.City,
      userId: user.userId,
      placeID: AppLocation.placeID,
      placeName: AppLocation.placeName,
      geoLocationLatitude: AppLocation.geoLocationLatitude,
      geoLocationLongitude: AppLocation.geoLocationLongitude,
      isSearch: false,
    };

    let BraandPopUPFilter = null;
    if (brandfilters) {
      obj.filters = brandfilters;

      BraandPopUPFilter = convertTagsToNewFormat(brandfilters.tags);
    }

    setlistApiobj(obj);

    const locationData = [
      {
        place: {
          ...AppLocation,
        },
      },
    ];
    if (listTypeData == 'Car') {
      // Uncomment if you need to set additional selected filters
      let updatedPopUPFilter = {
        Location: locationData,
        Budget: {minValue: 20000, maxValue: 500000000, isDefault: true},
      };
      if (BraandPopUPFilter != null) {
        updatedPopUPFilter = {...updatedPopUPFilter, ...BraandPopUPFilter};
      }
      setPopUPFilter(updatedPopUPFilter);
    }

    if (listTypeData == 'RealEstate') {
      // Uncomment if you need to set additional selected filters
      let updatedPopUPFilter = {
        Location: locationData,
        Budget: {minValue: 20000, maxValue: 500000000, isDefault: true},
        Area: {minValue: 0, maxValue: 5000, isDefault: true},
      };
      if (BraandPopUPFilter != null) {
        updatedPopUPFilter = {...updatedPopUPFilter, ...BraandPopUPFilter};
      }
      setPopUPFilter(updatedPopUPFilter);
    }
    callPodcastList(obj);
 dispatch(setPreviousRoute({
            name:"ItemListScreen",
            params: {categoryId:categoryId }
          }));

          return () => {
            console.log("ItemListScreen=============resetPreviousRoute")
            // Cleanup logic (not needed for initializeSDK)
         //  dispatch(resetPreviousRoute()); 
          };
    //set_FilterChipsData(obj);
   // callPodcastList(obj);
  }, [isrest]);
  const [itemHeight, setItemHeight] = useState(560);

  const loadMorepage = async () => {
    if (!isInfiniteLoading) {
      await loadMore(listTypeData, listApiobj);
    }
  };
  // const rederListHeader = useCallback((categoryId, FilterChipsData, recordsCount) => (
  //   <>
  //     <View>
  //       <UserStories />
  //     </View>
  //     <Recommend categoryId={categoryId} />
  //     <FilterChips filters={FilterChipsData} recordsCount={recordsCount} />
  //   </>
  // ), [categoryId, FilterChipsData, recordCount]);
  const getItemLayout = (data, index) => ({
    length: itemHeight,
    offset: itemHeight * index,
    index,
  });
  const apphandleSearch = async (searchText: string) => {
    // console.log('apphandleSearch');
    // console.log(searchText);

    let obj = {
      ...listApiobj,
      keyWord: searchText,
      frontendFilters: JSON.stringify(PopUPFilter),
      isSearch: true,
    };

    navigation.navigate('ItemFilterListScreen', {
      listType: listTypeData,
      categoryId: categoryId,
      Filters: PopUPFilter,
      listApiobj: obj,
      searchText: searchText,
    });

    // pageSize_Set(5);
    // currentPage_Set(1);
    // hasMore_Set(true);
    // await setsearchKeyword(searchText);
    // let obj = {
    //   ...listApiobj,
    //   keyWord: searchText,
    // };
    // // console.log('apphandleSearch');
    // // console.log(obj);
    // setlistApiobj(obj);

    // callPodcastList(obj);
  };
  const OnPressfilters = () => {
    FilterSheetRef.current?.open();
  };
  // console.log(data);
  return (
    <BottomSheetModalProvider>
      <ZHeaderFliter
        title={ApppageTitle}
        isSearch={true}
        handleSearch={apphandleSearch}
        AppFliter={
          <FilterChips
            filters={FilterChipsData}
            recordsCount={recordCount}
            OnPressfilters={OnPressfilters}
          />
        }
      />

      {/* <ScrollView style={{ flex: 1 }}>
        <SafeAreaView> */}
      {/* <RederListHeader categoryId={categoryId} AppLocation={AppLocation} FilterChipsData={FilterChipsData} recordCount={recordCount}/>    */}
      <View style={{flex: 1}}>
        <View style={{flex: 1}}>
          {data === null ? (
            <SkeletonPlaceholder />
          ) : (
            <FlashList
              ref={flatListRef}
              estimatedItemSize={560}
              extraData={isrest}
              data={data}
              getItemLayout={560}
              renderItem={renderItem}
              initialNumToRender={2}
              maxToRenderPerBatch={4}
              windowSize={4}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
                <RederListHeader
                  categoryId={categoryId}
                  AppLocation={AppLocation}
                  FilterChipsData={FilterChipsData}
                  recordCount={recordCount}
                  user={user}
                  StoryData={StoryData}
                  NewIncategoryData={NewIncategoryData}
                  RecentSearchData={RecentSearchData}
                  RenderBrokerData={RenderBrokerData}
                  SuggestionData={suggestionData}
                />
              }
              keyExtractor={(item, index) => index.toString()}
              onEndReachedThreshold={0.6}
              onEndReached={loadMorepage}
              contentContainerStyle={{paddingBottom: 100}}
              ListFooterComponent={
                isInfiniteLoading ? (
                  <ActivityIndicator
                    size="large"
                    color="#0000ff"
                    style={styles.loader}
                  />
                ) : null
              }
              removeClippedSubviews={false}
              ListEmptyComponent={() =>
                data === undefined ? (
                  <ActivityIndicator
                    size="large"
                    color="#0000ff"
                    style={styles.loader}
                  />
                ) : (
                  <NoDataFoundScreen />
                )
              }
            />
          )}
        </View>
        {/* <View style={{marginTop:"auto",height:80 }}>
        <View style={styles.footer}>
        <ZText type={'S16'} >Properties</ZText>
        <View style={styles.IconButton}>
          <ShortingIcon />
          <ZText type={'S16'} >Sort</ZText>
        </View>
        <View style={styles.IconButton}>
          <FilterIcon />
          <ZText type={'S16'} >Filter</ZText>
        </View>
      </View>
        </View> */}
      </View>

      <FilterBottomSheet
        ref={FilterSheetRef}
        PopUPFilter={PopUPFilter}
        User={user}
        listTypeData={listTypeData}
        userPermissions={userPermissions}
        onClose={closeModal}
      />
      {/* </SafeAreaView>
     
        </ScrollView> */}
      <ReportScreen
        ref={reportSheetRef}
        postItem={selectedItem}
        screenFrom={'List'}
        onClose={closeModalReport}
      />
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  cardAvatar: {
    display: 'flex',
    flexDirection: 'row',
    padding: 10,
  },
  cardAvatarImg: {
    display: 'flex',
    flexDirection: 'row',
  },
  cardAvatarText: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 10,
    alignItems: 'center',
  },
  callbtn: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef4f4',
    width: '90%',
    marginLeft: 10,
    paddingVertical: 5, // Vertical padding
    paddingHorizontal: 5, // Horizontal padding
    borderRadius: 8, // Rounded corners

    justifyContent: 'center',
  },
  Chatbtn: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F7FE',
    width: '90%',

    paddingVertical: 5, // Vertical padding
    paddingHorizontal: 5, // Horizontal padding
    borderRadius: 8, // Rounded corners

    marginRight: 10,
    justifyContent: 'center',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#555', // Use a subtle color to match your design
    textAlign: 'center',
  },
  loader: {
    marginVertical: 20,
  },
  headerContainer: {
    backgroundColor: '#FFF',
    paddingVertical: 10,
  },
  header: {
    justifyContent: 'space-between',

    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  listContainer: {
    backgroundColor: '#F7F8FA',
    flex: 1,
  },

  footer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    height: 80,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  IconButton: {
    flexDirection: 'row',
    gap: 12,
  },
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
    width: 375,
    height: 478,
    borderRadius: 12,
    backgroundColor: '#FFF', // Equivalent to background: var(--white, #FFF)
    shadowColor: 'rgba(0, 0, 0, 0.8)', // shadow color
    shadowOffset: {width: 0, height: 4}, // shadow offset
    shadowOpacity: 1, // shadow opacity
    shadowRadius: 64, // blur radius (64px)
    elevation: 8,
    marginHorizontal: 8,
  },
  itemFooterContainer: {
    backgroundColor: '#FFF',
    paddingVertical: 10,
    paddingLeft: 5,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  separator: {
    width: 10, // Space between cards
  },
  tagImage: {
    width: 375,
    height: 278,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  WrapcardContainer: {
    // paddingHorizontal: 20,
    marginBottom: 20,
  },
  cardContainer: {
    width: '100%',
    display: 'flex',
    borderRadius: 12,
    backgroundColor: '#FFF',
    //  margin:20,
    shadowColor: 'rgba(0, 0, 0, 0.8)',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.5,
    // shadowRadius: 20,
    elevation: 4,
  },
  carImage: {
    width: 375,
    height: 278,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  iconContainer: {
    position: 'absolute',
    top: 8,

    right: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  checkIcon: {
    // backgroundColor: '#377DFF',
    borderRadius: 20,
    padding: 3,
  },
  heartIcon: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 3,
  },
  detailsContainer: {
    paddingLeft: 20,
    paddingBottom: 10,
    paddingTop: 10,
    width: '100%',
    paddingRight: 20,
  },
  detailsContainerBottom: {
    //  paddingLeft: 20,
    borderRadius: 12,
    paddingTop: 5,
    paddingBottom: 10,
    width: '100%',
    //  paddingRight: 20,
    //  borderColor:colors.light.appred,
    //  borderBottomWidth:1,
    //  borderBottomLeftRadius: 12,
    //  borderBottomRightRadius: 12,
    //  borderLeftWidth:1,
    //  borderRightWidth:1,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#7A7A7A',
    marginLeft: 4,
  },
  carBrand: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginTop: 4,
  },
});

export default AppBaseContainer(ItemListScreen, '', false, true);
//export default ItemListScreen;
