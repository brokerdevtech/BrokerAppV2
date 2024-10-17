import { View, Text } from 'react-native'
import React from 'react'
import { HStack } from '../../../components/ui/hstack'
import { Skeleton, SkeletonText } from '../../../components/ui/skeleton'
import { Box } from '../../../components/ui/box'
import { VStack } from '../../../components/ui/vstack'
import { styles } from '../../themes'

export default function CircularSkeleton() {
  return (
   
    <HStack space={"xl"} style={{ marginTop:10,paddingHorizontal:10}}>
 {Array.from({ length: 6 }).map((_, index) => (
     <HStack key={index} className="gap-2 align-middle">
       <Skeleton 
         variant="circular" 

         style={{ height: 60, width: 60 }} 

       />

     </HStack>
   ))}

 </HStack>

  )
}