import {Color} from '../../styles/GlobalStyles';
import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';

const SelectableFlatList = ({
  data,
  numColumn,
  onSelectItem,
  preselectedItem,
  emptyessage = 'Please select a brand first',
}) => {
  const [selectedItem, setSelectedItem] = useState(null);
  console.log(data, 'de');
  useEffect(() => {
    if (preselectedItem) {
      setSelectedItem(preselectedItem);
    } else {
      setSelectedItem(null);
    }
  }, [preselectedItem]);
  const handleItemPress = item => {
    setSelectedItem(item);
    if (onSelectItem) {
      onSelectItem(item); // Pass the selected item to the parent
    }
  };

  const renderItem = ({item}) => {
    const isSelected = item.key === selectedItem?.key;

    return (
      <TouchableOpacity
        onPress={() => handleItemPress(item)}
        style={[styles.card, isSelected ? styles.selectedItem : null]}>
        <Text
          style={[
            styles.cardText,
            isSelected ? styles.selectedItemText : null,
          ]}>
          {item.value}
        </Text>
      </TouchableOpacity>
    );
  };
  if (!data || data.length === 0) {
    // Show a message if data is empty or null
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{emptyessage}</Text>
      </View>
    );
  }
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.key.toString()} // Ensure unique key for FlatList
      contentContainerStyle={styles.listContainer}
      numColumns={numColumn} // Set number of columns to 2
      columnWrapperStyle={numColumn > 1 ? styles.columnWrapper : null}
   //   columnWrapperStyle={styles.columnWrapper} // Add spacing between columns
      showsVerticalScrollIndicator={false} // Hide the scroll indicator
    />
  );
};

export default SelectableFlatList;

const styles = StyleSheet.create({
  listContainer: {
    // paddingHorizontal: 10,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: Color.borderColor,
    borderWidth: 2,
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 10, // Adjust margin for proper spacing
    shadowColor: '#000', // For iOS
    shadowOffset: {width: 0, height: 2}, // For iOS
    shadowOpacity: 0.2, // For iOS
    shadowRadius: 2, // For iOS
    elevation: 2, // For Android (shadow)
    alignItems: 'center', // Center the text inside the card
    justifyContent: 'center',
  },
  cardText: {
    fontSize: 14,
    color: 'red',
  },
  selectedItem: {
    backgroundColor: Color.primary,
    elevation: 4,
    // Make selected item pop out more
  },
  selectedItemText: {
    color: '#fff',
  },
  columnWrapper: {
    justifyContent: 'space-between', // Ensure even spacing between columns
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#888', // A subtle color for the empty message
    textAlign: 'center',
  },
});
