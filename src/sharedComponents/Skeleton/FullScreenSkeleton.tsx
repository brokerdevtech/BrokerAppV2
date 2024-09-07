import React from 'react';
import { Dimensions, Text } from 'react-native';

import { Box } from "@/components/ui/box";
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
// Get the full height of the screen
const screenHeight = Dimensions.get('window').height;

// Calculate dynamic heights as a percentage of the screen height
const dynamicSkeletonHeight = screenHeight * 0.3; // 30% of the screen height for text skeletons
const dynamicImageSkeletonHeight = screenHeight * 0.25; // 25% of the screen height for image skeletons

const FullScreenSkeleton = () => {
  return (
 
  <HStack space="md" reversed={false}>
  <Box className="h-20 w-20 bg-primary-300" ><Skeleton variant="circular" className="h-[24px] w-[24px] " /></Box>
  <Box className="h-20 w-20 bg-primary-400" />
  <Box className="h-20 w-20 bg-primary-500" />
</HStack>
  );
};

export default FullScreenSkeleton;
