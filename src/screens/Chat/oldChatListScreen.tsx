import {
  Channel,
  ChannelList,
  MessageInput,
  MessageList,
  useChannelPreviewDisplayName,
} from 'stream-chat-react-native';
import React, {useEffect} from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {useAppContext} from '../../Context/AppContext';

import {chatApiKey, chatUserId} from '../../config/chatConfig';
import ZSafeAreaView from '../../sharedComponents/common/ZSafeAreaView';
import ZHeader from '../../sharedComponents/common/ZHeader';
import {SafeAreaView} from 'react-native-safe-area-context';
const filters = {
  members: {
    $in: ['9'],
  },
};

const sort = {
  last_message_at: -1,
};

function ChatListScreen(props) {
  const navigation = useNavigation();
  const {channel} = useAppContext();
  const displayName = useChannelPreviewDisplayName(channel, 30);
  useEffect(() => {
    // Set the title when the component loads
    navigation.setOptions({title: displayName});
  }, []);

  return (
    <SafeAreaView>
      <Channel channel={channel}>
        <ZHeader title={displayName} />
        <MessageList />
        <MessageInput />
      </Channel>
    </SafeAreaView>
  );
}

export default ChatListScreen;
