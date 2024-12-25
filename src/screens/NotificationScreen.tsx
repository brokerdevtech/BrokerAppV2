/* eslint-disable react-native/no-inline-styles */
import {
  imagesBucketcloudfrontPath,
  moderateScale,
  PermissionKey,
} from '../config/constants';
import ZAvatarInitials from '../sharedComponents/ZAvatarInitials';
import ZText from '../sharedComponents/ZText';
import FastImage from '@d11/react-native-fast-image';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useSelector} from 'react-redux';
import {
  getNotification,
  updateNotification,
} from '../../BrokerAppCore/services/getNotification';
import {
  GetDashboardData,
  UpdateDashboardData,
} from '../../BrokerAppCore/services/authService';
import {setDashboard} from '../../BrokerAppCore/redux/store/Dashboard/dashboardSlice';
import {updateConnections} from '../../BrokerAppCore/services/connections';
import LoadingSpinner from '../sharedComponents/LoadingSpinner';
import NoDataFound from '../sharedComponents/NoDataFound';
import typography from '../themes/typography';
import AppBaseContainer from '../hoc/AppBaseContainer_old';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';
import ButtonWithPermissionCheck from '../sharedComponents/ButtonWithPermissionCheck';
import {colors} from '../themes';
import {Icon} from '../../components/ui/icon';
import {CloseBlack, CloseIcon} from '../assets/svg';
import {Color} from '../styles/GlobalStyles';
import useUserJourneyTracker from '../hooks/Analytics/useUserJourneyTracker';
const NotificationItem = ({
  item,
  index,
  handleConnection,
  handleNotificationPress,
  mediaData,
  selectedNotification,
}) => {
  const {
    title,
    body,
    metaData,
    notifcationId,
    status,
    createdOn,
    profileImage,
    type,
  } = item;
  let response = body;





  const getTimeDifference = createdAt => {
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
  
      return created.fromNow(); 
  };

  const userPermissions = useSelector(
    (state: RootState) => state.user.user.userPermissions,
  );
  const user = useSelector((state: RootState) => state.user.user);
  const timeDifference = getTimeDifference(createdOn);
  const parsedMetaData = JSON.parse(metaData);
  const connectionRequestId = parsedMetaData?.ConnectionRequestId;
  const isSelected = notifcationId === selectedNotification;
  const PostId = parsedMetaData?.PostId;
  const shouldRenderButtons = type === 1;
  const navigation = useNavigation();
  // const gotoDetail = (postId: any, postTitle: string, profileImage: any) => {
  //   navigation.push(StackNav.PostDetailScreen, {
  //     postId: postId,
  //     postTitle: postTitle,
  //     profileImage: profileImage,
  //   });
  // };

  const onPressUser = CommentUser => {
    if (CommentUser?.userId === user.userId) {
      navigation.navigate('ProfileScreen');
    } else {
      navigation.push('ProfileDetail', {
        userName: CommentUser?.postedBy,
        userImage: CommentUser?.profileImage,
        userId: CommentUser?.userId,
        loggedInUserId: user.userId,
      });
    }
  };

  const firstMediaItem = mediaData.length > 0 && (
    <TouchableOpacity>
      <FastImage
        style={{width: 32, height: 32}}
        source={{uri: `${imagesBucketcloudfrontPath}${mediaData[0].mediaBlob}`}}
      />
    </TouchableOpacity>
  );

  const NavigationMedia = {
    postedBy: `${parsedMetaData.FirstName} ${parsedMetaData.LastName}`,
    profileImage: profileImage,
    userId: parsedMetaData.UserId,
  };
  // console.log(item, 'firstMediaItem');
  return (
    <View key={index} style={[styles.messageContainer]}>
      <View style={styles.imageContainer}>
        <ZAvatarInitials
          item={NavigationMedia}
          sourceUrl={profileImage}
          iconSize="md"
          styles={styles.ImageC}
          name={`${parsedMetaData.FirstName} ${parsedMetaData.LastName}`}
          onPress={() => onPressUser(NavigationMedia)}></ZAvatarInitials>
      </View>
      {shouldRenderButtons && (
        <View style={styles.message}>
          <View style={styles.body}>
            <ZText type={'M14'} style={[styles.capitalize]}>
              {response}
            </ZText>
            <ZText type={'M12'}>{timeDifference}</ZText>
          </View>
        </View>
      )}
      {!shouldRenderButtons && (
        <View style={styles.message1}>
          <TouchableOpacity style={styles.body}>
            <ZText type={'M14'}>{body}</ZText>
            <ZText type={'M12'}>{timeDifference}</ZText>
          </TouchableOpacity>
        </View>
      )}
      <View
        style={{
          flexDirection: 'column',
          width: '30%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {shouldRenderButtons && (
          <View style={styles.iconContainer}>
            <ButtonWithPermissionCheck
              title="Accept"
              permissionsArray={userPermissions}
              containerStyle={[
                {
                  borderColor: '#bc4a50',
                  borderWidth: 1,
                  paddingVertical: 10,
                  paddingHorizontal: 10,
                  borderRadius: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 5,
                },
              ]}
              color={colors.white}
              textType="b14"
              bgColor={colors.primary}
              onPress={() =>
                handleConnection(
                  'accept',
                  connectionRequestId,
                  notifcationId,
                  status,
                )
              }
              permissionEnum={PermissionKey.AllowUpdateConnection}
            />

            <ButtonWithPermissionCheck
              title=""
              permissionsArray={userPermissions}
              color={colors.white}
              textType="b14"
              containerStyle={[
                {
                  borderColor: '#bc4a50',
                  borderWidth: 1,
                  padding: 10,

                  borderRadius: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 5,
                },
              ]}
              bgColor={'rgba(188, 74, 80 ,0.1)'}
              onPress={() =>
                handleConnection(
                  'reject',
                  connectionRequestId,
                  notifcationId,
                  status,
                )
              }
              frontIcon={<Icon as={CloseBlack} stroke={'#000000'} />}
              permissionEnum={PermissionKey.AllowUpdateConnection}
            />
            {/* <TouchableOpacity
              style={{
                flex: 1,
                marginLeft: 5, // Adjust the left margin to your preference
                backgroundColor: 'rgba(1, 125, 197, 0.1)', // Change the background color for rejected buttons
              }}></TouchableOpacity> */}
          </View>
        )}
      </View>
    </View>
  );
};

const NotificationScreen: React.FC = ({
  isPageSkeleton,
  toggleSkeletonoff,
  toggleSkeletonOn,
  // setLoading,
  navigation,
  user,
  color,
  route,
  toast,
}) => {
  //
  const [notificationData, setNotificationData] = useState(null);
  const [acceptedNotifications, setAcceptedNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [connectionUpdated, setConnectionUpdated] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [firstloading, setfirstloading] = useState(true);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [mediaData, setMediaData] = useState([]);
  const [userData, setUserData] = useState([]);
  const {logButtonClick} = useUserJourneyTracker(`My Notifications`);
  // const gotoDetail = (postId: any, postTitle: string, profileImage: any) => {
  //   navigation.push(StackNav.PostDetailScreen, {
  //     postId: postId,
  //     postTitle: postTitle,
  //     profileImage: profileImage,
  //   });
  // };
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const data = await getNotification(page, pageSize);
        // console.log("========data");
        // console.log(data);
        setNotificationData(data.data.notifications);

        UpdateDashboardData(user.userId)
          .then(data => {
            GetDashboardData(user.userId)
              .then(data => {
                store.dispatch(setDashboard(data.data));
              })
              .catch(error => {});
          })
          .catch(() => {});
      } catch (error) {
        console.error('Error fetching notification data:', error);
      } finally {
        setfirstloading(false);
        setLoading(false);
      }
    };

    fetchData();
  }, []);
    const fetchMoreData = async () => {
      if (loading || !hasMoreData) return;

      setLoading(true);
      try {
        const nextPage = page + 1;
        const data = await getNotification(nextPage, pageSize);
        // notificationData.data.notifications
        //       console.log("========data");
        //  console.log(data);
        // const apiData = JSON.stringify(data.data.notifications);
        if (data.data.notifications.length > 0) {
          setNotificationData(prevData => [
            ...prevData,
            ...data.data.notifications,
          ]);
          setPage(nextPage);
        } else {
          setHasMoreData(false);
        }
        //
        // setNotificationData(data);
      } catch (error) {
        console.error('Error fetching notification data:', error);
      } finally {
        setLoading(false);
      }
    };
  const handleNotificationPress = async (notifcationId, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    setSelectedNotification(notifcationId);

    try {
      const response = await updateNotification(
        notifcationId,
        user.userId,
        newStatus,
      );

      // console.log("response ", response)
      const newData: any = await getNotification(page, pageSize);
      setNotificationData(newData.data.notifications);
      //
    } catch (error) {
      console.error('Error updating notification:', error);
    }
  };
  const handleConnection = async (
    action,
    connectionRequestId,
    notifcationId,
    currentStatus,
  ) => {
    try {
      setLoading(true);
      const userId = user.userId;
      let status = 0;
      if (action == 'accept') {
        status = 1;
      }

      if (action == 'reject') {
        status = 2;
      }

      const result = await updateConnections(
        userId,
        connectionRequestId,
        status,
      );
      setLoading(false);

      if (result?.status === 'success') {
        // await handleNotificationConnection(notifcationId);
        setLoading(false);
        toast.show({
          description: result.statusMessage,
        });
      } else {
        setLoading(false);
        toast.show({
          description: result.error,
        });
      }
      handleNotificationPress(notifcationId, currentStatus);
    } catch (error) {
      // console.error('Error fetching data:', error);
      // toast.show({
      //   description: 'Oops something went wrong, please try after sometime.',
      // });
    }
  };

  if (firstloading) {
    return <LoadingSpinner isVisible={true} />;
  }
  if (notificationData != null && notificationData.length == 0) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <NoDataFound />
      </View>
    );
  }

  // const fetchPostDetails = async postId => {
  //   try {
  //     const postDetails = await getPostDetails(postId);
  //     setMediaData(postDetails.data.postMedia);
  //
  //   } catch (error) {
  //     console.error('Error fetching post details:', error);
  //   }
  //   return (
  //     <View>
  //       <Text>{mediaData}</Text>
  //     </View>
  //   );
  // };

  //

  return (
    <FlatList
      data={notificationData}
      keyExtractor={(item, index) => String(index)}
      renderItem={({item, index}) => (
        <NotificationItem
          item={item}
          index={index}
          handleConnection={handleConnection}
          handleNotificationPress={handleNotificationPress}
          mediaData={mediaData}
          selectedNotification={selectedNotification}
        />
      )}
      maxToRenderPerBatch={5}
      initialNumToRender={10}
        onEndReached={fetchMoreData}
        onEndReachedThreshold={0.2}
      ListEmptyComponent={() =>
        notificationData && loading ? null : <NoDataFound />
      }
      ListFooterComponent={() =>
        loading ? <ActivityIndicator size="large" color="blue" /> : null
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', // Align content at the top
    alignItems: 'center',
    padding: 10, // Add padding at the top
  },
  capitalize: {
    textTransform: 'capitalize',
  },
  messageContainer: {
    // borderBottomWidth: 1,
    borderColor: '#ddd',
    // padding: 10,
    paddingHorizontal: 16,
    marginBottom: 30,
    // borderRadius: 10,
    width: '100%',
    flexDirection: 'row',
    // justifyContent: '', // Align content at the top
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontWeight: '700',
    ...typography.fontSizes.f16,
    marginBottom: 2,
    color: 'black',
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
  },
  message: {
    width: '50%',
    paddingHorizontal: 10,
  },
  message1: {
    width: '70%',
    paddingHorizontal: 10,
  },
  iconContainer: {
    height: 40, // Adjust the height to your preference
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  ImageC: {
    width: moderateScale(30),
    height: moderateScale(30),
    borderRadius: moderateScale(30),
    // marginRight: moderateScale(10),
  },
  imageContainer: {
    width: '15%',
  },
  ButtonContainer: {
    height: 25,
    width: 50,
    borderWidth: 1,
    borderColor: '#017DC5',
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: 'rgba(1, 125, 197, 0.1)',
  },

  selectedNotification: {
    backgroundColor: '#fff', // Change the background color for selected notifications
  },
  acceptedNotification: {
    backgroundColor: 'transparent', // Change the background color for accepted notifications
  },
  datetimeContainer: {
    // justifyContent: 'center',
    // alignItems: 'center',
    // marginTop: 4,
    // width: '8%', // Adjust the width based on your layout
    marginLeft: 100,
  },
  datetimeText: {
    fontSize: 12,
    color: 'gray',
  },
});

export default AppBaseContainer(NotificationScreen, 'Notification');
