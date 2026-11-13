import { FC, ReactNode } from 'react';
import { TrailingInput } from 'shared/hook-form/fields/trailing-input';
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
    <TrailingInput
      name="mainAddress"
      aria-label="Main address"
      value={address}
      disabled
      trailing={<VerifiedTag />}
    />
  </ApplySection>
);
