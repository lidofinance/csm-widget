import { useConnectorInfo } from 'reef-knot';

import {
  LedgerFail,
  LedgerConfirm,
  LedgerLoading,
  LedgerSuccess,
  Warning,
} from '@lidofinance/lido-ui';

import {
  LedgerIconWrapper,
  IconWrapper,
  SuccessIcon,
  FailIcon,
  TxLoader,
} from './icons-styles';

const createStageIcon = (
  iconEl: React.ReactNode,
  ledgerEl: React.ReactNode,
) => {
  return () => {
    const { isLedger } = useConnectorInfo();
    if (isLedger) {
      return <LedgerIconWrapper>{ledgerEl}</LedgerIconWrapper>;
    }
    return <IconWrapper>{iconEl}</IconWrapper>;
  };
};

export const StageIconSuccess = createStageIcon(
  <SuccessIcon />,
  <LedgerSuccess fill="transparent" />,
);

export const StageIconFail = createStageIcon(
  <FailIcon />,
  <LedgerFail fill="transparent" />,
);

export const StageIconSign = createStageIcon(
  <TxLoader size="large" />,
  <LedgerConfirm fill="transparent" />,
);

export const StageIconLoader = createStageIcon(
  <TxLoader size="large" />,
  <LedgerLoading fill="transparent" />,
);

export const StageIconLimit = createStageIcon(
  <Warning />,
  <LedgerFail fill="transparent" />,
);
