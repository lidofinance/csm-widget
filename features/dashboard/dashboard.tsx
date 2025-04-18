import { FC } from 'react';
import { BondSection } from './bond';
import { KeysSection } from './keys';
import { RolesSection } from './roles';
import { SurveysCta } from './surveys-cta';

export const Dashboard: FC = () => {
  return (
    <>
      <SurveysCta />
      <KeysSection />
      <BondSection />
      <RolesSection />
    </>
  );
};
