/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import {HStack} from '@/components/ui/hstack';
import {VStack} from '@/components/ui/vstack';
import {Box} from '@/components/ui/box';
import {useApiRequest} from '@/src/hooks/useApiRequest';
import {
  fetchDashboardData,
  ListDashboardPostRequest,
} from '@/BrokerAppCore/services/new/dashboardService';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

import ZText from '../../sharedComponents/ZText';
import c1 from '../../assets/images/c1.png';
import {Icon} from '../../../components/ui/icon';
import {Card_check_icon, Heart_icon, Map_pin} from '../../assets/svg';
import {
  imagesBucketcloudfrontPath,
  postsImagesBucketPath,
} from '../../config/constants';
import RectangularCardSkeleton from '../../sharedComponents/Skeleton/RectangularCardSkeleton';
import {colors} from '../../themes';
import ProductSectionSkeleton from '../../sharedComponents/Skeleton/ProductSectionSkeleton';
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
} from '../../../components/ui/alert-dialog';
import {Button} from '../../../components/ui/button';
import {Color} from '../../styles/GlobalStyles';
import {formatNumberToIndianSystem} from '../../utils/helpers';

interface ProductSectionProps {
  heading: string;
  background: string;
  endpoint: string;
  isShowAll: boolean;
  isGuest: boolean;
  request: ListDashboardPostRequest;
}

const ProductSection = (props: ProductSectionProps) => {
  const {data, status, error, execute} = useApiRequest(fetchDashboardData);
  const navigation = useNavigation();
  const [showAlertDialog, setShowAlertDialog] = React.useState(false);
  const handleClose = () => setShowAlertDialog(false);
  const onPressSignUp = () => {
    //  onOpen();
    setShowAlertDialog(false);
    navigation.navigate('Login');
  };
  const callPodcastList = async () => {
    // console.log("props.request");
    // console.log(props.request);
    execute(props.endpoint, props.request);
    // console.log(props.heading, 'data :-', data);

    //console.log('status :-', status);
    //console.log('error :-', error);
  };
  useFocusEffect(
    React.useCallback(() => {
     // console.log(props);
      callPodcastList();
      // Optionally return a cleanup function if needed
      return () => {
        // Cleanup logic, if required
      };
    }, []) // dependencies go here
  );
  // useEffect(() => {
  //   callPodcastList();
  // }, [props]);

  const renderProductItems = ({item, index}) => {
    // console.log(item, 'media');
    const handlePress = () => {
      if (props.isGuest) {
        setShowAlertDialog(true); // Show alert dialog if user is a guest
      } else {
        navigation.navigate('ItemDetailScreen', {
          postId: item.postId,
          postType: item.categoryId == 2 ? 'Car/Post' : 'Post',
        });
      }
    };
    let mediaContent = null;

    if (item.postMedias && item.postMedias.length > 0) {
      const media = item.postMedias[0]; // Assuming the first media is the main one

      if (media.mediaBlobId) {
        // Check if the file is a video (.mp4)
        if (media.mediaBlobId.endsWith('.mp4')) {
          mediaContent = (
            <Image
              source={require('../../assets/images/default-placeholder-image.png')}
              style={styles.carImage}
            />
          );
        } else {
          mediaContent = (
            <Image
              source={{
                uri: `${imagesBucketcloudfrontPath}${media.mediaBlobId}`,
              }}
              style={styles.carImage}
            />
          );
        }
      }
    }

    // Fallback for when there is no media
    if (!mediaContent) {
      mediaContent = (
        <Image
          source={require('../../assets/images/default-placeholder-image.png')}
          style={styles.carImage}
        />
      );
    }
  
    return (
      <View style={styles.cardContainer}>
        {/* <Image
          source={
            item.postMedias[0].mediaBlobId
              ? {
                  uri: `${imagesBucketcloudfrontPath}${item.postMedias[0].mediaBlobId}`,
                }
              : require('../../assets/images/default-placeholder-image.png')
          }
          style={styles.carImage}
        /> */}
        {mediaContent}
        {/* Check and Heart Icons */}
        <View style={styles.iconContainer}>
          <View style={styles.checkIcon}>
            {/* <Icon as={card_check_icon} /> */}
            <Card_check_icon />
          </View>
          {/* <TouchableOpacity style={{}}> */}
          {/* <heart_icon /> */}
          {/* <Heart_icon accessible={true} fontSize={25} />
          </TouchableOpacity> */}
        </View>

        {/* Car Details */}
        <View style={styles.detailsContainer}>
          <TouchableOpacity onPress={handlePress}>
            <ZText type={'R16'} style={styles.price}>
              {'\u20B9'} {formatNumberToIndianSystem(item.price)}
            </ZText>
            <View style={styles.locationContainer}>
              {item.placeName && (
                <>
                  <Icon as={Map_pin} size="xs" />
                  <ZText
                    type={'R14'}
                    numberOfLines={1}
                    style={styles.locationText}>
                    {item.placeName}
                  </ZText>
                </>
              )}
            </View>
            <ZText type={'R14'} numberOfLines={1} style={styles.carBrand}>
              {item.title}
            </ZText>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <>
      {data == null ? (
        <ProductSectionSkeleton
          heading={props.heading}
          isShowAll={props.isShowAll}
        />
      ) : (
        // <></>
        <View
          style={{
            backgroundColor: props.background,
            paddingVertical: 10,
            flex: 1,
          }}>
          <HStack space="md" reversed={false} style={styles.heading}>
            <ZText type={'R18'}>{props.heading}</ZText>
            {props.isShowAll && (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ItemListScreen', {
                    listType:
                      props.heading === 'New In Car' ? 'Car' : 'RealEstate',
                    categoryId: props.heading === 'New In Car' ? 2 : 1,
                  })
                }>
                <ZText type={'R14'} style={styles.link}>
                  See All
                </ZText>
              </TouchableOpacity>
            )}
          </HStack>
          <HStack
            space="md"
            reversed={false}
            style={{
              paddingHorizontal: 10,
              flexDirection: 'row',
              flex: 2,
              justifyContent: 'space-between',
            }}>
            <FlatList
              data={data}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderProductItems}
              contentContainerStyle={{paddingVertical: 20,flexGrow: 1}}
              initialNumToRender={3}
              showsHorizontalScrollIndicator={true}
              horizontal
              ListEmptyComponent={() =>
                data === undefined ? (
                  <ActivityIndicator
                    size="large"
                    color="#0000ff"
                    style={styles.loader}
                  />
                ) : (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No data found </Text>
                  </View>
                )
              }
              // onEndReachedThreshold={0.8}
              // Uncomment the following line if you want to add a separator between items
              // ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </HStack>
          <AlertDialog isOpen={showAlertDialog} onClose={handleClose} size="md">
            <AlertDialogBackdrop />
            <AlertDialogContent>
              <AlertDialogBody className="mt-3 mb-4 ">
                <ZText
                  type="S18"
                  style={{marginBottom: 20, textAlign: 'center'}}>
                  Discover endless premium listing with BrokerApp
                </ZText>
                <ZText
                  type="R16"
                  style={{marginBottom: 20, textAlign: 'center'}}>
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
                  <ZText
                    type="R16"
                    style={{color: 'white', textAlign: 'center'}}>
                    Login
                  </ZText>
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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

    display: 'flex',
  },
  emptyText: {
    fontSize: 16,
    color: '#555', // Use a subtle color to match your design
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
    // shadowRadius: 64, // blur radius (64px)
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
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.5,
    // shadowRadius: 5,
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
    paddingBottom: 10,
    color: 'black',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.light.appred,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#263238',
    marginLeft: 4,
  },
  carBrand: {
    fontSize: 14,
    fontWeight: '500',
    color: '#263238',
    marginTop: 4,
    marginBottom: 4,
  },
});
//export default ProductSection;
export default React.memo(ProductSection);