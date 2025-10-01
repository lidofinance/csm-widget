import { Link, ThemeName } from '@lidofinance/lido-ui';
import { useExternalLinks } from 'shared/hooks';
import styled from 'styled-components';

const WarningBlock = styled.div`
  text-align: center;

  padding-inline: 20px;
  width: auto;
  min-width: 110%;

  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) =>
    theme.name === ThemeName.light
      ? '#e9dcf5'
      : 'var(--lido-color-foreground)'};
`;

const WarningText = styled.span`
  line-height: 32px;
  color: var(--lido-color-text);
`;

export const FeedbackLine = () => {
  const { feedbackForm } = useExternalLinks();
  return (
    <WarningBlock>
      <WarningText>
        This is a new version of the CSM Widget. In case of any issues, please
        submit the report using this <Link href={feedbackForm}>form</Link>
      </WarningText>
    </WarningBlock>
  );
};
