/* eslint-disable react/self-closing-comp */
import React, {useState} from 'react';
import {Text, View} from 'react-native';

import {useNavigation, useRoute} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {useToast} from '../../components/ui/toast';
import LoadingSpinner from '../sharedComponents/LoadingSpinner';
import ZSafeAreaView from '../sharedComponents/ZSafeAreaView';
import ZHeader from '../sharedComponents/ZHeader';
import FullScreenSkeleton from '../sharedComponents/Skeleton/FullScreenSkeleton';
import {RootState} from '../../BrokerAppCore/redux/store/reducers';
import {useS3} from '../Context/S3Context';

const AppBaseContainer = (WrappedComponent, pageTitle, isHeader = true) => {
  // const [isPageSkeleton, setisPageSkeleton] = useState(false);

  return function BaseContainer(props) {
    const [isPageSkeleton, setisPageSkeleton] = useState(false);
    const [pageTitleState, setpageTitle] = useState(pageTitle);
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();
    const user = useSelector((state: RootState) => state.user.user);
    const color = useSelector(state => state.theme.theme);
    const route = useRoute();
    const toast = useToast();
    const [toastId, setToastId] = React.useState(0);
    const s3 = useS3();
    const toggleSkeletonoff = () => {
      setisPageSkeleton(false);
    };
    const toggleSkeletonOn = () => {
      setisPageSkeleton(true);
    };
    const setLoading = param => {
      setIsLoading(param);
    };
    const reframePageTitle = pageTitle => {
      setpageTitle(pageTitle);
    };
    const showToast = message => {
      if (!toast.isActive(toastId)) {
        const newId = Math.random();
        setToastId(newId);
        toast.show({
          id: newId,
          placement: 'bottom',
          duration: 3000,
          render: ({id}) => {
            const uniqueToastId = 'toast-' + id;
            return (
              <Toast nativeID={uniqueToastId} action="muted" variant="solid">
                <ToastDescription>{message}</ToastDescription>
              </Toast>
            );
          },
        });
      }
    };
    // console.log(pa)
    return (
      <ZSafeAreaView>
        {isHeader && <ZHeader title={pageTitleState} />}
        {isPageSkeleton && <FullScreenSkeleton></FullScreenSkeleton>}

        <WrappedComponent
          {...props} // Pass any other props to WrappedComponent
          isPageSkeleton={isPageSkeleton}
          toggleSkeletonoff={toggleSkeletonoff}
          toggleSkeletonOn={toggleSkeletonOn}
          setLoading={setLoading}
          navigation={navigation}
          user={user}
          s3={s3}
          toastMessage={showToast}
          color={color}
          route={route}
          toast={toast}
         
          pageTitle={reframePageTitle}
          isLoading={isLoading}></WrappedComponent>
        <LoadingSpinner isVisible={isLoading} />
      </ZSafeAreaView>
    );
  };

  //return BaseContainer;
};

export default AppBaseContainer;
