import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Icon } from '../../components/ui/icon';
import { filter_icon } from '../assets/svg';


const FilterChips = ({ filters ,recordsCount}) => {
 
  return (
    <View>
    <View style={styles.container}>
      {/* Fixed "Filters" Chip */}
      <View style={styles.fixedChip}>
      <Icon as={filter_icon}  style={{marginRight:5}}/>
        <Text style={styles.text}>Filters</Text>
 
      </View>

      {/* Scrollable Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {filters.map((filter, index) => (
          <View key={index} style={styles.chip}>
            <Text style={styles.text}>{filter.label}</Text>
            <TouchableOpacity style={styles.closeButton}>
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
    <View style={styles.textcontainer}>
<Text>{recordsCount} 
    </Text> 
    </View>
</View>
  );

};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  textcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
 
    paddingHorizontal: 10,
  },
  fixedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 5,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 5,
  },
  icon: {
    marginRight: 5,
  },
  text: {
    fontSize: 14,
    color: '#333',
  },
  closeButton: {
    marginLeft: 5,
  },
  closeText: {
    fontSize: 14,
    color: '#333',
  },
});

export default FilterChips;
