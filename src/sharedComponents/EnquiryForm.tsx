import React, {useCallback, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {Formik} from 'formik';
import * as Yup from 'yup'; // Import Yup for validation
import {Input, InputField} from '../../components/ui/input';
import {Color, GilroyFontFamily} from '../styles/GlobalStyles';
import ZSafeAreaView from './ZSafeAreaView';
import AppBaseContainer from '../hoc/AppBaseContainer_old';
import {useApiRequest} from '../hooks/useApiRequest';
import {AddEnquiryApi} from '../../BrokerAppCore/services/new/dashboardService';
import {useSelector} from 'react-redux';
import {RootState} from '@reduxjs/toolkit/dist/query';
import {useNavigation} from '@react-navigation/native';
import AnimatedTextInput from './AnimatedTextinput';
import ZText from './ZText';

const EnquiryForm = ({route, toastMessage}) => {
  const snapPoints = useMemo(() => ['70%'], []);
  const user = useSelector((state: RootState) => state.user.user);
  const navigation = useNavigation();
  const handleSheetChanges = useCallback(index => {
    //  console.log('handleSheetChanges', index);
  }, []);

  // console.log(user, 'prop');
  const [loading, setLoading] = React.useState(false);

  const {data, status, error, execute} = useApiRequest(
    AddEnquiryApi,
    setLoading,
  );
  const handleSubmit = async (values, {resetForm}) => {
    const userName = `${user.firstName} ${user.lastName}`;
    const request = {
      marqueePostId: route.params.item.id,
      userName: userName,
      emailAddress: values.email,
      contactNumber: values.contactNumber,
      description: values.description,
    };
    await execute(request);

    // resetForm();
  };

  useEffect(() => {
    if (status == 200) {
      toastMessage('EquiryAdded Successfully!');
      navigation.goBack();
    }
  }, [status]);
  // console.log(status);
  // Validation Schema
  const EnquirySchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    contactNumber: Yup.string()
      .matches(/^\d{10}$/, 'Contact number must be 10 digits')
      .required('Contact number is required'),
    description: Yup.string()
      .min(10, 'Description must be at least 10 characters')
      .required('Description is required'),
  });

  return (
    <>
      <ZSafeAreaView>
        <View style={{flex: 1}}>
          <Formik
            initialValues={{email: '', contactNumber: '', description: ''}}
            validationSchema={EnquirySchema}
            validateOnMount={true}
            onSubmit={handleSubmit}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              isValid,
            }) => (
              <ScrollView contentContainerStyle={styles.formContainer}>
                <View style={[styles.inputContainer, {alignItems: 'center'}]}>
                  <ZText type={'S18'} style={{textAlign: 'center'}}>
                    Please provide your details and we {'\n'} will get back to
                    you
                  </ZText>
                </View>

                <View style={styles.inputContainer}>
                  <AnimatedTextInput
                    placeholder="Email"
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                    keyboardType="email-address"
                  />
                  {errors.email && touched.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}
                </View>

                <View style={styles.inputContainer}>
                  <AnimatedTextInput
                    placeholder="Contact Number"
                    onChangeText={handleChange('contactNumber')}
                    onBlur={handleBlur('contactNumber')}
                    value={values.contactNumber}
                    keyboardType="numeric"
                  />
                  {errors.contactNumber && touched.contactNumber && (
                    <Text style={styles.errorText}>{errors.contactNumber}</Text>
                  )}
                </View>

                <View style={styles.inputContainer}>
                  <AnimatedTextInput
                    multiline={true}
                    placeholder="Description"
                    onChangeText={handleChange('description')}
                    onBlur={handleBlur('description')}
                    value={values.description}
                  />
                  {errors.description && touched.description && (
                    <Text style={styles.errorText}>{errors.description}</Text>
                  )}
                </View>

                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    !isValid ? styles.disabledButton : null,
                  ]}
                  disabled={!isValid}
                  onPress={handleSubmit}>
                  <Text style={styles.submitText}>Submit Enquiry</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </Formik>

          {/* Loader Overlay */}
        </View>
      </ZSafeAreaView>
      {loading && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color={Color.primary} />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 15,
    // Equal spacing between fields
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  input: {
    borderWidth: 0,
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    height: 43,
    paddingHorizontal: 10,
  },
  disabledButton: {
    backgroundColor: '#aaa',
  },
  errorText: {
    fontSize: 12,
    color: Color.primary,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: Color.primary,
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 25,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Ensure the loader is above other elements
  },
});

export default AppBaseContainer(EnquiryForm, 'Enquiry Form', true);
