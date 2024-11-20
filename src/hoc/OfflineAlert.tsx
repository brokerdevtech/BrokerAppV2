import React, {useEffect, useState, useMemo, useRef, useCallback} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import BottomSheet from '@gorhom/bottom-sheet';
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
import {Color} from '../styles/GlobalStyles';
const OfflineAlert = () => {
  const [isOffline, setIsOffline] = useState(false);
  const bottomSheetRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  // Bottom sheet snap points
  const snapPoints = useMemo(() => ['50%'], []);

  // Function to manually check connectivity
  const checkConnectivity = async () => {
    //console.log('checkConnectivity');
    const state = await NetInfo.fetch();
    console.log(state.isConnected);
    if (state.isConnected) {
      setIsOffline(false);
      bottomSheetRef.current?.close();
    } else {
      setIsOffline(true);
      bottomSheetRef.current?.present();
    }
  };
  const handleSheetChanges = useCallback(index => {
    setIsOpen(index >= 0);
    if (index == -1) {
      // onClose(selectedFilters);
    }
  }, []);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      // console.log('================state===========');
      // console.log(state);
      // console.log(bottomSheetRef.current);
      setIsOffline(!state.isConnected);
      if (!state.isConnected) {
        bottomSheetRef.current?.present();
      } else {
        bottomSheetRef.current?.close();
      }
   //   bottomSheetRef.current?.present();
    });

    return () => unsubscribe();
  }, []);
  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        pressBehavior="none"
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );
  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enableOverDrag={false}
      enablePanDownToClose={false}
      backdropComponent={renderBackdrop}
      // footerComponent={renderFooter}
      enableDynamicSizing={false}>
      <View style={styles.alertContainer}>
        <Image
          source={require('../assets/images/No_net.png')}
          style={{height: 150, width: 150, marginBottom: 20}}
        />
        <Text style={styles.alertText}>No Internet Connection</Text>
        <Text style={styles.subText}>
          Please check your internet settings and try again.
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={checkConnectivity}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
  },
  alertContainer: {
    padding: 20,
    alignItems: 'center',
  },
  alertText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff5252',
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: Color.primary, // Primary color
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default OfflineAlert;
