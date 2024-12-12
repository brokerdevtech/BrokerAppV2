//import {Box, HStack, Skeleton, VStack} from 'native-base';
import React, {useEffect, useState} from 'react';
import {Dimensions, Platform} from 'react-native';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Text,
} from 'react-native';
import {VStack} from '../../components/ui/vstack';
import {Skeleton} from '../../components/ui/skeleton';
import FastImage from '@d11/react-native-fast-image';
import flex from '@/themes/flex';
//import FastImage from 'react-native-fast-image';
const screenWidth = Dimensions.get('window').width;
const AppFastImage = ({uri, height, width}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false); // New state to control modal visibility
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerheight, setContainerheight] = useState(0);
  const [containeraspectRatio, setcontaineraspectRatio] = useState(0);
  const [aspectRatio, setAspectRatio] = useState(1);
  const screenWidth = Dimensions.get('window').width - 20;
  const maxHeight = (screenWidth * 5) / 4; // 4:5 ratio
  const maxWidth = screenWidth * 1.91;

  // Fetch aspect ratio if height or width are not provided
  const fetchAspectRatio = async uri => {
    return new Promise(resolve => {
      Image.getSize(uri, (width, height) => {
        resolve(width / height);
      });
    });
  };

  useEffect(() => {
    const loadAspectRatio = async () => {
      if (!width || width === 0 || !height || height === 0) {
        const ratio = await fetchAspectRatio(uri);
        setAspectRatio(ratio);
      } else {
        setAspectRatio(width / height);
      }
    };
    loadAspectRatio();
  }, [uri, width, height]);
  // console.log(width);
  let finalWidth = width && width >= 0 ? width : screenWidth - 20;
  let finalHeight = height && height >= 0 ? height : finalWidth / aspectRatio;

  if ((!width || width >= 0) && (!height || height >= 0)) {
    if (aspectRatio > 1.91) {
      finalWidth = maxWidth;
      finalHeight = maxWidth / aspectRatio;
    } else if (aspectRatio < 0.8) {
      finalHeight = maxHeight;
      finalWidth = maxHeight * aspectRatio;
    }
  }
  return (
    <View
      style={{
        flex: 1,
        width: '100%',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onLayout={event => {
        const {width, height} = event.nativeEvent.layout;
        setContainerWidth(width);
        setContainerheight(height);
        setcontaineraspectRatio(width / height);

        //  setContainerWidth(width);
        // Set container width based on layout
      }}>
      {/* {isLoading && (
        <></>
        // <VStack
        //   space={"md"}
        //   borderWidth="1"
        //   borderColor="coolGray.200"
        //   borderRadius="md"
        //   p="4">
        //   <Skeleton height="100%" width="100%" />
        // </VStack>
      )} */}
      <TouchableOpacity
        style={{...styles.vertical}}
        onPress={() => setIsFullscreen(true)} // Open the image in fullscreen on tap
      >
        {/* <FastImage
          onLoadStart={() => setIsLoading(true)}
          source={
            uri
              ? {uri}
              : require('../assets/images/default-placeholder-image.png')
          }
          onLoadEnd={() => setIsLoading(false)}
          style={styles.vertical}
          resizeMode={FastImage.resizeMode.cover}
          // style={styles.newImage}
        /> */}
        <Image
          source={
            uri
              ? {uri}
              : require('../assets/images/default-placeholder-image.png')
          }
          style={[
            {
              width: finalWidth,
              height: finalHeight,
              //   maxHeight: 450,
              borderRadius: 12,
            },
          ]}
          resizeMode="cover"
        />
        {/* <FastImage
          source={
            uri
              ? {uri}
              : require('../assets/images/default-placeholder-image.png')
          }
          style={{
            width: finalWidth,
            height: finalHeight,
            //   maxHeight: 450,
          }} 
          resizeMode={FastImage.resizeMode.cover} // Ensures the image is not cropped
        /> */}
        {/* <FastImage
        source={{uri}}
        style={{
          width: finalWidth,
          height: finalHeight,
          //   maxHeight: 450,
        }}
        resizeMode="cover"
      /> */}
      </TouchableOpacity>

      {/* Fullscreen Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={isFullscreen}
        onRequestClose={() => setIsFullscreen(false)}>
        <View style={styles.fullscreenContainer}>
          {/* Close Button */}
          <TouchableOpacity
            onPress={() => setIsFullscreen(false)}
            style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>

          <FastImage
            source={{uri}}
            style={styles.fullscreenImage}
            resizeMode={FastImage.resizeMode.cover}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  vertical: {
    width: '100%',
    height: '100%',

    display: 'flex',
    justifyContent: 'center',
    //   backgroundColor:'red'
  },
  newImage: {
    flex: 1,
    width: 380,
    height: 200,
    resizeMode: 'cover',
    // aspectRatio: 1,
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: 'black', // Change as needed
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    marginTop: Platform.OS === 'ios' ? 70 : 0,
    position: 'absolute',
    top: 20,
    right: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
    zIndex: 10, // Ensure the button is above other elements
  },
  closeButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  card: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: screenWidth, // Fixed width to match screen width
  },
  caption: {
    padding: 10,
    fontSize: 14,
    color: '#555',
  },
});

export default AppFastImage;
