import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetFooter,
  BottomSheetTextInput,
  BottomSheetFlatList,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {useApiPagingWithtotalRequest} from '@/hooks/useApiPagingWithtotalRequest';
import {useNavigation} from '@react-navigation/native';
import {GetCommentList} from '../../BrokerAppCore/services/new/postServices';
import {Box} from '../../components/ui/box';
import {useToast, Toast, ToastDescription} from '../../components/ui/toast';
import {VStack} from '../../components/ui/vstack';
import {Color} from '../styles/GlobalStyles';
import {useApiRequest} from '../hooks/useApiRequest';
import {reportApi} from '../../BrokerAppCore/services/new/report';

const REPORT_REASONS = [
  'Spam',
  'Harassment',
  'Hate Speech',
  'Misinformation',
  'Violence',
  'Nudity',
  'Scam/Fraud',
  'Other',
];

const ReportScreen = forwardRef(({postItem, screenFrom, onClose}, ref) => {
  const bottomSheetModalRef = useRef(null);
  const [selectedReason, setSelectedReason] = useState(null);
  const snapPoints = useMemo(() => ['70%'], []);
  const [toastId, setToastId] = React.useState(0);

  const toast = useToast();
  const [loading, setLoading] = React.useState(false);
  const handleSelectReason = reason => {
    setSelectedReason(reason === selectedReason ? null : reason);
  };
  const {data, status, error, execute} = useApiRequest(reportApi, setLoading);
  //   const handleSendReport = () => {
  //     console.log('Report submitted for:', postItem, 'Reason:', selectedReason);
  //   };
  const postRequest = {
    postId: postItem?.postId,
    categoryId: postItem?.categoryId,
    reportReason: selectedReason,
  };
  const userRequest = {
    reportedUserId: postItem,
    reportReason: selectedReason,
  };
  const Urltype =
    screenFrom === 'List' ? '/Post/ReportPost' : '/Users/ReportUser';
  const apiRequest = screenFrom === 'List' ? postRequest : userRequest;
  const handleSendReport = async () => {
    // console.log(values, 'values');

    setLoading(true);
    await execute(Urltype, apiRequest);

    bottomSheetModalRef.current?.close();
    onClose?.();
  };

  useImperativeHandle(ref, () => ({
    open: () => {
      bottomSheetModalRef.current?.present();
    },
  }));

  useEffect(() => {
    if (status === 200) {
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
                <ToastDescription>{data.statusMessage}</ToastDescription>
              </Toast>
            );
          },
        });
      }
    }
  }, [status, data]);
  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      enableOverDrag={false}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      enableHandlePanningGesture={false}
      enableDynamicSizing={false}>
      <BottomSheetScrollView>
        <View style={styles.container}>
          <Text style={styles.header}>
            Report {screenFrom === 'List' ? `Post` : `User`}
          </Text>
          <FlatList
            data={REPORT_REASONS}
            keyExtractor={item => item}
            renderItem={({item}) => (
              <TouchableOpacity
                style={[
                  styles.reasonButton,
                  selectedReason === item && styles.selectedReason,
                ]}
                onPress={() => handleSelectReason(item)}>
                <Text
                  style={
                    selectedReason === item
                      ? styles.selectedText
                      : styles.reasonText
                  }>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              selectedReason
                ? styles.sendButtonEnabled
                : styles.sendButtonDisabled,
            ]}
            disabled={!selectedReason}
            onPress={handleSendReport}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  reasonButton: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedReason: {
    backgroundColor: Color.primary,
    borderColor: '#fff',
  },
  reasonText: {
    fontSize: 16,
  },
  selectedText: {
    fontSize: 16,
    color: '#fff',
  },
  sendButton: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  sendButtonEnabled: {
    backgroundColor: Color.primary,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default ReportScreen;
