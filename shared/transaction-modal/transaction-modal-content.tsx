import { memo, ReactNode } from 'react';
import styled from 'styled-components';
import { Body, Stack, TxStatus } from '@lidofinance/lido-app-ui';

const AppFooterStyle = styled(Stack)`
  && {
    width: 100%;
    text-align: center;
  }
`;

const AppFooterHintStyle = styled(Body)`
  && {
    word-break: break-word;
  }
`;

export type TxStageStatus = 'loading' | 'success' | 'error' | 'warning';

type TransactionModalContentProps = {
  status: TxStageStatus;
  title: ReactNode;
  description: ReactNode;
  footerHint?: ReactNode;
  footer?: ReactNode;
};

// TxStatus draws its own glyph and has no live region of its own
const AppContent = ({
  status,
  title,
  description,
  footerHint,
  footer,
}: TransactionModalContentProps) => (
  <TxStatus
    role="status"
    aria-live="polite"
    status={status}
    title={title}
    message={description}
    dataTestId={{ root: 'txStage', title: 'title', message: 'description' }}
    footer={
      (footer || footerHint) && (
        <AppFooterStyle gap={16}>
          {footer && (
            <Stack gap={12} dataTestId={{ root: 'footer' }}>
              {footer}
            </Stack>
          )}
          {footerHint && (
            <AppFooterHintStyle
              color="tertiary"
              dataTestId={{ root: 'footerHint' }}
            >
              {footerHint}
            </AppFooterHintStyle>
          )}
        </AppFooterStyle>
      )
    }
  />
);

export const TransactionModalContent = memo(AppContent);
