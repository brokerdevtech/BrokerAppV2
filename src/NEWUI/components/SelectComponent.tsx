import {View, Text} from 'react-native';
import React from 'react';
import {VStack} from '@/components/ui/vstack';
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from '@/components/ui/select';
import {ChevronDownIcon} from '@/components/ui/icon';
import {Input, InputField, InputIcon, InputSlot} from '@/components/ui/input';

const SelectComponent = () => {
  return (
    <VStack space="xl" style={styles.spacingBetweenInputs}>
      <Select>
        <SelectTrigger variant="outline" size="md" style={styles.inputField}>
          <SelectInput placeholder="Select" />
          <SelectIcon as={ChevronDownIcon} />
        </SelectTrigger>
        <SelectPortal>
          <SelectBackdrop />
          <SelectContent>
            <SelectDragIndicatorWrapper>
              <SelectDragIndicator />
            </SelectDragIndicatorWrapper>
            <Input>
              <InputSlot className="pl-3">
                <InputIcon as={SearchIcon} />
              </InputSlot>
              <InputField placeholder="Search..." />
            </Input>
            <SelectItem label="Male" value="male" />
            <SelectItem label="Female" value="female" />
            <SelectItem label="Others" value="others" />
          </SelectContent>
        </SelectPortal>
      </Select>
    </VStack>
  );
};

export default SelectComponent;
