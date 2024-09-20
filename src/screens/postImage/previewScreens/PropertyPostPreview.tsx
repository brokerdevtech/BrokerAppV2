/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
// src/screens/HomeScreen.tsx

import {styles} from '../../../themes';
import {useS3} from '../../../Context/S3Context';
import {useState} from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
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
import {sendPostData} from '../../../../BrokerAppcore/services/postService';
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
import {Back} from '../../../assets/svg';

const PropertyPostPreview: React.FC = ({
  toast,

  navigation,
  user,
  color,
  route,
}: any) => {
  const colors = useSelector(state => state.theme.theme);
  const Bucket = 'broker2023';
  const [filter, setfilter] = useState<any>(route.params?.filters);
  const s3 = useS3();
  const [imagesArray, setimagesArray] = useState<any>(route.params?.postVisual);
  const [Isvideo, setIsvideo] = useState<any>(route.params?.Isvideo);
  const [formValue, setformValue] = useState<any>(route.params?.formValue);
  const [localities, setlocalities] = useState<any>(route.params?.localities);
  // const isLast = index === filter.length - 1;
  const [selectedPropertySize, setselectedPropertySize] = useState('1');
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
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
        <TouchableOpacity
          style={styles.pr10}
          onPress={() => {
            navigation.goBack();
          }}>
          <Back accessible={true} accessibilityLabel="Back" />
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
          <ZText numberOfLines={1} color={'#BC4A4F'} type={'b16'}>
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
      const uploadPromises = [];
      let uploadedImageUrls = [];
      setLoading(true);

      if (Isvideo === false) {
        for (const image of imagesArray) {
          try {
            const responseBlob = await uriToBlob(
              Platform.OS === 'ios' && !image.Edit
                ? image.uri
                : image.destinationPathuri,
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
    let tags = [];

    for (const property in Formtags) {
      let tag = Formtags[property].records.map((record: any) => {
        return {key: record.key, value: record.value};
      });

      tags.push({name: property, values: tag});
    }

    if (selectedPropertySize == '1') {
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
    if (selectedPropertySize == '2') {
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
    if (selectedPropertySize == '3') {
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

    let localitie = route.params?.localities;

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
      cityName: localitie.city,

      placeID: localitie.placeId,
      placeName: localitie.name,
      geoLocationLatitude: localitie.geoLocationLatitude,
      geoLocationLongitude: localitie.geoLocationLongitude,
      viewportNorthEastLat: localitie.viewportNorthEastLat,
      viewportNorthEastLng: localitie.viewportNorthEastLng,
      viewportSouthWestLat: localitie.viewportSouthWestLat,
      viewportSouthWestLng: localitie.viewportSouthWestLng,
      postMedia: mediaData,
      filters: {tags: tags},
    };

    //setLoading(false);
    console.log(requestOption);
    const data = await sendPostData(requestOption);
    setLoading(false);
    toast.show({
      title: 'Post created successfully',
    });
    console.log("'Post created successfully'");
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'HomeTab',
          state: {
            routes: [
              {
                name: 'Home',
                params: {tabIndex: 0},
              },
            ],
          },
        },
      ],
    });
    // navigation.reset({
    //   index: 0,
    //   routes: [{name: 'HomeTab', params: {tabIndex: 0}}],
    // });
    // navigation.reset('HomeTab');
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
          <View>
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
            <View style={localStyles.bodyContainer}>
              <Box
                display="flex"
                mt="15px"
                paddingLeft="15px"
                paddingRight="15px">
                <View style={localStyles.ROW}>
                  <View style={localStyles.COL}>
                    <ZText type={'b18'}>{formValue.title}</ZText>
                  </View>
                </View>
                <View style={localStyles.ROW1}>
                  <View style={localStyles.COL_LEFT}>
                    <ZText type={'s16'}>Price</ZText>
                  </View>
                  <View style={localStyles.COL_RIGHT}>
                    <ZText type={'b18'}>
                      {formatNumberToIndianSystem(formValue.price)}
                    </ZText>
                  </View>
                </View>
                <View
                  style={[
                    localStyles.ROW2,
                    {borderBottomWidth: 1, borderColor: Color.gray1},
                  ]}>
                  <View style={localStyles.COL_LEFT}>
                    <ZText type={'s16'}>Property Size</ZText>
                  </View>
                  <View style={localStyles.COL_RIGHT}>
                    <ZText type={'b18'}>{formValue.propertySize}</ZText>
                  </View>
                </View>
                <ItemROW ITEM={filter} NAME={'Project'}></ItemROW>
                <ItemROW ITEM={filter} NAME={'Developer'}></ItemROW>
                <ItemROW ITEM={filter} NAME={'Bedroom'}></ItemROW>
                <ItemROW ITEM={filter} NAME={'Balcony'}></ItemROW>
                <ItemROW ITEM={filter} NAME={'Bathroom'}></ItemROW>
                <ItemROW ITEM={filter} NAME={'ConstructionStatus'}></ItemROW>
                <ItemROW ITEM={filter} NAME={'PropertyAge'}></ItemROW>

                <ItemROW ITEM={filter} NAME={'PropertyStatus'}></ItemROW>
                <ItemROW ITEM={filter} NAME={'PropertyType'}></ItemROW>
                <ItemROW
                  ITEM={filter}
                  NAME={'TransactionType'}
                  isLast={true}></ItemROW>
              </Box>
              <Box>
                <MultiItemROW ITEM={filter} NAME={'Amenities'}></MultiItemROW>
                <MultiItemROW
                  ITEM={filter}
                  NAME={'NearbyFacilities'}></MultiItemROW>
              </Box>

              <Box
                display="flex"
                mt="15px"
                paddingLeft="15px"
                paddingRight="15px">
                <View style={localStyles.borderContainer}>
                  <View style={[localStyles.cardfullIcon, {marginLeft: 20}]}>
                    <ZText type={'s16'} style={{marginBottom: 10}}>
                      Description
                    </ZText>
                    <ZText style={{width: '100%'}} type={'r16'}>
                      {formValue.propDescription}
                    </ZText>
                  </View>
                </View>
              </Box>
              <Box
                display="flex"
                mt="15px"
                paddingLeft="15px"
                paddingRight="15px">
                <View style={localStyles.borderContainer}>
                  <View style={[localStyles.cardfullIcon, {marginLeft: 20}]}>
                    <ZText type={'s16'} style={{marginBottom: 10}}>
                      Location
                    </ZText>
                    <ZText style={{width: '100%'}} type={'r16'}>
                      {localities.name}
                    </ZText>
                  </View>
                </View>
              </Box>
            </View>
          </View>
        </ScrollView>
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
    width: devicewidth, // Card takes up full width of the screen
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
});
export default PropertyPostPreview;
