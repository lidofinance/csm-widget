import { FC } from 'react';
import { BondSection } from './bond';
import { KeysSection } from './keys';
import { RolesSection } from './roles';
import { ExternalSection } from './external';

export const Dashboard: FC = () => {
  return (
    <>
      <KeysSection />
      <BondSection />
      <RolesSection />
      <ExternalSection />
    </>
  );
};
