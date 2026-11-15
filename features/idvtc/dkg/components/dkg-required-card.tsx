import { Card, Button, EmptyState } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { DkgIllustration } from '../styles';

type Props = {
  onAction: () => void;
};

export const DkgRequiredCard: FC<Props> = ({ onAction }) => (
  <Card align="stretch" dataTestId={{ root: 'dkgRequiredCard' }}>
    <EmptyState
      illustration={<DkgIllustration aria-hidden="true" />}
      title="Upload DKG Files Required"
      description="This Node Operator is configured as IDVTC. To keep the IDVTC status, please upload the DKG files that prove the validator keys were generated through a DKG ceremony."
      action={
        <Button fullWidth onClick={onAction}>
          Upload files
        </Button>
      }
    />
  </Card>
);
