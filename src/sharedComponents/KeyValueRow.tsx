import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import ZText from './ZText'; // Assuming ZText is imported
import {HStack} from '../../components/ui/hstack';
import {VStack} from '../../components/ui/vstack';
import {useSelector} from 'react-redux';
import {RootState} from '@reduxjs/toolkit/dist/query';

const KeyValueRow = ({label, values, valueKey, screentype = 'default'}) => {
  if (!values || values.length === 0) {
    return null; // Do not render if values are missing or empty
  }

  return (
    <VStack
      space="md"
      reversed={false}
      style={{justifyContent: 'space-between', paddingVertical: 10}}>
      <View>
        <ZText type={'B14'}>{label}</ZText>
      </View>
      <HStack space="sm" style={{flexWrap: 'wrap'}}>
        {values.map((item, index) => (
          <View key={index} style={styles.chip}>
            <Text style={styles.chipText}>
              {screentype == 'default' ? item[valueKey] : item?.value}
            </Text>
          </View>
        ))}
      </HStack>
    </VStack>
  );
};

const styles = StyleSheet.create({
  chip: {
    padding: 10,
    borderRadius: 8, // Rounded corners
    borderWidth: 2,
    // borderColor: '#E8E8E8',
    borderColor: '#E8E8E8',
    marginRight: 5,
    marginBottom: 5,
    alignItems: 'center', // Centers the text horizontally
    justifyContent: 'center', // Centers the text vertically
  },
  chipText: {
    fontSize: 14,
    color: '#E00000',
  },
});

export default KeyValueRow;
