import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import Video from 'react-native-video';
import {imagesBucketcloudfrontPath} from '../../config/constants';
import {
  VolumeMute,
  Volume,
  LikeWhite,
  UnLikeWhite,
  OpenEye,
} from '../../assets/svg';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {StackNav} from '../../navigation/NavigationKeys';
import {useSelector} from 'react-redux';
// import {
//   AddPodcastViwer,
//   PodcastLike,
//   PodcastUnlike,
// } from '../../../BrokerAppCore/services/podcast';
//import { Box, Center } from 'native-base';
import ZText from '../../sharedComponents/ZText';
import {fetchPodcastDetails} from '@/BrokerAppCore/services/new/podcastService';
import TouchableOpacityWithPermissionCheck from '../../sharedComponents/TouchableOpacityWithPermissionCheck';
import {PermissionKey} from '../../config/constants';
import TextWithPermissionCheck from '../../sharedComponents/TextWithPermissionCheck';
import {Box} from '../../../components/ui/box';
import {Center} from '../../../components/ui/center';
import {
  AddPodcastViwer,
  PodcastLike,
  PodcastUnlike,
} from '../../../BrokerAppCore/services/podcast';

const SingleReelInsta = ({item, index, currentIndex}) => {
  const user = useSelector((state: RootState) => state.user.user);
  const windowWidth = Dimensions.get('window').width;
  const userPermissions = useSelector(
    (state: RootState) => state.user.user.userPermissions,
  );
  const windowHeight = Dimensions.get('window').height;
  const [StoryState, setStoryState] = useState({
    likeCount: 0,
    reactionCount: 0,
    viewerCount: 0,
    userLiked: 0,
  });
  const [PodcastDetails, SetPodcastDetails] = useState(null);
  const navigation = useNavigation();
  const videoRef = useRef(null);
  const [isBuffering, setIsBuffering] = useState(false);
  const colors = useSelector(state => state.theme.theme);
  const onBuffer = buffer => {
    setIsBuffering(buffer.isBuffering);
  };
  const onError = error => {};
  const [Play, setPlay] = useState(false);
  const [mute, setMute] = useState(false);
  const [showMuteIcon, setShowMuteIcon] = useState(false);

  useFocusEffect(
    useCallback(() => {
      // const getPodcastDetails = async () => {
      //   try {
      //     const podcastitem = await fetchPodcastDetails(
      //       user.userId,
      //       item.podcastId,
      //     ); // Assuming GetPodcastDetails is a properly defined async function
      //     SetPodcastDetails(podcastitem.data); // Assuming SetPodcastDetails updates state appropriately
      //     setStoryState({
      //       likeCount: podcastitem.data.data.likeCount,
      //       reactionCount: podcastitem.data.data.commentCount,
      //       viewerCount: podcastitem.data.data.viewerCount,
      //       userLiked: podcastitem.data.data.userLiked,
      //     });

      //     handleViewerAdd(); // Make sure this function is defined and does what's expected

      //     // Here's a simplified way to set the play state
      //     // This assumes 'setPlay' is your state setter for controlling playback
      //     setPlay(currentIndex !== index);
      //   } catch (error) {
      //     console.error('Failed to fetch podcast details:', error);
      //   }
      // };

      // getPodcastDetails();

      return () => {};
    }, [item, currentIndex, index]), // Make sure all necessary dependencies are listed here
  );
  const Stopplay = () => {
    setPlay(true);
  };
  const startplay = () => {
    setPlay(false);
  };
  const handleMuteToggle = () => {
    setMute(!mute);
    setShowMuteIcon(true);

    setTimeout(() => {
      setShowMuteIcon(false);
    }, 1000);
  };
  const podcastLikes = (item: any) => {
    Stopplay();
    navigation.push('PodcastLikeList', {
      ActionId: item.podcastId,
      userId: user.userId,
    });
  };
  const podcastviewList = (item: any) => {
    Stopplay();
    navigation.push('PodcastViewList', {
      ActionId: item.podcastId,
      userId: user.userId,
    });
  };
  const handleViewerAdd = async () => {
    try {
      
      const res = await AddPodcastViwer(user.userId, item.podcastId);
    } catch (e) {}
  };
  const [likeProcessingStatus, setlikeProcessingStatus] = useState(false);
  const postLike = async (item: any) => {
    if (likeProcessingStatus) return;

    setlikeProcessingStatus(true);
    try {
      const result = {
        data: {
          likeCount: 0,
          commentCount: 0,
          viewerCount: 0,
          userLiked: 0,
        },
      };
      if (StoryState?.userLiked && StoryState?.userLiked == 1) {
        const result = await PodcastUnlike(user.userId, item.podcastId);

        setStoryState({
          likeCount: result.data.likeCount,
          reactionCount: result.data.commentCount,
          viewerCount: result.data.viewerCount,
          userLiked: result.data.userLiked,
        });
      } else {
        const result = await PodcastLike(user.userId, item.podcastId);

        setStoryState({
          likeCount: result.data.likeCount,
          reactionCount: result.data.commentCount,
          viewerCount: result.data.viewerCount,
          userLiked: result.data.userLiked,
        });
      }
    } catch (error) {
    } finally {
      // Reset processing status regardless of outcome
      setlikeProcessingStatus(false);
    }
  };

  return (
    <View
      style={{
        width: windowWidth,
        height: windowHeight,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Video
        ref={videoRef}
        onBuffer={onBuffer}
        onError={onError}
        repeat
        resizeMode="cover"
        paused={Play}
        source={{uri: `${item.media_url}`}}
        muted={mute}
        style={{
          width: windowWidth,
          height: windowHeight,
          position: 'absolute',
        }}
      />

      {isBuffering && (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="large" color="Blue" />
        </View>
      )}
      {showMuteIcon && (
        <View
          style={{
            position: 'absolute',
            backgroundColor: 'rgba(52,52,52,0.6)',
            borderRadius: 20,
            padding: 10,
          }}>
          {mute ? (
            <VolumeMute accessible={true} accessibilityLabel="Volume Mute" />
          ) : (
            <Volume accessible={true} accessibilityLabel="Volume" />
          )}
        </View>
      )}
      <View
        style={{
          position: 'absolute',
          width: windowWidth,
          zIndex: 1,
          bottom: 50,
          padding: 15,
          // left: 10,
        }}>
        <TouchableOpacity style={{width: 150}}>
          <View
            style={{
              width: 300,
              flexDirection: 'row',
              alignItems: 'center',
              bottom: 40,
            }}>
            <Text style={{color: 'white', fontSize: 16}}>{' Broker App '}</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 20,
          right: 10,
          zIndex: 9999999,
        }}>
        <TouchableOpacity
          onPress={() => handleMuteToggle()}
          style={{
            padding: 10,
            marginBottom: 20,
            alignItems: 'center',
            borderRadius: 8,
            backgroundColor: '#00000080',
          }}>
          {mute ? (
            <VolumeMute accessible={true} accessibilityLabel="Volume Mute" />
          ) : (
            <Volume accessible={true} accessibilityLabel="volume" />
          )}
        </TouchableOpacity>
        <Box
          display="flex"
          alignItems="center"
          style={{
            padding: 10,
            marginBottom: 20,
            borderRadius: 8,
            backgroundColor: '#00000080',
          }}>
          <TouchableOpacityWithPermissionCheck
            tagNames={[LikeWhite, UnLikeWhite]}
            permissionsArray={userPermissions}
            permissionEnum={
              StoryState.userLiked == 1
                ? PermissionKey.AllowLikePodcast
                : PermissionKey.AllowUnlikePodcast
            }
            onPress={() => postLike(item)}
            style={{alignItems: 'center'}}>
            {StoryState.userLiked == 1 ? (
              <LikeWhite accessible={true} accessibilityLabel="LikeWhite" />
            ) : (
              <UnLikeWhite
                accessible={true}
                accessibilityLabel="Unlike White"
              />
            )}
          </TouchableOpacityWithPermissionCheck>
          <TextWithPermissionCheck
            permissionEnum={PermissionKey.AllowViewPodcastLikes}
            permissionsArray={userPermissions}
            onPress={() => podcastLikes(item)}
            fontColor={colors.white}
            type={'L16'}
            color={colors.white}
            style={{alignItems: 'center'}}>
            {StoryState.likeCount}
          </TextWithPermissionCheck>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          style={{
            ...localStyles.likeBtnStyle,
            marginBottom: 20,
            borderRadius: 8,
            backgroundColor: '#00000080',
          }}>
          <TouchableOpacityWithPermissionCheck
            fontColor={colors.white}
            tagNames={[OpenEye, ZText]}
            permissionEnum={PermissionKey.AllowViewPodcastViewers}
            permissionsArray={userPermissions}
            onPress={() => podcastviewList(item)}>
            <OpenEye accessible={true} accessibilityLabel="Open Eye" />
            <Center>
              <ZText type={'L16'} style={{color: colors.white}}>
                {item.viewerCount}
              </ZText>
            </Center>
          </TouchableOpacityWithPermissionCheck>
        </Box>
      </View>
    </View>
  );
};

export default SingleReelInsta;

const localStyles = StyleSheet.create({
  likeBtnStyle: {
    flex: 1,
    marginBottom: 20,
    justifyContent: 'center',
  },
});
