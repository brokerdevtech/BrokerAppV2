import React, {useEffect, useState} from 'react';
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
import {useApiRequest} from '../../../src/hooks/useApiRequest';
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
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
} from '../../../components/ui/alert-dialog';
import {Button} from '../../../components/ui/button';
import {Color} from '../../styles/GlobalStyles';
import {useSelector} from 'react-redux';
import {RootState} from '../../../BrokerAppCore/redux/store/reducers';
import useUserJourneyTracker from '../../hooks/Analytics/useUserJourneyTracker';

interface BrandSectionProps {
  heading: string;
  background: string;
  endpoint: string;
  isShowAll: boolean;
  isGuest: boolean;
  request: ListDashboardPostRequest;
}

const BrandSection = (props: BrandSectionProps) => {
  const {data, status, error, execute} = useApiRequest(fetchDashboardData);
  const AppLocation = useSelector((state: RootState) => state.AppLocation);
  const user = useSelector((state: RootState) => state.user.user);
  const navigation = useNavigation();
  const {logButtonClick} = useUserJourneyTracker(`Brand Assosiated`);
  const [showAlertDialog, setShowAlertDialog] = React.useState(false);
  const handleClose = () => setShowAlertDialog(false);
  const [brandData, setBrandData] = useState(null);
  const onPressSignUp = () => {
    //  onOpen();
    setShowAlertDialog(false);
    navigation.navigate('Login');
  };
  const callBrandList = async () => {
    await execute(props.endpoint, props.request);
    // console.log(props.heading, 'data :-', data);
  };
  // console.log(data);
  // useEffect(() => {
  //   callBrandList();
  // }, []);
  useFocusEffect(
    React.useCallback(() => {
      // console.log(props);
      callBrandList();
      // Optionally return a cleanup function if needed
      return () => {
        // Cleanup logic, if required
      };
    }, []), // dependencies go here
  );
  useEffect(() => {
    if (status == 200) {
      // setBrandData()
    }
  }, [status]);
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
  // console.log(status);
  const renderProductItems = ({item, index}) => {
    //  console.log('item =====>', item);
    const handlePress = () => {
      if (props.isGuest) {
        setShowAlertDialog(true); // Show alert dialog if user is a guest
      } else {
        let obj: any = {
          keyWord: '',
          cityName: AppLocation.City,
          userId: user.userId,
          placeID: AppLocation.placeID,
          placeName: AppLocation.placeName,
          geoLocationLatitude: AppLocation.geoLocationLatitude,
          geoLocationLongitude: AppLocation.geoLocationLongitude,
          isSearch: false,
        };

        let BraandPopUPFilter = null;
        if (item.filters) {
          obj.filters = item.filters;

          BraandPopUPFilter = convertTagsToNewFormat(item.filters.tags);
        }

        //   console.log(obj);

        const locationData = [
          {
            place: {
              ...AppLocation,
            },
          },
        ];

        if (item.categoryId == 2) {
          // Uncomment if you need to set additional selected filters
          let updatedPopUPFilter = {
            Location: locationData,
            Budget: {minValue: 20000, maxValue: 500000000, isDefault: true},
          };
          if (BraandPopUPFilter != null) {
            updatedPopUPFilter = {...updatedPopUPFilter, ...BraandPopUPFilter};
          }
          //  console.log(updatedPopUPFilter);

          navigation.navigate('ItemFilterListScreen', {
            listType: 'Car',
            categoryId: item.categoryId,
            Filters: updatedPopUPFilter,
            listApiobj: obj,
            searchText: '',
          });

          //   setPopUPFilter(updatedPopUPFilter);
        }

        if (item.categoryId == 1) {
          // Uncomment if you need to set additional selected filters
          let updatedPopUPFilter = {
            Location: locationData,
            Budget: {minValue: 20000, maxValue: 500000000, isDefault: true},
            Area: {minValue: 0, maxValue: 5000, isDefault: true},
          };
          if (BraandPopUPFilter != null) {
            updatedPopUPFilter = {...updatedPopUPFilter, ...BraandPopUPFilter};
          }
          //    console.log(updatedPopUPFilter);

          navigation.navigate('ItemFilterListScreen', {
            listType: 'RealEstate',
            categoryId: item.categoryId,
            Filters: updatedPopUPFilter,
            listApiobj: obj,
            searchText: '',
          });
          // setPopUPFilter(updatedPopUPFilter);
        }

        // navigation.navigate('ItemListScreen', {
        //   listType:item.categoryId==2 ? 'Car' : 'RealEstate',
        //   categoryId: item.categoryId,
        //   brandfilters:item.filters
        // });
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
        <TouchableOpacity onPress={handlePress}>
          {/* <Image
            source={{
              uri: `${imagesBucketcloudfrontPath}${item.postMedias[0].mediaBlobId}`,
            }}
            style={styles.carImage}
          /> */}
          {mediaContent}
          <View style={styles.detailsContainer}>
            <ZText type={'R14'} numberOfLines={1} style={styles.carBrand}>
              {item.searchText}
            </ZText>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  // console.log(data, 'jj');
  return (
    <View style={{backgroundColor: props.background, paddingVertical: 2}}>
      <HStack space="md" reversed={false} style={styles.heading}>
        <ZText type={'R18'}>{props.heading}</ZText>
        <ZText type={'R14'} style={styles.link} />
      </HStack>
      <HStack space="md" reversed={false} style={{paddingHorizontal: 10}}>
        <FlatList
          data={data}
          keyExtractor={item => item.postId.toString()}
          renderItem={renderProductItems}
          initialNumToRender={3}
          showsHorizontalScrollIndicator={false}
          horizontal
          contentContainerStyle={{flexGrow: 1}}
          onEndReachedThreshold={0.8}
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
          // ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </HStack>
      <AlertDialog isOpen={showAlertDialog} onClose={handleClose} size="md">
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogBody className="mt-3 mb-4 ">
            <ZText type="S18" style={{marginBottom: 20, textAlign: 'center'}}>
              Discover endless premium listing with BrokerApp
            </ZText>
            <ZText type="R16" style={{marginBottom: 20, textAlign: 'center'}}>
              your trusted partner for properties and cars.Join us and turn your
              dreams into reality!
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
    </View>
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
    marginBottom: 10,
    paddingHorizontal: 20,
    marginTop: 10,
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
    width: 132,
    height: 113,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardContainer: {
    width: 132,
    borderRadius: 12,
    backgroundColor: '#FFF',
    margin: 10,
    paddingBottom: 10,
    shadowOffset: {width: 0, height: 4}, // shadow offset
    shadowOpacity: 0.5, // shadow opacity
    // shadowRadius: 5, // blur radius (64px)
    elevation: 5,
  },
  carImage: {
    width: 132,
    height: 130,
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
  },
});
export default BrandSection;
