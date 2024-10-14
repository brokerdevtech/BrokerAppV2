import React, { useEffect, useRef } from 'react';
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
  Whatsapp_Icon, Share_Icon} from '../assets/svg';
import { imagesBucketcloudfrontPath } from '../config/constants';
import {useApiRequest} from '@/src/hooks/useApiRequest';
import { fetchPostByID } from '@/BrokerAppCore/services/new/dashboardService';
import {Icon, ShareIcon} from '../../components/ui/icon';
import { Divider } from '@/components/ui/divider';
import {VStack} from '@/components/ui/vstack';
import MediaGallery from '../sharedComponents/MediaGallery';


const ItemDetailScreen: React.FC<any> = ({ route, navigation }) => {

  const AppLocation = useSelector((state: RootState) => state.AppLocation);
  const user = useSelector((state: RootState) => state.user.user);
  const MediaGalleryRef = useRef(null);
  const {data, status, error, execute} = useApiRequest(fetchPostByID);
  
  const callItemDetail = async () => {
    await execute('Post', route.params.postId);
    console.log('data :-', data);
    console.log('paramData :-', route.params);
    ///console.log('status :-', status);
    //console.log('error :-', error);
  };

  useEffect(() => {
    callItemDetail();
  }, []);


  return (
    <View style={styles.listContainer}>
      <ScrollView >
        <View style={styles.headerContainer}>
             <View style={styles.header}>
                 <View style={styles.IconButton}>
                    <ArrowLeftIcon onPress={() => navigation.goBack()} />
                    <ZText type={'R18'} >{data?.title}</ZText>
                 </View>
                 <View style={styles.IconButton}>
                    <Share_Icon />
                 </View>
             </View>
        </View>
        <View>
          <HStack space="md" reversed={false} style={{paddingHorizontal: 10}}>
            {/* Start */}
            {data !== null && (
            <View style={styles.cardContainer}>
                 {/* <Image
                  source={{
                    uri: `${imagesBucketcloudfrontPath}${data?.profileImage}`,
                  }}
                  style={styles.carImage}
                /> */}
                <MediaGallery ref={MediaGalleryRef} mediaItems={data?.postMedia} paused={false}/> 
               
                {/* Check and Heart Icons */}
                <View style={styles.iconContainer}>
                  <View style={styles.checkIcon}>
                    <Card_check_icon />
                  </View>
                  <TouchableOpacity style={{}}>
                    <Heart_icon accessible={true} fontSize={25} />
                  </TouchableOpacity>
                </View>

                {/* Car Details */}
                <VStack space="md" style={styles.detailsContainer}>
                  <ZText type={'R16'}>
                    $ {data?.price}
                  </ZText>
                  <View style={styles.locationContainer}>
                     {data.location.cityName && (
                      <>
                        <Icon as={Location_Icon} />
                        <ZText type={'R16'}>
                          {data?.location.placeName}
                        </ZText>
                      </>
                    )}
                  </View>
                  
                  <ZText type={'R16'} >
                    {data.title}
                  </ZText>
                </VStack>
                <Divider className="my-0.5"/>
                <View style={styles.detailsContainer}>
                    <HStack space="md" reversed={false} style={{paddingHorizontal: 10, justifyContent: 'space-between' }}>
                        <VStack>
                            <View style={{alignItems: 'center', alignContent: 'center'}}><Icon as={Telephone_Icon} size={'xxl'} /></View>
                            <View style={{paddingVertical: 10}}>
                                <ZText type={'R14'}>{data.userLiked} Like </ZText>
                            </View>
                        </VStack>
                        <VStack>
                            <View style={{alignItems: 'center', alignContent: 'center'}}><Icon as={Chat_Icon} size={'xxl'} /></View>
                            <View style={{paddingVertical: 10}}>
                                <ZText type={'R14'}>{data.comments} Comment</ZText>
                            </View>
                        </VStack>
                        <VStack>
                            <View style={{alignItems: 'center', alignContent: 'center'}}><Icon as={Share_Icon} size={'xxl'} /></View>
                            <View style={{paddingVertical: 10}}>
                                <ZText type={'R14'}>Share</ZText>
                            </View>
                        </VStack>
                        <VStack>
                            <View style={{alignItems: 'center', alignContent: 'center'}}><Icon as={Calender_Icon}  size={'xxl'} /></View>
                            <View style={{paddingVertical: 10}}>
                                <ZText type={'R14'}>{data.buyers} Have Buyer</ZText>
                            </View>
                        </VStack>
                    </HStack> 
                    <VStack space="md">
                       <Divider className="my-0.5"/>
                        <HStack space="md" reversed={false} style={{justifyContent: 'space-between',  paddingVertical: 10}}>
                          <View><ZText type={'R14'}>Project</ZText></View>
                          <View><ZText type={'R14'}>{data.projectName}</ZText></View>
                        </HStack>
                       <Divider className="my-0.5"/>
                       <HStack space="md" reversed={false} style={{justifyContent: 'space-between',  paddingVertical: 10}}>
                          <View><ZText type={'R14'}>Developed By</ZText></View>
                          <View><ZText type={'R14'}>{data.developerName}</ZText></View>
                        </HStack>
                       <Divider className="my-0.5"/>
                       <HStack space="md" reversed={false} style={{justifyContent: 'space-between',  paddingVertical: 10}}>
                          <View><ZText type={'R14'}>Construction Status</ZText></View>
                          <View><ZText type={'R14'}>{data.constructionStatus}</ZText></View>
                        </HStack>
                       <Divider className="my-0.5"/>
                       <HStack space="md" reversed={false} style={{justifyContent: 'space-between',  paddingVertical: 10}}>
                          <View><ZText type={'R14'}>Bedroom</ZText></View>
                          <View><ZText type={'R14'}>{data.bedroomType}</ZText></View>
                        </HStack>
                       <Divider className="my-0.5"/>
                       <HStack space="md" reversed={false} style={{justifyContent: 'space-between',  paddingVertical: 10}}>
                          <View><ZText type={'R14'}>Balcony</ZText></View>
                          <View><ZText type={'R14'}>{data.balconyType}</ZText></View>
                        </HStack>
                       <Divider className="my-0.5"/>
                       <HStack space="md" reversed={false} style={{justifyContent: 'space-between',  paddingVertical: 10}}>
                          <View><ZText type={'R14'}>Amenities</ZText></View>
                          <View><ZText type={'R14'}>{data.postPropertyAmenities.map((item: PropertyAmenities) => item.propertyAmenity).join(',')}</ZText></View>
                        </HStack>
                       <Divider className="my-0.5"/>
                       <HStack space="md" reversed={false} style={{justifyContent: 'space-between',  paddingVertical: 10}}>
                          <View><ZText type={'R14'}>Property Status</ZText></View>
                          <View><ZText type={'R14'}>{data.propertyStatus}</ZText></View>
                        </HStack>
                       <Divider className="my-0.5"/>
                       <VStack space="md">
                          <View>
                             <ZText type={'R18'}>Nearby Facilities</ZText>
                          </View>
                          <HStack>

                          </HStack>
                       </VStack>
                    </VStack> 
                </View>
              </View>
            )}
            {/* End */}
          </HStack>
        </View>
      </ScrollView>
    </View>
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
    backgroundColor: '#FFF',
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
    //borderRadius: 12,
    backgroundColor: '#FFF', // Equivalent to background: var(--white, #FFF)
    //shadowColor: 'rgba(0, 0, 0, 0.8)', // shadow color
    //shadowOffset: {width: 0, height: 4}, // shadow offset
    //shadowOpacity: 1, // shadow opacity
    //shadowRadius: 64, // blur radius (64px)
    //elevation: 8,
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
    //borderRadius: 12,
    backgroundColor: '#FFF',
    margin: 10,
    paddingBottom: 10,
    //shadowColor: 'rgba(0, 0, 0, 0.8)',
    //shadowOffset: {width: 0, height: 4},
    //shadowOpacity: 1,
    //shadowRadius: 20,
    //elevation: 4,
  },
  carImage: {
    width: 375,
    height: 278,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
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
    // paddingLeft: 20,
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


export default ItemDetailScreen;