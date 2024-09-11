import React, {useState} from 'react';
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from '@/components/ui/actionsheet';
import {VStack} from '@/components/ui/vstack';

import {Heading} from '@/components/ui/heading';
import {FormControl} from '@/components/ui/form-control';
import {HStack} from '@/components/ui/hstack';
import {Link, LinkText} from '@/components/ui/link';
import {Button, ButtonText} from '@/components/ui/button';

import {Input, InputField} from '@/components/ui/input';
import {useApiRequest} from '@/src/hooks/useApiRequest ';
import {loginApi} from '@/BrokerAppcore/services/authServices2';
import {useNavigation} from '@react-navigation/native';

export default function LoginModal({showActionsheet, handleClose}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();

  const {data, status, error, execute} = useApiRequest(loginApi);

  const handleLogin = async () => {
    await execute({username, password});
    // console.log('Data :-', data);
    // console.log('Error :-', error);
    // console.log(username, password);
    // console.log('Status :-', status);
    // if (status === 200 && data?.token) {
    //   // navigation.navigate('HomeTab');
    //   console.log('Success!');
    // }
  };
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
                  <InputField
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    returnKeyType="done"
                  />
                </Input>
              </FormControl>

              <FormControl className="w-full">
                <Input className="h-12 rounded-lg">
                  <InputField
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    returnKeyType="done"
                  />
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
            {status === 500 && <p style={{color: 'red'}}>{error}</p>}
            {status === 200 && <p>Login successful</p>}
            <VStack className="w-full my-7" space="lg">
              <Button
                className="w-full rounded-md"
                size="xl"
                onPress={handleLogin}
                disabled={status === 500}>
                <ButtonText className="font-medium">Log in</ButtonText>
              </Button>
            </VStack>
          </VStack>
        </VStack>
      </ActionsheetContent>
    </Actionsheet>
  );
}
