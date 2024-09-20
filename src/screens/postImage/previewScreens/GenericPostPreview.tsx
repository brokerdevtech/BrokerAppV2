/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/no-unstable-nested-components */
// src/screens/HomeScreen.tsx

import {Back} from '../../../assets/svg';
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
import {styles} from '../../../themes';
import {Color} from '../../../styles/GlobalStyles';
import RNFS from 'react-native-fs';
const {width} = Dimensions.get('window');
const devicewidth = Dimensions.get('window').width;
import uuid from 'react-native-uuid';
import {useSelector} from 'react-redux';
import {getFileExtensionFromMimeType, uriToBlob} from '../../../utils/helpers';
import {
  postsImagesBucketPath,
  postsVideosBucketPath,
} from '../../../config/constants';
import {sendGenericPostData} from '../../../../BrokerAppcore/services/postService';
import FastImage from '@d11/react-native-fast-image';
import ZText from '../../../sharedComponents/ZText';
import {Box} from '../../../../components/ui/box';
import ZSafeAreaView from '../../../sharedComponents/ZSafeAreaView';
import ZHeader from '../../../sharedComponents/ZHeader';
import Video from 'react-native-video';

const GenericPostPreview: React.FC = ({
  toast,

  navigation,
  user,

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
  const [loading, setLoading] = useState(false);
  const [selectedPropertySize, setselectedPropertySize] = useState('1');

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

          const responseBlob = await uriToBlob(uri);

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
      console.log(successfulUploads);
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
      let tags = [];
      let localitie = route.params?.localities;

      const requestOption = {
        userId: user.userId,
        title: FormValue.title,
        description: FormValue.Description,
        placeID: localitie.placeId,
        placeName: localitie.name,
        geoLocationLatitude: localitie.geoLocationLatitude,
        geoLocationLongitude: localitie.geoLocationLongitude,
        viewportNorthEastLat: localitie.viewportNorthEastLat,
        viewportNorthEastLng: localitie.viewportNorthEastLng,
        viewportSouthWestLat: localitie.viewportSouthWestLat,
        viewportSouthWestLng: localitie.viewportSouthWestLng,
        postMedia: mediaData,
      };

      const data = await sendGenericPostData(requestOption);
      setLoading(false);
      // toast.show({
      //   title: 'Post created successfully',
      // });

      navigation.navigate('Home');
    } catch (error) {
      setLoading(false);
      toast.show({
        title: 'Failed to create post',
      });
      console.error('Error in requestAPI:', error);
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
              <Box style={{paddingHorizontal: 20, paddingVertical: 20}}>
                <View style={localStyles.ROW}>
                  <View style={localStyles.COL}>
                    <ZText type={'b18'}>{formValue.title}</ZText>
                  </View>
                </View>
              </Box>

              <Box style={localStyles.borderContainer}>
                <View style={localStyles.IconContainer}>
                  <View style={localStyles.cardfullIcon}>
                    <ZText type={'s16'} style={{marginBottom: 10}}>
                      Description
                    </ZText>
                    <ZText style={{width: '100%'}} type={'r16'}>
                      {formValue.Description}
                    </ZText>
                  </View>
                </View>
              </Box>
              <Box style={localStyles.borderContainer}>
                <View style={localStyles.IconContainer}>
                  <View style={localStyles.cardfullIcon}>
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
export default GenericPostPreview;
