/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/no-unstable-nested-components */
// src/screens/HomeScreen.tsx

import {Back, Location_Icon} from '../../../assets/svg';
import {useS3} from '../../../Context/S3Context';
import {useEffect, useState} from 'react';
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
import {styles} from '../../../themes';
import {Color} from '../../../styles/GlobalStyles';
import RNFS from 'react-native-fs';
const {width} = Dimensions.get('window');
const devicewidth = Dimensions.get('window').width;
import uuid from 'react-native-uuid';
import {useSelector} from 'react-redux';
import {
  getFileExtensionFromMimeType,
  uriToBlob,
  uriToBlobRFNS,
} from '../../../utils/helpers';
import {
  postsImagesBucketPath,
  postsVideosBucketPath,
} from '../../../config/constants';

import FastImage from '@d11/react-native-fast-image';
import ZText from '../../../sharedComponents/ZText';
import {Box} from '../../../../components/ui/box';
import ZSafeAreaView from '../../../sharedComponents/ZSafeAreaView';
import ZHeader from '../../../sharedComponents/ZHeader';
import Video from 'react-native-video';
import AppBaseContainer from '../../../hoc/AppBaseContainer_old';
import {useApiRequest} from '../../../hooks/useApiRequest';
import {
  sendCarPostData,
  sendGenericPostData,
} from '../../../../BrokerAppCore/services/new/postServices';
import {Toast, ToastDescription} from '../../../../components/ui/toast';
import {HStack} from '../../../../components/ui/hstack';
import {Icon} from '../../../../components/ui/icon';
import {VStack} from '../../../../components/ui/vstack';
import {Divider} from '../../../../components/ui/divider';
import LocationMap from '../../../sharedComponents/LocationMap';
import KeyValueDisplay from '../../../sharedComponents/KeyValueDisplay';
import ZTextMore from '../../../sharedComponents/ZTextMore';

const CarPostPreview: React.FC = ({
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
  const [displayfilter, setdisplayfilter] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPropertySize, setselectedPropertySize] = useState('1');
  const [toastId, setToastId] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const {
    data: Genericdata,
    status: Genericstatus,
    error: Genericerror,
    execute: Genericexecute,
  } = useApiRequest(sendCarPostData);

  useEffect(() => {
    // This useEffect runs when CarFilters data changes
    const flatData = Object.keys(filter).map(type => ({
      key: type,
      value: filter[type].map(item => item.value).join(', '),
    }));

    setdisplayfilter(flatData);
  }, [filter]);

  useEffect(() => {
    // This useEffect runs when CarFilters data changes

    if (Genericstatus == 200) {
      navigation.navigate('Home');
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
    }
  }, [Genericstatus]);

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
          <ZText numberOfLines={1} color={'#BC4A4F'} type={'R16'}>
            {`Save`}
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

  const savePost = async (FormValue, Formtags, imagesArray) => {
    try {
      setLoading(true);

      const uploadPromises = [];
      let uploadedImageUrls = [];

      if (Isvideo === false) {
        //code by Prashant for loop not calling the immagearray
        for (const image of imagesArray) {
          const uri =
            Platform.OS === 'ios' && !image.Edit
              ? image.uri
              : image.destinationPathuri;

          const responseBlob = await uriToBlob(image.destinationPath);

          const fileExtension = getFileExtensionFromMimeType(
            responseBlob?._data.type,
          );
          const docId = uuid.v4();
          const imageName = `${docId}.${fileExtension}`;
          const params = {
            Bucket: Bucket,
            Key: `${postsImagesBucketPath}${imageName}`,
            Body: responseBlob,
          };

          const uploadPromise = s3.upload(params).promise();
          uploadPromises.push(uploadPromise);
        }

        const results = await Promise.all(uploadPromises);

        uploadedImageUrls = results.map((result, index) => {
          if (result) {
            return {mediaBlobId: result.Key};
          } else {
            console.error('Error uploading image to S3:', imagesArray[index]);
            return null;
          }
        });

        for (const item of imagesArray) {
          if (item.Edit) {
            await deleteImage(item.destinationPath);
          }
        }
      } else {
        const responseBlob = await uriToBlob(imagesArray.uri);

        const fileExtension = getFileExtensionFromMimeType(
          responseBlob?._data.type,
        );
        const docId = uuid.v4();
        const imageName = `${docId}.${fileExtension}`;
        const params = {
          Bucket: Bucket,
          Key: `${postsVideosBucketPath}${imageName}`,
          Body: responseBlob,
        };

        const uploadPromise = s3.upload(params).promise();
        uploadPromises.push(uploadPromise);

        const results = await Promise.all(uploadPromises);

        uploadedImageUrls = results.map((result, index) => {
          if (result) {
            return {mediaBlobId: result.Key};
          } else {
            console.error('Error uploading image to S3:', imagesArray[index]);
            return null;
          }
        });
      }

      const successfulUploads = uploadedImageUrls.filter(url => url !== null);

      if (successfulUploads.length > 0) {
        await requestAPI(successfulUploads, FormValue, Formtags);
      } else {
        setLoading(false);
        toast('No images were uploaded to S3.');
      }
    } catch (error) {
      setLoading(false);
      // toast.show({
      //   title: 'Post creation failed',
      // });
    }
  };

  const requestAPI = async (mediaData, FormValue, Formtags) => {
    //code by Prashant Wrapped this api request in proper try catch

    try {
      setLoading(true);

      let tags = [];
      let localitie = route.params?.localities;

      const requestOption = {
        userId: user.userId,
        title: FormValue.title,
        description: FormValue.propDescription,
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
        price: FormValue.price,
        yearOfManufacture: FormValue.yearOfManufacture,
        registrationYear: FormValue.registrationYear,
        isNewCar: FormValue.isNewCar,
        discount: 0,
        mileage: FormValue.mileage,
        kmsDriven: FormValue.kmsDriven,
        engineDisplacement: FormValue.engineDisplacement,
        carEnginePower: FormValue.carEnginePower,
        numberOfAirbags: 0,
        postMedia: mediaData,
      };
      if (filter.hasOwnProperty('Brand') && Array.isArray(filter.Brand)) {
        requestOption.brandId = filter['Brand'][0].key;
        requestOption.brandVal = filter['Brand'][0].value;
      }
      if (filter.hasOwnProperty('Model') && Array.isArray(filter.Model)) {
        requestOption.modelId = filter['Model'][0].key;
        requestOption.modelName = filter['Model'][0].value;
      }
      if (filter.hasOwnProperty('FuelType') && Array.isArray(filter.FuelType)) {
        requestOption.fuelTypeId = filter['FuelType'][0].key;
        requestOption.fuelType = filter['FuelType'][0].value;
      }
      if (filter.hasOwnProperty('Color') && Array.isArray(filter.Color)) {
        requestOption.colorId = filter['Color'][0].key;
        requestOption.colorVal = filter['Color'][0].value;
      }
      if (filter.hasOwnProperty('BodyType') && Array.isArray(filter.BodyType)) {
        requestOption.bodyTypeId = filter['BodyType'][0].key;
        requestOption.bodyTypeVal = filter['BodyType'][0].value;
      }

      if (
        filter.hasOwnProperty('Transmission') &&
        Array.isArray(filter.Transmission)
      ) {
        requestOption.transmissionId = filter['Transmission'][0].key;
        requestOption.transmissionVal = filter['Transmission'][0].value;
      }

      if (
        filter.hasOwnProperty('Ownership') &&
        Array.isArray(filter.Transmission)
      ) {
        requestOption.ownershipCountId = filter['Ownership'][0].key;
        requestOption.ownershipCountVal = filter['Ownership'][0].value;
      }
      if (
        filter.hasOwnProperty('SeatingCapacity') &&
        Array.isArray(filter.SeatingCapacity)
      ) {
        requestOption.seatingCapacityId = filter['SeatingCapacity'][0].key;
        requestOption.seatingCapacity = filter['SeatingCapacity'][0].value;
      }
      if (
        filter.hasOwnProperty('RegistrationState') &&
        Array.isArray(filter.RegistrationState)
      ) {
        requestOption.registrationStateId = filter['RegistrationState'][0].key;
        requestOption.registrationState = filter['RegistrationState'][0].value;
      }

      if (
        filter.hasOwnProperty('InsuranceStatus') &&
        Array.isArray(filter.InsuranceStatus)
      ) {
        requestOption.insuranceStatusId = filter['InsuranceStatus'][0].key;
        requestOption.insuranceStatus = filter['InsuranceStatus'][0].value;
      }

      await Genericexecute(requestOption);

      // navigation.navigate('Home');
      // if (!toast.isActive(toastId)) {
      //   const newId = Math.random();
      //   setToastId(newId);
      //   toast.show({
      //     id: newId,
      //     placement: 'bottom',
      //     duration: 3000,
      //     render: ({id}) => {
      //       const uniqueToastId = 'toast-' + id;
      //       return (
      //         <Toast nativeID={uniqueToastId} action="muted" variant="solid">
      //           <ToastDescription>Post created successfully</ToastDescription>
      //         </Toast>
      //       );
      //     },
      //   });
      // }
    } catch (error) {
      console.error('Error in requestAPI:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({item, index}) => (
    <View style={localStyles.card}>
      {/* <Text>{item.destinationPathuri}</Text> */}
      {Platform.OS == 'ios' ? (
        <Image source={{uri: item.destinationPath}} style={localStyles.image} />
      ) : (
        <FastImage
          source={{uri: item.destinationPath}}
          style={localStyles.image}
        />
      )}
    </View>
  );

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
            <VStack space="md" style={localStyles.detailsContainer}>
              <ZText type={'M16'} color={'#E00000'}>
                {'\u20B9'} {formValue?.price}
              </ZText>

              <ZTextMore type={'B16'} numberOfLines={1}>
                {formValue.title}
              </ZTextMore>
            </VStack>
            <Divider className="my-0.5" />
            <View style={localStyles.detailsContainer}>
              <VStack space="xs">
                <ZText
                  type={'B16'}
                  numberOfLines={1}
                  style={{paddingVertical: 5}}>
                  {'Details'}{' '}
                </ZText>
                {displayfilter.map((item, index) => (
                  <KeyValueDisplay label={item.key} value={item.value} />
                ))}
                <KeyValueDisplay
                  label="Registration Year"
                  value={formValue.registrationYear}
                />
                <KeyValueDisplay label="Mileage" value={formValue.mileage} />
                <KeyValueDisplay
                  label="Kms Driven"
                  value={formValue.kmsDriven}
                />
                <KeyValueDisplay
                  label="Engine Displacement"
                  value={formValue.engineDisplacement}
                />
                <KeyValueDisplay
                  label="Year Of Manufacture"
                  value={formValue.yearOfManufacture}
                />
                <KeyValueDisplay
                  label="Car Engine Power"
                  value={formValue.carEnginePower}
                />
                {/* <KeyValueDisplay
            label="Number Of Airbags"
            value={data.numberOfAirbags}
          /> */}
                <Divider className="my-0.5" />
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
                {formValue.Location && (
                  <VStack space="md" style={{paddingVertical: 10}}>
                    <Divider className="my-0.5" />
                    <View>
                      <ZText type={'B16'}>Location</ZText>
                    </View>
                    <LocationMap locationData={formValue.Location} />
                  </VStack>
                )}
              </VStack>
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
    paddingHorizontal: 20,
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
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'rgba(1, 125, 197, 0.2)',
    backgroundColor: 'rgba(1, 125, 197, 0.1)',
  },
  bodyContainer: {
    backgroundColor: Color.white,
    ...styles.mb15,
  },
  ROW: {display: 'flex', flexDirection: 'row'},
  ROW1: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: Color.gray,
  },
  ROW2: {
    display: 'flex',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Color.gray,
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
  detailsContainetop: {
    // paddingLeft: 20,
    paddingVertical: 10,
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
  detailsContainer: {
    // paddingLeft: 20,
    paddingVertical: 10,
  },
});
export default AppBaseContainer(CarPostPreview, ' ', false);
