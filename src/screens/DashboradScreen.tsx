import {View, Text} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '@reduxjs/toolkit/query';

import FastImage from '@d11/react-native-fast-image';
import { useChatClient } from '../navigation/useChatClient';
export default function DashboradScreen() {
  const AppLocation = useSelector((state: RootState) => state.AppLocation);

  return (
    <View>
      <Text>DashboradScreen</Text>
      <Text>{AppLocation.city}</Text>
      <Text>{AppLocation.state}</Text>
      <Text>{AppLocation.country}</Text>
      <Text>{AppLocation.placeID}</Text>
      <Text>{AppLocation.placeName}</Text>
      {/* <FastImage
        resizeMode={FastImage.resizeMode.contain}
        style={{height: 200, width: 200}}
        source={{
          headers: {Authorization: 'someAuthToken'},
          priority: FastImage.priority.normal,
          uri: 'https://unsplash.it/400/400?image=1',
        }}
      /> */}
    </View>
  );
}
