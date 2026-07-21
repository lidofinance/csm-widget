import { FC } from 'react';
import { ButtonIcon } from '@lidofinance/lido-ui';
import { ReactComponent as Plus } from 'assets/icons/plus.svg';

type Props = {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export const DkgAddFileButton: FC<Props> = ({ onClick, loading, disabled }) => (
  <ButtonIcon
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
