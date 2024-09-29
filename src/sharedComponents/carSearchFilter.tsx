import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import {useSelector} from 'react-redux';
import {
  getCarCascadedFilters,
  getCarPostFilters,
} from '../../BrokerAppCore/services/postService';
import ZSafeAreaView from './ZSafeAreaView';
import ZHeader from './ZHeader';
import {
  ConditonData,
  DiscountData,
  DrivenData,
  MakingYearData,
} from '../constants/constants';
import CheckboxList from './checkboxlist';
import VerticalRangeSlider from './RangeSliderView';
import {Color} from '../styles/GlobalStyles';
import ZText from './ZText';

const MENU_ITEMS = [
  {id: '1', name: 'Budget'},
  {id: '2', name: 'Discount'},
  {id: '3', name: 'Condition'},
  {id: '4', name: 'Driven'},
  {id: '5', name: 'Making Year'},
  {id: '7', name: 'Brands', apiName: 'Brand'},
  {id: '8', name: 'Model', apiName: 'Model'},
  {id: '9', name: 'Fuel', apiName: 'FuelType'},
  {id: '10', name: 'Body Type', apiName: 'BodyType'},
  {id: '11', name: 'Transmission', apiName: 'Transmission'},
  {id: '12', name: 'OwnerShip', apiName: 'Ownership'},
  {id: '13', name: 'Seating', apiName: 'SeatingCapacity'},
  {id: '14', name: 'Registration State', apiName: 'RegistrationState'},
  {id: '15', name: 'Color', apiName: 'Color'},
  {id: '16', name: 'Posted Since', apiName: 'PostedSince'},
  {id: '17', name: 'Insurance Status', apiName: 'InsuranceStatus'},
];

const CarFilterScreen = () => {
  const [menuItems, setMenuItems] = useState(MENU_ITEMS);
  const [minValue, setMinValue] = useState(500000);
  const [maxValue, setMaxValue] = useState(20000000);
  const [selectedItem, setSelectedItem] = useState('1');
  const [filterData, setFilterData] = useState({});
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedDriven, setSelectedDriven] = useState(null);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [selectedIsnew, setSelectedIsnew] = useState(false);
  const [selectedMaking, setSelectedMaking] = useState(null);
  const [modelData, setModelData] = useState([]);
  const [Carfilters, setCarFilter] = useState([]);
  const user = useSelector(state => state.user.user);
  const fetchModels = async brandKey => {
    try {
      const {data} = await getCarCascadedFilters(
        user.userId,
        'post',
        'Model',
        brandKey.key,
      );

      console.log(data.filters[0].records);
      setModelData(data.filters[0].records || []);
    } catch (error) {
      console.error('Error fetching models:', error);
    }
  };
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const {data} = await getCarPostFilters(user.userId, 'Post');
        if (!data?.filters) throw new Error('Unexpected data structure');
        // console.log('Fetch Filters Response:', data);
        const filters = data.filters.reduce((acc, filter) => {
          acc[filter.name] = {
            records: filter.records || [],
            dependsOn: filter.dependsOn || null,
          };
          return acc;
        }, {});
        setCarFilter(data.data);
        setFilterData(filters);
        setMenuItems([
          ...staticMenuData,
          ...Object.keys(filters).map((key, index) => ({
            id: (
              parseInt(staticMenuData[staticMenuData.length - 1]?.id || '0') +
              1 +
              index
            ).toString(),
            name: key,
          })),
        ]);
        // console.log(selectedFilters);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchFilters();
  }, [user.userId]);
  const handleBrandSelection = async brandKey => {
    setSelectedBrand(brandKey);
    await fetchModels(brandKey);
    // console.log(brandKey);
  };

  const handleSelectionChange = (selectedItems, filterName) => {
    setSelectedFilters(prevFilters => {
      // Create a shallow copy of the previous filters
      const updatedFilters = {...prevFilters};

      // Update the specific filter with the new selections
      updatedFilters[filterName] = selectedItems;

      return updatedFilters;
    });
  };

  const handleApplyFilters = () => {
    let ApiFliterObject = {
      userId: user.userId,
      Keyword: '',
      pageSize: 5,
      pageNumber: 1,
      minPrice: minValue,
      maxPrice: maxValue,
      discount: selectedDiscount,
      isNewCar: selectedIsnew,
      kilometerDriven: selectedDriven,
      makeYear: selectedMaking,
      radius: 15000,
      filters: {
        tags: [],
      },
    };
    console.log(selectedFilters, 'selected');
    Object.keys(selectedFilters).forEach(filterName => {
      const selectedItem = selectedFilters[filterName];
      console.log(selectedItem, 'selected');
      if (selectedItem) {
        ApiFliterObject.filters.tags.push({
          name: filterName,
          values: [{key: selectedItem.key, value: selectedItem.value}],
        });
      }
    });

    // Ensure the brand is added separately
    if (selectedBrand) {
      ApiFliterObject.filters.tags.push({
        name: 'Brand',
        values: [{key: selectedBrand.key, value: selectedBrand.value}],
      });
    }

    console.log(JSON.stringify(ApiFliterObject, null, 2));
  };

  const settingsConfig = [
    {
      id: '1',
      component: 'VerticalRangeSlider',
      props: {min: 100000, max: 30000000},
    },
    {
      id: '2',
      component: 'CheckboxList',
      props: {
        data: DiscountData,
        onSelectionChange: data => {
          setSelectedDiscount(data.value);
          // console.log(data.value);
        },
      },
    },
    {
      id: '3',
      component: 'CheckboxList',
      props: {
        data: ConditonData,
        onSelectionChange: data => {
          setSelectedIsnew(data.value === 'New Car' ? true : false);
          // console.log(data.value);
        },
      },
    },
    {
      id: '4',
      component: 'CheckboxList',
      props: {
        data: DrivenData,
        onSelectionChange: data => {
          setSelectedDriven(data.value);
          // console.log(data.value);
        },
      },
    },
    {
      id: '5',
      component: 'CheckboxList',
      props: {
        data: MakingYearData,
        onSelectionChange: data => {
          setSelectedMaking(data.value);
          // console.log(data.value);
        },
      },
    },
    {
      id: '7',
      component: 'CheckboxList',
      props: {
        data: filterData['Brand']?.records || [],

        onSelectionChange: handleBrandSelection,
      },
    },
    {
      id: '8',
      component: 'CheckboxList',
      props: {
        data: modelData,
        onSelectionChange: data => handleSelectionChange(data, 'Model'),
      },
    },
    {
      id: '9',
      component: 'CheckboxList',
      props: {
        data: filterData['FuelType']?.records || [],
        onSelectionChange: data => handleSelectionChange(data, 'FuelType'),
      },
    },
    {
      id: '10',
      component: 'CheckboxList',
      props: {
        data: filterData['BodyType']?.records || [],
        onSelectionChange: data => handleSelectionChange(data, 'BodyType'),
      },
    },
    {
      id: '11',
      component: 'CheckboxList',
      props: {
        data: filterData['Transmission']?.records || [],
        onSelectionChange: data => handleSelectionChange(data, 'Transmission'),
      },
    },
    {
      id: '12',
      component: 'CheckboxList',
      props: {
        data: filterData['Ownership']?.records || [],
        onSelectionChange: data => handleSelectionChange(data, 'Ownership'),
      },
    },
    {
      id: '13',
      component: 'CheckboxList',
      props: {
        data: filterData['SeatingCapacity']?.records || [],
        onSelectionChange: data =>
          handleSelectionChange(data, 'SeatingCapacity'),
      },
    },
    {
      id: '14',
      component: 'CheckboxList',
      props: {
        data: filterData['RegistrationState']?.records || [],
        onSelectionChange: data =>
          handleSelectionChange(data, 'RegistrationState'),
      },
    },
    {
      id: '15',
      component: 'CheckboxList',
      props: {
        data: filterData['Color']?.records || [],
        onSelectionChange: data => handleSelectionChange(data, 'Color'),
      },
    },
    {
      id: '16',
      component: 'CheckboxList',
      props: {
        data: filterData['PostedSince']?.records || [],
        onSelectionChange: data => handleSelectionChange(data, 'PostedSince'),
      },
    },
    {
      id: '17',
      component: 'CheckboxList',
      props: {
        data: filterData['InsuranceStatus']?.records || [],
        onSelectionChange: data =>
          handleSelectionChange(data, 'InsuranceStatus'),
      },
    },
  ];
  // console.log(modelData);
  const renderItem = ({item}) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => setSelectedItem(item.id)}
      style={[
        styles.menuItem,
        item.id === selectedItem ? styles.selectedMenuItem : null,
      ]}>
      <Text style={styles.menuItemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderSettingsView = () => {
    const selectedSetting = settingsConfig.find(
      setting => setting.id === selectedItem,
    );

    if (!selectedSetting) {
      return null;
    }

    const {component, props} = selectedSetting;

    let ComponentToRender;

    switch (component) {
      case 'VerticalRangeSlider':
        ComponentToRender = (
          <VerticalRangeSlider
            {...props}
            minValue={minValue}
            maxValue={maxValue}
            setMinValue={setMinValue}
            setMaxValue={setMaxValue}
          />
        );
        break;
      case 'CheckboxList':
        ComponentToRender = <CheckboxList {...props} />;
        break;
      default:
        return null;
    }

    return (
      <View style={styles.settingsView}>
        <Text style={styles.menuItemText}>
          {menuItems.find(item => item.id === selectedItem)?.name}
        </Text>
        {ComponentToRender}
      </View>
    );
  };

  const RightIcon = () => (
    <TouchableOpacity onPress={handleApplyFilters}>
      <ZText numberOfLines={1} color={Color.primary} type={'M16'}>
        {'Apply'}
      </ZText>
    </TouchableOpacity>
  );
  // console.log(filterData);
  return (
    <ZSafeAreaView>
      <ZHeader title={'Car Filters'} rightIcon={<RightIcon />} />
      <View style={styles.container}>
        <View style={styles.menuColumn}>
          <FlatList
            data={menuItems}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.menuContainer}
            showsVerticalScrollIndicator={false}
          />
        </View>
        <ScrollView style={styles.settingsColumn}>
          {renderSettingsView()}
        </ScrollView>
      </View>
    </ZSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
  },
  menuColumn: {
    width: '30%',
    backgroundColor: '#F8F8F8',
  },
  menuContainer: {
    // paddingVertical: 10,
  },
  menuItem: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  selectedMenuItem: {
    backgroundColor: '#FFFFFF',
    borderLeftColor: Color.primary,
    borderLeftWidth: 5,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingsColumn: {
    width: '70%',
    paddingHorizontal: 20,
  },
  settingsView: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CarFilterScreen;
