import { FC } from 'react';
import { Gate } from 'shared/navigate';
import { BondSection } from './bond';
import { KeysSection } from './keys';
import { RolesSection } from './roles';
import { SurveysCta } from './surveys-cta';

export const Dashboard: FC = () => {
  return (
    <>
      <Gate rule="IS_NODE_OPERATOR">
        <SurveysCta />
        <KeysSection />
      </Gate>
      <BondSection />
      <RolesSection />
    </>
  );
};
