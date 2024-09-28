import { useNavigation } from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome'; // Import the icon library you're using (FontAwesome in this example)


const MultiSelectionTag = () => {
  const navigation = useNavigation()
  const bedroomOptions = [
    '3BHK',
    '4BHK',
    '4+BHK1',
  
  ];
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [selectedPreferredTenants, setSelectedPreferredTenants] = useState([]);
  const [filtersSelected, setFiltersSelected] = useState(false);
  const [selectedBedrooms, setSelectedBedrooms] = useState([]);
  const availabilityOptions = [
    'Immediate',
    'Within 15 Days',
    'Within 30 Days',
    'After 30 Days',
  ];
  const handleBedroomSelect = option => {
    if (selectedBedrooms.includes(option)) {
      // If the option is already selected, remove it from the array
      setSelectedBedrooms(prevSelected =>
        prevSelected.filter(item => item !== option),
      );
    } else {
      // If the option is not selected, add it to the array
      setSelectedBedrooms(prevSelected => [...prevSelected, option]);
    }

    // Log the selectedPreferredTenants array
    
  };
  const handlePreferredTenantSelect = option => {
    if (selectedPreferredTenants.includes(option)) {
      // If the option is already selected, remove it from the array
      setSelectedPreferredTenants(prevSelected =>
        prevSelected.filter(item => item !== option),
      );
    } else {
      // If the option is not selected, add it to the array
      setSelectedPreferredTenants(prevSelected => [...prevSelected, option]);
    }

    // Log the selectedPreferredTenants array
    
  };
  const [selectedFurnishing, setSelectedFurnishing] = useState([]);
  const [selectedParking, setSelectedParking] = useState([]);

  // Step 3: Implement functions to handle option selection and deselection
  const handleFurnishingSelect = option => {
    if (selectedFurnishing.includes(option)) {
      // If the option is already selected, remove it from the array
      setSelectedFurnishing(prevSelected =>
        prevSelected.filter(item => item !== option),
      );
    } else {
      // If the option is not selected, add it to the array
      setSelectedFurnishing(prevSelected => [...prevSelected, option]);
    }

    // Log the selectedFurnishing array
    
  };

  const handleParkingSelect = option => {
       if (selectedParking.includes(option)) {
      // If the option is already selected, remove it from the array
      setSelectedParking(prevSelected =>
        prevSelected.filter(item => item !== option),
      );
    } else {
      // If the option is not selected, add it to the array
      setSelectedParking(prevSelected => [...prevSelected, option]);
    }

    // Log the selectedParking array
    
  };

  const openFilterModal = () => {
    setFilterModalVisible(true);
  };

  // Function to handle tab presses
  const handleTabPress = tabName => {
    setSelectedTab(tabName);
    if (tabName === 'Sort') {
      setSortModalVisible(true);
    } else if (tabName === 'Premium') {
      setPremiumModalVisible(true);
    } else if (tabName === 'Filters') {
      openFilterModal(); // Open the filter modal
    }
  };

  // Function to close all modals
  const closeModal = () => {
    setSortModalVisible(false);
    setPremiumModalVisible(false);
    setPremiumPlanModalVisible(false); // Close the premium plan modal
    setUnlockModalVisible(false); // Close the unlock modal
  };
  const resetAllFilters = () => {
    setSelectedBedrooms([]); // Clear selected bedrooms
    setSelectedAvailability(null); // Clear selected availability
    setSelectedPreferredTenants([]); // Clear selected preferred tenants
    setSelectedFurnishing([]); // Clear selected furnishing
    setSelectedParking([]); // Clear selected parking
  };

  // Function to handle sort option selection
  const handleSortOptionSelect = option => {
    setSelectedSortOption(option);
    closeModal();
  };
  const handleAvailabilitySelect = option => {
    setSelectedAvailability(option);
  };

  // Function to clear filters
  const clearFilters = () => {
    setSelectedPremiumOptions({
      propertyAge: '',
      bathrooms: '',
      floors: [],
      showOnly: [],
    });
    setFiltersSelected(false);
  };

  const FilterItem = ({text}) => {
    return (
      <View style={styles.filterItem}>
        <View style={styles.filterContent}>
          <Icon name="check-square" size={20} color="#FCC306" />
          <Text style={styles.filterText}>{text}</Text>
        </View>
      </View>
    );
  };

  const FilterItemRow = ({children}) => {
    return <View style={styles.filterItemRow}>{children}</View>;
  };
  const toggleBedroomFilter = bedroom => {
    if (selectedBedrooms.includes(bedroom)) {
      // If the bedroom filter is already selected, remove it
      setSelectedBedrooms(prevSelected =>
        prevSelected.filter(item => item !== bedroom),
      );
    } else {
      // If the bedroom filter is not selected, add it
      setSelectedBedrooms(prevSelected => [...prevSelected, bedroom]);
    }
  };

  return (
    <ScrollView>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => resetAllFilters()}>
              <Icon name="refresh" size={20} color="black" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Tags</Text>
            <TouchableOpacity onPress={() => navigation.navigate('HomeTab')}>
              <Icon name="arrow-right" size={20} color="black" />
            </TouchableOpacity>
          </View>
          {/* Bedrooms Filter Options */}
          <Text style={styles.sectionHeader}>Bedrooms</Text>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={styles.optionRow}>
            {bedroomOptions.map(bedroom => (
              <TouchableOpacity
                key={bedroom}
                style={[
                  styles.optionButton,
                  selectedBedrooms.includes(bedroom) && styles.selectedOption,
                ]}
                onPress={() => toggleBedroomFilter(bedroom)}>
                <Text style={styles.optionText}>{bedroom}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Text style={styles.sectionHeader}>Availability</Text>
          <View horizontal style={styles.optionRow}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                selectedAvailability === 'Immediate' && styles.selectedOption,
              ]}
              onPress={() => handleAvailabilitySelect('Immediate')}>
              <Text style={styles.optionText}>Immediate</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionButton,
                selectedAvailability === 'Within 15 Days' &&
                  styles.selectedOption,
              ]}
              onPress={() => handleAvailabilitySelect('Within 15 Days')}>
              <Text style={styles.optionText}>Within 15 Days</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.optionRow}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                selectedAvailability === 'Within 30 Days' &&
                  styles.selectedOption,
              ]}
              onPress={() => handleAvailabilitySelect('Within 30 Days')}>
              <Text style={styles.optionText}>Within 30 Days</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionButton,
                selectedAvailability === 'After 30 Days' &&
                  styles.selectedOption,
              ]}
              onPress={() => handleAvailabilitySelect('After 30 Days')}>
              <Text style={styles.optionText}>After 30 Days</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionButton,
                selectedAvailability === 'Within 40 Days' &&
                  styles.selectedOption,
              ]}
              onPress={() => handleAvailabilitySelect('Within 40 Days')}>
              <Text style={styles.optionText}>Within 40 Days</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionButton,
                selectedAvailability === 'After 40 Days' &&
                  styles.selectedOption,
              ]}
              onPress={() => handleAvailabilitySelect('After 40 Days')}>
              <Text style={styles.optionText}>After 40 Days</Text>
            </TouchableOpacity>
          </ScrollView>

          <Text style={styles.sectionHeader}>Preferred Tenant</Text>
          <View style={styles.optionRow}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                selectedPreferredTenants.includes('Family') &&
                  styles.selectedOption,
              ]}
              onPress={() => handlePreferredTenantSelect('Family')}>
              <Text style={styles.optionText}>Family</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionButton,
                selectedPreferredTenants.includes('Bachelor') &&
                  styles.selectedOption,
              ]}
              onPress={() => handlePreferredTenantSelect('Bachelor')}>
              <Text style={styles.optionText}>Bachelor</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionButton,
                selectedPreferredTenants.includes('Company') &&
                  styles.selectedOption,
              ]}
              onPress={() => handlePreferredTenantSelect('Company')}>
              <Text style={styles.optionText}>Company</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionHeader}>Furnishing</Text>
          <View style={styles.optionRow}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                selectedFurnishing.includes('Full') && styles.selectedOption,
              ]}
              onPress={() => handleFurnishingSelect('Full')}>
              <Text style={styles.optionText}>Full</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionButton,
                selectedFurnishing.includes('Semi') && styles.selectedOption,
              ]}
              onPress={() => handleFurnishingSelect('Semi')}>
              <Text style={styles.optionText}>Semi</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionButton,
                selectedFurnishing.includes('None') && styles.selectedOption,
              ]}
              onPress={() => handleFurnishingSelect('None')}>
              <Text style={styles.optionText}>None</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionHeader}>Parking</Text>
          <View style={styles.optionRow}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                selectedParking.includes('2 Wheeler') && styles.selectedOption,
              ]}
              onPress={() => handleParkingSelect('2 Wheeler')}>
              <Text style={styles.optionText}>2 Wheeler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionButton,
                selectedParking.includes('4 Wheeler') && styles.selectedOption,
              ]}
              onPress={() => handleParkingSelect('4 Wheeler')}>
              <Text style={styles.optionText}>4 Wheeler</Text>
            </TouchableOpacity>
          </View>

          {/* Close Button */}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',

    color: '#333',
  },

  sectionHeader: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 10,
  },
  optionText: {
    fontSize: 12,
    marginBottom: 10,

    alignItems: 'center',
  },

  filtersContainer: {
    marginTop: 20,
  },

  filterText: {
    fontSize: 16,
    marginLeft: 10,
  },

  filterContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterItem: {
    flex: 1,
  },
  filterItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  // sectionHeader: {
  //   fontSize: 20,
  //   fontWeight: 'bold',
  //   marginTop: 10,
  //   marginBottom: 5, // Adjust as needed
  // },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Allow multiple rows of options
  },
  optionButton: {
    flex: 1,
    padding: 20,
    margin: 5,

    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  selectedOption: {
    backgroundColor: '#007dc5',
    color: 'white',
  },
  selectedOptionButton: {
    padding: 5,
    margin: 5,
    backgroundColor: '#FCC306',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedOptionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 5,
  },

  modalContent: {
    backgroundColor: 'white',
    padding: 20,
  },
  applyButton: {
    backgroundColor: 'blue',
    marginTop: 20,

    borderRadius: 5,
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default MultiSelectionTag;
