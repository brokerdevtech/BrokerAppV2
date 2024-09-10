import {View, Text} from 'react-native';
import React from 'react';
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from '@/components/ui/actionsheet';
import {VStack} from '@/components/ui/vstack';
import {Pressable} from '@/components/ui/pressable';
import {ArrowLeftIcon, CloseIcon, Icon} from '@/components/ui/icon';
import {Heading} from '@/components/ui/heading';
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';
import {HStack} from '@/components/ui/hstack';
import {Link, LinkText} from '@/components/ui/link';
import {Button, ButtonIcon, ButtonText} from '@/components/ui/button';
import {GoogleIcon} from '@/src/assets/svg';
import {Input, InputField} from '@/components/ui/input';

export default function LoginModal({showActionsheet, handleClose}) {
  return (
    <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
      <ActionsheetBackdrop />
      <ActionsheetContent>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
        <VStack className="max-w-[440px] w-full" space="md">
          <VStack space="md" className="justify-center items-center mt-4">
            <Heading className="md:text-center" size="xl">
              Log in with your Email
            </Heading>
          </VStack>
          <VStack className="w-full">
            <VStack space="xl" className="w-full">
              <FormControl className="w-full">
                <Input className="h-12 rounded-lg">
                  <InputField placeholder="Email" returnKeyType="done" />
                </Input>
              </FormControl>

              <FormControl className="w-full">
                <Input className="h-12 rounded-lg">
                  <InputField placeholder="Password" returnKeyType="done" />
                </Input>
              </FormControl>
              <HStack className="w-full justify-center mb-8">
                <Link href="/auth/forgot-password">
                  <LinkText className="font-medium text-sm text-primary-700 group-hover/link:text-primary-600">
                    Forgot Password?
                  </LinkText>
                </Link>
              </HStack>
            </VStack>
            <VStack className="w-full my-7" space="lg">
              <Button className="w-full rounded-md" size="xl">
                <ButtonText className="font-medium">Log in</ButtonText>
              </Button>
            </VStack>
          </VStack>
        </VStack>
      </ActionsheetContent>
    </Actionsheet>
  );
}
