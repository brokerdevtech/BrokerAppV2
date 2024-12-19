/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';

import UserAvartarWithNameComponent from './UserAvartarWithNameComponent';
import AppBaseContainer from '../hoc/AppBaseContainer_old';
import {Color} from '../styles/GlobalStyles';
import {useApiRequest} from '../hooks/useApiRequest';
import {getConnections} from '../../BrokerAppCore/services/new/connection';
import ZText from './ZText';
import useUserJourneyTracker from '../hooks/Analytics/useUserJourneyTracker';

const MyConnectionScreen: React.FC = ({route}) => {
  const [connectionData, setConnectionData] = useState(null);
  const [uplineConnectionData, setUplineConnectionData] = useState(null);
  const user = useSelector((state: RootState) => state.user.user);
  const [refresh, setRefresh] = useState(false);
  const [activeTab, setActiveTab] = useState('network'); // To track active tab
  const {logButtonClick} = useUserJourneyTracker(`My Connections Page`);
  const activeUserId = route?.params?.activeUserId;
  const activeUserName = route?.params?.activeUserName;
  const userId = activeUserId === undefined ? user.userId : activeUserId;
  const shouldMenuRender = route?.params?.menuValue;
  const {
    data: connectiondata,
    status: connectionstatus,
    error: connectionerror,
    execute: connectionexecute,
  } = useApiRequest(getConnections);
  const OnRemoveConnection = () => {
    setRefresh(true);
  };

  const Name = userId !== activeUserId ? 'You' : activeUserName;

  useEffect(() => {
    const apiCallConnection = async () => {
      try {
        await connectionexecute(userId);
      } catch (error) {
        //   console.error('Error fetching connection data:', error);
      }
    };
    apiCallConnection();
  }, [route?.params, refresh]);
  useEffect(() => {
    if (connectionstatus === 200) {
      setConnectionData(connectiondata);
      setUplineConnectionData(connectiondata?.data.uplineConnection);
    }
  }, [connectionstatus]);

  // Render network connections
  const renderNetwork = () => (
    <View style={{flex: 1}}>
      {connectionData?.data?.connections &&
      connectionData?.data?.connections.length > 0 ? (
        <FlatList
          data={connectionData.data?.connections}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <View
              style={{
                borderBottomColor: Color.borderColor,
                borderBottomWidth: 1,
                paddingVertical: 10,
              }}>
              <UserAvartarWithNameComponent
                userName={item.firstName + ' ' + item?.lastName}
                userImage={item.profileImage}
                userDescription={item.city}
                connectionId={item.connectionId}
                userId={item.userId}
                loggedInUserId={user.userId}
                type="network"
                key={index}
                connectionCount={item.connectionCount}
                OnRemoveConnection={OnRemoveConnection}
                shouldMenuRender={shouldMenuRender}
              />
            </View>
          )}
          style={styles.connectionItem}
        />
      ) : (
        <View style={styles.noDataContainer}>
          {/* Display "No Data Found" */}
          <Text>No Network Connections Found</Text>
        </View>
      )}
    </View>
  );

  // Render upline connections
  const renderUpline = () => (
    <View style={{flex: 1}}>
      {uplineConnectionData ? (
        <View style={styles.container}>
          <UserAvartarWithNameComponent
            userName={
              uplineConnectionData?.firstName +
              ' ' +
              uplineConnectionData?.lastName
            }
            userImage={uplineConnectionData.profileImage}
            userDescription={uplineConnectionData.city}
            connectionId={uplineConnectionData.connectionId}
            userId={uplineConnectionData.userId}
            loggedInUserId={user.userId}
            connectionCount={uplineConnectionData.connectionCount}
            type="under"
            OnRemoveConnection={OnRemoveConnection}
          />
        </View>
      ) : (
        <View style={styles.noDataContainer}>
          {/* Display "No Data Found" */}
          <Text>No Upline Connections Found</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={{flex: 1}}>
      {/* Tab Buttons */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'network' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('network')}>
          <ZText type={'R16'} style={styles.tabText}>
            Network
          </ZText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'under' && styles.activeTab]}
          onPress={() => setActiveTab('under')}>
          <ZText type={'R16'} style={styles.tabText}>
            Channel
          </ZText>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === 'network' && renderNetwork()}
      {activeTab === 'under' && renderUpline()}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  tabButton: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: Color.primary,
  },
  tabText: {
    color: '#000',
    // fontSize: 16,
    // fontWeight: '500',
  },
  container: {
    height: 80,
    width: '100%',
    padding: 20,
    borderBottomColor: 'black',
    backgroundColor: 'white',
  },
  connectionItem: {
    paddingHorizontal: 18,
    paddingBottom: 10,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppBaseContainer(MyConnectionScreen, 'My Connection', true);
