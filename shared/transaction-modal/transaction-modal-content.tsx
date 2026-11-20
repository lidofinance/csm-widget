import { memo, ReactNode } from 'react';
import { Body, Stack, TxStatus } from '@lidofinance/lido-app-ui';
import s from './transaction-modal-content.module.css';

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
        <Stack gap={16} className={s.footer}>
          {footer && (
            <Stack gap={12} dataTestId={{ root: 'footer' }}>
              {footer}
            </Stack>
          )}
          {footerHint && (
            <Body
              className={s.footerHint}
              color="tertiary"
              dataTestId={{ root: 'footerHint' }}
            >
              {footerHint}
            </Body>
          )}
        </Stack>
      )
    }
  />
);

export const TransactionModalContent = memo(AppContent);
