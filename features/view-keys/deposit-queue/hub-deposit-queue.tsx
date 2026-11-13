import { FC } from 'react';
import { useNeedsNormalize } from 'shared/hooks';
import { DepositQueue } from './deposit-queue';
import { NormalizeNotice } from './normalize-notice';

export const HubDepositQueue: FC = () => {
  const needs = useNeedsNormalize();
  return <DepositQueue notice={needs ? <NormalizeNotice /> : undefined} />;
};
