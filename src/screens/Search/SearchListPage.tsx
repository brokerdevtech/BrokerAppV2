import React, { useEffect, useState } from 'react';
import AppBaseContainer from '../../hoc/AppBaseContainer_old';
import ZHeaderFliter from '../../sharedComponents/ZHeaderFliter';
import { useApiPagingWithtotalRequest } from '../../hooks/useApiPagingWithtotalRequest';
import { globalSearch } from '../../../BrokerAppCore/services/new/searchService';
import { FlatList, StyleSheet, View } from 'react-native';
import UserAvartarWithNameComponent from '../../sharedComponents/UserAvartarWithNameComponent';
import ZText from '../../sharedComponents/ZText';
import { useSelector } from 'react-redux';
import PostCard from '../../sharedComponents/PostCard';
import { styles } from '../../themes';

const SearchListPage: React.FC = ({
    user,
    navigation
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

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (query.trim() === '') {
            setResults([]);
        } else {
            await getList(query); // Call the API with the search query
        }
    };

    useEffect(() => {
        if (data) {
            const users = data?.users?.records?.map(item => ({
                ...item,
                type: 'user',
            })) || [];
            const cars = data?.cars?.records?.map(item => ({
                ...item,
                type: 'car',
            })) || [];
            const realEstate = data?.realEstate?.records?.map(item => ({
                ...item,
                type: 'realEstate',
            })) || [];
            setResults([...users, ...cars, ...realEstate]); // Combine users and cars
        } else {
            setResults([]); // Clear results if no data
        }
    }, [data]);

    const renderItem = ({ item, index }: any) => {
        const isLastItem = index === results.length - 1;
        const nextItemType = !isLastItem ? results[index + 1]?.type : null;
        if (item.type === 'user') {
            return (
                <View style={{ marginBottom: nextItemType === 'car' ? 10 : 0 }}>
                    <UserAvartarWithNameComponent
                        userName={item.fullName}
                        userImage={item?.profileImg}
                        userDescription={item?.city}
                        isFollowed={item?.following}
                        userId={item.userId}
                        loggedInUserId={user.userId}
                        type="search"
                    />
                </View>
            );
        } else {
            return (
                <View style={{ marginBottom: 10 }}>
                    <PostCard
                        item={item}
                        listTypeData={item.type === 'car' ? "car" : "realEstate" }
                        User={user}
                        navigation={navigation}
                    />
                </View>
            );
        }
    };



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
                keyExtractor={(item, index) => `${item.type}-${item.userId || item.postId}-${index}`}
                renderItem={renderItem}
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