import {StyleSheet} from 'react-native';
import {getHeight, moderateScale} from '../config/constants';

export default StyleSheet.create({
  bd0: {
    borderWidth: moderateScale(0),
  },
  bd1: {
    borderWidth: moderateScale(1),
  },
  bd2: {
    borderWidth: moderateScale(2),
  },
  bd5: {
    borderWidth: moderateScale(5),
  },
  br5: {
    borderRadius: moderateScale(5),
  },
  br10: {
    borderRadius: moderateScale(10),
  },
  br15: {
    borderRadius: moderateScale(15),
  },
  br20: {
    borderRadius: moderateScale(20),
  },
  br50: {
    borderRadius: moderateScale(50),
  },
  btd0: {
    borderTopWidth: moderateScale(0),
  },
  btd1: {
    borderTopWidth: moderateScale(1),
  },
  btd2: {
    borderTopWidth: moderateScale(2),
  },
  brd0: {
    borderRightWidth: moderateScale(0),
  },
  brd1: {
    borderRightWidth: moderateScale(1),
  },
  brd2: {
    borderRightWidth: moderateScale(2),
  },
});
