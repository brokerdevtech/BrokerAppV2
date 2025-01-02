/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/self-closing-comp */
// src/screens/SettingsScreen.tsx
import React, {useState, useEffect, useRef, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Pressable,
} from 'react-native';

// import {Avatar, Box, Button, HStack} from 'native-base';

import {useSelector} from 'react-redux';

import strings from '../i18n/strings';

import {
  getOtherProfile,
  addToMyNetwork,
} from '../../BrokerAppCore/services/profileService';
import {styles} from '../themes';

// import ProfileSection from '../components/ProfileSection';
// import { Color} from "../styles/GlobalStyles";
// import { colors } from 'native-base/lib/typescript/theme/styled-system';
import Share from 'react-native-share';

import typography from '../themes/typography';

import ImageView from 'react-native-image-viewing';

import type {Channel as StreamChatChannel} from 'stream-chat';
import {StreamChatGenerics} from '../types';

import {GetStreamToken} from '../../BrokerAppCore/services/authService';

import {Color} from '../styles/GlobalStyles';
import TouchableOpacityWithPermissionCheck from './TouchableOpacityWithPermissionCheck';
import AppBaseContainer from '../hoc/AppBaseContainer_old';
import {
  getHeight,
  imagesBucketcloudfrontPath,
  moderateScale,
  PermissionKey,
} from '../config/constants';
import ZText from './ZText';
import {ChevronRightIcon, Icon, ShareIcon} from '../../components/ui/icon';
import ZSafeAreaView from './ZSafeAreaView';
import {useFocusEffect} from '@react-navigation/native';
import ZHeader from './ZHeader';
import {Box} from '../../components/ui/box';
import ZAvatarInitials from './ZAvatarInitials';
import RenderUserDetail from './RenderUserDetails';
import FollowUnfollowComponent from './FollowUnfollowButton';
import ButtonWithPermissionCheck from './ButtonWithPermissionCheck';
import {Chat_icon, Network_icon} from '../assets/svg';
import ZButton from './ZButton';

const OtherProfileScreen: React.FC = ({
  toast,
  isPageSkeleton,
  toggleSkeletonoff,
  toggleSkeletonOn,
  setLoading,
  navigation,
  user,
  color,
  route,
  pageTitle,
  toastMessage,
}) => {
  const userId = route.params.userId;

  const userPermissions = useSelector(
    (state: RootState) => state.user.user.userPermissions,
  );
  const connectionId = route.params.connectionId || '';
  const userName = route.params.userName || '';
  const userImg = route.params.userImage || '';
  const loggedInUserId = route.params.loggedInUserId || '';
  const shareId = route.params.shareId || 0;
  const [ProfileData, setProfileData] = useState(null);
  const [pagesTitle, setpagesTitle] = useState('');
  const [UserfollowersData, setUserfollowersData] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isrefresh, setisrefresh] = useState(false);
  const [isAddedToMyNetwork, setIsAddedToMyNetwork] = useState(false);
  const [isViewerVisible, setViewerVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState([]);
  const currentChannel = useRef<StreamChatChannel<StreamChatGenerics>>();
  const isDraft = useRef(true);

  const initialData = [{key: 'initial'}];
  const [data, setData] = useState(initialData);

  const [refreshing, setRefreshing] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      toggleSkeletonOn();

      getUserProfile();
      return () => {
        // Code to execute when the screen loses focus (optional)
      };
    }, [userId,isFollowing, isrefresh]),
  );
  const selectprofilepic = () => {
    // console.log(ProfileData);
    if (ProfileData?.profileImage != '') {
      setCurrentImage([
        {
          uri: `${imagesBucketcloudfrontPath}${ProfileData?.profileImage}`,
        },
      ]);
      setViewerVisible(true);
    }
  };
  const getUserProfile = async () => {
    try {
      //
      const result = await getOtherProfile(userId, user.userId);
      //
      //
      //     console.log("--------result");
      // console.log(result);
      setProfileData(result.data);

      const Userfollower: any = [];
      // Userfollower.push({title: 'Posts', value: result.data.postCount});
      Userfollower.push({
        title: strings.followers,
        value: result.data.followers,
      });
      Userfollower.push({
        title: strings.following,
        value: result.data.followings,
      });
      // console.log("-----------ProfileData");
      // console.log(ProfileData);
      setUserfollowersData(Userfollower);
      // setCountryData(result.data);
      setpagesTitle(result.data?.profileName);
      pageTitle(result.data?.profileName);
      toggleSkeletonoff();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const handleFollow = () => {
    // Simulate the follow action, you should replace this with your actual logic
    // Toggle isFollowing and update the follower count
    // setIsFollow(true);
    // setIsFollowing(true);
    // setUserfollowersData(prevData => {
    //   const newFollowersCount =
    //     prevData.find(item => item.title === 'Followers').value + 1;
    //   return prevData.map(item =>
    //     item.title === 'Followers' ? {...item, value: newFollowersCount} : item,
    // );
    // });
    setIsFollowing(true);
  };
  const handleUnfollow = () => {
    // Simulate the unfollow action, you should replace this with your actual logic
    // Toggle isFollowing and update the follower count
    // setIsFollow(false);
    setIsFollowing(false);
    // setUserfollowersData(prevData => {
    //   const newFollowersCount =
    //     prevData.find(item => item.title === 'Followers').value - 1;
    //   return prevData.map(item =>
    //     item.title === 'Followers' ? {...item, value: newFollowersCount} : item,
    //   );
    // });
  };

  // useEffect(() => {
  //   getUserProfile();
  // }, [isFollowing, isrefresh]);

  const colors = useSelector(state => state.theme.theme);
  const [isSelect, setIsSelect] = useState(0);
  // const switchAccountRef = createRef(null);
  const categoryData = [
    {
      id: 0,
      icon: 'apps',
      onPress: () => setIsSelect(0),
      name: 'Posts',
    },
    // {
    //   id: 1,
    //   icon: 'lock-closed',
    //   onPress: () => setIsSelect(1),
    //   name: 'Shorts',
    // },
    // {
    //   id: 2,
    //   icon: 'bookmark',
    //   onPress: () => setIsSelect(2),
    //   name: 'Tags',
    // },
  ];

  const onPressMessage = item => {
    //   navigation.navigate(StackNav.Chat, {
    //     userName: 'Andrew Ainsley',
    //     userImage: 'https://i.ibb.co/9psxy8J/user4.png',
    // });
  };

  // const renderReelItem = ({item}) => (
  //   <ReelComponent data={item?.views} reelUrl={item?.poster} isPlay={true} style={undefined} />
  // );
  const generateLink = async () => {
    try {
      const response = await fetch(
        `https://tinyurl.com/api-create.php?url=${encodeURIComponent(
          `brokerapp://ProfileDetails/${userId}`,
        )}`,
      );
      const text = await response.text();
      return text;

      // const link = await dynamicLinks().buildShortLink(
      //   {
      //     link: `https://brokerapp.page.link/profiledetails/${userId}`,
      //     domainUriPrefix: 'https://brokerapp.page.link',
      //     android: {
      //       packageName: 'com.brokerapp.broker',
      //     },
      //   },
      //   dynamicLinks.ShortLinkType.DEFAULT,
      // );

      // return link;
    } catch (error) {}
  };

  const shareProfile = async () => {
    const getLink = await generateLink();
    try {
      await Share.open({
        message: getLink,
      });
    } catch (error) {}
  };
  const tokenProvider: TokenOrProvider = async () => {
    try {
      const response = await GetStreamToken(user.userId);

      const streamAccessToken = response.data.getStreamAccessToken;
      return streamAccessToken;
    } catch (error) {
      throw error;
    }
  };
  const chatProfilePress = async () => {
    const members = [user.userId.toString(), userId.toString()];

    // const chatClient = StreamChat.getInstance(chatApiKey);

    // const userapp = {
    //   id: user.userId.toString(),
    //   name: `${user?.firstName.toString()} ${user?.lastName.toString()}` ,
    // };

    // const connectedUser =    await chatClient.connectUser(userapp, await tokenProvider());

    // const channels = await chatClient.queryChannels({
    //   distinct: true,
    //   members,
    // });
    // if (channels.length === 1) {
    //   // Channel already exist
    //   currentChannel.current = channels[0];
    //   isDraft.current = false;
    // } else {
    //   // Channel doesn't exist.
    //   isDraft.current = true;

    //   const channel = AppChatClient.channel('messaging', {
    //     members,
    //   });

    //   // Hack to trick channel component into accepting channel without watching it.
    //   channel.initialized = true;
    //   currentChannel.current = channel;
    // }
    // navigation.replace('ChannelScreen', {
    //   channelId: currentChannel.current?.id,
    // });
    navigation.navigate('AppChat', {
      defaultScreen: 'ChannelScreen',
      defaultParams: members,
    });
    // navigation.navigate('AppChat', {
    //   screen: 'ChannelScreen',
    //   params: {  channelId: currentChannel.current?.id, }
    // });
  };

  const AddToNetwork = async () => {
    setLoading(true);
    try {
      let InUserId = loggedInUserId;
      // console.log(loggedInUserId);
      // console.log(userId);
      // console.log(shareId);

      if (shareId == 1) {
        InUserId = user.userId;
      }

      const result = await addToMyNetwork(InUserId, userId);

      if (result?.status === 'success') {
        toastMessage(result.statusMessage);

        setisrefresh(!isrefresh);
      } else {
        toastMessage(result.error);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.show({
        description: 'Oops something went wrong, please try after sometime.',
      });
      //  console.error('Error fetching data:', error);
    }
  };

  const RightIcon = () => {
    return (
      <TouchableOpacity onPress={shareProfile}>
        <Icon as={ShareIcon} />
      </TouchableOpacity>
    );
  };
  // clg;

  const PostHeader = () => {
    return (
      <>
        <ZHeader
          // title={pagesTitle}
          isHideBack={false}
          isLeftIcon={false}
          rightIcon={<RightIcon />}
        />
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            style={{marginBottom: 20}}
            onPress={selectprofilepic}>
            <ZAvatarInitials
              sourceUrl={ProfileData?.profileImage}
              styles={localStyles.userImage}
              iconSize="xl"
              name={ProfileData?.profileName}
              isDisable={true}
            />
          </TouchableOpacity>

          <ZText
            type="R18"
            align={'center'}
            style={[
              styles.mt5,
              localStyles.capitalize,
              typography.fontBold.semiBold,
            ]}>
            {ProfileData?.profileName}
          </ZText>
        </View>
        <View
          style={[
            styles.flexRow,
            styles.justifyEvenly,
            // styles.pl25,
            styles.flexGrow1,
            styles.pt15,
            styles.mt15,
          ]}>
          {UserfollowersData.map((item, index) => (
            <RenderUserDetail
              item={item}
              key={index}
              ParentUserData={ProfileData}
            />
          ))}
        </View>

        <View style={(styles.flexRow, localStyles.shareButton)}>
          <View style={[localStyles.followBtnContainer]}>
            {ProfileData && loggedInUserId !== userId && (
              <FollowUnfollowComponent
                isFollowing={ProfileData?.isFollowing}
                followedId={userId}
                onFollow={handleFollow}
                onUnfollow={handleUnfollow}
              />
            )}
          </View>
          {loggedInUserId != userId &&
            (ProfileData.myNetworkRequestStatus == 'NotSent' ||
              ProfileData.myNetworkRequestStatus == '') && (
              <ButtonWithPermissionCheck
                title={
                  loggedInUserId === userId
                    ? 'Your Profile'
                    : ProfileData?.isAddedToMyNetwork
                    ? 'Network added'
                    : 'Add to network'
                }
                color={colors.primary}
                textType="r16"
                onPress={AddToNetwork}
                containerStyle={[
                  localStyles.buttonContainer,
                  {borderColor: colors.grayScale3},
                ]}
                bgColor={
                  loggedInUserId === userId
                    ? colors.grayScale3
                    : ProfileData?.isAddedToMyNetwork
                    ? colors.grayScale3
                    : colors.grayScale3
                }
                frontIcon={
                  loggedInUserId !== userId &&
                  !ProfileData?.isAddedToMyNetwork ? (
                    <Icon
                      as={Network_icon}
                      color={colors.primary}
                      style={styles.mr5}
                    />
                  ) : undefined
                }
                disabled={
                  loggedInUserId === userId || ProfileData?.isAddedToMyNetwork
                }
                permissionEnum={PermissionKey.AllowSendConnection}
                permissionsArray={userPermissions}
              />
            )}

          {loggedInUserId != userId &&
            ProfileData.myNetworkRequestStatus == 'Pending' && (
              <ZButton
                title={' Request Pending'}
                containerStyle={[
                  localStyles.buttonContainer,
                  {borderColor: colors.grayScale3},
                ]}
                bgColor={colors.white}
                disabled={true}></ZButton>
            )}
          {loggedInUserId != userId &&
            ProfileData.myNetworkRequestStatus == 'Rejected' && (
              <ZButton
                title={' Request Rejected'}
                containerStyle={[
                  localStyles.buttonContainer,
                  {borderColor: colors.grayScale3},
                ]}
                bgColor={colors.white}
                disabled={true}></ZButton>
            )}
          {loggedInUserId != userId &&
            ProfileData.myNetworkRequestStatus == 'ConnectionDeleted' && (
              <ZButton
                title={'Request Connection Deleted'}
                containerStyle={[
                  localStyles.buttonContainer,
                  {borderColor: colors.grayScale3},
                ]}
                bgColor={colors.white}
                disabled={true}></ZButton>
            )}
          {loggedInUserId != userId &&
            ProfileData.myNetworkRequestStatus == 'Accepted' && (
              <ZButton
                title={'Request Accepted'}
                containerStyle={[
                  localStyles.buttonContainer,
                  {borderColor: colors.grayScale3},
                ]}
                bgColor={colors.white}
                disabled={true}></ZButton>
            )}
          <TouchableOpacityWithPermissionCheck
            permissionEnum={PermissionKey.AllowChat}
            permissionsArray={userPermissions}
            tagNames={[Icon]}
            onPress={chatProfilePress}>
            {/* <Icon as={Chat_icon} size="xxl" /> */}
            <Chat_icon height="30" width="30" color={colors.primary} />
            {/* <Ionicons
              name="chatbubble-outline"
              size={moderateScale(30)}
  
              color={colors.dark ? colors.primary : colors.primary}
            /> */}
          </TouchableOpacityWithPermissionCheck>
        </View>
      </>
    );
  };

  const dummyData = [{key: 'dummy'}];
  const handleCategoryPress = screen => {
    navigation.navigate(screen.navigationScreen, {
      listType: screen.listType,
      categoryId: screen.categoryId,
      userId: userId,
    });
  };

  const categories = [
    {
      name: 'Property',

      navigationScreen: 'MyItemListScreen',
      postCount: ProfileData?.realEstatePostCount,
      listType: 'RealEstate',
      categoryId: '1',
    },

    {
      name: 'Cars',
      navigationScreen: 'MyItemListScreen',
      postCount: ProfileData?.carPostCount,
      listType: 'Car',
      categoryId: '2',
    },
  ];
  const [TabSelect, setTabSelect] = useState(0);

  const onTabSelectChange = useCallback(index => {
    setTabSelect(index);
  }, []);

  const renderContent = () => {
    return (
      <>
        <View style={localStyles.catheaderContainer}>
          {ProfileData?.biodata && ProfileData.biodata !== 'N/A' && (
            <View style={[localStyles.categoriesContainer]}>
              <Text style={localStyles.pageTitle}>About</Text>

              <View style={[localStyles.categoryButton]}>
                <ZText type="r18" style={localStyles.bioText}>
                  {ProfileData.biodata}
                </ZText>
              </View>
            </View>
          )}
        </View>
        <View style={localStyles.headerContainer}>
          <View style={[localStyles.categoriesContainer]}>
            <Text style={localStyles.pageTitle}>Posts</Text>
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  localStyles.categoryButton,
                  !category.navigationScreen &&
                    localStyles.disabledCategoryButton,
                ]}
                disabled={!category.navigationScreen}
                onPress={() => handleCategoryPress(category)}>
                <ZText type={'l18'}>{category.name}</ZText>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                  }}>
                  <Text style={localStyles.categoryText}>
                    {category.postCount}
                  </Text>
                  <Icon as={ChevronRightIcon} size="xl" color={Color.primary} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </>
    );
  };
  // console.log(ProfileData);
  return (
    <ZSafeAreaView>
      {/* <ZHeader
        title={pagesTitle}
        isHideBack={false}
        isLeftIcon={false}
        rightIcon={<RightIcon />}
      /> */}
      {/* <PostHeader></PostHeader> */}
      {ProfileData && (
        <FlatList
          data={dummyData}
          ListHeaderComponent={() => <PostHeader />}
          renderItem={renderContent}
          // ListFooterComponent={renderContent}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          // contentContainerStyle={styles.contentContainer}
        />

        // <ProfileTabs
        //   Header={() => <PostHeader />}
        //   User={{userId: route.params.userId}}
        // />
      )}
      <ImageView
        images={currentImage}
        imageIndex={0}
        visible={isViewerVisible}
        onRequestClose={() => setViewerVisible(false)}
      />
    </ZSafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  root: {
    ...styles.flex,
    ...styles.ph20,
    ...styles.mb20,
  },
  userImage: {
    width: moderateScale(100),
    height: moderateScale(100),
  },
  capitalize: {
    textTransform: 'capitalize',
  },
  bioText: {
    ...typography.fontWeights.Regular,
    ...typography.fontSizes.f18,
    ...styles.mt10,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  buttonContainer: {
    height: getHeight(45),
    width: '45%',
    borderRadius: moderateScale(10),
    borderWidth: moderateScale(1),
  },
  followBtnContainer: {
    width: '40%',
  },
  mainContainer: {
    ...styles.rowSpaceBetween,
    width: '100%',
    // ...styles.mt15,
    alignSelf: 'center',
  },
  tabItemStyle: {
    width: '25%',
    ...styles.itemsCenter,
    ...styles.pv15,
    // ...styles.rowSpaceBetween,
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 15,
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: '5%',
  },
  container: {
    ...styles.rowSpaceBetween,
    ...styles.ph20,
    ...styles.pv15,
    ...styles.center,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  titleText: {
    width: moderateScale(200),
  },
  categoriesContainer: {
    marginTop: 16,
    padding: 10,
    // backgroundColor: '#f0f0f0',
    borderWidth: 2,
    borderColor: Color.borderColor,
    borderRadius: 20,
    flexDirection: 'column',
    // justifyContent: 'space-around',
    // flexWrap: 'wrap',
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    padding: 8,
    borderRadius: 4,
    // width: '30%',
    // backgroundColor: '#fff',
    // marginLeft: 20,
    // borderColor: '#ccc',
    // borderWidth: 1,
  },
  categoryText: {
    // marginTop: 8,
    color: 'grey',
    fontSize: 16,
  },
  categoryIcon: {
    // padding: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: -15, // Adjust as necessary to position the icon correctly
  },
  iconButton: {
    backgroundColor: '#fff',
    borderRadius: 30, // Make it a circle
    padding: 4,
    elevation: 2, // Optional: add shadow for better visibility
    borderWidth: 1,
    borderColor: '#ccc',
  },
  disabledCategoryButton: {
    opacity: 0.5,
  },
  showLessText: {
    marginTop: -10,
    textAlign: 'center',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  headerContainer: {
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    // paddingVertical: 20,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'black',
    marginLeft: 5,
    marginBottom: 10,
  },
  catheaderContainer: {
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    // paddingVertical: 0,
  },
});

export default AppBaseContainer(OtherProfileScreen, '', false);
