/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {
  Ads_Icon,
  City_icon,
  Follower_Icon,
  Globe,
  info_icon,
  logout_icon,
  Network,
  Network_icon,
  settings_icon,
} from '../assets/svg';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Icon,
} from '../../components/ui/icon';
import ZText from './ZText';
import {Color} from '../styles/GlobalStyles';
const CustomDrawerItem = ({label, onPress, leftIcon, rightIcon}) => {
  return (
    <TouchableOpacity
      style={[styles.drawerItem, styles.bottomBorder]}
      onPress={onPress}>
      {leftIcon && <Icon as={leftIcon} size={20} style={styles.leftIcon} />}

      <ZText type={'R18'} style={styles.drawerLabel}>
        {label}
      </ZText>
      {rightIcon && <Icon as={rightIcon} style={styles.rightIcon} />}
    </TouchableOpacity>
  );
};
const CustomDrawerContent = props => {
  return (
    <DrawerContentScrollView {...props} style={{marginLeft: 10}}>
      <View style={[styles.drawerHeader, styles.bottomBorder]}>
        <Image
          source={{uri: 'https://via.placeholder.com/150'}}
          style={styles.profileImage}
        />
        <ZText type={'R18'} style={styles.nameText}>
          Shakeel Shah
        </ZText>
        <TouchableOpacity>
          <ZText type={'R16'} style={styles.viewProfileText}>
            View Profile
          </ZText>
        </TouchableOpacity>
        {/* <Text style={styles.profileViewers}>300 Profile Viewers</Text> */}
      </View>

      <View style={styles.drawerItemsContainer}>
        <TouchableOpacity style={[styles.drawerItem, styles.bottomBorder]}>
          <ZText type={'S16'} style={styles.drawerLabel}>
            300{' '}
            <ZText type={'R16'} style={styles.viewProfileText}>
              Profile Viewers
            </ZText>
          </ZText>
        </TouchableOpacity>
        <CustomDrawerItem
          label="Followers"
          onPress={() => {}}
          leftIcon={Follower_Icon}
          rightIcon={ChevronRightIcon}
        />
        <CustomDrawerItem
          label="Following"
          onPress={() => {}}
          leftIcon={Follower_Icon}
          rightIcon={ChevronRightIcon}
        />
        <CustomDrawerItem
          label="My Network"
          onPress={() => {}}
          leftIcon={Network_icon}
          rightIcon={ChevronRightIcon}
        />
        <CustomDrawerItem
          label="My Ads"
          onPress={() => {}}
          leftIcon={Ads_Icon}
          rightIcon={ChevronRightIcon}
        />
        <CustomDrawerItem
          label="Language"
          onPress={() => {}}
          leftIcon={Globe}
          rightIcon={ChevronRightIcon}
        />
        <CustomDrawerItem
          label="Support"
          onPress={() => {}}
          leftIcon={settings_icon}
          rightIcon={ChevronRightIcon}
        />
        <CustomDrawerItem
          label="City"
          onPress={() => {}}
          leftIcon={City_icon}
          rightIcon={ChevronRightIcon}
        />
        <CustomDrawerItem
          label="Terms & Conditions"
          onPress={() => {}}
          leftIcon={info_icon}
          rightIcon={ChevronRightIcon}
        />
        <CustomDrawerItem
          label="Log out"
          onPress={() => {}}
          leftIcon={logout_icon}
          rightIcon={ChevronRightIcon}
        />
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    justifyContent: 'space-between', // This will push the icons to the sides
  },
  leftIcon: {
    marginRight: 10,
  },
  drawerLabel: {
    flex: 1, // This allows the text to take up the space between icons
    fontSize: 16,
  },
  rightIcon: {
    marginLeft: 10,
  },
  nameText: {
    fontSize: 18,
    // fontWeight: 'bold',
  },
  bottomBorder: {
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
    paddingVertical: 18,
  },
  viewProfileText: {
    color: '#7C8091',
  },
  profileViewers: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
  },
  drawerItemsContainer: {
    paddingVertical: 10,
  },
});

export default CustomDrawerContent;
