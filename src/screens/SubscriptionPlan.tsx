/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {useSelector} from 'react-redux';

import AppBaseContainer from '../hoc/AppBaseContainer_old';
import {Color} from '../styles/GlobalStyles';
import {useApiRequest} from '../hooks/useApiRequest';
import {getConnections} from '../../BrokerAppCore/services/new/connection';

import useUserJourneyTracker from '../hooks/Analytics/useUserJourneyTracker';
import ZText from '../sharedComponents/ZText';
import {useApiPagingWithtotalRequest} from '../hooks/useApiPagingWithtotalRequest';
import {subsriptionPlanApi} from '../../BrokerAppCore/services/new/Subscription';
import NoDataFoundScreen from '../sharedComponents/NoDataFoundScreen';
import {formatDate} from '../constants/constants';
import PlanDetailsScreen from '../sharedComponents/PlanDetailScreen';
import {FlashList} from '@shopify/flash-list';
import {formatNumberToIndianSystem} from '../utils/helpers';

const SubscriptionPlan = ({route}) => {
  const user = useSelector((state: RootState) => state.user.user);
  const [activeTab, setActiveTab] = useState('General');
  const [selectedItem, setSelectedItem] = useState(null);
  const commentSheetRef = useRef(null);

  const handlePresentModalPress = useCallback(item => {
    setSelectedItem(item);
    commentSheetRef.current?.open();
  }, []);

  const closeModal = useCallback(() => {
    setSelectedItem(null);
  }, []);
  const flatListRef = useRef(null);
  const [isInfiniteLoading, setInfiniteLoading] = useState(false);

  const planType =
    activeTab === 'General'
      ? 1
      : activeTab === 'Ads'
      ? 2
      : activeTab === 'Space ads'
      ? 3
      : 0;
  const {
    data: Plandata,
    status: Planstatus,
    execute: Planexecute,

    loadMore: PlanloadMore,
    hasMore: PlanHasMore,
  } = useApiPagingWithtotalRequest(subsriptionPlanApi, setInfiniteLoading, 6);

  const getList = async () => {
    try {
      await Planexecute(planType);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  useEffect(() => {
    getList();
  }, [planType]);
  const loadMorePage = async () => {
    if (!isInfiniteLoading) {
      try {
        await PlanloadMore(planType);
      } catch (error) {
        console.error('Error loading more plans:', error);
      } finally {
      }
    }
  };
  const renderItem = ({item}) => {
    const limits = item.limits ? JSON.parse(item.limits) : {};
    const additionalBenefits = item.additionalBenifits
      ? JSON.parse(item.additionalBenifits)
      : {};
    const AdsCategoryMap = {
      1: 'Marquee',
      2: 'Carousel',
    };

    // Map for SpaceCategory
    const SpaceCategoryMap = {
      1: 'Newly Launched',
      2: 'Brand Associated',
      3: 'New in Property',
      4: 'New in Car',
    };
    const hasLimits = Object.keys(limits).some(key =>
      Array.isArray(limits[key])
        ? limits[key].length > 0
        : limits[key] !== undefined,
    );

    const hasAdditionalBenefits = Object.keys(additionalBenefits).some(key =>
      Array.isArray(additionalBenefits[key])
        ? additionalBenefits[key].length > 0
        : additionalBenefits[key] !== undefined,
    );
    return (
      <TouchableOpacity style={styles.card}>
        <View style={styles.row}>
          <ZText type={'S22'} style={styles.price}>
            ₹ {formatNumberToIndianSystem(item.price)}
          </ZText>
          <View>
            <ZText type={'R14'} style={styles.label}>
              Validity
            </ZText>
            <ZText type={'S16'} style={styles.value}>
              {item.validityValue} {item.validityType === 1 ? 'Days' : 'Hours'}
            </ZText>
          </View>
          <View>
            {Object.keys(limits).map(key => {
              if (key === 'Ads' && Array.isArray(limits[key])) {
                const firstAd = limits[key][0];
                if (firstAd) {
                  return (
                    <React.Fragment key={`${key}-container`}>
                      <Text style={styles.label}>{key}</Text>
                      <Text style={styles.value}>{firstAd.AdCount}</Text>
                    </React.Fragment>
                  );
                }
              } else if (key === 'SpaceAd' && Array.isArray(limits[key])) {
                const firstAd = limits[key][0];
                if (firstAd) {
                  return (
                    <React.Fragment key={`${key}-container`}>
                      <Text style={styles.label}>{key}</Text>
                      <Text style={styles.value}>{firstAd.SpaceAdCount}</Text>
                    </React.Fragment>
                  );
                }
              } else {
                return (
                  <React.Fragment key={`${key}-container`}>
                    <Text style={styles.label}>{key}</Text>
                    <Text style={styles.value}>{limits[key]}</Text>
                  </React.Fragment>
                );
              }
            })}
          </View>
        </View>
        <View style={styles.divider} />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}>
          <View type={'B26'} style={styles.details}>
            {hasAdditionalBenefits ? (
              <>
                <ZText type={'R12'} style={[styles.detailText, {marginTop: 8}]}>
                  Additional Benefits:
                </ZText>
                {Object.keys(additionalBenefits).map((key, index) => {
                  const benefit = additionalBenefits[key];
                  if (Array.isArray(benefit)) {
                    return benefit.map((item, idx) => {
                      const categoryName =
                        key === 'Ads'
                          ? AdsCategoryMap[item.Category]
                          : SpaceCategoryMap[item.Category];

                      return (
                        <ZText
                          key={`${key}-${idx}`}
                          type={'R12'}
                          style={styles.value}>
                          {key}: {item.AdCount} | {categoryName} | Validity:
                          {item.Validity} days
                        </ZText>
                      );
                    });
                  }
                  return (
                    <ZText key={index} type={'R12'} style={styles.value}>
                      {key}: {additionalBenefits[key]}
                    </ZText>
                  );
                })}
              </>
            ) : (
              <>
                <ZText type={'R12'} style={[styles.detailText, {marginTop: 8}]}>
                  Additional Benefits:
                </ZText>
                <ZText type={'R12'} style={styles.value}>
                  N/A
                </ZText>
              </>
            )}
          </View>

          <View
            style={{
              flexDirection: 'coloum',
              justifyContent: 'space-between',
              alignItems: 'center', // Ensures buttons stay in position
              marginTop: 10,
              // Add spacing
            }}>
            {/* Buy Now Button */}
            <View style={styles.buyNowButton}>
              <ZText type={'S14'} color={'white'}>
                Buy Now
              </ZText>
            </View>

            {/* Read More Button */}
            <TouchableOpacity
              style={{paddingHorizontal: 10}}
              onPress={() => handlePresentModalPress(item)}>
              <ZText
                type={'S12'}
                color={Color.primary}
                style={{textDecorationLine: 'underline'}}>
                Read more
              </ZText>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{flex: 1}}>
      <View style={styles.tabContainer}>
        {['General', 'Ads', 'Space ads'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}>
            <ZText type={'R16'} style={styles.tabText}>
              {tab}
            </ZText>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={Plandata}
        renderItem={renderItem}
        ref={flatListRef}
        onEndReachedThreshold={0.3}
        onEndReached={loadMorePage}
        contentContainerStyle={{paddingBottom: 100}}
        ListFooterComponent={
          isInfiniteLoading ? (
            <ActivityIndicator size="large" color={Color.primary} />
          ) : null
        }
        ListEmptyComponent={() => (Plandata ? <NoDataFoundScreen /> : null)}
      />

      <PlanDetailsScreen
        ref={commentSheetRef}
        postItem={selectedItem}
        onClose={closeModal}
      />
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
    // fontSize: 24,
    // fontWeight: 'bold',
    color: Color.primary,
  },
  label: {
    // fontSize: 12,
    color: '#777',
  },
  value: {
    // fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  details: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '65%',
  },
  detailText: {
    // fontSize: 12,
    color: '#555',
    // flexDirection: 'column',
    // justifyContent: 'center',
    // flex: 1,
  },
  buyNowButton: {
    backgroundColor: Color.primaryDisable, // Change color as needed
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 5,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AppBaseContainer(
  SubscriptionPlan,
  'Select a subcription plan',
  true,
);
