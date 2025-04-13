import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { SectionList, StyleSheet, View, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { debounce } from 'lodash';
import AppBaseContainer from '../../hoc/AppBaseContainer_old';
import ZHeaderFliter from '../../sharedComponents/ZHeaderFliter';
import ZText from '../../sharedComponents/ZText';
import UserAvartarWithNameComponent from '../../sharedComponents/UserAvartarWithNameComponent';
import PostCard from '../../sharedComponents/PostCard';
import { useApiPagingWithtotalRequest } from '../../hooks/useApiPagingWithtotalRequest';
import { globalSearch } from '../../../BrokerAppCore/services/new/searchService';
import { styles } from '../../themes';

const SearchListPage: React.FC = ({ user, navigation }: any) => {
    const colors = useSelector(state => state.theme.theme);
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState({ users: [], cars: [], realEstate: [] });
    const [isInfiniteLoading, setInfiniteLoading] = useState(false);

    const { data, execute, currentPage_Set, hasMore_Set } = useApiPagingWithtotalRequest(globalSearch, setInfiniteLoading, 3);

    const debouncedSearch = useCallback(
        debounce((query) => {
            if (query.trim()) {
                currentPage_Set(1);
                hasMore_Set(true);
                execute(user?.userId, query);
            } else {
                setResults({ users: [], cars: [], realEstate: [] });
            }
        }, 300),
        []
    );

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        debouncedSearch(query);
    };

    const onGoBack = () => { };

    useEffect(() => {
        if (data) {
            const users = data?.users?.records?.map(item => ({ ...item, type: 'user' })) || [];
            const cars = data?.cars?.records?.map(item => ({ ...item, type: 'car' })) || [];
            const realEstate = data?.realEstate?.records?.map(item => ({ ...item, type: 'realEstate' })) || [];
            setResults({ users, cars, realEstate });
        }
    }, [data]);

    const sections = useMemo(() => {
        return [
            { title: 'Brokers', data: results.users },
            { title: 'Cars', data: results.cars },
            { title: 'Real Estate', data: results.realEstate },
        ].filter(section => section?.data?.length > 0); // Exclude empty sections
    }, [results]);

    // Calculate counts for each type
    const typeCounts = useMemo(() => {
        return {
            users: data?.users?.recordCount,
            cars: data?.cars?.recordCount,
            realEstate: data?.realEstate?.recordCount,
        };
    }, [results]);

    const renderItem = ({ item }: any) => {
        if (item.type === 'user') {
            return (
                <UserAvartarWithNameComponent
                    userName={item.fullName}
                    userImage={item?.profileImg}
                    userDescription={item?.city}
                    isFollowed={item?.following}
                    userId={item.userId}
                    loggedInUserId={user.userId}
                />
            );
        }
        return (
            <PostCard
                item={item}
                listTypeData={item.type === 'car' ? "car" : "realEstate"}
                User={user}
                navigation={navigation}
                onGoBack={onGoBack}
                isAvatarClickDiabled={true}
            />
        );
    };

    return (
        <View style={localStyles.rootContainer}>
            <ZHeaderFliter
                title="Search"
                isSearch={true}
                handleSearch={handleSearch}
                openSearchBox={true}
            />
            {/* Bar with pills */}
            {Object.values(results).some((items) => items.length > 0) && (
                <View style={localStyles.pillsContainer}>
                    <View style={localStyles.pill}>
                        <ZText type="M14" style={localStyles.pillText}>
                            Brokers ({typeCounts.users})
                        </ZText>
                    </View>
                    <View style={localStyles.pill}>
                        <ZText type="M14" style={localStyles.pillText}>
                            Cars ({typeCounts.cars})
                        </ZText>
                    </View>
                    <View style={localStyles.pill}>
                        <ZText type="M14" style={localStyles.pillText}>
                            Real Estate ({typeCounts.realEstate})
                        </ZText>
                    </View>
                </View>
            )}
            <SectionList
                sections={sections}
                keyExtractor={(item, index) => `${item.type}-${item.userId || item.postId}-${index}`}
                renderSectionHeader={({ section: { title } }) => (
                    <ZText type="B16" style={localStyles.sectionHeader}>{title}</ZText>
                )}
                renderItem={renderItem}
                contentContainerStyle={localStyles.sectionListContent}
                style={localStyles.sectionList}
                ListEmptyComponent={
                    isInfiniteLoading ? (
                        <ActivityIndicator size="large" color={colors.primary} />
                    ) : (
                        <ZText type="R16" style={{ textAlign: 'center', marginTop: 20 }}>
                            No results found.
                        </ZText>
                    )
                }
            />
        </View>
    );
};

const localStyles = StyleSheet.create({
    rootContainer: { flex: 1 },
    sectionList: {
        flex: 1,
        backgroundColor: '#F7F8FA', // Background color for the list
    },
    sectionListContent: {
        paddingHorizontal: 16, // Horizontal padding for the list content
        paddingBottom: 20, // Padding at the bottom
    },
    sectionHeader: {
        //backgroundColor: '#FFFFFF', // Background color for section headers
        paddingVertical: 10, // Vertical padding for section headers
        paddingHorizontal: 5, // Horizontal padding for section headers
        borderBottomWidth: 1, // Optional: Add a border below the header
        borderBottomColor: '#E0E0E0', // Border color
        fontWeight: 'bold', // Bold text for section headers
    },
    pillsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#FFFFFF', // White background
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    pill: {
        backgroundColor: '#E5E5E5', // Red background for pills
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 15,
    },
    pillText: {
        color: '#FFFFFF', // White text color
        textAlign: 'center',
    },
});

export default AppBaseContainer(SearchListPage, '', false, true);