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
} from 'react-native';
import {Back} from '../../assets/svg';

import {useSelector} from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
// import FilterScreen from './FilterImage';
import ZHeader from '../../sharedComponents/ZHeader';
import ZText from '../../sharedComponents/ZText';

import {useNavigation} from '@react-navigation/native';

import {SafeAreaView} from 'react-native-safe-area-context';

import RNFS from 'react-native-fs';
//import PhotoEditor from 'react-native-photo-editor';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import PhotoEditor from '@baronha/react-native-photo-editor';

import {Box} from '../../../components/ui/box';
import FastImage from '@d11/react-native-fast-image';
import images from '@/assets/images';
import {Button, ButtonText} from '../../../components/ui/button';
import ZSafeAreaView from '../../sharedComponents/ZSafeAreaView';
import {VStack} from '../../../components/ui/vstack';
const EditImagesScreen = ({route}) => {
  const colors = useSelector((state: RootState) => state.theme.theme);
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
    const fetchPhotos = async () => {
      let obj: any = [];
      selectedThumbnails.forEach(async (item, index) => {
        let fetchPhoto = await EditfetchPhotos(item);
        // console.log('fetchPhoto');
        // console.log(fetchPhoto);
        obj.push({...fetchPhoto});
      });
      setdestinationThumbnails(obj);
    };

    fetchPhotos();
  }, []);

  const openImageEditor = async (image, index) => {
    if (Platform.OS === 'ios') {
      const fileData = await CameraRoll.iosGetImageDataById(
        image.destinationPath,
      );

      _onEditStory(fileData.node.image.filepath, index);
    } else {
      _onEditStory(image.destinationPath, index);
      // setSelectedImage(image);
    }
  };
  getopenImagePicker = () => {
    ImagePicker.openCropper({
      path: selectedImage.uri,
    }).then(image => {
      let editimage: any = selectedImage;
      editimage.uri = image.path;
      setSelectedImage(editimage);
    });
  };
  Filterclose = () => {
    setModalVisible(false);
  };
  const navigation = useNavigation();
  const handleNextStepClick = async () => {
    navigation.navigate('PostWizard', {imageData: destinationThumbnails});
  };

  onsave = item => {
    let Thumbnails = selectedThumbnails;

    Thumbnails[selectedindex] = item;
    setselectedThumbnails(Thumbnails);
    setModalVisible(false);
  };
  const fetchPhotosbyuri = async uri => {
    //console.log(thumbnail);
    const fileName = uri.split('/').pop();
    const destinationPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
    await RNFS.copyFile(uri, destinationPath);

    return destinationPath;
    // _onEditStory(destinationPath);
  };
  const EditfetchPhotos = async thumbnail => {
    //console.log(thumbnail);
    // const fileName = thumbnail.uri.split('/').pop();
    const destinationPath = thumbnail.uri.replace('file://', '');
    //  await RNFS.copyFile(thumbnail.uri, destinationPath);
    //   console.log('destinationPath');
    let destinationPathobj = {
      ...thumbnail,
      destinationPath: destinationPath,
      Edit: false,
      destinationPathuri: `file://${destinationPath}`,
    };
    //   console.log(destinationPathobj);
    return destinationPathobj;
    // _onEditStory(destinationPath);
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
  const _onEditStory = async (destinationPath: any, index) => {
    let path = await PhotoEditor.open({
      path: destinationPath,
    });

    let newdestinationThumbnails: any = destinationThumbnails;
    newdestinationThumbnails[index].destinationPath = path.replace(
      'file://',
      '',
    );
    newdestinationThumbnails[index].destinationPathuri = path;
    newdestinationThumbnails[index].Edit = true;
    setdestinationThumbnails(newdestinationThumbnails);
    setrefresh(!refresh);
  };

  const renderItem = ({item, index}) => (
    <View style={locaStyles.card}>
      <Button
        variant="outline"
        style={locaStyles.editTextContainer}
        onPress={() => openImageEditor(item, index)}>
        <Text style={locaStyles.editText}>Edit</Text>
      </Button>

      {Platform.OS == 'ios' ? (
        <Image
          source={{uri: item.destinationPath}}
          style={locaStyles.imagecard}
        />
      ) : (
        <Image
          source={{
            uri: item.Edit ? item.destinationPathuri : item.destinationPath,
          }}
          style={locaStyles.imagecard}
        />
      )}
    </View>
  );

  const Alimagefliter = () => {};

  const goBack = () => {
    destinationThumbnails.forEach(async (item, index) => {
      if (item.Edit) {
        await deleteImage(item.destinationPath);
      }
    });

    navigation.goBack();
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
      <TouchableOpacity style={{marginRight: 15}} onPress={handleNextStepClick}>
        <ZText numberOfLines={1} color={'#BC4A4F'} type={'b16'}>
          {'Next'}
        </ZText>
      </TouchableOpacity>
    );
  };
  console.log(destinationThumbnails, 'selectedd');
  return (
    <SafeAreaView style={locaStyles.ssbg}>
      <ZHeader
        title={'Selected Image'}
        rightIcon={<RightIcon />}
        isHideBack={true}
        isLeftIcon={<LeftIcon />}
      />
      <FlatList
        data={destinationThumbnails}
        horizontal={true}
        contentContainerStyle={locaStyles.listContainer}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        extraData={refresh}
      />
    </SafeAreaView>
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
    color: '#000',
  },

  editText: {
    color: '#000',
  },

  listContainer: {
    alignItems: 'center',
    // flex: 1,
  },
  card: {
    width: Platform.OS == 'ios' ? 400 : 380,
    height: 650,
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

  ssbg: {
    backgroundColor: '#fff',
    height: '100%',
  },
});
export default EditImagesScreen;
