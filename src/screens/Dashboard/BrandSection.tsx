import React, {useEffect} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
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
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
} from '../../../components/ui/alert-dialog';
import {Button} from '../../../components/ui/button';
import {Color} from '../../styles/GlobalStyles';

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
  const navigation = useNavigation();
  const [showAlertDialog, setShowAlertDialog] = React.useState(false);
  const handleClose = () => setShowAlertDialog(false);
  const onPressSignUp = () => {
    //  onOpen();
    setShowAlertDialog(false);
    navigation.navigate('Login');
  };
  const callBrandList = async () => {
    await execute(props.endpoint, props.request);
    // console.log(props.heading, 'data :-', data);
  };

  useEffect(() => {
    callBrandList();
  }, [props]);

  const renderProductItems = ({item, index}) => {
    // console.log('item =====>', item);
    const handlePress = () => {
      if (props.isGuest) {
        setShowAlertDialog(true); // Show alert dialog if user is a guest
      } else {
        navigation.navigate('ItemListScreen', {
          listType: item.hasOwnProperty('fuelType') ? 'Car' : 'RealEstate',
          categoryId: item.hasOwnProperty('fuelType') ? 2 : 1,
          brandName: item.searchText ?? '',
        });
      }
    };
    return (
      <View style={styles.cardContainer}>
        <TouchableOpacity onPress={handlePress}>
          <Image
            source={{
              uri: `${imagesBucketcloudfrontPath}${item.postMedias[0].mediaBlobId}`,
            }}
            style={styles.carImage}
          />
          <View style={styles.detailsContainer}>
            <ZText type={'R14'} numberOfLines={1} style={styles.carBrand}>
              {item.title}
            </ZText>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

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
          onEndReachedThreshold={0.8}
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
              your trusted partner for properties, cars, and loans. Join us and
              turn your dreams into reality!
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
    shadowColor: 'rgba(0, 0, 0, 0.8)',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 1,
    shadowRadius: 20,
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
  },
});
export default BrandSection;
