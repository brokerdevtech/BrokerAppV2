import {useSelector} from 'react-redux';
import React, {useState, useEffect} from 'react';

import {colors, styles} from '../themes';
import {
  FlatList,
  Keyboard,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {RootState} from '../../BrokerAppcore/redux/store/reducers';
import {
  getPlaceDataFromID,
  searchLocation,
} from '../../BrokerAppcore/services/googleService';
import {HStack} from '../../components/ui/hstack';
import ZText from './ZText';
import NoDataFound from './NoDataFound';

const DEBOUNCE_DELAY = 300;

function LocationList(props: any) {
  const user = useSelector((state: RootState) => state.user.user);
  const {searchText, setLoading, setLoaction, SetCityFilter} = props;
  const [userLists, setuserLists] = useState([]);
  const [issearch, setissearch] = useState(false);

  useEffect(() => {
    SetCityFilter;
    setissearch(true);
  }, [userLists]);
  useEffect(() => {
    let timeoutId;

    // Define the debounce function
    const debounceSearch = async () => {
      try {
        setLoading(true);
        setissearch(false);
        if (searchText.length >= 3) {
          const result = await searchLocation(searchText, SetCityFilter);

          setLoading(false);
          if (result) {
            setuserLists(result);
          } else {
            setLoading(false);
            setuserLists([]);
          }
        } else {
          setLoading(false);
          setuserLists([]);
        }
      } catch (error) {
        setLoading(false);
        setuserLists([]);
        console.error('Error fetching data:', error);
      }
    };

    // Use setTimeout to debounce the search function
    clearTimeout(timeoutId);
    timeoutId = setTimeout(debounceSearch, DEBOUNCE_DELAY);

    // Clean up the timeout when the component unmounts or when searchText changes
    return () => {
      clearTimeout(timeoutId); // Clear the timeout to prevent outdated searches
    };
  }, [searchText]);
  const onPressPlace = async item => {
    Keyboard.dismiss(); //
    let itemLoaction = await getPlaceDataFromID(item.placeId);
    //
    setLoaction(itemLoaction);
  };

  return (
    <ScrollView keyboardShouldPersistTaps={true}>
      <FlatList
        keyboardShouldPersistTaps={true}
        data={userLists}
        renderItem={({item, index}) => (
          <View>
            <TouchableWithoutFeedback onPress={() => onPressPlace(item)}>
              <HStack
                space={[2, 3]}
                style={localStyles.listitem}
                justifyContent="space-between">
                <ZText>{item.name} </ZText>
              </HStack>
            </TouchableWithoutFeedback>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
      />
      {userLists.length < 1 && searchText.length > 3 && issearch && (
        <NoDataFound />
      )}
      {userLists.length < 1 && searchText.length < 3 && (
        <ZText
          type={'s18'}
          align={'center'}
          style={styles.pb20}
          color={colors.primary}>
          {`Enter minimum 3 characters to search`}
        </ZText>
      )}
    </ScrollView>
  );
}

const localStyles = StyleSheet.create({
  listitem: {
    padding: 15,
    borderColor: '#E0E0E0',
    borderBottomWidth: 1,
  },
});
export default LocationList;
