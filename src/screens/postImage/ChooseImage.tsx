import React, {useState, useEffect, useRef} from 'react';
import {
  Image,
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  PermissionsAndroid,
  ScrollView,
  Dimensions,
  FlatList,
  ImageBackground,
  ActivityIndicator,
  Linking,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';

import {launchCamera} from 'react-native-image-picker';

import ImagePicker from 'react-native-image-crop-picker';

import {CameraRoll} from '@react-native-camera-roll/camera-roll';

import {Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {getFileExtensionFromMimeType, uriToBlob} from '../../utils/helpers';

import RNFS from 'react-native-fs';
//import PhotoEditor from 'react-native-photo-editor';
import PhotoEditor from '@baronha/react-native-photo-editor';
import uuid from 'react-native-uuid';

// import {lte} from 'lodash';

import {useSelector} from 'react-redux';
import {showEditor} from 'react-native-video-trim';

import LoadingOverlay from './LoadingOverlay';

import {useSharedValue} from 'react-native-reanimated';
import {CardView} from './Cardview';
import {useToast} from '@/components/ui/toast';
import ZText from '../../sharedComponents/ZText';
import {useS3} from '../../Context/S3Context';
import {
  storiesImagesBucketPath,
  storiesVideosBucketPath,
} from '../../constants/constants';
import {AddStory} from '../../../BrokerAppcore/services/Story';
import ZHeader from '../../sharedComponents/ZHeader';
import {Back, Multiple, Multiple_Fill} from '../../assets/svg';
import {useApiRequest} from '../../hooks/useApiRequest';
import AppBaseContainer from '../../hoc/AppBaseContainer_old';
import {Toast, ToastDescription} from '../../../components/ui/toast';
const windowWidth = Dimensions.get('window').width;
const windowheight = Dimensions.get('window').height;
const Bucket = 'broker2023';

const ChooseImage = ({user, s3, toast, navigation}: any) => {
  // console.log(user, 'from hoc');
  const userPermissions = useSelector(
    (state: RootState) => state.user.user.userPermissions,
  );
  const [isLoadingOverlay, setLoadingOverlay] = useState(false);
  const [thumbnail, setThumbnail] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [endCursor, setEndCursor] = useState('');
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const contentOffset = useSharedValue(0);
  const [toastId, setToastId] = React.useState(0);
  const [page, setPage] = useState('Post');
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const flatListRef = useRef<FlatList<any>>(null);
  const handleEmptyImage = () => {
    Alert.alert('Please select atleast one image');
  };

  const {
    status: Storystatus,
    error: Storyerror,
    execute: Storyexecute,
  } = useApiRequest(AddStory);

  //   const handlePermissionDeniedAlert = () => {
  //     Alert.alert(
  //       'Permission Denied',
  //       'Please grant permission to access your photos in order to display them in the gallery.',
  //       [
  //         {
  //           text: 'OK',
  //           onPress: () => {
  //             navigation.goBack();
  //             setLoading(false);
  //           },
  //         },
  //       ],
  //     );
  //   };
  const requestReadMediaImagesPermission = async () => {
    try {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ];

      const granted = await PermissionsAndroid.requestMultiple(permissions, {
        title: 'Permission to access images',
        message:
          'Your app needs permission to access your images in order to display them in the gallery.',
      });

      if (
        granted[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
          PermissionsAndroid.RESULTS.GRANTED
      ) {
        fetchPhotos();
      } else {
        // handlePermissionDeniedAlert();
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };
  const promptForManualPermissionSetting = () => {
    Alert.alert(
      'Permission Required',
      'This app requires storage permission to function properly. Please enable it in the app settings.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Open Settings',
          onPress: () => Linking.openSettings(),
        },
      ],
    );
  };
  const requestWRITE_EXTERNAL_STORAGE = async () => {
    try {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        // Add more permissions as needed
      ];

      const granted = await PermissionsAndroid.requestMultiple(permissions, {
        title: 'Permission to access images',
        message:
          'Your app needs permission to access your images in order to display them in the gallery.',
      });

      if (
        granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] ===
        PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
      ) {
        promptForManualPermissionSetting();
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const requestReadMediaImagesPermissionVersion = async () => {
    try {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        // Add more permissions as needed
      ];

      const granted = await PermissionsAndroid.requestMultiple(permissions, {
        title: 'Permission to access images',
        message:
          'Your app needs permission to access your images in order to display them in the gallery.',
      });
      //
      if (
        granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] ===
        PermissionsAndroid.RESULTS.GRANTED
      ) {
        fetchPhotos();

        // Permission granted
      } else {
        // handlePermissionDeniedAlert();
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 33) {
        requestReadMediaImagesPermission();
      } else {
        requestReadMediaImagesPermissionVersion();
      }
    } else {
      fetchPhotos();
    }
  }, [page]);
  const fetchPhotos = async () => {
    // Define query options for CameraRoll.getPhotos()
    const fetchParams = {
      first: 20, // Number of photos to fetch
      assetType: 'Photos',
      include: ['filename', 'fileExtension'],
    };

    const data = await CameraRoll.getPhotos(fetchParams);
    if (data.page_info.has_next_page) {
      setEndCursor(data?.page_info?.end_cursor?.toString());
      setHasNextPage(true);
    } else {
      setEndCursor(null);
      setHasNextPage(false);
    }
    // console.log(JSON.stringify(data), 'photos');
    setPhotos(data.edges);

    const assets = data.edges.map(item => item.node.image);

    const photoData1 = {
      uri: assets[0].uri,
      type: assets[0].extension,
      name: assets[0].filename,
      count: 1,
    };
    let photobj = [];
    photobj = [...thumbnail];
    //
    photobj.push({...photoData1});

    setThumbnail(photobj);
    setLoading(false);
    toast.closeAll();
  };

  const fetchPhotosnext = async (after: any) => {
    //
    // Define query options for CameraRoll.getPhotos()
    const fetchParams = {
      first: 20, // Number of photos to fetch
      assetType: 'Photos',
      include: ['filename', 'fileExtension'],
      after: after, // Type of assets (Photos or Videos)
    };

    const data = await CameraRoll.getPhotos(fetchParams);
    if (data.page_info.has_next_page) {
      setEndCursor(data?.page_info?.end_cursor?.toString());
      setHasNextPage(true);
    } else {
      setEndCursor(null);
      setHasNextPage(false);
    }
    if (after) {
      setPhotos([...photos, ...data.edges]);
    } else {
      setPhotos(data.edges);
    }
  };
  const loadMore = () => {
    //
    if (hasNextPage) {
      fetchPhotosnext(endCursor);
    }
  };

  const onChooseImage = photo => {
    console.log(thumbnail, 'initial');
    if (isMultiSelect) {
      const isAlreadySelected = thumbnail.some(
        item => item.uri === photo.node.image.uri,
      );

      if (isAlreadySelected) {
        // Prevent unselecting the last remaining image
        if (thumbnail.length > 1) {
          // Unselect the image by removing it from the list
          const updatedThumbnail = thumbnail.filter(
            item => item.uri !== photo.node.image.uri,
          );

          // Update the count for the remaining selected images
          updatedThumbnail.forEach((image, index) => {
            image.count = index + 1;
          });

          setThumbnail(updatedThumbnail);
        }
      } else {
        // Select the image
        const photoData = {
          uri: photo.node.image.uri,
          name: photo.node.image.fileName,
          type: photo.node.image.extension,
        };

        const updatedThumbnail = [...thumbnail, {...photoData}];

        // Update the count for all selected images
        updatedThumbnail.forEach((image, index) => {
          image.count = index + 1;
        });

        setThumbnail(updatedThumbnail);
      }
    } else {
      // In single-select mode, clear the previous selections and select the current image
      setThumbnail([
        {
          uri: photo.node.image.uri,
          name: photo.node.image.fileName,
          type: photo.node.image.extension,
          count: 1,
        },
      ]);
    }
  };

  const handleNextStepClick = async () => {
    try {
      if (thumbnail.length > 0) {
        if (page !== 'Story') {
          navigation.navigate('EditImagesScreen', {
            selectedThumbnails: thumbnail,
          });
        } else {
          let stickers = ['sticker0.png'];
        }
      } else {
        handleEmptyImage();
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };
  const saveStoryPostsPhoto = async (images, mediaType) => {
    try {
      const uploadPromises = [];
      let uploadedImageUrls: any[] = [];

      const responseBlob = await uriToBlob(images);
      const fileExtension = getFileExtensionFromMimeType(
        responseBlob?._data.type,
      );
      const docId = uuid.v4();
      const imageName = docId + '.' + fileExtension;
      const params = {
        Bucket: Bucket,
        Key: storiesImagesBucketPath + imageName,
        Body: responseBlob,
      };

      const uploadPromise = s3.upload(params).promise();
      uploadPromises.push(uploadPromise);
      const results = await Promise.all(uploadPromises);

      await deleteFile(images);
      uploadedImageUrls = results.map((result, index) => {
        if (result) {
          return {mediaBlob: result.Key, caption: '', mediaType: mediaType};
        } else {
          console.error('Error uploading image to S3:', imagesArray[index]);
          return null;
        }
      });

      let AddStoryobj = {
        userId: user.userId,
        storyMedia: uploadedImageUrls,
      };

      let storyResult = await Storyexecute(AddStoryobj);
      setLoadingOverlay(false);

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
                <ToastDescription>Story created successfully</ToastDescription>
              </Toast>
            );
          },
        });
      }

      // navigation.replace('Home');
    } catch (error) {}
  };
  const deleteFile = filePath => {
    RNFS.unlink(filePath)
      .then(() => {})
      .catch(error => {
        console.error('Error deleting file:', error.message);
      });
  };
  const saveStoryPostsvideo = async (images, mediaType, filePath) => {
    const uploadPromises = [];
    let uploadedImageUrls: any[] = [];

    const responseBlob = await uriToBlob(images);
    const fileExtension = getFileExtensionFromMimeType(
      responseBlob?._data.type,
    );
    const docId = uuid.v4();
    const imageName = docId + '.' + fileExtension;
    const params = {
      Bucket: Bucket,
      Key: storiesVideosBucketPath + imageName,
      Body: responseBlob,
    };

    const uploadPromise = s3.upload(params).promise();
    uploadPromises.push(uploadPromise);
    const results = await Promise.all(uploadPromises);

    deleteFile(filePath);

    uploadedImageUrls = results.map((result, index) => {
      if (result) {
        return {mediaBlob: result.Key, caption: '', mediaType: mediaType};
      } else {
        console.error('Error uploading image to S3:', imagesArray[index]);
        return null;
      }
    });

    let AddStoryobj = {
      userId: user.userId,
      storyMedia: uploadedImageUrls,
    };

    // toast("'Post created successfully'")   ;
    let storyResult = await Storyexecute(AddStoryobj);
    setLoadingOverlay(false);
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
              <ToastDescription>Story created successfully</ToastDescription>
            </Toast>
          );
        },
      });
    }

    navigation.reset({
      index: 0,
      routes: [{name: 'Home'}],
    });
  };
  const EditStoryfetchPhotos = async thumbnail => {
    const fileName = thumbnail[0].uri.split('/').pop();
    const destinationPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
    await RNFS.copyFile(thumbnail[0].uri, destinationPath);

    _onEditStory(destinationPath);
  };

  const _onEditStory = (destinationPath: any) => {
    PhotoEditor.Edit({
      path: destinationPath,
      stickers: [
        'sticker0',
        'sticker1',
        'sticker2',
        'sticker3',
        'sticker4',
        'sticker5',
        'sticker6',
        'sticker7',
        'sticker8',
        'sticker9',
        'sticker10',
        'sticker11',
        'sticker12',
        'sticker13',
        'sticker14',
        'sticker15',
        'sticker16',
      ],
      // hiddenControls: ['save', 'clear'],
      colors: undefined,
      onDone: data => {
        savePost(data);
      },
      onCancel: () => {
        navigation.goBack();
      },
    });
  };
  const readFile = async filePath => {
    try {
      const fileContent = await RNFS.readFile(filePath, 'base64');
      return fileContent;
    } catch (error) {
      console.error('Error reading file:', error);
    }
  };
  const base64ToBlob = async base64 => {
    const response = await fetch(
      `data:application/octet-stream;base64,${base64}`,
    );
    const blob = await response.blob();
    return blob;
  };
  const savePost = async images => {
    const uploadPromises = [];

    const base64Content = await readFile(images);
    const responseBlob = await base64ToBlob(base64Content);

    //const responseBlob = await uriToBlob(images);
    const fileExtension = getFileExtensionFromMimeType(
      responseBlob?._data.type,
    );
    const docId = uuid.v4();
    const imageName = docId + '.' + fileExtension;
    const params = {
      Bucket: Bucket,
      Key: imageName,
      Body: responseBlob,
    };

    const uploadPromise = s3.upload(params).promise();
    uploadPromises.push(uploadPromise);
    const results = await Promise.all(uploadPromises);
  };

  const chunkArray = (array, chunkSize) => {
    const chunkedArray = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunkedArray.push(array.slice(i, i + chunkSize));
    }
    return chunkedArray;
  };
  const handleSelectImage = selectedImage => {
    // Implement the logic to handle the selected image here
    //
  };
  const handleRemoveImage = index => {
    // Implement the logic to remove an image by index
    setThumbnail(prevImageList => {
      const updatedImageList = [...prevImageList];
      updatedImageList.splice(index, 1);
      return updatedImageList;
    });
  };
  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(NativeModules.VideoTrim);
    const subscription = eventEmitter.addListener('VideoTrim', async event => {
      switch (event.name) {
        case 'onShow': {
          break;
        }
        case 'onHide': {
          break;
        }
        case 'onStartTrimming': {
          setLoadingOverlay(true);
          break;
        }
        case 'onFinishTrimming': {
          const fileUri = `file://${event.outputPath}`;
          await saveStoryPostsvideo(fileUri, 'video', event.outputPath);
          break;
        }
        case 'onCancelTrimming': {
          break;
        }
        case 'onError': {
          break;
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);
  const getFileNameFromPath = path => {
    const fragments = path.split('/');
    let fileName = fragments[fragments.length - 1];
    fileName = fileName.split('.')[0];
    return fileName;
  };
  const [selectedVideo, setSelectedVideo] = useState();
  const handlePressSelectStoryButton = async () => {
    let Asset = await ImagePicker.openPicker({
      mediaType: 'video,photo',
      // maxFileSize: 30 * 1024 * 1024,
    });

    //
    if (Asset.mime === 'video/mp4') {
      showEditor(Asset.path, {
        saveToPhoto: false,
        maxDuration: 120,
        cancelDialogTitle: 'Alert',
        cancelDialogMessage: 'Data will be lost',
        cancelDialogConfirmText: 'Ok',
        cancelDialogCancelText: 'Cancel',
      })
        .then(async res => {})
        .catch(e => console.log(e, 1111));
    } else {
      const isGif = path => path && path.toLowerCase().includes('.gif');
      if (isGif(Asset.path) || isGif(Asset.sourceURL)) {
        toast.show({
          description: 'Gif format not supported',
        });
        // navigation.goBack(); // Navigate back to the previous screen
        return;
      } else {
        try {
          let path;

          if (Platform.OS === 'ios') {
            path = await PhotoEditor.open({
              path: Asset.sourceURL,
              stickers: [],
            });
          } else {
            path = await PhotoEditor.open({
              path: Asset.path,
              stickers: [],
            });
          }
          if (path) {
            setLoadingOverlay(true);
            await saveStoryPostsPhoto(path, 'image');
          }
        } catch (e) {
          console.error('Error opening photo editor:', e);
        }
      }
    }
  };
  const handlePressSelectVideoButton = async () => {
    let videoAsset = await ImagePicker.openPicker({
      mediaType: 'video',
      maxFileSize: 30 * 1024 * 1024,
    });
    //
    let obj = {
      uri: videoAsset.sourceURL || videoAsset.path,
      localFileName: getFileNameFromPath(videoAsset.path),
      mime: videoAsset.mime,
      creationDate: videoAsset.creationDate,
    };

    navigation.navigate('PostWizard', {imageData: obj, Isvideo: true});
  };

  const renderItem = ({item, index}: any) => {
    return <CardView item={item} index={index} contentOffset={contentOffset} />;
  };

  const renderImageItem = ({item, photoIndex}) => (
    <TouchableOpacity onPress={() => onChooseImage(item)}>
      <ImageBackground
        key={photoIndex}
        source={{uri: item.node.image.uri}}
        style={styles.image}>
        {thumbnail.some(
          selectedItem => selectedItem.uri === item.node.image.uri,
        ) && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>
              {
                thumbnail.find(
                  selectedItem => selectedItem.uri === item.node.image.uri,
                ).count
              }
            </Text>
          </View>
        )}
      </ImageBackground>
    </TouchableOpacity>
  );
  const handleCameraIconPress = () => {
    launchCamera({mediaType: 'photo'}, response => {
      if (response.didCancel) {
        //
      } else if (response.error) {
        console.error('Camera error:', response.error);
      } else if (response.uri) {
        // Check if the URI is not null
        const photoData = {
          uri: response.uri,
          name: response.fileName || 'photo.jpg',
          type: response.type || 'image/jpeg',
        };
        setThumbnail(prevThumbnail => [...prevThumbnail, {...photoData}]);
      }
    });
  };
  const LeftIcon = () => {
    return (
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Back accessible={true} accessibilityLabel="Back" />
      </TouchableOpacity>
    );
  };
  const RightIcon = () => {
    return (
      <TouchableOpacity
        style={{marginRight: 15}}
        onPress={handleNextStepClick}
        testID={`next${thumbnail.id}`}>
        <ZText numberOfLines={1} color={'#BC4A4F'} type={'b16'}>
          {'Next'}
        </ZText>
      </TouchableOpacity>
    );
  };

  return (
    <>
      {thumbnail.length > 0 && (
        <>
          <View>
            <ZHeader
              title={`New Post`}
              rightIcon={<RightIcon />}
              isHideBack={true}
              isLeftIcon={<LeftIcon />}
            />

            <View>
              <FlatList
                ref={flatListRef}
                data={thumbnail}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                snapToInterval={windowWidth}
                decelerationRate={0}
                bounces={false}
                horizontal
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={event => {
                  contentOffset.value = event.nativeEvent.contentOffset.x;
                }}
              />
            </View>
            <View style={styles.container}>
              <View style={styles.GalleryHeaderContainer}>
                <Text style={styles.GalleryHeader}>Gallery Images</Text>

                <TouchableOpacity
                  onPress={() => setIsMultiSelect(!isMultiSelect)}
                  style={styles.multiSelectButton}>
                  {isMultiSelect ? (
                    <Multiple_Fill
                      accessible={true}
                      accessibilityLabel="MultipleSelected"
                    />
                  ) : (
                    <Multiple accessible={true} accessibilityLabel="Multiple" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <FlatList
              data={photos}
              renderItem={renderImageItem}
              keyExtractor={(item, index) => index.toString()}
              horizontal={false}
              numColumns={4}
              onEndReached={loadMore}
              onEndReachedThreshold={0.2}
            />
          </View>
          {/* <Box> */}
          <View style={styles.footer}>
            <TouchableOpacity
              onPress={() => setPage('Post')}
              style={styles.footerSection}>
              <ZText
                numberOfLines={1}
                style={[
                  page === 'Post'
                    ? styles.pickedFooterTitle
                    : styles.footerTitle,
                ]}
                type={'b20'}>
                {`Post`}
              </ZText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handlePressSelectVideoButton()}
              style={styles.footerSection}>
              <ZText
                numberOfLines={1}
                style={[
                  page === 'Reel'
                    ? styles.pickedFooterTitle
                    : styles.footerTitle,
                ]}
                type={'b20'}>
                {`Reel`}
              </ZText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handlePressSelectStoryButton()}>
              <Text>{`Story`}</Text>
            </TouchableOpacity>
          </View>
          {/* </Box> */}
          <LoadingOverlay isVisible={isLoadingOverlay} />
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  countBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#BC4A4F',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: {
    color: 'white',
    fontWeight: 'bold',
  },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  listContainer: {
    alignItems: 'center',
    width: '100%',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#fff',
  },
  card: {
    // width: '100%',
    height: 400,
    // margin: 10,
    // backgroundColor: 'white',
    // alignItems: 'center',
    // justifyContent: 'center',
    // left: '5%',
    // right: '5%',
  },
  imagecard: {
    width: 500,
    height: 400,
    // left: '5%',
    // right: '5%',
    // borderRadius:10
  },

  safeView: {
    // flex: 1,
    height: '100%',
    backgroundColor: 'transparent',
  },
  storysafeView: {
    height: '100%',
    width: '100%',
    // backgroundColor: '#000000',
  },
  GalleryHeader: {
    color: '#000',
    fontSize: 19,
    fontWeight: '600',
    marginLeft: 10,
    paddingVertical: 10,
    elevation: 0.5,
  },

  image: {
    width: windowWidth / 4,
    height: windowheight / 8,
    padding: 1,
    borderRadius: 15,
    marginRight: 2,
    marginBottom: 2,
  },
  galleryImagesWrapper: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  footer: {
    display: 'flex',
    position: 'absolute',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: 'rgba(0, 0, 0, 0.5)',

    padding: 2,
    borderRadius: 50,
    bottom: 50,
    left: '25%',
    right: '25%',
  },
  footerSection: {
    // width: '50%',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'center',
    alignContent: 'center',
    //display: 'flex',
  },

  pickedFooterTitle: {
    fontSize: 18,
    color: '#BC4A4F',
  },
  footerTitle: {
    fontSize: 16,
    color: 'black',
  },
  multiSelectButton: {
    // flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'center',
    // backgroundColor: '#007dc5',
    // padding: 10,
    borderRadius: 8,
    marginTop: 5,
    marginRight: 10,
  },
  multiSelectButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  GalleryHeaderContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  cameraIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
});

export default AppBaseContainer(ChooseImage, '', false);