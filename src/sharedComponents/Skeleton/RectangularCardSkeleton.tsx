/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-trailing-spaces */
import { View, Text } from 'react-native';
import React from 'react';
import { Skeleton, SkeletonText } from '../../../components/ui/skeleton';
import { HStack } from '../../../components/ui/hstack';
import { Box } from '../../../components/ui/box';
import { VStack } from '../../../components/ui/vstack';

export default function RectangularCardSkeleton({type='broker'}) {
  return (
    <HStack space={'xl'} style={{ marginTop:10, paddingHorizontal:10 }}>
      {type === 'broker' ? Array.from({ length: 4 }).map((_, index) => (
        <Box 
          key={`broker-${index}`} 
          className="w-[400px] gap-4 p-3 rounded-md bg-background-100" 
          style={{ height: 140, paddingHorizontal: 10, paddingVertical: 10, width: 120 }}
        >
          <VStack className="gap-2 align-middle" style={{ alignItems: 'center' }}>
            <Skeleton 
              variant="circular" 
              style={{ height: 60, width: 60 }} 
            />
            <SkeletonText _lines={1} gap={1} className="h-4 w-2/5" />
            <Skeleton 
              variant="sharp" 
              style={{ height: 30, width: 80 }} 
            />
          </VStack>
        </Box>
      )) : type === 'NewIN' ? Array.from({ length: 4 }).map((_, index) => (
        <Box 
          key={`newin-${index}`} 
          className="w-[400px] gap-4 rounded-lg bg-background-100" 
          style={{ height: 170, width: 132 }}
        >
          <Skeleton 
            variant="sharp" 
            className="rounded-lg"
            style={{ height: 100, width: 132 }} 
          />   
          <VStack className="gap-2 align-middle" style={{ alignItems: 'center' }}>
            <SkeletonText _lines={3} gap={2} className="h-4 w-30" />
          </VStack>
        </Box>
      )) : Array.from({ length: 4 }).map((_, index) => (
        <Box 
          key={`default-${index}`} 
          className="w-[400px] gap-4 p-3 rounded-lg bg-background-100" 
          style={{ height: 180, width: 120 }}
        >
        </Box>
      ))}
    </HStack>
  );
}
