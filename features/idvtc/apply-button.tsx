import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { Button, ButtonProps } from '@lidofinance/lido-ui';
import { PATH } from 'consts/urls';
import { useModule, useNodeOperatorId } from 'modules/web3';
import { FC } from 'react';
import { getOperatorTypeQuery } from 'shared/hooks';
import { LocalLink } from 'shared/navigate';
import { IdvtcFormStatus, IdvtcTypeStatus, useIdvtcState } from './shared';

type ButtonState = {
  text: string;
  variant: ButtonProps['variant'];
  href: PATH;
  query?: Record<string, string>;
};

const getButtonState = (
  typeStatus: IdvtcTypeStatus,
  status: IdvtcFormStatus | undefined,
  // Only a CSM operator can receive the type, so anything else must create one.
  hasOperator: boolean,
): ButtonState => {
  if (typeStatus === 'CLAIMED') {
    return {
      text: 'View IDVTC status',
      variant: 'translucent',
      href: PATH.TYPE_IDVTC_APPLY,
    };
  }
  if (typeStatus === 'ISSUED') {
    // Claiming a type writes onto an existing operator, so without an
    // active one the only meaningful action is to create it.
    if (!hasOperator) {
      return {
        text: 'Create IDVTC operator',
        variant: undefined,
        href: PATH.CREATE,
        query: getOperatorTypeQuery(OPERATOR_TYPE.CSM_IDVTC),
      };
    }
    return {
      text: 'Claim IDVTC type',
      variant: undefined,
      href: PATH.TYPE_IDVTC_CLAIM,
    };
  }
  switch (status) {
    case 'APPROVED':
    case 'REJECTED':
    case 'REVIEW':
      return {
        text: 'View application',
        variant: 'translucent',
        href: PATH.TYPE_IDVTC_APPLY,
      };
    default:
      return {
        text: 'Apply for IDVTC',
        variant: 'translucent',
        href: PATH.TYPE_IDVTC_APPLY,
      };
  }
};

type Props = {
  size?: ButtonProps['size'];
};

export const IdvtcApplyButton: FC<Props> = ({ size }) => {
  const { typeStatus, data } = useIdvtcState();
  const { isCSM } = useModule();
  const nodeOperatorId = useNodeOperatorId();
  const { text, variant, href, query } = getButtonState(
    typeStatus,
    data?.status,
    isCSM && nodeOperatorId !== undefined,
  );

  return (
    <LocalLink href={href} query={query}>
      <Button
        fullwidth
        size={size}
        variant={variant}
        data-testid="dvtApplyButton"
      >
        {text}
      </Button>
    </LocalLink>
  );
};
