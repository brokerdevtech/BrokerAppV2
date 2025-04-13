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

const PostCard = React.memo(({
    item,
    listTypeData,
    User,
    navigation,
    enableMenu,
    enableAction,
    enableCall,
    enableChat,
    onGoBack,
    isAvatarClickDiabled
}) => {
    return <PostCardComponent
        item={item}
        listTypeData={listTypeData}
        User={User}
        navigation={navigation}
        enableMenu={enableMenu}
        enableAction={enableAction}
        enableCall={enableCall}
        enableChat={enableChat}
        onGoBack={onGoBack}
        isAvatarClickDiabled={isAvatarClickDiabled}
    />;
});

const PostCardComponent: React.FC<any> = ({
    item,
    listTypeData,
    User,
    navigation,
    enableMenu,
    enableAction,
    enableCall,
    enableChat,
    onGoBack,
    isAvatarClickDiabled
}) => {
    const [isrefresh, setisrefresh] = useState(0);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isrest, setisrest] = useState(false);

    const MediaGalleryRef = useRef(null);
    const reportSheetRef = useRef(null);

    const ProductItemDetailPress = () => {
        navigation.navigate('ItemDetailScreen', {
            onGoBack: () => onGoBack(item),
            postId: item.postId,
            postType: listTypeData == 'car' ? 'Car/Post' : 'Post',
        })
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
        <TouchableOpacity onPress={ProductItemDetailPress} activeOpacity={0.8}>
            <View style={styles.WrapcardContainer}>
                <View style={styles.cardContainer}>
                    <ItemHeader item={item} isAvatarClickDiabled={isAvatarClickDiabled} onAvatarClickCallBack={ProductItemDetailPress} />
                    <MediaGallery ref={MediaGalleryRef} mediaItems={item?.postMedias} disableInteraction={true} />
                    {enableMenu && (<View style={styles.iconContainer}>
                        <TouchableOpacity onPress={handlePresentModalPress} style={styles.checkIcon}>
                            <MenuThreeDots height={20} width={20} />
                        </TouchableOpacity>
                    </View>)}
                    {enableAction && (<View style={{ marginLeft: 20 }}>
                        <PostActions
                            item={item}
                            User={User}
                            listTypeData={listTypeData}
                            isrefresh={isrefresh}
                            onUpdateLikeCount={(newCount) => { }}
                        />
                    </View>)}
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
                    {enableCall || enableChat && (<View style={styles.detailsContainerBottom}>
                        <HStack>
                            {enableCall && (<HStack style={{ alignItems: "center", width: "50%", justifyContent: "center" }}>
                                <TouchableOpacity style={styles.callbtn} onPress={() => makeCall(item.contactNo)}>
                                    <View style={{ alignItems: "center" }}>
                                        <Icon as={Telephone_Icon} color={colors.light.appred} size={"xxl"} />
                                    </View>
                                    <View style={{ alignItems: "center", paddingVertical: 10 }}>
                                        <ZText type={"M14"}>Call</ZText>
                                    </View>
                                </TouchableOpacity>
                            </HStack>)}
                            {enableChat && (<HStack style={{ alignItems: "center", width: "50%", justifyContent: "center" }}>
                                <TouchableOpacity style={styles.Chatbtn} onPress={() => chatProfilePress()}>
                                    <View style={{ alignItems: "center", marginRight: 10 }}>
                                        <Icon as={Chat_Icon} color={"#0F5DC4"} size={"xxl"} />
                                    </View>
                                    <View style={{ alignItems: "center", paddingVertical: 10 }}>
                                        <ZText type={"M14"}>Chat</ZText>
                                    </View>
                                </TouchableOpacity>
                            </HStack>)}
                        </HStack>
                    </View>)}
                </View>
                {enableAction && (<BottomSheetModalProvider>
                    <ReportScreen
                        ref={reportSheetRef}
                        postItem={selectedItem}
                        screenFrom={'List'}
                        onClose={closeModalReport}
                    />
                </BottomSheetModalProvider>)}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
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
    WrapcardContainer: {
        marginBottom: 20,
    },
    cardContainer: {
        width: '100%',
        display: 'flex',
        borderRadius: 12,
        backgroundColor: '#FFF',
        shadowColor: 'rgba(0, 0, 0, 0.8)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        elevation: 4,
    },
    iconContainer: {
        position: 'absolute',
        top: 8,
        right: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    checkIcon: {
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
        width: '100%'
    },
    price: {
        fontSize: 16,
        fontWeight: '600',
    }
});

export default PostCard;

