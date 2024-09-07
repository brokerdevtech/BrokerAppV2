import { Box } from "@/components/ui/box";
import { forwardRef, useImperativeHandle, useState } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import Back from '../assets/svg/back.svg';
import ZSafeAreaView from "../sharedComponents/ZSafeAreaView";
import ZHeader from "../sharedComponents/ZHeader";
import FullScreenSkeleton from "../sharedComponents/Skeleton/FullScreenSkeleton";
const AppPageContainer = forwardRef(({ children }, ref) => {
  const [isLoading, setIsLoading] = useState(true);

  useImperativeHandle(ref, () => ({
    setLoader: (value: boolean) => setIsLoading(value),
  }));

  return (
    <ZSafeAreaView>
    <ZHeader title={'Filters'}  />
    <FullScreenSkeleton></FullScreenSkeleton>
    <Box style={{ flex: 1 ,flexDirection:'row' }}>
   
    
     
      {children}
    </Box>
    </ZSafeAreaView>
  );
});

const styles = StyleSheet.create({
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,  // This will make the view cover the entire screen
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Semi-transparent backdrop
  },
});

export default AppPageContainer;
