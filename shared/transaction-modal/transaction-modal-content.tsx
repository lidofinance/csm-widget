import { memo, ReactNode } from 'react';
import styled from 'styled-components';
import { Text } from '@lidofinance/lido-ui';
import { TxStatus } from '@lidofinance/lido-app-ui';
import { useFormUi } from 'shared/hook-form/form-ui';

export const Wrap = styled.div`
  text-align: center;
`;

export const Title = styled(Text).attrs({
  size: 'sm',
})`
  margin-top: ${({ theme }) => theme.spaceMap.xl}px;
  font-weight: 800;
  text-align: center;
`;

export const Description = styled(Text).attrs({
  size: 'xs',
  color: 'secondary',
})`
  margin-top: ${({ theme }) => theme.spaceMap.xs}px;
  text-align: center;
  word-break: break-word;
`;

export const Footer = styled.div`
  margin-top: ${({ theme }) => theme.spaceMap.xxl}px;
`;

export const FooterHint = styled(Text).attrs({
  size: 'xxs',
  color: 'secondary',
})`
  text-align: center;
  margin-top: ${({ theme }) => theme.spaceMap.xxl}px;
`;

const AppFooterStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  text-align: center;
`;

const AppFooterSlotStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const AppFooterHintStyle = styled.div`
  color: var(--lido-app-ui-color-text-tertiary);
  font-size: var(--lido-app-ui-font-size-label);
  line-height: var(--lido-app-ui-line-height-label);
  word-break: break-word;
`;

export type TxStageStatus = 'loading' | 'success' | 'error' | 'warning';

type TransactionModalContentProps = {
  status: TxStageStatus;
  icon: ReactNode;
  title: ReactNode;
  description: ReactNode;
  footerHint?: ReactNode;
  footer?: ReactNode;
};

const LegacyContent = ({
  icon,
  title,
  description,
  footerHint,
  footer,
}: TransactionModalContentProps) => (
  <Wrap data-testid="txStage">
    {icon}
    <Title data-testid="title">{title}</Title>
    <Description data-testid="description">{description}</Description>
    {footerHint && (
      <FooterHint data-testid="footerHint">{footerHint}</FooterHint>
    )}
    {footer && <Footer data-testid="footer">{footer}</Footer>}
  </Wrap>
);

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
        <AppFooterStyle>
          {footer && (
            <AppFooterSlotStyle data-testid="footer">
              {footer}
            </AppFooterSlotStyle>
          )}
          {footerHint && (
            <AppFooterHintStyle data-testid="footerHint">
              {footerHint}
            </AppFooterHintStyle>
          )}
        </AppFooterStyle>
      )
    }
  />
);

export const TransactionModalContent = memo(
  (props: TransactionModalContentProps) => {
    const ui = useFormUi();
    return ui === 'app' ? (
      <AppContent {...props} />
    ) : (
      <LegacyContent {...props} />
    );
  },
);
