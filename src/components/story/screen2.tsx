import React from 'react';
import {View, Image, StyleSheet, FlatList, Text} from 'react-native';

const items = [
  {id: '1', name: 'Item 1'},
  {id: '2', name: 'Item 2'},
  {id: '3', name: 'Item 3'},
  {id: '4', name: 'Item 4'},
  {id: '5', name: 'Item 5'},
  {id: '6', name: 'Item 6'},
];

const Screen2 = () => {
  const renderItem = ({item}) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Shrunk Image */}
      <Image
        source={{
          uri: 'https://gratisography.com/wp-content/uploads/2024/01/gratisography-cyber-kitty-800x525.jpg',
        }}
        style={styles.shrunkImage}
      />

      {/* List of Items below the image */}
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
  },
  shrunkImage: {
    width: 100,
    height: 100, // Shrunk image size
    resizeMode: 'cover',
  },
  listContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  itemContainer: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  itemText: {
    fontSize: 18,
  },
});

export default Screen2;
