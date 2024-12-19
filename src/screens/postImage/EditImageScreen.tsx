/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Text,
  Dimensions,
} from 'react-native';
import {Back} from '../../assets/svg';

import ImagePicker from 'react-native-image-crop-picker';

import ZHeader from '../../sharedComponents/ZHeader';
import ZText from '../../sharedComponents/ZText';

import RNFS from 'react-native-fs';
import {
  PhotoEditorModal,
  Configuration,
  PESDK,
  ImageFormat,
} from 'react-native-photoeditorsdk';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import PhotoEditor from '@baronha/react-native-photo-editor';

import {Button} from '../../../components/ui/button';

import AppBaseContainer from '../../hoc/AppBaseContainer_old';
import {Color} from '../../styles/GlobalStyles';
const {width, height} = Dimensions.get('window');
const EditImagesScreen = ({route, navigation}: any) => {
  const [selectedThumbnails, setselectedThumbnails] = useState(
    route.params.selectedThumbnails,
  );
  const [destinationThumbnails, setdestinationThumbnails] = useState([]);
  const [refresh, setrefresh] = useState(false);

  // State to control the visibility of the image editing modal
  const [isModalVisible, setModalVisible] = useState(false);
  // State to store the currently selected image for editing
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedindex, setSelectedindex] = useState(0);
  // Function to open the image editing modal

  useEffect(() => {
    // const fetchPhotos = async () => {
    //   let obj: any = [];
    //   selectedThumbnails.forEach(async (item, index) => {
    //     let fetchPhoto = await EditfetchPhotos(item);

    //     obj.push({...fetchPhoto});
    //   });
    //   setdestinationThumbnails(obj);
    // };

    // fetchPhotos();
    openPhotoFromLocalPathExample(selectedThumbnails[0]);
  }, []);

  // const openImageEditor = async (image, index) => {
  //   if (Platform.OS === 'ios') {
  //     const fileData = await CameraRoll.iosGetImageDataById(
  //       image.destinationPath,
  //     );

  //     _onEditStory(fileData.node.image.filepath, index);
  //   } else {
  //     _onEditStory(image.destinationPath, index);
  //   }
  // };

  // const handleNextStepClick = async () => {
  //   navigation.navigate('PostWizard', {imageData: destinationThumbnails});
  // };

  // onsave = item => {
  //   let Thumbnails = selectedThumbnails;

  //   Thumbnails[selectedindex] = item;
  //   setselectedThumbnails(Thumbnails);
  //   setModalVisible(false);
  // };
  const configuration: Configuration = {
    theme: 'light',
    transform: {
      items: [
        {
          width: 9,
          height: 4,
        },
        {
          width: 16,
          height: 9,
        },
      ],
      allowFreeCrop: false,
      showResetButton: false,
    },
    forceCrop: true,
    // export: {
    //   filename:
    //     FileSystem.cacheDirectory +
    //     `export${Platform.OS == 'android' ? '.png' : ''}`,
    //   image: {
    //     format: ImageFormat.PNG,
    //   },
    // },
  };
  // const fetchPhotosbyuri = async uri => {
  //   //console.log(thumbnail);
  //   const fileName = uri.split('/').pop();
  //   const destinationPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
  //   await RNFS.copyFile(uri, destinationPath);

  //   return destinationPath;
  // };
  // const EditfetchPhotos = async thumbnail => {
  //   const destinationPath = thumbnail.uri.replace('file://', '');

  //   let destinationPathobj = {
  //     ...thumbnail,
  //     destinationPath: destinationPath,
  //     Edit: false,
  //     destinationPathuri: `file://${destinationPath}`,
  //   };

  //   return destinationPathobj;
  // };

  // const _onEditStory = async (destinationPath: any, index) => {
  //   let path = await PhotoEditor.open({
  //     path: destinationPath,
  //   });

  //   let newdestinationThumbnails: any = destinationThumbnails;
  //   newdestinationThumbnails[index].destinationPath = path.replace(
  //     'file://',
  //     '',
  //   );
  //   newdestinationThumbnails[index].destinationPathuri = path;
  //   newdestinationThumbnails[index].Edit = true;
  //   setdestinationThumbnails(newdestinationThumbnails);
  //   setrefresh(!refresh);
  // };

  // const renderItem = ({item, index}) => (
  //   <View style={locaStyles.card}>
  //     <Button
  //       variant="solid"
  //       style={locaStyles.editTextContainer}
  //       onPress={() => openImageEditor(item, index)}>
  //       <ZText numberOfLines={1} color={'#000'} type={'R16'}>
  //         Edit
  //       </ZText>
  //     </Button>

  //     {Platform.OS == 'ios' ? (
  //       <Image
  //         source={{uri: item.destinationPath}}
  //         style={locaStyles.imagecard}
  //       />
  //     ) : (
  //       <Image
  //         source={{
  //           uri: item.Edit ? item.destinationPathuri : item.destinationPath,
  //         }}
  //         style={locaStyles.imagecard}
  //       />
  //     )}
  //   </View>
  // );

  // const LeftIcon = () => {
  //   return (
  //     <TouchableOpacity onPress={() => navigation.goBack()}>
  //       <View
  //         style={{
  //           // ...styles.appTitleMain,
  //           // color: '#007acc',
  //           padding: 8,
  //           borderWidth: 1,
  //           borderColor: '#E5E5E5',
  //           borderRadius: 40,
  //         }}>
  //         <Back accessible={true} accessibilityLabel="Back" />
  //       </View>
  //     </TouchableOpacity>
  //   );
  // };
  // const RightIcon = () => {
  //   return (
  //     <TouchableOpacity style={{marginRight: 15}} onPress={handleNextStepClick}>
  //       <ZText numberOfLines={1} color={Color.primary} type={'R16'}>
  //         {'Next'}
  //       </ZText>
  //     </TouchableOpacity>
  //   );
  // };
  console.log(destinationThumbnails);
  const openPhotoFromLocalPathExample = async (photo): Promise<void> => {
    try {
      const result = await PESDK.openEditor(photo, configuration);

      if (result != null) {
        // The user exported a new photo successfully and the newly generated photo is located at `result.image`.
        const updatedThumbnails = [...destinationThumbnails];
        updatedThumbnails[selectedindex] = {
          ...selectedThumbnails[selectedindex],
          destinationPath: result.image,
        };

        setdestinationThumbnails(updatedThumbnails);

        // Navigate to the next screen with the updated array
        navigation.navigate('PostWizard', {imageData: updatedThumbnails});
      } else {
        // The user tapped on the cancel button within the editor.
        return;
      }
    } catch (error) {
      // There was an error generating the photo.
      console.log(error);
    }
  };
  return (
    <>
      {/* <ZHeader
        title={'Selected Image'}
        rightIcon={<RightIcon />}
        isHideBack={true}
        isLeftIcon={<LeftIcon />}
      /> */}
      {/* <FlatList
        data={destinationThumbnails}
        horizontal={true}
        contentContainerStyle={locaStyles.listContainer}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        extraData={refresh}
      /> */}
      {/* <PhotoEditorModal
        image={selectedThumbnails[0]}
        configuration={configuration}
        visible={true}
        onExport={result => {
          // The user exported a new photo successfully and the newly generated photo is located at `result.image`.
          console.log(result.image);
          // onFinish();
        }}
        onCancel={() => {
          // The user tapped on the cancel button within the editor.
          // onFinish();
        }}
        onError={error => {
          // There was an error generating the photo.
          console.log(error);
          // onFinish();
        }}
      /> */}
    </>
  );
};
const locaStyles = StyleSheet.create({
  editTextContainer: {
    position: 'absolute',
    top: 20,
    right: 25,
    zIndex: 10,
    backgroundColor: '#fff',
    // padding: 20,
    borderRadius: 20,
    // color: '#000',
  },

  editText: {
    color: '#000',
  },

  listContainer: {
    alignItems: 'center',
  },
  card: {
    width: width * 0.9, // 90% of screen width
    height: height * 0.8,
    margin: 15,

    borderRadius: 40,

    alignItems: 'center',
    justifyContent: 'center',
  },
  imagecard: {
    width: '100%',
    height: '100%',

    padding: 10,
    borderRadius: 30,

    zIndex: -1,
  },
});
export default AppBaseContainer(EditImagesScreen, '', false);
