import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const MultiSelectFlatList = ({ data, onSelectItem }) => {
  const [selectedItems, setSelectedItems] = useState([]); // Track multiple selected items

  const handleItemPress = (item) => {
    // Check if the item is already selected
    if (selectedItems.some(selected => selected.key === item.key)) {
      // If selected, remove it from the selected items
      const newSelectedItems = selectedItems.filter(selected => selected.key !== item.key);
      setSelectedItems(newSelectedItems);
      onSelectItem(newSelectedItems); // Pass updated selected items to the parent
    } else {
      // If not selected, add it to the selected items
      const newSelectedItems = [...selectedItems, item];
      setSelectedItems(newSelectedItems);
      onSelectItem(newSelectedItems); // Pass updated selected items to the parent
    }
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedItems.some(selected => selected.key === item.key);

    return (
      <TouchableOpacity
        onPress={() => handleItemPress(item)}
        style={[styles.card, isSelected ? styles.selectedItem : null]}
      >
        <Text style={[styles.cardText, isSelected ? styles.selectedItemText : null]}>
          {item.value}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.key.toString()} // Ensure unique key for FlatList
      contentContainerStyle={styles.listContainer}
      numColumns={2} // Set number of columns to 2
      columnWrapperStyle={styles.columnWrapper} // Add spacing between columns
      showsVerticalScrollIndicator={false} // Hide the scroll indicator
    />
  );
};

export default MultiSelectFlatList;

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 10,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 10, // Adjust margin for proper spacing
    shadowColor: '#000', // For iOS
    shadowOffset: { width: 0, height: 2 }, // For iOS
    shadowOpacity: 0.2, // For iOS
    shadowRadius: 2, // For iOS
    elevation: 4, // For Android (shadow)
    alignItems: 'center', // Center the text inside the card
    justifyContent: 'center',
  },
  cardText: {
    fontSize: 16,
    color: 'red',
  },
  selectedItem: {
    backgroundColor: '#4CAF50',
    elevation: 8, // Make selected item pop out more
  },
  selectedItemText: {
    color: '#fff',
  },
  columnWrapper: {
    justifyContent: 'space-between', // Ensure even spacing between columns
  },
});
