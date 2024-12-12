import React, {useState} from 'react';
import {
  Platform,
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Text,
} from 'react-native';
import FastImage from '@d11/react-native-fast-image';

const AdsBannerIMage = ({uri, onPress}) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.imageContainer} onPress={onPress}>
        <FastImage
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
          source={
            uri
              ? {uri}
              : require('../assets/images/default-placeholder-image.png')
          }
          style={styles.image}
          resizeMode={FastImage.resizeMode.cover}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 16 / 8,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
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
    zIndex: 10,
  },
  closeButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
});

export default AdsBannerIMage;
