import { Block, Button } from '@lidofinance/lido-ui';
import { FC, useCallback } from 'react';
import { Stack } from 'shared/components';
import { useAuth } from '../shared';

export const SiweSignIn: FC = () => {
  const { signIn } = useAuth();

  const login = useCallback(() => {
    void signIn();
  }, [signIn]);

  return (
    <Block>
      <Stack align="center" spaceBetween>
        <Button size="sm" onClick={login} fullwidth>
          Sign in
        </Button>
      </Stack>
    </Block>
  );
};
