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

  const renderItem = useCallback(
    ({item}) => {
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
              {item?.currency + ' '}
              {item.price}
            </ZText>
            <View>
              <ZText type={'R14'} style={styles.label}>
                Validity
              </ZText>
              <ZText type={'S16'} style={styles.value}>
                {item.validityValue}{' '}
                {item.validityType === 1 ? 'Days' : 'Hours'}
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
                        <Text style={styles.value}>{firstAd.AdCount}</Text>
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
              {hasLimits && (
                <>
                  <ZText type={'R12'} style={styles.detailText}>
                    Limits : {item.limits.post}
                  </ZText>
                  {Object.keys(limits).map((key, index) => {
                    const benefit = limits[key];
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
              )}
              {hasAdditionalBenefits && (
                <>
                  <ZText
                    type={'R12'}
                    style={[styles.detailText, {marginTop: 8}]}>
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
              )}
            </View>
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
        </TouchableOpacity>
      );
    },
    [handlePresentModalPress],
  );

  const renderRecommendedplans = useCallback(
    plantype => {
      const flatListRef = useRef(null);
      const [isInfiniteLoading, setInfiniteLoading] = useState(false);
     
      const  {
        data: Plandata,
        status: Planstatus,
        execute: Planexecute,
        hasMore,
        loadMore: PlanloadMore,
        pageSize_Set,currentPage_Set,hasMore_Set,totalPages,recordCount,setData_Set



      } = useApiPagingWithtotalRequest(
        subsriptionPlanApi,
        setInfiniteLoading,
        6,
      );

      const getList = async () => {
        try {
          await  hasMore_Set(true)
          await Planexecute(plantype);
        } catch (error) {
          console.error('Error fetching plans:', error);
        }
      };

      useEffect(() => {
        // Plandata=null;
        //setData_Set(null)
     
        
        getList();
      }, [plantype]);

      useEffect(() => {
        if (Planstatus == 200) {
        console.log('Plan',Plandata);
        }
      }, [Plandata, Planstatus]);

      const loadMorepage = async () => {
        if (!isInfiniteLoading) {
          try {
            await PlanloadMore(plantype);
          } catch (error) {
            console.error('Error loading more pages:', error);
          }
        }
      };

      return (
        
        <FlatList
          data={Plandata}
          renderItem={renderItem}
          ref={flatListRef}
          getItemLayout={(data, index) => ({
            length: 560,
            offset: 560 * index,
            index,
          })}
          initialNumToRender={2}
          maxToRenderPerBatch={4}
        
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.6}
          onEndReached={loadMorepage}
          contentContainerStyle={{paddingBottom: 100}}
          ListFooterComponent={
            isInfiniteLoading ? (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                style={styles.loader}
              />
            ) : null
          }
          removeClippedSubviews={false}
          // ListEmptyComponent={() =>
          //   plans.length === 0 ? <NoDataFoundScreen /> : null
          // }
        />
      );
    },
    [renderItem],
  );

  return (
    <View style={{flex: 1}}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'General' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('General')}>
          <ZText type={'R16'} style={styles.tabText}>
            General
          </ZText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Ads' && styles.activeTab]}
          onPress={() => setActiveTab('Ads')}>
          <ZText type={'R16'} style={styles.tabText}>
            Ads
          </ZText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'Space ads' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('Space ads')}>
          <ZText type={'R16'} style={styles.tabText}>
            Space ads
          </ZText>
        </TouchableOpacity>
      </View>
     
      {activeTab === 'General' && renderRecommendedplans(1)}
      {activeTab === 'Ads' && renderRecommendedplans(2)}
      {activeTab === 'Space ads' && renderRecommendedplans(3)}

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
  },
  detailText: {
    // fontSize: 12,
    color: '#555',
    // flexDirection: 'column',
    // justifyContent: 'center',
    // flex: 1,
  },
});

export default AppBaseContainer(
  SubscriptionPlan,
  'Select a subcription plan',
  true,
);
