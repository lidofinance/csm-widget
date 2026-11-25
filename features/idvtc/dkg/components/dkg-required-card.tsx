import { Card, Body, Button, H3, Stack } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import DkgFileWarning from 'assets/illustrations/dkg-file-warning.svg?react';
import s from '../styles.module.css';

type Props = {
  onAction: () => void;
};

export const DkgRequiredCard: FC<Props> = ({ onAction }) => (
  <Card align="stretch" dataTestId={{ root: 'dkgRequiredCard' }}>
    <Stack align="center" gap={32} style={{ textAlign: 'center' }}>
      <DkgFileWarning className={s.illustration} aria-hidden="true" />
      <H3>Upload DKG Files Required</H3>
      <Body color="secondary">
        This Node Operator is configured as IDVTC. To keep the IDVTC status,
        please upload the DKG files that prove the validator keys were generated
        through a DKG ceremony.
      </Body>
      <Button fullWidth onClick={onAction}>
        Upload files
      </Button>
    </Stack>
  </Card>
);
