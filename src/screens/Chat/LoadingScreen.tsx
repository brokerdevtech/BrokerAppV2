import React from 'react';
import { ActivityIndicator, StyleSheet, useColorScheme, View } from 'react-native';
// import { useTheme } from 'stream-chat-react-native';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});

export const LoadingScreen: React.FC = () => {
  // const colorScheme = useColorScheme();
  // const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:'#FCFCFC',
        },
      ]}
    >
      <ActivityIndicator
        color='#000000'
        size='small'
      />
    </View>
  );
};
