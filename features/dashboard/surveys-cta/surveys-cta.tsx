import { FC } from 'react';
import { Banner } from 'shared/components';
import { useSurveysCall } from 'shared/hooks';
import { LocalLink } from 'shared/navigate';

export const SurveysCta: FC = () => {
  const enabled = useSurveysCall();
  if (!enabled) return null;

  return (
    <Banner
      title="Submit Your Validator Setup"
      href="/surveys"
      variant="wary-dangerous"
    >
      Please submit your validator setup data by July 6th to help enhance the
      transparency of the Lido Protocol! Go to the{' '}
      <LocalLink href="/surveys">Surveys</LocalLink> tab and fill out the
      &quot;Your Setup&quot; form.
    </Banner>
  );
};
