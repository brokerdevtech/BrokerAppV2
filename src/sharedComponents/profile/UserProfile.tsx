import React from 'react';
import { Button, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Avatar, AvatarBadge, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import margin from '@/themes/margin';

const UserProfile = () => {
  return (
   <View style={styles.userContainer}>
       
       <View>
            <TouchableOpacity >
               <View style={styles.userActiveAvtarBorder}> 
                    <Avatar size="lg" className="m-1">
                        <AvatarFallbackText>Jane Doe</AvatarFallbackText>
                        <AvatarImage source={{ uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",}}/>
                        <AvatarBadge  />
                    </Avatar>
               </View> 
                <Text style={styles.userText}>Your Story</Text>
            </TouchableOpacity>
       </View>
       <View>
            <TouchableOpacity >
                <View style={styles.userAvtarBorder}> 
                    <Avatar size="lg" className="m-1">
                        <AvatarFallbackText>Jane Doe</AvatarFallbackText>
                        <AvatarImage source={{ uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",}}/>
                    </Avatar>
                </View>    
                <Text style={styles.userText}>Selena</Text>
            </TouchableOpacity>
       </View>
       <View>
            <TouchableOpacity >
               <View style={styles.userAvtarBorder}> 
                    <Avatar size="lg" className="m-1">
                        <AvatarFallbackText>Jane Doe</AvatarFallbackText>
                        <AvatarImage source={{ uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",}}/>
                    </Avatar>
               </View> 
                <Text style={styles.userText}>Imran</Text>
            </TouchableOpacity>
       </View>
       <View>
            <TouchableOpacity >
               <View style={styles.userAvtarBorder}> 
                    <Avatar size="lg" className="m-1">
                        <AvatarFallbackText>Jane Doe</AvatarFallbackText>
                        <AvatarImage source={{ uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",}}/>
                    </Avatar>
               </View> 
                <Text style={styles.userText}>Anand</Text>
            </TouchableOpacity>
       </View>
       <View>
            <TouchableOpacity >
               <View style={styles.userAvtarBorder}> 
                    <Avatar size="lg" className="m-1">
                        <AvatarFallbackText>Jane Doe</AvatarFallbackText>
                        <AvatarImage source={{ uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",}}/>
                    </Avatar>
               </View> 
                <Text style={styles.userText}>Kanishk</Text>
            </TouchableOpacity>
       </View>
       <View>
            <TouchableOpacity >
               <View style={styles.userAvtarBorder}> 
                    <Avatar size="lg" className="m-1">
                        <AvatarFallbackText>Jane Doe</AvatarFallbackText>
                        <AvatarImage source={{ uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",}}/>
                    </Avatar>
               </View> 
                <Text style={styles.userText}>Anand</Text>
            </TouchableOpacity>
       </View>
      
   </View>
  );
};
const styles = StyleSheet.create({
 
  userContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    height: 120,
    paddingVertical: 15,
    paddingLeft: 15
  },
  userAvtarBorder: {
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    borderWidth: 2,
    borderColor: '#E8E8E8'
  },
  userActiveAvtarBorder: {
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    borderWidth: 2,
    borderColor: '#C20707'
  },
  userText: {
    color: '#263238',
    textAlign: 'center',
    fontFamily: 'Gilroy',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: 20,
    paddingTop: 8
  },
  
});
export default UserProfile;
