import { Button, ButtonProps } from '@lidofinance/lido-ui';
import { OperatorTypeStatus } from 'modules/web3';
import { FC } from 'react';
import { LocalLink } from 'shared/navigate';
import { TYPE_PROGRAM, TypeProgram } from './consts';
import { ApplicationStatus } from './types';

type Props = {
  program: TypeProgram;
  typeStatus: OperatorTypeStatus;
  formStatus: ApplicationStatus | undefined;
  hasOperator: boolean;
  isPending: boolean;
  size?: ButtonProps['size'];
  'data-testid'?: string;
};

export const TypeApplyButton: FC<Props> = ({
  program,
  typeStatus,
  formStatus,
  hasOperator,
  isPending,
  size,
  'data-testid': testId,
}) => {
  const { applyPath, claimPath, createPath } = TYPE_PROGRAM[program];

  if (isPending) {
    return (
      <Button
        fullwidth
        size={size}
        variant="translucent"
        loading
        data-testid={testId}
      >
        Apply for {program}
      </Button>
    );
  }

  let text: string;
  let variant: ButtonProps['variant'] = 'translucent';
  let href = applyPath;

  if (typeStatus === 'ISSUED') {
    variant = undefined;
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
    text = `Apply for ${program}`;
  }

  return (
    <LocalLink href={href}>
      <Button fullwidth size={size} variant={variant} data-testid={testId}>
        {text}
      </Button>
    </LocalLink>
  );
};
