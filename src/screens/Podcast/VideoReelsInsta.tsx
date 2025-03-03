
import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Dimensions, ActivityIndicator, FlatList } from "react-native";
import Video from "react-native-video";
import { fetchInstagramVideos } from "../../../BrokerAppCore/services/new/podcastService";

const { height } = Dimensions.get("window");

const InstagramReels = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  // Fetch Instagram videos
  const fetchInstagram = async () => {
    const result:any = await fetchInstagramVideos("EAAYJ6U4AIAQBO6S26gQxhADd6tL4cPUPqD9ZBdiwTVNjve1qZAxxZAeA7SZClyvihz2ZB9BLcdxZBfMfn0kOISy3ZBpjT7RGZCsQRmY5LPCIZBEhtJkynDY9XZAR6S5XjauBBSzml0ePRIRcRZAULkrfOPl7dvB8yTNz98aSUBnfaAea82OqK6E1gtgD3KmFUUkmRmOHTn1qlROzrwnrnT2","17841458791630720");
    if (result.length > 0) {
      console.log(result);
      setVideos(result);
      setLoading(false);
      return result;
    }
 
  };

  useEffect(() => {
    fetchInstagram();
  }, []);

  const renderItem = useCallback(({ item, index }) => (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Video
        source={{ uri: item.media_url }}
        style={{ width: "100%", aspectRatio: 9 / 16 }} // Responsive aspect ratio
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
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.y / e.nativeEvent.layoutMeasurement.height);
            setCurrentIndex(index);
          }}
        />
      )}
    </View>
  );
};

export default InstagramReels;
