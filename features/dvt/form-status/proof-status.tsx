import { Block } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { DvtTypeStatus } from '../shared';
import { StatusHeader } from './components';

type ProofStatusProps = {
  typeStatus: DvtTypeStatus;
};

export const ProofStatus: FC<ProofStatusProps> = ({ typeStatus }) => {
  return (
    <Block>
      <StatusHeader typeStatus={typeStatus} />
    </Block>
  );
};
