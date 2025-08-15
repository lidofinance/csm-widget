import { Block } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { TypeStatus } from '../shared';
import { StatusHeader } from './components';

type FormStatusProps = {
  typeStatus: TypeStatus;
};

export const ProofStatus: FC<FormStatusProps> = ({ typeStatus }) => {
  return (
    <Block>
      <StatusHeader typeStatus={typeStatus} />
    </Block>
  );
};
