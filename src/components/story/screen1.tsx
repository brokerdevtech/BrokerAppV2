import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Image, Button, StyleSheet, Dimensions} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

const Screen1 = ({}) => {
  const imageSize = useSharedValue(1); // Initial size (full screen)
  const navigation = useNavigation();
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: withTiming(imageSize.value, {duration: 500})}],
    };
  });

  const shrinkImage = () => {
    imageSize.value = 0.3; // Shrink the image
    // setTimeout(() => {
    //   navigation.navigate('Screen2'); // Navigate to Screen2 after animation
    // }, 500);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.imageContainer, animatedStyle]}>
        <Image
          source={{
            uri: 'https://gratisography.com/wp-content/uploads/2024/01/gratisography-cyber-kitty-800x525.jpg',
          }}
          style={styles.image}
        />
      </Animated.View>
      <Button title="Shrink & Open Screen 2" onPress={shrinkImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default Screen1;
