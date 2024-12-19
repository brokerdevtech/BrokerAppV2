/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-trailing-spaces */
/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '@reduxjs/toolkit/query';
import CustomHeader from '../sharedComponents/CustomHeader';
import ZText from '../sharedComponents/ZText';

import ShortingIcon from '../assets/svg/icons/sorting.svg';
import FilterIcon from '../assets/svg/icons/filters.svg';
import ArrowLeftIcon from '../assets/svg/icons/arrow-left.svg';
import SearchIcon from '../assets/svg/icons/search.svg';
import {HStack} from '@/components/ui/hstack';
import UserProfile from '../sharedComponents/profile/UserProfile';
import {
  Card_check_icon,
  Heart_icon,
  Location_Icon,
  Calender_Icon,
  Chat_Icon,
  Telephone_Icon,
  Whatsapp_Icon,
  share_PIcon,
  bookmark_icon,
  description_icon,
} from '../assets/svg';
import {imagesBucketcloudfrontPath} from '../config/constants';
import {useApiRequest} from '@/src/hooks/useApiRequest';
import {
  fetchDashboardData,
  fetchItemList,
} from '../../BrokerAppCore/services/new/dashboardService';
import {FavouriteIcon, Icon, MessageCircleIcon} from '../../components/ui/icon';
import {Divider} from '@/components/ui/divider';
import {VStack} from '@/components/ui/vstack';
import MediaGallery from '../sharedComponents/MediaGallery';
import {useApiPagingWithtotalRequest} from '../../src/hooks/useApiPagingWithtotalRequest';
import AppBaseContainer from '../../src/hoc/AppBaseContainer_old';
import LoadingSpinner from '../sharedComponents/LoadingSpinner';
import {Box} from '../../components/ui/box';
import FilterChips from '../sharedComponents/FilterChips';
import margin from '@/themes/margin';
import {SetPostLikeUnLike} from '../../BrokerAppCore/services/new/dashboardService';
import PostActions from '../sharedComponents/PostActions';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import UserStories from '../components/story/UserStories';
import Recommend from '../sharedComponents/RecomendedBrokers';
import ProductSection from './Dashboard/ProductSection';
import flex from '@/themes/flex';
import padding from '@/themes/padding';
import {FlashList} from '@shopify/flash-list';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../themes';
import {Color} from '@/styles/GlobalStyles';
import ZHeaderFliter from '../sharedComponents/ZHeaderFliter';
import FilterBottomSheet from '../sharedComponents/FilterBottomSheet';
import {getFilterTags} from '../../BrokerAppCore/services/filterTags';
import {concat, filter} from 'lodash';
import ListingCardSkeleton from '../sharedComponents/Skeleton/ListingCardSkeleton';
import {formatNumberToIndianSystem} from '../utils/helpers';
import useUserJourneyTracker from '../hooks/Analytics/useUserJourneyTracker';
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
  ({categoryId, AppLocation, FilterChipsData, recordCount}) => {
    return (
      <>
        <UserStories />

        <Recommend categoryId={categoryId} />
        <ProductSection
          heading={'Newly Launched'}
          background={'#FFFFFF'}
          endpoint={'Newin'}
          isShowAll={false}
          request={{
            pageNo: 1,
            pageSize: 10,
            cityName: AppLocation.City,
            categoryId: categoryId,
          }}
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
  ({item, listTypeData, User, navigation, OnGoBack}) => {
    const MediaGalleryRef = useRef(null);
    const [isrefresh, setisrefresh] = useState(0);

    const ProductItemOnGoBack = item => {
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
    return (
      <View style={styles.WrapcardContainer}>
        <View style={styles.cardContainer}>
          <MediaGallery
            ref={MediaGalleryRef}
            mediaItems={item.postMedias}
            paused={false}
          />

          {/* <Image
        source={{
          uri: `${imagesBucketcloudfrontPath}${item.postMedias[0].mediaBlobId}`,
        }}
        style={styles.carImage}
      /> */}

          {/* Check and Heart Icons */}
          {item.isBrokerAppVerified && (
            <View style={styles.iconContainer}>
              <View style={styles.checkIcon}>
                <Card_check_icon />
              </View>
            </View>
          )}
          <View style={{marginLeft: 20}}>
            <PostActions
              item={item}
              User={User}
              listTypeData={listTypeData}
              isrefresh={isrefresh}
              onUpdateLikeCount={newCount => {
                //     console.log(newCount);
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
);

const ItemFilterListScreen: React.FC<any> = ({
  isPageSkeleton,
  toggleSkeletonoff,
  toggleSkeletonOn,
  setLoading,
  navigation,
  user,
  color,
  route,
  pageTitle,
  isLoading,
  listType,
}) => {
  const [isInfiniteLoading, setInfiniteLoading] = useState(false);
  const [FilterChipsData, setFilterChipsData] = useState([]);
  const [listTypeData, setlistTypeData] = useState(route.params.listType);
  const [listApiobj, setlistApiobj] = useState(route.params.listApiobj);
  const [FiltersOBJ, setFiltersOBJ] = useState(route.params.Filters);
  const [ApppageTitle, setApppageTitle] = useState('');
  const [searchKeyword, setsearchKeyword] = useState(
    route.params.searchText ? route.params.searchText : '',
  );
  const {logButtonClick} = useUserJourneyTracker(
    `${route.params.listType}Filter Search Page`,
  );
  const [Itemslocalities, setItemslocalities] = useState(null);
  const [PopUPFilter, setPopUPFilter] = useState(null);
  const [categoryId, setCategoryId] = useState(route.params.categoryId);
  // console.log(route.params, 'jj');
  const brandName =
    route.params.brandName !== undefined ? route.params.brandName : '';
  const AppLocation = useSelector((state: RootState) => state.AppLocation);
  // console.log('=============user=============');
  // console.log(user);
  const FilterSheetRef = useRef(null);
  const [isrest, setisrest] = useState(false);
  const closeModal = useCallback(
    item => {
      if (Object.keys(item).length > 0) {
        setPopUPFilter(item);
        setLoading(true);
        pageSize_Set(5);
        currentPage_Set(1);
        hasMore_Set(true);
        let tags = getFilterTags(item);
        tags.frontendFilters = JSON.stringify(item);
        callPodcastList(tags);
      }
    },
    [searchKeyword],
  );

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
  } = useApiPagingWithtotalRequest(fetchItemList, setInfiniteLoading, 5);
  //const {data, status, error, execute} = useApiPagingRequest5(fetchItemList);
  const renderItem = useCallback(
    ({item}) => (
      <ProductItem
        item={item}
        listTypeData={listTypeData}
        User={user}
        navigation={navigation}
        OnGoBack={OnGoBack}
      />
    ),
    [],
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

    await execute(listTypeData, APiobj);
    setLoading(false);
  }
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
  useEffect(() => {
    setLoading(true);
    if (listTypeData == 'RealEstate') {
      pageTitle('Properties');
      setApppageTitle('Properties');
    }
    if (listTypeData == 'Car') {
      pageTitle('Cars');
      setApppageTitle('Cars');
    }
    setItemslocalities(AppLocation);

    setPopUPFilter(FiltersOBJ);

    //set_FilterChipsData(obj);
    callPodcastList(listApiobj);
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
    pageSize_Set(5);
    currentPage_Set(1);
    hasMore_Set(true);
    await setsearchKeyword(searchText);
    let obj = {
      ...listApiobj,
      keyWord: searchText,
      frontendFilters: JSON.stringify(PopUPFilter),
      isSearch: true,
    };
    // console.log('apphandleSearch');
    // console.log(obj);
    setlistApiobj(obj);

    callPodcastList(obj);
  };
  const OnPressfilters = () => {
    FilterSheetRef.current?.open();
  };
  // console.log(status);
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
              data={data}
              estimatedItemSize={560}
              ref={flatListRef}
              getItemLayout={560}
              renderItem={renderItem}
              initialNumToRender={2}
              maxToRenderPerBatch={4}
              windowSize={4}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              // ListHeaderComponent={
              //   <RederListHeader
              //     categoryId={categoryId}
              //     AppLocation={AppLocation}
              //     FilterChipsData={FilterChipsData}
              //     recordCount={recordCount}
              //   />
              // }
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
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No Data Found</Text>
                  </View>
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
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
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
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  cardContainer: {
    width: '100%',
    display: 'flex',
    borderRadius: 12,
    backgroundColor: '#FFF',
    //  margin:20,
    // shadowColor: 'rgba(0, 0, 0, 0.8)',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 5,
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

export default AppBaseContainer(ItemFilterListScreen, '', false, true);
//export default ItemListScreen;
