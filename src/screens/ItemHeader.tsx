import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import ZAvatarInitials from '../sharedComponents/ZAvatarInitials'; // Adjust import based on your project structure
import ZText from '../sharedComponents/ZText'; // Adjust import based on your project structure
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../BrokerAppCore/redux/store/reducers';
import { formatDate } from '../constants/constants';
import moment from 'moment';
const useGetTimeDifference = (createdAt) => {
  const getTimeDifference = useCallback(() => {
    // Ensure createdAt is treated as a UTC time
    const created = moment.utc(createdAt).local();
    const now = moment();

    const daysDifference = now.diff(created, 'days');
    const monthsDifference = now.diff(created, 'months');
    const yearsDifference = now.diff(created, 'years');

    if (yearsDifference >= 1) {
      return yearsDifference === 1 ? '1 year ago' : `${yearsDifference} years ago`;
    }

    if (monthsDifference >= 1) {
      return monthsDifference === 1 ? '1 month ago' : `${monthsDifference} months ago`;
    }

    if (daysDifference >= 7) {
      const weeks = Math.floor(daysDifference / 7);
      return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
    }

    return created.fromNow(); // Show the relative time (e.g., "5 hours ago")
  }, [createdAt]);

  return useMemo(() => getTimeDifference(), [getTimeDifference]);
};

const ItemHeader = ({ item }) => {
  console.log('item', item);
  const navigation = useNavigation();
  const user = useSelector((state: RootState) => state.user.user);
    const onPressUser = (userId, userName, userImage) => {
        if (user.userId === userId) {
          navigation.navigate('ProfileScreen');
        } else {
          navigation.navigate('ProfileDetail', {
            userName: userName,
            userImage: userImage,
            userId: userId,
            loggedInUserId: user.userId,
            connectionId: '',
          });
        }
      };
      const timeDifference = useGetTimeDifference(item.postedOn);
  return (

    <TouchableOpacity
        style={styles.cardAvatar}
        onPress={() => onPressUser(item.userId, item.postedBy, item.profileImage)}
      >
      <View style={styles.cardAvatarImg}>
        <ZAvatarInitials
        onPress={() =>
            onPressUser(item.userId, item.postedBy, item.profileImage)
          }
          sourceUrl={item.profileImage}
          iconSize="md"
          name={item.postedBy}
        />
      </View>
      <View style={styles.cardAvatarText}>
        <ZText type={'B16'}>{item.postedBy}</ZText>
        <ZText type={'R14'}>{timeDifference}</ZText>
      </View>
    </TouchableOpacity>
  );};

  const styles = StyleSheet.create({  
    cardAvatar: {
    display: 'flex',
    flexDirection: 'row',
 paddingHorizontal:8,
 paddingVertical:10
  },
  cardAvatarImg: {
    display: 'flex',
    flexDirection: 'row',
   
  },
  cardAvatarText: {
    display: 'flex',
    flexDirection: 'column',
   marginLeft:10,
   //alignItems: 'center',
  }});
  export default ItemHeader;