import {View, Text} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '@reduxjs/toolkit/query';

import FastImage from '@d11/react-native-fast-image';
import UserStories from '../components/story/UserStories';

import {useChatClient} from '../navigation/useChatClient';
export default function DashboradScreen() {
  const AppLocation = useSelector((state: RootState) => state.AppLocation);
  const user = useSelector((state: RootState) => state.user.user);
  console.log(user);
  return <UserStories />;
}
