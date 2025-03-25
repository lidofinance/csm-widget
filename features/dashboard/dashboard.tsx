import { FC } from 'react';
import { BondSection } from './bond';
import { KeysSection } from './keys';
import { RolesSection } from './roles';
import { ExternalSection } from './external';
import { getConfig } from 'config';
import { CHAINS } from 'consts/chains';
import { SurveysCta } from './surveys-cta';

const { defaultChain } = getConfig();

export const Dashboard: FC = () => {
  return (
    <>
      <SurveysCta />
      <KeysSection />
      <BondSection />
      <RolesSection />
      {defaultChain !== CHAINS.Hoodi && <ExternalSection />}
    </>
  );
};
