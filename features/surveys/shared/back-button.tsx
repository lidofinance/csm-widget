import { ArrowLeft, ButtonIcon } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { LocalLink } from 'shared/navigate';

export const BackButton: FC = () => {
  return (
    <LocalLink href="/surveys">
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
