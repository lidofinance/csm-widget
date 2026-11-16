import { Button, ButtonProps } from '@lidofinance/lido-app-ui';
import { OperatorTypeStatus } from 'modules/web3';
import { FC } from 'react';
import { TYPE_PROGRAM, TypeProgram } from './consts';
import { ApplicationStatus } from './types';

type Props = {
  program: TypeProgram;
  typeStatus: OperatorTypeStatus;
  formStatus: ApplicationStatus | undefined;
  hasOperator: boolean;
  isPending: boolean;
  size?: ButtonProps['size'];
  dataTestId?: string;
};

export const TypeApplyButton: FC<Props> = ({
  program,
  typeStatus,
  formStatus,
  hasOperator,
  isPending,
  size,
  dataTestId,
}) => {
  const { applyPath, claimPath, createPath } = TYPE_PROGRAM[program];
  const testId = { root: dataTestId };

  if (isPending) {
    return (
      <Button size={size} loading dataTestId={testId}>
        Apply for {program}
      </Button>
    );
  }

  let text: string;
  let variant: ButtonProps['variant'] = 'outline';
  let href = applyPath;

  if (typeStatus === 'ISSUED') {
    variant = 'primary';
    // Claiming writes onto an existing operator, so without one the only action is to create
    if (hasOperator) {
      text = `Claim ${program} type`;
      href = claimPath;
    } else {
      text = `Create ${program} operator`;
      href = createPath;
    }
  } else if (typeStatus !== 'PENDING') {
    text = `View ${program} status`;
  } else if (formStatus) {
    text = 'View application';
  } else {
    variant = 'primary';
    text = `Apply for ${program}`;
  }

  return (
    <Button size={size} variant={variant} href={href} dataTestId={testId}>
      {text}
    </Button>
  );
};
