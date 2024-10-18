import React, {useEffect} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,Text
} from 'react-native';
import {HStack} from '@/components/ui/hstack';
import {VStack} from '@/components/ui/vstack';
import {Box} from '@/components/ui/box';
import {useApiRequest} from '@/src/hooks/useApiRequest';
import {
  fetchDashboardData,
  ListDashboardPostRequest,
} from '@/BrokerAppCore/services/new/dashboardService';
import {useNavigation} from '@react-navigation/native';

import ZText from '../../sharedComponents/ZText';
import c1 from '../../assets/images/c1.png';
import {Icon} from '../../../components/ui/icon';
import {Card_check_icon, Heart_icon, Map_pin} from '../../assets/svg';
import {
  imagesBucketcloudfrontPath,
  postsImagesBucketPath,
} from '../../config/constants';
import RectangularCardSkeleton from '../../sharedComponents/Skeleton/RectangularCardSkeleton';

interface ProductSectionProps {
  heading: string;
  background: string;
  endpoint: string;
  isShowAll: boolean;
  request: ListDashboardPostRequest;
}

const ProductSection = (props: ProductSectionProps) => {
  const {data, status, error, execute} = useApiRequest(fetchDashboardData);
  const navigation = useNavigation();

  const callPodcastList = async () => {
    // console.log("props.request");
    // console.log(props.request);
   execute(props.endpoint, props.request);
    //console.log(props.heading, 'data :-', data);

    //console.log('status :-', status);
    //console.log('error :-', error);
  };

  useEffect(() => {
    callPodcastList();
  }, [props]);

  const renderProductItems = ({item, index}) => {
    // console.log(item.postMedias[0].mediaBlobId, 'media');
    return (
      <View style={styles.cardContainer}>
        <Image
          source={{
            uri: `${imagesBucketcloudfrontPath}${item.postMedias[0].mediaBlobId}`,
          }}
          style={styles.carImage}
        />

        {/* Check and Heart Icons */}
        <View style={styles.iconContainer}>
          <View style={styles.checkIcon}>
            {/* <Icon as={card_check_icon} /> */}
            <Card_check_icon />
          </View>
          <TouchableOpacity style={{}}>
            {/* <heart_icon /> */}
            <Heart_icon accessible={true} fontSize={25} />
          </TouchableOpacity>
        </View>

        {/* Car Details */}
        <View style={styles.detailsContainer}>
          
        <TouchableOpacity onPress={() => navigation.navigate('ItemDetailScreen', {postId: item.postId, postType: item.hasOwnProperty('fuelType') ? 'Car/Post' : 'Post'})}>
          <ZText type={'R16'} style={styles.price}>
          {'\u20B9'} {item.price}
          </ZText>
          <View style={styles.locationContainer}>
            {item.city && (
              <>
                <Icon as={Map_pin} />
                <ZText type={'R16'} style={styles.locationText}>
                  {item.city}
                </ZText>
              </>
            )}
          </View>
          <ZText type={'R16'} style={styles.carBrand}>
            {item.title}
          </ZText>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  

  
  return (
    <>
    {(data == null) ? (
      <RectangularCardSkeleton type='NewIN' />
    ) : (
      <View style={{ backgroundColor: props.background, paddingVertical: 10,flex: 1, }}>
        <HStack space="md" reversed={false} style={styles.heading}>
          <ZText type={'R18'}>{props.heading}</ZText>
          {props.isShowAll && (
            <TouchableOpacity
              onPress={() => navigation.navigate('ItemListScreen', {
                listType: props.heading === 'New In Car' ? 'Car' : 'RealEstate',
                categoryId:props.heading === 'New In Car' ? 2 : 1
              })}
            >
              <ZText type={'R14'} style={styles.link}>See All</ZText>
            </TouchableOpacity>
          )}
        </HStack>
        <HStack space="md" reversed={false} style={{ paddingHorizontal: 10, flexDirection: 'row',
    flex: 2,
    justifyContent: 'space-between',}}>
          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderProductItems}
            contentContainerStyle={{ paddingVertical: 20 }}
            initialNumToRender={3}
            showsHorizontalScrollIndicator={true}
            horizontal
            ListEmptyComponent={() => (
              data === undefined ? (
                <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No Data Found </Text>
                </View>
              )
            )}
           // onEndReachedThreshold={0.8}
            // Uncomment the following line if you want to add a separator between items
            // ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </HStack>
      </View>
    )}
    </>
  );
};
const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    width: '100%',

    display:'flex',
  },
  emptyText: {
    fontSize: 16,
    color: '#555',  // Use a subtle color to match your design
    textAlign: 'center',
  },
  loader: {
    marginVertical: 20,
  },
  footerContainer: {
    backgroundColor: '#FFF',
  },
  heading: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    // marginBottom: 10,
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
    width: 132,
    height: 213,
    borderRadius: 12,
    backgroundColor: '#FFF', // Equivalent to background: var(--white, #FFF)
    // shadowColor: 'rgba(0, 0, 0, 0.8)', // shadow color
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
    width: 5, // Space between cards
  },
  tagImage: {
    width: 132,
    height: 113,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardContainer: {
    width: 132,
    borderRadius: 12,
    backgroundColor: '#FFF',
    // marginRight: 10,
    marginLeft: 10,
    // paddingBottom: 10,
    // shadowColor: 'rgba(0, 0, 0, 0.8)',
    // shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 4,
  },
  carImage: {
    width: 132,
    height: 100,
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
    paddingHorizontal: 10,
    paddingTop: 10,
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
    marginBottom: 4,
  },
});
export default ProductSection;
