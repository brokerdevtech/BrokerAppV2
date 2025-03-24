/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import CustomHeader from '../sharedComponents/CustomHeader';
import {Color} from '../styles/GlobalStyles';
import React, {useState, useRef, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Animated,
  FlatList,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  Linking,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import {TabView, TabBar} from 'react-native-tab-view';
import {useSelector} from 'react-redux';
import {useApiPagingWithtotalRequest} from '../hooks/useApiPagingWithtotalRequest';
import {DashboardItemList} from '../../BrokerAppCore/services/new/dashboardService';

import ItemHeader from './ItemHeader';
import MediaGallery from '../sharedComponents/MediaGallery';
import {VStack} from '../../components/ui/vstack';
import {HStack} from '../../components/ui/hstack';
import {Box} from '../../components/ui/box';
import ZText from '../sharedComponents/ZText';
import {formatNumberToIndianSystem} from '../utils/helpers';
import {colors} from '../themes';
import {Icon} from '../../components/ui/icon';
import {getDashboardStory} from '../../BrokerAppCore/services/Story';
import {
  Chat_Icon,
  description_icon,
  Location_Icon,
  MenuThreeDots,
  Telephone_Icon,
} from '../assets/svg';
import PostActions from '../sharedComponents/PostActions';
import UserStories from '../components/story/UserStories';
import ReportScreen from '../sharedComponents/ReportScreen';
import {FlashList} from '@shopify/flash-list';
import isEqual from 'lodash/isEqual';
const HEADER_HEIGHT = 60;
const TAB_BAR_HEIGHT = 48; // Approximate height of TabBar
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const RederListHeader = React.memo(({StoryData}) => {
  return <>{StoryData != null && <UserStories Data={StoryData} />}</>;
});
// TabNavigation component remains the same
const ProductItem = ({
  item,
  listTypeData,
  User,
  menuPress,
  navigation,
  OnGoBack,
}) => {
  console.log('ProductItem', item);
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

        <View style={styles.iconContainer}>
          <TouchableOpacity
            onPress={() => menuPress(item)}
            style={styles.checkIcon}>
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
};

//   (prevProps, nextProps) => {
//     // Perform shallow comparison on key props
//     return (
//       isEqual(prevProps.item, nextProps.item) &&
//       prevProps.listTypeData === nextProps.listTypeData &&
//       prevProps.User === nextProps.User

//     );
//   },
// );

const ProductListScreen = ({
  category,
  scrollY,
  loadMorepage,
  onScroll,
  listRef,
  handlePresentModalPress,
  navigation,
  data,
  StoryData,
  loading,
  user,
  headerVisible,
}) => {
  console.log('ProductListScreen', category);
  const animatedPaddingTop = headerVisible.interpolate({
    inputRange: [0, 1],

    outputRange: [TAB_BAR_HEIGHT + 70, HEADER_HEIGHT + TAB_BAR_HEIGHT],
    extrapolate: 'clamp',
  });
  const renderItem = useCallback(
    ({item}) => (
      <ProductItem
        item={item}
        User={user}
        listTypeData={category === 'Property' ? 'RealEstate' : 'Car'}
        menuPress={handlePresentModalPress}
        navigation={navigation}
        OnGoBack={OnGoBack}
      />
    ),
    [user, category, handlePresentModalPress, navigation],
  );

  return (
    <FlashList
      ref={listRef}
      data={data}
      estimatedItemSize={560} // Adjust based on actual item height
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
      onScroll={onScroll}
      scrollEventThrottle={16}
      onEndReached={loadMorepage}
      onEndReachedThreshold={0.5}
      contentContainerStyle={{
        paddingTop: HEADER_HEIGHT + TAB_BAR_HEIGHT,
        paddingBottom: 50,
      }}
      ListFooterComponent={() =>
        loading && <ActivityIndicator size="large" color={Color.primary} />
      }
    />
  );
};

const routes = [
  {key: 1, title: 'Property'},
  {key: 2, title: 'Car'},
];

const StickyHeaderWithTabs1 = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [index, setIndex] = useState(0);
  const lastScrollY = useRef(0);
  const isScrollingDown = useRef(false);
  const headerVisible = useRef(new Animated.Value(1)).current;
  const navigation = useNavigation();
  const reportSheetRef = useRef(null);

  const AppLocation = useSelector((state: RootState) => state.AppLocation);
  const [selectedItem, setSelectedItem] = useState(null);
  const user = useSelector((state: RootState) => state.user.user);
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
    hasMore,
    totalPages,
    recordCount,
    setData_Set,
  } = useApiPagingWithtotalRequest(DashboardItemList, setInfiniteLoading, 5);
  const handlePresentModalPress = useCallback(item => {
    console.log(item, 'modela');
    setSelectedItem(item);
    reportSheetRef.current?.open();
  }, []);
  const closeModalReport = useCallback(() => {
    setSelectedItem(null);
  }, []);
  async function callPodcastList() {
    setData_Set([]);
    // setStoryData(null);
    const apiEndpoint =
      index === 0 ? '/Post/DashboardPost' : '/Car/Post/DashboardPost';
    const results = await Promise.allSettled([
      execute(user.userId, apiEndpoint),
      getDashboardStory(user.userId, 1, 5),
    ]);

    const [ListData, DashboardStory] = results.map(result =>
      result.status === 'fulfilled' ? result.value : null,
    );

    setStoryData(DashboardStory.data);
  }
  useFocusEffect(
    useCallback(() => {
      callPodcastList();
    }, [index]),
  );
  // useEffect(() => {
  //   console.log('activeTab');
  //   callPodcastList();
  // }, [index]);

  const loadMorepage = async () => {
    // if (isInfiniteLoading || !hasMore) return;
    // if (isInfiniteLoading || !hasMore) return;
    const apiEndpoint =
      index === 0 ? '/Post/DashboardPost' : '/Car/Post/DashboardPost';
    // if (!isInfiniteLoading) {
    await loadMore(user.userId, apiEndpoint);
    // }
  };
  // Create refs for each tab's FlatList
  const listRefs = useRef({});
  routes.forEach(route => {
    listRefs.current[route.key] = React.createRef();
  });

  // Header translation on scroll (show/hide based on scroll direction)
  const headerTranslateY = headerVisible.interpolate({
    inputRange: [0, 1],
    outputRange:
      Platform.OS === 'ios' ? [-HEADER_HEIGHT - 70, 0] : [-HEADER_HEIGHT, 0],
    extrapolate: 'clamp',
  });

  // TabBar translation based on header visibility
  const tabBarTranslateY = headerVisible.interpolate({
    inputRange: [0, 1],
    outputRange: [
      0,
      Platform.OS === 'ios' ? HEADER_HEIGHT - 30 : HEADER_HEIGHT,
    ],
    extrapolate: 'clamp',
  });

  const handleScroll = Animated.event(
    [{nativeEvent: {contentOffset: {y: scrollY}}}],
    {
      useNativeDriver: true,
      listener: event => {
        const currentScrollY = event.nativeEvent.contentOffset.y;
        const diff = currentScrollY - lastScrollY.current;

        // Determine if scrolling up or down
        if (diff > 5) {
          // Scrolling down more significantly
          if (!isScrollingDown.current) {
            isScrollingDown.current = true;
            Animated.timing(headerVisible, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }).start();
          }
        } else if (diff < -5) {
          // Scrolling up more significantly
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
  const handleScroll1 = event => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    scrollY.setValue(currentScrollY); // update animation manually

    const diff = currentScrollY - lastScrollY.current;

    if (diff > 5 && !isScrollingDown.current) {
      isScrollingDown.current = true;
      Animated.timing(headerVisible, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else if (diff < -5 && isScrollingDown.current) {
      isScrollingDown.current = false;
      Animated.timing(headerVisible, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }

    lastScrollY.current = currentScrollY;
  };
  // Handle tab change
  const handleIndexChange = newIndex => {
    setData_Set([]);
    // Reset header visibility when changing tabs
    Animated.timing(headerVisible, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();

    // Reset scroll position for the new tab
    if (listRefs.current[routes[newIndex].key]?.current) {
      listRefs.current[routes[newIndex].key].current.scrollToOffset({
        offset: 0,
        animated: false,
      });
    }

    lastScrollY.current = 0;
    scrollY.setValue(0);
    isScrollingDown.current = false;

    setIndex(newIndex);
  };

  const renderScene = useCallback(
    ({route}) => {
      return (
        <View style={styles.tabContent}>
          <ProductListScreen
            category={route.title}
            scrollY={scrollY}
            data={data}
            loadMorepage={loadMorepage}
            onScroll={handleScroll1}
            navigation={navigation}
            listRef={listRefs.current[route.key]}
            handlePresentModalPress={handlePresentModalPress}
            StoryData={StoryData}
            loading={isInfiniteLoading}
            user={user}
            headerVisible={headerVisible}
          />
        </View>
      );
    },
    [scrollY, handleScroll],
  );

  // Replace the current SafeAreaView implementation with this approach
  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.header, {transform: [{translateY: headerTranslateY}]}]}>
        <CustomHeader />
      </Animated.View>

      {/* <SafeAreaView style={styles.contentContainer}> */}
      <View
        style={[
          styles.contentContainer,
          {paddingTop: Platform.OS == 'ios' ? HEADER_HEIGHT : 0},
        ]}>
        {/* TabView with animated TabBar */}
        <TabView
          navigationState={{index, routes}}
          renderScene={renderScene}
          swipeEnabled={false}
          onIndexChange={handleIndexChange}
          initialLayout={{width: screenWidth}}
          renderTabBar={props => (
            <Animated.View
              style={[
                styles.tabBarContainer,
                {transform: [{translateY: tabBarTranslateY}]},
              ]}>
              <TabBar
                {...props}
                style={styles.tabBar}
                indicatorStyle={{
                  backgroundColor: '#C20707',
                  height: 3,
                }}
                renderLabel={({route, focused}) => (
                  <Text
                    style={{
                      color: focused ? '#C20707' : '#000000',
                      fontSize: 16,
                      fontWeight: focused ? 'bold' : 'normal',
                    }}>
                    {route.title}
                  </Text>
                )}
                activeColor="#C20707"
                inactiveColor="#000000"
                pressColor="rgba(194, 7, 7, 0.1)"
              />
            </Animated.View>
          )}
        />
      </View>
      {/* </SafeAreaView> */}
      <ReportScreen
        ref={reportSheetRef}
        postItem={selectedItem}
        screenFrom={'List'}
        onClose={closeModalReport}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
  },
  // Header that will slide up/down based on scroll direction
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    // backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    elevation: 4,
    marginTop: Platform.OS === 'ios' ? 20 : 0,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  searchBar: {
    backgroundColor: 'white',
    width: '90%',
    padding: 10,
    borderRadius: 8,
    fontSize: 14,
  },
  // TabBar container that will move with header
  tabBarContainer: {
    position: 'absolute',
    justifyContent: 'space-between',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    elevation: 3,
  },
  tabBar: {
    backgroundColor: 'white',
    height: TAB_BAR_HEIGHT,
  },
  tabContent: {
    flex: 1,
  },
  indicator: {
    backgroundColor: Color.primary,
    height: 3,
  },
  // Product List
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 4},
    elevation: 2,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  productTime: {
    fontSize: 12,
    color: 'gray',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
  listHeader: {
    padding: 10,
    backgroundColor: '#eee',
  },
  listHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: 'green',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 6,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  tabLabel: {
    color: Color.primary,
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  //   itemContainer: {
  //     height: 70,
  //     backgroundColor: 'white',
  //     margin: 10,
  //     borderRadius: 8,
  //     justifyContent: 'center',
  //     paddingHorizontal: 16,
  //     elevation: 2,
  //   },
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
  //   header: {
  //     justifyContent: 'space-between',

  //     flexDirection: 'row',
  //     paddingHorizontal: 20,
  //     paddingVertical: 20,
  //   },
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

export default StickyHeaderWithTabs1;
