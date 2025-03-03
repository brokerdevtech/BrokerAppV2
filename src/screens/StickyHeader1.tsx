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
} from 'react-native';
import {TabView, TabBar} from 'react-native-tab-view';

const HEADER_HEIGHT = 60;
const TAB_BAR_HEIGHT = 48; // Approximate height of TabBar
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const fetchData = (category, page) => {
  return new Array(10).fill(null).map((_, index) => ({
    id: page * 10 + index + 1,
    name: `${category} Product ${page * 10 + index + 1}`,
    price: `₹${(index + 1) * 50}`,
    time: `${10 + (index % 5)} MINS`,
    image: 'https://via.placeholder.com/100',
  }));
};

// Single Tab Screen with Load More and Header
const ProductListScreen = ({category, scrollY, onScroll, listRef}) => {
  const [data, setData] = useState(fetchData(category, 1));
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadMoreData = () => {
    if (!loading) {
      setLoading(true);
      setTimeout(() => {
        setData(prevData => [...prevData, ...fetchData(category, page + 1)]);
        setPage(page + 1);
        setLoading(false);
      }, 1000);
    }
  };

  const renderItem = ({item}) => (
    <View style={styles.productCard}>
      <Image source={{uri: item.image}} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productTime}>{item.time}</Text>
        <Text style={styles.productPrice}>{item.price}</Text>
      </View>
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>ADD</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Animated.FlatList
      ref={listRef}
      ListHeaderComponent={() => (
        <View style={styles.listHeader}>
          <Text style={styles.listHeaderText}>{category} Deals</Text>
        </View>
      )}
      data={data}
      keyExtractor={item => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={{
        paddingTop: HEADER_HEIGHT + TAB_BAR_HEIGHT,
        paddingBottom: 50,
      }}
      style={{flex: 1}}
      onScroll={onScroll}
      scrollEventThrottle={16}
      onEndReached={loadMoreData}
      onEndReachedThreshold={0.5}
      ListFooterComponent={() =>
        loading && <ActivityIndicator size="large" color="green" />
      }
    />
  );
};

// Tabs Setup
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

  // Create refs for each tab's FlatList
  const listRefs = useRef({});
  routes.forEach(route => {
    listRefs.current[route.key] = React.createRef();
  });

  // Header translation on scroll (show/hide based on scroll direction)
  const headerTranslateY = headerVisible.interpolate({
    inputRange: [0, 1],
    outputRange: [-HEADER_HEIGHT, 0],
    extrapolate: 'clamp',
  });

  // TabBar translation based on header visibility
  const tabBarTranslateY = headerVisible.interpolate({
    inputRange: [0, 1],
    outputRange: [0, HEADER_HEIGHT],
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
        if (diff > 3) {
          // Scrolling down
          if (!isScrollingDown.current) {
            isScrollingDown.current = true;
            Animated.timing(headerVisible, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }).start();
          }
        } else if (diff < -3) {
          // Scrolling up
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

  // Handle tab change
  const handleIndexChange = newIndex => {
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

    // Reset the scroll tracking variables
    lastScrollY.current = 0;
    scrollY.setValue(0);
    isScrollingDown.current = false;

    setIndex(newIndex);
  };

  // Render Scene with scroll handler
  const renderScene = useCallback(
    ({route}) => {
      return (
        <View style={styles.tabContent}>
          <ProductListScreen
            category={route.title}
            scrollY={scrollY}
            onScroll={handleScroll}
            listRef={listRefs.current[route.key]}
          />
        </View>
      );
    },
    [scrollY, handleScroll],
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        {/* TabView with animated TabBar */}
        <TabView
          navigationState={{index, routes}}
          renderScene={renderScene}
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
                indicatorStyle={styles.indicator}
                renderLabel={({route, focused}) => (
                  <Text
                    style={{
                      color: focused ? 'blue' : 'gray',
                      fontSize: 14,
                      fontWeight: 'bold',
                    }}>
                    {route.title}
                  </Text>
                )}
              />
            </Animated.View>
          )}
        />
      </View>

      {/* Animated Header - slides up/down based on scroll direction */}
      <Animated.View
        style={[styles.header, {transform: [{translateY: headerTranslateY}]}]}>
        <CustomHeader />
      </Animated.View>
    </SafeAreaView>
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
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    elevation: 4,
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
    // backgroundColor: 'white',
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
});

export default StickyHeaderWithTabs1;
