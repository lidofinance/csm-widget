import { Button, ButtonProps } from '@lidofinance/lido-ui';
import { PATH } from 'consts/urls';
import { FC } from 'react';
import { LocalLink } from 'shared/navigate';
import { IcsFormStatus, TypeStatus, useIcsState } from './shared';

type ButtonState = {
  text: string;
  variant: ButtonProps['variant'];
};

const getButtonState = (
  typeStatus: TypeStatus,
  status: IcsFormStatus | undefined,
): ButtonState => {
  if (typeStatus === 'CLAIMED') {
    return { text: 'View ICS status', variant: 'translucent' };
  }
  if (typeStatus === 'ISSUED') {
    return { text: 'Claim ICS type', variant: undefined };
  }
  switch (status) {
    case 'APPROVED':
    case 'REJECTED':
    case 'REVIEW':
      return { text: 'View application', variant: 'translucent' };
    default:
      return { text: 'Apply for ICS', variant: 'translucent' };
  }
};

type Props = {
  size?: ButtonProps['size'];
};

export const IcsApplyButton: FC<Props> = ({ size }) => {
  const { typeStatus, data } = useIcsState();
  const { text, variant } = getButtonState(typeStatus, data?.status);

  return (
    <LocalLink href={PATH.TYPE_ICS_APPLY}>
      <Button fullwidth size={size} variant={variant}>
        {text}
      </Button>
    </LocalLink>
  );
};
