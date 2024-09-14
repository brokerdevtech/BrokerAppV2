// src/screens/SettingsScreen.tsx
import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
  FlatList,
  Image,
  Platform,
  Dimensions,
} from 'react-native';
import {Back, Discount, Property, Verified, Virtual} from '../assets/svgs';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SingleSelectTag from '../components/filters/SingleSelectTag';
import MultiSelectTag from '../components/filters/MultiSelectTag';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the icon library you're using (FontAwesome in this example)
import {useNavigation} from '@react-navigation/native';
import SelectedTagsScreen from './SelectedTagsScreen';
import {useDispatch, useSelector} from 'react-redux';
import AppBaseContainer from '../Hoc/AppBaseContainer';
import {getFilterTags} from '../../BrokerAppCore/services/filterTags';
import ToastAlert from '../components/common/ToastAlert';
import ZSafeAreaView from '../components/common/ZSafeAreaView';
import ZHeader from '../components/common/ZHeader';
import {colors, styles} from '../themes';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {moderateScale} from '../common/constants';
import ZText from '../components/common/ZText';
import {getCascadedFilters} from '../../BrokerAppCore/services/postService';
import {RootState} from '../../BrokerAppCore/redux/store/reducers';
import EditHeader from '../components/postImage/EditHader';
import LocalityTag from '../components/LocalityTag';
import {object} from 'yup';
import CategorySelector from '../components/CategorySelector';
import Video from 'react-native-video';
import FastImage from 'react-native-fast-image';
import {Formik} from 'formik';
import {Box, HStack, Input, Select, Stack, Switch} from 'native-base';
import * as Yup from 'yup';
import PropertyForm from './Form/PropertyForm';
import GenericForm from './Form/GenericForm';

const genericvalidationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  Description: Yup.string().required('Description is required'),
  Location: Yup.string().required('Location is required'),
});
//const AVATAR_URL = "https://www.realmenrealstyle.com/wp-content/uploads/2023/03/The-Side-Part.jpg";
const devicewidth = Dimensions.get('window').width;

let Selectedfiltersobj = {tags: []};
const PostWizardScreen: React.FC = ({
  AlertDialogShow,
  isPageSkeleton,
  toggleSkeletonoff,
  toggleSkeletonOn,
  setLoading,
  navigation,
  user,
  color,
  route,
  pageTitle,
  toast,
}) => {
  // let filters = {tags:[]};
  // filters.tags =[];

  const visualData = route.params?.imageData;
  const Isvideo = route.params?.Isvideo ? route.params?.Isvideo : false;
  const [error, setError] = useState(null);
  const [localities, setLocalities] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const PropertyformikRef = useRef(null);
  const genericformikRef = useRef(null);

  const categories = [
    {value: 'property', label: 'Property', disabled: false},
    {value: 'generic', label: 'Generic', disabled: false},
    {value: 'car', label: 'Car', disabled: true},
  ];
  const [selectedcategory, setselectedcategory] = useState('property');
  const genericinitialValues = {
    title: '',
    Description: '',
    Location: '',
  };

  const arrowbackSubmit = () => {
    AlertDialogShow('Data will be lost', true);
  };

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
        setLoading(true);
        setError(null);
        const data = await getFilterTags(user.userId, 'POST');

        let postobj: any = {};
        data.data.filters.map((item: any) => {
          if (item.name != 'PostedSince' && item.name != 'PropertySizeUnit') {
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
        //

        setPostfilter(postobj);
        data.data.filters = data.data.filters.filter(
          p => p.name != 'PostedSince' && p.name != 'PropertySizeUnit',
        );
        setFilterTags(data.data);
        setApiFilterTags(data.data);
        setLoading(false);
        //
        //
        //
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = values => {
    // Handle form submission here
    if (formikRef.current) {
      // formikRef.current.submitForm();
    }
    // setLoading(true);
    // savePost(values, filter, imagesArray);
  };

  const navigateToNextScreen = async () => {
    if (PropertyformikRef.current && selectedcategory == 'property') {
      await PropertyformikRef.current.submitForm();

      if (PropertyformikRef.current.isValid == true) {
        navigation.navigate('FilterTags', {
          visualData: visualData,
          Isvideo: Isvideo,
          formValue: PropertyformikRef.current.values,
        });
      }
    }
    if (genericformikRef.current && selectedcategory == 'generic') {
      await genericformikRef.current.submitForm();

      if (genericformikRef.current.isValid == true) {
        navigation.navigate('GenericPostPreview', {
          filters: '',
          postVisual: visualData,
          Isvideo: Isvideo,
          localities: genericformikRef.current.values.Location,
          formValue: genericformikRef.current.values,
        });
      }
    }
  };

  const [activeIndex, setActiveIndex] = useState(0);
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
  const handleCategorySelect = selectedValue => {
    setselectedcategory(selectedValue);
  };

  const renderItem = ({item, index}) => (
    <View style={localStyles.card}>
      {/* <Text>{item.destinationPathuri}</Text> */}
      {Platform.OS == 'ios' ? (
        <Image source={{uri: item.destinationPath}} style={localStyles.image} />
      ) : (
        <FastImage
          source={{uri: item.destinationPathuri}}
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
  const RenderLabel1 = ({labelText, width = '100%'}: any) => {
    return (
      <View style={{width: width, marginBottom: 8, flexDirection: 'row'}}>
        <ZText color={colors.black} type={'m16'} align="left">
          {labelText}
        </ZText>
        <Text style={{fontSize: 18, fontWeight: '600', color: 'red'}}> *</Text>
      </View>
    );
  };
  const RenderLabel = ({labelText, width = '100%'}: any) => {
    return (
      <View style={{width: width, marginBottom: 8}}>
        <ZText color={colors.black} type={'m16'} align="left">
          {labelText}
        </ZText>
      </View>
    );
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
            borderColor: 'black',
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
  return (
    <ZSafeAreaView>
      <ZHeader
        title={'Post Category'}
        rightIcon={<RightIcon />}
        isHideBack={true}
        isLeftIcon={<LeftIcon />}
      />

      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        style={localStyles.root}>
        <View>
          <View>
            {Isvideo == false && (
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
            )}

            {Isvideo == true && (
              <Video
                source={{uri: visualData.uri}}
                repeat={false}
                style={localStyles.media}
                paused={true}
                playWhenInactive={false}
                resizeMode="contain"
                controls={false}
              />
            )}
          </View>
          <CategorySelector
            categories={categories}
            defaultCategory={selectedcategory}
            onSelect={handleCategorySelect}
          />
          {selectedcategory == 'property' && (
            <PropertyForm formikRef={PropertyformikRef}></PropertyForm>
          )}
          {selectedcategory == 'generic' && (
            <GenericForm formikRef={genericformikRef}></GenericForm>
          )}
        </View>
      </ScrollView>
    </ZSafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  root: {
    ...styles.flex,

    ...styles.mb40,
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

  paginationWrapper: {
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
    margin: 4,
  },
  activeDot: {
    backgroundColor: '#FF6B6B',
  },
  // listContainer: {
  //   alignItems: 'center',
  // },
  card: {
    width: devicewidth, // Card takes up full width of the screen
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor:'red'
    // Add additional styling for the card here
  },
  image: {
    width: devicewidth - 40, // Slightly less than full width for card padding effect
    height: devicewidth - 200, // Making the image square, but you can adjust as needed
    resizeMode: 'cover',
    borderRadius: 10, // Adds rounded corners to the image
    // Add additional styling for the image here
  },
  inputContainer: {
    flexDirection: 'column',
    textAlign: 'left',
  },
  inputBox: {
    // borderWidth: 0,
    // borderBottomWidth: 1,
    width: '100%',
    minHeight: 42,
    fontSize: 16,
    color: 'black',
    // marginLeft:20,
    borderColor: '#999',
  },
  inputBox70: {
    // borderWidth: 0,
    // borderBottomWidth: 1,
    width: '50%',
    minHeight: 42,
    fontSize: 16,
    color: 'black',
    // marginLeft:20,
    borderColor: '#999',
  },
  selectStyle: {
    borderWidth: -1,
    width: '100%',
    minHeight: 28,
    fontSize: 18,
    // marginLeft:20,
    borderColor: 'transparent',
  },
  SwitchStyles: {
    // borderBottomWidth: 1,
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
    borderColor: '#eee',
    justifyContent: 'center',
    ...styles.ph20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  BoxStyles: {
    flexDirection: 'column',
    paddingTop: 10,
    marginBottom: 10,
    borderColor: '#BDBDBD',
    justifyContent: 'space-between',
  },
  // imagecard: {
  //   width: devicewidth,
  //   height: 500,
  //   // borderRadius: 10,
  // },
  singleimagecard: {
    width: '100%',
    height: 500,
    // borderRadius: 10,
  },
  listContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  singleCard: {
    width: '100%',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // card: {
  //   width: 200,
  //   height: 200,
  //   marginRight: 5,
  //   // borderRadius: 10,
  //   // backgroundColor: 'lightgray',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  FromControl: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    // gap: 2,
    paddingRight: 40,
    marginLeft: 20,
  },
  media: {
    width: '100%',
    height: 200,
  },
  containerView: {
    width: '100%',
    marginTop: 20,
    ...styles.ph20,
  },
  listicons: {
    width: '10%',
  },
  listText: {
    flexGrow: 0.5,
  },
  listcontent: {
    width: '90%',
    alignContent: 'center',
    flexWrap: 'wrap',
    wordWrap: 'break-word',
    marginLeft: 20,
    paddingHorizontal: 20,
  },

  headerContainer: {
    ...styles.flex,
    ...styles.flexRow,
    ...styles.justifyBetween,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  default_Img: {
    width: moderateScale(100),
    height: moderateScale(100),
    alignSelf: 'center',
    alignContent: 'center',
    backgroundColor: '#000',
  },
  tag: {
    backgroundColor: 'rgba(126, 200, 249, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(126, 200, 249, 0.2)',
  },
  tagText: {
    color: 'black',
  },
  appTitleMain: {
    color: '#000',
    fontSize: 19,
    fontWeight: '600',
    marginLeft: 20,
  },

  captionInput: {
    height: 45,
    width: '70%',
    marginLeft: 20,
    borderWidth: 0,
    padding: 10,
    borderColor: 'black',
  },
});
export default AppBaseContainer(PostWizardScreen, '', false);
