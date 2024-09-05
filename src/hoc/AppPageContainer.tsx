import { forwardRef, useImperativeHandle, useState } from "react";
import { ActivityIndicator, View } from "react-native";


const AppPageContainer = forwardRef(({ children }, ref) => {
  
    const [isLoading, setIsLoading] = useState(false);

    useImperativeHandle(ref, () => ({
      SetLoader: (value:boolean) => setIsLoading(value),
    }));
    return (
        <View>
          {/* Loading indicator */}
          {isLoading && (
             <ActivityIndicator size="large" color="#0000ff" />
          )}
    
         
          {children}
        </View>
      );
    });
    
    export default AppPageContainer;