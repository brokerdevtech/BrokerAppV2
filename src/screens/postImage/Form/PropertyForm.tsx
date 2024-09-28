import {Formik} from 'formik';

import {useState} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import * as Yup from 'yup';
import {colors, styles} from '../../../themes';
import {moderateScale} from '../../../config/constants';
import React from 'react';
// import {Discount, Property, Verified, Virtual} from '../../assets/svgs';
import ZText from '../../../sharedComponents/ZText';
import AnimatedTextInput from '../../../sharedComponents/AnimatedTextinput';
import {Box} from '../../../../components/ui/box';
import {HStack} from '../../../../components/ui/hstack';
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from '../../../../components/ui/select';
import {Switch} from '../../../../components/ui/switch';
import {ChevronDownIcon} from '../../../../components/ui/icon';
import {Discount, Property, Verified, Virtual} from '../../../assets/svg';
import {Color} from '../../../styles/GlobalStyles';
function noWhitespace() {
  return this.transform((value, originalValue) =>
    /\s/.test(originalValue) ? NaN : value,
  );
}
Yup.addMethod(Yup.number, 'noWhitespace', noWhitespace);
const PropertyvalidationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  propDescription: Yup.string().required('Description is required'),
  propertySize: Yup.number()
    .noWhitespace()
    .typeError('Property Size must be a number')
    .required('Property size is required')
    .min(100, 'Number must be greater than or equal to 100')
    .max(50000, 'Number must be less than or equal to50000'),
  price: Yup.number()
    .noWhitespace()
    .typeError('Amount must be a number')
    .required('Amount is required')
    .min(0, 'Number must be greater than or equal to 0')
    .max(500000000, 'Number must be less than or equal to 500,000,000'),
  isVirtualTour: Yup.boolean(),
  isBrokerAppVerified: Yup.boolean(),
  isDiscounted: Yup.boolean(),
  isMandateProperty: Yup.boolean(),
});
const genericvalidationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  Description: Yup.string().required('Description is required'),
  Location: Yup.string().required('Location is required'),
});
//const AVATAR_URL = "https://www.realmenrealstyle.com/wp-content/uploads/2023/03/The-Side-Part.jpg";
const devicewidth = Dimensions.get('window').width;
const PropertyForm = ({formikRef}) => {
  const [localities, setLocalities] = useState({});
  const [selectedPropertySize, setselectedPropertySize] = useState('1');
  const [PropertySizeData, setPropertySize] = useState([
    {id: '1', value: 'Sq. Ft.'},
    {id: '2', value: 'Sq. Mtr.'},
    {id: '3', value: 'Sq Yd.'},
  ]);
  const PropertyinitialValues = {
    title: '',
    propDescription: '',
    propertySize: null,
    price: null,
    isVirtualTour: false,
    isBrokerAppVerified: false,
    isDiscounted: false,
    isMandateProperty: false,
  };

  const handleSubmit = values => {
    // Handle form submission here
    console.log(values);
    if (formikRef.current) {
      // formikRef.current.submitForm();
    }
    // setLoading(true);
    // savePost(values, filter, imagesArray);
  };

  const RenderLabel = ({labelText, width = '100%'}: any) => {
    return (
      <View style={{marginBottom: 8}}>
        <ZText color={colors.black} type={'R16'} align="left">
          {labelText}
        </ZText>
      </View>
    );
  };
  return (
    <View>
      <Formik
        innerRef={formikRef}
        initialValues={PropertyinitialValues}
        validationSchema={PropertyvalidationSchema}
        onSubmit={handleSubmit}>
        {({
          handleChange,
          handleSubmit,
          handleBlur,
          values,
          errors,
          setFieldValue,
          touched,
          isValid,
        }) => (
          <View style={localStyles.containerView}>
            <Box style={localStyles.BoxStyles}>
              <HStack style={localStyles.inputContainer}>
                {/* <RenderLabel1 labelText={`Title`} /> */}
                <AnimatedTextInput
                  placeholder="Title"
                  // style={localStyles.inputBox}
                  value={values.title}
                  onChangeText={handleChange('title')}
                  onBlur={handleBlur('title')}
                />
              </HStack>
              {errors.title && touched.title && (
                <Box pl="3" mt="2">
                  <Text style={styles.errorText}>{errors.title}</Text>
                </Box>
              )}
            </Box>

            <Box mb="5" style={localStyles.BoxStyles}>
              <HStack style={localStyles.inputContainer}>
                <AnimatedTextInput
                  multiline={true}
                  // h={20}
                  placeholder="Description"
                  // style={localStyles.inputBox}
                  value={values.propDescription}
                  onChangeText={handleChange('propDescription')}
                  onBlur={handleBlur('propDescription')}
                />
              </HStack>
              {errors.propDescription && touched.propDescription && (
                <Box pl="3" mt="2">
                  <Text style={styles.errorText}>{errors.propDescription}</Text>
                </Box>
              )}
            </Box>

            <Box mb="5" style={localStyles.BoxStyles}>
              <HStack
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                }}>
                {/* <RenderLabel1 labelText={`Property Size`} /> */}
                <View style={{width: '50%'}}>
                  <AnimatedTextInput
                    // width={'50%'}
                    // style={localStyles.inputBox70}
                    placeholder="Size"
                    value={values.propertySize}
                    onChangeText={handleChange('propertySize')}
                    onBlur={handleBlur('propertySize')}
                    keyboardType="numeric"
                    // keyboardType="numeric"
                    // type="numeric"
                  />
                  {errors.propertySize && touched.propertySize && (
                    <Box pl="3" mt="2">
                      <Text style={styles.errorText}>
                        {errors.propertySize}
                      </Text>
                    </Box>
                  )}
                </View>
                <View style={{width: '45%'}}>
                  <Select>
                    <SelectTrigger
                      selectedValue={selectedPropertySize}
                      variant="outline"
                      onValueChange={value => {
                        setselectedPropertySize(value);
                      }}
                      style={{borderColor: Color.borderColor}}
                      size="2xl">
                      <SelectInput placeholder="Select Unit" />
                      <SelectIcon className="mr-3" as={ChevronDownIcon} />
                    </SelectTrigger>
                    <SelectPortal>
                      <SelectBackdrop />
                      <SelectContent>
                        <SelectDragIndicatorWrapper>
                          <SelectDragIndicator />
                        </SelectDragIndicatorWrapper>
                        {PropertySizeData.map((data, index) => (
                          <SelectItem label={data.value} value={data.id} />
                        ))}
                      </SelectContent>
                    </SelectPortal>
                  </Select>
                </View>
              </HStack>
            </Box>
            <Box mb="5" style={localStyles.BoxStyles}>
              <HStack style={localStyles.inputContainer2}>
                {/* <RenderLabel1 labelText={`Price`} /> */}

                <AnimatedTextInput
                  // type="numeric"
                  // borderWidth="1"
                  placeholder="Amount"
                  value={values.price}
                  keyboardType="numeric"
                  onChangeText={handleChange('price')}
                  onBlur={handleBlur('price')}
                />
              </HStack>
              {errors.price && touched.price && (
                <Box pl="3" mt="2">
                  <Text style={styles.errorText}>{errors.price}</Text>
                </Box>
              )}
            </Box>

            <View style={[localStyles.SwitchStyles, {marginTop: 30}]}>
              <HStack style={localStyles.FromControl}>
                <ZText color={colors.dark.black} type={'R16'}>
                  Virtual Tour
                </ZText>
                <Switch
                  size="lg"
                  onValueChange={value => {
                    setFieldValue('isVirtualTour', value, true);
                    handleBlur('isVirtualTour');
                  }}
                  value={values.isVirtualTour}
                  trackColor={{
                    false: Color.primaryDisable,
                    true: Color.primary,
                  }}
                  thumbColor={Color.white}
                />
              </HStack>
              {errors.price && touched.price && (
                <Box>
                  <Text style={styles.errorText}>{errors.isVirtualTour}</Text>
                </Box>
              )}
            </View>

            <Box style={localStyles.SwitchStyles}>
              <HStack style={localStyles.FromControl}>
                <ZText color={colors.dark.black} type={'R16'}>
                  BrokerApp Verified
                </ZText>

                <Switch
                  onValueChange={value => {
                    setFieldValue('isBrokerAppVerified', value, true);
                    handleBlur('isBrokerAppVerified');
                  }}
                  size="lg"
                  value={values.isBrokerAppVerified}
                  trackColor={{
                    false: Color.primaryDisable,
                    true: Color.primary,
                  }}
                  thumbColor={Color.white}
                />
              </HStack>
              {errors.isBrokerAppVerified && touched.isBrokerAppVerified && (
                <Box pl="3" mt="2">
                  <Text style={styles.errorText}>
                    {errors.isBrokerAppVerified}
                  </Text>
                </Box>
              )}
            </Box>

            <Box mb="5" style={localStyles.SwitchStyles}>
              <HStack style={localStyles.FromControl}>
                <ZText color={colors.dark.black} type={'R16'}>
                  Discounted
                </ZText>

                <Switch
                  size="lg"
                  onValueChange={value => {
                    setFieldValue('isDiscounted', value, true);
                    handleBlur('isDiscounted');
                  }}
                  trackColor={{
                    false: Color.primaryDisable,
                    true: Color.primary,
                  }}
                  value={values.isDiscounted}
                  thumbColor={Color.white}
                />
              </HStack>
              {errors.isBrokerAppVerified && touched.isBrokerAppVerified && (
                <Box pl="3" mt="2">
                  <Text style={styles.errorText}>
                    {errors.isBrokerAppVerified}
                  </Text>
                </Box>
              )}
            </Box>
            <Box mb="5" style={localStyles.SwitchStyles}>
              <HStack style={localStyles.FromControl}>
                <ZText color={colors.dark.black} type={'R16'}>
                  Mandate Property
                </ZText>

                <Switch
                  size="lg"
                  onValueChange={value => {
                    setFieldValue('isMandateProperty', value, true);
                    handleBlur('isMandateProperty');
                  }}
                  trackColor={{
                    false: Color.primaryDisable,
                    true: Color.primary,
                  }}
                  thumbColor={Color.white}
                  value={values.isMandateProperty}
                />
              </HStack>
              {errors.isBrokerAppVerified && touched.isBrokerAppVerified && (
                <Box pl="3" mt="2">
                  <Text style={styles.errorText}>
                    {errors.isBrokerAppVerified}
                  </Text>
                </Box>
              )}
            </Box>
          </View>
        )}
      </Formik>
    </View>
  );
};

const localStyles = StyleSheet.create({
  root: {
    ...styles.flex,
    ...styles.ph30,
    ...styles.mb40,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',

    color: '#333',
  },

  sectionHeader: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 10,
  },
  optionText: {
    fontSize: 12,
    marginBottom: 10,

    alignItems: 'center',
  },

  filtersContainer: {
    marginTop: 20,
  },

  filterText: {
    fontSize: 16,
    marginLeft: 10,
  },

  filterContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterItem: {
    flex: 1,
  },
  filterItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  // sectionHeader: {
  //   fontSize: 20,
  //   fontWeight: 'bold',
  //   marginTop: 10,
  //   marginBottom: 5, // Adjust as needed
  // },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Allow multiple rows of options
  },
  optionButton: {
    flex: 1,
    padding: 20,
    margin: 5,

    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  selectedOption: {
    backgroundColor: '#007dc5',
    color: 'white',
  },
  selectedOptionButton: {
    padding: 5,
    margin: 5,
    backgroundColor: '#FCC306',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedOptionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 5,
  },

  // modalContent: {
  //   backgroundColor: 'white',
  //   padding: 20,
  // },
  applyButton: {
    backgroundColor: 'blue',
    marginTop: 20,

    borderRadius: 5,
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
  },

  paginationWrapper: {
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
    margin: 4,
  },
  activeDot: {
    backgroundColor: '#FF6B6B',
  },
  // listContainer: {
  //   alignItems: 'center',
  // },
  card: {
    width: devicewidth, // Card takes up full width of the screen
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor:'red'
    // Add additional styling for the card here
  },
  image: {
    width: devicewidth - 40, // Slightly less than full width for card padding effect
    height: devicewidth - 200, // Making the image square, but you can adjust as needed
    resizeMode: 'cover',
    borderRadius: 10, // Adds rounded corners to the image
    // Add additional styling for the image here
  },
  inputContainer: {
    flexDirection: 'column',
    textAlign: 'left',
  },
  inputContainer2: {
    flexDirection: 'column',
    textAlign: 'left',
    justifyContent: 'space-between',
  },
  inputBox: {
    // borderWidth: 0,
    // borderBottomWidth: 1,
    width: '100%',
    minHeight: 42,
    fontSize: 16,
    color: 'black',
    // marginLeft:20,
    borderColor: '#999',
  },
  inputBox70: {
    // borderWidth: 0,
    // borderBottomWidth: 1,
    width: '50%',
    minHeight: 42,
    fontSize: 16,
    color: 'black',
    // marginLeft:20,
    borderColor: '#999',
  },
  selectStyle: {
    borderWidth: -1,
    width: '100%',
    minHeight: 28,
    fontSize: 18,
    // marginLeft:20,
    borderColor: 'transparent',
  },
  SwitchStyles: {
    borderBottomWidth: 1,
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
    borderColor: Color.borderColor,
    justifyContent: 'space-between',
    // ...styles.ph20,
    alignItems: 'center',
    width: '100%',
    // justifyContent: 'center',
  },
  BoxStyles: {
    flexDirection: 'column',
    paddingTop: 10,
    marginBottom: 10,
    borderColor: '#BDBDBD',
    justifyContent: 'space-between',
  },
  // imagecard: {
  //   width: devicewidth,
  //   height: 500,
  //   // borderRadius: 10,
  // },
  singleimagecard: {
    width: '100%',
    height: 500,
    // borderRadius: 10,
  },
  listContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  singleCard: {
    width: '100%',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // card: {
  //   width: 200,
  //   height: 200,
  //   marginRight: 5,
  //   // borderRadius: 10,
  //   // backgroundColor: 'lightgray',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  FromControl: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    // gap: 2,
    paddingRight: 0,
    // marginLeft: 20,
  },
  media: {
    width: '100%',
    height: 200,
  },
  containerView: {
    width: '100%',

    ...styles.ph20,
  },
  listicons: {
    width: '10%',
  },
  listText: {
    flexGrow: 0.5,
  },
  listcontent: {
    width: '90%',
    alignContent: 'center',
    flexWrap: 'wrap',
    wordWrap: 'break-word',
    marginLeft: 20,
    paddingHorizontal: 20,
  },

  headerContainer: {
    ...styles.flex,
    ...styles.flexRow,
    ...styles.justifyBetween,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  default_Img: {
    width: moderateScale(100),
    height: moderateScale(100),
    alignSelf: 'center',
    alignContent: 'center',
    backgroundColor: '#000',
  },
  tag: {
    backgroundColor: 'rgba(126, 200, 249, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(126, 200, 249, 0.2)',
  },
  tagText: {
    color: 'black',
  },
  appTitleMain: {
    color: '#000',
    fontSize: 19,
    fontWeight: '600',
    marginLeft: 20,
  },

  captionInput: {
    height: 45,
    width: '70%',
    marginLeft: 20,
    borderWidth: 0,
    padding: 10,
    borderColor: 'black',
  },
});

export default PropertyForm;
