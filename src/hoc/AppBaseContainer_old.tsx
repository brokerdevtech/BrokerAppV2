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
import {RootState} from '../../BrokerAppcore/redux/store/reducers';
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
          color={color}
          route={route}
          toast={toast}
          pageTitle={reframePageTitle}></WrappedComponent>
        <LoadingSpinner isVisible={isLoading} />
      </ZSafeAreaView>
    );
  };

  //return BaseContainer;
};

export default AppBaseContainer;
