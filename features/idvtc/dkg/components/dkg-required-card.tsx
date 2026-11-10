import { Body, Button, H3, Stack } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { StretchCard } from 'shared/components';
import { DkgIllustration } from '../styles';

type Props = {
  onAction: () => void;
};

export const DkgRequiredCard: FC<Props> = ({ onAction }) => (
  <StretchCard dataTestId={{ root: 'dkgRequiredCard' }}>
    <Stack align="center" gap={32} style={{ textAlign: 'center' }}>
      <DkgIllustration aria-hidden="true" />
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
  </StretchCard>
);
