import React, {useState} from 'react';

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

const ProfileKyc: React.FC = ({
  isPageSkeleton,
  toast,
  toggleSkeletonoff,
  toggleSkeletonOn,
  setLoading,
  navigation,
  user,
  color,
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

  useFocusEffect(
    React.useCallback(() => {
      toggleSkeletonOn();
      const getUserProfile = async () => {
        try {
          const result = await getProfile(user.userId);

          setProfiledata(result.data);
          // const performStorage = await  performStorageOperation();
          // console.log(performStorage);
          // if(performStorage==false){
          //   navigation.goBack();
          // }
          toggleSkeletonoff();
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

  // const route = useRoute();
  // const user = useSelector((state: RootState) => state.user.user);
  // const Profiledata = route.params?.data || {};

  // useEffect(() => {
  //   toggleSkeletonOn();
  //   const delay = async () => {
  //     // Delay for 3 seconds
  //     await new Promise(resolve => setTimeout(resolve, 3000));

  //     // After the delay, update the message
  //     toggleSkeletonoff();
  //     setLoading(true);
  //     await new Promise(resolve => setTimeout(resolve, 3000));
  //     setLoading(false);
  //   };
  //   delay();

  // }, []);

  const handleSubmit = async docId => {
    const updateObj = {uidNumberBlob: docId};

    const deletions = [
      'roles',
      'industries',
      'specializations',
      'userLocations',
    ];
    let Result: any = updateNestedObject(Profiledata, updateObj, deletions);

    Result = {
      ...Result,
      industry: getList(Profiledata.industries),
      specialization: getList(Profiledata.specializations),
      userLocation: [],
    };

    setLoading(true);
    let k = await UpdateProfile(Result);
    setProfiledata({...Profiledata, uidNumberBlob: docId});
    setLoading(false);
    // Handle form submission here
    // You can access panName, panNumber, and attachments from state
    // You can also access certifiedBroker to check if the user wants to be a certified broker
  };
  const handleSubmitPANNumber = async docId => {
    const updateObj = {uidNumberBlob: docId};

    const deletions = [
      'roles',
      'industries',
      'specializations',
      'userLocations',
    ];
    let Result: any = updateNestedObject(Profiledata, updateObj, deletions);

    Result = {
      ...Result,
      industry: getList(Profiledata.industries),
      specialization: getList(Profiledata.specializations),
      userLocation: [],
    };

    setLoading(true);
    let k = await UpdateProfile(Result);
    setProfiledata({...Profiledata, uidNumberBlob: docId});
    setLoading(false);
    await toast.closeAll();
    if (!toast.isActive(2)) {
      toast.show({
        id: 2,
        render: () => {
          return (
            <Box bg="emerald.500" px="2" py="1" rounded="sm" mb={5}>
              Document uploaded successfully
            </Box>
          );
        },
      });
    }
    // Handle form submission here
    // You can access panName, panNumber, and attachments from state
    // You can also access certifiedBroker to check if the user wants to be a certified broker
  };
  const handleSubmitAddressProof = async docId => {
    const updateObj = {addressProofBlob: docId};

    const deletions = [
      'roles',
      'industries',
      'specializations',
      'userLocations',
    ];
    let Result: any = updateNestedObject(Profiledata, updateObj, deletions);

    Result = {
      ...Result,
      industry: getList(Profiledata.industries),
      specialization: getList(Profiledata.specializations),
      userLocation: [],
    };

    setLoading(true);
    let k = await UpdateProfile(Result);
    setProfiledata({...Profiledata, addressProofBlob: docId});
    setLoading(false);
    // toast.closeAll();
    await toast.closeAll();
    if (!toast.isActive(2)) {
      toast.show({
        id: 2,
        render: () => {
          return (
            <Box bg="emerald.500" px="2" py="1" rounded="sm" mb={5}>
              Document uploaded successfully
            </Box>
          );
        },
      });
    }
    // Handle form submission here
    // You can access panName, panNumber, and attachments from state
    // You can also access certifiedBroker to check if the user wants to be a certified broker
  };
  const handleSubmitReraRegistration = async docId => {
    const updateObj = {reraRegistrationBlob: docId};

    const deletions = [
      'roles',
      'industries',
      'specializations',
      'userLocations',
    ];
    let Result: any = updateNestedObject(Profiledata, updateObj, deletions);

    Result = {
      ...Result,
      industry: getList(Profiledata.industries),
      specialization: getList(Profiledata.specializations),
      userLocation: [],
    };

    setLoading(true);
    let k = await UpdateProfile(Result);
    setProfiledata({...Profiledata, reraRegistrationBlob: docId});
    setLoading(false);
    // toast.closeAll();
    await toast.closeAll();
    if (!toast.isActive(2)) {
      toast.show({
        id: 2,
        render: () => {
          return (
            <Box bg="emerald.500" px="2" py="1" rounded="sm" mb={5}>
              Document uploaded successfully
            </Box>
          );
        },
      });
    } // Handle form submission here
    // You can access panName, panNumber, and attachments from state
    // You can also access certifiedBroker to check if the user wants to be a certified broker
  };
  const handleSubmitcompanyLogo = async docId => {
    const updateObj = {companyLogoBlob: docId};

    const deletions = [
      'roles',
      'industries',
      'specializations',
      'userLocations',
    ];
    let Result: any = updateNestedObject(Profiledata, updateObj, deletions);

    Result = {
      ...Result,
      industry: getList(Profiledata.industries),
      specialization: getList(Profiledata.specializations),
      userLocation: [],
    };

    setLoading(true);
    let k = await UpdateProfile(Result);
    setProfiledata({...Profiledata, companyLogoBlob: docId});
    setLoading(false);
    // toast.closeAll();
    await toast.closeAll();
    if (!toast.isActive(2)) {
      toast.show({
        id: 2,
        render: () => {
          return (
            <Box bg="emerald.500" px="2" py="1" rounded="sm" mb={5}>
              Document uploaded successfully
            </Box>
          );
        },
      });
    }
    // Handle form submission here
    // You can access panName, panNumber, and attachments from state
    // You can also access certifiedBroker to check if the user wants to be a certified broker
  };
  const handleSubmitvisitingCard = async docId => {
    const updateObj = {visitingCardBlob: docId};

    const deletions = [
      'roles',
      'industries',
      'specializations',
      'userLocations',
    ];
    let Result: any = updateNestedObject(Profiledata, updateObj, deletions);

    Result = {
      ...Result,
      industry: getList(Profiledata.industries),
      specialization: getList(Profiledata.specializations),
      userLocation: [],
    };

    setLoading(true);
    let k = await UpdateProfile(Result);
    setProfiledata({...Profiledata, visitingCardBlob: docId});
    setLoading(false);
    // toast.closeAll();
    await toast.closeAll();
    if (!toast.isActive(2)) {
      toast.show({
        id: 2,
        render: () => {
          return (
            <Box bg="emerald.500" px="2" py="1" rounded="sm" mb={5}>
              Document uploaded successfully
            </Box>
          );
        },
      });
    }

    // Handle form submission here
    // You can access panName, panNumber, and attachments from state
    // You can also access certifiedBroker to check if the user wants to be a certified broker
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
        OnUpload={handleSubmitPANNumber}
        FileValue={Profiledata.uidNumberBlob}
        islocked={true}
        FileValueText="PAN Number is Uploaded "></FileUpload>

      <FileUpload
        id="2"
        Bucket="kycbrokerapp"
        DisplayText="Upload Address Proof"
        setLoading={setLoading}
        OnUpload={handleSubmitAddressProof}
        FileValue={Profiledata.addressProofBlob}
        islocked={true}
        FileValueText="Address Proof is Uploaded "></FileUpload>

      <FileUpload
        id="3"
        Bucket="kycbrokerapp"
        DisplayText="Upload Rera Registration"
        setLoading={setLoading}
        OnUpload={handleSubmitReraRegistration}
        FileValue={Profiledata.reraRegistrationBlob}
        islocked={true}
        FileValueText="Rera Registration is Uploaded "></FileUpload>

      <FileUpload
        id="4"
        DisplayText="Upload visiting Card"
        FileValue={Profiledata.reraRegistrationBlob}
        FileValueText={Profiledata.reraRegistrationBlob}
        setLoading={setLoading}
        islocked={false}
        OnUpload={handleSubmitvisitingCard}></FileUpload>

      <FileUpload
        id="5"
        DisplayText="Upload Company Logo"
        FileValue={Profiledata.visitingCardBlob}
        FileValueText={Profiledata.visitingCardBlob}
        islocked={false}
        setLoading={setLoading}
        OnUpload={handleSubmitcompanyLogo}></FileUpload>

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
