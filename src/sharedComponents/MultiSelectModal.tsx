import {Color} from '../styles/GlobalStyles';
import {
  CheckIcon,
  ChevronDownIcon,
  CloseCircleIcon,
  Icon,
} from '../../components/ui/icon';
import React, {useState, useEffect, useRef, useImperativeHandle} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Keyboard,
} from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';

const MultiSelectModal = ({
  data,
  tempSelectedItems,
  setTempSelectedItems,
  visible,
  setVisible,
  keyProperty,
  valueProperty,
  title,
  applySelection,
}) => {
  const [search, setSearch] = useState('');

  const filteredData = data?.filter(
    item =>
      item[valueProperty] &&
      item[valueProperty].toLowerCase().includes(search.toLowerCase()),
  );

  const toggleItem = key => {
    if (tempSelectedItems.includes(key)) {
      setTempSelectedItems(tempSelectedItems.filter(item => item !== key));
    } else {
      setTempSelectedItems([...tempSelectedItems, key]);
    }
  };

  const clearAll = () => {
    setTempSelectedItems([]);
    setSearch('');
  };
  // console.log(filteredData);
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => setVisible(false)}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Icon as={CloseCircleIcon} color="#000" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={clearAll}>
              <Text style={styles.clearAllText}>Clear All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.searchBar}
              placeholder="Search..."
              value={search}
              onChangeText={setSearch}
            />
            <View style={styles.listContainer}>
              <FlatList
                data={filteredData}
                keyExtractor={item => item[keyProperty]}
                keyboardShouldPersistTaps={'handled'}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.itemContainer}
                    onPress={() => toggleItem(item[keyProperty])}>
                    <Text style={styles.itemText}>{item[valueProperty]}</Text>

                    <Icon
                      as={
                        tempSelectedItems.includes(item[keyProperty])
                          ? CheckIcon
                          : null
                      }
                      stroke={Color.primary}
                    />
                  </TouchableOpacity>
                )}
              />
            </View>

            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => {
                applySelection();
                setVisible(false);
              }}>
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const MultiSelectComponent = ({
  data,
  onSelectionChange,
  keyProperty,
  valueProperty,
  displayText,
  alreadySelected = [],
  title,
  ref,
  isDisabled = false,
}) => {
  const [selectedItems, setSelectedItems] = useState(alreadySelected);
  const [tempSelectedItems, setTempSelectedItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const inputRef = useRef();

  // console.log(alreadySelected, 'modal');
  useImperativeHandle(ref, () => ({
    focus: () => {
      // Assuming there's an input element you want to focus on
      inputRef.current.focus();
    },
  }));
  useEffect(() => {

    console.log(alreadySelected, selectedItems);
    setTempSelectedItems(selectedItems);
  }, [selectedItems, modalVisible]);

  const applySelection = () => {
    setSelectedItems(tempSelectedItems);
    onSelectionChange(tempSelectedItems);
  };
  const closeapplySelection = item => {
    let tmpselectedItems = selectedItems.filter(i => i !== item);
    setSelectedItems(tmpselectedItems);
    onSelectionChange(tmpselectedItems);
  };

  const getDisplayText = () => {
    if (selectedItems.length === 0) {
      return displayText;
    }

    const selectedNames = selectedItems.map(
      item => data?.find(d => d[keyProperty] === item)[valueProperty],
    );
    const displayTextConcat = selectedNames.join(', ');
    return displayTextConcat.length > 20
      ? displayTextConcat.substring(0, 17) + '...'
      : displayTextConcat;
  };
  const handlePress = () => {
    if (!isDisabled) {
      Keyboard.dismiss();
      setModalVisible(true);
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.selectBox} onPress={handlePress}>
        <Text style={styles.selectBoxText}>{getDisplayText()}</Text>
        <Icon as={ChevronDownIcon} />
      </TouchableOpacity>
      <View style={styles.tagsContainer}>
        {selectedItems.map(item => (
          <View key={item} style={styles.tag}>
            <Text style={styles.tagText}>
              {data?.find(d => d[keyProperty] === item)[valueProperty]}
            </Text>
            <TouchableOpacity onPress={() => closeapplySelection(item)}>
              <Icon as={CloseCircleIcon} color={isDisabled ? '#ccc' : '#fff'} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <MultiSelectModal
        ref={inputRef}
        data={data}
        tempSelectedItems={tempSelectedItems}
        setTempSelectedItems={setTempSelectedItems}
        visible={modalVisible}
        setVisible={setModalVisible}
        keyProperty={keyProperty}
        valueProperty={valueProperty}
        title={title}
        applySelection={applySelection}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    // margin: 20,
  },
  selectBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 10,
    height: 43,
    // borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    width: '100%',
  },
  selectBoxText: {
    color: '#000',
  },
  tagsContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    flexWrap: 'wrap',
    marginTop: 10,
    alignItems: 'flex-start',
  },
  tag: {
    flexDirection: 'row',
    //alignItems: 'center',
    backgroundColor: Color.primary,
    padding: 10,
    borderRadius: 15,
    margin: 5,
  },
  tagText: {
    color: 'white',
    marginRight: 5,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  clearAllText: {
    color: Color.primary,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    // borderTopLeftRadius: 10,
    // borderTopRightRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  searchBar: {
    marginBottom: 10,
    padding: 10,

    borderRadius: 5,
    borderWidth: 0,
    borderColor: '#ddd',

    backgroundColor: '#f9f9f9',
    height: 43,
  },
  listContainer: {
    maxHeight: 200, // Adjust this value to show 4 items (based on item height)
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  itemText: {
    fontSize: 16,
  },
  applyButton: {
    backgroundColor: Color.primary,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  applyButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});

export default MultiSelectComponent;
