import {View, Text} from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@reduxjs/toolkit/query';

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

    </View>
  );
}
