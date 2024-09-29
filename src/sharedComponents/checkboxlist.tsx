import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';

import {CheckIcon, Icon} from '../../components/ui/icon';
import {Color} from '../styles/GlobalStyles';

const Checkbox = ({isChecked, onToggle}) => {
  return (
    <TouchableOpacity onPress={onToggle} style={styles.checkboxContainer}>
      <View style={[styles.checkbox, isChecked && styles.checked]}>
        {isChecked && (
          <Icon as={CheckIcon} size={14} color="#fff" style={styles.icon} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const CheckboxList = ({data = [], multiSelect = false, onSelectionChange}) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      onSelectionChange(multiSelect ? selectedItems : selectedItems[0]);
    }
  }, [selectedItems]);

  const handleToggle = option => {
    setSelectedItems(prevState => {
      if (multiSelect) {
        if (prevState.some(item => item.key === option.key)) {
          return prevState.filter(item => item.key !== option.key);
        } else {
          return [...prevState, option];
        }
      } else {
        return prevState.some(item => item.key === option.key) ? [] : [option];
      }
    });
  };

  const renderItem = ({item}) => (
    <View style={styles.itemContainer}>
      <Checkbox
        isChecked={selectedItems.some(
          selectedItem => selectedItem.key === item.key,
        )}
        onToggle={() => handleToggle(item)}
      />
      <Text style={styles.itemText}>{item.value}</Text>
    </View>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.listContainer}
      style={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    alignItems: 'stretch',
  },
  list: {
    width: '100%',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    width: '100%',
  },
  checkboxContainer: {
    marginRight: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderColor: '#000',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: Color.primary,
    borderColor: Color.primary,
  },
  icon: {
    marginTop: -2, // Adjust icon position if necessary
  },
  itemText: {
    fontSize: 16,
    color: '#000',
    flex: 1, // Ensure text takes up the remaining space
  },
});

export default CheckboxList;
