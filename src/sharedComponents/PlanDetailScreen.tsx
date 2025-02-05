import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetFooter,
  BottomSheetTextInput,
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet';
import {useApiPagingWithtotalRequest} from '@/hooks/useApiPagingWithtotalRequest';
import {useNavigation} from '@react-navigation/native';
import {GetCommentList} from '../../BrokerAppCore/services/new/postServices';
import {Box} from '../../components/ui/box';
import {useToast, Toast, ToastDescription} from '../../components/ui/toast';
import {VStack} from '../../components/ui/vstack';
import {Color} from '../styles/GlobalStyles';
const PlanDetailsScreen = forwardRef(({postItem, onClose}, ref) => {
  const bottomSheetModalRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isInfiniteLoading, setInfiniteLoading] = useState(false);
  const snapPoints = useMemo(() => ['70%'], []);

  const limits = useMemo(() => {
    try {
      return JSON.parse(postItem?.limits || '{}');
    } catch (e) {
      return {};
    }
  }, [postItem]);
  const getLimitsData = useMemo(() => {
    const limitsData = [];
    const adsCategoryMap = {
      1: 'Marquee',
      2: 'Carousel',
    };

    const spaceCategoryMap = {
      1: 'Newly Launched',
      2: 'Brand Associated',
      3: 'New In Property',
      4: 'New In Car',
    };
    if (limits.Ads && Array.isArray(limits.Ads)) {
      limits.Ads.forEach((ad, index) => {
        limitsData.push({
          id: `ad-${index}`,
          title: `${adsCategoryMap[ad.Category]}  Ads`,
          description: `${ad.AdCount} ads allowed`,
        });
      });
    }

    if (limits.SpaceAds && Array.isArray(limits.SpaceAds)) {
      limits.SpaceAds.forEach((spaceAd, index) => {
        limitsData.push({
          id: `space-ad-${index}`,
          title: `${spaceCategoryMap[spaceAd.Category]} Space Ads`,
          description: `${spaceAd.SpaceAdCount} space ads allowed`,
        });
      });
    }

    if (limits.Posts !== undefined && limits.Posts !== null) {
      limitsData.push({
        id: 'posts',
        title: 'Posts Limit',
        description: `${limits.Posts} posts allowed`,
      });
    }

    return limitsData;
  }, [limits]);
  const getAdditionalBenefits = useMemo(() => {
    const adsCategoryMap = {
      1: 'Marquee',
      2: 'Carousel',
    };

    const spaceCategoryMap = {
      1: 'Newly Launched',
      2: 'Brand Associated',
      3: 'New In Property',
      4: 'New In Car',
    };
    try {
      const benefits = JSON.parse(postItem?.additionalBenifits || '{}');
      const benefitsData = [];

      if (benefits.Ads && Array.isArray(benefits.Ads)) {
        benefits.Ads.forEach((ad, index) => {
          benefitsData.push({
            id: `benefit-ad-${index}`,
            title: `${adsCategoryMap[ad.Category]} Additional Ads`,
            description: `${ad.AdCount} ads for ${ad.Validity} days`,
          });
        });
      }

      if (benefits.SpaceAd && Array.isArray(benefits.SpaceAd)) {
        benefits.SpaceAd.forEach((spaceAd, index) => {
          benefitsData.push({
            id: `benefit-space-${index}`,
            title: `${spaceCategoryMap[spaceAd.Category]}  Space Ads`,
            description: `${spaceAd.SpaceAdCount} space ads for ${spaceAd.Validity} days`,
          });
        });
      }

      if (benefits.Posts) {
        benefitsData.push({
          id: 'benefit-posts',
          title: 'Additional Posts',
          description: `${benefits.Posts} extra posts`,
        });
      }

      return benefitsData;
    } catch (e) {
      return [];
    }
  }, [postItem?.additionalBenifits]);

  const adLimits = useMemo(() => {
    if (limits.Ads && Array.isArray(limits.Ads)) {
      return limits.Ads.map(ad => ({
        id: `ad-${ad.Category}`,
        title: `Category ${ad.Category} Ads`,
        description: `${ad.AdCount} ads allowed`,
      }));
    }
    return [];
  }, [limits]);

  useEffect(() => {
    if (isOpen) {
      setInfiniteLoading(true);
    }
  }, [isOpen]);

  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );

  useImperativeHandle(ref, () => ({
    open: () => {
      bottomSheetModalRef.current?.present();
    },
  }));

  const getDiscountedPrice = () => {
    if (postItem?.discountPercentage && postItem?.discountAmount) {
      return postItem.price - postItem.discountAmount;
    }
    return postItem?.price;
  };
  console.log(adLimits);
  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      keyboardBehavior="fillParent"
      android_keyboardInputMode="adjustResize"
      index={0}
      snapPoints={snapPoints}
      enableOverDrag={false}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      enableHandlePanningGesture={false}
      enableDynamicSizing={false}>
      <View style={styles.container}>
        {/* Main ScrollView container */}
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Plan Info Section */}
          <View style={styles.planInfo}>
            <Text style={styles.planName}>{postItem?.planName}</Text>
            <Text style={styles.planDescription}>
              {postItem?.planDescription}
            </Text>
            <Text style={styles.planPrice}>
              {postItem?.currency} {postItem?.price}
              {postItem?.discountPercentage > 0 && (
                <Text style={styles.discount}>
                  {` (-${postItem.discountPercentage}% off)`}
                </Text>
              )}
            </Text>
            <Text style={styles.planValidity}>
              Validity: {postItem?.validityValue}{' '}
              {postItem?.validityType === 1 ? 'Days' : 'Hours'}
            </Text>
          </View>

          {/* Plan Limits Section */}
          {getLimitsData.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>Plan Limits</Text>
              <View style={styles.limitsContainer}>
                {getLimitsData.map(item => (
                  <View key={item.id} style={styles.limitItem}>
                    <Text style={styles.limitTitle}>{item.title}</Text>
                    <Text style={styles.limitDescription}>
                      {item.description}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Additional Benefits Section */}
          {getAdditionalBenefits.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>Additional Benefits</Text>
              <View style={styles.benefitsContainer}>
                {getAdditionalBenefits.map(item => (
                  <View key={item.id} style={styles.itemCard}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemDescription}>
                      {item.description}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Plan Details Section */}
          {/* <View style={styles.detailsSection}>
            <Text style={styles.detailText}>
              Created on: {new Date(postItem?.createdOn).toLocaleDateString()}
            </Text>
            <Text style={styles.detailText}>
              Activated on:{' '}
              {new Date(postItem?.activatedOn).toLocaleDateString()}
            </Text>
            <Text style={styles.detailText}>
              Created by: {postItem?.userName}
            </Text>
          </View> */}
        </ScrollView>

        {/* Proceed Button - Outside ScrollView */}
        <View style={styles.buttonContainer}>
          <View
            style={styles.proceedButton}
            // onPress={() => {
            //   bottomSheetModalRef.current?.dismiss();
            //   onClose?.();
            // }}>
          >
            <Text style={styles.proceedButtonText}>
              Proceed with {postItem?.currency} {getDiscountedPrice()}
            </Text>
          </View>
        </View>
      </View>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  planInfo: {
    marginBottom: 20,
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  planDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  discount: {
    fontSize: 16,
    color: '#4CAF50',
  },
  planValidity: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  limitsContainer: {
    marginBottom: 8,
  },
  benefitsContainer: {
    marginBottom: 8,
  },
  itemCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: Color.primary,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
  },
  detailsSection: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  limitItem: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  limitTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  limitDescription: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginBottom: 10,
  },
  proceedButton: {
    backgroundColor: Color.primaryDisable,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  proceedButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PlanDetailsScreen;
