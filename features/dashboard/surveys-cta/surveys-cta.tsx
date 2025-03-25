import { FC } from 'react';
import { Banner } from 'shared/components';
import { useSurveysCall } from 'shared/hooks';
import { LocalLink } from 'shared/navigate';

export const SurveysCta: FC = () => {
  const required = useSurveysCall();
  if (!required) return null;

  return (
    <Banner
      title="Surveys tab is here"
      href="/surveys"
      variant="wary-dangerous"
    >
      You&apos;re invited to voluntarily submit your validator setup data by
      March 31st to help enhance the transparency of the Lido Protocol! Go to
      the <LocalLink href="/surveys">Surveys</LocalLink> tab and fill out the
      &quot;Your Setup&quot; form.
    </Banner>
  );
};
