/* eslint-disable react-native/no-inline-styles */
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

import {useSelector} from 'react-redux';

import strings from '../i18n/strings';

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
  ChevronRightIcon,
  ChevronsLeftIcon,
  EditIcon,
  Icon,
  ShareIcon,
} from '../../components/ui/icon';
import {HStack} from '../../components/ui/hstack';
import {Color} from '../styles/GlobalStyles';
import {Checkerror} from '../utils/utilTokens';
import {StackNav} from '../navigation/NavigationKeys';
import {imagesBucketcloudfrontPath, moderateScale} from '../config/constants';
import {VStack} from '../../components/ui/vstack';
import ZAvatarInitials from './ZAvatarInitials';
import ZSafeAreaView from './ZSafeAreaView';
import AppBaseContainer from '../hoc/AppBaseContainer_old';
import ExpandableText from './ExpandableText';
import ZHeader from './ZHeader';
import {Back} from '../assets/svg';
import RenderUserDetail from './RenderUserDetails';
import ImageView from 'react-native-image-viewing';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useApiRequest} from '../hooks/useApiRequest';
import {
  getProfile,
  UpdateProfile,
} from '../../BrokerAppCore/services/new/profileServices';
import {showRationaleAndRequest} from '../utils/appPermission';

const ProfileScreen: React.FC = ({
  toast,
  isPageSkeleton,
  toggleSkeletonoff,
  toggleSkeletonOn,
  setLoading,
  navigation,
  user,
  toastMessage,
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
  const AppLocation = useSelector((state: RootState) => state.AppLocation);
  // const refRBSheet = useRef();
  const {
    data: profiledata,
    status: profilestatus,
    error: profileerror,
    execute: profileexecute,
  } = useApiRequest(getProfile, setLoading);
  const {
    data: profileUpdatedata,
    status: profileUpdatestatus,
    error: profileUpdateerror,
    execute: profileUpdateexecute,
  } = useApiRequest(UpdateProfile, setLoading);
  const handleCategoryPress = screen => {
    navigation.navigate(screen.navigationScreen, {
      listType: screen.listType,
      categoryId: screen.categoryId,
      userId: user.userId,
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
  const renderContent = () => {
    return (
      <>
        <View style={localStyles.catheaderContainer}>
          <View style={[localStyles.categoriesContainer]}>
            <View style={localStyles.aboutheader}>
              <ZText type={'S20'} style={localStyles.pageTitle}>
                About
              </ZText>
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
            <ZText type={'S20'} style={localStyles.pageTitle}>
              Posts
            </ZText>
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
                    justifyContent: 'space-between',
                  }}>
                  <ZText type={'R16'} style={localStyles.categoryText}>
                    {category.postCount}
                  </ZText>
                  <Icon as={ChevronRightIcon} color={Color.primary} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={localStyles.catheaderContainer}>
          <View style={[localStyles.categoriesContainer]}>
            <ZText type={'S20'} style={localStyles.pageTitle}>
              Settings
            </ZText>
            <TouchableOpacity
              key={index}
              style={[localStyles.categoryButton]}
              onPress={onPressSetting}>
              <ZText type={'l18'}>Profile Settings</ZText>
              <Icon as={ChevronRightIcon} color={Color.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  };

  const refRBSheet = useRef();

  const s3 = useS3();
  const [routes] = useState([{key: 'Property', title: 'Property'}]);

  useFocusEffect(
    React.useCallback(() => {
      // setLoading(true)
      const getUserProfile = async () => {
        try {
          await profileexecute(user.userId);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      getUserProfile();
    }, [ProfileDataRest]),
  );
  useEffect(() => {
    if (profilestatus == 200) {
      console.log(profiledata?.data);
      setProfileData(profiledata?.data);
      const Userfollower: any = [];
      if (profiledata.data) {
        Userfollower.push({
          title: strings.followers,
          value: profiledata.data.followers,
        });
        Userfollower.push({
          title: strings.following,
          value: profiledata.data.followings,
        });
      }

      setParentUser({
        userId: profiledata.data.userId,
        userName: profiledata.data.firstName + ' ' + profiledata.data.lastName,
        userImg: profiledata.data.profileImage,
      });

      setUserBio(profiledata.data?.biodata);

      setUserfollowersData(Userfollower);
      setLoading(false);
    }
  }, [profilestatus]);

  const selectprofilepic = () => {
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
      countryName: ProfileData.location.countryName,
      stateName: ProfileData.location.stateName,
      cityName: ProfileData.location.cityName,
      specialization: getList(ProfileData.specializations),
      userLocation: [],
    };
    delete Result['location'];
    delete Result['officeLocation'];
    delete Result['userPermissions'];
    // console.log(Result, 'pro');

    await profileUpdateexecute(Result);
  };
  // console.log(profiledata, 'data');

  const colors = useSelector(state => state.theme.theme);
  const [isSelect, setIsSelect] = useState(0);

  const generateLink = async () => {
    try {
      const response = await fetch(
        `https://tinyurl.com/api-create.php?url=${encodeURIComponent(
          `brokerapp://ProfileDetails/${user.userId}`,
        )}`,
      );
      const text = await response.text();
      return text;
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
    navigation.navigate('ProfileSettings', {data: ProfileData});

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
        countryName: ProfileData.location.countryName,
        stateName: ProfileData.location.stateName,
        cityName: ProfileData.location.cityName,
        specialization: getList(ProfileData.specializations),
        userLocation: [],
      };
      delete Result['location'];
      delete Result['officeLocation'];
      delete Result['userPermissions'];
      await profileUpdateexecute(Result);
    } catch (error) {}
  };
  useEffect(() => {
    const updatedata = async () => {
      if (profileUpdatestatus == 200) {
        await AsyncStorage.setItem(
          'User',
          JSON.stringify(profileUpdatedata.data),
        );
        await AsyncStorage.getItem('User');

        await dispatch(setUser(profileUpdatedata.data));

        setProfileDataRest(!ProfileDataRest);
      }
    };
    updatedata();
  }, [profileUpdatestatus]);

  useEffect(() => {
    if (profileUpdatestatus == 200) {
      setProfileData(profileUpdatedata?.data);

      const Userfollower: any = [];
      if (profileUpdatedata.data) {
        Userfollower.push({
          title: strings.followers,
          value: profileUpdatedata.data.followers,
        });
        Userfollower.push({
          title: strings.following,
          value: profileUpdatedata.data.followings,
        });
      }
      setParentUser({
        userId: profileUpdatedata.data.userId,
        userName:
          profileUpdatedata.data.firstName +
          ' ' +
          profileUpdatedata.data.lastName,
        userImg: profileUpdatedata.data.profileImage,
      });
      setUserBio(profileUpdatedata.data?.biodata);
      setUserfollowersData(Userfollower);
      setLoading(false);
      toastMessage('Profile Updated');
    }
  }, [profileUpdatedata, profileUpdatestatus]);
  // console.log(ProfileData, 'data');
  const PostHeader = () => {
    const fullName = `${ProfileData?.firstName} ${ProfileData?.lastName}`;
    const truncatedFullName =
      fullName.length > 10 ? fullName.slice(0, 15) + '...' : fullName;

    return (
      <>
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
            <HStack>
              <ZText
                type="R14"
                align={'center'}
                color={colors.primary}
                style={styles.mt2}
                onPress={selectImage}>
                Edit Image
              </ZText>
            </HStack>
          </VStack>

          <View style={[styles.mv5, localStyles.headContainer]}>
            <ZText
              type="S18"
              align={'center'}
              style={[styles.mt20, localStyles.capitalize]}>
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
              <ZText type="R18" align={'center'} style={styles.mt2}>
                {'Kyc Status:'} {ProfileData?.kycStatus}
              </ZText>
            )}
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
            {UserfollowersData.map((item, index) => (
              <RenderUserDetail
                item={item}
                key={index}
                ParentUserData={ParentUser}
              />
            ))}
          </View>
        </View>
      </>
    );
  };
  const LeftIcon = () => {
    return (
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <View
          style={{
            padding: 8,
            borderWidth: 1,
            borderColor: '#E5E5E5',
            borderRadius: 40,
          }}>
          <Back accessible={true} accessibilityLabel="Back" />
        </View>
      </TouchableOpacity>
    );
  };
  const RightIcon = () => {
    return (
      <TouchableOpacity onPress={shareProfile} style={{marginRight: 10}}>
        <Icon as={ShareIcon} />
      </TouchableOpacity>
    );
  };
  const handleClear = () => {
    setUserBio('');
  };
  const dummyData = [{key: 'dummy'}];
  return (
    <ZSafeAreaView>
      <ZHeader
        title={``}
        rightIcon={<RightIcon />}
        isHideBack={true}
        isLeftIcon={<LeftIcon />}
      />
      {ProfileData && (
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
      )}
      <>
        <RBSheet
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
                {/* <Ionicons
                  name="close-outline"
                  size={24}
                  color={Color.primary}
                /> */}
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
        </RBSheet>
      </>
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

    backgroundColor: '#ffffff',
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
    backgroundColor: Color.primary,
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

    borderWidth: 1,
    borderColor: Color.borderColor,
    borderRadius: 20,
    flexDirection: 'column',
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // marginBottom: 15,
    padding: 8,
    borderRadius: 4,
  },
  aboutheader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
