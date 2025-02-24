import React, { useState, useRef } from 'react';
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
} from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';

const HEADER_HEIGHT = 120;
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
// Dummy Data Fetch Function
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
const ProductListScreen = ({ category, scrollY }) => {
  const [data, setData] = useState(fetchData(category, 1));
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadMoreData = () => {
    if (!loading) {
      setLoading(true);
      setTimeout(() => {
        setData((prevData) => [...prevData, ...fetchData(category, page + 1)]);
        setPage(page + 1);
        setLoading(false);
      }, 1000);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
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
      ListHeaderComponent={() => (
        <View style={styles.listHeader}>
          <Text style={styles.listHeaderText}>{category} Deals</Text>
        </View>
      )}
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
    //   contentContainerStyle={styles.flatListContent}
    contentContainerStyle={{ paddingBottom: 50, flexGrow: 1 }} // Add bottom padding ✅
    style={{ flex: 1 }} // Ensure FlatList takes full height ✅
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: false }
      )}
      scrollEventThrottle={16}
      onEndReached={loadMoreData}
      onEndReachedThreshold={0.5}
      ListFooterComponent={() => loading && <ActivityIndicator size="large" color="green" />}
    />
  );
};

// Tabs Setup
const routes = [
  { key: 'beauty', title: 'Beauty' },
  { key: 'electronics', title: 'Electronics' },
  { key: 'kids', title: 'Kids' },
  { key: 'gifting', title: 'Gifting' },
  { key: 'premium', title: 'Premium' },
];

// Render Each Tab with Category Parameter
const renderScene = ({ route, jumpTo, scrollY }) => {

  return <View style={styles.container1}>
  <ProductListScreen category={route.title} scrollY={scrollY} /></View>;
};

const StickyHeaderWithTabs = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [index, setIndex] = useState(0);
 
  // Animate Header Disappearance
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [HEADER_HEIGHT, 0], // Header completely disappears
    extrapolate: 'clamp',
  });

  // Move Tabs Up
  const tabTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT], // Moves up exactly as the header disappears
    extrapolate: 'clamp',
  });
 // Dynamic Height for Tab Container (Increases on Scroll)
 const tabContainerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT * 2], // Adjust multiplier for more/less expansion
    outputRange: [screenHeight - HEADER_HEIGHT, screenHeight], // Expands when scrolling down
    extrapolate: 'clamp',
  });

  
  return (
    <View style={styles.container}>
      {/* Animated Header (Completely Removed on Scroll) */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <Text style={styles.appTitle}>Blinkit</Text>
        <TextInput
          placeholder="Search for atta, dal, coke and more"
          style={styles.searchBar}
        />
      </Animated.View>

      {/* Tabs move up as header disappears */}
      
      <Animated.View
       style={[
        styles.tabContainer,
        {
          transform: [{ translateY: tabTranslateY }],
        // height: tabContainerHeight
        },
    
      ]}
      >
        <TabView
          navigationState={{ index, routes }}
          renderScene={(props) => renderScene({ ...props, scrollY })}
          onIndexChange={setIndex}
          initialLayout={{ width: screenWidth }}
          style={{ flex: 1 }} 
          renderTabBar={(props) => (
            <TabBar
              {...props}
              style={styles.tabBar}
              indicatorStyle={styles.indicator}
             
              scrollEnabled
            />
          )}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'green' },
  container1: { flex: 1, backgroundColor: 'black' },
  // Animated Header (Removes on Scroll)
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    elevation: 10,
    overflow: 'hidden',
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

  // Tab Container (Moves Up)
  tabContainer: {
   flex: 1,
   display:'flex',
   flexGrow:1,    
    marginTop: HEADER_HEIGHT,
    backgroundColor: 'white',
    height:'100%'
  },
  tabBar: {
    backgroundColor: 'black',
    elevation: 4,
  },
  indicator: {
    backgroundColor: '#FFD700',
    height: 3,
  },
  label: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // Product List
  flatListContent: {
   paddingHorizontal: 10,
   backgroundColor:'red'
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
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
  addButtonText: { color: 'white', fontWeight: 'bold' },
});

export default StickyHeaderWithTabs;
