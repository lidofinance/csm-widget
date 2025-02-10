import { Block, Button, Text } from '@lidofinance/lido-ui';
import { FC, useCallback } from 'react';
import { Stack } from 'shared/components';
import { useSiwe } from '../shared/use-siwe';

export const SiweSignIn: FC = () => {
  const { signIn } = useSiwe();

  const login = useCallback(() => {
    // console.log('login');
    void signIn();
  }, [signIn]);

  return (
    <Block>
      <Stack align="center" spaceBetween>
        <Text as="h3" size="sm" weight="bold">
          Sign in
        </Text>
        <Button size="sm" onClick={login}>
          login
        </Button>
      </Stack>
    </Block>
  );
};
