import {Dimensions, Platform, StatusBar} from 'react-native';
import DeviceInfo from 'react-native-device-info';

let iPhoneX = screenHeight === 812 ? true : false;

// StatusBar Height
export const STATUSBAR_HEIGHT =
  Platform.OS === 'ios' ? (iPhoneX ? 44 : 22) : StatusBar.currentHeight;
export const screenHeight = Dimensions.get('window').height - STATUSBAR_HEIGHT;
export const screenWidth = Dimensions.get('window').width;
export const screenFullHeight = Dimensions.get('window').height;
export const isAndroid = Platform.OS === 'ios' ? false : true;

let sampleHeight = 926;
let sampleWidth = 428;

export const isShowLog = true;

// Check if device is Tablet
export const isTablet = () => {
  return DeviceInfo.isTablet();
};

//Get Width of Screen
export function getWidth(value) {
  return (value / sampleWidth) * screenWidth;
}

//Get Height of Screen
export function getHeight(value) {
  return (value / sampleHeight) * screenHeight;
}
const scale = size => (screenWidth / sampleWidth) * size;

// Moderate Scale Function
export function moderateScale(size, factor = 0.5) {
  return size + (scale(size) - size) * factor;
}

export const iosReelHeight = screenFullHeight - getHeight(100);
export const androidReelHeight = screenFullHeight - getHeight(70);

export const THEME = 'THEME';
export const APP_OPEN_FIRST_TIME = 'APP_OPEN_FIRST_TIME';
export const ACCESS_TOKEN = 'ACCESS_TOKEN';

export const GenderData = [
  {label: 'Male', value: 'male'},
  {label: 'Female', value: 'female'},
  {label: 'Other', value: 'other'},
];

export enum PermissionKey {
  Unknown = 0,
  AllowSendConnection = 1,
  AllowUpdateConnection = 2,
  AllowDeleteConnection = 3,
  AllowViewConnection = 4,
  AllowFollow = 5,
  AllowUnfollow = 6,
  AllowViewFollowers = 7,
  AllowViewFollowings = 8,
  AllowViewNotification = 9,
  AllowViewPodcast = 10,
  AllowLikePodcast = 11,
  AllowUnlikePodcast = 12,
  AllowViewPodcastLikes = 13,
  AllowViewPodcastViewers = 14,
  AllowCommentOnPodcast = 15,
  AllowViewPodcastComment = 16,
  AllowLikePodcastComment = 17,
  AllowUnlikePodcastComment = 18,
  AllowDeletePodcastComment = 19,
  AllowReplyPodcastComment = 20,
  AllowDeleteReplyPodcastComment = 21,
  AllowViewPodcastCommentReplies = 22,
  AllowLikePodcastCommentReply = 23,
  AllowUnlikePodcastCommentReply = 24,
  AllowAddPost = 25,
  AllowDeletePost = 26,
  AllowViewMyPost = 27,
  AllowViewDashboardPost = 28,
  AllowViewPostDetail = 29,
  AllowAddPostBuyer = 30,
  AllowViewPostBuyers = 31,
  AllowLikePost = 32,
  AllowUnlikePost = 33,
  AllowViewPostLikes = 34,
  AllowViewPostViewers = 35,
  AllowCommentOnPost = 36,
  AllowViewPostComment = 37,
  AllowLikePostComment = 38,
  AllowUnlikePostComment = 39,
  AllowDeletePostComment = 40,
  AllowReplyPostComment = 41,
  AllowDeleteReplyPostComment = 42,
  AllowViewPostCommentReplies = 43,
  AllowLikePostCommentReply = 44,
  AllowUnlikePostCommentReply = 45,
  AllowSearchUser = 46,
  AllowSearchPost = 47,
  AllowAddStory = 48,
  AllowAddStoryReaction = 49,
  AllowViewStoryReaction = 50,
  AllowDeleteStory = 51,
  AllowViewMyStory = 52,
  AllowViewDashboardStory = 53,
  AllowLikeStory = 54,
  AllowUnLikeStory = 55,
  AllowViewStoryLikes = 56,
  AllowViewStoryViewers = 57,
  AllowChat = 58,
}



const imagesBucketPath = 'https://broker2023.s3.ap-south-1.amazonaws.com/';
const imagesBucketcloudfrontPath = 'https://d37tb8g7dt82h3.cloudfront.net/';

const storiesVideosBucketPath = 'stories/originals/videos/';
const storiesImagesBucketPath = 'stories/originals/images/';
const postsVideosBucketPath = 'posts/originals/videos/';
const postsImagesBucketPath = 'posts/originals/images/';
const podcastsVideosBucketPath = 'podcasts/originals/videos/';
const podcastsImagesBucketPath = 'podcasts/originals/images/';
// const imagesBucketPath = 'https://broker2023.s3.ap-south-1.amazonaws.com/';
// const imagesBucketPath = 'https://broker2023.s3.ap-south-1.amazonaws.com/';
// const imagesBucketPath = 'https://broker2023.s3.ap-south-1.amazonaws.com/';
// const imagesBucketPath = 'https://broker2023.s3.ap-south-1.amazonaws.com/';



export {
  imagesBucketPath,
  imagesBucketcloudfrontPath,
   storiesVideosBucketPath ,
   storiesImagesBucketPath ,
   postsImagesBucketPath,
   postsVideosBucketPath,
   podcastsVideosBucketPath ,
   podcastsImagesBucketPath ,
  
};
