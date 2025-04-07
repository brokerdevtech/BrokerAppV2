/* eslint-disable react/react-in-jsx-scope */
import {Like, UnLikeWhite} from '../../assets/svg';

import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {Icon, MessageCircleIcon} from '../../../components/ui/icon';

export const ReelActions = ({likes, shares, onLike, isLiked}) => {
  return (
    <View style={styles.actionsContainer}>
      <TouchableOpacity style={styles.actionButton} onPress={onLike}>
        {isLiked ? (
          <Like height={35} width={35} />
        ) : (
          <UnLikeWhite height={35} width={35} />
        )}
        <Text style={styles.actionCount}>{likes}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton}>
        <Icon
          as={MessageCircleIcon}
          // style={{marginRight: 5}}
          size="xxxl"
          color="#eee"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  actionsContainer: {
    position: 'absolute',
    right: 16,
    bottom: 150,
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: 15,
    justifyContent: 'center',
  },
  actionIcon: {
    width: 28,
    height: 28,
  },
  actionCount: {
    color: 'white',
    fontSize: 12,
    marginTop: 3,
  },
});
