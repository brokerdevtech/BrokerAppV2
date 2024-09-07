import {moderateScale} from '../config/constants';
import { FontFamily } from '../styles/GlobalStyles';
import {  ProximaFontFamily } from '../styles/GlobalStyles';
// App Font-Family:
const fontWeights = {
  Light: {
    fontFamily: ProximaFontFamily.proximaRegular,
    fontWeight:300,
  },
  Regular: {
    fontFamily: ProximaFontFamily.proximaRegular,
    fontWeight:400,
  },
  Medium: {
    fontFamily:ProximaFontFamily.proximaRegular,
    fontWeight:500,
  },
  SemiBold: {
    fontFamily: ProximaFontFamily.proximaSemiBold,
    fontWeight:600,
  },
  Bold: {
    fontFamily: ProximaFontFamily.proximaRegular,
    fontWeight:700,
  },
};
const fontColor = {
  primaryfontColor : {
    color: '#232323',
  },
  secondaryfontColor : {
    color: '#d9d9d9',
  },
};
// App font sizes:
const fontSizes = {
  f10: {
    fontSize: moderateScale(10),
  },
  f11: {
    fontSize: moderateScale(11),
  },
  f12: {
    fontSize: moderateScale(12),
  },
  f14: {
    fontSize: moderateScale(14),
  },
  f16: {
    fontSize: moderateScale(16),
  },
  f18: {
    fontSize: moderateScale(18),
   
  },
  f20: {
    fontSize: moderateScale(20),
    fontWeight:700,
  },
  f22: {
    fontSize: moderateScale(22),
    fontWeight:700,
  },
  f24: {
    fontSize: moderateScale(24),
  },
  f26: {
    fontSize: moderateScale(26),
    fontWeight:800,
  },
  f28: {
    fontSize: moderateScale(28),
  },
  f30: {
    fontSize: moderateScale(30),
  },
  f32: {
    fontSize: moderateScale(32),
  },
  f34: {
    fontSize: moderateScale(34),
  },
  f35: {
    fontSize: moderateScale(35),
  },
  f36: {
    fontSize: moderateScale(36),
  },
  f40: {
    fontSize: moderateScale(40),
  },
  f46: {
    fontSize: moderateScale(46),
  },
};

const fontBold = {
  regular:{
    fontWeight:400,
  },
  semiBold:{
    fontWeight:700,
  },
  bold:{
    fontWeight:700,
  }
};

const typography = {fontWeights, fontSizes,fontColor, fontBold};

export default typography;
