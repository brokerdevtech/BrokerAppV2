import React, { useCallback, useEffect, useRef, useState } from 'react';
import {View, Text, ScrollView, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '@reduxjs/toolkit/query';
import CustomHeader from '../sharedComponents/CustomHeader';
import ZText from '../sharedComponents/ZText';

import ShortingIcon from '../assets/svg/icons/sorting.svg' 
import FilterIcon from '../assets/svg/icons/filters.svg';
import ArrowLeftIcon from '../assets/svg/icons/arrow-left.svg' 
import SearchIcon from '../assets/svg/icons/search.svg' 
import {HStack} from '@/components/ui/hstack';
import UserProfile from '../sharedComponents/profile/UserProfile';
import {Card_check_icon, Heart_icon, Location_Icon,Calender_Icon,
  Chat_Icon,
  Telephone_Icon,
  Whatsapp_Icon} from '../assets/svg';
import { imagesBucketcloudfrontPath } from '../config/constants';
import {useApiRequest} from '@/src/hooks/useApiRequest';
import { fetchDashboardData, fetchItemList } from '@/BrokerAppCore/services/new/dashboardService';
import {Icon} from '../../components/ui/icon';
import { Divider } from '@/components/ui/divider';
import {VStack} from '@/components/ui/vstack';
import MediaGallery from '../sharedComponents/MediaGallery';
import { useApiPagingWithtotalRequest } from '@/src/hooks/useApiPagingWithtotalRequest';
import AppBaseContainer from '@/src/hoc/AppBaseContainer_old';
import LoadingSpinner from '../sharedComponents/LoadingSpinner';
import { Box } from '../../components/ui/box';
import FilterChips from '../sharedComponents/FilterChips';

const ProductItem =  React.memo(
  ({ item }) => {
  const MediaGalleryRef = useRef(null);

  return (
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
      <View style={styles.iconContainer}>
        <View style={styles.checkIcon}>
          <Card_check_icon />
        </View>
        <TouchableOpacity>
          <Heart_icon accessible={true} fontSize={25} />
        </TouchableOpacity>
      </View>

      {/* Car Details */}
      <VStack space="md" style={styles.detailsContainer}>
<HStack>
  <Box style={{marginLeft:4 }}>
  <ZText type={'R16'}>
        {'\u20B9'} {' '}
        </ZText>
  </Box>
  <Box>
  <ZText type={'R16'}>
     {item.price}
        </ZText>

  </Box>
</HStack>

  
       
          {item.location.cityName && (

<HStack>
  <Box>
  <Icon as={Location_Icon} />
  </Box>
  <Box>
  <ZText type={'R16'} numberOfLines={1}  // Limits to 2 lines
  ellipsizeMode="tail"> {' '}
                {item.location.placeName}
              </ZText>

  </Box>
</HStack>

       
          )}
  
  <HStack>

  <Box>
  <ZText type={'R16'} numberOfLines={1}  // Limits to 2 lines
  ellipsizeMode="tail">
                {item.title}
              </ZText>

  </Box>
</HStack>  
       
      </VStack>

      <Divider className="my-0.5" />

      <View style={styles.detailsContainer}>
        <HStack space="md" style={{ paddingHorizontal: 10, justifyContent: 'space-between' }}>
          <VStack>
            <View style={{ alignItems: 'center' }}><Icon as={Telephone_Icon} size={'xxl'} /></View>
            <View style={{ paddingVertical: 10 }}>
              <ZText type={'R14'}>Call</ZText>
            </View>
          </VStack>
          <VStack>
            <View style={{ alignItems: 'center' }}><Icon as={Chat_Icon} size={'xxl'} /></View>
            <View style={{ paddingVertical: 10 }}>
              <ZText type={'R14'}>Chat</ZText>
            </View>
          </VStack>
          <VStack>
            <View style={{ alignItems: 'center' }}><Icon as={Whatsapp_Icon} size={'xxl'} /></View>
            <View style={{ paddingVertical: 10 }}>
              <ZText type={'R14'}>Whatsapp</ZText>
            </View>
          </VStack>
          <VStack>
            <View style={{ alignItems: 'center' }}><Icon as={Calender_Icon} size={'xxl'} /></View>
            <View style={{ paddingVertical: 10 }}>
              <ZText type={'R14'}>Appointment</ZText>
            </View>
          </VStack>
        </HStack>  
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
  listType }) => {
  const [isInfiniteLoading, setInfiniteLoading] = useState(false);
  const [FilterChipsData, setFilterChipsData] = useState([]);
  const AppLocation = useSelector((state: RootState) => state.AppLocation);

  const {
    data,
    status,
    error,
    execute,
    loadMore,
    pageSize_Set,
    currentPage_Set,
    hasMore_Set,
    totalPages,recordCount
  } = useApiPagingWithtotalRequest(fetchItemList,setInfiniteLoading,5);
  //const {data, status, error, execute} = useApiPagingRequest5(fetchItemList);
  const renderItem = useCallback(({ item }) => <ProductItem item={item} />, []);
  async function set_FilterChipsData() {

let FilterChipsData =[];
FilterChipsData.push({ label: 'Location:'+ AppLocation.placeName },)

setFilterChipsData(FilterChipsData);
  
  }



  async function callPodcastList() {
    pageSize_Set(5)
    currentPage_Set(1);
    hasMore_Set(true);

    await execute('RealEstate', {
     keyWord: "",
      userId: user.userId,
      placeID:AppLocation.placeID,
      placeName: AppLocation.placeName,
      geoLocationLatitude: AppLocation.geoLocationLatitude,
      geoLocationLongitude:AppLocation.geoLocationLongitude
     
    });
    console.log('data :-', data);
    console.log('status :-', status);
    console.log('error :-', error);
  }

  useEffect(() => {
    set_FilterChipsData();
    callPodcastList();
  }, []);
  const [itemHeight, setItemHeight] = useState(560);
  // const onItemLayout = (event) => {
  //   const { height } = event.nativeEvent.layout;
  //   console.log('itemHeight :',height);
  //   setItemHeight(height);
  // };
  const loadMorepage = async () => {
    if(!isInfiniteLoading)
  {  
      await loadMore('RealEstate', {
 
      keyWord: "",
      userId: user.userId,
      placeID:AppLocation.placeID,
      placeName: AppLocation.placeName,
      geoLocationLatitude: AppLocation.geoLocationLatitude,
      geoLocationLongitude:AppLocation.geoLocationLongitude
     
    });
    
  }
  };
  return (
  
    
      <View style={{ flex: 1 }}>
         <FilterChips filters={FilterChipsData} recordsCount={recordCount}></FilterChips>
         {data&&  
          <FlatList
              data={data}
             
              renderItem={renderItem}
              
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              // initialNumToRender={2}
              // maxToRenderPerBatch={5}
             
            
             
              keyExtractor={(item, index) => index.toString()}
              onEndReachedThreshold={0.2}
              onEndReached={loadMorepage}
              ListFooterComponent={
                isInfiniteLoading ? (
                  <LoadingSpinner isVisible={isInfiniteLoading} />
                ) : null
              }
             // decelerationRate="fast"
            //  removeClippedSubviews={true}
              // getItemLayout={(data, index) => ({
              //   length: itemHeight,
              //   offset: itemHeight * index,
              //   index,
              // })}
            />}
 
        </View>
    //   </ScrollView>
    //   <View style={styles.footer}>
    //     <ZText type={'S16'} >Properties</ZText>
    //     <View style={styles.IconButton}>
    //       <ShortingIcon />
    //       <ZText type={'S16'} >Sort</ZText>
    //     </View>
    //     <View style={styles.IconButton}>
    //       <FilterIcon />
    //       <ZText type={'S16'} >Filter</ZText>
    //     </View>
    //   </View>
    // </View>
    
  );
}


const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#FFF',
    paddingVertical: 10,
   
  },
  header: {
   justifyContent: "space-between",
   flexDirection: 'row',
   paddingHorizontal: 20,
   paddingVertical: 20,
  },
  listContainer: {
    backgroundColor: '#F7F8FA',
    flex: 1
  },
  
  footer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    height: 80,    
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  IconButton: {
    flexDirection: 'row',
    gap: 12
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
  cardContainer: {
    width: 375,
    borderRadius: 12,
    backgroundColor: '#FFF',
    margin: 10,
    paddingBottom: 10,
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
    left: 8,
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
    paddingVertical: 20,
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

export default AppBaseContainer(ItemListScreen, 'Property', true);
//export default ItemListScreen;