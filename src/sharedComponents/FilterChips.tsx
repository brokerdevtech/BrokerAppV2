import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Icon } from '../../components/ui/icon';
import { filter_icon } from '../assets/svg';
import ZText from './ZText';
import padding from '@/themes/padding';
import { SkeletonText } from '../../components/ui/skeleton';
import { colors } from '../themes';


const FilterChips = ({ filters ,recordsCount ,OnPressfilters}) => {
 
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
      <TouchableOpacity onPress={OnPressfilters}>
      <View style={styles.fixedChip}>
      <Icon as={filter_icon} color={colors.light.appred}  style={{marginRight:5}}/>
        <Text style={styles.text}>Filters</Text>
 
      </View>
      </TouchableOpacity>
      {/* <View style={styles.fixedChip}>
   
      <ZText  type="M16">Total {recordsCount} 
    </ZText> 
 
      </View> */}
      {/* Scrollable Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {filters.map((filter, index) => (
          <View key={index} style={styles.chip}>
            <Text style={styles.text}>{filter.label}</Text>
            {/* <TouchableOpacity style={styles.closeButton}>
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity> */}
          </View>
        ))}
      </ScrollView>
    </View>
    {/* <View style={styles.textcontainer}>
<ZText  type="M16" style={{paddingLeft:10}}>Total {recordsCount} 
    </ZText> 
    </View> */}
</View>)}</>
  );

};

const styles = StyleSheet.create({
  Outercontainer:{
    backgroundColor:'white',
    borderBottomColor:colors.light.gray,
    borderBottomWidth:1,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor:'white',
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
