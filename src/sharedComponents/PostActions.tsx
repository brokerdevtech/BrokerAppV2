import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, TouchableOpacity,Text,StyleSheet, TextInput, FlatList } from 'react-native';
import { SetPostLikeUnLike } from '../../BrokerAppCore/services/new/dashboardService';
import { HStack } from '../../components/ui/hstack';
import { VStack } from '../../components/ui/vstack';
import { ArrowUpIcon, EditIcon, FavouriteIcon, Icon, MessageCircleIcon } from '../../components/ui/icon';
import { bookmark_icon, share_PIcon } from '../assets/svg';
import ZText from './ZText';
import {
    BottomSheetModal,
    BottomSheetView,
    BottomSheetModalProvider,
    BottomSheetBackdrop,
    BottomSheetFooter,
    BottomSheetTextInput,BottomSheetFlatList
  } from '@gorhom/bottom-sheet';
import { Box } from '../../components/ui/box';
import { Button, ButtonIcon } from '../../components/ui/button';
import { useApiPagingWithtotalRequest } from '../hooks/useApiPagingWithtotalRequest';
import { GetCommentList } from '../../BrokerAppCore/services/new/postServices';
import LoadingSpinner from './LoadingSpinner';
import ZAvatarInitials from './ZAvatarInitials';
import moment from 'moment';
import TextWithPermissionCheck from './TextWithPermissionCheck';
import { useSelector } from 'react-redux';
import { RootState } from '../../BrokerAppCore/redux/store/reducers';
import { moderateScale, PermissionKey } from '../config/constants';
import TouchableOpacityWithPermissionCheck from './TouchableOpacityWithPermissionCheck';
import {Like, UnLike, Send, CloseIcon} from '../assets/svg';
import CommentBottomSheet from './CommentBottomSheet';
import { useNavigation } from '@react-navigation/native';
const PostActions = ({ item, User, listTypeData, onUpdateLikeCount }) => {
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
    totalPages,recordCount
  } = useApiPagingWithtotalRequest(GetCommentList,setInfiniteLoading,15);
  const [isOpenArray, setisOpenArray] = useState([]);
  const navigation = useNavigation();
  const [PostLike, SetPostLike] = useState(item.userLiked === 1);
  const [PostlikesCount, SetPostlikesCount] = useState(item.likes);
  const commentSheetRef = useRef(null);
  const [cardComment, setCardComment] = useState(item.comments);
  const snapPoints = useMemo(() => ['60%'], []);

  const userPermissions = useSelector(
    (state: RootState) => state.user.user.userPermissions,
  );

  const handleListView =async()=>{
 
    navigation.navigate('PostLikeList', {
      type: listTypeData, 
      userId: User?.userId, 
      ActionId: item?.postId
    });
 
}

  const handleLike = async () => {
    let endpoint = listTypeData === "RealEstate" || listTypeData === "Car" ? "Post" : "";
    const result = await SetPostLikeUnLike(endpoint, "Like", User.userId, item.postId);

    if (result.success) {
      SetPostLike(true);
      SetPostlikesCount(PostlikesCount + 1);
      onUpdateLikeCount(PostlikesCount + 1);
    }
  };

  const handleUnLike = async () => {
    let endpoint = listTypeData === "RealEstate" || listTypeData === "Car" ? "Post" : "";
    const result = await SetPostLikeUnLike(endpoint, "UnLike", User.userId, item.postId);

    if (result.success) {
      SetPostLike(false);
      SetPostlikesCount(PostlikesCount - 1);
      onUpdateLikeCount(PostlikesCount - 1);
    }
  };
  const handlePresentModalPress = useCallback(() => {
    commentSheetRef.current?.open();
  }, []);
 



async function callCommentList() {
  pageSize_Set(15)
  currentPage_Set(0);
  hasMore_Set(true);

let endpoint=""

  if(listTypeData=="RealEstate")
    {
    //pageTitle("Property");
    }
    if(listTypeData=="Car")
    {
      endpoint="Car"
    }


  await execute(
    endpoint,
   User.userId,
   item.postId,
   
  );

}
const closeModal = useCallback(item => {

  setCardComment(item);
 
}, []);
useEffect(() => {


  callCommentList();
}, []);


  return (
    <>
    <HStack style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
      <VStack style={{ marginRight: 10 }}>
        <HStack style={{justifyContent:'center',alignItems:'center'}}>
          <TouchableOpacity onPress={PostLike ? handleUnLike : handleLike}>
            <Icon as={FavouriteIcon} size='xxl' style={{ marginRight: 5 }} color={PostLike ? 'red' : undefined} />
          </TouchableOpacity>
          {PostlikesCount > 0 && 
           <TouchableOpacity onPress={handleListView}>
          <ZText type={'R16'}>{PostlikesCount}</ZText>
          </TouchableOpacity>}
        </HStack>
      </VStack>

      <VStack style={{ marginRight: 10 }}>
        <HStack style={{justifyContent:'center' ,alignItems:'center'}}>
        <TouchableOpacity  onPress={handlePresentModalPress}>
          <Icon as={MessageCircleIcon} style={{ marginRight: 5 }} size='xxl'/>
          </TouchableOpacity>
          {cardComment > 0 && <ZText type={'R16'}>{cardComment}</ZText>}
        </HStack>
      </VStack>

      <VStack style={{ marginRight: 10 }}>
        <Icon as={share_PIcon} size='xxl'/>
      </VStack>

      {/* <VStack style={{ marginLeft: 'auto' }}>
        <Icon as={bookmark_icon} />
      </VStack> */}
    </HStack>

    <CommentBottomSheet 
     
        ref={commentSheetRef}
        postItem={item}
        User={User}
        listTypeData={listTypeData}
        userPermissions={userPermissions}
        onClose={closeModal}
      />
  
</>
  );
};
const styles = StyleSheet.create({
    textInput: {
        alignSelf: "stretch",
        marginHorizontal: 12,
        marginBottom: 12,
        padding: 12,
        borderRadius: 12,
        backgroundColor: "grey",
        color: "white",
        textAlign: "center",
      },
      bottomcontainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
       
      },
    container: {
      flex: 1,
      padding: 24,
      justifyContent: 'center',
      backgroundColor: 'grey',
    },  sheetContent: {
      flex: 1,
      width:'100%',
     
    },
    contentContainer: {
     // paddingBottom: 20,
    },
  //   contentContainer: {
  //     height:"90%",
  // //     flex: 1,
  // //   //  alignItems: 'center',  // or 'center'
  // //    height:'100%',
  // //  //  backgroundColor: 'red',
  //  paddingBottom: 20,
  //  marginBottom:200
  //   },
    footerContainer: {
    minHeight:50,
        padding: 12,
       
        borderRadius: 12,
  
        borderTopWidth: 1,                // Adds a top border
        borderTopColor: '#ccc',           // Sets the top border color
        backgroundColor: 'white',         // Sets background color
        shadowColor: '#000',              // iOS shadow color
        shadowOffset: { width: 0, height: -2 },  // iOS shadow offset for top shadow
        shadowOpacity: 0.2,               // iOS shadow opacity
        shadowRadius: 4,                  // iOS shadow blur
        elevation: 5,      
       
      },
      footerText: {
        textAlign: 'center',
        color: 'white',
        fontWeight: '800',
      },
////////////////////////////////////////////////////////////////
mainContainer: {
  flexDirection: 'row',
  width: '100%',
  marginBottom: 20,
  alignItems: 'flex-start',
  verticalAlign: 'top',
  paddingHorizontal: 10,
},
  profileWrap: {
  width: moderateScale(50),
  height: moderateScale(50),
  borderRadius: moderateScale(25),
  verticalAlign: 'top',
marginRight:5
},
  profileImage: {
  width: moderateScale(20),
  height: moderateScale(20),
  borderRadius: moderateScale(20),
  verticalAlign: 'top',
}





  });
export default PostActions;
