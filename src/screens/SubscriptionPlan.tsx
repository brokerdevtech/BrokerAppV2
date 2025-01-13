/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';

import AppBaseContainer from '../hoc/AppBaseContainer_old';
import {Color} from '../styles/GlobalStyles';
import {useApiRequest} from '../hooks/useApiRequest';
import {getConnections} from '../../BrokerAppCore/services/new/connection';

import useUserJourneyTracker from '../hooks/Analytics/useUserJourneyTracker';
import ZText from '../sharedComponents/ZText';
const plans = [
  {
    id: 1,
    price: 361,
    validity: '30 days',
    data: '50.0 GB per pack',
    details: {
      data: '50GB',
      validity: '30 days',
    },
  },
  {
    id: 2,
    price: 211,
    validity: '30 days',
    data: '1.0 GB per day',
    details: {
      data: '1GB/day',
      validity: '30 days',
    },
  },
  {
    id: 3,
    price: 181,
    validity: '30 days',
    data: '15.0 GB per pack',
    includes: 'Free 20+ OTTs',
    details: {
      data: '15GB',
      validity: '30 days',
      other: 'Xstream Play',
    },
  },
  {
    id: 4,
    price: 49,
    validity: '1 day',
    data: 'Unlimited',
    details: {
      data: 'Unlimited',
      validity: '1 day',
    },
    tag: 'Best Value',
  },
  {
    id: 5,
    price: 3999,
    validity: '365 days',
    data: '2.5 GB per day',
    details: {
      calls: 'Unlimited',
      data: '2.5GB/day',
      validity: '365 days',
    },
    tag: 'Super Saver - Rs. 334/month',
  },
  {
    id: 6,
    price: 361,
    validity: '30 days',
    data: '50.0 GB per pack',
    details: {
      data: '50GB',
      validity: '30 days',
    },
  },
  {
    id: 7,
    price: 211,
    validity: '30 days',
    data: '1.0 GB per day',
    details: {
      data: '1GB/day',
      validity: '30 days',
    },
  },
  {
    id: 8,
    price: 181,
    validity: '30 days',
    data: '15.0 GB per pack',
    includes: 'Free 20+ OTTs',
    details: {
      data: '15GB',
      validity: '30 days',
      other: 'Xstream Play',
    },
  },
  {
    id: 9,
    price: 49,
    validity: '1 day',
    data: 'Unlimited',
    details: {
      data: 'Unlimited',
      validity: '1 day',
    },
    tag: 'Best Value',
  },
  {
    id: 10,
    price: 3999,
    validity: '365 days',
    data: '2.5 GB per day',
    details: {
      calls: 'Unlimited',
      data: '2.5GB/day',
      validity: '365 days',
    },
    tag: 'Super Saver - Rs. 334/month',
  },
];
const renderItem = ({item}) => (
  <TouchableOpacity style={styles.card}>
    <View style={styles.row}>
      <Text style={styles.price}>₹{item.price}</Text>
      <View>
        <Text style={styles.label}>Validity</Text>
        <Text style={styles.value}>{item.validity}</Text>
      </View>
      <View>
        <Text style={styles.label}>Data</Text>
        <Text style={styles.value}>{item.data}</Text>
      </View>
    </View>
    <View style={styles.divider} />
    <View style={styles.details}>
      <Text style={styles.detailText}>Data: {item.validity}</Text>
      <Text style={styles.detailText}>Validity: {item.data}</Text>
    </View>
  </TouchableOpacity>
);
const SubscriptionPlan: React.FC = ({route}) => {
  const user = useSelector((state: RootState) => state.user.user);
  const [activeTab, setActiveTab] = useState('Recommended Packs');
  const renderRecommendedplans = () => {
    return (
      <FlatList
        data={plans}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
      />
    );
  };
  return (
    <View style={{flex: 1}}>
      {/* Tab Buttons */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'Recommended Packs' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('Recommended Packs')}>
          <ZText type={'R16'} style={styles.tabText}>
            Recommended Packs
          </ZText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'Popular' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('Popular')}>
          <ZText type={'R16'} style={styles.tabText}>
            Popular
          </ZText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'Super Saver' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('Super Saver')}>
          <ZText type={'R16'} style={styles.tabText}>
            Super Saver
          </ZText>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === 'Recommended Packs' && renderRecommendedplans()}
      {/* {activeTab === 'under' } */}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly', // or 'space-between' depending on your layout preference
    alignItems: 'center',
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10, // Adjust based on your preference
  },
  activeTab: {
    borderBottomWidth: 2, // Or any other active tab styles
    borderBottomColor: Color.primary, // Example active border color
  },
  tabText: {
    fontSize: 16, // Make sure the text size fits your design
    flexShrink: 1, // Ensures the text stays on one line
    textAlign: 'center', // Ensures the text is centered
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  label: {
    fontSize: 12,
    color: '#777',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailText: {
    fontSize: 12,
    color: '#555',
  },
});

export default AppBaseContainer(
  SubscriptionPlan,
  'Select a subcription plan',
  true,
);
