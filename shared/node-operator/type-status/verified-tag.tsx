import { IconCheck, Tag } from '@lidofinance/lido-app-ui';
import { FC } from 'react';

export const VerifiedTag: FC = () => (
  <Tag
    variant="success"
    icon={<IconCheck />}
    dataTestId={{ root: 'verifiedChip' }}
  >
    Verified
  </Tag>
);
