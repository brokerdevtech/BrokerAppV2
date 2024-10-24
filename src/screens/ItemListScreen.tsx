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
  Linking,Alert,
  ActivityIndicator,
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
import { FlashList } from '@shopify/flash-list';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../themes';
import { Color } from '@/styles/GlobalStyles';

const RederListHeader=React.memo(({categoryId,AppLocation,FilterChipsData,recordCount})=>{
   console.log(AppLocation.City,"categoryId")
  return (
    <>
   
    <UserStories/>
    
    <Recommend categoryId={categoryId}/>
    <ProductSection
          heading={'Newly Launched'}
          background={'#FFFFFF'}
          endpoint={`Newin`}
          isShowAll={false}
          request={{
            pageNo: 1,
            pageSize: 10,
            cityName: AppLocation.City,
            categoryId: categoryId,
          }}
        />
         <FilterChips filters={FilterChipsData} recordsCount={recordCount}></FilterChips>
    </>

  )
})
// const ListHeader = React.memo(({ FilterChipsData, recordsCount }) => (
//   <>
//     <View>
//       <UserStories />
//     </View>
//     <Recommend  />
//     <FilterChips filters={FilterChipsData} recordsCount={recordsCount} />
//   </>
// ));

const ProductItem =  React.memo(
    ({ item, listTypeData, User, navigation }) => {
  const MediaGalleryRef = useRef(null);

  const openWhatsApp = useCallback((phoneNumber, message) => {
  
  
    const url = `whatsapp://send?text=${encodeURIComponent(message)}&phone=${phoneNumber}`;

   
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Error', 'WhatsApp is not installed on this device');
        }
      })
      .catch(err => console.error('Error opening WhatsApp', err));
  },[]);
  const chatProfilePress = useCallback(async () => {
 

    const members = [User.userId.toString(), item.userId.toString()];


    navigation.navigate('AppChat', {
      defaultScreen: 'ChannelScreen',
      defaultParams: members,
      defaultchannelSubject:`Hi,i want to connect on ${item.title}`,
    });

  },[]);
  const makeCall = useCallback((phoneNumber) => {
    const url = `tel:${phoneNumber}`;

    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Error', 'Your device does not support phone calls');
        }
      })
      .catch(err => console.error('Error opening dialer', err));
  },[]);
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
<View style={{marginLeft:20}}>
      <PostActions
        item={item}
        User={User}
        listTypeData={listTypeData}
        onUpdateLikeCount={newCount => {
          console.log(newCount);
        }}
      /></View>
      {/* Car Details */}
      <TouchableOpacity onPress={() => navigation.navigate('ItemDetailScreen', { postId: item.postId , postType: item.hasOwnProperty('fuelType') ? 'Car/Post' : 'Post'})}>
      <VStack space="xs" style={styles.detailsContainer}>
        <HStack>
          <Box style={{marginLeft: 4}}>
            <ZText type={'M16'} style={{color:colors.light.appred}}>{'\u20B9'} </ZText>
          </Box>
          <Box>
            <ZText type={'M16'} style={{color:colors.light.appred}}>{item.price}</ZText>
          </Box>
        </HStack>

        {item.location?.cityName && (
          <HStack>
            <Box>
              <Icon as={Location_Icon} size='xl'/>
            </Box>
            <Box style={{width:'100%' ,flex:1}}>
              <ZText
              
                type={'R16'}
                numberOfLines={1} // Limits to 2 lines
                ellipsizeMode="tail"
              >
                {' '}
                {item.location.placeName}
              </ZText>
            </Box>
          </HStack>
        )}

    
          <HStack style={{width:'100%' ,flex:1}}>
          <Box>
              <Icon as={description_icon} fill='black' size='xl'/>
            </Box>
            <Box style={{width:'100%' ,flex:1}}>
            <ZText
          
              type={'R16'}
              numberOfLines={1} // Limits to 2 lines
              ellipsizeMode="tail"
            > {' '}
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
          <HStack style={{alignItems: 'center', width: '50%',    justifyContent: 'center'}}>
          <TouchableOpacity style={styles.callbtn} onPress={() => makeCall('+919910199761')}>
            <View style={{alignItems: 'center'}}>
              <Icon as={Telephone_Icon} color={colors.light.appred} size={'xxl'} />
            </View>
            <View style={{ alignItems: 'center',paddingVertical: 10}}>
              <ZText type={'M14'} >Call</ZText>
            </View>
            </TouchableOpacity>
            
          </HStack>
          <HStack style={{alignItems: 'center',width: '50%',    justifyContent: 'center'}}>
          <TouchableOpacity
          style={styles.Chatbtn}
          
          
          onPress={() =>chatProfilePress()}>
            <View style={{alignItems: 'center',marginRight:10}}>
              <Icon as={Chat_Icon}  color={'#0F5DC4'} size={'xxl'}  />
            </View>
            <View style={{ alignItems: 'center',paddingVertical: 10,}}>
              <ZText type={'M14'}>Chat</ZText>
            </View>
            </TouchableOpacity>
          </HStack>
      
        </HStack>
      </View>
    </View>
    </View>
  );
});

const ItemListScreen: React.FC<any> = ({
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
  searchKeyword,
}) => {
  const [isInfiniteLoading, setInfiniteLoading] = useState(false);
  const [FilterChipsData, setFilterChipsData] = useState([]);
  const [listTypeData, setlistTypeData] = useState(route.params.listType);
  const [categoryId, setCategoryId] = useState(route.params.categoryId);
  const brandName = route.params.brandName !== undefined ? route.params.brandName : "";
  const AppLocation = useSelector((state: RootState) => state.AppLocation);
  // console.log('=============user=============');
  // console.log(user);


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
      <ProductItem item={item} listTypeData={listTypeData} User={user} navigation={navigation} />
    ),
    [],
  );
  async function set_FilterChipsData() {
    let FilterChipsData = [];
      if(searchKeyword !== "") 
      {
        FilterChipsData.push({label: 'Search:' + searchKeyword});
      }

      if(brandName !== "") 
      {
        FilterChipsData.push({label: 'Brand:' + brandName});
      }
      

      FilterChipsData.push({label: 'Location:' + AppLocation.placeName});
    // if(brandName !== "") {
    //   FilterChipsData.push({label: 'Brands Associated :' + brandName});
    // }
    setFilterChipsData(FilterChipsData);
  }

  async function callPodcastList() {
    // pageSize_Set(5);
    // currentPage_Set(1);
    // hasMore_Set(true);

     execute(listTypeData, {
      keyWord: searchKeyword !== "" ? searchKeyword : brandName,
      cityName: AppLocation.City,
      userId: user.userId,
      placeID: AppLocation.placeID,
      placeName: AppLocation.placeName,
      geoLocationLatitude: AppLocation.geoLocationLatitude,
      geoLocationLongitude: AppLocation.geoLocationLongitude,
      isSearch:false
    });
   
    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    if (listTypeData == 'RealEstate') {
      pageTitle('Property');
    }
    if (listTypeData == 'Car') {
      pageTitle('Car');
    }

    set_FilterChipsData();
    callPodcastList();
  }, []);
  const [itemHeight, setItemHeight] = useState(560);

  const loadMorepage = async () => {
    if (!isInfiniteLoading) {
      await loadMore(listTypeData, {
        keyWord: '',
       cityName: AppLocation.City,
        userId: user.userId,
        placeID: AppLocation.placeID,
        placeName: AppLocation.placeName,
        geoLocationLatitude: AppLocation.geoLocationLatitude,
        geoLocationLongitude: AppLocation.geoLocationLongitude,
        isSearch:false
      });
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
  const getItemLayout = (data, index) => (
    { length: itemHeight, offset: itemHeight * index, index }
  );
  return (

    <BottomSheetModalProvider>
 
      {/* <ScrollView style={{ flex: 1 }}>
        <SafeAreaView> */}
      {/* <RederListHeader categoryId={categoryId} AppLocation={AppLocation} FilterChipsData={FilterChipsData} recordCount={recordCount}/>    */}
        <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
        {data &&
          <FlatList
              data={data}
              getItemLayout={getItemLayout}
              renderItem={renderItem}
 initialNumToRender={2}
        maxToRenderPerBatch={4}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
             ListHeaderComponent={
              <RederListHeader categoryId={categoryId} AppLocation={AppLocation} FilterChipsData={FilterChipsData} recordCount={recordCount}/>}
             keyExtractor={(item, index) => index.toString()}
              onEndReachedThreshold={0.6}
              onEndReached={loadMorepage}
              contentContainerStyle={{ paddingBottom: 100 ,gap:20}}
              ListFooterComponent={
                isInfiniteLoading ? (
                  <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
                ) : null
              }
              removeClippedSubviews={true}
              ListEmptyComponent={() => (
                data === undefined ? (
                  <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
                ) : (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No Data Found</Text>
                  </View>
                )
              )}
            />
        
//  <FlashList
// data={data}
// renderItem={renderItem}
// // ListHeaderComponent={
// //                 <RederListHeader categoryId={categoryId} AppLocation={AppLocation} FilterChipsData={FilterChipsData} recordCount={recordCount}/>}
//                keyExtractor={(item, index) => index.toString()}
//                ListFooterComponent={
//                                 isInfiniteLoading ? (
//                                   <LoadingSpinner isVisible={isInfiniteLoading} />
//                                 ) : null
//                               }
//                               ListEmptyComponent={() => (
//                                 data === undefined ? (
//                                   <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
//                                 ) : (
//                                   <View style={styles.emptyContainer}>
//                                     <Text style={styles.emptyText}>No Data Found</Text>
//                                   </View>
//                                 )
//                               )}
// estimatedItemSize={100}
// onEndReachedThreshold={0.8}              
// onEndReached={loadMorepage}
// />  
            }
        </View>
        <View style={{marginTop:"auto",height:80 }}>
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
        </View>

        </View>
  

{/* </SafeAreaView>
     
        </ScrollView> */}
    
     
      
      </BottomSheetModalProvider>

  );
};

const styles = StyleSheet.create({
  callbtn:{display:'flex',
    flexDirection:'row',
    alignItems:'center',
     backgroundColor:"#fef4f4",
    width: '90%',
    marginLeft:10,
    paddingVertical: 5, // Vertical padding
    paddingHorizontal: 5, // Horizontal padding
    borderRadius: 8, // Rounded corners
    
    justifyContent: 'center'},
    Chatbtn:
      {display:'flex',flexDirection:'row',alignItems:'center', backgroundColor:"#F2F7FE",
        width: '90%',
        
        paddingVertical: 5, // Vertical padding
        paddingHorizontal: 5, // Horizontal padding
        borderRadius: 8, // Rounded corners
  
   marginRight:10,
        justifyContent: 'center'
        
                   },
    
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
 
  },
  emptyText: {
    fontSize: 16,
    color: '#555',  // Use a subtle color to match your design
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
  WrapcardContainer:{
    paddingHorizontal:20,
  },
  cardContainer: {
    width: '100%',
display:'flex',
    borderRadius: 12,
    backgroundColor: '#FFF',
 //  margin:20,
    shadowColor: 'rgba(0, 0, 0, 0.8)',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 1,
    shadowRadius: 20,
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
   
    right: 8,
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
     width:'100%',
     paddingRight: 20,

    },
    detailsContainerBottom: {
    //  paddingLeft: 20,
    borderRadius: 12,
    paddingTop:5,
    paddingBottom:10,
       width:'100%',
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

export default AppBaseContainer(ItemListScreen, '', true,true);
//export default ItemListScreen;
