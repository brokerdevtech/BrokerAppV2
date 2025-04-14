/* eslint-disable react/react-in-jsx-scope */
import {
  Like,
  ReelShare,
  UnLikeWhite,
  Volume,
  VolumeMute,share_PIconW
} from '../../assets/svg';

import {View, TouchableOpacity, Text, StyleSheet, Share} from 'react-native';
import {Icon, MessageCircleIcon} from '../../../components/ui/icon';
import {useState} from 'react';
import {User} from 'stream-chat-react-native';
import {SetPostLikeUnLike} from '../../../BrokerAppCore/services/new/dashboardService';
import {ThreadLikeUnLike} from '../../../BrokerAppCore/services/new/threads';

export const ReelActions = ({
  likes,
  shares,
  onLike,
  isLiked,
  postId,
  isMuted,
  onToggleMute,
  mediaType,
}) => {
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
      {/* Like Button */}
      <TouchableOpacity style={styles.actionButton} onPress={handleLikeToggle}>
        <View style={styles.shadowIcon}>
          {liked ? (
            <Like  />
          ) : (
            <UnLikeWhite  />
          )}
          <Text style={styles.actionCount}>{postLikesCount}</Text>
        </View>
      </TouchableOpacity>

      {/* Share Button */}
      <TouchableOpacity style={styles.actionButton} onPress={handleSharePress}>
        <View style={styles.shadowIcon}>
        {/* ReelShare share_PIcon */}
          {/* <Icon as={ReelShare} size="xxl" color="#f5f5f5" /> */}
          <Icon as={share_PIconW} size="xxl" />
        </View>
        {shares > 0 && <Text style={styles.actionCount}>{shares}</Text>}
      </TouchableOpacity>

      {/* Mute/Unmute Button */}
      {mediaType === 'VIDEO' && (
        <TouchableOpacity style={styles.actionButton} onPress={onToggleMute}>
          <View style={styles.shadowIcon}>
            <Icon as={isMuted ? VolumeMute : Volume} size="xxl" color="#eee" />
          </View>
          {/* <Text style={styles.actionCount}>{isMuted ? 'Muted' : 'Unmuted'}</Text> */}
        </TouchableOpacity>
      )}
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
    height: 50,
    width: 50,
    // backgroundColor: '#000',
    // opacity: 0.9,
  },
  actionCount: {
    color: 'white',
    fontSize: 14,
    marginTop: 3,
  },
  shadowIcon: {
    // backgroundColor: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // dark semi-transparent background
    padding: 10,
    borderRadius: 10, // fully rounded for circle
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,

    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,

    // Shadow for Android
    elevation: 5,
  },
});
