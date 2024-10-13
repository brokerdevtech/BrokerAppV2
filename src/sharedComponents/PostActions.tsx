import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, TouchableOpacity,Text,StyleSheet, TextInput } from 'react-native';
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
    BottomSheetTextInput,
  } from '@gorhom/bottom-sheet';
import { Box } from '../../components/ui/box';
import { Button, ButtonIcon } from '../../components/ui/button';

const PostActions = ({ item, User, listTypeData, onUpdateLikeCount }) => {
  const [PostLike, SetPostLike] = useState(item.userLiked === 1);
  const [PostlikesCount, SetPostlikesCount] = useState(item.likes);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['50%','100%'], []);
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
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const renderFooter = useCallback(
    props => (
      <BottomSheetFooter {...props} >
        <View style={styles.footerContainer}>
            <HStack style={{justifyContent:'center'}}>
        <TextInput style={{flex:1}}
                   multiline={true}
                  
                  placeholder="Add a comment..."
                  onFocus={() => {bottomSheetModalRef.current?.snapToIndex(1)}}
  onBlur={() => {{bottomSheetModalRef.current?.snapToIndex(0)}}}
                />
                <Box style={{justifyContent:'center'}}>
                <Button size="lg" className="rounded-full p-3.5"  style={{   backgroundColor: 'red',}} >
  {/* EditIcon is imported from 'lucide-react-native' */}
  <ButtonIcon as={ArrowUpIcon}  color='white' stroke='white'/>
</Button>
               </Box>
        </HStack>
        </View>
      </BottomSheetFooter>
    ),
    []
  );

  const renderBackdrop = useCallback(
    (props) => (
        <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={1}
            appearsOnIndex={0}
        />
    ),
    []
);
  return (
    <>
    <HStack style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
      <VStack style={{ marginRight: 10 }}>
        <HStack>
          <TouchableOpacity onPress={PostLike ? handleUnLike : handleLike}>
            <Icon as={FavouriteIcon} style={{ marginRight: 5 }} color={PostLike ? 'red' : undefined} />
          </TouchableOpacity>
          {PostlikesCount > 0 && <ZText type={'R16'}>{PostlikesCount}</ZText>}
        </HStack>
      </VStack>

      <VStack style={{ marginRight: 10 }}>
        <HStack>
        <TouchableOpacity onPress={handlePresentModalPress}>
          <Icon as={MessageCircleIcon} style={{ marginRight: 5 }} />
          </TouchableOpacity>
          {item.comments > 0 && <ZText type={'R16'}>{item.comments}</ZText>}
        </HStack>
      </VStack>

      <VStack style={{ marginRight: 10 }}>
        <Icon as={share_PIcon} />
      </VStack>

      <VStack style={{ marginLeft: 'auto' }}>
        <Icon as={bookmark_icon} />
      </VStack>
    </HStack>


     
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        
        enablePanDownToClose={true} 
         backdropComponent={renderBackdrop} 
        footerComponent={renderFooter}
      >
        <BottomSheetView style={styles.contentContainer}
        
        >
          
          <Text>Awesome</Text>
         
        </BottomSheetView>
      </BottomSheetModal>
   
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
    container: {
      flex: 1,
      padding: 24,
      justifyContent: 'center',
      backgroundColor: 'grey',
    },
    contentContainer: {
      flex: 1,
      alignItems: 'center',  // or 'center'
     height:'100%',
     backgroundColor: 'red',
    },
    footerContainer: {
        marginTop:"auto",
        padding: 12,
        margin: 12,
        borderRadius: 12,
        backgroundColor: 'white',
      },
      footerText: {
        textAlign: 'center',
        color: 'white',
        fontWeight: '800',
      },
  });
export default PostActions;
