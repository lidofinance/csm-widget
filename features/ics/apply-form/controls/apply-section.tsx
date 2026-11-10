import {
  IconLink,
  SectionTitle,
  Stack,
  TextLink,
} from '@lidofinance/lido-app-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts';
import { FC, PropsWithChildren, ReactNode } from 'react';
import { trackMatomoEvent } from 'utils';

const GUIDE_URL = 'https://www.youtube.com/watch?v=yUX34iCbCWE';

export const GuideLink: FC = () => (
  <TextLink
    external
    href={GUIDE_URL}
    icon={<IconLink />}
    onClick={() =>
      trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.icsYoutubeGuideLink)
    }
  >
    View the guide
  </TextLink>
);

type ApplySectionProps = PropsWithChildren<{
  title: string;
  subtitle?: ReactNode;
  action?: ReactNode;
  'data-testid'?: string;
}>;

export const ApplySection: FC<ApplySectionProps> = ({
  title,
  subtitle,
  action,
  children,
  'data-testid': testId,
}) => (
  <Stack gap={16} data-testid={testId}>
    <SectionTitle
      title={title}
      subtitle={subtitle}
      action={action}
      dataTestId={{ root: 'formTitle' }}
    />
    {children}
  </Stack>
);
