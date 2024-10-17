import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import CircularSkeleton from './CircularSkeleton'
import RectangularCardSkeleton from './RectangularCardSkeleton'
import ListingCardSkeleton from './ListingCardSkeleton'

export default function AllSkeletonComponent() {
  return (
    <ScrollView style={{backgroundColor:'#fff', paddingBottom:200}} >
    <Text>Skeleton for Stories and Circular shape</Text>
    <CircularSkeleton/>
    <Text>Skeleton for  recomendedBroker cards</Text>
    <RectangularCardSkeleton/>
    <Text>Skeleton for Newly Launch Card </Text>
    <RectangularCardSkeleton type='NewIN'/>
    <Text>Skeleton for Podcasts </Text>
    <RectangularCardSkeleton type='podcasts'/>
    <Text>Skeleton for Listing Cards </Text>
    <ListingCardSkeleton />
    <Text>Skeleton for Listing Cards </Text>
    <ListingCardSkeleton />
    </ScrollView>
  )
}