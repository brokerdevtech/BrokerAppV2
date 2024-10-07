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
import LocalityTag from '../../../sharedComponents/LocalityTag';
import RegistrationYear from '../../../sharedComponents/RegistrationYear';
import TagSelector from '../../../sharedComponents/TagSelector';
import SingleSelectComponent from '../../../sharedComponents/Genric/SingleSelectComponent';
function noWhitespace() {
  return this.transform((value, originalValue) =>
    /\s/.test(originalValue) ? NaN : value,
  );
}
Yup.addMethod(Yup.number, 'noWhitespace', noWhitespace);
const PropertyvalidationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  propDescription: Yup.string().required('Description is required'),

  price: Yup.number()
    .noWhitespace()
    .typeError('Amount must be a number')
    .required('Amount is required')
    .min(0, 'Number must be greater than or equal to 0')
    .max(500000000, 'Number must be less than or equal to 500,000,000'),
  Location: Yup.object().required('Location is required'),
  registrationYear: Yup.number()
  .typeError('Registration Year must be a number')
  .min(1900, 'Invalid Registration Year')
  .max(new Date().getFullYear(), 'Invalid Registration Year')
  .required('Registration Year is required'),
  yearOfManufacture: Yup.number()
  .typeError('Manufacture Year must be a number')
  .min(1900, 'Invalid Manufacture Year')
  .max(new Date().getFullYear(), 'Invalid Manufacture Year')
  .required('Manufacture Year is required'),
  isNewCar: Yup.boolean(),

  mileage: Yup.number().min(0, 'Mileage cannot be negative'),
  kmsDriven: Yup.number().min(0, 'Kms Driven cannot be negative'),
  engineDisplacement: Yup.number().min(0, 'Engine Displacement cannot be negative'),
  carEnginePower: Yup.number().min(0, 'Car Engine Power cannot be negative'),
});

//const AVATAR_URL = "https://www.realmenrealstyle.com/wp-content/uploads/2023/03/The-Side-Part.jpg";
const devicewidth = Dimensions.get('window').width;
const CarForm = ({formikRef}) => {
  const [localities, setLocalities] = useState({});

  const PropertyinitialValues = {
    title: '',
    propDescription: '',
    price: null,
    Location: undefined,
  };

  const handleSubmit = values => {
    console.log(values);
    if (formikRef.current) {
      // formikRef.current.submitForm();
    }
  };
  const years = [];
  for (let year = 2024; year >= 2000; year--) {
    years.push({label:year.toString(), value:year});
  }
console.log(years)
  const handleYearChange = (year) => {
    console.log("Selected Year:", year);
  };
  const onFiltersLocalityChange = Localitys => {
    //
    //

    formikRef.current.handleBlur('Location');
    formikRef.current.setFieldValue('Location', Localitys);
    setLocalities(Localitys);
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
            <View>
              {console.log(values)}
              {/* Rest of the form */}
            </View>
            <Box style={localStyles.BoxStyles}>
              <HStack style={localStyles.inputContainer}>
                {/* <RenderLabel1 labelText={`Title`} /> */}
                <AnimatedTextInput
                  placeholder="Title"
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
            <Box mb="5" style={localStyles.BoxStyles}>
              <LocalityTag
                onLocalityChange={onFiltersLocalityChange}
                isMandatory={true}></LocalityTag>
              {errors.Location && touched.Location && (
                <Box pl="3" mt="2">
                  <Text style={styles.errorText}>{errors.Location}</Text>
                </Box>
              )}
            </Box>
            <Box mb="5" style={localStyles.BoxStyles}>
  <HStack style={localStyles.inputContainer}>

  <SingleSelectComponent
                        data={years}
                        onSelectionChange={value => {
                          console.log(value);
                          setFieldValue('registrationYear', Number(value));
                          // handleCountryChange(value);
                          handleBlur('registrationYear');
                        }}
                        
                        displayText={'Select Registration Year'}
                        title={'Select Registration Year'}
                      />
 

  </HStack>
  {errors.registrationYear && touched.registrationYear && (
    <Box pl="3" mt="2">
      <Text style={styles.errorText}>{errors.registrationYear}</Text>
    </Box>
  )}
</Box>




<Box mb="5" style={localStyles.BoxStyles}>
  <HStack style={localStyles.inputContainer}>

  <SingleSelectComponent
                        data={years}
                        onSelectionChange={value => {
                          console.log(value);
                          setFieldValue('yearOfManufacture', Number(value));
                          // handleCountryChange(value);
                          handleBlur('yearOfManufacture');
                        }}
                       
                        displayText={'Select Manufacture Year'}
                        title={'Select Manufacture Year'}
                      />
 

  </HStack>
  {errors.yearOfManufacture && touched.yearOfManufacture && (
    <Box pl="3" mt="2">
      <Text style={styles.errorText}>{errors.yearOfManufacture}</Text>
    </Box>
  )}
</Box>


<View style={[localStyles.SwitchStyles, {marginTop: 30}]}>
              <HStack style={localStyles.FromControl}>
                <ZText color={colors.dark.black} type={'R16'}>
                Is New Car
                </ZText>
                <Switch
                  size="lg"
                  onValueChange={value => {
                    setFieldValue('isNewCar', value, true);
                    handleBlur('isNewCar');
                  }}
                  value={values.isNewCar}
                  trackColor={{
                    false: Color.primaryDisable,
                    true: Color.primary,
                  }}
                  thumbColor={Color.white}
                />
              </HStack>
              {errors.price && touched.price && (
                <Box>
                  <Text style={styles.errorText}>{errors.isNewCar}</Text>
                </Box>
              )}
            </View>

            <Box mb="5" style={localStyles.BoxStyles}>
              <HStack style={localStyles.inputContainer2}>
                {/* <RenderLabel1 labelText={`Price`} /> */}

                <AnimatedTextInput
                  // type="numeric"
                  // borderWidth="1"
                  placeholder="mileage"
                  value={values.mileage}
                  keyboardType="numeric"
                  onChangeText={handleChange('mileage')}
                  onBlur={handleBlur('mileage')}
                />
              </HStack>
              {errors.mileage && touched.mileage && (
                <Box pl="3" mt="2">
                  <Text style={styles.errorText}>{errors.mileage}</Text>
                </Box>
              )}
            </Box>
            <Box mb="5" style={localStyles.BoxStyles}>
              <HStack style={localStyles.inputContainer2}>
                {/* <RenderLabel1 labelText={`Price`} /> */}

                <AnimatedTextInput
                  // type="numeric"
                  // borderWidth="1"
                  placeholder="kmsDriven"
                  value={values.kmsDriven}
                  keyboardType="numeric"
                  onChangeText={handleChange('kmsDriven')}
                  onBlur={handleBlur('kmsDriven')}
                />
              </HStack>
              {errors.kmsDriven && touched.kmsDriven && (
                <Box pl="3" mt="2">
                  <Text style={styles.errorText}>{errors.kmsDriven}</Text>
                </Box>
              )}
            </Box>
            <Box mb="5" style={localStyles.BoxStyles}>
              <HStack style={localStyles.inputContainer2}>
                {/* <RenderLabel1 labelText={`Price`} /> */}

                <AnimatedTextInput
                  // type="numeric"
                  // borderWidth="1"
                  placeholder="engineDisplacement"
                  value={values.engineDisplacement}
                  keyboardType="numeric"
                  onChangeText={handleChange('engineDisplacement')}
                  onBlur={handleBlur('engineDisplacement')}
                />
              </HStack>
              {errors.engineDisplacement && touched.engineDisplacement && (
                <Box pl="3" mt="2">
                  <Text style={styles.errorText}>{errors.engineDisplacement}</Text>
                </Box>
              )}
            </Box>
            <Box mb="5" style={localStyles.BoxStyles}>
              <HStack style={localStyles.inputContainer2}>
                {/* <RenderLabel1 labelText={`Price`} /> */}

                <AnimatedTextInput
                  // type="numeric"
                  // borderWidth="1"
                  placeholder="carEnginePower"
                  value={values.carEnginePower}
                  keyboardType="numeric"
                  onChangeText={handleChange('carEnginePower')}
                  onBlur={handleBlur('carEnginePower')}
                />
              </HStack>
              {errors.carEnginePower && touched.carEnginePower && (
                <Box pl="3" mt="2">
                  <Text style={styles.errorText}>{errors.carEnginePower}</Text>
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

export default CarForm;
