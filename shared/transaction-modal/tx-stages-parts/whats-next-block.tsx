import { MessageBox } from '@lidofinance/lido-app-ui';
import { FC, PropsWithChildren } from 'react';
import { useFormUi } from 'shared/hook-form/form-ui';
import styled from 'styled-components';

const LegacyBlockStyle = styled.div`
  text-align: left;
  line-height: 24px;

  background-color: var(--lido-color-backgroundSecondary);
  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
  padding: ${({ theme }) => theme.spaceMap.md}px;
`;

// TxStatus centers its message; the steps read as a left-aligned list
const AppBlockStyle = styled(MessageBox)`
  && {
    text-align: left;
  }

  ol {
    margin: 0;
    padding-left: 20px;
  }
`;

/** "What is next:" steps box inside a tx stage description; children are `<li>` items. */
export const WhatsNextBlock: FC<PropsWithChildren> = ({ children }) => {
  const ui = useFormUi();

  if (ui === 'app') {
    return (
      <AppBlockStyle icon={false} headline="What is next:">
        <ol>{children}</ol>
      </AppBlockStyle>
    );
  }

  return (
    <LegacyBlockStyle>
      <b>What is next: </b>
      <br />
      <ol>{children}</ol>
    </LegacyBlockStyle>
  );
};
