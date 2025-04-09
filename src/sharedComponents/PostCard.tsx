import React, { useCallback, useRef, useState } from "react";
import { Linking, Alert, PermissionsAndroid, Platform, View, TouchableOpacity, StyleSheet } from "react-native";
import { Box } from "../../components/ui/box";
import { HStack } from "../../components/ui/hstack";
import { Icon } from "../../components/ui/icon";
import { VStack } from "../../components/ui/vstack";
import MediaGallery from "./MediaGallery";
import PostActions from "./PostActions";
import ZText from "./ZText";
import ItemHeader from "../screens/ItemHeader";
import { MenuThreeDots, Location_Icon, description_icon, Telephone_Icon, Chat_Icon } from "../assets/svg";
import { colors } from "../themes";
import { formatNumberToIndianSystem } from "../utils/helpers";
import ReportScreen from "./ReportScreen";
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import SearchListPage from "../screens/Search/SearchListPage";

const PostCard = React.memo(({ item, listTypeData, User, navigation }) => {
    return <PostCardComponent item={item} listTypeData={listTypeData} User={User} navigation={navigation} />;
});

const PostCardComponent: React.FC<any> = ({ item, listTypeData, User, navigation }) => {
    const [isrefresh, setisrefresh] = useState(0);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isrest, setisrest] = useState(false);

    const MediaGalleryRef = useRef(null);
    const reportSheetRef = useRef(null);

    const ProductItemOnGoBack = () => {
        console.log(JSON.stringify(navigation));
        navigation.navigate('Search');
    };

    const handlePresentModalPress = useCallback(item => {
        setSelectedItem(item);
        reportSheetRef.current?.open();
    }, []);

    const closeModalReport = useCallback(() => {
        setSelectedItem(null);
    }, []);

    const openWhatsApp = useCallback((phoneNumber: string, message: string) => {
        const url = `whatsapp://send?text=${encodeURIComponent(message)}&phone=${phoneNumber}`;
        Linking.canOpenURL(url)
            .then((supported) => {
                if (supported) {
                    Linking.openURL(url);
                } else {
                    Alert.alert("Error", "WhatsApp is not installed on this device");
                }
            })
            .catch((err) => console.error("Error opening WhatsApp", err));
    }, []);

    const chatProfilePress = useCallback(() => {
        const members = [User.userId.toString(), item.userId.toString()];
        navigation.navigate("AppChat", {
            defaultScreen: "ChannelScreen",
            defaultParams: members,
        });
    }, [User, item, navigation]);

    const makeCall = useCallback(async (phoneNumber: string) => {
        const url = `tel:${phoneNumber}`;
        if (Platform.OS === "android") {
            const hasPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CALL_PHONE);
            if (hasPermission) {
                Linking.openURL(url);
            } else {
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CALL_PHONE);
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    Linking.openURL(url);
                } else {
                    Alert.alert("Permission Denied", "You need to enable call permissions to use this feature");
                }
            }
        } else {
            Linking.canOpenURL(url)
                .then((supported) => {
                    if (supported) {
                        Linking.openURL(url);
                    } else {
                        Alert.alert("Oops!", "No contact info available for this post. Try reaching out through other channels!");
                    }
                })
                .catch((err) => console.error("Error opening dialer", err));
        }
    }, []);

    return (
        <View style={styles.WrapcardContainer}>
            <View style={styles.cardContainer}>
                <ItemHeader item={item} />
                <MediaGallery ref={MediaGalleryRef} mediaItems={item?.postMedias} paused={false} />
                <View style={styles.iconContainer}>
                    <TouchableOpacity onPress={handlePresentModalPress} style={styles.checkIcon}>
                        <MenuThreeDots height={20} width={20} />
                    </TouchableOpacity>
                </View>
                <View style={{ marginLeft: 20 }}>
                    <PostActions
                        item={item}
                        User={User}
                        listTypeData={listTypeData}
                        isrefresh={isrefresh}
                        onUpdateLikeCount={(newCount) => { }}
                    />
                </View>
                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate("ItemDetailScreen", {
                            onGoBack: ProductItemOnGoBack,
                            postId: item.postId,
                            postType: item.hasOwnProperty("fuelType") ? "Car/Post" : "Post",
                        })
                    }
                >
                    <VStack space="xs" style={styles.detailsContainer}>
                        <HStack>
                            <Box style={{ marginLeft: 4 }}>
                                <ZText type={"M16"} style={{ color: colors.light.appred }}>
                                    {"\u20B9"}{" "}
                                </ZText>
                            </Box>
                            <Box>
                                <ZText type={"M16"} style={{ color: colors.light.appred }}>
                                    {formatNumberToIndianSystem(item?.price)}
                                </ZText>
                            </Box>
                        </HStack>
                        {item?.location?.cityName && (
                            <HStack>
                                <Box>
                                    <Icon as={Location_Icon} size="xl" />
                                </Box>
                                <Box style={{ width: "100%", flex: 1 }}>
                                    <ZText type={"R16"} numberOfLines={1} ellipsizeMode="tail">
                                        {" "}
                                        {item.location.placeName}
                                    </ZText>
                                </Box>
                            </HStack>
                        )}
                        <HStack style={{ width: "100%", flex: 1 }}>
                            <Box>
                                <Icon as={description_icon} fill="black" size="xl" />
                            </Box>
                            <Box style={{ width: "100%", flex: 1 }}>
                                <ZText type={"R16"} numberOfLines={1} ellipsizeMode="tail">
                                    {" "}
                                    {item?.title}
                                </ZText>
                            </Box>
                        </HStack>
                    </VStack>
                </TouchableOpacity>
                <View style={styles.detailsContainerBottom}>
                    <HStack>
                        <HStack style={{ alignItems: "center", width: "50%", justifyContent: "center" }}>
                            <TouchableOpacity style={styles.callbtn} onPress={() => makeCall(item.contactNo)}>
                                <View style={{ alignItems: "center" }}>
                                    <Icon as={Telephone_Icon} color={colors.light.appred} size={"xxl"} />
                                </View>
                                <View style={{ alignItems: "center", paddingVertical: 10 }}>
                                    <ZText type={"M14"}>Call</ZText>
                                </View>
                            </TouchableOpacity>
                        </HStack>
                        <HStack style={{ alignItems: "center", width: "50%", justifyContent: "center" }}>
                            <TouchableOpacity style={styles.Chatbtn} onPress={() => chatProfilePress()}>
                                <View style={{ alignItems: "center", marginRight: 10 }}>
                                    <Icon as={Chat_Icon} color={"#0F5DC4"} size={"xxl"} />
                                </View>
                                <View style={{ alignItems: "center", paddingVertical: 10 }}>
                                    <ZText type={"M14"}>Chat</ZText>
                                </View>
                            </TouchableOpacity>
                        </HStack>
                    </HStack>
                </View>
            </View>
            <BottomSheetModalProvider>
                <ReportScreen
                    ref={reportSheetRef}
                    postItem={selectedItem}
                    screenFrom={'List'}
                    onClose={closeModalReport}
                />
            </BottomSheetModalProvider>
        </View>
    );
};

const styles = StyleSheet.create({
    cardAvatar: {
        display: 'flex',
        flexDirection: 'row',
        padding: 10,
    },
    cardAvatarImg: {
        display: 'flex',
        flexDirection: 'row',
    },
    cardAvatarText: {
        display: 'flex',
        flexDirection: 'row',
        marginLeft: 10,
        alignItems: 'center',
    },
    callbtn: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fef4f4',
        width: '90%',
        marginLeft: 10,
        paddingVertical: 5, // Vertical padding
        paddingHorizontal: 5, // Horizontal padding
        borderRadius: 8, // Rounded corners

        justifyContent: 'center',
    },
    Chatbtn: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F2F7FE',
        width: '90%',

        paddingVertical: 5, // Vertical padding
        paddingHorizontal: 5, // Horizontal padding
        borderRadius: 8, // Rounded corners

        marginRight: 10,
        justifyContent: 'center',
    },

    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#555', // Use a subtle color to match your design
        textAlign: 'center',
    },
    loader: {
        marginVertical: 20,
    },
    headerContainer: {
        backgroundColor: '#FFF',
        paddingVertical: 10,
    },
    header: {
        justifyContent: 'space-between',

        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    listContainer: {
        backgroundColor: '#F7F8FA',
        flex: 1,
    },

    footer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        height: 80,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    IconButton: {
        flexDirection: 'row',
        gap: 12,
    },
    footerContainer: {
        backgroundColor: '#FFF',
    },
    heading: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
        marginBottom: 10,
        paddingHorizontal: 20,
    },
    headingTitle: {
        color: '#263238',
        fontFamily: 'Gilroy',
        fontSize: 18,
        fontStyle: 'normal',
        fontWeight: 400,
        lineHeight: 24,
    },
    link: {
        color: '#C20707',
    },

    itemContainer: {
        width: 375,
        height: 478,
        borderRadius: 12,
        backgroundColor: '#FFF', // Equivalent to background: var(--white, #FFF)
        shadowColor: 'rgba(0, 0, 0, 0.8)', // shadow color
        shadowOffset: { width: 0, height: 4 }, // shadow offset
        shadowOpacity: 1, // shadow opacity
        shadowRadius: 64, // blur radius (64px)
        elevation: 8,
        marginHorizontal: 8,
    },
    itemFooterContainer: {
        backgroundColor: '#FFF',
        paddingVertical: 10,
        paddingLeft: 5,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
    },
    separator: {
        width: 10, // Space between cards
    },
    tagImage: {
        width: 375,
        height: 278,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    WrapcardContainer: {
        // paddingHorizontal: 20,
        marginBottom: 20,
    },
    cardContainer: {
        width: '100%',
        display: 'flex',
        borderRadius: 12,
        backgroundColor: '#FFF',
        //  margin:20,
        shadowColor: 'rgba(0, 0, 0, 0.8)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        // shadowRadius: 20,
        elevation: 4,
    },
    carImage: {
        width: 375,
        height: 278,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    iconContainer: {
        position: 'absolute',
        top: 8,

        right: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    checkIcon: {
        // backgroundColor: '#377DFF',
        borderRadius: 20,
        padding: 3,
    },
    heartIcon: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 3,
    },
    detailsContainer: {
        paddingLeft: 20,
        paddingBottom: 10,
        paddingTop: 10,
        width: '100%',
        paddingRight: 20,
    },
    detailsContainerBottom: {
        //  paddingLeft: 20,
        borderRadius: 12,
        paddingTop: 5,
        paddingBottom: 10,
        width: '100%',
        //  paddingRight: 20,
        //  borderColor:colors.light.appred,
        //  borderBottomWidth:1,
        //  borderBottomLeftRadius: 12,
        //  borderBottomRightRadius: 12,
        //  borderLeftWidth:1,
        //  borderRightWidth:1,
    },
    price: {
        fontSize: 16,
        fontWeight: '600',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    locationText: {
        fontSize: 12,
        color: '#7A7A7A',
        marginLeft: 4,
    },
    carBrand: {
        fontSize: 14,
        fontWeight: '500',
        color: '#000',
        marginTop: 4,
    }
});

export default PostCard;

