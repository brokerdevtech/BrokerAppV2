/* eslint-disable react/react-in-jsx-scope */
import {Like, ReelShare, UnLikeWhite} from '../../assets/svg';

import {View, TouchableOpacity, Text, StyleSheet, Share} from 'react-native';
import {Icon, MessageCircleIcon} from '../../../components/ui/icon';
import {useState} from 'react';
import {User} from 'stream-chat-react-native';
import {SetPostLikeUnLike} from '../../../BrokerAppCore/services/new/dashboardService';
import {ThreadLikeUnLike} from '../../../BrokerAppCore/services/new/threads';

export const ReelActions = ({likes, shares, onLike, isLiked, postId}) => {
  const [postLikesCount, setPostLikesCount] = useState(likes);
  const [liked, setLiked] = useState(isLiked);

  const handleLikeToggle = async () => {
    const action = liked ? 'UnLike' : 'Like';
    const result = await ThreadLikeUnLike(action, postId);

    if (result.success) {
      const newCount = liked ? postLikesCount - 1 : postLikesCount + 1;
      setPostLikesCount(newCount);
      setLiked(!liked);

      // Call the parent component's onLike callback if provided
      if (onLike) {
        onLike(!liked);
      }
    }
  };
  const handleSharePress = async () => {
    try {
      // Generate the share URL for this post
      const shareUrl = shares;

      // Use the Share API to open native share dialog
      const result = await Share.share({
        message: shareUrl,

        title: 'Share this content',
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with activity type of result.activityType
          console.log(`Shared via ${result.activityType}`);
        } else {
          // Shared
          console.log('Shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <View style={styles.actionsContainer}>
      <TouchableOpacity style={styles.actionButton} onPress={handleLikeToggle}>
        {liked ? (
          <Like height={35} width={35} />
        ) : (
          <UnLikeWhite height={35} width={35} />
        )}
        <Text style={styles.actionCount}>{postLikesCount}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton} onPress={handleSharePress}>
        <Icon as={ReelShare} style={{marginTop: 10}} size="xxl" color="#eee" />
        {shares > 0 && <Text style={styles.actionCount}>{shares}</Text>}
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
