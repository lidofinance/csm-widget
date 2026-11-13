import {
  Address,
  Button,
  DataList,
  DataListRow,
  Grid,
  IconLink,
  Stack,
  TextLink,
  Typography,
} from '@lidofinance/lido-app-ui';
import { type FeeSplit, PERCENT_BASIS } from '@lidofinance/lido-csm-sdk';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { useDappStatus } from 'modules/web3';
import { FC } from 'react';
import { ConfirmModalProps } from 'shared/hooks';
import { FormModalShell } from 'shared/transaction-modal/form-modal-shell';
import {
  formatPercent,
  getEtherscanAddressLink,
  trackMatomoEvent,
} from 'utils';
import { BulletsStyle, RecipientStyle } from './styles';

type ConfirmSplitsModalAppProps = ConfirmModalProps & {
  open?: boolean;
  feeSplits: FeeSplit[];
};

const formatShare = (share: bigint) => `${formatPercent(share, false, 2)} %`;

const RecipientCell: FC<{ address: string }> = ({ address }) => {
  const { chainId } = useDappStatus();

  return (
    <RecipientStyle>
      <Address address={address} symbols={0}>
        <TextLink
          external
          href={getEtherscanAddressLink(chainId, address)}
          icon={<IconLink />}
          aria-label="View on Etherscan"
          onClick={() =>
            trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.etherscanAddressLink)
          }
        />
      </Address>
    </RecipientStyle>
  );
};

export const ConfirmSplitsModalApp: FC<ConfirmSplitsModalAppProps> = ({
  open,
  feeSplits,
  onConfirm,
  onReject,
}) => {
  const isRemoving = feeSplits.length === 0;

  return (
    <FormModalShell
      open={open}
      onClose={onReject}
      title="Confirm splitter configuration"
      data-testid="confirmSplitsModal"
    >
      <Stack direction="column" gap={24}>
        <Stack direction="column" gap={8}>
          <Typography variant="bodyLarge" weight="semibold" as="h3">
            {isRemoving
              ? 'Are you sure you want to stop splitting rewards?'
              : 'Are you sure you want to set the following addresses in the splitter?'}
          </Typography>
          {isRemoving ? (
            <Typography color="secondary" variant="body" as="p">
              All rewards will be sent to the following address
            </Typography>
          ) : (
            <Typography color="secondary" variant="body" as="div">
              Please note:
              <BulletsStyle>
                <li>Editing is disabled while you have unclaimed rewards</li>
                <li>Additional addresses receive rewards in stETH only</li>
                <li>
                  Claiming is permissionless: anyone can execute the claim, but
                  rewards go to the configured addresses
                </li>
              </BulletsStyle>
            </Typography>
          )}
        </Stack>

        <DataList>
          <DataListRow
            label={
              <Typography color="secondary" variant="description" as="span">
                Address
              </Typography>
            }
            value={
              <Typography color="secondary" variant="description" as="span">
                Share
              </Typography>
            }
          />
          {isRemoving ? (
            <DataListRow
              label="Operator bond"
              value={formatShare(PERCENT_BASIS)}
            />
          ) : (
            feeSplits.map((row) => (
              <DataListRow
                key={row.recipient}
                label={<RecipientCell address={row.recipient} />}
                value={formatShare(row.share)}
              />
            ))
          )}
        </DataList>

        <Grid columns={2} gap={12}>
          <Button variant="outline" onClick={onReject}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>Confirm</Button>
        </Grid>
      </Stack>
    </FormModalShell>
  );
};
