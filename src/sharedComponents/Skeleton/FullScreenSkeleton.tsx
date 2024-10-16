import React from 'react';
import { Dimensions } from 'react-native';
import { VStack } from '../../../components/ui/vstack';
import { Box } from '../../../components/ui/box';
import { HStack } from '../../../components/ui/hstack';
import { Skeleton, SkeletonText } from '../../../components/ui/skeleton';
import { colors } from '@/themes';


// Get the full height of the screen
const screenHeight = Dimensions.get('window').height;

// Calculate dynamic heights as a percentage of the screen height
const dynamicSkeletonHeight = screenHeight * 0.5; // 30% of the screen height for text skeletons
const dynamicImageSkeletonHeight = screenHeight * 0.25; // 25% of the screen height for image skeletons
// const SkeletonRownumber = screenHeight-(screenHeight * 0.5) / 24; 
const FullScreenSkeleton = () => {
  return (
    <VStack space={"xl"} style={{ marginTop:10,paddingHorizontal:10,  height:screenHeight}}>
 
       <Box className="w-[400px] gap-4 p-3 rounded-md bg-background-100" style={{ height:"98%",
        paddingHorizontal:10, 
        paddingVertical:10,
       }}>
       <Skeleton variant="sharp"   style={{height:screenHeight * 0.4}}/>
      
       {/* <HStack className="gap-2 align-middle">
         <Skeleton variant="circular"
         style={{height:24,width:24}}
         />
         <SkeletonText _lines={2} gap={1}  style={{width:"90%",height:24}} />
       </HStack> */}
    {/* Repeated Skeleton Rows */}
    {Array.from({ length: 7 }).map((_, index) => (
        <HStack key={index} className="gap-2 align-middle">
          <Skeleton 
            variant="circular" 
            style={{ height: 24, width: 24 }} 
          />
          <SkeletonText 
            _lines={2} 
            gap={1}  
            style={{ width: "90%", height: 24 }} 
          />
        </HStack>
      ))}

      
     </Box>
  
    </VStack>
  );
};

export default FullScreenSkeleton;
