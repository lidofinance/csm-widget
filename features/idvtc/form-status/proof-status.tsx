import { Block } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { IdvtcTypeStatus } from '../shared';
import { StatusHeader } from './components';

type ProofStatusProps = {
  typeStatus: IdvtcTypeStatus;
};

export const ProofStatus: FC<ProofStatusProps> = ({ typeStatus }) => {
  return (
    <Block>
      <StatusHeader typeStatus={typeStatus} />
    </Block>
  );
};
