/* eslint-disable react/no-unstable-nested-components */
import {useSelector} from 'react-redux';
import {
  DashboardItemList,
  fetchItemList,
} from '../../BrokerAppCore/services/new/dashboardService';
import {useApiPagingWithtotalRequest} from '../hooks/useApiPagingWithtotalRequest';
import CustomHeader from '../sharedComponents/CustomHeader';
import {Color} from '../styles/GlobalStyles';
import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
  Animated,
  Dimensions,
  Alert,
  Linking,
  PermissionsAndroid,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import PostActions from '../sharedComponents/PostActions';
import {
  Chat_Icon,
  description_icon,
  Location_Icon,
  MenuThreeDots,
  Telephone_Icon,
} from '../assets/svg';
import {VStack} from '../../components/ui/vstack';
import {HStack} from '../../components/ui/hstack';
import {Box} from '../../components/ui/box';
import ZText from '../sharedComponents/ZText';
import {formatNumberToIndianSystem} from '../utils/helpers';
import {Icon} from '../../components/ui/icon';
import MediaGallery from '../sharedComponents/MediaGallery';
import RecentSearchSectionData from './Dashboard/RecentSearchSectionData';
import ProductSectionData from './Dashboard/ProductSectionData';
import UserStories from '../components/story/UserStories';
import Recommend from '../sharedComponents/RecomendedBrokers';
import NoDataFoundScreen from '../sharedComponents/NoDataFoundScreen';
import ItemHeader from './ItemHeader';
import {colors} from '../themes';
import {getDashboardStory} from '../../BrokerAppCore/services/Story';
const RederListHeader = React.memo(({StoryData}) => {
  return <>{StoryData != null && <UserStories Data={StoryData} />}</>;
});
// TabNavigation component remains the same
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
    return (
      <View style={styles.WrapcardContainer}>
        <View style={styles.cardContainer}>
          <ItemHeader item={item}></ItemHeader>
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
const TabNavigation = ({tabs, activeTab, onTabPress}) => {
  const screenWidth = Dimensions.get('window').width;
  const tabWidth = screenWidth / tabs.length;

  return (
    <View style={styles.tabBar}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.tab,
            {width: tabWidth},
            activeTab === index && styles.activeTab,
          ]}
          onPress={() => onTabPress(index)}>
          <Text
            style={[
              styles.tabText,
              activeTab === index && styles.activeTabText,
            ]}>
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const StickyHeaderWithTabs = () => {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ['Property', 'Car'];
  const navigation = useNavigation();
  const AppLocation = useSelector((state: RootState) => state.AppLocation);
  const [selectedItem, setSelectedItem] = useState(null);
  const headerHeight = 80;
  const tabBarHeight = 50;
  const [StoryData, setStoryData]: any[] = useState(null);
  const [isInfiniteLoading, setInfiniteLoading] = useState(false);
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
  } = useApiPagingWithtotalRequest(DashboardItemList, setInfiniteLoading, 5);
  const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
  const scrollY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const isScrollingDown = useRef(true);
  const headerVisible = useRef(new Animated.Value(1)).current;
  const user = useSelector((state: RootState) => state.user.user);

  const headerTranslateY = headerVisible.interpolate({
    inputRange: [0, 1],
    outputRange: [-headerHeight + 10, 0],
    extrapolate: 'clamp',
  });
  console.log(activeTab, 'jk');
  const reportSheetRef = useRef(null);
  const handlePresentModalPress = useCallback(item => {
    setSelectedItem(item);
    reportSheetRef.current?.open();
  }, []);
  async function callPodcastList() {
    const apiEndpoint =
      activeTab === 0 ? '/Post/DashboardPost' : '/Car/Post/DashboardPost';
    const results = await Promise.allSettled([
      execute(user.userId, apiEndpoint),
      getDashboardStory(user.userId, 1, 5),
    ]);

    const [ListData, DashboardStory] = results.map(result =>
      result.status === 'fulfilled' ? result.value : null,
    );

    setStoryData(DashboardStory.data);
  }
  useEffect(() => {
    headerVisible.setValue(1);
  }, []);
  useEffect(() => {
    callPodcastList();
  }, [activeTab]);

  useEffect(() => {
    callPodcastList();
  }, []);
  const loadMorepage = async () => {
    const apiEndpoint =
      activeTab === 0 ? '/Post/DashboardPost' : '/Car/Post/DashboardPost';
    if (!isInfiniteLoading) {
      await loadMore(user.userId, apiEndpoint);
    }
  };
  const handleScroll = Animated.event(
    [{nativeEvent: {contentOffset: {y: scrollY}}}],
    {
      useNativeDriver: true,
      listener: event => {
        const currentScrollY = event.nativeEvent.contentOffset.y;
        const diff = currentScrollY - lastScrollY.current;

        if (diff > 5) {
          if (!isScrollingDown.current) {
            isScrollingDown.current = true;
            Animated.timing(headerVisible, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }).start();
          }
        } else if (diff < -5) {
          if (isScrollingDown.current) {
            isScrollingDown.current = false;
            Animated.timing(headerVisible, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }).start();
          }
        }
        lastScrollY.current = currentScrollY;
      },
    },
  );
  console.log(data);
  // eslint-disable-next-line react/no-unstable-nested-components
  const renderItem = useCallback(
    ({item}) => (
      <ProductItem
        item={item}
        User={user}
        menuPress={handlePresentModalPress}
        navigation={navigation}
        // OnGoBack={OnGoBack}
      />
    ),
    [data],
  );
  return (
    <>
      <SafeAreaView style={{flex: 0, backgroundColor: Color.primary}} />
      <SafeAreaView style={styles.container}>
        {/* <StatusBar backgroundColor={Color.primary} barStyle="light-content" /> */}

        {/* Combined header and tab container to eliminate gaps */}
        <Animated.View
          style={[
            styles.combinedContainer,
            {transform: [{translateY: headerTranslateY}]},
          ]}>
          {/* Header container */}
          <View style={styles.headerContainer}>
            <CustomHeader />
          </View>

          {/* Tab container directly below with no gap */}
          <View style={styles.tabBarContainer}>
            <TabNavigation
              tabs={tabs}
              activeTab={activeTab}
              onTabPress={setActiveTab}
            />
          </View>
        </Animated.View>

        <AnimatedFlatList
          contentContainerStyle={{paddingTop: headerHeight + tabBarHeight}}
          // data={data}
          renderItem={renderItem}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          // estimatedItemSize={560}
          // extraData={isrest}
          data={data}
          // getItemLayout={560}
          // renderItem={renderHomeItem}
          initialNumToRender={2}
          maxToRenderPerBatch={4}
          // windowSize={4}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={<RederListHeader StoryData={StoryData} />}
          keyExtractor={(item, index) => index.toString()}
          onEndReachedThreshold={0.6}
          onEndReached={loadMorepage}
          // contentContainerStyle={{paddingBottom: 100}}
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
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  // Combined container for header and tab to eliminate gap
  combinedContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  headerContainer: {
    // No absolute positioning here to allow natural flow
    zIndex: 1000,
  },
  tabBarContainer: {
    // No top margin or positioning - will naturally flow after header
    zIndex: 999,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tabBar: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    justifyContent: 'space-between',
  },
  tab: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: Color.primary,
  },
  tabText: {
    color: Color.primary,
    fontSize: 14,
    textAlign: 'center',
  },
  activeTabText: {
    fontWeight: 'bold',
  },
  itemContainer: {
    height: 70,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 16,
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
    color: '#2c3e50',
  },
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

export default StickyHeaderWithTabs;
