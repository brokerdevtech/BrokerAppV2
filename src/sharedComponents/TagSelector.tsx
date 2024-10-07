import React, { useState, useRef, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';


const TagSelector = ({ tags }) => {

    console.log(tags);
  const [selectedTags, setSelectedTags] = useState([]);
  const bottomSheetRef = useRef(null);

  const handleTagPress = useCallback(
    (tag) => {
      if (selectedTags.includes(tag)) {
        setSelectedTags(selectedTags.filter((item) => item !== tag));
      } else {
        setSelectedTags([...selectedTags, tag]);
      }
    },
    [selectedTags]
  );

  const openBottomSheet = () => {
    bottomSheetRef.current?.expand();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.tag, selectedTags.includes(item) && styles.selectedTag]}
      onPress={() => handleTagPress(item)}
    >
      <Text style={styles.tagText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Row to display selected tags */}
      <View style={styles.selectedTagsContainer}>
        {selectedTags.map((tag, index) => (
          <View key={index} style={styles.selectedTagItem}>
            <Text style={styles.selectedTagText}>{tag}</Text>
          </View>
        ))}
        {/* Button to open BottomSheet */}
        <TouchableOpacity style={styles.iconButton} onPress={openBottomSheet}>
         <Text>Open</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Sheet */}
      <BottomSheet ref={bottomSheetRef} snapPoints={['50%']} >
        <FlatList
          data={tags}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        //   numColumns={3}
        //   contentContainerStyle={styles.listContainer}
        />
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  selectedTagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  selectedTagItem: {
    backgroundColor: '#007AFF',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginRight: 5,
    marginBottom: 5,
  },
  selectedTagText: {
    color: '#FFF',
  },
  iconButton: {
    padding: 5,
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  tag: {
    flex: 1,
    margin: 10,
    paddingVertical: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedTag: {
    backgroundColor: '#007AFF',
  },
  tagText: {
    color: '#333',
  },
});

export default TagSelector;
