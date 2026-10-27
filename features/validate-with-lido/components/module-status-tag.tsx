import { Tag } from '@lidofinance/lido-app-ui';
import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { FC } from 'react';
import { useSmStatus } from 'modules/web3';

type ModuleStatusTagProps = {
  variant: 'csm' | 'no-onboardings' | 'coming-soon';
};

const CsmStatusTag: FC = () => {
  const { data } = useSmStatus(MODULE_NAME.CSM);

  if (!data) return null;

  return data.isPaused ? (
    <Tag variant="warning">Paused</Tag>
  ) : (
    <Tag variant="success">Live (permissionless)</Tag>
  );
};

export const ModuleStatusTag: FC<ModuleStatusTagProps> = ({ variant }) => {
  if (variant === 'csm') return <CsmStatusTag />;
  if (variant === 'no-onboardings') {
    return <Tag variant="warning">No active onboardings</Tag>;
  }
  return <Tag variant="neutral">Coming soon</Tag>;
};
