import { Link, ThemeName } from '@lidofinance/lido-ui';
import styled from 'styled-components';

const WarningBlock = styled.div`
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

// TODO: text
export const FeedbackLine = () => {
  return (
    <WarningBlock>
      <WarningText>
        Please, if you have any bugs - fill this{' '}
        <Link href="https://forms.gle/ZBUqbykaZokJLf4M7">feedback form</Link>
      </WarningText>
    </WarningBlock>
  );
};
