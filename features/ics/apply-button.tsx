import { Button, ButtonProps } from '@lidofinance/lido-ui';
import { PATH } from 'consts/urls';
import { useNodeOperatorId } from 'modules/web3';
import { FC } from 'react';
import { LocalLink } from 'shared/navigate';
import { IcsFormStatus, TypeStatus, useIcsState } from './shared';

type ButtonState = {
  text: string;
  variant: ButtonProps['variant'];
  href: PATH;
};

const getButtonState = (
  typeStatus: TypeStatus,
  status: IcsFormStatus | undefined,
  hasOperator: boolean,
): ButtonState => {
  if (typeStatus === 'CLAIMED') {
    return {
      text: 'View ICS status',
      variant: 'translucent',
      href: PATH.TYPE_ICS_APPLY,
    };
  }
  if (typeStatus === 'ISSUED') {
    // Claiming a type writes onto an existing operator, so without an
    // active one the only meaningful action is to create it.
    if (!hasOperator) {
      return {
        text: 'Create ICS operator',
        variant: undefined,
        href: PATH.CREATE,
      };
    }
    return {
      text: 'Claim ICS type',
      variant: undefined,
      href: PATH.TYPE_ICS_CLAIM,
    };
  }
  switch (status) {
    case 'APPROVED':
    case 'REJECTED':
    case 'REVIEW':
      return {
        text: 'View application',
        variant: 'translucent',
        href: PATH.TYPE_ICS_APPLY,
      };
    default:
      return {
        text: 'Apply for ICS',
        variant: 'translucent',
        href: PATH.TYPE_ICS_APPLY,
      };
  }
};

type Props = {
  size?: ButtonProps['size'];
};

export const IcsApplyButton: FC<Props> = ({ size }) => {
  const { typeStatus, data } = useIcsState();
  const nodeOperatorId = useNodeOperatorId();
  const { text, variant, href } = getButtonState(
    typeStatus,
    data?.status,
    nodeOperatorId !== undefined,
  );

  return (
    <LocalLink href={href}>
      <Button fullwidth size={size} variant={variant}>
        {text}
      </Button>
    </LocalLink>
  );
};
