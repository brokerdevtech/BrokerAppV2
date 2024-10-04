import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const SelectableFlatList = ({ data,numColumn, onSelectItem,preselectedItem  }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  useEffect(() => {
    console.log("preselectedItem=");
    console.log(preselectedItem);
    if (preselectedItem) {
      setSelectedItem(preselectedItem);
    }
    else{
        setSelectedItem(null);
    }
  }, [preselectedItem]);
  const handleItemPress = (item) => {
   
    setSelectedItem(item);
    if (onSelectItem) {
      onSelectItem(item); // Pass the selected item to the parent
    }
  };

  const renderItem = ({ item }) => {
    const isSelected = item.key === selectedItem?.key;

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
       numColumns={numColumn} // Set number of columns to 2
      columnWrapperStyle={styles.columnWrapper} // Add spacing between columns
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
