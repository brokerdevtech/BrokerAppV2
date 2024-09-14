import React from 'react';
import { Chat } from 'stream-chat-react-native';
import { StreamChat } from 'stream-chat';
import { chatApiKey } from '../config/chatConfig';

const chatClient = StreamChat.getInstance(chatApiKey);

const ChatBase = ({ children:any }) => {
  return (
    <Chat client={chatClient}>
      {children}
    </Chat>
  );
};

export default ChatBase;