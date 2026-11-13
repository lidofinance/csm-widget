import { FC } from 'react';
import { Button, IconPlus } from '@lidofinance/lido-app-ui';

type Props = {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export const DkgAddFileButton: FC<Props> = ({ onClick, loading, disabled }) => (
  <Button
    variant="outline"
    size="small"
    type="button"
    iconLeft={<IconPlus />}
    onClick={onClick}
    loading={loading}
    disabled={disabled}
    dataTestId={{ root: 'dkgAddFileButton' }}
  >
    Add new file
  </Button>
);
