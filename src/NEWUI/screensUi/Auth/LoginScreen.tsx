import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  StatusBar,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {useNavigation} from '@react-navigation/native';
import {Color} from '@/src/styles/GlobalStyles';
import image from './image';
import {FormControl} from '@/components/ui/form-control';
import {VStack} from '@/components/ui/vstack';
import {Input, InputField, InputIcon, InputSlot} from '@/components/ui/input';
import {Button, ButtonText} from '@/components/ui/button';
import {EyeIcon, EyeOffIcon} from '@/components/ui/icon';
import {SvgXml} from 'react-native-svg';
import ZText from '@/src/sharedComponents/ZText';

const {height: sHeight, width: sWidth} = Dimensions.get('screen');
const ImageHeight = 280;

const LoginScreen = () => {
  const navigation = useNavigation();
  const scrollY = useSharedValue(0);
  const handleScroll = useAnimatedScrollHandler(event => {
    scrollY.value = event.contentOffset.y;
  });
  const [showPassword, setShowPassword] = useState(false);
  const handleState = () => {
    setShowPassword(!showPassword);
  };

  const scrollAnimatedStyles = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, 320],
      [0, -ImageHeight],
      Extrapolation.CLAMP,
    );
    return {transform: [{translateY}]};
  });

  const headerViewAnimatedStyles = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      scrollY.value,
      [0, 320],
      ['transparent', 'darkgray'],
    );
    return {backgroundColor};
  });

  const titleAnimatedStyles = fadeIn =>
    useAnimatedStyle(() => {
      const outputRange = fadeIn ? [0, 0, 1] : [1, 0, 0];
      const opacity = interpolate(scrollY.value, [0, 120, 320], outputRange);
      return {opacity};
    });

  const animatedImageStyles = useAnimatedStyle(() => {
    const scale = interpolate(scrollY.value, [0, 320], [1.4, 1], {
      extrapolateRight: Extrapolation.CLAMP,
    });
    return {transform: [{scale}]};
  });

  return (
    <>
      <View style={styles.container}>
        <StatusBar translucent backgroundColor={'transparent'} />
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}></TouchableOpacity>

        <Animated.View style={[styles.headerImage, animatedImageStyles]}>
          <LinearGradient
            colors={['#b97777', 'rgba(255,255,255,0)']}
            style={{
              height: 135,
              width: 135,
              borderRadius: 135,
              position: 'absolute',
              top: 20,
              right: -50,
              transform: [{rotate: '-120deg'}],
            }}></LinearGradient>
          <LinearGradient
            colors={['#b97777', 'rgba(255,255,255,0)']}
            style={{
              height: 135,
              width: 135,
              borderRadius: 135,
              position: 'absolute',
              bottom: 0,
              left: -50,
              transform: [{rotate: '120deg'}],
            }}></LinearGradient>
          <Image
            style={{
              width: 90,
              height: 90,
              marginBottom: 20,
              resizeMode: 'contain',
            }}
            source={image.headerImg}
          />
          <Animated.Text style={[styles.title, titleAnimatedStyles(false)]}>
            Login
          </Animated.Text>
          <Image
            style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              resizeMode: 'stretch',
              height: 65,
            }}
            source={image.loginShape}
          />
        </Animated.View>
        <Animated.View style={scrollAnimatedStyles}>
          <Animated.View style={[styles.headerView, headerViewAnimatedStyles]}>
            <View>
              <Animated.Text style={[styles.title2, titleAnimatedStyles(true)]}>
                Login
              </Animated.Text>
            </View>
          </Animated.View>
          <Animated.ScrollView
            onScroll={handleScroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 120, minHeight: sHeight}}
            style={{
              backgroundColor: Color.white,
              zIndex: 99,
            }}>
            <View style={styles.innerContainer}>
              <FormControl className="p-5 rounded-lg">
                <VStack space="xl">
                  <VStack space="xl">
                    <Input style={styles.inputField}>
                      <InputField type="text" placeholder="Username" />
                    </Input>
                  </VStack>
                  <VStack space="xs" style={styles.spacingBetweenInputs}>
                    <Input className="text-center" style={styles.inputField}>
                      <InputField
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                      />
                      <InputSlot className="pr-3" onPress={handleState}>
                        <InputIcon
                          as={showPassword ? EyeIcon : EyeOffIcon}
                          className="text-gray-500"
                        />
                      </InputSlot>
                    </Input>
                    <ZText
                      onPress={() => {
                        navigation.navigate('ForgotPassword');
                      }}
                      style={{
                        textAlign: 'right',
                        textDecorationLine: 'underline',
                        color: Color.primary,
                      }}
                      type="R12">
                      Forgot Password?
                    </ZText>
                  </VStack>
                  <Button className="ml-auto" style={styles.Button}>
                    <ButtonText className="text-typography-0">Login</ButtonText>
                  </Button>
                </VStack>
              </FormControl>
              <ZText
                type="=R12"
                style={{textAlign: 'center', color: '#5C5C5C'}}>
                Don't have an account?{' '}
                <ZText
                  type="R12"
                  style={{
                    textDecorationLine: 'underline',
                    color: Color.primary,
                  }}
                  onPress={() => {
                    navigation.navigate('Register');
                  }}>
                  Sign Up
                </ZText>
              </ZText>
            </View>
          </Animated.ScrollView>
        </Animated.View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  headerImage: {
    width: '100%',
    height: ImageHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'gray' + '30',
    zIndex: 9999,
    position: 'absolute',
    top: 50,
    left: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerView: {
    width: '100%',
    justifyContent: 'center',
    paddingVertical: 12,
    alignItems: 'center',
  },
  title: {
    fontSize: 23,
    fontWeight: '600',
    color: Color.black,
    marginHorizontal: 20,
    // position: 'absolute',
    // marginBottom: 20,
  },
  title2: {
    fontSize: 18,
    fontWeight: '500',
    color: Color.primary,
    marginHorizontal: 20,
    textAlign: 'center',
    marginTop: 34,
  },
  innerContainer: {
    margin: 20,
  },
  inputField: {
    height: 50, // Increase the height of the input fields
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
  },
  spacingBetweenInputs: {
    marginVertical: 16, // Add space between the input fields
  },
  imageOverlay: {
    height: ImageHeight + 50,
    ...StyleSheet.absoluteFillObject,
  },
  Button: {
    height: 50,
    borderRadius: 8,
    backgroundColor: Color.primary,
  },
  text: {
    fontSize: 20,
    color: Color.gray,
    fontWeight: '600',
  },
  text2: {
    fontSize: 16,
    color: Color.primary,
    marginTop: 10,
    fontWeight: '600',
  },
});

export default LoginScreen;
