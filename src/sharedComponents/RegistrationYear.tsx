import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView } from 'react-native';
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectFlatList, SelectInput, SelectItem, SelectPortal, SelectScrollView, SelectTrigger } from '../../components/ui/select';
import { ActionsheetItem, ActionsheetItemText } from '../../components/ui/actionsheet';


const RegistrationYear = ({ startYear = 1990, endYear = new Date().getFullYear(), onYearChange }) => {
  const [selectedYear, setSelectedYear] = useState(endYear);
  const [searchText, setSearchText] = useState('');
  // Generate an array of years from startYear to endYear
  const years = [];
  for (let year = endYear; year >= startYear; year--) {
    years.push(year);
  }
  const filteredYears = years.filter((year) =>
    year.toString().includes(searchText)
  );
  const handleYearChange = (itemValue) => {
    setSelectedYear(itemValue);
    if (onYearChange) {
      onYearChange(itemValue);
    }
  };
  const [showActionsheet, setShowActionsheet] = React.useState(false)
  const handleClose = () => setShowActionsheet(false)
  const Item = React.useCallback(
    ({ Item }) => (
        <SelectItem  key={Item} label={Item.toString()} value={Item.toString()} />
    ),
    [handleClose]
  )
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Registration Year</Text>

      <Select
             selectedValue={"Real Estate Sector"}
              onValueChange={(selectedValue: any) => {
                console.log('Selected category ID:', selectedValue); // Log the category ID
                // setFieldValue('BrokerCategory', selectedValue);
                // handleBlur('BrokerCategory');
              }}>
              <SelectTrigger variant="outline" size="md" style={styles.input}>
                <SelectInput placeholder="Select option" />
              </SelectTrigger>
              <SelectPortal snapPoints={[50]} preventScroll={false} >

            <KeyboardAvoidingView
          behavior="position"
          style={{
            position: "relative",
            flex: 1,
            justifyContent: "flex-end",
          }}
        >   
                <SelectBackdrop />
       
                <SelectContent style={{  flexShrink: 1}}>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  <TextInput
              style={styles.searchInput}
              placeholder="Search year..."
              value={searchText}
              onChangeText={setSearchText}
            />
                  <SelectFlatList
            data={filteredYears}
            renderItem={({ item }) => <Item Item={item.toString()} />}
            keyExtractor={(item) => item.toString()}
           
            contentContainerStyle={{
             
                flexGrow: 1,
                paddingBottom:20
              }}
          />


            
                </SelectContent>
              </KeyboardAvoidingView>
              </SelectPortal>
            </Select>



     
    </View>
  );
};

const styles = StyleSheet.create({
    searchInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 8,
        margin: 10,
      },
  container: {
    margin: 10,
  
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  select: {
    height: 50,
    width: '100%',
  },
});

export default RegistrationYear;