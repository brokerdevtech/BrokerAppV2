import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import {Back} from '../../assets/svg';
import RNFS from 'react-native-fs';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import PhotoEditor from '@baronha/react-native-photo-editor';

import ZHeader from '../../sharedComponents/ZHeader';
import ZText from '../../sharedComponents/ZText';
import {Button} from '../../../components/ui/button';

import AppBaseContainer from '../../hoc/AppBaseContainer_old';
import {Color} from '../../styles/GlobalStyles';

const {width, height} = Dimensions.get('window');

const EditImagesScreen = ({route, navigation}) => {
  const [selectedThumbnails, setSelectedThumbnails] = useState(
    route.params.selectedThumbnails,
  );
  const [destinationThumbnails, setDestinationThumbnails] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchPhotos = async () => {
      const processedPhotos = await Promise.all(
        selectedThumbnails.map(async item => {
          let fetchPhoto = await EditfetchPhotos(item);
          return fetchPhoto;
        }),
      );

      setDestinationThumbnails(processedPhotos);
    };

    fetchPhotos();
  }, [selectedThumbnails]);

  const openImageEditor = async index => {
    const image = destinationThumbnails[index];

    if (Platform.OS === 'ios') {
      const fileData = await CameraRoll.iosGetImageDataById(
        image.destinationPath,
      );
      _onEditStory(fileData.node.image.filepath, index);
    } else {
      _onEditStory(image.destinationPath, index);
    }
  };

  const handleNextStepClick = () => {
    navigation.navigate('PostWizard', {imageData: destinationThumbnails});
  };

  const EditfetchPhotos = async thumbnail => {
    const destinationPath = thumbnail.uri.replace('file://', '');

    return {
      ...thumbnail,
      destinationPath: destinationPath,
      Edit: false,
      destinationPathuri: `file://${destinationPath}`,
    };
  };

  const _onEditStory = async (destinationPath, index) => {
    try {
      let path = await PhotoEditor.open({
        path: destinationPath,
      });

      const updatedThumbnails = [...destinationThumbnails];
      updatedThumbnails[index] = {
        ...updatedThumbnails[index],
        destinationPath: path.replace('file://', ''),
        destinationPathuri: path,
        Edit: true,
      };

      setDestinationThumbnails(updatedThumbnails);
      setRefresh(!refresh);
    } catch (error) {
      console.error('Error editing photo:', error);
    }
  };

  const handleThumbnailPress = index => {
    setActiveImageIndex(index);
  };

  const renderMainImage = () => {
    if (
      !destinationThumbnails.length ||
      activeImageIndex >= destinationThumbnails.length
    ) {
      return (
        <View style={styles.imageContentContainer}>
          <View style={styles.mainImagePlaceholder} />
          <TouchableOpacity
            style={styles.externalEditButton}
            onPress={() => {}}
            disabled={true}>
            <ZText numberOfLines={1} color={'#999'} type={'R16'}>
              Edit
            </ZText>
          </TouchableOpacity>
        </View>
      );
    }

    const item = destinationThumbnails[activeImageIndex];
    const imageSource =
      Platform.OS === 'ios'
        ? {uri: item.destinationPath}
        : {uri: item.Edit ? item.destinationPathuri : item.destinationPath};

    return (
      <View style={styles.imageContentContainer}>
        <TouchableOpacity
          style={styles.externalEditButton}
          onPress={() => openImageEditor(activeImageIndex)}>
          <ZText numberOfLines={1} color={Color.primary} type={'R16'}>
            Edit
          </ZText>
        </TouchableOpacity>
        <View style={styles.mainImageContainer}>
          <Image source={imageSource} style={styles.mainImage} />
        </View>
      </View>
    );
  };

  const renderThumbnail = ({item, index}) => {
    const imageSource =
      Platform.OS === 'ios'
        ? {uri: item.destinationPath}
        : {uri: item.Edit ? item.destinationPathuri : item.destinationPath};

    const isActive = index === activeImageIndex;

    return (
      <TouchableOpacity
        onPress={() => handleThumbnailPress(index)}
        activeOpacity={0.8}
        style={styles.thumbnailOuterContainer}>
        <View style={styles.thumbnailContainer}>
          {isActive && (
            <View style={styles.selectedIndicator}>
              <View style={styles.triangleUp} />
            </View>
          )}
          <View
            style={[
              styles.thumbnailFrame,
              isActive ? styles.activeThumbnailFrame : null,
            ]}>
            <Image source={imageSource} style={styles.thumbnail} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const LeftIcon = () => (
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <View style={styles.backButton}>
        <Back accessible={true} accessibilityLabel="Back" />
      </View>
    </TouchableOpacity>
  );

  const RightIcon = () => (
    <TouchableOpacity style={{marginRight: 15}} onPress={handleNextStepClick}>
      <ZText numberOfLines={1} color={Color.primary} type={'R16'}>
        {'Next'}
      </ZText>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ZHeader
        title={'Edit Images'}
        rightIcon={<RightIcon />}
        isHideBack={true}
        isLeftIcon={<LeftIcon />}
      />

      {renderMainImage()}

      <View style={styles.thumbnailsWrapper}>
        <FlatList
          data={destinationThumbnails}
          horizontal={true}
          renderItem={renderThumbnail}
          keyExtractor={(item, index) => `thumbnail-${index}`}
          contentContainerStyle={[
            styles.thumbnailList,
            destinationThumbnails.length === 1 && styles.singleThumbnailList,
          ]}
          showsHorizontalScrollIndicator={false}
          extraData={refresh || activeImageIndex}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContentContainer: {
    width: width * 0.9,
    alignSelf: 'center',
    marginVertical: 10,
    padding: 10,
    // backgroundColor: '#000',
    // shadowColor: '#000',
    // elevation: 2,
    // shadowOffset: {width: 0, height: 0},
    // shadowOpacity: 0.1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  mainImageContainer: {
    width: '100%',
    height: height * 0.65, // Slightly reduced to make room for edit button
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  mainImagePlaceholder: {
    width: '100%',
    height: height * 0.65,
    backgroundColor: '#f0f0f0',
    borderRadius: 30,
  },
  mainImage: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  // External edit button
  externalEditButton: {
    // alignSelf: 'flex-end',
    // marginTop: 12,
    // marginRight: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    // backgroundColor: '#fff',
    borderRadius: 20,
    // borderWidth: 1,
    // borderColor: Color.primary,
    // elevation: 3,
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 2},
    // shadowOpacity: 0.2,
    // shadowRadius: 2,
  },
  thumbnailsWrapper: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    height: height * 0.15,
  },
  thumbnailList: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  singleThumbnailList: {
    justifyContent: 'center',
    flex: 1,
  },
  thumbnailOuterContainer: {
    marginHorizontal: 8,
    position: 'relative',
  },
  thumbnailContainer: {
    position: 'relative',
    width: width * 0.22,
    height: width * 0.22,
  },
  selectedIndicator: {
    position: 'absolute',
    top: -16,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 5,
  },
  triangleUp: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 14,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: Color.primary,
  },
  thumbnailFrame: {
    width: '100%',
    height: '100%',
    padding: 8,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  activeThumbnailFrame: {
    borderWidth: 3,
    borderColor: Color.primary,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  backButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 40,
  },
});

export default AppBaseContainer(EditImagesScreen, '', false);
