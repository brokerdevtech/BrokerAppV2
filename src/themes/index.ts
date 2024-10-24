import {StyleSheet} from 'react-native';
import flex from './flex';
import margin from './margin';
import padding from './padding';
import border from './border';
import commonStyle from './commonStyle';
import {colors} from './colors';
import typography from './typographyStyle';
import {Color} from '../styles/GlobalStyles';
export * from './colors';

// Combine All Styles Here
export const styles = StyleSheet.create({
  ...flex,
  ...margin,
  ...padding,
  ...commonStyle,
  ...colors,
  ...border,
  ...typography,
  button: {
    // padding: 10,
    backgroundColor: '#C4C4C4', // Default color
    color: 'black', // Text color
    fontSize: 16,
    borderRadius: 5,
  },
  validButton: {
    backgroundColor: Color.primary, // Color when form is valid
  },
  errorText: {
    color: '#E00000',
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60, // Set half of width/height to create a circle
    overflow: 'hidden', // Clip the image to the circle
  },
  avatarImage: {
    flex: 1, // Take up all available space within the container
    width: null, // Reset the image's width
    height: null, // Reset the image's height
  },
});
