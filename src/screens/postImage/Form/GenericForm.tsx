import {Formik} from 'formik';

import {useState} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import * as Yup from 'yup';
import {colors, styles} from '../../../themes';
import {moderateScale} from '../../../config/constants';
import React from 'react';

import ZText from '../../../sharedComponents/ZText';
import LocalityTag from '../../../sharedComponents/LocalityTag';
import AnimatedTextInput from '../../../sharedComponents/AnimatedTextinput';
import {Box} from '../../../../components/ui/box';
import {HStack} from '../../../../components/ui/hstack';

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
    if (formikRef.current) {
      // formikRef.current.submitForm();
    }
  };

  const onFiltersLocalityChange = Localitys => {
    //
    //

    formikRef.current.handleBlur('Location');
    formikRef.current.setFieldValue('Location', Localitys);
    setLocalities(Localitys);
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

  inputContainer: {
    flexDirection: 'column',
    textAlign: 'left',
  },

  BoxStyles: {
    flexDirection: 'column',
    paddingTop: 10,
    marginBottom: 10,
    borderColor: '#BDBDBD',
    justifyContent: 'space-between',
  },

  containerView: {
    width: '100%',

    ...styles.ph20,
  },
});

export default GenericForm;
