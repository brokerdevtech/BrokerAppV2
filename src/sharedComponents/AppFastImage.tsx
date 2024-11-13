//import {Box, HStack, Skeleton, VStack} from 'native-base';
import React, {useState} from 'react';
import {Platform} from 'react-native';
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

const AppFastImage = ({uri}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false); // New state to control modal visibility
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerheight, setContainerheight] = useState(0);
  const [containeraspectRatio, setcontaineraspectRatio] = useState(0);

  return (
    <View
      style={{
        flex: 1,
        width: '100%',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onLayout={(event) => {
        const {width,height} = event.nativeEvent.layout;
        setContainerWidth(width)
        setContainerheight(height)
        setcontaineraspectRatio(width/height);

      //  setContainerWidth(width); 
        // Set container width based on layout
      }}
      >
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
        <FastImage
          onLoadStart={() => setIsLoading(true)}
          source={{uri}}
          onLoadEnd={() => setIsLoading(false)}
          style={styles.vertical}
         resizeMode={FastImage.resizeMode.cover}
        // style={styles.newImage}
        />
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
    borderRadius: 12,
    display: 'flex',
    justifyContent: 'center',
 //   backgroundColor:'red'
  },
  newImage:{
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
});

export default AppFastImage;
