import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {Icon} from '../../components/ui/icon';
import {filter_icon} from '../assets/svg';
import ZText from './ZText';
import padding from '@/themes/padding';

import {colors} from '../themes';
import {Color} from '../styles/GlobalStyles';

const FilterChips = ({filters, recordsCount, OnPressfilters}) => {
  return (
    <>
      {filters === undefined ? (
        <></>
      ) : (
        <View style={styles.Outercontainer}>
          <View style={styles.container}>
            {/* Fixed "Filters" Chip */}
            <TouchableOpacity onPress={OnPressfilters}>
              <View style={styles.fixedChip}>
                <Icon
                  as={filter_icon}
                  color={colors.light.appred}
                  size="lg"
                  style={{marginRight: 5}}
                />
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
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  Outercontainer: {
    backgroundColor: 'white',
    borderBottomColor: Color.borderColor,
    borderBottomWidth: 1,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  textcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  fixedChip: {
    padding: 5,
    borderRadius: 8, // Rounded corners
    borderWidth: 2,
    // borderColor: '#E8E8E8',
    borderColor: '#E8E8E8',
    marginRight: 10,
    marginBottom: 5,
    alignItems: 'center', // Centers the text horizontally
    justifyContent: 'center',
    flexDirection: 'row',
  },
  chip: {
    padding: 5,
    borderRadius: 8, // Rounded corners
    borderWidth: 2,
    // borderColor: '#E8E8E8',
    borderColor: '#E8E8E8',
    marginRight: 5,
    marginBottom: 5,
    alignItems: 'center', // Centers the text horizontally
    justifyContent: 'center',
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
