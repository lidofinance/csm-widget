import { Button, ButtonProps } from '@lidofinance/lido-ui';
import { PATH } from 'consts/urls';
import { FC } from 'react';
import { LocalLink } from 'shared/navigate';
import { DvtFormStatus, useDvtState } from './shared';

const getButtonText = (status: DvtFormStatus | undefined): string => {
  switch (status) {
    case 'APPROVED':
    case 'REJECTED':
    case 'REVIEW':
      return 'View application';
    default:
      return 'Apply for IDVTC';
  }
};

type Props = {
  size?: ButtonProps['size'];
};

export const DvtApplyButton: FC<Props> = ({ size }) => {
  const { data } = useDvtState();

  return (
    <LocalLink href={PATH.TYPE_DVT_APPLY}>
      <Button fullwidth size={size} variant="translucent">
        {getButtonText(data?.status)}
      </Button>
    </LocalLink>
  );
};
