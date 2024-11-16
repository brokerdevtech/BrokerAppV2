/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-unreachable */
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Image,
} from 'react-native';
import ZText from '../sharedComponents/ZText';
import {useNavigation} from '@react-navigation/native';
import {styles} from '../themes';
import {getHeight, moderateScale, PermissionKey} from '../config/constants';
import {checkPermission, checkPlatform} from '../utils/helpers';
import {useSelector} from 'react-redux';
import {RootState} from '@reduxjs/toolkit/query';

import {
  Add_Icon,
  Home,
  Home_Fill,
  Profile,
  Profile_Fill,
  Network,
  Search,
  SearchFill,
  NetworkFill,
  Person,
  Home_tab_icon,
  Heart_tab_icon,
  Reel_tab_icon,
  Calender_tab_icon,
  Plus_Icon,
  ComingSoon,
} from '../assets/svg';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import TouchableOpacityWithPermissionCheck from '../sharedComponents/TouchableOpacityWithPermissionCheck';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import DashboradScreen from '../screens/DashboradScreen';
import ChooseImage from '../screens/postImage/ChooseImage';
import {Color} from '../styles/GlobalStyles';
import AllSkeletonComponent from '../sharedComponents/Skeleton/AllSkeletonComponent';
import {Toast, ToastDescription, useToast} from '../../components/ui/toast';

const Tab = createBottomTabNavigator();

const Stack = createStackNavigator();

const HomePageStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        options={{headerShown: false}}
        component={DashboradScreen}
      />
    </Stack.Navigator>
  );
};
const PlaceholderScreen = () => (
  <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
    <Image
      source={require('../assets/images/ComingSoon.png')}
      style={{height: 150, width: 150, marginBottom: 20}}
    />
    <ZText type={'S20'} style={{marginBottom: 20}}>
      Coming Soon
    </ZText>
    <ZText type={'R14'}>Are you Ready to get something new from us ?</ZText>
  </View>
);
const AppTab: React.FC = () => {
  const navigation = useNavigation();
  const userP = useSelector((state: RootState) => state.user.user);
  const toast = useToast();
  console.log(require('../assets/images/ComingSoon.png'));
  const [toastId, setToastId] = React.useState(0);
  const userPermissions = useSelector(
    (state: RootState) => state.user.user?.userPermissions,
  );
  const permissionGranted = checkPermission(
    userPermissions,
    PermissionKey.AllowAddPost,
  );
  const colors = useSelector((state: RootState) => state.theme.theme);
  const TabText = ({text, focused, icon}) => (
    <View style={localStyles.tabViewContainer}>
      {icon}
      {!!text && (
        <ZText
          type={focused ? 'b14' : 'm14'}
          numberOfLines={1}
          style={styles.mt5}
          color={focused ? colors.primary : colors.grayScale5}>
          {text}
        </ZText>
      )}
    </View>
  );
  const showToast = () => {
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
              <ToastDescription>
                {'You do not have permission.Contact dev@brokerapp.com.'}
              </ToastDescription>
            </Toast>
          );
        },
      });
    }
  };
  const onPressAdd = () => {
    //  onOpen();
    permissionGranted ? navigation.navigate('ChooseImage') : showToast();
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        height: 50,
      }}>
      <Tab.Navigator
        initialRouteName="AppTabHome"
        screenOptions={({route}) => ({
          //  unmountOnBlur: true,
          headerShown: false,
          headerTitle: '',
          tabBarStyle: [
            localStyles.tabBarStyle,

            {color: '#1D7BBF', backgroundColor: colors.backgroundColor},
          ],
          tabBarShowLabel: false,
          headerStyle: {
            borderBottomWidth: 0, // Add bottom border
            borderBottomColor: '#e1e1e1', // Border color
            height: Platform.OS === 'android' ? 65 : 100,
          },
          // headerTitle: props => (
          //   <CustomHeader
          //     showCitySelection={true} // Set to false if you don't need city selection
          //   />
          // ),
        })}>
        <Tab.Screen
          name="AppTabHome"
          component={HomePageStack}
          options={{
            tabBarIcon: ({focused}) => (
              <TabText
                text={''}
                focused={focused}
                icon={focused ? <Home_tab_icon /> : <Home_tab_icon />}
              />
            ),
            // headerShown: false,
          }}
        />
        <Tab.Screen
          name="Favourite"
          options={{
            // tabBarBadge:dashboard.connectionRequestCount,
            // tabBarBadgeStyle: {
            //   backgroundColor: colors.primary, // Set your desired background color here
            //   color: 'white', // Set your desired text color here
            // },
            // headerShown: false,
            tabBarIcon: ({focused}) => (
              <TabText
                text={''}
                focused={focused}
                icon={focused ? <Heart_tab_icon /> : <Heart_tab_icon />}
              />
            ),
          }}
          component={PlaceholderScreen}
          // component={MyNetworkScreen}
        />

        <Tab.Screen
          name={'Setting'}
          component={ChooseImage}
          //component={PostScreen}
          listeners={{tabPress: e => e.preventDefault()}}
          options={{
            tabBarIcon: ({focused}) => (
              <TouchableOpacity
                // tagNames={[View, Add_Icon]}
                // permissionEnum={PermissionKey.AllowAddPost}
                // permissionsArray={userPermissions}
                onPress={onPressAdd}
                style={localStyles.tabViewContainer}>
                {/* <View
                  style={{
                    position: 'relative',
                    bottom:
                      Platform.OS === 'android'
                        ? moderateScale(20)
                        : moderateScale(30),
                  }}> */}
                <View
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: moderateScale(50),
                    width: moderateScale(60),
                    height: moderateScale(60),
                    justifyContent: 'center',
                    alignItems: 'center',

                    borderColor: '#ffffff',
                  }}>
                  <Plus_Icon
                    width={moderateScale(60)}
                    height={moderateScale(60)}
                    color={Color.primary}
                  />
                </View>
                {/* </View> */}
              </TouchableOpacity>
            ),
          }}
        />
        <Tab.Screen
          name="Podcast"
          options={{
            // tabBarBadge:dashboard.connectionRequestCount,
            // tabBarBadgeStyle: {
            //   backgroundColor: colors.primary, // Set your desired background color here
            //   color: 'white', // Set your desired text color here
            // },
            // headerShown: false,
            tabBarIcon: ({focused}) => (
              <TabText
                text={''}
                focused={focused}
                icon={focused ? <Reel_tab_icon /> : <Reel_tab_icon />}
              />
            ),
          }}
          component={PlaceholderScreen}
          // component={MyNetworkScreen}
        />
        <Tab.Screen
          name="appointment"
          options={{
            // tabBarBadge:dashboard.connectionRequestCount,
            // tabBarBadgeStyle: {
            //   backgroundColor: colors.primary, // Set your desired background color here
            //   color: 'white', // Set your desired text color here
            // },
            // headerShown: false,
            tabBarIcon: ({focused}) => (
              <TabText
                text={''}
                focused={focused}
                icon={focused ? <Calender_tab_icon /> : <Calender_tab_icon />}
              />
            ),
          }}
          component={PlaceholderScreen}
          // component={MyNetworkScreen}
        />
      </Tab.Navigator>
    </View>
  );
};

export default AppTab;

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  titleText: {
    width: moderateScale(200),
  },
  button: {
    flex: 1,
    justifyContent: 'center',
  },
  shawdow: {
    shadowColor: '#DDDDDD',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
  },

  bottomBar: {},
  btnCircleUp: {
    // width: 60,
    // height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    bottom: 20,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.2,
    // shadowRadius: 1.41,
    // elevation: 1,
  },
  imgCircle: {
    width: 30,
    height: 30,
    tintColor: 'gray',
  },
  tabbarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    width: 30,
    height: 30,
  },

  tabBarStyle: {
    height: checkPlatform() === 'ios' ? getHeight(100) : getHeight(80),
    paddingHorizontal: moderateScale(20),
    // bottom:10
  },
  tabViewContainer: {
    ...styles.center,
  },
  actionSheetContainer: {
    ...styles.p40,
  },
  contextContainer: {
    ...styles.flexRow,
    ...styles.itemsCenter,
    ...styles.mt20,
    ...styles.p15,
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(15),
    justifyContent: 'flex-start',
  },
  contextContainerBox: {
    flexDirection: 'row',

    justifyContent: 'center',
    // width: '100%',
    // display:'flex',
    // flex: 1,
  },
  bottomContainer: {
    width: '100%',
    ...styles.selfCenter,
    paddingHorizontal: moderateScale(40),
    ...styles.mv30,
  },
});
