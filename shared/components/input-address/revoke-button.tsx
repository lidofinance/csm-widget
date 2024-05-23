import { Button, ButtonProps } from '@lidofinance/lido-ui';
import { FC } from 'react';

export const RevokeButton: FC<ButtonProps> = (props) => {
  return (
    <Button {...props} size="xxs" variant="translucent">
      REVOKE
    </Button>
  );
};
