import React from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {RectButton} from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {
  ChannelPreviewMessenger,
  ChannelPreviewMessengerProps,
  Delete,
  MenuPointHorizontal,
  useChatContext,
  useTheme,
} from 'stream-chat-react-native';

// import { useAppOverlayContext } from '../context/AppOverlayContext';
// import { useBottomSheetOverlayContext } from '../context/BottomSheetOverlayContext';
// import { useChannelInfoOverlayContext } from '../context/ChannelInfoOverlayContext';

import type {StackNavigationProp} from '@react-navigation/stack';

// import type { StackNavigatorParamList, StreamChatGenerics } from '../types';

const styles = StyleSheet.create({
  leftSwipeableButton: {
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 20,
  },
  rightSwipeableButton: {
    paddingLeft: 8,
    paddingRight: 16,
    paddingVertical: 20,
  },
  swipeableContainer: {
    // borderTopWidth: 1,
    alignItems: 'center',
    flexDirection: 'row',
    // borderBottomWidth: 1,
    // borderColor: '#000',
  },
});

type ChannelListScreenNavigationProp = StackNavigationProp<
  StackNavigatorParamList,
  'ChannelListScreen'
>;

export const ChannelPreview: React.FC<ChannelPreviewMessengerProps> = props => {
  const {channel} = props;
  const channelState = channel.state;

  //   const {setOverlay} = useAppOverlayContext();

  //   const {setData: setDataBottomSheet} = useBottomSheetOverlayContext();

  //   const {data, setData} = useChannelInfoOverlayContext();

  const {client} = useChatContext();
  const currentUserId = client.userID;
  const navigation = useNavigation<ChannelListScreenNavigationProp>();

  const {
    theme: {
      colors: {accent_red, white_smoke},
    },
  } = useTheme();

  const otherMembers = Object.values(channelState.members).filter(
    member => member.user?.id !== currentUserId,
  );
  const [showDeleteConfirmation, setShowDeleteConfirmation] =
    React.useState(false);

  const handleDeleteChannel = async () => {
    try {
      await channel.delete();
    } catch (error) {
      console.error('Error deleting channel:', error);
    } finally {
      setShowDeleteConfirmation(false);
    }
  };
  const showConfirmationDialog = () => {
    Alert.alert(
      `Delete ${otherMembers.length === 1 ? 'Conversation' : 'Group'}`,
      `Are you sure you want to delete this ${
        otherMembers.length === 1 ? 'conversation' : 'group'
      }?`,
      [
        {
          text: 'CANCEL',
          onPress: () => setShowDeleteConfirmation(false),
          style: 'cancel',
        },
        {
          text: 'DELETE',
          onPress: handleDeleteChannel,
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <Swipeable
      overshootLeft={false}
      overshootRight={false}
      renderRightActions={() => (
        <View
          style={[styles.swipeableContainer, {backgroundColor: white_smoke}]}>
          {/* <RectButton
            // onPress={() => {
            //   setData({channel, clientId: client.userID, navigation});
            //   setOverlay('channelInfo');
            // }}
            style={[styles.leftSwipeableButton]}>
            <MenuPointHorizontal />
          </RectButton> */}
          <RectButton
            onPress={showConfirmationDialog}
            style={[styles.rightSwipeableButton]}>
            <Delete pathFill={accent_red} />
          </RectButton>
        </View>
      )}>
      <ChannelPreviewMessenger {...props} />
    </Swipeable>
  );
};
