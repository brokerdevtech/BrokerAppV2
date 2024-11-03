/* eslint-disable react/no-unstable-nested-components */
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
import { RootState } from '../../../BrokerAppCore/redux/store/reducers';
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

const RealEstateFilterScreen: React.FC = ({
  AlertDialogShow,
  isPageSkeleton,
  toggleSkeletonoff,
  toggleSkeletonOn,

  navigation,

  color,
  route,
  pageTitle,
  toast,
  onReset,
  onApply,
  PopUPFilter,
}) => {
  const [menuItems, setMenuItems] = useState(MENU_ITEMS);
  const [imagesArray, setimagesArray] = useState<any>(route.params?.postVisual);
  const [Isvideo, setIsvideo] = useState<any>(route.params?.Isvideo);
  const [formValue, setformValue] = useState<any>(route.params?.formValue);
  const [filterlocalities, setfilterlocalities] = useState<any>();
  const AppLocation = useSelector((state: RootState) => state.AppLocation);
  const [selectedItem, setSelectedItem] = useState(null);

  const [selectedFilters, setSelectedFilters] = useState({});

  const [filtersState, setfiltersState] = useState([]);
  const user = useSelector(state => state.user.user);

  const {
    data: Filters,
    status: Filtersstatus,
    error: Filterserror,
    execute: Filterexecute,
  } = useApiRequest(getRealEstateFilters);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        await Filterexecute(user.userId, 'PostSearch');
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
              name: 'Area',
              displayName: 'Area',
              type: 'Area',
              filterOrder: 1,
              isMultiSelect: false,
              isMandatory: false,
              dependsOn: 'Developer',
              records: [],
              Value: {minValue: 0, maxValue: 5000},
            },
            ...filteredItems,
          ];

          // console.log("PopUPFilter");
          // console.log(PopUPFilter);

          if (PopUPFilter) {
            // Fetch filters based on Developer and localities.City
       

            setfilterlocalities(PopUPFilter.Location);

            const filtersForApp = await getDeveloper(
              filtersWithoutPostedSince,
              PopUPFilter.Location[0].place.City,
            );

            //   // Update state with the filtered data
            setfiltersState(filtersForApp);

            //   // Set the first available filter as the selected item
            if (filtersForApp.length > 0) {
              setSelectedItem(filtersForApp[0]);
            }
            // }
            //   // Prepare location data
            //   const locationData = [
            //     {
            //       place: {
            //         ...localities,

            //       },
            //     },
            //   ];
          
            //   // Uncomment if you need to set additional selected filters
            const updatedSelectedFilters = {
              ...selectedFilters,
              // Location: PopUPFilter.Location,
              // Budget: {minValue: 20000, maxValue: 500000000},
              // Area: {minValue: 0, maxValue: 5000},
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
      Budget: {minValue: 20000, maxValue: 500000000,isDefault:true},
      Area: {minValue: 0, maxValue: 5000,isDefault:true},
    
    };
    setfilterlocalities(locationData);

    setSelectedFilters(updatedSelectedFilters);

    onApply(updatedSelectedFilters);

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

          {item.isMandatory ? ' *' : ''}
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
   
  };
  const handleRangeBudgetChange = range => {


    const updatedSelectedFilters = {
      ...selectedFilters,

      Budget: {minValue: range.min, maxValue: range.max,isDefault:false},
    };
    setSelectedFilters(updatedSelectedFilters);
  };
  const handleRangeAreaChange = range => {


    const updatedSelectedFilters = {
      ...selectedFilters,

      Area: {minValue: range.min, maxValue: range.max,isDefault:false},
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
      if (selectedItem.name == 'Area') {
        let items = selectedFilters[selectedItem.name]
          ? selectedFilters[selectedItem.name]
          : null;

        ComponentToRender = (
          <RangeSlider
            min={0}
            max={50000}
            minValue={selectedItem.Value.minValue}
            maxValue={selectedItem.Value.maxValue}
            onChange={handleRangeAreaChange}
          />
        );
      }

      if (selectedItem.name == 'Developer') {
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
      if (selectedItem.name == 'Project') {
        let items = selectedFilters[selectedItem.name]
          ? selectedFilters[selectedItem.name][0]
          : null;

        ComponentToRender = (
          <SelectableFlatList
            data={selectedItem.records}
            numColumn="2"
            onSelectItem={SelectItem}
            preselectedItem={items}
            emptyessage="Please select a Project"
          />
        );
      }
      if (selectedItem.name == 'PropertyType') {
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

      if (selectedItem.name == 'Bedroom') {
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
      if (selectedItem.name == 'Bathroom') {
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

      if (selectedItem.name == 'Balcony') {
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
      if (selectedItem.name == 'Amenities') {
        let items = selectedFilters[selectedItem.name]
          ? selectedFilters[selectedItem.name]
          : null;

        ComponentToRender = (
          <MultiSelectFlatList
            data={selectedItem.records}
            onSelectItem={SelectMultiItem}
            preselectedItem={items}
            numColumn="2"
          />
        );
      }
      if (selectedItem.name == 'TransactionType') {
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
      if (selectedItem.name == 'PropertyAge') {
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

      if (selectedItem.name == 'PropertyStatus') {
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
      if (selectedItem.name == 'ConstructionStatus') {
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
      if (selectedItem.name == 'NearbyFacilities') {
        let items = selectedFilters[selectedItem.name]
          ? selectedFilters[selectedItem.name]
          : null;

        ComponentToRender = (
          <MultiSelectFlatList
            data={selectedItem.records}
            onSelectItem={SelectMultiItem}
            preselectedItem={items}
            numColumn="2"
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
    <TouchableOpacity onPress={handleApplyFilters} style={{marginRight:10}}>
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

export default AppBaseContainer(RealEstateFilterScreen, ' ', false);
