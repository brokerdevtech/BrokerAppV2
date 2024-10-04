/* eslint-disable react/no-unstable-nested-components */
// src/screens/SettingsScreen.tsx
import React, {useState, useEffect, useCallback, useRef} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  PermissionsAndroid,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

// Local import

import {useSelector} from 'react-redux';
//mport {styles} from '../themes';

import strings from '../i18n/strings';

import {
  UpdateProfile,
  getProfile,
} from '../../BrokerAppCore/services/profileService';
import {styles} from '../themes';

import {useFocusEffect} from '@react-navigation/native';

import {
  getFileExtensionFromMimeType,
  getList,
  updateNestedObject,
  uriToBlob,
} from '../utils/helpers';
import uuid from 'react-native-uuid';
import {useS3} from '../Context/S3Context';
import ImageCropPicker from 'react-native-image-crop-picker';

import {getMyPost} from '../../BrokerAppCore/services/postService';

import Share from 'react-native-share';
import {useDispatch} from 'react-redux';
import {setUser} from '../../BrokerAppCore/redux/store/user/userSlice';
import typography from '../themes/typography';
import ZText from './ZText';
import {Box} from '../../components/ui/box';
import {
  ChevronsLeftIcon,
  EditIcon,
  Icon,
  ShareIcon,
} from '../../components/ui/icon';
import {HStack} from '../../components/ui/hstack';
import {Color} from '../styles/GlobalStyles';
import {Checkerror} from '../utils/utilTokens';
import {StackNav} from '../navigation/NavigationKeys';
import {moderateScale} from '../config/constants';
import {VStack} from '../../components/ui/vstack';
import ZAvatarInitials from './ZAvatarInitials';
import ZSafeAreaView from './ZSafeAreaView';
import AppBaseContainer from '../hoc/AppBaseContainer_old';
import ExpandableText from './ExpandableText';

const ProfileScreen: React.FC = ({
  toast,
  isPageSkeleton,
  toggleSkeletonoff,
  toggleSkeletonOn,
  setLoading,
  navigation,
  user,
  color,
  route,
}) => {
  const [ProfileData, setProfileData] = useState(null);
  const [ProfileDataRest, setProfileDataRest] = useState(false);
  const [UserfollowersData, setUserfollowersData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [userBio, setUserBio] = useState('');
  const [index, setIndex] = useState(0);
  const [ParentUser, setParentUser] = useState([]);
  const [dataLoad, setDataLoad] = useState(false);
  const [isViewerVisible, setViewerVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState([]);
  const dispatch = useDispatch();
  const [ProfilePostData, setProfilePostData] = useState([]);
  const [page, setPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [biodata, setBiodata] = useState('');
  const [TabSelect, setTabSelect] = useState(0);
  //   const [TabSelect, setTabSelect] = useState(0);

  const onTabSelectChange = useCallback(index => {
    setTabSelect(index);
  }, []);

  const handleCategoryPress = screen => {
    navigation.navigate(screen, {
      userId: user.userId,
    });
  };
  const categories = [
    {
      name: 'Propety',

      navigationScreen: 'MyPropertyPost',
      postCount: ProfileData?.realEstatePostCount,
    },
    {
      name: 'Genric',
      navigationScreen: 'MyGenericPost',
      postCount: ProfileData?.genericPostCount,
    },
    {
      name: 'Cars',
      navigationScreen: 'MyCarsPost',
      postCount: ProfileData?.carPostCount,
    },
  ];
  const renderContent = () => {
    return (
      <>
        <View style={localStyles.catheaderContainer}>
          <View style={[localStyles.categoriesContainer]}>
            <View style={localStyles.aboutheader}>
              <Text style={localStyles.pageTitle}>About</Text>
              <Box mt={1} alignContent="center">
                <TouchableOpacity onPress={() => refRBSheet.current.open()}>
                  {/* <Edit accessible={true} accessibilityLabel="edit" /> */}
                  <Icon as={EditIcon} />
                </TouchableOpacity>
              </Box>
            </View>
            <View style={[localStyles.categoryButton]}>
              <HStack
                space={2}
                alignItems="left"
                width="100%"
                paddingRight={12}>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}>
                  <ExpandableText
                    text={
                      ProfileData?.biodata == ''
                        ? 'Press To Enter Your Bio'
                        : ProfileData?.biodata
                    }
                  />
                </View>
              </HStack>
            </View>
          </View>
        </View>
        <View style={localStyles.catheaderContainer}>
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
                onPress={() => handleCategoryPress(category.navigationScreen)}>
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
                  <Icon as={ChevronsLeftIcon} size={25} color={Color.primary} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={localStyles.catheaderContainer}>
          <View style={[localStyles.categoriesContainer]}>
            <Text style={localStyles.pageTitle}>Settings</Text>
            <TouchableOpacity
              key={index}
              style={[localStyles.categoryButton]}
              onPress={onPressSetting}>
              <ZText type={'l18'}>Profile Settings</ZText>
              <Icon as={ChevronsLeftIcon} size={25} color={Color.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  };
  const handleEditToggle = () => {
    setModalVisible(!isModalVisible);
    refRBSheet.current.open();
  };
  const refRBSheet = useRef();
  const handleBiodataChange = useCallback(text => {
    setBiodata(text);
  }, []);
  const s3 = useS3();
  const [routes] = useState([
    {key: 'Property', title: 'Property'},
    {key: 'Generic', title: `Generic`},
  ]);
  useEffect(() => {}, []);
  useFocusEffect(
    React.useCallback(() => {
      // setLoading(true)
      const getUserProfile = async () => {
        try {
          const result = await getProfile(user.userId);
          await Checkerror(result);

          if (result.status == 'error' || result.status == undefined) {
            setLoading(false);
            // console.log(result);
            toast.show({
              description: result.error,
            });
            return;
          } else {
            //
            //

            setProfileData(result?.data);
            const Userfollower: any = [];
            if (result.data) {
              // Userfollower.push({
              //   title: 'Posts',
              //   value: result.data?.postCount ? result.data?.postCount : 0,
              // });
              Userfollower.push({
                title: strings.followers,
                value: result.data.followers,
              });
              Userfollower.push({
                title: strings.following,
                value: result.data.followings,
              });
            }
            //let objdata={'userId':result.data.userId,'userName':result.data.uidName,'userImg':result.data.profileImage}
            setParentUser({
              userId: result.data.userId,
              userName: result.data.firstName + ' ' + result.data.lastName,
              userImg: result.data.profileImage,
            });
            //
            // setPostCounter(result.data?.postCount)
            //
            setUserBio(result.data?.biodata);

            setUserfollowersData(Userfollower);
            setLoading(false);
            // await new Promise(resolve => setTimeout(resolve, 200));
            // setCountryData(result.data);
            //  toggleSkeletonoff();d
          }
        } catch (error) {
          setLoading(false);
          toast.show({
            description: error,
          });
          console.error('Error fetching data:', error);
        }
      };
      const getProfilePostData = async () => {
        try {
          const result = await getMyPost(user.userId);
          //

          if (result.status == 'error') {
            setDataLoad(true);
            toast.show({
              description: result.error,
            });
            return;
          } else {
            //
            //
            setProfilePostData(result.data);

            // setDataLoad(true);
          }
        } catch (error) {
          toast.show({
            description: error,
          });
          console.error('Error fetching data:', error);
        }
      };

      getUserProfile();
      //  getProfilePostData();

      // return () => {
      //   // Code to execute when the screen loses focus (optional)
      // };
    }, [ProfileDataRest]),
  );
  //
  const selectprofilepic = () => {
    // console.log('selectprofilepic');
    if (ProfileData?.profileImage != '') {
      setCurrentImage([
        {
          uri: `${imagesBucketcloudfrontPath}${ProfileData?.profileImage}`,
        },
      ]);
      setViewerVisible(true);
    }
  };
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const handleSave = async () => {
    setIsEditing(false);
    setModalVisible(false);
    let officeDetails = {
      biodata: userBio,
    };
    refRBSheet.current.close();
    const deletions = [
      'roles',
      'industries',
      'specializations',
      'userLocations',
    ];
    let Result: any = updateNestedObject(ProfileData, officeDetails, deletions);

    Result = {
      ...Result,
      industry: getList(ProfileData.industries),
      specialization: getList(ProfileData.specializations),
      userLocation: [],
    };

    setLoading(true);
    let k = await UpdateProfile(Result);
    if (k.status == 'error') {
      setLoading(false);
      toast.show({
        description: k.error,
      });
      // return;
    } else {
      setLoading(false);
      // setUserBio(userBio);
      setProfileDataRest(!ProfileDataRest);
    }
  };
  console.log(user);
  //   useFocusEffect(()=>{
  //     toggleSkeletonOn();
  //     const getUserProfile = async () => {
  //       try {
  //         const result = await getProfile(user.userId);
  //         //
  //         //
  //         setProfileData(result.data);
  // const Userfollower:any=[];
  // Userfollower.push({title:strings.followers,value:result.data.followers})
  // Userfollower.push({title:strings.following,value:result.data.followings})
  // setUserfollowersData(Userfollower);
  //         // setCountryData(result.data);
  //         toggleSkeletonoff();
  //       } catch (error) {
  //         console.error('Error fetching data:', error);
  //       }
  //     };

  //     getUserProfile();
  //   },[])
  const colors = useSelector(state => state.theme.theme);
  const [isSelect, setIsSelect] = useState(0);
  // const switchAccountRef = createRef(null);
  // const categoryData = [
  //   {
  //     id: 0,
  //     icon: 'grid',
  //     onPress: () => setIsSelect(0),
  //     name: 'My Posts',
  //   },
  //   // {
  //   //   id: 1,
  //   //   icon: 'lock-closed',
  //   //   onPress: () => setIsSelect(1),
  //   //   name: 'Shorts',
  //   // },
  //   // {
  //   //   id: 2,
  //   //   icon: 'bookmark',
  //   //   onPress: () => setIsSelect(2),
  //   //   name: 'Tags',
  //   // },
  // ];
  // const renderScene = SceneMap({
  //   Property: () => (
  //     <View style={{flex: 1}}>
  //       {/* // <MyListingScroll User={user} /> */}
  //       <Text>0</Text>
  //     </View>
  //   ),

  //   Generic: () => (
  //     <View style={{flex: 1}}>
  //       {/* // <MyGenericListingScroll User={user} /> */}
  //       <Text>1</Text>
  //     </View>
  //   ),
  // });

  // const onPressEditProfile = () => navigation.navigate(StackNav.EditProfile);

  // // const onPressSwitchAccount = () => switchAccountRef?.current?.show();
  const generateLink = async () => {
    try {
      const response = await fetch(
        `https://tinyurl.com/api-create.php?url=${encodeURIComponent(
          `brokerapp://ProfileDetails/${user.userId}`,
        )}`,
      );
      const text = await response.text();
      return text;

      // const link = await dynamicLinks().buildShortLink(
      //   {
      //     link: `https://brokerapp.page.link/profiledetails/${user.userId}`,
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

  const onPressSetting = () =>
    navigation.navigate(StackNav.ProfileSetting, {data: ProfileData});

  // const onPressFindFriend = () => navigation.navigate(StackNav.FindFriends);
  const selectImage = async () => {
    const imagePickerOptions = {
      title: 'Select File',
      quality: 1,
      // // maxWidth: 200,
      // // maxHeight: 200,
      cropping: true,
      cropperCircleOverlay: true,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    //const result = await launchImageLibrary(imagePickerOptions);
    const permissions = [
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
      // Add more permissions as needed
    ];
    const granted = await PermissionsAndroid.requestMultiple(permissions);

    if (Platform.OS === 'android') {
      const permissions = [PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES];
      const granted = await PermissionsAndroid.requestMultiple(permissions);

      if (
        granted[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
        PermissionsAndroid.RESULTS.GRANTED
      ) {
        const result1 = await ImageCropPicker.openPicker({
          cropping: true,
          cropperCircleOverlay: true,
          compressImageQuality: 1,
        });
        await uploadFile(result1.path, result1.mime);
      } else {
        await showRationaleAndRequest('camera and images');
      }
    } else {
      const result1 = await ImageCropPicker.openPicker({
        cropping: true,
        cropperCircleOverlay: true,
        compressImageQuality: 1,
      });
      await uploadFile(result1.path, result1.mime);
    }
  };
  const uploadFile = async (uri, type) => {
    if (!uri) {
      toast.show({
        title: 'Please select a file first',
      });
      return;
    }

    const responseBlob = await uriToBlob(uri); // Replace with the URL to your image or use the React Native ImagePicker to select an image.

    // const imageBlob = await convertLocalImageToBlob(response.assets[0].uri);
    //

    //  // const imageBlob = await fetch(response.assets[0].uri);
    //   const fileContent = await RNFS.readFile(response.assets[0].uri);
    //
    //   //
    //   // const file = {
    //   //   uri: selectedFile.uri,
    //   //   name: 'my-image.jpg', // Set the desired file name in S3
    //   //   type: 'image/jpeg', // Set the MIME type for the image
    //   // };

    const fileExtension = getFileExtensionFromMimeType(type);

    const docId = uuid.v4();
    const imageName = docId + '.' + fileExtension;
    const params = {
      Bucket: 'broker2023',
      Key: '/Profile/originals/' + imageName, // The name/key of the file in S3
      Body: responseBlob, // The file content
    };
    try {
      let result = await s3.upload(params).promise();

      UpdateProfilePic(result.key);

      // Alert('Upload Success', 'Image uploaded to S3 successfully.');
    } catch (error) {
      console.error('Error uploading image to S3:', error);
      // Alert.alert('Upload Error', 'An error occurred while uploading the image to S3.');
    }
  };

  const UpdateProfilePic = async key => {
    try {
      let officeDetails = {
        profileImage: key,
      };
      const deletions = [
        'roles',
        'industries',
        'specializations',
        'userLocations',
      ];
      let Result: any = updateNestedObject(
        ProfileData,
        officeDetails,
        deletions,
      );

      Result = {
        ...Result,
        industry: getList(ProfileData.industries),
        specialization: getList(ProfileData.specializations),
        userLocation: [],
      };

      setLoading(true);
      let k = await UpdateProfile(Result);

      if (k.status == 'error') {
        setLoading(false);
        toast.show({
          description: k.error,
        });
        // return;
      } else {
        await AsyncStorage.setItem('User', JSON.stringify(k.data));
        const storedUser = await AsyncStorage.getItem('User');

        await dispatch(setUser(k.data));
        //dispatch(updateUserProperties({ profileName:  k.data.profileImage, profileImage: k.data.profileName  }));

        setLoading(false);
        setProfileDataRest(!ProfileDataRest);
      }

      //
      //
      // setLoading(false);
      // setProfileDataRest(!ProfileDataRest);
      //navigation.navigate('Profile');

      // Handle the submission of office details here
    } catch (error) {
      setLoading(false);
    }
  };

  // const RenderUserDetail = ({item}) => {
  //   return (
  //     <View style={styles.itemsCenter}>
  //       <ZText type="b24" align={'center'}>
  //         {item.value}
  //       </ZText>
  //       <ZText type="m16" align={'center'} style={styles.mt10}>
  //         {item.title}
  //       </ZText>
  //     </View>
  //   );
  // };
  const HeaderCategory = ({item}) => {
    const truncatedName =
      item.name.length > 10 ? item.name.slice(0, 10) + '...' : item.name;
    return (
      <TouchableOpacity
        onPress={item.onPress}
        style={[
          localStyles.tabItemStyle,
          {
            borderBottomWidth: isSelect === item.id ? moderateScale(2) : 0,
            borderBottomColor:
              isSelect === item.id ? colors.primary : colors.bColor,
          },
        ]}>
        {/* <MaterialIcon
          name={item.icon}
          size={moderateScale(30)}
          color={isSelect === item.id ? colors.primary : colors.iconColor}
        /> */}
        <ZText type={'B16'}>{truncatedName}</ZText>
      </TouchableOpacity>
    );
  };

  const PostHeader = () => {
    const fullName = `${ProfileData?.firstName} ${ProfileData?.lastName}`;
    const truncatedFullName =
      fullName.length > 10 ? fullName.slice(0, 15) + '...' : fullName;

    return (
      <>
        <View style={localStyles.headerContainer}>
          <TouchableOpacity style={styles.rowCenter}>
            {/* <ZText type="S22" style={localStyles.capitalize}>
              {truncatedFullName}
            </ZText> */}
            {/* <Ionicons
              name="chevron-down-outline"
              size={moderateScale(24)}
              style={styles.ml5}
              color={colors.dark ? colors.white : colors.darkColor}
            /> */}
          </TouchableOpacity>
          <HStack>
            <TouchableOpacity onPress={shareProfile} style={{marginRight: 10}}>
              {/* <ShareIcon
                accessible={true}
                accessibilityLabel="Share"
                height={30}
                width={30}
                // color={Color.primary}
              /> */}
              <Icon as={ShareIcon} />
            </TouchableOpacity>
            {/* <TouchableOpacity>
              <Setting accessible={true} accessibilityLabel="setting" />
            </TouchableOpacity> */}
          </HStack>
        </View>

        <View
          style={[
            styles.flexColumn,
            styles.flexCenter,
            localStyles.headContainer,
          ]}>
          <VStack style={[styles.mt10, localStyles.avtarWrapper]}>
            <TouchableOpacity onPress={selectprofilepic}>
              <ZAvatarInitials
                isDisable={true}
                sourceUrl={ProfileData?.profileImage}
                styles={localStyles.userImage}
                iconSize="xl"
                name={ProfileData?.profileName}
              />
            </TouchableOpacity>
            <HStack justifyContent="center" marginTop="2px">
              <ZText
                type="M14"
                align={'center'}
                color={colors.primary}
                style={styles.mt2}
                onPress={selectImage}>
                Edit Image
              </ZText>
            </HStack>
          </VStack>
          {/* <View>
          <Text>{postCounter}</Text>
        </View> */}
          <View style={[styles.mv5, localStyles.headContainer]}>
            <ZText
              type="M18"
              align={'center'}
              style={[
                styles.mt20,
                localStyles.capitalize,
                typography.fontBold.semiBold,
              ]}>
              {ProfileData?.firstName} {ProfileData?.lastName}
            </ZText>
            <ZText
              type="M16"
              align={'center'}
              color={colors.primary}
              style={styles.mt2}>
              {ProfileData?.email}
            </ZText>
            {ProfileData?.kycStatus != 'Na' && (
              <ZText type="M18" align={'center'} style={styles.mt2}>
                {'Kyc Status:'} {ProfileData?.kycStatus}
              </ZText>
            )}

            {/* <HStack space={2} alignItems="left" width="100%" paddingRight={12}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                }}>
                <ExpandableText
                  text={
                    ProfileData?.biodata == ''
                      ? 'Press To Enter Your Bio'
                      : ProfileData?.biodata
                  }
                />

                <Box mt={1} alignContent="center">
                  <TouchableOpacity onPress={() => refRBSheet.current.open()}>
                    <Edit accessible={true} accessibilityLabel="edit" />
                  </TouchableOpacity>
                </Box>
              </View>
            </HStack> */}
          </View>
          <View
            style={[
              styles.flexRow,
              styles.justifyBetween,
              // styles.pl35,
              // styles.flexGrow1,
              // styles.itemsCenter,
              styles.mt25,
            ]}>
            {/* {UserfollowersData.map((item, index) => (
              <RenderUserDetail
                item={item}
                key={index}
                ParentUserData={ParentUser}
              />
            ))} */}
          </View>
        </View>
      </>
    );
  };

  const handleClear = () => {
    setUserBio('');
  };
  const dummyData = [{key: 'dummy'}];
  return (
    <ZSafeAreaView>
      {ProfileData && (
        // <MyListingScroll
        //   User={user}
        //   ListHeaderComponent={PostHeader}></MyListingScroll>
        <FlatList
          data={dummyData}
          ListHeaderComponent={() => <PostHeader />}
          renderItem={renderContent}
          // ListFooterComponent={renderContent}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            marginBottom: 20,
            paddingBottom: 20,
          }}
        />
        // <ProfileTabs Header={() => <PostHeader />} User={user} />
        // <FlatList>
        // <PostHeader />
        // </FlatList>
      )}
      <>
        {/* <RBSheet
          ref={refRBSheet}
          customStyles={{
            wrapper: {
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            },
            draggableIcon: {
              backgroundColor: '#000',
            },
            container: {
              backgroundColor: '#fff',
            
              paddingHorizontal: 20,
              paddingTop: 20,
            },
          }}
          customModalProps={{
            animationType: 'slide',
            statusBarTranslucent: true,
          }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : ''}>
            <View style={localStyles.header}>
              <TouchableOpacity onPress={() => refRBSheet.current.close()}>
                <Ionicons
                  name="close-outline"
                  size={24}
                  color={Color.primary}
                />
              </TouchableOpacity>
              <Text style={localStyles.headerText}>Edit Bio</Text>
              <TouchableOpacity onPress={handleClear}>
                <Text style={localStyles.clearButton}>Clear</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              multiline
              maxLength={1000}
              numberOfLines={4}
              placeholder="Enter Your Bio up to 1000 characters"
              value={userBio}
              borderColor="#000"
              style={localStyles.textInput}
              onChangeText={e => setUserBio(e)}
              // returnKeyType="done"
            />

         
            <TouchableOpacity
              onPress={handleSave}
              style={localStyles.applyButton}>
              <Text style={localStyles.applyButtonText}>Save</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </RBSheet> */}
      </>
      {/* <ImageView
        images={currentImage}
        imageIndex={0}
        visible={isViewerVisible}
        onRequestClose={() => setViewerVisible(false)}
      /> */}
    </ZSafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  root: {
    ...styles.ph20,
    ...styles.mb20,
    flex: 1,
  },
  avtarWrapper: {
    position: 'relative',
  },
  bio: {
    ...styles.mt10,
    //'width': '80%'
    flexWrap: 'wrap',
  },
  capitalize: {
    textTransform: 'capitalize',
  },
  bioText: {
    ...typography.fontWeights.Regular,
    ...typography.fontSizes.f18,
    ...styles.mt10,
  },
  headerContainer: {
    ...styles.flex,
    ...styles.flexRow,
    ...styles.alignCenter,
    ...styles.justifyBetween,
    ...styles.mt20,
    alignContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  headContainer: {
    // marginHorizontal: 16,
    textAlign: 'center',
  },
  userImage: {
    width: moderateScale(100),
    height: moderateScale(100),
  },
  imageEditIcon: {
    display: 'flex',
    // width: '40px',
    // height: '40px',
    // padding: '5px',
    backgroundColor: '#ffffff',
  },
  // buttonContainer: {
  //   ...styles.mt20,
  //   height: getHeight(45),
  //   width: '48%',

  //   // borderRadius: moderateScale(22),
  //   // borderWidth: moderateScale(1),
  // },
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },

  modal: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 20,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '10%',
    // flex: 1,
  },
  // textInput: {
  //   borderWidth: 1,
  //   backgroundColor: 'rgba(188, 74, 80, 0.1)',
  //   padding: 10,
  //   textAlignVertical: 'top',
  //   height: 100,
  //   marginBottom: 20,
  //   borderColor: Color.primary,
  //   width: '80%',
  // },

  button: {
    borderRadius: 5,
    paddingVertical: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  closeButton: {
    fontSize: 18,
    color: Color.primary,
  },
  clearButton: {
    fontSize: 18,
    color: Color.primary,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Color.primary,
    borderWidth: 1,
    backgroundColor: 'rgba(188, 74, 80, 0.1)',
    padding: 10,
    borderRadius: 5,
    height: 100,
    marginBottom: 20,
    // paddingTop: 0,
  },
  buttonContainer: {
    alignItems: 'center',
    width: '100%',
  },
  applyButton: {
    backgroundColor: '#BC4A4F',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  applyButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  tabBar: {
    backgroundColor: '#fff',
  },
  indicator: {
    backgroundColor: Color.primary,
  },
  label: {
    color: '#000',
    textTransform: 'capitalize',
    ...typography.fontSizes.f16,
    // ...Typography.fontBold.bold
  },
  categoriesContainer: {
    marginTop: 16,
    padding: 10,
    // backgroundColor: '#f0f0f0',
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 20,
    flexDirection: 'column',
    // justifyContent: 'space-around',
    // flexWrap: 'wrap',
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // marginBottom: 15,
    padding: 8,
    borderRadius: 4,
    // width: '30%',
    // backgroundColor: '#fff',
    // marginLeft: 20,
    // borderColor: '#ccc',
    // borderWidth: 1,
  },
  aboutheader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // marginBottom: 15,
    // padding: 8,
    // borderRadius: 4,
    // width: '30%',
    // backgroundColor: '#fff',
    // marginLeft: 20,
    // borderColor: '#ccc',
    // borderWidth: 1,
  },
  categoryText: {
    // marginTop: 8,
    color: 'grey',
    fontSize: 18,
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
  catheaderContainer: {
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    // paddingVertical: 0,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'black',
    marginLeft: 5,
    marginBottom: 10,
  },
});

export default AppBaseContainer(ProfileScreen, 'ProfileScreen', false);
