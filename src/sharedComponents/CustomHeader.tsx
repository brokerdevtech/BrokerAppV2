import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { BellIcon, Icon, MessageCircleIcon } from '@/components/ui/icon';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Avatar } from '@/components/ui/avatar';
import { VStack } from '@/components/ui/vstack';


const CustomHeader = () => {
  return (
    <Box  bg="white">
      {/* Header Container */}
      <HStack alignItems="center" justifyContent="space-between" px={4} py={2} bg="white" shadow={2}>
        
        {/* Left Section: Profile Picture and Text */}
        <HStack alignItems="center">
          <Avatar
            source={{ uri: 'https://placehold.co/100x100' }}
            size="lg"
            borderWidth={2}
            borderColor="red.500"
          />
          <VStack ml={30}>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Broker<Text style={{ color: 'red' }}>App</Text></Text>
            <Text style={{ color: 'gray', fontSize: 12 }}>Dubai</Text>
          </VStack>
        </HStack>

        {/* Right Section: Notification & Settings Icons */}
        <HStack size='lg' >
        <Icon as={BellIcon} size="xl"  />
        <Icon as={MessageCircleIcon} size="xl"  />
        </HStack>
      </HStack>

      <HStack cls='lg' >
        <Icon as={BellIcon} size="xl"  />
        <Icon as={MessageCircleIcon} size="xl"  />
        </HStack>
    </Box>
  );
};

export default CustomHeader;
