import { Link, ThemeName } from '@lidofinance/lido-ui';
import { config } from 'config';
import { getExternalLinks } from 'consts/external-links';
import { MODULE_METADATA } from 'consts/module';
import { useRenderedModule } from 'shared/hooks';
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
  const renderedModule = useRenderedModule();
  const moduleMeta = MODULE_METADATA[renderedModule];
  const { feedbackForm } = getExternalLinks(
    config.defaultChain,
    renderedModule,
  );
  return (
    <WarningBlock>
      <WarningText>
        This is a new version of the {moduleMeta.shortName} Widget. In case of
        any issues, please submit the report using this{' '}
        <Link href={feedbackForm}>form</Link>
      </WarningText>
    </WarningBlock>
  );
};
