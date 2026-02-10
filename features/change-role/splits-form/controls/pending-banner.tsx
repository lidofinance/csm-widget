import { Button } from '@lidofinance/lido-ui';
import { PATH } from 'consts/urls';
import { FC } from 'react';
import { Banner } from 'shared/components';
import { useNavigate } from 'shared/navigate';
import { useSplitsFormData } from '../context';

export const PendingBanner: FC = () => {
  const { hasPendingShares, currentFeeSplits, isOwner } =
    useSplitsFormData(true);
  const navigate = useNavigate();

  if (!hasPendingShares || !isOwner) return null;

  return (
    <Banner
      variant="wary-dangerous"
      title={
        currentFeeSplits.length > 0
          ? 'Editing is disabled while you have unclaimed rewards. Claim them in Bond & Rewards to continue. Unclaimed rewards will be distributed using your current split settings.'
          : 'Rewards splitting is disabled while you have unclaimed rewards. Claim them in Bond & Rewards to continue.'
      }
      extra={
        <Button
          size="sm"
          variant="outlined"
          onClick={() => navigate(PATH.BOND_CLAIM)}
        >
          Go to claim
        </Button>
      }
    />
  );
};
