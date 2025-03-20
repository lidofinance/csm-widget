import { ArrowLeft, ButtonIcon } from '@lidofinance/lido-ui';
import { PATH } from 'consts/urls';
import { FC } from 'react';
import { LocalLink } from 'shared/navigate';

export const BackButton: FC = () => {
  return (
    <LocalLink href={PATH.SURVEYS}>
      <ButtonIcon
        variant="ghost"
        color="secondary"
        size="xs"
        icon={<ArrowLeft />}
      >
        Back
      </ButtonIcon>
    </LocalLink>
  );
};
