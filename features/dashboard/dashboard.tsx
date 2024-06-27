import { FC } from 'react';
import { KeysSection } from './keys';
import { RolesSection } from './roles';
import { BondSection } from './bond';

export const Dashboard: FC = () => {
  return (
    <>
      <KeysSection />
      <BondSection />
      <RolesSection />
    </>
  );
};
