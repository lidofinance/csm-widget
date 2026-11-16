import { FC } from 'react';
import { ButtonIcon } from '@lidofinance/lido-ui';
import Plus from 'assets/icons/plus.svg?react';

type Props = {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export const DkgAddFileButton: FC<Props> = ({ onClick, loading, disabled }) => (
  <ButtonIcon
    data-testid="dkgAddFileButton"
    icon={<Plus />}
    variant="translucent"
    size="xs"
    type="button"
    onClick={onClick}
    loading={loading}
    disabled={disabled}
  >
    Add new file
  </ButtonIcon>
);
