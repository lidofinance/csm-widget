import { FC, ReactNode } from 'react';
import { Input } from '@lidofinance/lido-app-ui';
import { VerifiedTag } from 'shared/node-operator/type-status/verified-tag';
import { ApplySection } from './apply-section';

type Props = {
  address: string;
  subtitle: ReactNode;
};

export const MainAddressSection: FC<Props> = ({ address, subtitle }) => (
  <ApplySection
    title="Main address"
    subtitle={subtitle}
    data-testid="mainAddressSection"
  >
    <Input
      name="mainAddress"
      aria-label="Main address"
      value={address}
      disabled
      trailing={<VerifiedTag />}
    />
  </ApplySection>
);
