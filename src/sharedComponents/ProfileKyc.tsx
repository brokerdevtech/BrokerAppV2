import React, {useEffect, useState} from 'react';

import {ScrollView, StyleSheet} from 'react-native';

import ZText from './ZText';
import {useFocusEffect} from '@react-navigation/native';
import {
  getProfile,
  UpdateProfile,
} from '../../BrokerAppCore/services/new/profileServices';
import {getList, updateNestedObject} from '../utils/helpers';
import {Box} from '../../components/ui/box';
import FileUpload from './FileUpload';
import AppBaseContainer from '../hoc/AppBaseContainer_old';
import {styles} from '../themes';
import {useApiRequest} from '../hooks/useApiRequest';

const ProfileKyc: React.FC = ({
  isPageSkeleton,
  toast,
  toggleSkeletonoff,
  toggleSkeletonOn,
  setLoading,
  navigation,
  user,
  color,
  toastMessage,
  route,
}) => {
  const [panName, setPanName] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [panCardAttachment, setPanCardAttachment] = useState(null);
  const [visitingCardAttachment, setVisitingCardAttachment] = useState(null);
  const [addressProofAttachment, setAddressProofAttachment] = useState(null);
  const [reraRegistrationAttachment, setReraRegistrationAttachment] =
    useState(null);
  const [certifiedBroker, setCertifiedBroker] = useState(false);
  const [Profiledata, setProfiledata] = useState(route.params?.data || {});
  const [ProfileDataRest, setProfileDataRest] = useState(false);
  const {
    data: profiledata,
    status: profilestatus,
    error: profileerror,
    execute: profileexecute,
  } = useApiRequest(getProfile, setLoading);
  const {
    data: profileUpdatedata,
    status: profileUpdatestatus,
    error: profileUpdateerror,
    execute: profileUpdateexecute,
  } = useApiRequest(UpdateProfile, setLoading);
  useFocusEffect(
    React.useCallback(() => {
      //   toggleSkeletonOn();
      const getUserProfile = async () => {
        try {
          await profileexecute(user.userId);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      getUserProfile();

      return () => {
        // Code to execute when the screen loses focus (optional)
      };
    }, [ProfileDataRest]),
  );
  useEffect(() => {
    if (profilestatus == 200) {
      setProfiledata(profiledata.data);
    }
  }, [profilestatus]);
  useEffect(() => {
    if (profileUpdatestatus === 200) {
      toastMessage('Document upoaded');
      setProfiledata(profileUpdatedata.data);

    }
  }, [profileUpdatestatus]);
  const handleSubmit = async (docId, fieldName, successMessage) => {
    const updateObj = {[fieldName]: docId};
    const deletions = [
      'roles',
      'industries',
      'specializations',
      'userLocations',
    ];
    let Result = updateNestedObject(Profiledata, updateObj, deletions);

    Result = {
      ...Result,
      industry: getList(Profiledata.industries),
      specialization: getList(Profiledata.specializations),
      cityName: Profiledata.location.cityName,
      stateName: Profiledata.location.stateName,
      countryName: Profiledata.location.countryName,
      userLocation: [],
    };
    delete Result['location'];
    delete Result['officeLocation'];
    delete Result['userPermissions'];

    await profileUpdateexecute(Result);
    setProfiledata({...Profiledata, [fieldName]: docId});
  };

  return (
    <ScrollView
      bounces={false}
      showsVerticalScrollIndicator={false}
      style={localStyles.root}>
      <FileUpload
        id="1"
        Bucket="kycbrokerapp"
        DisplayText="Upload PAN Number"
        setLoading={setLoading}
        OnUpload={docId =>
          handleSubmit(docId, 'uidNumberBlob', 'PAN Uploaded Successfully')
        }
        FileValue={Profiledata.uidNumberBlob}
        islocked={true}
        FileValueText="PAN Number is Uploaded "
      />

      <FileUpload
        id="2"
        Bucket="kycbrokerapp"
        DisplayText="Upload Address Proof"
        setLoading={setLoading}
        OnUpload={docId =>
          handleSubmit(
            docId,
            'addressProofBlob',
            'Address Proof Uploaded Successfully',
          )
        }
        FileValue={Profiledata.addressProofBlob}
        islocked={true}
        FileValueText="Address Proof is Uploaded "
      />

      <FileUpload
        id="3"
        Bucket="kycbrokerapp"
        DisplayText="Upload Rera Registration"
        setLoading={setLoading}
        OnUpload={docId =>
          handleSubmit(
            docId,
            'reraRegistrationBlob',
            'Rera Registration Uploaded Successfully',
          )
        }
        FileValue={Profiledata.reraRegistrationBlob}
        islocked={true}
        FileValueText="Rera Registration is Uploaded "
      />

      <FileUpload
        id="4"
        DisplayText="Upload visiting Card"
        FileValue={Profiledata.reraRegistrationBlob}
        FileValueText={Profiledata.reraRegistrationBlob}
        setLoading={setLoading}
        islocked={false}
        OnUpload={docId =>
          handleSubmit(
            docId,
            'visitingCardBlob',
            'Visiting Card Uploaded Successfully',
          )
        }
      />

      <FileUpload
        id="5"
        DisplayText="Upload Company Logo"
        FileValue={Profiledata.visitingCardBlob}
        FileValueText={Profiledata.visitingCardBlob}
        islocked={false}
        setLoading={setLoading}
        OnUpload={docId =>
          handleSubmit(
            docId,
            'companyLogoBlob',
            'Company Logo Uploaded Successfully',
          )
        }
      />

      {(Profiledata.uidNumberBlob != '' ||
        Profiledata.addressProofBlob != '' ||
        Profiledata.reraRegistrationBlob != '') && (
        <Box>
          <ZText type={'M14'} color={'red'}>
            If you want to upload your PAN number, address proof, or RERA
            registration again, please contact the admin.
          </ZText>
        </Box>
      )}
    </ScrollView>
  );
};

export default AppBaseContainer(ProfileKyc, 'KYC');

const localStyles = StyleSheet.create({
  root: {
    ...styles.flex,
    ...styles.ph20,
    ...styles.mb20,
  },
});
