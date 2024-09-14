import React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
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
    <TouchableOpacity
      onPress={() => {
        navigation.goBack();
      
      }}
      style={styles.backButton}
    >
      <GoBack />
     
    </TouchableOpacity>
  );
};

export const ChatScreenHeader: React.FC<{ title?: string }> = ({ title = 'Chat' }) => {
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



 
 <Image
            source={{
              uri: chatClient?.user?.image,
            }}
            style={styles.avatar}
          />
          </HStack>
      )}
      RightContent={() => (
        <RoundButton
          onPress={() => {
            navigation.navigate('NewDirectMessagingScreen');
          }}
        >
          <NewDirectMessageIcon active color={accent_blue} height={25} width={25} />
        </RoundButton>
      )}
      Title={isOnline ? undefined : () => <NetworkDownIndicator titleSize='large' />}
      titleText={title}
    />
  );
};
