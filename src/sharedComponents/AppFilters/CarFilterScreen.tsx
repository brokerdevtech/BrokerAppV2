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
import {getCarCascadedFilters} from '../../../BrokerAppCore/services/postService';
import ZSafeAreaView from '../ZSafeAreaView';
import ZHeader from '../ZHeader';
import {
  ConditonData,
  DiscountData,
  DrivenData,
  MakingYearData,
} from '../../constants/constants';
import CheckboxList from '../checkboxlist';
import VerticalRangeSlider from '../RangeSliderView';
import {Color} from '../../styles/GlobalStyles';
import ZText from '../ZText';
import {useApiRequest} from '../../hooks/useApiRequest';
import {
  getCarPostCascadedFilters,
  getCarPostFilters,
  getCascadedFilters,
  getRealEstateFilters,
} from '../../../BrokerAppCore/services/new/postServices';
import SelectableFlatList from '../filters/SelectableFlatList';
import AppBaseContainer from '../../hoc/AppBaseContainer_old';
import {Box} from '../../../components/ui/box';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetFooter,
  BottomSheetTextInput,
  BottomSheetFlatList,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {VStack} from '../../../components/ui/vstack';
import LocalityTag from '../LocalityTag';
import MultiSelectFlatList from '../filters/MultiSelectFlatList';
import RangeSlider from '../filters/RangeSlider';
const MENU_ITEMS = [
  {id: '1', name: 'Location', displayName: 'Location'},
  {id: '2', name: 'Budget', displayName: 'Budget'},
  {id: '3', name: 'Area', displayName: 'Area'},
  {id: '4', name: 'Developer', displayName: 'Developer'},
  {id: '5', name: 'Project', displayName: 'Project'},
  {id: '6', name: 'PropertyType', displayName: 'Property Type'},
  {id: '7', name: 'Bedroom', displayName: 'Bedroom'},
  {id: '8', name: 'Bathroom', displayName: 'Bathroom'},
  {id: '9', name: 'Balcony', displayName: 'Balcony'},
  {id: '10', name: 'Amenities', displayName: 'Amenities'},
  {id: '12', name: 'TransactionType', displayName: 'Sales/Transaction Type'},
  {id: '13', name: 'PropertyAge', displayName: 'Age of Property'},
  {id: '14', name: 'PropertyStatus', displayName: 'Property Status'},
  {id: '15', name: 'ConstructionStatus', displayName: 'Construction Status'},
  {id: '16', name: 'NearbyFacilities', displayName: 'Nearby Facilities'},
  {id: '17', name: 'PostedSince', displayName: 'Posted Since'},
  {id: '18', name: 'PropertySizeUnit', displayName: 'Unit'},
];

const CarFilterScreen: React.FC = ({
  AlertDialogShow,
  isPageSkeleton,
  toggleSkeletonoff,
  toggleSkeletonOn,

  navigation,

  color,
  route,
  pageTitle,
  toast,

  onApply,
  PopUPFilter,
}) => {
  const [menuItems, setMenuItems] = useState(MENU_ITEMS);
  const [imagesArray, setimagesArray] = useState<any>(route.params?.postVisual);
  const [Isvideo, setIsvideo] = useState<any>(route.params?.Isvideo);
  const [formValue, setformValue] = useState<any>(route.params?.formValue);

  const [filterlocalities, setfilterlocalities] = useState<any>();

  const [selectedItem, setSelectedItem] = useState(null);

  const [selectedFilters, setSelectedFilters] = useState({});

  const [filtersState, setfiltersState] = useState([]);
  const user = useSelector(state => state.user.user);
  const AppLocation = useSelector((state: RootState) => state.AppLocation);
  const {
    data: Filters,
    status: Filtersstatus,
    error: Filterserror,
    execute: Filterexecute,
  } = useApiRequest(getCarPostFilters);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        await Filterexecute(user.userId, 'Post');
        // console.log(selectedFilters);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchFilters();
  }, [user.userId]);

  useEffect(() => {
    // This useEffect runs when Filters data changes
    const updateFilters = async () => {
      if (Filters != null) {
        try {
          // Filter out the 'PropertySizeUnit' item from the Filters data
          const filteredItems = Filters.data.filters.filter(
            item => item.name !== 'PropertySizeUnit',
          );

          const years = [];
          for (let year = 2024; year >= 2000; year--) {
            years.push({key: year.toString(), value: year});
          }

          const kms = [
            {key: '10000', value: '10,000 kms or less'},
            {key: '30000', value: '30,000 kms or less'},
            {key: '50000', value: '50,000 kms or less'},
            {key: '75000', value: '75,000 kms or less'},
            {key: '100000', value: '1,00,000 kms or less'},
            {key: '125000', value: '1,25,000 kms or less'},
            {key: '150000', value: '1,50,000 kms or less'},
            {key: '175000', value: '1,75,000 kms or less'},
            {key: '200000', value: '2,00,000 kms or less'},
          ];

          // Define filters without 'PostedSince'
          const filtersWithoutPostedSince = [
            {
              name: 'Location',
              displayName: 'Location',
              type: 'Location',
              filterOrder: 1,
              isMultiSelect: false,
              isMandatory: false,
              dependsOn: 'Developer',
              records: [],
            },
            {
              name: 'Budget',
              displayName: 'Budget',
              type: 'Budget',
              filterOrder: 1,
              isMultiSelect: false,
              isMandatory: false,
              dependsOn: '',
              records: [],
              Value: {minValue: 20000, maxValue: 500000000},
            },
            {
              name: 'RegistrationYear',
              displayName: 'Registration Year',
              type: 'RegistrationYear',
              filterOrder: 1,
              isMultiSelect: false,
              isMandatory: false,
              dependsOn: '',
              records: years,
            },
            {
              name: 'ManufactureYear',
              displayName: 'Manufacture Year',
              type: 'ManufactureYear',
              filterOrder: 1,
              isMultiSelect: false,
              isMandatory: false,
              dependsOn: '',
              records: years,
            },
            {
              name: 'KmsDriven',
              displayName: 'Kms Driven',
              type: 'KmsDriven',
              filterOrder: 1,
              isMultiSelect: false,
              isMandatory: false,
              dependsOn: '',
              records: kms,
            },
            ...filteredItems,
          ];

          // console.log("PopUPFilter");
          // console.log(PopUPFilter);
console.log(filtersWithoutPostedSince);
          if (PopUPFilter) {
            // Fetch filters based on Developer and localities.City
            setfilterlocalities(PopUPFilter.Location);
            //   // Update state with the filtered data
            setfiltersState(filtersWithoutPostedSince);

            //   // Set the first available filter as the selected item

            setSelectedItem(filtersWithoutPostedSince[0]);

            const updatedSelectedFilters = {
              ...selectedFilters,
              ...PopUPFilter,
            };

            setSelectedFilters(updatedSelectedFilters);
          }
        } catch (error) {
          console.error('Error updating filters:', error);
        }
      }
    };

    // Call the asynchronous function
    updateFilters();
  }, [Filters]);

  const getDeveloper = async (filters, City) => {
    const result = await getCascadedFilters(
      user.userId,
      'PostSearch',
      'Developer',
      City,
    );

    // Update the records for the dependent filter
    if (result.data.filters.length > 0) {
      const updatedFilters = await updateRecordsByName(
        filters,
        'Developer',
        result.data.filters[0].records,
      );
      return updatedFilters;
    } else {
      return filters;
    }
  };

  const handleApplyFilters = () => {
    onApply(selectedFilters);
    // Check for mandatory filters
    //   const missingMandatoryFilters = CarfiltersState
    //   .filter(item => item.isMandatory && !selectedFilters[item.name])
    //   .map(item => item.name); // Collect the names of the missing filters

    // // If there are missing mandatory filters, show an alert and exit
    // if (missingMandatoryFilters.length > 0) {
    //   alert(`Please select the following mandatory filters: ${missingMandatoryFilters.join(', ')}`);
    //   return;
    // }

    //  navigation.navigate('CarPostPreview', {
    //   filters: selectedFilters,
    //   postVisual: imagesArray,
    //   Isvideo: Isvideo,
    //   localities: localities,
    //   formValue: formValue,
    // });6

    // Proceed with your API call or other logic here
  };

  const onFiltersLocalityChange = async Localitys => {
    const locationData = [
      {
        place: {
          ...Localitys,
        },
      },
    ];

    setfilterlocalities(locationData);

    let updatedSelectedFilters = {...selectedFilters};
    updatedSelectedFilters[selectedItem.name] = [...locationData];
    setSelectedFilters(updatedSelectedFilters);

    if (selectedItem.dependsOn) {
      try {
        // Fetch the cascaded filters for the dependent item
        const result = await getCascadedFilters(
          user.userId,
          'PostSearch',
          selectedItem.dependsOn,
          Localitys.City,
        );

        // Update the records for the dependent filter
        if (result.data.filters.length > 0) {
          const updatedFilters = await updateRecordsByName(
            filtersState,
            selectedItem.dependsOn,
            result.data.filters[0].records,
          );
          setfiltersState(updatedFilters);
        }
        // Automatically navigate to the dependent filter's menu item
        //   const dependentFilter = updatedFilters.find(filter => filter.name === selectedItem.dependsOn);
        //   if (dependentFilter) {
        //     setSelectedItem(dependentFilter);
        //   }
      } catch (error) {
        console.error('Error fetching cascaded filters:', error);
      }
    }
  };

  const renderItem = ({item}) => {
    // Log the item for debugging purposes
    const isSelected = item.name === selectedItem?.name;

    return (
      <TouchableOpacity
        key={item.name} // Ensure that `item.name` is unique for each item
        onPress={() => setSelectedItem(item)}
        style={[
          styles.menuItem,
          isSelected ? styles.selectedMenuItem : null, // Correct comparison
        ]}>
        <Text style={styles.menuItemText}>
          {item.displayName}

          {/* {item.isMandatory ? ' ' : ''} */}
        </Text>
      </TouchableOpacity>
    );
  };
  const updateRecordsByName = async (filtersArray, name, newRecords) => {
    // Find the item based on the name
    const item = filtersArray.find(filter => filter.name === name);

    // Check if item was found and update records
    if (item) {
      item.records = newRecords;
    } else {
      console.log(`No item found with name: ${name}`);
    }

    // Return the modified filters array
    return filtersArray;
  };
  const SelectItem = async item => {
    // Create a copy of the selected filters object
    let updatedSelectedFilters = {...selectedFilters};
    updatedSelectedFilters[selectedItem.name] = [item];
    setSelectedFilters(updatedSelectedFilters);

    if (selectedItem.dependsOn) {
      try {
        // Fetch the cascaded filters for the dependent item
        const result = await getCarPostCascadedFilters(
          user.userId,
          'Post',
          selectedItem.dependsOn,
          item.key,
        );

        // Update the records for the dependent filter
        if (result.data.data.filters.length > 0) {
          const updatedFilters = await updateRecordsByName(
            filtersState,
            selectedItem.dependsOn,
            result.data.data.filters[0].records,
          );
          setfiltersState(updatedFilters);

          // Automatically navigate to the dependent filter's menu item
          const dependentFilter = updatedFilters.find(
            filter => filter.name === selectedItem.dependsOn,
          );
          if (dependentFilter) {
            setSelectedItem(dependentFilter);
          }
        }
      } catch (error) {
        console.error('Error fetching cascaded filters:', error);
      }
    }
  };

  const SelectMultiItem = async item => {
    // Create a copy of the selected filters object
    let updatedSelectedFilters = {...selectedFilters};
    updatedSelectedFilters[selectedItem.name] = [...item];
    setSelectedFilters(updatedSelectedFilters);

    if (selectedItem.dependsOn) {
      try {
        // Fetch the cascaded filters for the dependent item
        const result = await getCascadedFilters(
          user.userId,
          'PostSearch',
          selectedItem.dependsOn,
          item.key,
        );

        // Update the records for the dependent filter
        if (result.data.filters.length > 0) {
          const updatedFilters = await updateRecordsByName(
            filtersState,
            selectedItem.dependsOn,
            result.data.filters[0].records,
          );
          setfiltersState(updatedFilters);

          // Automatically navigate to the dependent filter's menu item
          const dependentFilter = updatedFilters.find(
            filter => filter.name === selectedItem.dependsOn,
          );
          if (dependentFilter) {
            setSelectedItem(dependentFilter);
          }
        }
      } catch (error) {
        console.error('Error fetching cascaded filters:', error);
      }
    }
  };
  const handleRangeChange = range => {
    console.log('Range changed:', range);
  };
  const handleRangeBudgetChange = range => {
    const updatedSelectedFilters = {
      ...selectedFilters,

      Budget: {minValue: range.min, maxValue: range.max},
    };
    setSelectedFilters(updatedSelectedFilters);
  };
  const handleRangeAreaChange = range => {
    const updatedSelectedFilters = {
      ...selectedFilters,

      Area: {minValue: range.min, maxValue: range.max},
    };
    setSelectedFilters(updatedSelectedFilters);
  };
  const renderSettingsView = () => {
    let ComponentToRender = null;

    if (selectedItem != null) {
      if (selectedItem.name == 'Location') {
        //  let items=  selectedFilters[selectedItem.name]?selectedFilters[selectedItem.name][0]:null;

        ComponentToRender = (
          <LocalityTag
            selectedLocation={filterlocalities}
            onLocalityChange={onFiltersLocalityChange}
          />
        );
      }

      if (selectedItem.name == 'Budget') {
        let items = selectedFilters[selectedItem.name]
          ? selectedFilters[selectedItem.name]
          : null;

        ComponentToRender = (
          <RangeSlider
            min={0}
            max={1000000000}
            minValue={selectedItem.Value.minValue}
            maxValue={selectedItem.Value.maxValue}
            preselectedItem={items}
            onChange={handleRangeBudgetChange}
          />
        );
      }

      if (selectedItem.name == 'RegistrationYear') {
        let items = selectedFilters[selectedItem.name]
          ? selectedFilters[selectedItem.name][0]
          : null;

        ComponentToRender = (
          <SelectableFlatList
            data={selectedItem.records}
            numColumn="2"
            onSelectItem={SelectItem}
            preselectedItem={items}
            emptyessage="Please select a Location"
          />
        );
      }
      if (selectedItem.name == 'ManufactureYear') {
        let items = selectedFilters[selectedItem.name]
          ? selectedFilters[selectedItem.name][0]
          : null;

        ComponentToRender = (
          <SelectableFlatList
            data={selectedItem.records}
            numColumn="2"
            onSelectItem={SelectItem}
            preselectedItem={items}
            emptyessage="Please select a Location"
          />
        );
      }

      if (selectedItem.name == 'KmsDriven') {
        let items = selectedFilters[selectedItem.name]
          ? selectedFilters[selectedItem.name][0]
          : null;

        ComponentToRender = (
          <SelectableFlatList
            data={selectedItem.records}
            numColumn="1"
            onSelectItem={SelectItem}
            preselectedItem={items}
            emptyessage="Please select a Location"
          />
        );
      }

      if (selectedItem.name == 'Brand') {
        let items = selectedFilters[selectedItem.name]
          ? selectedFilters[selectedItem.name][0]
          : null;

        ComponentToRender = (
          <SelectableFlatList
            data={selectedItem.records}
            numColumn="2"
            onSelectItem={SelectItem}
            preselectedItem={items}
            emptyessage="Please select a Location"
          />
        );
      }
      if (selectedItem.name == 'Model') {
        let items = selectedFilters[selectedItem.name]
          ? selectedFilters[selectedItem.name][0]
          : null;

        ComponentToRender = (
          <SelectableFlatList
            data={selectedItem.records}
            numColumn="2"
            onSelectItem={SelectItem}
            preselectedItem={items}
          />
        );
      }

      if (selectedItem.name == 'FuelType') {
        let items = selectedFilters[selectedItem.name]
          ? selectedFilters[selectedItem.name][0]
          : null;

        ComponentToRender = (
          <SelectableFlatList
            data={selectedItem.records}
            numColumn="2"
            onSelectItem={SelectItem}
            preselectedItem={items}
          />
        );
      }

      if (selectedItem.name == 'BodyType') {
        let items = selectedFilters[selectedItem.name]
          ? selectedFilters[selectedItem.name][0]
          : null;

        ComponentToRender = (
          <SelectableFlatList
            data={selectedItem.records}
            numColumn="2"
            onSelectItem={SelectItem}
            preselectedItem={items}
          />
        );
      }
      if (selectedItem.name == 'Transmission') {
        let items = selectedFilters[selectedItem.name]
          ? selectedFilters[selectedItem.name][0]
          : null;

        ComponentToRender = (
          <SelectableFlatList
            data={selectedItem.records}
            numColumn="2"
            onSelectItem={SelectItem}
            preselectedItem={items}
          />
        );
      }

      if (selectedItem.name == 'Ownership') {
        let items = selectedFilters[selectedItem.name]
          ? selectedFilters[selectedItem.name][0]
          : null;

        ComponentToRender = (
          <SelectableFlatList
            data={selectedItem.records}
            numColumn="2"
            onSelectItem={SelectItem}
            preselectedItem={items}
          />
        );
      }
      if (selectedItem.name == 'SeatingCapacity') {
        let items = selectedFilters[selectedItem.name]
          ? selectedFilters[selectedItem.name][0]
          : null;

        ComponentToRender = (
          <SelectableFlatList
            data={selectedItem.records}
            numColumn="2"
            onSelectItem={SelectItem}
            preselectedItem={items}
          />
        );
      }
      if (selectedItem.name == 'RegistrationState') {
        let items = selectedFilters[selectedItem.name]
          ? selectedFilters[selectedItem.name][0]
          : null;

        ComponentToRender = (
          <SelectableFlatList
            data={selectedItem.records}
            numColumn="2"
            onSelectItem={SelectItem}
            preselectedItem={items}
          />
        );
      }
      if (selectedItem.name == 'RegistrationState') {
        let items = selectedFilters[selectedItem.name]
          ? selectedFilters[selectedItem.name][0]
          : null;

        ComponentToRender = (
          <SelectableFlatList
            data={selectedItem.records}
            numColumn="2"
            onSelectItem={SelectItem}
            preselectedItem={items}
          />
        );
      }

      if (selectedItem.name == 'Color') {
        let items = selectedFilters[selectedItem.name]
          ? selectedFilters[selectedItem.name][0]
          : null;

        ComponentToRender = (
          <SelectableFlatList
            data={selectedItem.records}
            numColumn="2"
            onSelectItem={SelectItem}
            preselectedItem={items}
          />
        );
      }

      if (selectedItem.name == 'PostedSince') {
        let items = selectedFilters[selectedItem.name]
          ? selectedFilters[selectedItem.name][0]
          : null;

        ComponentToRender = (
          <SelectableFlatList
            data={selectedItem.records}
            numColumn="2"
            onSelectItem={SelectItem}
            preselectedItem={items}
          />
        );
      }

      if (selectedItem.name == 'InsuranceStatus') {
        let items = selectedFilters[selectedItem.name]
          ? selectedFilters[selectedItem.name][0]
          : null;

        ComponentToRender = (
          <SelectableFlatList
            data={selectedItem.records}
            numColumn="2"
            onSelectItem={SelectItem}
            preselectedItem={items}
          />
        );
      }
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
  const handleClear = () => {
    const locationData = [
      {
        place: {
          ...AppLocation,
        },
      },
    ];
    setfilterlocalities(locationData);
    const updatedSelectedFilters = {
      Location: locationData,
      Budget: {minValue: 20000, maxValue: 500000000, isDefault: true},
    };
    setfilterlocalities(locationData);

    setSelectedFilters(updatedSelectedFilters);

    onApply(updatedSelectedFilters);
  };
  const RightIcon = () => (
    <TouchableOpacity onPress={handleApplyFilters}>
      <ZText numberOfLines={1} color={Color.primary} type={'M16'}>
        {'Apply'}
      </ZText>
    </TouchableOpacity>
  );
  const LeftIcon = () => (
    <TouchableOpacity onPress={handleClear}>
      <ZText numberOfLines={1} type={'M16'}>
        Reset All
      </ZText>
    </TouchableOpacity>
  );
  // console.log(filterData);
  return (
    //   <ZHeader title={'Filters'}
    //   isHideBack={true}
    //   rightIcon={<RightIcon />} />
    <VStack style={styles.sheetContent}>
      <Box style={{marginBottom: 'auto', minHeight: 50}}>
        <ZHeader
          isHideBack={true}
          rightIcon={<RightIcon />}
          isLeftIcon={<LeftIcon />}
        />
      </Box>
      <Box style={{width: '100%', flex: 2}}>
        <View style={styles.container}>
          <View style={styles.menuColumn}>
            <BottomSheetFlatList
              data={filtersState}
              renderItem={renderItem}
              keyExtractor={item => item.name}
              contentContainerStyle={styles.menuContainer}
              showsVerticalScrollIndicator={false}
            />
          </View>
          <BottomSheetScrollView style={styles.settingsColumn}>
            {renderSettingsView()}
          </BottomSheetScrollView>
        </View>
      </Box>
    </VStack>
  );
};

const styles = StyleSheet.create({
  sheetContent: {
    flex: 1,
    width: '100%',
  },
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
    width: '100%',
    paddingHorizontal: 10,
  },
  settingsView: {
    width: '100%',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
});

export default AppBaseContainer(CarFilterScreen, ' ', false);
