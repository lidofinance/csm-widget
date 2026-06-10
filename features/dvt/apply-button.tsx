import { Button, ButtonProps } from '@lidofinance/lido-ui';
import { PATH } from 'consts/urls';
import { FC } from 'react';
import { LocalLink } from 'shared/navigate';
import { DvtFormStatus, DvtTypeStatus, useDvtState } from './shared';

type ButtonState = {
  text: string;
  variant: ButtonProps['variant'];
  href: PATH;
};

const getButtonState = (
  typeStatus: DvtTypeStatus,
  status: DvtFormStatus | undefined,
): ButtonState => {
  if (typeStatus === 'CLAIMED') {
    return {
      text: 'View IDVTC status',
      variant: 'translucent',
      href: PATH.TYPE_DVT_APPLY,
    };
  }
  if (typeStatus === 'ISSUED') {
    return {
      text: 'Claim IDVTC type',
      variant: undefined,
      href: PATH.TYPE_DVT_CLAIM,
    };
  }
  switch (status) {
    case 'APPROVED':
    case 'REJECTED':
    case 'REVIEW':
      return {
        text: 'View application',
        variant: 'translucent',
        href: PATH.TYPE_DVT_APPLY,
      };
    default:
      return {
        text: 'Apply for IDVTC',
        variant: 'translucent',
        href: PATH.TYPE_DVT_APPLY,
      };
  }
};

type Props = {
  size?: ButtonProps['size'];
};

export const DvtApplyButton: FC<Props> = ({ size }) => {
  const { typeStatus, data } = useDvtState();
  const { text, variant, href } = getButtonState(typeStatus, data?.status);

  return (
    <LocalLink href={href}>
      <Button fullwidth size={size} variant={variant}>
        {text}
      </Button>
    </LocalLink>
  );
};
