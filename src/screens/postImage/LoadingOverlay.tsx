import React, {useState} from 'react';
import {View, ActivityIndicator, Modal, StyleSheet, Text} from 'react-native';

const LoadingOverlay = ({isVisible}) => {
  return (
    <Modal
      transparent={true}
      animationType="none"
      visible={isVisible}
      onRequestClose={() => {}}>
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
});

export default LoadingOverlay;
