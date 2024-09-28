/* eslint-disable no-catch-shadow */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
// src/screens/SettingsScreen.tsx
import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
  FlatList,
  Platform,
  Image,
  Dimensions,
} from 'react-native';
import {Back} from '../assets/svg';

import {useDispatch, useSelector} from 'react-redux';

import {styles} from '../themes';

import MultiSelectTag from './filters/MultiSelectTag';
import SingleSelectTag from './filters/SingleSelectTag';
import ZText from './ZText';
import FastImage from '@d11/react-native-fast-image';
import ZSafeAreaView from './ZSafeAreaView';
import ZHeader from './ZHeader';
import LocalityTag from './LocalityTag';
import Video from 'react-native-video';
import {RootState} from '../../BrokerAppcore/redux/store/reducers';
import {useApiRequest} from '../hooks/useApiRequest';
import {
  getCascadedFilters,
  getFilterTags,
} from '../../BrokerAppcore/services/new/filterTags';

const devicewidth = Dimensions.get('window').width;
let Selectedfiltersobj = {tags: []};
const FilterTagsScreen: React.FC = ({
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
  // let filters = {tags:[]};
  // filters.tags =[];

  const dispatch = useDispatch();
  const [Postfilter, setPostfilter] = useState({});

  // const [filters, setfilters] = useState({tags:[]});
  const [ApifilterTags, setApiFilterTags] = useState([]);
  const [filterTags, setFilterTags] = useState([]);
  const visualData = route.params?.visualData;
  const Isvideo = route.params?.Isvideo ? route.params?.Isvideo : false;
  const formValue = route.params?.formValue;
  const user = useSelector((state: RootState) => state.user.user);
  const [error, setError] = useState(null);
  const [resetChild, setResetChild] = useState(false);
  const [childState, setChildState] = useState({});
  const [localities, setLocalities] = useState({});
  const [loading, setLoading] = useState(false);
  const {
    data: filterdata,
    status: filterstatus,
    error: filtererror,
    execute: filterexecute,
  } = useApiRequest(getFilterTags);
  const {
    data: filterCascadedata,
    status: filterCascadestatus,
    error: filterCascadeerror,
    execute: filterCascadeexecute,
  } = useApiRequest(getCascadedFilters);
  const arrowbackSubmit = () => {
    AlertDialogShow('Data will be lost', true);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // First, wait for filterexecute to complete
        await filterexecute(user.userId, 'post');

        // // Now fetch the filter data after filterexecute is done
        // await Tagfetching();
      } catch (error) {
        console.error('Error occurred:', filtererror);
        setError(filtererror);
      } finally {
        setLoading(false); // Make sure loading is set to false after the process is done
      }
    };

    // Make sure user.userId is available before calling fetchData
    if (user?.userId) {
      fetchData();
    }
  }, [user?.userId]);
  useEffect(() => {
    if (resetChild) {
      setChildState({});

      setResetChild(false);
    }
  }, [resetChild]);
  useEffect(() => {
    const backAction = () => {
      arrowbackSubmit();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove(); // Cleanup the event listener when the component unmounts
  }, [navigation]);

  
  
  useEffect(() => {
    const fetchData = async () => {
      try {
    

        // Now fetch the filter data after filterexecute is done
        await Tagfetching();
      } catch (error) {
        console.error('Error occurred:', filtererror);
        setError(filtererror);
      } finally {
        setLoading(false); // Make sure loading is set to false after the process is done
      }
    };

    // Make sure user.userId is available before calling fetchData
 
      fetchData();

  }, [filterdata]);
  
  // Add user?.userId as a dependency

  const Tagfetching = async () => {
    try {
      if (filterdata) {
        let postobj: any = {};

        filterdata.data.filters.forEach((item: any) => {
          if (item.name !== 'PostedSince' && item.name !== 'PropertySizeUnit') {
            postobj[item.name] = {
              type: item.type,
              filterOrder: item.filterOrder,
              isMultiSelect: item.isMultiSelect,
              Mandatory: item.isMandatory,
              isvalid: item.isMandatory ? false : true,
              dependsOn: item.dependsOn,
              records: [],
            };
          }
        });

        setPostfilter(postobj);

        // Filter out 'PostedSince' and 'PropertySizeUnit'
        const filteredData = filterdata.data.filters.filter(
          (p: any) => p.name !== 'PostedSince' && p.name !== 'PropertySizeUnit',
        );

        setFilterTags({...filterdata.data, filters: filteredData});
        setApiFilterTags({...filterdata.data, filters: filteredData});
      }
    } catch (error) {
      console.error('Error fetching filter data:', error);
    }
  };

  const clearDependentRecordsFromIndex = (filters, dependsOn) => {
    filters[dependsOn].records = [];
    if (filters[dependsOn].dependsOn != '') {
      clearDependentRecordsFromIndex(filters, filters[dependsOn].dependsOn);
    }
  };
  const flattenDependencies = (filters, filterName) => {
    const dependencies = [];

    const filter = filters.find(f => f.name === filterName);

    if (filter && filter.dependsOn !== '') {
      dependencies.push(filter.dependsOn);
      dependencies.push(...flattenDependencies(filters, filter.dependsOn));
    }

    return dependencies;
  };

  const toggelMandatoryFilters = (data, filterName, type, obj) => {
    if (filterName != 'City') {
      if (data.length > 0) {
        if (obj[filterName].Mandatory == true) {
          obj[filterName].isvalid = true;
        }
      } else {
        if (obj[filterName].Mandatory == true) {
          obj[filterName].isvalid = false;
        }
      }
    }
    return obj;
  };
  const toggelMandatoryFiltersSingle = (data, filterName, type, obj) => {
    if (filterName != 'City') {
      if (Object.keys(data).length > 0) {
        if (obj[filterName].Mandatory == true) {
          obj[filterName].isvalid = true;
        }
      } else {
        if (obj[filterName].Mandatory == true) {
          obj[filterName].isvalid = false;
        }
      }
    }
    return obj;
  };

  const onSelect = async (
    data,
    filterName,
    type,
    filter,
    fliterName = 'post',
  ) => {
    if (filter.dependsOn != '') {
      await filterCascadeexecute(
        user.userId,
        fliterName,
        filter.dependsOn,
        data.key,
      );
      console.log(filterCascadedata, 'filter');
      let newrecords: any[] = [];
      if (filterCascadedata.data.filters.length > 0) {
        newrecords = filterCascadedata.data.filters[0].records;
      }
      let obj: any = Postfilter;
      clearDependentRecordsFromIndex(obj, filter.dependsOn);
      // obj[filter.dependsOn].records=[];

      setPostfilter(previousPostfilter => {
        // Calculate the new state based on the previous state.
        const updatedPostfilter = obj;

        // // You can also perform additional actions, like logging, here.
        //

        return updatedPostfilter; // Return the new state value.
      });

      const flattenedDependencies = flattenDependencies(
        filterTags.filters,
        filter.dependsOn,
      );
      const updatedData = filterTags.filters.map(item => {
        if (item.name === filter.dependsOn) {
          // Update the object if the name matches

          return {
            ...item,
            records: newrecords,
          };
        }
        if (flattenedDependencies.includes(item.name)) {
          // Update the object if the name matches

          return {
            ...item,
            records: [],
          };
        }
        return item;
      });
      setFilterTags({...filterTags, filters: updatedData});
    }

    let obj: any = Postfilter;

    if (type === 'Single') {
      obj = toggelMandatoryFiltersSingle(data, filterName, type, obj);

      if (filterName != 'City') obj[filterName].records = [data];
    } else {
      obj = toggelMandatoryFilters(data, filterName, type, obj);
      if (filterName != 'City') obj[filterName].records = data;
    }

    setPostfilter(previousPostfilter => {
      // Calculate the new state based on the previous state.
      const updatedPostfilter = obj;

      // You can also perform additional actions, like logging, here.

      return updatedPostfilter; // Return the new state value.
    });
  };
  const onFiltersLocalityChange = Localitys => {
    setLocalities(Localitys);

    let DeveloperData = {
      key: Localitys.city,
      parentFilterId: 'Delhi',
      value: 'Delhi',
    };
    let DeveloperfilterName = 'City';
    let Developertype = 'Single';
    let Developerfilter = {
      dependsOn: 'Developer',
      displayName: 'City',
      filterOrder: 3,
      isMandatory: false,
      isMultiSelect: false,
      name: 'City',
      records: [],
      type: 'dropdown',
    };
    //setIsLoading(true);
    onSelect(
      DeveloperData,
      DeveloperfilterName,
      Developertype,
      Developerfilter,
      'PostSearch',
    );
  };
  const resetAllFilters = () => {
    setResetChild(true);
  };
  const CheckMandatoryFilters = () => {
    let obj: any = Postfilter;
    let mandatoryFilters: any = [];
    if (Object.keys(localities).length === 0) {
      mandatoryFilters.push('Locality');
    }
    for (const property in obj) {
      if (obj.hasOwnProperty(property)) {
        if (obj[property].isvalid == false) {
          mandatoryFilters.push(property.replace(/([a-z])([A-Z])/g, '$1 $2'));
        }
      }
    }

    if (mandatoryFilters.length > 0) {
      const ToastDetails = {
        title: 'Filter are Mandatory',
        variant: 'subtle',
        description: mandatoryFilters.join(', '),
      };
      const id = 'test-toast';
      if (!toast.isActive(id)) {
        toast.show({
          id,
          placement: 'top',
          render: () => {
            // return <ToastAlert {...ToastDetails}></ToastAlert>;
          },
        });
      }
      return false;
    } else {
      return true;
    }
  };
  const navigateToNextScreen = () => {
    let check = CheckMandatoryFilters();

    if (check) {
      navigation.navigate('PropertyPostPreview', {
        filters: Postfilter,
        postVisual: visualData,
        Isvideo: Isvideo,
        localities: localities,
        formValue: formValue,
      });
    }

    // navigation.navigate('SelectedTagsScreen',{filters, postVisual: visualData});
  };

  const renderFilterComponents = () => {
    //
    //
    // if (!filterTags || filterTags.length === 0) {
    //   return null;
    // }

    return filterTags.filters
      ?.sort((a, b) => a.filterOrder - b.filterOrder)
      .map((filter: any) => {
        const {
          displayName,
          name,
          records,
          isMultiSelect,
          dependsOn,
          isMandatory,
        } = filter;
        //
        if (isMultiSelect) {
          return (
            <MultiSelectTag
              key={displayName}
              data={records}
              selecteditem={filter}
              onSelect={(selectedOption, filterName, selecteditem) =>
                onSelect(selectedOption, filterName, 'Multi', selecteditem)
              }
              filterName={name}
              displayName={displayName}
              filterId={'key'}
              filterDisplayName={'value'}
              resetAllFilters={childState}
            />
          );
        } else {
          return (
            <SingleSelectTag
              key={displayName}
              data={records}
              selecteditem={filter}
              displayName={displayName}
              onSelect={(selectedOption, filterName, selecteditem) =>
                onSelect(selectedOption, filterName, 'Single', selecteditem)
              }
              filterName={name}
              filterId={'key'}
              filterDisplayName={'value'}
              resetAllFilters={childState}
            />
          );
        }
      });
  };
  const LeftIcon = () => {
    return (
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <View
          style={{
            // ...styles.appTitleMain,
            // color: '#007acc',
            padding: 8,
            borderWidth: 1,
            borderColor: '#E5E5E5',
            borderRadius: 40,
          }}>
          <Back accessible={true} accessibilityLabel="Back" />
        </View>
      </TouchableOpacity>
    );
  };
  const RightIcon = () => {
    return (
      <TouchableOpacity
        style={{marginRight: 15}}
        onPress={() => {
          navigateToNextScreen();
        }}>
        <ZText numberOfLines={1} color={'#BC4A4F'} type={'b16'}>
          {'Next'}
        </ZText>
      </TouchableOpacity>
    );
  };
  const renderItem = ({item, index}) => (
    <View style={localStyles.card}>
      {/* <Text>{item.destinationPathuri}</Text> */}
      {Platform.OS == 'ios' ? (
        <Image source={{uri: item.destinationPath}} style={localStyles.image} />
      ) : (
        <FastImage
          source={{uri: item.destinationPath}}
          style={localStyles.image}
        />
      )}
    </View>
    // <View style={localStyles.card}>
    //   <TouchableOpacity>
    //     <Image
    //       source={{uri: item.destinationPathuri}}
    //       style={localStyles.imagecard}
    //       // resizeMode="cover"
    //     />
    //   </TouchableOpacity>
    // </View>
  );
  const Pagination = ({index, length}) => {
    return (
      <View style={localStyles.paginationWrapper}>
        {Array.from({length: length}, (_, i) => (
          <View
            key={i}
            style={[localStyles.dot, index === i && localStyles.activeDot]}
          />
        ))}
      </View>
    );
  };
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <ZSafeAreaView>
      <ZHeader
        title={'Additional Details'}
        rightIcon={<RightIcon />}
        isHideBack={true}
        isLeftIcon={<LeftIcon />}
      />
      {/* <EditHeader
        title={'Tags'}
        onNextClick={() => {
          navigateToNextScreen();
        }}
        button={'Next'}
      /> */}

      <ScrollView
       keyboardShouldPersistTaps={"always"}
        bounces={false}
        showsVerticalScrollIndicator={false}
        style={localStyles.root}>
        <View>
          {/* {Isvideo == false && (
            <>
              <FlatList
                data={visualData}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={({nativeEvent}) => {
                  const index = Math.round(
                    nativeEvent.contentOffset.x /
                      nativeEvent.layoutMeasurement.width,
                  );
                  setActiveIndex(index);
                }}
                contentContainerStyle={localStyles.listContainer}
                // contentContainerStyle={
                //   imagesArray.length > 1 && localStyles.listContainer
                // }
                renderItem={renderItem}
                // renderItem={
                //   imagesArray.length === 1 ? renderSinglItem : renderItem
                // }

                keyExtractor={item => item.id}
              />
              <Pagination index={activeIndex} length={visualData.length} />
            </>
          )} */}

          {/* {Isvideo == true && (
            <Video
              source={{uri: visualData.uri}}
              repeat={false}
              style={localStyles.media}
              paused={true}
              playWhenInactive={false}
              resizeMode="contain"
              controls={false}
            />
          )} */}
        </View>
        <View style={{marginBottom: 20, marginTop: 30}}>
          <LocalityTag
            isMandatory={true}
            onLocalityChange={onFiltersLocalityChange}></LocalityTag>
        </View>
        {renderFilterComponents()}
      </ScrollView>
    </ZSafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  root: {
    ...styles.flex,

    ...styles.mb40,
    // ...styles.mt40,
    paddingLeft: 15,
    paddingRight: 15,
  },
  paginationWrapper: {
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  media: {
    width: '100%',
    height: 200,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
    margin: 4,
  },
  activeDot: {
    backgroundColor: '#FFf',
  },
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
  listContainer: {
    alignItems: 'center',
    justifyContent: 'center',
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

  // modalContent: {
  //   backgroundColor: 'white',
  //   padding: 20,
  // },
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
  card: {
    width: 400, // Card takes up full width of the screen
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor:'red'
    // Add additional styling for the card here
  },
  image: {
    width: 400, // Slightly less than full width for card padding effect
    height: devicewidth - 200, // Making the image square, but you can adjust as needed
    resizeMode: 'cover',
    borderRadius: 10, // Adds rounded corners to the image
    // Add additional styling for the image here
  },
});
export default FilterTagsScreen;
