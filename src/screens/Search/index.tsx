import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon, SearchIcon } from '../../../components/ui/icon';
import ZInput from '../../sharedComponents/ZInput';
import ZSafeAreaView from '../../sharedComponents/ZSafeAreaView';
import { styles } from '../../themes';
import { moderateScale } from '../../config/constants';
import { useApiPagingWithtotalRequest } from '../../hooks/useApiPagingWithtotalRequest';
import { globalSearch } from '../../../BrokerAppCore/services/new/searchService';
import { useSelector } from 'react-redux';
import LoadingSpinner from '../../sharedComponents/LoadingSpinner';
import UserAvartarWithNameComponent from '../../sharedComponents/UserAvartarWithNameComponent';
import AppBaseContainer from '../../hoc/AppBaseContainer_old';

const SearchScreen = React.FC = ({
  isPageSkeleton,
  toggleSkeletonoff,
  toggleSkeletonOn,
  setLoading,
  navigation,
  user,
  color,
  route,
  pageTitle,
}) => {

  const colors = useSelector(state => state.theme.theme);

  const BlurredStyle = {
    backgroundColor: colors.inputBg,
    borderColor: colors.btnColor1,
  };
  const FocusedStyle = {
    backgroundColor: colors.inputFocusColor,
    borderColor: colors.primary,
  };
  const BlurredIconStyle = colors.grayScale5;
  const FocusedIconStyle = colors.primary;

  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isInfiniteLoading, setInfiniteLoading] = useState(false);
  const [searchInputStyle, setSearchInputStyle] = useState(BlurredStyle);
  const [searchIconStyle, setSearchIconStyle] = useState(BlurredIconStyle);

  const {
    data,
    status,
    error,
    execute,
    loadMore,
    pageSize_Set,
    currentPage_Set,
    hasMore_Set,
    totalPages,
    recordCount,
  } = useApiPagingWithtotalRequest(globalSearch, setInfiniteLoading, 3);

  const getList = async (query: string) => {
    try {
      currentPage_Set(1);
      hasMore_Set(true);
      console.log(user?.userId, query);
      await execute(user?.userId, query);
    } catch (error) { }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setInfiniteLoading(true);
    if (query.trim() === '') {
      setResults([]);
    } else {
      getList(query); // Call the API with the search query
    }
  };

  useEffect(() => {
    if (data) {
      setResults(data);
    }
  }, [data]);

  const onHighlightInput = () => {
    setSearchInputStyle(FocusedStyle);
    setSearchIconStyle(FocusedIconStyle);
  };
  const onUnHighlightInput = () => {
    setSearchInputStyle(BlurredStyle);
    setSearchIconStyle(BlurredIconStyle);
  };

  const loadMorefaltlist = async () => {
    if (!isInfiniteLoading) {
      await loadMore(user.userId, searchQuery);
    }
  };

  const navigateToSearchListPage = () => {
    navigation.navigate('SearchListPage');
  };

  return (
    <ZSafeAreaView>
      <View style={localStyles.rootContainer}>
        <ZInput
          placeHolder={'Search for broker, properties, or cars'}
          _value={searchQuery}
          keyBoardType={'default'}
          autoCapitalize={'none'}
          insideLeftIcon={() => <Icon as={SearchIcon} />}
          toGetTextFieldValue={handleSearch}
          inputContainerStyle={[
            { backgroundColor: colors.inputBg },
            localStyles.inputContainerStyle,
          ]}
          inputBoxStyle={localStyles.inputBoxStyle}
          _onFocus={() => {
            onHighlightInput();
            navigateToSearchListPage();
          }}
          onBlur={onUnHighlightInput}
        />
      </View>
    </ZSafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  rootContainer: {
    ...styles.ph20,
    ...styles.pb20,
    flex: 1,
  },
  inputContainerStyle: {
    borderRadius: moderateScale(15),
    borderWidth: moderateScale(1),
  },
  inputBoxStyle: {
    ...styles.ph15,
  }
});

export default AppBaseContainer(SearchScreen, '', false);

