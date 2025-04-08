import React, { useEffect, useState } from 'react';
import AppBaseContainer from '../../hoc/AppBaseContainer_old';
import ZHeaderFliter from '../../sharedComponents/ZHeaderFliter';
import { useApiPagingWithtotalRequest } from '../../hooks/useApiPagingWithtotalRequest';
import { globalSearch } from '../../../BrokerAppCore/services/new/searchService';
import { FlatList, StyleSheet, View } from 'react-native';
import { Color } from '../../styles/GlobalStyles';
import UserAvartarWithNameComponent from '../../sharedComponents/UserAvartarWithNameComponent';
import ZText from '../../sharedComponents/ZText';
import { useSelector } from 'react-redux';
import { styles } from '../../themes';

const SearchListPage: React.FC = ({
    user
}: any) => {
    const colors = useSelector(state => state.theme.theme);
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isInfiniteLoading, setInfiniteLoading] = useState(false);

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
        if (query.trim() === '') {
            setResults([]);
        } else {
            getList(query); // Call the API with the search query
        }
    };

    useEffect(() => {
        if (data?.users?.records) {
            console.log(data.users.records, 'Users Data');
            setResults(data.users.records); // Set the users' records
        } else {
            setResults([]); // Clear results if no data
        }
    }, [data]);

    const renderUserItem = ({ item, index }: any) => (
        console.log(item, 'item in search'),
        <View style={localStyles.brokerList}>
            <UserAvartarWithNameComponent
                userName={item.fullName}
                userImage={item?.profileImg}
                userDescription={item?.city}
                isFollowed={item?.following}
                userId={item.userId}
                loggedInUserId={user.userId}
                type="search"
                key={index}
            />
        </View>
    );

    return (
        <View style={localStyles.rootContainer}>
            <ZHeaderFliter
                title={"Search"}
                isSearch={true}
                handleSearch={handleSearch}
                openSearchBox={true}
            />
            <FlatList
                data={results}
                keyExtractor={(item) => item.userId.toString()}
                renderItem={renderUserItem}
                contentContainerStyle={{ padding: 10 }}
                ListEmptyComponent={
                    <ZText type="R16" style={{ textAlign: 'center', marginTop: 20 }}>
                        No results found.
                    </ZText>
                }
            />
        </View>
    );
};

const localStyles = StyleSheet.create({
    rootContainer: {
        flex: 1,
    },
    brokerList: {
        ...styles.pl10,
        ...styles.pr10,
    }
});

export default AppBaseContainer(SearchListPage, '', false);