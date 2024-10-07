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
import {CheckIcon, CloseCircleIcon} from '../../components/ui/icon';
import {Color} from '../styles/GlobalStyles';

const SingleSelectModal = ({
  data,
  selectedItem,
  setSelectedItem,
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
    if (selectedItem === key) {
      setSelectedItem(null);
    } else {
      setSelectedItem(key);
    }
  };

  const clearSelection = () => {
    setSelectedItem(null);
    setSearch('');
  };

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
              <Icon as={CloseCircleIcon} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={clearSelection}>
              <Text style={styles.clearAllText}>Clear</Text>
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
                      as={selectedItem === item[keyProperty] ? CheckIcon : null}
                      size={20}
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

const SingleSelectComponent = ({
  data,
  onSelectionChange,
  keyProperty = 'value',
  valueProperty = 'label',
  displayText,
  title,
  isDisabled = false,
  selectedValue,
  ref,
}) => {
  const [selectedItem, setSelectedItem] = useState(selectedValue);
  const [tempSelectedItem, setTempSelectedItem] = useState(selectedValue);
  const [modalVisible, setModalVisible] = useState(false);
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      // Assuming there's an input element you want to focus on
      inputRef.current.focus();
    },
  }));
  useEffect(() => {
    setTempSelectedItem(selectedItem);
  }, [selectedItem, modalVisible]);

  const applySelection = () => {
    setSelectedItem(tempSelectedItem);
    onSelectionChange(tempSelectedItem);
  };

  const getDisplayText = () => {
    if (!selectedItem) {
      return displayText;
    }
    const selectedItemObj = data.find(d => d[keyProperty] === selectedItem);
    return selectedItemObj ? selectedItemObj[valueProperty] : displayText;
  };
  const handlePress = () => {
    if (!isDisabled) {
      Keyboard.dismiss();
      setModalVisible(true);
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        ref={inputRef}
        style={[styles.selectBox, isDisabled && styles.selectBoxDisabled]}
        onPress={handlePress}
        disabled={isDisabled}>
        <Text
          style={[
            styles.selectBoxText,
            isDisabled && styles.selectBoxTextDisabled,
          ]}>
          {getDisplayText()}
        </Text>
        <Icon
          name="chevron-down-outline"
          size={20}
          color={isDisabled ? '#ccc' : '#000'}
        />
      </TouchableOpacity>
      <SingleSelectModal
        data={data}
        selectedItem={tempSelectedItem}
        setSelectedItem={setTempSelectedItem}
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
  },
  selectBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: '100%',
  },
  selectBoxDisabled: {
    backgroundColor: '#f0f0f0',
    borderColor: '#ccc',
  },
  selectBoxText: {
    color: '#000',
  },
  selectBoxTextDisabled: {
    color: '#ccc',
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
    color: '#BC4A4F',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
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
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
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
    backgroundColor: '#BC4A4F',
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

export default SingleSelectComponent;
