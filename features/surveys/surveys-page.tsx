import { PATH } from 'consts/urls';
import { SiweAuthGate } from 'modules/siwe';
import { useNodeOperator } from 'modules/web3';
import { FC, useMemo } from 'react';
import { AppFormUi } from 'shared/hook-form/form-ui';
import { Layout } from 'shared/layout';
import type { Crumb } from 'shared/layout/crumbs';
import { SurveysContactsPage } from './surveys-contacts-page';
import { SurveysDelegatesPage } from './surveys-delegates-page';
import { SurveysDelegatorPage } from './surveys-delegator-page';
import { SurveysExperiencePage } from './surveys-experience-page';
import { SurveysHomePage } from './surveys-home-page';
import { SurveysHowDidYouLearnCsmPage } from './surveys-how-did-you-learn-page';
import { SurveyProvider } from './surveys-provider';
import { SurveysSetupPage } from './surveys-setup-page';
import { SurveysSignInPage } from './surveys-signin-page';

const getCrumbs = (slug: string[], isOperator: boolean): Crumb[] => {
  const [page, id1, id2] = slug;
  const root: Crumb = { label: 'Surveys', href: PATH.SURVEYS };
  const leaf = (label: string): Crumb[] => [root, { label }];

  switch (`/surveys/${page}`) {
    case PATH.SURVEYS_CONTACTS:
      return leaf('Contact info');
    case PATH.SURVEYS_HOW_DID_YOU_LEARN_CSM:
      return leaf('How did you learn about CSM?');
    case PATH.SURVEYS_EXPERIENCE:
      return leaf('Your validation experience');
    case PATH.SURVEYS_DELEGATES:
      return leaf('Manage Delegates');
    case PATH.SURVEYS_SETUP:
      return leaf(id1 ? `Setup #${id1}` : 'Add Setup');
    case PATH.SURVEYS_DELEGATOR: {
      const delegated: Crumb = {
        label: 'Delegated operators',
        href: isOperator ? PATH.SURVEYS_DELEGATOR : PATH.SURVEYS,
      };
      if (!id1) return [root, { label: delegated.label }];
      const setups: Crumb = {
        label: `Setups for ${id1}`,
        href: `${PATH.SURVEYS_DELEGATOR}/${id1}` as PATH,
      };
      if (!id2) return [root, delegated, { label: setups.label }];
      return [
        root,
        delegated,
        setups,
        { label: id2 === 'new' ? 'Add Setup' : `Setup #${id2}` },
      ];
    }
    default:
      return [{ label: 'Surveys' }];
  }
};

export const SurveysPage: FC<{ slug?: string[] }> = ({ slug = [] }) => {
  const { nodeOperator } = useNodeOperator();
  const crumbs = getCrumbs(slug, !!nodeOperator);

  const page = useMemo(() => {
    const [page, id1, id2] = slug;
    const path = `/surveys/${page}`;

    switch (path) {
      case PATH.SURVEYS_CONTACTS:
        return <SurveysContactsPage />;
      case PATH.SURVEYS_DELEGATES:
        return <SurveysDelegatesPage />;
      case PATH.SURVEYS_EXPERIENCE:
        return <SurveysExperiencePage />;
      case PATH.SURVEYS_HOW_DID_YOU_LEARN_CSM:
        return <SurveysHowDidYouLearnCsmPage />;
      case PATH.SURVEYS_SETUP:
        return <SurveysSetupPage id={id1} />;
      case PATH.SURVEYS_DELEGATOR:
        return <SurveysDelegatorPage operatorId={id1} setupId={id2} />;

      default:
        return <SurveysHomePage />;
    }
  }, [slug]);

  return (
    <Layout pageName="Surveys" breadcrumbs={crumbs}>
      <SiweAuthGate fallback={<SurveysSignInPage />}>
        <AppFormUi>
          <SurveyProvider>{page}</SurveyProvider>
        </AppFormUi>
      </SiweAuthGate>
    </Layout>
  );
};
