import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Icon } from '../../components/ui/icon';
import { filter_icon } from '../assets/svg';
import ZText from './ZText';
import padding from '@/themes/padding';
import { SkeletonText } from '../../components/ui/skeleton';


const FilterChips = ({ filters ,recordsCount}) => {
 
  return (
    <>
    {(filters === undefined) ? (
      <SkeletonText 
      _lines={2} 
      gap={1}  
      style={{ width: "90%", height: 24 }} 
    />
    ):(
    <View style={styles.Outercontainer}>
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
<ZText  type="M16" style={{paddingLeft:10}}>Total {recordsCount} 
    </ZText> 
    </View>
</View>)}</>
  );

};

const styles = StyleSheet.create({
  Outercontainer:{
    backgroundColor:'#F7F8FA',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor:'#F7F8FA',
  },
  textcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 20,
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
