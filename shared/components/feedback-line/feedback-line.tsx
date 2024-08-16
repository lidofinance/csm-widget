import { ThemeName } from '@lidofinance/lido-ui';
import styled from 'styled-components';
import { MatomoLink } from '../matomo-link/matomo-link';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';

const WarningBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) =>
    theme.name === ThemeName.light
      ? '#e9dcf5'
      : 'var(--lido-color-foreground)'};

  padding: ${({ theme }) => theme.spaceMap.xs}px 20px;
`;

const WarningText = styled.span`
  text-align: center;
  line-height: 1.7;
  color: var(--lido-color-text);
`;

// TODO: text
export const FeedbackLine = () => {
  return (
    <WarningBlock>
      <WarningText>
        {/* This is a test version of the CSM Widget. Make sure to report any bugs{' '} */}
        This is a test version of the CSM Widget. In case of any issues, please
        submit the report using this{' '}
        <MatomoLink
          href="https://forms.gle/ZBUqbykaZokJLf4M7"
          matomoEvent={MATOMO_CLICK_EVENTS_TYPES.feedbackFormLink}
        >
          form
        </MatomoLink>
      </WarningText>
    </WarningBlock>
  );
};
