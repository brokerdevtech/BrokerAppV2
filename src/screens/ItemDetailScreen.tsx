/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Share,
  Linking,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '@reduxjs/toolkit/query';
import CustomHeader from '../sharedComponents/CustomHeader';
import ZText from '../sharedComponents/ZText';

import ShortingIcon from '../assets/svg/icons/sorting.svg';
import FilterIcon from '../assets/svg/icons/filters.svg';
import ArrowLeftIcon from '../assets/svg/icons/arrow-left.svg';
import SearchIcon from '../assets/svg/icons/search.svg';
import {HStack} from '@/components/ui/hstack';
import UserProfile from '../sharedComponents/profile/UserProfile';
import {
  Card_check_icon,
  Heart_icon,
  Location_Icon,
  Calender_Icon,
  Chat_Icon,
  Telephone_Icon,
  Whatsapp_Icon,
  Share_Icon,
} from '../assets/svg';
import {
  imagesBucketcloudfrontPath,
  moderateScale,
  PermissionKey,
} from '../config/constants';
import {useApiRequest} from '@/src/hooks/useApiRequest';
import {fetchPostByID} from '@/BrokerAppCore/services/new/dashboardService';
import {Icon, ShareIcon, TrashIcon} from '../../components/ui/icon';
import {Divider} from '@/components/ui/divider';
import {VStack} from '@/components/ui/vstack';
import MediaGallery from '../sharedComponents/MediaGallery';
import PostActions from '../sharedComponents/PostActions';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import KeyValueDisplay from '../sharedComponents/KeyValueDisplay';
import KeyValueRow from '../sharedComponents/KeyValueRow';
import IconValueDisplay from '../sharedComponents/IconValueDisplay';
import ZTextMore from '../sharedComponents/ZTextMore';
import LocationMap from '../sharedComponents/LocationMap';
import ZAvatarInitials from '../sharedComponents/ZAvatarInitials';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../themes';
import {formatNumberToIndianSystem} from '../utils/helpers';
import TouchableOpacityWithPermissionCheck from '../sharedComponents/TouchableOpacityWithPermissionCheck';
import {deleteMyPost} from '../../BrokerAppCore/services/postService';
import {Toast, ToastDescription, useToast} from '../../components/ui/toast';
import {delay} from 'lodash';
import AppBaseContainer from '../hoc/AppBaseContainer_old';
import NoDataFoundScreen from '../sharedComponents/NoDataFoundScreen';
import OopsScreen from '../sharedComponents/OopsScreen';
import useUserJourneyTracker from '../hooks/Analytics/useUserJourneyTracker';
import {formatDate} from '../constants/constants';

const propertyDetails = (data: any, user: any, navigation: any) => {
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

  const generateLink = async () => {
    try {
      const response = await fetch(
        `https://tinyurl.com/api-create.php?url=${encodeURIComponent(
          `brokerapp://ItemDetailScreen/${data?.postId}/Post`,
        )}`,
      );
      const text = await response.text();

      return text;
    } catch (error) {}
  };

  const sharePost = async () => {
    const getLink = await generateLink();

    try {
      await Share.share({
        message: getLink,
      });
    } catch (error) {}
  };
  console.log(data);
  return (
    <>
      {data.isBrokerAppVerified && (
        <View style={styles.iconContainer}>
          <View style={styles.checkIcon}>
            <Card_check_icon />
          </View>
        </View>
      )}
      <PostActions
        item={data}
        User={user}
        listTypeData={'RealEstate'}
        onUpdateLikeCount={newCount => {}}
      />
      {/* Car Details */}
      <VStack space="xs" style={styles.detailsContainetop}>
        <ZText type={'M16'} color={colors.light.appred}>
          {'\u20B9'} {formatNumberToIndianSystem(data?.price)}
        </ZText>

        <HStack>
          <IconValueDisplay IconKey="bedroomType" value={data.bedroomType} />
          <IconValueDisplay IconKey="bathroomType" value={data.bathroomType} />
          <IconValueDisplay IconKey="balconyType" value={data.balconyType} />
          <IconValueDisplay IconKey="propertySize" value={data.propertySize} />
        </HStack>

        <View style={styles.locationContainer}>
          {data.location.cityName && (
            <>
              <Icon as={Location_Icon} />
              <ZText type={'R16'}>{data?.location.placeName}</ZText>
            </>
          )}
        </View>
      </VStack>
      <Divider className="my-0.5" />
      {/* <Divider className="my-0.5"/> */}
      <View style={styles.detailsContainer}>
        <VStack space="xs">
          <ZTextMore type={'B16'} numberOfLines={1}>
            {data.title}
          </ZTextMore>

          <ZText type={'B16'} numberOfLines={1} style={{paddingVertical: 5}}>
            {'Details'}{' '}
          </ZText>
          <KeyValueDisplay label="Project" value={data.projectName} />
          <KeyValueDisplay label="Developed By" value={data.developerName} />
          <KeyValueDisplay
            label="Construction Status"
            value={data.constructionStatus}
          />

          <KeyValueDisplay
            label="Property Status"
            value={data.propertyStatus}
          />
          <KeyValueDisplay label="Property Age" value={data.propertyAge} />

          <KeyValueDisplay
            label="Property Status"
            value={data.propertyStatus}
          />
          <KeyValueDisplay
            label="Transaction Type"
            value={data.transactionType}
          />
          <VStack space="xs" reversed={false} style={{paddingVertical: 10}}>
            <ZText type={'R14'} numberOfLines={1}>
              {'Description'}
            </ZText>
            <ZTextMore type={'B16'} numberOfLines={2}>
              {data.propDescription}
            </ZTextMore>
          </VStack>
          {data.postPropertyAmenities > 0 && (
            <>
              <Divider className="my-0.5" />
              <KeyValueRow
                label="Amenities"
                values={data.postPropertyAmenities}
                valueKey="propertyAmenity"
              />
            </>
          )}
          {data.postNearbyFacilities > 0 && (
            <>
              <Divider className="my-0.5" />
              <KeyValueRow
                label="Near By Facilities"
                values={data.postNearbyFacilities}
                valueKey="nearbyFacility"
              />
            </>
          )}
          {data.postPropertyTypes && (
            <>
              <Divider className="my-0.5" />
              <KeyValueRow
                label="Property Type"
                values={data.postPropertyTypes}
                valueKey="propertyType"
              />
            </>
          )}

          {data.location && (
            <VStack space="md" style={{paddingVertical: 10}}>
              <Divider className="my-0.5" />
              <View>
                <ZText type={'B16'}>Location</ZText>
              </View>
              <LocationMap locationData={data.location} />
            </VStack>
          )}
          <VStack space="md" style={{paddingVertical: 10}}>
            <Divider className="my-0.5" />
            <View>
              <ZText type={'B16'}> Listed By</ZText>
            </View>
            <HStack>
              <ZAvatarInitials
                onPress={() =>
                  onPressUser(data.userId, data.postedBy, data.profileImage)
                }
                // item={postData}
                sourceUrl={data.profileImage}
                iconSize="md"
                styles={styles.profileImage}
                name={data.postedBy}
              />
              <TouchableOpacity
                onPress={() =>
                  onPressUser(data.userId, data.postedBy, data.profileImage)
                }
                style={{marginLeft: 15, justifyContent: 'center'}}>
                <ZText type={'B16'}>{data.postedBy}</ZText>
                <ZText type={'R14'}>{formatDate(data.postedOn)}</ZText>
              </TouchableOpacity>
            </HStack>
          </VStack>

          {/* <KeyValueRow
  label="Nearby Facilities"
  values={data.postNearbyFacilities}
  valueKey="propertyAmenity"></KeyValueRow> */}
        </VStack>
      </View>
    </>
  );
};

const carDetails = (data: any, user: any, navigation: any) => {
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

  const generateLink = async () => {
    // console.log(data);
    try {
      const response = await fetch(
        `https://tinyurl.com/api-create.php?url=${encodeURIComponent(
          `brokerapp://ItemDetailScreen/${data?.postId}/Car/Post`,
        )}`,
      );
      const text = await response.text();

      return text;
    } catch (error) {}
  };

  const sharePost = async () => {
    const getLink = await generateLink();

    try {
      await Share.share({
        message: getLink,
      });
    } catch (error) {}
  };
  return (
    <>
      {/* Check and Heart Icons */}
      {data.isBrokerAppVerified && (
        <View style={styles.iconContainer}>
          <View style={styles.checkIcon}>
            <Card_check_icon />
          </View>
        </View>
      )}
      <PostActions
        item={data}
        User={user}
        listTypeData={'Car'}
        onUpdateLikeCount={newCount => {
          //   console.log(newCount);
        }}
      />
      {/* Car Details */}
      <VStack space="md" style={styles.detailsContainer}>
        <ZText type={'M16'} color={'#E00000'}>
          {'\u20B9'} {formatNumberToIndianSystem(data?.price)}
        </ZText>

        <ZTextMore type={'B16'} numberOfLines={1}>
          {data.title}
        </ZTextMore>
      </VStack>
      <Divider className="my-0.5" />
      <View style={styles.detailsContainer}>
        <VStack space="xs">
          <ZText type={'B16'} numberOfLines={1} style={{paddingVertical: 5}}>
            {'Details'}{' '}
          </ZText>
          <KeyValueDisplay label="Brand Name" value={data.brand} />
          <KeyValueDisplay label="Model Name" value={data.model} />
          <KeyValueDisplay label="Fuel Type" value={data.fuelType} />
          <KeyValueDisplay label="Color" value={data.color} />
          <KeyValueDisplay label="Transmission" value={data.Transmission} />
          <KeyValueDisplay label="Ownership" value={data.ownership} />
          <KeyValueDisplay
            label="Registration State"
            value={data.registrationState}
          />
          <KeyValueDisplay
            label="Seating Capacity"
            value={data.seatingCapacity}
          />
          <KeyValueDisplay
            label="Registration Year"
            value={data.registrationYear}
          />
          <KeyValueDisplay label="Mileage" value={data.mileage} />
          <KeyValueDisplay label="Kms Driven" value={data.kmsDriven} />
          <KeyValueDisplay
            label="Engine Displacement"
            value={data.engineDisplacement}
          />
          <KeyValueDisplay
            label="Year Of Manufacture"
            value={data.yearOfManufacture}
          />
          <KeyValueDisplay
            label="Car Engine Power"
            value={data.carEnginePower}
          />
          <KeyValueDisplay
            label="Number Of Airbags"
            value={data.numberOfAirbags}
          />
          {data.location && (
            <VStack space="md" style={{paddingVertical: 10}}>
              <Divider className="my-0.5" />
              <View>
                <ZText type={'B16'}>Location</ZText>
              </View>
              <LocationMap locationData={data.location} />
            </VStack>
          )}
          <VStack space="md" style={{paddingVertical: 10}}>
            <Divider className="my-0.5" />
            <View>
              <ZText type={'B16'}> Listed By</ZText>
            </View>
            <HStack>
              <ZAvatarInitials
                onPress={() =>
                  onPressUser(data.userId, data.postedBy, data.profileImage)
                }
                // item={postData}
                sourceUrl={data.profileImage}
                iconSize="md"
                styles={styles.profileImage}
                name={data.postedBy}
              />
              <TouchableOpacity
                onPress={() =>
                  onPressUser(data.userId, data.postedBy, data.profileImage)
                }
                style={{marginLeft: 15, justifyContent: 'center'}}>
                <ZText type={'B16'}>{data.postedBy}</ZText>
                <ZText type={'R14'}>{formatDate(data.postedOn)}</ZText>
              </TouchableOpacity>
            </HStack>
          </VStack>
        </VStack>
      </View>
    </>
  );
};

const ItemDetailScreen: React.FC<any> = ({
  route,
  navigation,
  setLoading,
  isLoading,
}) => {
  const AppLocation = useSelector((state: RootState) => state.AppLocation);
  const user = useSelector((state: RootState) => state.user.user);

  const toast = useToast();
  const {onGoBack} = route.params; // Retrieve item and callback function
  const [toastId, setToastId] = React.useState(0);
  const userPermissions = useSelector(
    (state: RootState) => state.user.user.userPermissions,
  );

  const MediaGalleryRef = useRef(null);
  const {logButtonClick} = useUserJourneyTracker(
    `${route.params.postType} Detail Page`,
  );
  const {data, status, error, execute} = useApiRequest(
    fetchPostByID,
    setLoading,
  );
  const showToast = (TextMSG: any) => {
    if (!toast.isActive(toastId)) {
      const newId = Math.random();
      setToastId(newId);
      toast.show({
        id: newId,
        placement: 'bottom',
        duration: 3000,
        render: ({id}) => {
          const uniqueToastId = 'toast-' + id;
          return (
            <Toast nativeID={uniqueToastId} action="muted" variant="solid">
              <ToastDescription>{TextMSG}</ToastDescription>
            </Toast>
          );
        },
      });
    }
  };

  const deletePost = () => {
    // Show an alert to confirm deletion
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this post?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              if (data.postId) {
                //    console.log(data);
                const result = await deleteMyPost(
                  user.userId,
                  data.postId,
                  route.params.postType,
                );
                showToast(result.statusMessage);
                handleUpdate('Delete');
                //  navigation.goBack();
                // navigation.navigate("ProfileScreen");
              } else {
                showToast(result.error);
              }
            } catch (error) {}
          },
        },
      ],
      {cancelable: false},
    );
  };

  const callItemDetail = async () => {
    // console.log(route, route.params.postType, 'route');

    await execute(route.params.postType, route.params.postId);
  };
  const chatProfilePress = useCallback(async () => {
    if (user.userId.toString() == data.userId.toString()) {
      Alert.alert('Error', 'You cannot chat with yourself.');
    } else {
      const members = [user.userId.toString(), data.userId.toString()];

      navigation.navigate('AppChat', {
        defaultScreen: 'ChannelScreen',
        defaultParams: members,
        // defaultchannelSubject: `Hi,i want to connect on ${data.title}`,
      });
    }
  }, [data]);
  const makeCall = useCallback(async phoneNumber => {
    const url = `tel:${phoneNumber}`;

    const checkPermissionAndOpen = async () => {
      const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.CALL_PHONE,
      );
      if (hasPermission) {
        Linking.openURL(url);
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CALL_PHONE,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          Linking.openURL(url);
        } else {
          Alert.alert(
            'Permission Denied',
            'You need to enable call permissions to use this feature',
          );
        }
      }
    };

    if (Platform.OS === 'android') {
      await checkPermissionAndOpen();
    } else {
      Linking.canOpenURL(url)
        .then(supported => {
          if (supported) {
            Linking.openURL(url);
          } else {
            Alert.alert(
              'Oops! ',
              'No contact info available for this post. Try reaching out through other channels!',
            );
          }
        })
        .catch(err => console.error('Error opening dialer', err));
    }
  }, []);
  useEffect(() => {
    callItemDetail();
  }, []);
  const handleUpdate = async (Action: any = 'Back') => {
    if (onGoBack) {
      // await execute();
      // await new Promise(resolve => setTimeout(resolve, 100));
      // console.log("execute");
      //   console.log(data);
      onGoBack({Action: Action, Data: data}); // Call the callback function with updated data
    }
    navigation.goBack(); // Go back to FirstScreen
  };
  // console.log(data, 'j');
  return (
    <BottomSheetModalProvider>
      <View style={styles.listContainer}>
        <ScrollView>
          <View style={styles.headerContainer}>
            <View style={styles.header}>
              <View style={styles.IconButton}>
                <TouchableOpacity
                  onPress={handleUpdate}
                  style={{
                    // ...styles.appTitleMain,
                    // color: '#007acc',
                    padding: 8,
                    borderWidth: 1,
                    borderColor: '#E5E5E5',
                    borderRadius: 40,
                  }}>
                  <ArrowLeftIcon onPress={handleUpdate} />
                </TouchableOpacity>
                <ZText type={'R18'}>{data?.title}</ZText>
              </View>
              {user.userId == data?.userId && (
                <View style={styles.IconButton}>
                  <TouchableOpacityWithPermissionCheck
                    permissionsArray={userPermissions}
                    permissionEnum={PermissionKey.AllowDeletePost}
                    tagNames={[Icon]}
                    onPress={deletePost}>
                    <Icon as={TrashIcon} size="xl" />
                  </TouchableOpacityWithPermissionCheck>

                  {/* <Icon as={TrashIcon} size="xl" /> */}
                </View>
              )}
            </View>
          </View>

          <View>
            <HStack space="md" reversed={false} style={{paddingHorizontal: 20}}>
              {error != null && <OopsScreen></OopsScreen>}
              {data == null && isLoading == false && (
                <NoDataFoundScreen></NoDataFoundScreen>
              )}
              {data !== null && (
                <View style={styles.cardContainer}>
                  <MediaGallery
                    ref={MediaGalleryRef}
                    mediaItems={data?.postMedia}
                    paused={false}
                  />
                  {route.params.postType === 'Post'
                    ? propertyDetails(data, user, navigation)
                    : carDetails(data, user, navigation)}
                </View>
              )}
              {/* End */}
            </HStack>
          </View>
        </ScrollView>
        {data?.userId !== user.userId && (
          <View style={styles.footer}>
            <HStack
            // space="md"
            >
              <HStack
                style={{
                  alignItems: 'center',
                  width: '50%',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  style={styles.callbtn}
                  onPress={() => makeCall(data.contactNo)}>
                  <View style={{alignItems: 'center'}}>
                    <Icon
                      as={Telephone_Icon}
                      color={colors.light.appred}
                      size={'xxl'}
                    />
                  </View>
                  <View style={{alignItems: 'center', paddingVertical: 10}}>
                    <ZText type={'M14'}>Call</ZText>
                  </View>
                </TouchableOpacity>
              </HStack>
              <HStack
                style={{
                  alignItems: 'center',
                  width: '50%',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  style={styles.Chatbtn}
                  onPress={() => chatProfilePress()}>
                  <View style={{alignItems: 'center', marginRight: 10}}>
                    <Icon as={Chat_Icon} color={'#0F5DC4'} size={'xxl'} />
                  </View>
                  <View style={{alignItems: 'center', paddingVertical: 10}}>
                    <ZText type={'M14'}>Chat</ZText>
                  </View>
                </TouchableOpacity>
              </HStack>
            </HStack>
          </View>
        )}
      </View>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  callbtn: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef4f4',
    width: '90%',
    marginLeft: 10,
    paddingVertical: 5, // Vertical padding
    paddingHorizontal: 5, // Horizontal padding
    borderRadius: 8, // Rounded corners

    justifyContent: 'center',
  },
  Chatbtn: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F7FE',
    width: '90%',

    paddingVertical: 5, // Vertical padding
    paddingHorizontal: 5, // Horizontal padding
    borderRadius: 8, // Rounded corners

    marginRight: 10,
    justifyContent: 'center',
  },
  // footer: {
  //   flexDirection: 'row',
  //   //justifyContent: 'space-around',
  //   alignItems: 'center',
  //   // paddingVertical: 15,
  //   backgroundColor: '#FFF',
  //   borderTopWidth: 1,
  //   borderColor: '#e0e0e0',
  // },

  profileImage: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    marginRight: 15,
  },
  headerContainer: {
    backgroundColor: '#FFF',
    paddingVertical: 10,
  },
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  listContainer: {
    backgroundColor: '#FFF',
    flex: 1,
  },
  LeftCol: {
    width: '50%',
  },
  RightCol: {
    width: '50%',
  },
  footer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    height: 80,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  IconButton: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerContainer: {
    backgroundColor: '#FFF',
  },
  heading: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  headingTitle: {
    color: '#263238',
    fontFamily: 'Gilroy',
    fontSize: 18,
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: 24,
  },
  link: {
    color: '#C20707',
  },

  itemContainer: {
    width: 375,
    height: 478,
    //borderRadius: 12,
    backgroundColor: '#FFF', // Equivalent to background: var(--white, #FFF)
    //shadowColor: 'rgba(0, 0, 0, 0.8)', // shadow color
    //shadowOffset: {width: 0, height: 4}, // shadow offset
    //shadowOpacity: 1, // shadow opacity
    //shadowRadius: 64, // blur radius (64px)
    //elevation: 8,
    marginHorizontal: 8,
  },
  itemFooterContainer: {
    backgroundColor: '#FFF',
    paddingVertical: 10,
    paddingLeft: 5,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  separator: {
    width: 10, // Space between cards
  },
  tagImage: {
    width: 375,
    height: 278,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardContainer: {
    width: '100%',
    //borderRadius: 12,
    backgroundColor: '#FFF',
    // margin: 10,
    // paddingBottom: 10,
    //shadowColor: 'rgba(0, 0, 0, 0.8)',
    //shadowOffset: {width: 0, height: 4},
    //shadowOpacity: 1,
    //shadowRadius: 20,
    //elevation: 4,
  },
  carImage: {
    width: 375,
    height: 278,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  iconContainer: {
    position: 'absolute',
    top: 8,
    // left: 8,
    right: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  checkIcon: {
    // backgroundColor: '#377DFF',
    borderRadius: 20,
    padding: 3,
  },
  heartIcon: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 3,
  },
  detailsContainer: {
    // paddingLeft: 20,
    paddingVertical: 10,
  },
  detailsContainetop: {
    // paddingLeft: 20,
    paddingVertical: 10,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#7A7A7A',
    marginLeft: 4,
  },
  carBrand: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginTop: 4,
  },
});

export default AppBaseContainer(ItemDetailScreen, false, false);
