/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
// src/screens/HomeScreen.tsx

import {colors, styles} from '../../../themes';
import {useS3} from '../../../Context/S3Context';
import {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import RNFS from 'react-native-fs';
const {width} = Dimensions.get('window');
const devicewidth = Dimensions.get('window').width;
import uuid from 'react-native-uuid';
import {useSelector} from 'react-redux';
import {Color} from '../../../styles/GlobalStyles';
import ZSafeAreaView from '../../../sharedComponents/ZSafeAreaView';
import ZHeader from '../../../sharedComponents/ZHeader';
import ZText from '../../../sharedComponents/ZText';
import {Box} from '../../../../components/ui/box';
import FastImage from '@d11/react-native-fast-image';
import {sendPostData} from '../../../../BrokerAppCore/services/postService';
import Video from 'react-native-video';
import {
  formatNumberToIndianSystem,
  getFileExtensionFromMimeType,
  uriToBlob,
} from '../../../utils/helpers';
import {
  moderateScale,
  postsImagesBucketPath,
  postsVideosBucketPath,
} from '../../../config/constants';
import {Back, Location_Icon} from '../../../assets/svg';
import AppBaseContainer from '../../../hoc/AppBaseContainer_old';
import {useApiRequest} from '../../../hooks/useApiRequest';
import {sendPropPostData} from '../../../../BrokerAppCore/services/new/postServices';
import {Toast, ToastDescription} from '../../../../components/ui/toast';
import LocationMap from '../../../sharedComponents/LocationMap';
import {VStack} from '../../../../components/ui/vstack';
import {HStack} from '../../../../components/ui/hstack';
import IconValueDisplay from '../../../sharedComponents/IconValueDisplay';
import {Icon} from '../../../../components/ui/icon';
import {Divider} from '../../../../components/ui/divider';
import ZTextMore from '../../../sharedComponents/ZTextMore';
import KeyValueDisplay from '../../../sharedComponents/KeyValueDisplay';
import KeyValueRow from '../../../sharedComponents/KeyValueRow';

const PropertyPostPreview: React.FC = ({
  toast,

  navigation,
  user,
  s3,
  route,
}: any) => {
  const Bucket = 'broker2023';
  const [filter, setfilter] = useState<any>(route.params?.filters);

  const [imagesArray, setimagesArray] = useState<any>(route.params?.postVisual);
  const [Isvideo, setIsvideo] = useState<any>(route.params?.Isvideo);
  const [formValue, setformValue] = useState<any>(route.params?.formValue);
  const [localities, setlocalities] = useState<any>(route.params?.localities);
  // const isLast = index === filter.length - 1;
 // const [selectedPropertySize, setselectedPropertySize] = useState('1');

  const [selectedPropertySize, setselectedPropertySize] = useState<any>(route.params?.selectedPropertySize);
  const [loading, setLoading] = useState(false);
  const [toastId, setToastId] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  let localitie = route.params?.localities;
  const {
    data: Propdata,
    status: Propstatus,
    error: Properror,
    execute: Propexecute,
  } = useApiRequest(sendPropPostData);
  const Pagination = ({index, length}) => {
    return (
      <View style={localStyles.paginationWrapper}>
        {Array.from({length: length}, (_, i) => (
          <View
            key={i}
            style={[localStyles.dot, index === i && localStyles.activeDot]}
          />
        ))}
      </View>
    );
  };

  const arrowbackSubmit = () => {
    Alert.alert(
      'Warning !',
      'Data will be lost. Do you want to go back?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            // Handle navigation back here
            navigation.goBack(); // or navigation.navigate('Home') based on your requirement
          },
        },
      ],
      {cancelable: false},
    );
  };
  const LeftIcon = () => {
    return (
      <View style={styles.rowCenter}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View
            style={{
              // ...styles.appTitleMain,
              // color: '#007acc',
              padding: 8,
              borderWidth: 1,
              borderColor: '#E5E5E5',
              borderRadius: 40,
            }}>
            <Back accessible={true} accessibilityLabel="Back" />
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  const RightIcon = () => {
    return (
      <View style={styles.rowCenter}>
        <TouchableOpacity
          style={[styles.pr10, {marginRight: 15}]}
          // style={}
          onPress={() => {
            savePost(formValue, filter, imagesArray);
          }}>
          <ZText numberOfLines={1} color={Color.primary} type={'R16'}>
            {'Save'}
          </ZText>
        </TouchableOpacity>
      </View>
    );
  };
  const deleteImage = async imagePath => {
    try {
      const result = await RNFS.unlink(imagePath);

      // Handle the success scenario, maybe update the state or UI
    } catch (error) {
      console.error('Error Deleting File:', error.message);
      // Handle the error scenario
    }
  };
  // console.log(localitie, 'Formvalues');
  const savePost = async (FormValue, Formtags, imagesArray) => {
    try {
      const uploadPromises = [];
      let uploadedImageUrls = [];
      setLoading(true);

      if (Isvideo === false) {
        for (const image of imagesArray) {
          try {
            const responseBlob = await uriToBlob(
              Platform.OS === 'ios' && !image.Edit
                ? image.uri
                : image.destinationPath,
            );

            const fileExtension = getFileExtensionFromMimeType(
              responseBlob.type,
            );
            const docId = uuid.v4();
            const imageName = docId + '.' + fileExtension;
            const params = {
              Bucket: Bucket,
              Key: postsImagesBucketPath + imageName,
              Body: responseBlob,
            };

            uploadPromises.push(s3.upload(params).promise());
          } catch (err) {
            console.error('Error processing image:', err);
          }
        }

        const results = await Promise.all(uploadPromises);
        uploadedImageUrls = results.map(result =>
          result ? {mediaBlobId: result.Key} : null,
        );

        imagesArray.forEach(async item => {
          if (item.Edit) {
            await deleteImage(item.destinationPath);
          }
        });
      } else {
        try {
          const responseBlob = await uriToBlob(imagesArray.uri);
          const fileExtension = getFileExtensionFromMimeType(responseBlob.type);
          const docId = uuid.v4();
          const imageName = docId + '.' + fileExtension;
          const params = {
            Bucket: Bucket,
            Key: postsVideosBucketPath + imageName,
            Body: responseBlob,
          };

          uploadPromises.push(s3.upload(params).promise());
        } catch (err) {
          console.error('Error processing video:', err);
        }

        const results = await Promise.all(uploadPromises);
        uploadedImageUrls = results.map(result =>
          result ? {mediaBlobId: result.Key} : null,
        );
      }

      const successfulUploads = uploadedImageUrls.filter(url => url !== null);

      if (successfulUploads.length > 0) {
        requestAPI(successfulUploads, FormValue, Formtags);
      } else {
        setLoading(false);
        toast('No images were uploaded to S3.');
        console.error('No images were uploaded to S3.');
      }
    } catch (error) {
      setLoading(false);
      console.error('Error uploading images to S3:', error);
    }
  };

  const requestAPI = async (mediaData: any, Formvaule: any, Formtags: any) => {
    setLoading(true);
    let tags = [];

    for (const property in Formtags) {
      let tag = Formtags[property].records.map((record: any) => {
        return {key: record.key, value: record.value};
      });

      tags.push({name: property, values: tag});
    }

    if (selectedPropertySize == 'Sq. Ft.') {
      tags.push({
        name: 'PropertySizeUnit',
        values: [
          {
            key: 1,
            value: 'Sq. Ft.',
          },
        ],
      });
    }
    if (selectedPropertySize == 'Sq. Mtr.') {
      tags.push({
        name: 'PropertySizeUnit',
        values: [
          {
            key: 2,
            value: 'Sq. Mtr.',
          },
        ],
      });
    }
    if (selectedPropertySize == 'Sq Yd.') {
      tags.push({
        name: 'PropertySizeUnit',
        values: [
          {
            key: 3,
            value: 'Sq Yd.',
          },
        ],
      });
    }

    const requestOption = {
      userId: user.userId,
      title: Formvaule.title,
      propDescription: Formvaule.propDescription,

      propertySize: Formvaule.propertySize,
      price: Formvaule.price,

      isVirtualTour: Formvaule.isVirtualTour,
      isBrokerAppVerified: Formvaule.isVirtualTour,
      isDiscounted: Formvaule.isVirtualTour,
      isMandateProperty: Formvaule.isVirtualTour,
      cityName: localitie.City,
      stateName: localitie.State,
      countryName: localitie.Country,
      placeID: localitie.placeID,
      placeName: localitie.placeName,
      geoLocationLatitude: localitie.geoLocationLatitude,
      geoLocationLongitude: localitie.geoLocationLongitude,
      viewportNorthEastLat: localitie.viewportNorthEastLat,
      viewportNorthEastLng: localitie.viewportNorthEastLng,
      viewportSouthWestLat: localitie.viewportSouthWestLat,
      viewportSouthWestLng: localitie.viewportSouthWestLng,
      postMedia: mediaData,
      filters: {tags: tags},
    };

    try {
      await Propexecute(requestOption); // Await the API call
      // Handle the data response as needed

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
                <ToastDescription>Post created successfully</ToastDescription>
              </Toast>
            );
          },
        });
      }

      navigation.navigate('Home');
    } catch (error) {
      console.error('Error executing request:', error);
      // You might want to display an error toast here if necessary
    } finally {
      setLoading(false); // Ensure loading is set to false regardless of success or error
    }
  };

  const renderItem = ({item, index}) => (
    <View style={localStyles.card}>
      {Platform.OS == 'ios' ? (
        <Image source={{uri: item.destinationPath}} style={localStyles.image} />
      ) : (
        <FastImage
          source={{uri: item.destinationPath}}
          style={localStyles.image}
        />
      )}
    </View>
    // <View style={localStyles.card}>
    //   <TouchableOpacity>
    //     <Image
    //       source={{uri: item.destinationPathuri}}
    //       style={localStyles.imagecard}
    //       // resizeMode="cover"
    //     />
    //   </TouchableOpacity>
    // </View>
  );

  const ItemROW = ({ITEM, NAME, isLast}) => {
    return (
      <View
        style={[
          localStyles.ROW2,
          !isLast && {borderBottomWidth: 1, borderColor: Color.gray1}, // Apply border only if it's not the last item
        ]}>
        <View style={localStyles.COL_LEFT}>
          <ZText type={'s16'}>{NAME}</ZText>
        </View>
        <View style={localStyles.COL_RIGHT}>
          {ITEM[NAME] && ITEM[NAME].records.length > 0 ? (
            <ZText type={'b18'}>{ITEM[NAME].records[0].value}</ZText>
          ) : (
            <ZText type={'b18'}>-</ZText>
          )}
        </View>
      </View>
    );
  };

  const MultiItemROW = ({ITEM, NAME}) => {
    return (
      <Box style={[localStyles.borderContainer, {paddingHorizontal: 20}]}>
        <View style={localStyles.IconContainer}>
          <View style={{...localStyles.cardfullIcon}}>
            <ZText type={'s16'} style={{marginBottom: 10}}>
              {NAME}
            </ZText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {ITEM[NAME].records.map((item, index) => (
                <View key={`nearby_${index}`} style={localStyles.bluetags}>
                  <ZText type={'r16'} color={Color.primary}>
                    {item.value}
                  </ZText>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Box>
    );
  };

  return (
    <ZSafeAreaView>
      <ZHeader
        title={'Preview'}
        rightIcon={<RightIcon />}
        isHideBack={true}
        isLeftIcon={<LeftIcon />}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          style={localStyles.root}>
          <View style={{paddingHorizontal: 20}}>
            <View>
              {Isvideo == false && (
                <>
                  <FlatList
                    data={imagesArray}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={({nativeEvent}) => {
                      const index = Math.round(
                        nativeEvent.contentOffset.x /
                          nativeEvent.layoutMeasurement.width,
                      );
                      setActiveIndex(index);
                    }}
                    contentContainerStyle={localStyles.listContainer}
                    x
                    // contentContainerStyle={
                    //   imagesArray.length > 1 && localStyles.listContainer
                    // }
                    renderItem={renderItem}
                    // renderItem={
                    //   imagesArray.length === 1 ? renderSinglItem : renderItem
                    // }

                    keyExtractor={item => item.id}
                  />
                  <Pagination index={activeIndex} length={imagesArray.length} />
                </>
              )}

              {Isvideo == true && (
                <Video
                  source={{uri: imagesArray.uri}}
                  repeat={false}
                  style={localStyles.media}
                  paused={true}
                  playWhenInactive={false}
                  resizeMode="contain"
                  controls={false}
                />
              )}
            </View>
            <View style={localStyles.bodyContainer}>
              <VStack space="xs" style={localStyles.detailsContainetop}>
                <ZText type={'M16'} color={colors.light.appred}>
                  {'\u20B9'} {formatNumberToIndianSystem(formValue.price)}
                </ZText>

                <HStack>
                  <IconValueDisplay
                    IconKey="bedroomType"
                    value={filter?.Bedroom?.records[0]?.value}
                  />
                  <IconValueDisplay
                    IconKey="bathroomType"
                    value={filter?.Bathroom?.records[0]?.value}
                  />
                  <IconValueDisplay
                    IconKey="balconyType"
                    value={filter?.Balcony?.records[0]?.value}
                  />
                  <IconValueDisplay
                    IconKey="propertySize"
                    value={`${formValue.propertySize} ${selectedPropertySize}`}
                  />
                </HStack>
                <View style={localStyles.locationContainer}>
                  {localitie.City && (
                    <>
                      <Icon as={Location_Icon} />
                      <ZText type={'R16'}>{localitie.placeName}</ZText>
                    </>
                  )}
                </View>
              </VStack>

              <Divider className="my-0.5" />
              <View style={localStyles.detailsContainer}>
                <VStack space="xs">
                  <ZTextMore type={'B16'} numberOfLines={1}>
                    {formValue.title}
                  </ZTextMore>

                  <ZText
                    type={'B16'}
                    numberOfLines={1}
                    style={{paddingVertical: 5}}>
                    {'Details'}{' '}
                  </ZText>
                  <KeyValueDisplay
                    label="Project"
                    value={filter?.Project?.records[0]?.value}
                  />
                  <KeyValueDisplay
                    label="Developed By"
                    value={filter?.Developer?.records[0]?.value}
                  />
                  <KeyValueDisplay
                    label="Construction Status"
                    value={filter?.ConstructionStatus?.records[0]?.value}
                  />

                  <KeyValueDisplay
                    label="Property Status"
                    value={filter?.PropertyStatus?.records[0]?.value}
                  />
                  <KeyValueDisplay
                    label="Property Age"
                    value={filter?.PropertyAge?.records[0]?.value}
                  />

                  <KeyValueDisplay
                    label="Property Status"
                    value={filter?.PropertyStatus?.records[0]?.value}
                  />
                  <KeyValueDisplay
                    label="Transaction Type"
                    value={filter?.TransactionType?.records[0]?.value}
                  />
                  <VStack
                    space="xs"
                    reversed={false}
                    style={{paddingVertical: 10}}>
                    <ZText type={'R14'} numberOfLines={1}>
                      {'Description'}
                    </ZText>
                    <ZTextMore type={'B16'} numberOfLines={2}>
                      {formValue.propDescription}
                    </ZTextMore>
                  </VStack>
                  {filter.Amenities?.records.length > 0 && (
                    <>
                      <Divider className="my-0.5" />
                      <KeyValueRow
                        label="Amenities"
                        values={filter.Amenities.records}
                        valueKey="propertyAmenity"
                        screentype="preview"
                      />
                    </>
                  )}
                  {filter.NearbyFacilities?.records.length > 0 && (
                    <>
                      <Divider className="my-0.5" />
                      <KeyValueRow
                        label="Near By Facilities"
                        values={filter.NearbyFacilities.records}
                        valueKey="nearbyFacility"
                        screentype="preview"
                      />
                    </>
                  )}
                  {filter.PropertyType?.records.length > 0 && (
                    <>
                      <Divider className="my-0.5" />
                      <KeyValueRow
                        label="Property Type"
                        values={filter.PropertyType.records}
                        valueKey="propertyType"
                        screentype="preview"
                      />
                    </>
                  )}

                  {localitie && (
                    <VStack space="md" style={{paddingVertical: 10}}>
                      <Divider className="my-0.5" />
                      <View>
                        <ZText type={'B16'}>Location</ZText>
                      </View>
                      <LocationMap locationData={localitie} />
                    </VStack>
                  )}
                </VStack>
              </View>
            </View>
          </View>
        </ScrollView>
        {loading && (
          <Modal transparent={true} animationType="fade">
            <View style={localStyles.loaderContainer}>
              <ActivityIndicator size="large" color={Color.primary} />
            </View>
          </Modal>
        )}
      </KeyboardAvoidingView>
    </ZSafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  borderContainer: {
    borderTopWidth: 2,
    paddingVertical: 15,
    borderColor: Color.gray1,
  },
  IconContainer: {
    ...styles.rowSpaceAround,
    flexDirection: 'row',
    alignItems: 'center', // Align icons and text vertically
    //justifyContent: 'space-evenly',
    width: '100%',
    marginRight: 50,
  },
  cardfullIcon: {
    flexDirection: 'coloumn',
    alignItems: 'baseline',
    flexWarp: 'wrap',
    width: '100%',
  },
  bluetags: {
    borderWidth: 1,
    marginRight: 15,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Color.primary,
    backgroundColor: 'rgba(188, 74, 79, 0.1)',
  },
  bodyContainer: {
    backgroundColor: Color.white,
    ...styles.mb15,
  },
  ROW: {display: 'flex', flexDirection: 'row', padding: 15},
  ROW1: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: Color.gray,
    padding: 15,
  },
  ROW2: {
    display: 'flex',
    flexDirection: 'row',
    // borderBottomWidth: 1,
    // borderBottomColor: Color.gray,
    padding: 15,
  },
  COL: {
    width: '100%',
  },
  COL_LEFT: {
    width: '50%',
  },
  COL_RIGHT: {
    width: '50%',
  },
  root: {
    ...styles.flex,
    // ...styles.ph20,
    ...styles.mb40,
  },
  paginationWrapper: {
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
    margin: 4,
  },
  activeDot: {
    backgroundColor: '#FF6B6B',
  },
  media: {
    width: '100%',
    height: 200,
  },
  // listContainer: {
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  listcontent: {
    width: '90%',
    alignContent: 'center',
    flexWrap: 'wrap',
    wordWrap: 'break-word',
    marginLeft: 20,
    paddingHorizontal: 20,
  },
  card: {
    // width: devicewidth, // Card takes up full width of the screen
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor:'red'
    // Add additional styling for the card here
  },
  image: {
    width: devicewidth - 40, // Slightly less than full width for card padding effect
    height: devicewidth - 200, // Making the image square, but you can adjust as needed
    resizeMode: 'cover',
    borderRadius: 10, // Adds rounded corners to the image
    // Add additional styling for the image here
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background to highlight the loader
  },
  detailsContainetop: {
    // paddingLeft: 20,
    paddingVertical: 10,
    // paddingHorizontal: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  detailsContainer: {
    // paddingLeft: 20,
    paddingVertical: 10,
  },

  locationText: {
    fontSize: 12,
    color: '#7A7A7A',
    marginLeft: 4,
  },
});
export default AppBaseContainer(PropertyPostPreview, ' ', false);
