
import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Dimensions, ActivityIndicator, FlatList } from "react-native";
import Video from "react-native-video";
import { fetchInstagramVideos } from "../../../BrokerAppCore/services/new/podcastService";

const { height: screenHeight, width } = Dimensions.get("window");

// Define approximate header and tab heights
const HEADER_HEIGHT = 60; // Adjust as per your UI
const TAB_BAR_HEIGHT = 60; // Adjust based on your bottom tab bar
const VIDEO_HEIGHT = screenHeight - HEADER_HEIGHT - TAB_BAR_HEIGHT; // Available height for video

const InstagramReels = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  // Fetch Instagram videos
  const fetchInstagram = async () => {

    await fetchInstagramVideos(
      "EAAYJ6U4AIAQBO6GxSVXZB9ZBS6x4Y10WsCzGVkBIYRjybfzfKFwSlZC1VijrxqWxnBthy8PmZArvhYAedo3l933GnOwy8YgAeZCg5eGIBJB7lzKASB6VvWfvAL3YafR7A2zSgauGcmIUh97uBfRu9czLGJjlYxKptarxk1n8GRwZAybqT0YO8MhgZDZD",
      "17841458791630720",
      (newVideos, isFirstBatch) => {
        setVideos((prevVideos) => isFirstBatch ? newVideos : [...prevVideos, ...newVideos]);
        setLoading(false);
      }
    );
    // const result:any = await fetchInstagramVideos("EAAYJ6U4AIAQBO6GxSVXZB9ZBS6x4Y10WsCzGVkBIYRjybfzfKFwSlZC1VijrxqWxnBthy8PmZArvhYAedo3l933GnOwy8YgAeZCg5eGIBJB7lzKASB6VvWfvAL3YafR7A2zSgauGcmIUh97uBfRu9czLGJjlYxKptarxk1n8GRwZAybqT0YO8MhgZDZD","17841458791630720");
    // if (result.length > 0) {
    //   console.log(result);
    //   setVideos(result);
    //   setLoading(false);
    //   return result;
    // }
 
  };

  useEffect(() => {
    fetchInstagram();
  }, []);

  const renderItem = useCallback(({ item, index }) => (
    <View style={{ height: VIDEO_HEIGHT, width, justifyContent: "center", alignItems: "center" }}>
      <Video
        source={{ uri: item.media_url }}
        style={{ width, height: VIDEO_HEIGHT }}// Responsive aspect ratio
        resizeMode="cover"
        controls={false}
        repeat
        paused={currentIndex !== index} // Auto-play when in view
      />
    </View>
  ), [currentIndex]);

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      {loading ? (
        <ActivityIndicator size="large" color="#fff" style={{ flex: 1, justifyContent: "center" }} />
      ) : (
        <FlatList
          ref={flatListRef}
          data={videos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          snapToInterval={VIDEO_HEIGHT} // Ensure snapping
          snapToAlignment="start"
          decelerationRate="fast"
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.y / VIDEO_HEIGHT);
            setCurrentIndex(index);
          }}
          initialNumToRender={1}
          maxToRenderPerBatch={2}
          windowSize={3}
          
        />
      )}
    </View>
  );
};

export default InstagramReels;
