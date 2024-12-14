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
import {RecentSearchSData} from '../../../BrokerAppCore/services/new/dashboardService';
import useUserJourneyTracker from '../../hooks/Analytics/useUserJourneyTracker';
import { useApiRequestData } from '../../hooks/useApiRequestData';

interface BrandSectionProps {
  heading: string;
  background: string;
  endpoint: string;
  isShowAll: boolean;
  request: ListDashboardPostRequest;
  Data:any
}

const RecentSearchSectionData = (props: BrandSectionProps) => {
  const {data, status, error, execute,setData} = useApiRequestData(RecentSearchSData,props.Data);
  const navigation = useNavigation();
  const {logButtonClick} = useUserJourneyTracker(`Recent Search`);
  const callBrandList = async () => {
  
    if(props.Data!=null)
      {
       
        setData(props.Data)
      }
    //  execute(props.endpoint, props.request);
  };
  useEffect(() => {}, [data]);
  // useEffect(() => {
  //   callBrandList();
  // }, [props]);
  useFocusEffect(
    React.useCallback(() => {
      callBrandList();

      // Cleanup logic, if needed
      return () => {
        // Cleanup code here, if necessary
      };
    }, []), // Add dependencies here
  );
  const renderProductItems = ({item, index}) => {
    if (!item || !item.requestJson || !item.frontendFilters) {
      // console.warn('Invalid item structure:', item);
      return null; // Return null if item structure is invalid
    }
    //   console.log("renderProductItems")
    // console.log(item)
    let parsedItem;
    let frontendFilters;

    try {
      parsedItem = JSON.parse(item.requestJson);
      frontendFilters = JSON.parse(item.frontendFilters);

      //  console.log(parsedItem);
      //  console.log(frontendFilters);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return null; // Return null if JSON parsing fails
    }

    const callFilterListScreen = async () => {
      if (!parsedItem) {
        console.warn('Parsed item is invalid');
        return;
      }

      let obj = {
        ...parsedItem,
        frontendFilters: item.frontendFilters || [],
        isSearch: false,
      };

      let listTypeData = 'RealEstate';

      if (item.categoryId === 2) {
        listTypeData = 'Car';
      }

      navigation.navigate('ItemFilterListScreen', {
        listType: listTypeData,
        categoryId: item.categoryId,
        Filters: frontendFilters || [],
        listApiobj: obj,
        searchText: parsedItem.keyWord || '',
      });
    };

    return (
      <View style={styles.cardContainer}>
        <TouchableOpacity onPress={callFilterListScreen}>
          <View style={styles.detailsContainer}>
            <ZText type={'R16'} numberOfLines={1}>
              {parsedItem?.keyWord || 'N/A'}
            </ZText>
            <ZText type={'R14'} numberOfLines={1} style={styles.carBrand}>
              {parsedItem?.cityName || 'N/A'}
            </ZText>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      {/* { data!= null && data.length > 0 && */}
      <View
        style={{
          backgroundColor: props.background,
          paddingVertical: 10,
          flex: 1,
        }}>
        <HStack space="md" reversed={false} style={styles.heading}>
          <ZText type={'R18'}>{props.heading}</ZText>
          <ZText type={'R14'} style={styles.link} />
        </HStack>
        <HStack space="md" reversed={false} style={{paddingHorizontal: 10}}>
          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderProductItems}
            initialNumToRender={3}
            showsHorizontalScrollIndicator={false}
            horizontal
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
      </View>
      {/* } */}
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
    borderRadius: 12,
    backgroundColor: '#FFF',
    margin: 10,
    paddingBottom: 10,
    shadowColor: 'rgba(0, 0, 0, 0.8)',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.5,
    // shadowRadius: 20,
    elevation: 4,
    width: 120,
    height: 109,
    alignContent: 'center',
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
    alignContent: 'center',
    height: '100%',
    // backgroundColor:'red',
    display: 'flex',
    justifyContent: 'center',
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
    color: '#000',
    marginTop: 15,
  },
});
export default RecentSearchSectionData;
