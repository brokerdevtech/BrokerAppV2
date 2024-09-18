import {Formik} from 'formik';
import {Box, HStack, Input, Select, Stack, Switch, View} from 'native-base';
import {useState} from 'react';
import {Dimensions, StyleSheet, Text} from 'react-native';
import * as Yup from 'yup';
import {colors, styles} from '../../themes';
import {moderateScale} from '../../common/constants';
import React from 'react';
import {Discount, Property, Verified, Virtual} from '../../assets/svgs';
import ZText from '../../components/common/ZText';
import LocalityTag from '../../components/LocalityTag';
import AnimatedTextInput from '../../components/common/AnimatedTextinput';

const genericvalidationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  Description: Yup.string().required('Description is required'),
  Location: Yup.object().required('Location is required'),
});
//const AVATAR_URL = "https://www.realmenrealstyle.com/wp-content/uploads/2023/03/The-Side-Part.jpg";
const devicewidth = Dimensions.get('window').width;

const GenericForm = ({formikRef}) => {
  const genericinitialValues = {
    title: '',
    Description: '',
    Location: undefined,
  };
  const [localities, setLocalities] = useState({});
  const handleSubmit = values => {
    //  console.log(JSON.stringify(values));

    // Handle form submission here
    if (formikRef.current) {
      // formikRef.current.submitForm();
    }
    // setLoading(true);
    // savePost(values, filter, imagesArray);
  };

  const onFiltersLocalityChange = Localitys => {
    //
    //

    formikRef.current.handleBlur('Location');
    formikRef.current.setFieldValue('Location', Localitys);
    setLocalities(Localitys);
  };

  const RenderLabel1 = ({labelText, width = '100%'}: any) => {
    return (
      <View style={{width: width, marginBottom: 8, flexDirection: 'row'}}>
        <ZText color={colors.black} type={'m16'} align="left">
          {labelText}
        </ZText>
        <Text style={{fontSize: 18, fontWeight: '600', color: 'red'}}> *</Text>
      </View>
    );
  };
  const RenderLabel = ({labelText, width = '100%'}: any) => {
    return (
      <View style={{width: width, marginBottom: 8}}>
        <ZText color={colors.black} type={'m16'} align="left">
          {labelText}
        </ZText>
      </View>
    );
  };
  return (
    <Formik
      innerRef={formikRef}
      initialValues={genericinitialValues}
      validationSchema={genericvalidationSchema}
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
            <Stack>
              <HStack style={localStyles.inputContainer}>
                {/* <RenderLabel1 labelText={`Title`} /> */}
                <AnimatedTextInput
                  placeholder="Title"
                  style={localStyles.inputBox}
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
            </Stack>
          </Box>

          <Box mb="5" style={localStyles.BoxStyles}>
            <Stack>
              <HStack style={localStyles.inputContainer}>
                {/* <RenderLabel1
                  style={{marginTop: 50}}
                  labelText={`Description`}
                /> */}

                <AnimatedTextInput
                  multiline={true}
                  // h={20}
                  placeholder="Description"
                  // style={localStyles.inputBox}
                  value={values.Description}
                  onChangeText={handleChange('Description')}
                  onBlur={handleBlur('Description')}
                />
              </HStack>
              {errors.Description && touched.Description && (
                <Box pl="3" mt="2">
                  <Text style={styles.errorText}>{errors.Description}</Text>
                </Box>
              )}
            </Stack>
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
        </View>
      )}
    </Formik>
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
    // borderBottomWidth: 1,
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
    borderColor: '#eee',
    justifyContent: 'center',
    ...styles.ph20,
    alignItems: 'center',
    justifyContent: 'center',
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
    paddingRight: 40,
    marginLeft: 20,
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

export default GenericForm;
