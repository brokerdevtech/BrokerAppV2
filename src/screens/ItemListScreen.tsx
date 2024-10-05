import React, { useEffect } from 'react';
import {View, Text, ScrollView, StyleSheet } from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '@reduxjs/toolkit/query';
import CustomHeader from '../sharedComponents/CustomHeader';
import ZText from '../sharedComponents/ZText';

import ShortingIcon from '../assets/svg/icons/sorting.svg' 
import FilterIcon from '../assets/svg/icons/filters.svg';
import ArrowLeftIcon from '../assets/svg/icons/arrow-left.svg' 
import SearchIcon from '../assets/svg/icons/search.svg' 

import UserProfile from '../sharedComponents/profile/UserProfile';



const ItemListScreen: React.FC<any> = ({ listType }) => {

  const AppLocation = useSelector((state: RootState) => state.AppLocation);
  const user = useSelector((state: RootState) => state.user.user);
  
  return (
    <View style={styles.listContainer}>
      <ScrollView >
        <View style={styles.headerContainer}>
             <View style={styles.header}>
                 <View style={styles.IconButton}>
                    <ArrowLeftIcon />
                    <ZText type={'R18'} >Property</ZText>
                 </View>
                 <View style={styles.IconButton}>
                    <SearchIcon />
                 </View>
             </View>
             <UserProfile />
        </View>
        <View>
          
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <ZText type={'S16'} >Properties</ZText>
        <View style={styles.IconButton}>
          <ShortingIcon />
          <ZText type={'S16'} >Sort</ZText>
        </View>
        <View style={styles.IconButton}>
          <FilterIcon />
          <ZText type={'S16'} >Filter</ZText>
        </View>
      </View>
    </View>
    
  );
}


const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#FFF',
    paddingVertical: 10,
   
  },
  header: {
   justifyContent: "space-between",
   flexDirection: 'row',
   paddingHorizontal: 20,
   paddingVertical: 20,
  },
  listContainer: {
    backgroundColor: '#F7F8FA',
    flex: 1
  },
  
  footer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    height: 80,    
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  IconButton: {
    flexDirection: 'row',
    gap: 12
  },

});


export default ItemListScreen;