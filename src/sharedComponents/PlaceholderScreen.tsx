import React, { useCallback, useEffect } from 'react';
import { View, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { GetDashboardData } from '../../BrokerAppCore/services/authService';
import { RootState } from '../../BrokerAppCore/redux/store/reducers';
import store from '../../BrokerAppCore/redux/store';
import { setDashboard } from '../../BrokerAppCore/redux/store/Dashboard/dashboardSlice';
import { useFocusEffect } from '@react-navigation/native';
import ZText from './ZText';


const PlaceholderScreen = () => {
    const user = useSelector((state: RootState) => state.user.user);
    const callDashboardData = async () => {
        const results = await Promise.allSettled([
          GetDashboardData(user.userId),
        ]);
  
        const [dashboardData] = results.map(result =>
          result.status === 'fulfilled' ? result.value : null
        );
  
        if (dashboardData?.data) {
          store.dispatch(setDashboard(dashboardData.data));
        }
      };
  useFocusEffect(
     useCallback(() => {
       let isActive = true;
  
       callDashboardData();
       return () => {
         isActive = false;
       };
     }, []),
   );

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Image
        source={require('../assets/images/ComingSoon.png')}
        style={{ height: 150, width: 150, marginBottom: 20 }}
      />
      <ZText type="S20" style={{ marginBottom: 20 }}>
        Coming Soon
      </ZText>
      <ZText type="R14">Are you ready to get something new from us?</ZText>
    </View>
  );
};

export default PlaceholderScreen;
