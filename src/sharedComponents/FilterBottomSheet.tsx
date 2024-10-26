/* eslint-disable react-native/no-inline-styles */
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { View, TouchableOpacity,Text,StyleSheet, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { SetPostLikeUnLike } from '../../BrokerAppCore/services/new/dashboardService';
import { HStack } from '../../components/ui/hstack';
import { VStack } from '../../components/ui/vstack';
import { ArrowUpIcon, EditIcon, FavouriteIcon, Icon, MessageCircleIcon } from '../../components/ui/icon';
import { bookmark_icon, share_PIcon } from '../assets/svg';
import ZText from './ZText';
import {
    BottomSheetModal,
    BottomSheetView,
    BottomSheetModalProvider,
    BottomSheetBackdrop,
    BottomSheetFooter,
    BottomSheetTextInput,BottomSheetFlatList,
    BottomSheetScrollView,
  } from '@gorhom/bottom-sheet';
import { Box } from '../../components/ui/box';
import { Button, ButtonIcon } from '../../components/ui/button';
import { useApiPagingWithtotalRequest } from '../hooks/useApiPagingWithtotalRequest';
import { AddComment, GetCommentList, ReplyComment, SetPostCommentLikeUnLike } from '../../BrokerAppCore/services/new/postServices';
import LoadingSpinner from './LoadingSpinner';
import ZAvatarInitials from './ZAvatarInitials';
import moment from 'moment';
import TextWithPermissionCheck from './TextWithPermissionCheck';
import { useSelector } from 'react-redux';
import { RootState } from '../../BrokerAppCore/redux/store/reducers';
import { moderateScale, PermissionKey } from '../config/constants';
import TouchableOpacityWithPermissionCheck from './TouchableOpacityWithPermissionCheck';
import {Like, UnLike, Send, CloseIcon} from '../assets/svg';
import { Toast, ToastDescription, ToastTitle, useToast } from '../../components/ui/toast';
import { useNavigation } from '@react-navigation/native';
import ReplyCommentList from './ReplyCommentList';
import RealEstateFilterScreen from './AppFilters/RealEstateFilterScreen';
import CarFilterScreen from './AppFilters/CarFilterScreen';

const FilterBottomSheet = forwardRef(({ User, listTypeData,userPermissions,PopUPFilter,onClose }, ref) => {
  const navigation = useNavigation();
    const bottomSheetModalRef = useRef(null);
    const snapPoints = useMemo(() => ['90%'], []);

    const [Reset, setReset] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const toast = useToast();
    const [toastId, setToastId] = React.useState(0);
    const [isInfiniteLoading, setInfiniteLoading] = useState(false);

    const [selectedFilters, setSelectedFilters] = useState({});

    const showNewToast = (NewToasttext) => {
        const newId = Math.random();
        setToastId(newId);
        toast.show({
          id: newId,
          placement: 'top',
          duration: 3000,
          render: ({ id }) => {
            const uniqueToastId = 'toast-' + id;
            return (
              <Toast nativeID={uniqueToastId} action="muted" variant="solid">

                <ToastDescription>
                 {NewToasttext}
                </ToastDescription>
              </Toast>
            );
          },
        });
      };


      useEffect(() => {
    //   console.log("===========callCommentList===========")
    //   console.log(postItem)
      //  callCommentList();
    
      }, [Reset ,isOpen]);

  



      const renderBackdrop = useCallback(
        (props) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
            />
        ),
        []
    );

    useImperativeHandle(ref, () => ({
        open: () => {

          bottomSheetModalRef.current?.present();

        },
      }));

      const handleSheetChanges = useCallback((index) => {
        console.log('handleSheetChanges', index);
        setIsOpen(index >= 0);
        if(index ==-1)
        {
          onClose(selectedFilters);
        }
      }, [selectedFilters]);


      const onApply = (item) => {

     
        setSelectedFilters(item);
        bottomSheetModalRef.current?.dismiss();
      }












      return (
        <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enableOverDrag={false}
        enablePanDownToClose={true}
         backdropComponent={renderBackdrop}
         enableHandlePanningGesture={false}
        // footerComponent={renderFooter}
        enableDynamicSizing={false}

        >
            {isInfiniteLoading && (
            <View style={styles.spinnerView}>
              <ActivityIndicator size="large" color="blue" />
            </View>
          )}

<VStack  style={styles.sheetContent}>
     
{listTypeData === 'RealEstate' && (
  <RealEstateFilterScreen PopUPFilter={PopUPFilter} onApply={onApply} />
)}
{listTypeData === 'Car' && (
  <CarFilterScreen PopUPFilter={PopUPFilter} onApply={onApply} />
)}
    
        </VStack>
      
        </BottomSheetModal>
      );
    });

    const styles = StyleSheet.create({
        spinnerView: {
            position: 'absolute',
            zIndex: 1,
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F5FCFF88',
          },
        textInput: {
            alignSelf: 'stretch',
            marginHorizontal: 12,
            marginBottom: 12,
            padding: 12,
            borderRadius: 12,
            backgroundColor: 'grey',
            color: 'white',
            textAlign: 'center',
          },
          bottomcontainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f5f5f5',

          },
        container: {
          flex: 1,
          padding: 24,
          justifyContent: 'center',
          backgroundColor: 'grey',
        },  sheetContent: {
          flex: 1,
          width:'100%',

        },
        contentContainer: {
         // paddingBottom: 20,
        },
      //   contentContainer: {
      //     height:"90%",
      // //     flex: 1,
      // //   //  alignItems: 'center',  // or 'center'
      // //    height:'100%',
      // //  //  backgroundColor: 'red',
      //  paddingBottom: 20,
      //  marginBottom:200
      //   },
        footerContainer: {
        minHeight:40,
            padding: 12,

borderTopLeftRadius:12,
borderTopRightRadius:12,
            borderTopWidth: 1,                // Adds a top border
            borderTopColor: '#ccc',           // Sets the top border color
            backgroundColor: 'white',         // Sets background color
            shadowColor: '#000',              // iOS shadow color
            shadowOffset: { width: 0, height: -2 },  // iOS shadow offset for top shadow
            shadowOpacity: 0.2,               // iOS shadow opacity
            shadowRadius: 4,                  // iOS shadow blur
            elevation: 5,

          },
          footerText: {
            textAlign: 'center',
            color: 'white',
            fontWeight: '800',
          },
    ////////////////////////////////////////////////////////////////
    mainContainer: {
      flexDirection: 'row',
      width: '100%',
      marginBottom: 20,
      alignItems: 'flex-start',
      verticalAlign: 'top',
      paddingHorizontal: 20,
    },
      profileWrap: {
      width: moderateScale(50),
      height: moderateScale(50),
      borderRadius: moderateScale(25),
      verticalAlign: 'top',
    marginRight:5,
    },
      profileImage: {
      width: moderateScale(20),
      height: moderateScale(20),
      borderRadius: moderateScale(20),
      verticalAlign: 'top',
    },


    });

    export default FilterBottomSheet;
