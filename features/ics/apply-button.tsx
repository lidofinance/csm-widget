import { ButtonProps } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { TypeApplyButton } from 'shared/node-operator/type-status';
import { useIcsState } from './shared';

type Props = {
  size?: ButtonProps['size'];
};

export const IcsApplyButton: FC<Props> = ({ size }) => {
  const { typeStatus, hasOperator, data, isButtonPending } = useIcsState();

  return (
    <TypeApplyButton
      program="ICS"
      typeStatus={typeStatus}
      formStatus={data?.status}
      hasOperator={hasOperator}
      isPending={isButtonPending}
      size={size}
    />
  );
};
