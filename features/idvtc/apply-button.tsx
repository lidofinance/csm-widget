import { ButtonProps } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { TypeApplyButton } from 'shared/node-operator/type-status';
import { useIdvtcState } from './shared';

type Props = {
  size?: ButtonProps['size'];
};

export const IdvtcApplyButton: FC<Props> = ({ size }) => {
  const { typeStatus, hasOperator, data, isButtonPending } = useIdvtcState();

  return (
    <TypeApplyButton
      program="IDVTC"
      typeStatus={typeStatus}
      formStatus={data?.status}
      hasOperator={hasOperator}
      isPending={isButtonPending}
      size={size}
      data-testid="dvtApplyButton"
    />
  );
};
