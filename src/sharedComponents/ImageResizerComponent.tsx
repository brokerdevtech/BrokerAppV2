import React, {useState} from 'react';
import {View, Button, Image, StyleSheet, Alert} from 'react-native';
import ImageResizer from 'react-native-image-resizer';

const ImageResizerComponent = ({imageUri}) => {
  const [resizedImage, setResizedImage] = useState(null);

  const resizeImage = async aspectRatio => {
    try {
      if (!imageUri) {
        Alert.alert('Error', 'No image URI provided.');
        return;
      }

      const [widthRatio, heightRatio] = aspectRatio.split(':').map(Number);

      const {width, height} = await new Promise((resolve, reject) =>
        Image.getSize(
          imageUri,
          (w, h) => resolve({width: w, height: h}),
          reject,
        ),
      );

      const targetWidth = width;
      const targetHeight = Math.round((targetWidth / widthRatio) * heightRatio);

      const response = await ImageResizer.createResizedImage(
        imageUri,
        targetWidth,
        targetHeight,
        'JPEG',
        100,
        0,
      );

      setResizedImage(response.uri);
      Alert.alert('Success', 'Image resized successfully!');
    } catch (error) {
      Alert.alert('Error', `Failed to resize image: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      {imageUri && (
        <Image source={{uri: imageUri}} style={styles.imagePreview} />
      )}
      {resizedImage && (
        <Image source={{uri: resizedImage}} style={styles.imagePreview} />
      )}
      <View style={styles.buttonContainer}>
        <Button title="Resize to 16:9" onPress={() => resizeImage('16:9')} />
        <Button title="Resize to 1:1" onPress={() => resizeImage('1:1')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    width: '100%',
  },
  imagePreview: {
    width: 300,
    height: 300,
    marginVertical: 20,
    resizeMode: 'contain',
  },
});

export default ImageResizerComponent;
