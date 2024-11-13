import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Color} from '../styles/GlobalStyles';

const Stories: React.FC = () => {
  const stories = [
    {image: require('../assets/images/face.jpeg'), name: 'John'},
    {image: require('../assets/images/face.jpeg'), name: 'Alice'},
    {image: require('../assets/images/face.jpeg'), name: 'Nicolas'},
    {image: require('../assets/images/face.jpeg'), name: 'barbie_girlzzz'},
    {image: require('../assets/images/face.jpeg'), name: 'Arneo'},
  ];
  const renderStories = () => {

    return stories.map((story, index) => (
      <TouchableOpacity
        key={index}
        style={styles.otherStoryImageWrapper}
        onPress={() => {}}>
        <View style={styles.storyRound}>
          <FastImage source={story.image} style={styles.otherStories} />
          {/* <Image style={styles.otherStories} source={story.image} /> */}
        </View>
        <Text style={styles.profileName}>{story.name}</Text>
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.storiesHeaderWrapper}>
        <Text style={styles.storiesHeaderText}>Brokers Stories</Text>
      </View>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {/* Render your own story */}
        <TouchableOpacity style={styles.myStoryImageWrapper} onPress={() => {}}>
          <FastImage
            style={styles.myStoryImage}
            source={require('../assets/images/face.jpeg')}
          />
          <Text style={styles.profileName}>Catherin</Text>
        </TouchableOpacity>
        {/* Render stories from the props */}
        {renderStories()}
      </ScrollView>
    </View>
  );
};

export default Stories;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    // display: 'flex',
    // flex:1,
    width: '100%',
    // borderBottomColor: Color.gray1,
    // borderBottomWidth: 1,
  },
  storiesHeaderWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  storiesHeaderText: {
    fontSize: 16,
    fontWeight: '500',
  },
  myStoryImage: {
    width: 75,
    height: 75,
    borderRadius: 50,
  },
  myStoryImageWrapper: {
    padding: 10,
  },
  otherStories: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 50,
    margin: 2,
  },
  storyRound: {
    borderColor: '#1D7BBF',
    height: 80,
    width: 80,
    borderWidth: 2,
    borderRadius: 50,
  },
  otherStoryImageWrapper: {
    margin: 5,
  },
  profileName: {
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '400',
  },
});
