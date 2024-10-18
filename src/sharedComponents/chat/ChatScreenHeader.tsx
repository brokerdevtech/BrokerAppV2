/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { useChatContext, useTheme } from 'stream-chat-react-native';

import { RoundButton } from './RoundButton';
import { ScreenHeader } from './ScreenHeader';

import { useAppContext } from '../../Context/AppContext';
import { NewDirectMessageIcon } from '../../icons/NewDirectMessageIcon';

import type { DrawerNavigationProp } from '@react-navigation/drawer';
import type { StackNavigationProp } from '@react-navigation/stack';

import type { DrawerNavigatorParamList, StackNavigatorParamList } from '../../types';
import { NetworkDownIndicator } from './NetworkDownIndicator';
import { GoBack } from '../../icons/GoBack';
import {HStack} from '@/components/ui/hstack';
import ArrowLeftIcon from '../../assets/svg/icons/arrow-left.svg';
import { Icon } from '../../../components/ui/icon';
import { NewChat_Icon } from '../../assets/svg';
import ZText from '../ZText';
const styles = StyleSheet.create({
  avatar: {
    borderRadius: 20,
    height: 40,
    width: 40,
  },
  backButton: {
    paddingVertical: 8,
  },
});

type ChatScreenHeaderNavigationProp = CompositeNavigationProp<
  DrawerNavigationProp<DrawerNavigatorParamList>,
  StackNavigationProp<StackNavigatorParamList>
>;

export const BackButton: React.FC<{
  onBack?: () => void;
  showUnreadCountBadge?: boolean;
}> = ({}) => {
  const navigation = useNavigation<ScreenHeaderNavigationProp>();

  return (
    <View style={{flexDirection:'row' , alignItems:'center' ,justifyContent:'space-between'}}>
    <TouchableOpacity
      onPress={() => {
        navigation.goBack();

      }}
      style={styles.backButton}
    >
      {/* <GoBack /> */}
      <View
          style={{
            // ...styles.appTitleMain,
            // color: '#007acc',
            padding: 8,
            borderWidth: 1,
            borderColor: '#E5E5E5',
            borderRadius: 40,
          }}>
                  <ArrowLeftIcon />
             
              </View>
    </TouchableOpacity>
    <ZText type={"S16"} style={{marginLeft:20}}>Message</ZText>
    </View>
  );
};

export const ChatScreenHeader: React.FC<{ title?: string }> = ({ title = '' }) => {
  const {
    theme: {
      colors: { accent_blue },
    },
  } = useTheme();

  const navigation = useNavigation<ChatScreenHeaderNavigationProp>();
  const { chatClient } = useAppContext();
  const { isOnline } = useChatContext();

  return (
    <ScreenHeader
      LeftContent={() => (
<HStack>
 <BackButton  />





          </HStack>
      )}
      RightContent={() => (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('NewDirectMessagingScreen');
          }}
        >

          <Icon as={NewChat_Icon} size='xl'/>
        </TouchableOpacity>
      )}
      // Title={isOnline ? undefined : () => <NetworkDownIndicator titleSize="large" />}
      titleText={title}
    />
  );
};
