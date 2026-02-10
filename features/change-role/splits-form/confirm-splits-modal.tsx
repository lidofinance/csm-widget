import { FeeSplit } from '@lidofinance/lido-csm-sdk';
import { Button, Modal, Text } from '@lidofinance/lido-ui';
import type { ModalComponentType } from 'providers/modal-provider';
import { Address as AddressComponent, Stack } from 'shared/components';
import { ConfirmModalProps } from 'shared/hooks';
import styled from 'styled-components';
import { formatPercent } from 'utils';
import { Address } from 'viem';

type ConfirmSplitsModalProps = ConfirmModalProps & {
  feeSplits: FeeSplit[];
  rewardsAddress: Address;
};

const TableRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: normal;
  gap: ${({ theme }) => theme.spaceMap.md}px;
`;

const TableHeader = styled(TableRow)`
  color: var(--lido-color-textSecondary);
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
`;

const AddressCell = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.xs}px;
  min-width: 0;
  flex: 1;
`;

const ShareCell = styled.div`
  white-space: nowrap;
`;

export const ConfirmSplitsModal: ModalComponentType<
  ConfirmSplitsModalProps
> = ({ onConfirm, onReject, feeSplits, rewardsAddress, ...props }) => {
  const isRemoving = feeSplits.length === 0;

  const rows: FeeSplit[] = isRemoving
    ? [{ recipient: rewardsAddress, share: 10000n }]
    : feeSplits;

  return (
    <Modal
      {...props}
      onClose={undefined}
      title="Confirm splitter configuration"
    >
      <Stack direction="column" gap="xxl">
        <Stack direction="column" gap="md">
          {isRemoving ? (
            <>
              <Text size="xs" weight={700}>
                Are you sure you want to stop splitting rewards?
              </Text>
              <Text size="xs" color="secondary">
                All rewards will be sent to the following address.
              </Text>
            </>
          ) : (
            <>
              <Text size="xs" weight={700}>
                Are you sure you want to set the following addresses in the
                splitter?
              </Text>
              <Stack direction="column" gap="xs">
                <Text size="xs" color="secondary">
                  Please note:
                </Text>
                <Text as="div" size="xs" color="secondary">
                  <ul>
                    <li>
                      Editing is disabled while you have unclaimed rewards.
                    </li>
                    <li>Additional addresses receive rewards in stETH only.</li>
                    <li>
                      Claiming is permissionless: anyone can execute the claim,
                      but rewards go to the configured addresses.
                    </li>
                  </ul>
                </Text>
              </Stack>
            </>
          )}
        </Stack>

        <Stack direction="column" gap="sm">
          <TableHeader>
            <div>Address</div>
            <div>Share</div>
          </TableHeader>
          {rows.map((row) => (
            <TableRow key={row.recipient}>
              <AddressCell>
                <AddressComponent
                  address={row.recipient}
                  symbols={40}
                  size="xxs"
                />
              </AddressCell>
              <ShareCell>{formatPercent(row.share, false, 2)} %</ShareCell>
            </TableRow>
          ))}
        </Stack>

        <Stack direction="row" gap="md">
          <Button fullwidth size="sm" variant="outlined" onClick={onReject}>
            Cancel
          </Button>
          <Button fullwidth size="sm" onClick={onConfirm}>
            Confirm
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
};
