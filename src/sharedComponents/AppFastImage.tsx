// //import {Box, HStack, Skeleton, VStack} from 'native-base';
// import React, {useEffect, useState} from 'react';
// import {Dimensions, Platform} from 'react-native';
// import {
//   View,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   Modal,
//   Text,
// } from 'react-native';
// import {VStack} from '../../components/ui/vstack';
// import {Skeleton} from '../../components/ui/skeleton';
// import FastImage from '@d11/react-native-fast-image';
// import flex from '@/themes/flex';
// //import FastImage from 'react-native-fast-image';
// const screenWidth = Dimensions.get('window').width;
// const AppFastImage = ({uri, height, width}) => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [isFullscreen, setIsFullscreen] = useState(false); // New state to control modal visibility
//   const [containerWidth, setContainerWidth] = useState(0);
//   const [containerheight, setContainerheight] = useState(0);
//   const [containeraspectRatio, setcontaineraspectRatio] = useState(0);
//  const [aspectRatio, setAspectRatio] = useState(1);
//   //const [aspectRatio, setAspectRatio] = useState(4 / 5); // Default to 4:5 ratio

//   const screenWidth = containerWidth -20
//   const maxHeight = (screenWidth * 5) / 4; // 4:5 ratio
//   const maxWidth = screenWidth * 1.91;

//   // Fetch aspect ratio if height or width are not provided
//   const fetchAspectRatio = async uri => {
//     return new Promise(resolve => {
//       Image.getSize(uri, (width, height) => {
//         resolve(width / height);
//       });
//     });
//   };

//   useEffect(() => {
//     const loadAspectRatio = async () => {
//       if (!width || width === 0 || !height || height === 0) {
//         const ratio = await fetchAspectRatio(uri);
//         setAspectRatio(ratio);
//       } else {
//         setAspectRatio(width / height);
//       }
//     };
//     loadAspectRatio();
//   }, [uri, width, height]);

//   // console.log(width);
//   let finalWidth = width && width >= 0 ? width : screenWidth ;
//   let finalHeight = height && height >= 0 ? height : finalWidth / aspectRatio;

//   if ((!width || width >= 0) && (!height || height >= 0)) {
//     if (aspectRatio > 1.91) {
//       finalWidth = maxWidth;
//       finalHeight = maxWidth / aspectRatio;
//     } else if (aspectRatio < 0.8) {
//       finalHeight = maxHeight;
//       finalWidth = maxHeight * aspectRatio;
//     }
//   }
//   return (
//     <View
//       style={{
//         flex: 1,
//         width: '100%',
//         borderRadius: 12,
//         maxHeight: 450,
// padding:10,
//             display: 'flex',

//       }}
//       onLayout={event => {
//         const {width, height} = event.nativeEvent.layout;
//         setContainerWidth(width);
//         setContainerheight(height);
//         setcontaineraspectRatio(width / height);

//         //  setContainerWidth(width);
//         // Set container width based on layout
//       }}>

//       <TouchableOpacity
//         style={{...styles.vertical}}
//         onPress={() => setIsFullscreen(true)} // Open the image in fullscreen on tap
//       >
//         {/* <FastImage
//           onLoadStart={() => setIsLoading(true)}
//           source={
//             uri
//               ? {uri}
//               : require('../assets/images/default-placeholder-image.png')
//           }
//           onLoadEnd={() => setIsLoading(false)}
//           style={styles.vertical}
//           resizeMode={FastImage.resizeMode.cover}
//           // style={styles.newImage}
//         /> */}
//         <Image
//           source={
//             uri
//               ? {uri}
//               : require('../assets/images/default-placeholder-image.png')
//           }
//           style={[
//             {
//               width: finalWidth,
//               height: finalHeight,
//               maxHeight: 450,
//                borderRadius: 12,
//               // borderColor:'red',
//               // borderWidth: 1,
//             },
//           ]}
//           resizeMode="cover"
//         />
//         {/* <FastImage
//           source={
//             uri
//               ? {uri}
//               : require('../assets/images/default-placeholder-image.png')
//           }
//           style={{
//             width: finalWidth,
//             height: finalHeight,
//             //   maxHeight: 450,
//           }}
//           resizeMode={FastImage.resizeMode.cover} // Ensures the image is not cropped
//         /> */}
//         {/* <FastImage
//         source={{uri}}
//         style={{
//           width: finalWidth,
//           height: finalHeight,
//           //   maxHeight: 450,
//         }}
//         resizeMode="cover"
//       /> */}
//       </TouchableOpacity>

//       {/* Fullscreen Modal */}
//       <Modal
//         animationType="slide"
//         transparent={false}
//         visible={isFullscreen}
//         onRequestClose={() => setIsFullscreen(false)}>
//         <View style={styles.fullscreenContainer}>
//           {/* Close Button */}
//           <TouchableOpacity
//             onPress={() => setIsFullscreen(false)}
//             style={styles.closeButton}>
//             <Text style={styles.closeButtonText}>Close</Text>
//           </TouchableOpacity>

//           <FastImage
//             source={{uri}}
//             style={styles.fullscreenImage}
//             resizeMode={FastImage.resizeMode.cover}
//           />
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   vertical: {
//     width: '100%',
//     borderRadius: 12,

//     display: 'flex',
// // justifyContent: 'center',
// // alignContent: 'center',

//      },
//   newImage: {
//     flex: 1,
//     width: 380,
//     height: 200,
//     resizeMode: 'cover',
//     // aspectRatio: 1,
//   },
//   fullscreenContainer: {
//     flex: 1,
//     backgroundColor: 'black', // Change as needed
//     justifyContent: 'center',
//     alignItems: 'center',
//     color: 'white',
//   },
//   fullscreenImage: {
//     width: '100%',
//     height: '100%',
//   },
//   closeButton: {
//     marginTop: Platform.OS === 'ios' ? 70 : 0,
//     position: 'absolute',
//     top: 20,
//     right: 10,
//     backgroundColor: 'white',
//     padding: 10,
//     borderRadius: 20,
//     zIndex: 10, // Ensure the button is above other elements
//   },
//   closeButtonText: {
//     color: 'black',
//     fontWeight: 'bold',
//   },
//   card: {
//     marginBottom: 20,
//     borderRadius: 10,
//     overflow: 'hidden',
//     backgroundColor: '#fff',
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   image: {
//     width: screenWidth, // Fixed width to match screen width
//   },
//   caption: {
//     padding: 10,
//     fontSize: 14,
//     color: '#555',
//   },
// });

// export default AppFastImage;
import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Text,
  Dimensions,
  Platform,
} from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import {CloseCircleIcon, CloseIcon, Icon} from '../../components/ui/icon';
import ImageCarousel from '../screens/Podcast/ImageCarousel';
import {imagesBucketcloudfrontPath} from '../config/constants';
import PreviewImageCarousel from './PreviewImageCarousel';

const screenWidth = Dimensions.get('window').width;

// const AppFastImage = ({ uri }) => {
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [aspectRatio, setAspectRatio] = useState(4 / 5); // Default aspect ratio for portrait (4:5)

//   // Fetch aspect ratio dynamically if image dimensions are unknown
//   const fetchAspectRatio = async (uri) => {
//     return new Promise((resolve) => {
//       Image.getSize(uri, (width, height) => {
//         resolve(width / height);
//       });
//     });
//   };

//   useEffect(() => {
//     const loadAspectRatio = async () => {
//       if (uri) {
//         const ratio = await fetchAspectRatio(uri);
//         setAspectRatio(ratio);
//       }
//     };
//     loadAspectRatio();
//   }, [uri]);

//   // Calculate dimensions for a 4:5 ratio portrait image
//   const portraitWidth = screenWidth - 20; // Allow for padding
//   const portraitHeight =  ((portraitWidth * 5) / 4) / 2; // Height for a 4:5 ratio

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity onPress={() => setIsFullscreen(true)}>
//         <FastImage
//           source={
//             uri
//               ? { uri }
//               : require('../assets/images/default-placeholder-image.png')
//           }
//           style={[
//             styles.image,
//             { width: portraitWidth, height: portraitHeight },
//           ]}
//           resizeMode={FastImage.resizeMode.contain} // Prevents cropping by scaling the image to fit
//         />
//       </TouchableOpacity>

//       {/* Fullscreen Modal */}
//       <Modal
//         animationType="slide"
//         transparent={false}
//         visible={isFullscreen}
//         onRequestClose={() => setIsFullscreen(false)}
//       >
//         <View style={styles.fullscreenContainer}>
//           {/* Close Button */}
//           <TouchableOpacity
//             onPress={() => setIsFullscreen(false)}
//             style={styles.closeButton}
//           >
//             <Text style={styles.closeButtonText}>Close</Text>
//           </TouchableOpacity>
//           <FastImage
//             source={{ uri }}
//             style={styles.fullscreenImage}
//             resizeMode={FastImage.resizeMode.contain} // Ensures the image is fully visible in fullscreen mode
//           />
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 10,
//   },
//   image: {
//     borderRadius: 12,
//     backgroundColor: 'lightgray', // Background color for empty areas if the image doesn't fill the entire frame
//   },
//   fullscreenContainer: {
//     flex: 1,
//     backgroundColor: 'black',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   fullscreenImage: {
//     width: '100%',
//     height: '100%',
//   },
//   closeButton: {
//     position: 'absolute',
//     top: Platform.OS === 'ios' ? 50 : 20,
//     right: 10,
//     backgroundColor: 'white',
//     padding: 10,
//     borderRadius: 20,
//     zIndex: 10,
//   },
//   closeButtonText: {
//     color: 'black',
//     fontWeight: 'bold',
//   },
// });

// export default AppFastImage;

const AppFastImage = ({
  uri,
  height,
  width,
  previewUrls = [],
  initialIndex = 0,
  currentIndex = 0,
  style,
}) => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  // Define Instagram-like dimensions (4:5 portrait aspect ratio)
  const maxWidth = screenWidth - 30; // Allow for padding
  const maxHeight = (maxWidth * 5) / 4 / 2; // Height for a 4:5 ratio

  console.log(previewUrls, 'prebis');
  const images = previewUrls.mediaType !== 'video' ? previewUrls : null;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setIsFullscreen(true)}>
        <FastImage
          source={{uri}}
          style={[styles.image, {width: maxWidth, height: maxHeight}]}
          resizeMode={FastImage.resizeMode.cover} // Crops taller images like Instagram
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
            {/* <Ionicons name="close-outline" size={28} color="white" /> */}
            {/* Remove the Icon component if you don't need both icons */}
            <Icon as={CloseCircleIcon} color="white" size={'xxxl'} />
          </TouchableOpacity>

          {/* Image Carousel */}
          <PreviewImageCarousel
            images={images}
            autoPlay={false}
            initialIndex={currentIndex}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  image: {
    borderRadius: 12,
    backgroundColor: 'lightgray', // Optional background color for empty areas
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: 'black', // Fully black background for better image viewing
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', // Important for absolute positioning of the close button
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    right: 25,
    top: Platform.OS === 'ios' ? 70 : 30,
    zIndex: 1000, // Ensure it's above other elements
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AppFastImage;
