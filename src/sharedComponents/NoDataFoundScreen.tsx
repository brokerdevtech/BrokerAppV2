import {View, Text, Image} from 'react-native';
import React from 'react';
import ZText from './ZText';

export default function NoDataFoundScreen() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Image
        source={require('../assets/images/no-data.png')}
        style={{height: 150, width: 150, marginBottom: 20}}
      />
      <ZText type={'S20'} style={{marginBottom: 20}}>
        No Data Found
      </ZText>
      {/* <ZText type={'R14'}>Are you Ready to get something new from us ?</ZText> */}
    </View>
  );
}
