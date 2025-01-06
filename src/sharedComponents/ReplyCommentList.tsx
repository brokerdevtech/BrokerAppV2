/* eslint-disable react-native/no-inline-styles */
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { RootState } from '@reduxjs/toolkit/dist/query';
import moment from 'moment';
import React from 'react';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import TouchableOpacityWithPermissionCheck from './TouchableOpacityWithPermissionCheck';
import { ActivityIndicator, FlatList,StyleSheet, View,Text, TouchableOpacity } from 'react-native';
import { moderateScale, PermissionKey } from '../config/constants';
import { useApiPagingWithtotalRequest } from '../hooks/useApiPagingWithtotalRequest';
import { GetCommentReply, SetPostReplyCommentLikeUnLike } from '../../BrokerAppCore/services/new/postServices';
import ZAvatarInitials from './ZAvatarInitials';

import {Like, UnLike, Send, CloseIcon} from '../assets/svg';
import ZText from './ZText';

const PostCommentReplyList = ({commentId, listType = '',module}) => {
    // console.log("cID ", commentId)
    const user = useSelector((state: RootState) => state.user.user);
    const userPermissions = useSelector(
      (state: RootState) => state.user.user.userPermissions,
    );
    const [isInfiniteLoading, setInfiniteLoading] = useState(false);
    const [comments, setComments] = useState([]);
    const [isLiked, setisLiked] = useState(false);
    const [isDataRef, setisDataRef] = useState(false);
    const flatListRef = useRef();
    const navigation = useNavigation();
    const {
        data,
        status,
        error,
        execute,
        loadMore,
        pageSize_Set,
        currentPage_Set,
        hasMore_Set,
        totalPages,recordCount,hasMore,
      } = useApiPagingWithtotalRequest(GetCommentReply,setInfiniteLoading,3);


      async function callCommentReplyList() {
        pageSize_Set(3);
        currentPage_Set(1);
        hasMore_Set(true);

        await execute(listType,module,user.userId,commentId);


      }


    React.useEffect(() => {}, [isLiked]);
    const getTimeDifference = createdAt => {
    const created = moment.utc(createdAt).local();
       const now = moment();
   
       const daysDifference = now.diff(created, 'days');
       const monthsDifference = now.diff(created, 'months');
       const yearsDifference = now.diff(created, 'years');
   
       if (yearsDifference >= 1) {
         return yearsDifference === 1 ? '1 year ago' : `${yearsDifference} years ago`;
       }
   
       if (monthsDifference >= 1) {
         return monthsDifference === 1 ? '1 month ago' : `${monthsDifference} months ago`;
       }
   
       if (daysDifference >= 7) {
         const weeks = Math.floor(daysDifference / 7);
         return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
       }
   
       return created.fromNow(); 
    };


    useFocusEffect(
      React.useCallback(() => {
        //   toggleSkeletonOn();

        const fetchData = async () => {



          try {

            // Await for the getPosts function to complete
            await callCommentReplyList();
          } catch (error) {
            console.error('Error fetching posts:', error);
            // Handle the error appropriately
          }

          // After fetching data, set loading to false

        };

        fetchData();

        return () => {
          // Code to execute when the screen loses focus (optional)
        };
      }, [commentId]),
    );


    const handleReplyLike = async item => {
        let result;
       let endpoint = '';
         if(!isInfiniteLoading)
         {
           setInfiniteLoading(true);


        if (item?.userLiked && item?.userLiked == 1) {

           result = await SetPostReplyCommentLikeUnLike(listType,'Post','UnLike',
            user.userId,
                     item.replyId,
                    );
                    if (result?.success == true) {

                           item.likeCount = item.likeCount - 1;
                           item.userLiked = 0;
                         //  setisLiked(false);
                         }
                   }
                   else{

                       result = await SetPostReplyCommentLikeUnLike(listType,'Post','Like',
                        user.userId,
                           item.replyId,
                          );
                          if (result?.success == true) {

                               item.likeCount = item.likeCount + 1;
                               item.userLiked = 1;
                             //  setisLiked(false);
                             }
                   }



        setisDataRef(!isDataRef);
        setInfiniteLoading(false);
       }
     };
     const handleListView = async(item)=>{

      navigation.navigate('PostCommentReplyLikeList', {
        type: listType,
        userId: user?.userId,
        ActionId: item.replyId,
      });

  };

    const loadMorepage = async () => {
    
        if(!isInfiniteLoading)
      {  

          await loadMore( listType,module,user.userId,commentId
        );

      }
      };
      const renderFooter = () => {
        if (hasMore == false) {return null;}
        return (
            <View style={localStyles.footer}>
                {isInfiniteLoading ? (
                    <ActivityIndicator size="large" color="blue" />
                ) : (
                    <TouchableOpacity onPress={loadMorepage} style={localStyles.loadMoreButton}>
                        <Text style={localStyles.loadMoreText}>Load More</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };
    // const handleViewReply = item=>{
    //
    //   setisOpenArray([...isOpenArray, item.commentId])
    // }
    // console.log("openArray ", isOpenArray)
    const renderItem = ({ item, index }) => {


      return (
        <View key={index} style={localStyles.mainContainer}>
          <View style={localStyles.profileWrap}>
            <ZAvatarInitials
              item={item}
              iconSize="md"
              sourceUrl={item.profileImage}
              styles={localStyles.profileImage}
              name={`${item.firstName} ${item.lastName}`}
            />
          </View>
          <View style={{ marginLeft: 10, flex: 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '700',
                    color: '#000',
                    textTransform: 'capitalize',
                  }}
                >
                  {`${item.firstName} ${item.lastName}`}
                </Text>
              </View>
            </View>
            <Text>{item.reply}</Text>
            <Text>{getTimeDifference(item.date)}</Text>
          </View>
          <View style={localStyles.likeContainer}>
            <TouchableOpacityWithPermissionCheck
              tagNames={[Like, UnLike]}
              permissionEnum={
                item?.userLiked === 0
                  ? PermissionKey.AllowUnlikePostCommentReply
                  : PermissionKey.AllowLikePostCommentReply
              }
              permissionsArray={userPermissions}
              onPress={() => handleReplyLike(item)}
            >
              {item?.userLiked === 0 ? <UnLike /> : <Like />}
            </TouchableOpacityWithPermissionCheck>
            {item.likeCount > 0 && (
              <TouchableOpacity onPress={() => handleListView(item)}>
                <ZText type="L12">{item.likeCount}</ZText>
              </TouchableOpacity>
            )}
          </View>
        </View>
      );
    };
    return (
        <View>
            {/* <Text>ss</Text> */}

      <FlatList
        data={data}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        //  onEndReached={loadMorepage}
        //  onEndReachedThreshold={0.5}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        keyExtractor={(item, index) => String(index)}
        ListEmptyComponent={() => (isInfiniteLoading ? null : '')}
        ListFooterComponent={renderFooter}
        ref={flatListRef}
        extraData={hasMore}
      /></View>
    );
  };

  const localStyles = StyleSheet.create({
    footer: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadMoreButton: {
        // padding: 10,
        // backgroundColor: '#007BFF',
        // borderRadius: 5,
    },
    loadMoreText: {
        //color: '#FFF',
        fontWeight: 'bold',
    },
    profileImage: {
      width: moderateScale(30),
      height: moderateScale(30),
      borderRadius: moderateScale(25),
     marginRight:5,
    },
    mainContainer: {
      flexDirection: 'row',
      width: '100%',
      marginBottom: 20,
      alignItems: 'flex-start',
      verticalAlign: 'top',
      // paddingHorizontal: 20,
    },
    emojiSection: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 42,
      marginTop: 10,
      width: '100%',
      justifyContent: 'space-evenly',
      borderBottomWidth: 2,
      marginBottom: 10,
      borderColor: '#ddd',
    },
    profileWrap: {
      width: moderateScale(50),
      height: moderateScale(50),
      borderRadius: moderateScale(25),
      verticalAlign: 'top',
    // marginRight:5,
    },
    likeContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'flex-end', // Aligns the like section to the bottom of the item
      marginRight: 10,
      marginBottom:30, // Add some margin to the right if needed
    },
    likeCount: {
      // marginLeft: 5, // Adjust spacing between the icon and the count
    },
  });

  export default PostCommentReplyList;
