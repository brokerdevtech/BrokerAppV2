import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import React, {useState} from 'react';
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectFlatList,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from '@/components/ui/select';
import {ChevronDownIcon, SearchIcon} from '@/components/ui/icon';
import {Input, InputField, InputIcon} from '@/components/ui/input';
import {FormControl} from '@/components/ui/form-control';

export default function SelectComponent({
  data,
  onSelect,
  placeholder,
  isdisabled = false,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredData = data?.filter(item =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  return (
    <Select onValueChange={value => onSelect(value)} isDisabled={isdisabled}>
      <SelectTrigger variant="outline" size="xl" className="rounded-xl">
        <SelectInput placeholder={placeholder} />
        <SelectIcon className="mr-3" as={ChevronDownIcon} />
      </SelectTrigger>
      <SelectPortal>
        <SelectBackdrop />
        <SelectContent>
          <SelectDragIndicatorWrapper>
            <SelectDragIndicator />
          </SelectDragIndicatorWrapper>
          <FormControl className="w-full px-4 mt-4 text-gray-200">
            <Input variant="outline" size="lg" className="h-12">
              <InputIcon as={SearchIcon} size="md" />
              <InputField
                placeholder="Search..."
                value={searchTerm}
                onChangeText={text => setSearchTerm(text)}
              />
            </Input>
          </FormControl>
          <SelectFlatList
            data={filteredData}
            renderItem={({item}) => (
              <SelectItem label={item.label} value={item.value} />
            )}
            className="w-full"
            style={{height: 300}}
          />
        </SelectContent>
      </SelectPortal>
    </Select>
  );
}
