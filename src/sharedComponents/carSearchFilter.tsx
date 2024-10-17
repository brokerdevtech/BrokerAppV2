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
import { useApiRequest } from '../hooks/useApiRequest';
import { getCarPostCascadedFilters, getCarPostFilters } from '../../BrokerAppCore/services/new/postServices';
import SelectableFlatList from './filters/SelectableFlatList';
import AppBaseContainer from '../hoc/AppBaseContainer_old';

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

const CarFilterScreen : React.FC = ({
  AlertDialogShow,
  isPageSkeleton,
  toggleSkeletonoff,
  toggleSkeletonOn,

  navigation,

  color,
  route,
  pageTitle,
  toast,
}) => {
  const [menuItems, setMenuItems] = useState(MENU_ITEMS);
  const [imagesArray, setimagesArray] = useState<any>(route.params?.postVisual);
  const [Isvideo, setIsvideo] = useState<any>(route.params?.Isvideo);
  const [formValue, setformValue] = useState<any>(route.params?.formValue);
  const [localities, setlocalities] = useState<any>(route.params?.localities);




  const [selectedItem, setSelectedItem] = useState(null);

  const [selectedFilters, setSelectedFilters] = useState({});


  const [CarfiltersState, setCarfiltersState] = useState([]);
  const user = useSelector(state => state.user.user);
 

  const {data:CarFilters ,status:CarFiltersstatus, error:CarFilterserror, execute:CarFilterexecute} = useApiRequest(getCarPostFilters);

 useEffect(() => {
    const fetchFilters = async () => {
      try {
        await CarFilterexecute(user.userId, 'Post');
        // console.log(selectedFilters);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchFilters();
  }, [user.userId]);


  useEffect(() => {
    // This useEffect runs when CarFilters data changes
    if (CarFilters != null) {
 
  
      // Filter out the 'PostedSince' item from the CarFilters data
      const filtersWithoutPostedSince = CarFilters.data.filters.filter(filter => filter.name !== 'PostedSince');
  
      // Set the updated filters into the state
      setSelectedFilters({});
      setCarfiltersState(filtersWithoutPostedSince);
      setSelectedItem(filtersWithoutPostedSince[0]); // Set the first available filter as the selected item
    }
  }, [CarFilters]);

  
  const handleApplyFilters = () => {
    // Check for mandatory filters
    const missingMandatoryFilters = CarfiltersState
    .filter(item => item.isMandatory && !selectedFilters[item.name])
    .map(item => item.name); // Collect the names of the missing filters

  // If there are missing mandatory filters, show an alert and exit
  if (missingMandatoryFilters.length > 0) {
    alert(`Please select the following mandatory filters: ${missingMandatoryFilters.join(', ')}`);
    return;
  }

   navigation.navigate('CarPostPreview', {
    filters: selectedFilters,
    postVisual: imagesArray,
    Isvideo: Isvideo,
    localities: localities,
    formValue: formValue,
  });

    // Proceed with your API call or other logic here
  };







  const renderItem = ({ item }) => {
    // Log the item for debugging purposes
    const isSelected = item.name === selectedItem?.name; 
  
    return (
      <TouchableOpacity
        key={item.name} // Ensure that `item.name` is unique for each item
        onPress={() => setSelectedItem(item)}
        style={[
          styles.menuItem,
          isSelected ? styles.selectedMenuItem : null,// Correct comparison
        ]}
      >
        <Text style={styles.menuItemText}>{item.displayName}

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
const SelectItem = async (item) => {
 

  // Create a copy of the selected filters object
  let updatedSelectedFilters = { ...selectedFilters };
  updatedSelectedFilters[selectedItem.name] = [item];
  setSelectedFilters(updatedSelectedFilters);

  if (selectedItem.dependsOn) {
    try {
      // Fetch the cascaded filters for the dependent item
      const result = await getCarPostCascadedFilters(user.userId, 'Post', selectedItem.dependsOn, item.key);
      
      // Update the records for the dependent filter
      const updatedFilters = await updateRecordsByName(CarfiltersState, selectedItem.dependsOn, result.data.data.filters[0].records);
      setCarfiltersState(updatedFilters);

      // Automatically navigate to the dependent filter's menu item
      const dependentFilter = updatedFilters.find(filter => filter.name === selectedItem.dependsOn);
      if (dependentFilter) {
        setSelectedItem(dependentFilter);
      }

    } catch (error) {
      console.error('Error fetching cascaded filters:', error);
    }
  }
};

  const renderSettingsView = () => {
   
    let ComponentToRender=null;

   if(selectedItem!=null){
if(selectedItem.name=="Brand")
   {
    let items=  selectedFilters[selectedItem.name]?selectedFilters[selectedItem.name][0]:null;

    ComponentToRender=<SelectableFlatList data={selectedItem.records} numColumn="2"  onSelectItem={SelectItem}  preselectedItem={items}  ></SelectableFlatList>

   }
   if(selectedItem.name=="Model")
    {
     let items=  selectedFilters[selectedItem.name]?selectedFilters[selectedItem.name][0]:null;
  
     ComponentToRender=<SelectableFlatList data={selectedItem.records} numColumn="2"  onSelectItem={SelectItem}  preselectedItem={items}  ></SelectableFlatList>
 
    }
  if(selectedItem.name=="FuelType")
    {
   let items=  selectedFilters[selectedItem.name]?selectedFilters[selectedItem.name][0]:null;
 
     ComponentToRender=<SelectableFlatList data={selectedItem.records} numColumn="2"  onSelectItem={SelectItem}  preselectedItem={items}  ></SelectableFlatList>
 
    }

    if(selectedItem.name=="BodyType")
      {
     let items=  selectedFilters[selectedItem.name]?selectedFilters[selectedItem.name][0]:null;
  ;
       ComponentToRender=<SelectableFlatList data={selectedItem.records} numColumn="2"  onSelectItem={SelectItem}  preselectedItem={items}  ></SelectableFlatList>
   
      }
      if(selectedItem.name=="Transmission")
        {
       let items=  selectedFilters[selectedItem.name]?selectedFilters[selectedItem.name][0]:null;
   
         ComponentToRender=<SelectableFlatList data={selectedItem.records} numColumn="2"  onSelectItem={SelectItem}  preselectedItem={items}  ></SelectableFlatList>
     
        }

        if(selectedItem.name=="Ownership")
          {
         let items=  selectedFilters[selectedItem.name]?selectedFilters[selectedItem.name][0]:null;
       
           ComponentToRender=<SelectableFlatList data={selectedItem.records} numColumn="2"  onSelectItem={SelectItem}  preselectedItem={items}  ></SelectableFlatList>
       
          }
          if(selectedItem.name=="SeatingCapacity")
            {
           let items=  selectedFilters[selectedItem.name]?selectedFilters[selectedItem.name][0]:null;
   
             ComponentToRender=<SelectableFlatList data={selectedItem.records} numColumn="2"  onSelectItem={SelectItem}  preselectedItem={items}  ></SelectableFlatList>
         
            }
            if(selectedItem.name=="RegistrationState")
              {
             let items=  selectedFilters[selectedItem.name]?selectedFilters[selectedItem.name][0]:null;
          
               ComponentToRender=<SelectableFlatList data={selectedItem.records} numColumn="2"  onSelectItem={SelectItem}  preselectedItem={items}  ></SelectableFlatList>
           
              }
              if(selectedItem.name=="RegistrationState")
                {
               let items=  selectedFilters[selectedItem.name]?selectedFilters[selectedItem.name][0]:null;
          
                 ComponentToRender=<SelectableFlatList data={selectedItem.records} numColumn="2"  onSelectItem={SelectItem}  preselectedItem={items}  ></SelectableFlatList>
             
                }

                if(selectedItem.name=="Color")
                  {
                 let items=  selectedFilters[selectedItem.name]?selectedFilters[selectedItem.name][0]:null;
         
                   ComponentToRender=<SelectableFlatList data={selectedItem.records} numColumn="2"  onSelectItem={SelectItem}  preselectedItem={items}  ></SelectableFlatList>
               
                  }
                  if(selectedItem.name=="InsuranceStatus")
                    {
                   let items=  selectedFilters[selectedItem.name]?selectedFilters[selectedItem.name][0]:null;
                
                     ComponentToRender=<SelectableFlatList data={selectedItem.records} numColumn="2"  onSelectItem={SelectItem}  preselectedItem={items}  ></SelectableFlatList>
                 
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
            data={CarfiltersState}
            renderItem={renderItem}
            keyExtractor={item => item.name}
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
    paddingHorizontal: 10,
  },
  settingsView: {
    width: '100%',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
});

export default AppBaseContainer(CarFilterScreen,' ', false);
