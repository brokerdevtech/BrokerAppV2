/* eslint-disable react/self-closing-comp */
import React, { useState, useCallback, useMemo } from 'react';
import { Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Toast, ToastDescription, useToast } from '../../components/ui/toast';
import LoadingSpinner from '../sharedComponents/LoadingSpinner';
import ZSafeAreaView from '../sharedComponents/ZSafeAreaView';
import ZHeader from '../sharedComponents/ZHeader';
import FullScreenSkeleton from '../sharedComponents/Skeleton/FullScreenSkeleton';
import { RootState } from '../../BrokerAppCore/redux/store/reducers';
import { useS3 } from '../Context/S3Context';

const AppBaseContainer = (WrappedComponent, pageTitle, isHeader = true, isSearch = false) => {
  const MemoizedWrappedComponent = React.memo(WrappedComponent);

  return function BaseContainer(props) {
    const [isPageSkeleton, setisPageSkeleton] = useState(false);
    const [pageTitleState, setpageTitle] = useState(pageTitle);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    const navigation = useNavigation();
    const user = useSelector((state: RootState) => state.user.user);
    const color = useSelector(state => state.theme.theme);
    const route = useRoute();
    const toast = useToast();
    const [toastId, setToastId] = useState(0);
    const s3 = useS3();

    const toggleSkeletonoff = useCallback(() => {
      setisPageSkeleton(false);
    }, []);

    const toggleSkeletonOn = useCallback(() => {
      setisPageSkeleton(true);
    }, []);

    const setLoading = useCallback((param) => {
      setIsLoading(param);
    }, []);

    const reframePageTitle = useCallback((pageTitle) => {
      setpageTitle(pageTitle);
    }, []);

    const handleSearch = useCallback((searchText) => {
      setSearchKeyword(searchText);
    }, []);

    const showToast = useCallback((message) => {
      if (!toast.isActive(toastId)) {
        const newId = Math.random();
        setToastId(newId);
        toast.show({
          id: newId,
          placement: 'bottom',
          duration: 3000,
          render: ({ id }) => {
            const uniqueToastId = 'toast-' + id;
            return (
              <Toast nativeID={uniqueToastId} action="muted" variant="solid">
                <ToastDescription>{message}</ToastDescription>
              </Toast>
            );
          },
        });
      }
    }, [toast, toastId]);

    return (
      <ZSafeAreaView>
        {isHeader && <ZHeader title={pageTitleState} isSearch={isSearch} handleSearch={handleSearch} />}
        {isPageSkeleton && <FullScreenSkeleton></FullScreenSkeleton>}
        
        <MemoizedWrappedComponent
          {...props}
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
          searchKeyword={searchKeyword}
          pageTitle={reframePageTitle}
          isLoading={isLoading}
        />
        
        <LoadingSpinner isVisible={isLoading} />
      </ZSafeAreaView>
    );
  };
};

export default AppBaseContainer;
