import React, {useCallback, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
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
    <ZSafeAreaView>
      <View
        style={{
          paddingHorizontal: 20,
          flex: 1,
          justifyContent: 'center',
        }}>
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
            <ScrollView>
              <Text style={styles.label}>Email</Text>
              <Input style={styles.input}>
                <InputField
                  type="text"
                  placeholder="Enter your email"
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </Input>
              {errors.email && touched.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}

              <Text style={styles.label}>Contact Number</Text>
              <Input style={styles.input}>
                <InputField
                  type="text"
                  placeholder="Enter your contact number"
                  onChangeText={handleChange('contactNumber')}
                  onBlur={handleBlur('contactNumber')}
                  value={values.contactNumber}
                  keyboardType="phone-pad"
                />
              </Input>
              {errors.contactNumber && touched.contactNumber && (
                <Text style={styles.errorText}>{errors.contactNumber}</Text>
              )}

              <Text style={styles.label}>Description</Text>
              <Input style={[styles.input, {height: 100}]}>
                <InputField
                  type="text"
                  placeholder="Enter a brief description"
                  onChangeText={handleChange('description')}
                  onBlur={handleBlur('description')}
                  value={values.description}
                  multiline={true}
                />
              </Input>
              {errors.description && touched.description && (
                <Text style={styles.errorText}>{errors.description}</Text>
              )}

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
      </View>
    </ZSafeAreaView>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginBottom: 10,
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
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AppBaseContainer(EnquiryForm, 'Enquiry Form', true);
