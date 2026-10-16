import { Button, Text } from '@lidofinance/lido-ui';
import { OperatorTypeStatus } from 'modules/web3';
import { FC } from 'react';
import { LocalLink } from 'shared/navigate';
import { TYPE_PROGRAM, TypeProgram } from './consts';

type Props = {
  program: TypeProgram;
  typeStatus: OperatorTypeStatus;
  hasOperator: boolean;
};

export const TypeStatusHint: FC<Props> = ({
  program,
  typeStatus,
  hasOperator,
}) => {
  const { claimPath, createPath } = TYPE_PROGRAM[program];

  switch (typeStatus) {
    case 'CLAIMED':
      return (
        <Text size="xs">Your Node Operator already has {program} type</Text>
      );
    case 'PROOF_USED_ELSEWHERE':
      return (
        <Text size="xs">
          Your address has already used its {program} proof on another Node
          Operator
        </Text>
      );
    case 'PROOF_USED':
      return (
        <Text size="xs">Your address has already used its {program} proof</Text>
      );
    case 'ISSUED':
      if (!hasOperator) {
        return (
          <>
            <Text size="xs">
              Create a new Node Operator with {program} operator type
            </Text>
            <div>
              <LocalLink href={createPath}>
                <Button size="xs">Create {program} operator</Button>
              </LocalLink>
            </div>
          </>
        );
      }
      return (
        <>
          <Text size="xs">
            Claim your new operator type on the “Claim operator type” tab
          </Text>
          <div>
            <LocalLink href={claimPath}>
              <Button size="xs">Go to claim</Button>
            </LocalLink>
          </div>
        </>
      );
    case 'ISSUED_NOT_OWNER':
      return (
        <>
          <Text size="xs">
            You&apos;re already eligible to claim {program} type
          </Text>
          <Text size="xs">
            To claim, your current address should be set as your Node Operator
            owner
          </Text>
        </>
      );
    case 'OWNER_ISSUED':
      return (
        <>
          <Text size="xs">
            Node Operator&apos;s owner address is already eligible to claim{' '}
            {program} type
          </Text>
          <Text size="xs">
            Connect with your Node Operator&apos;s owner address to claim{' '}
            {program} type
          </Text>
        </>
      );
    case 'OTHER_ISSUED':
      return (
        <>
          <Text size="xs">
            Another address of your Node Operator is already eligible to claim{' '}
            {program} type
          </Text>
          <Text size="xs">
            To claim, it should be set as your Node Operator owner
          </Text>
        </>
      );
    default:
      return null;
  }
};
