import {
  Body,
  Button,
  Card,
  CheckboxRow,
  Description,
  IconChevronDown,
  Stack,
} from '@lidofinance/lido-app-ui';
import { FC, useState } from 'react';
import type { MemberDto } from 'modules/surveys-sdk/generated';
import { ConfirmModalProps, getUseConfirmModal } from 'shared/hooks';
import { FormModalShell } from 'shared/transaction-modal/form-modal-shell';
import { ConfirmationList } from '../../shared';
import { MemberSummary } from '../initialized/member-summary';
import type { SlotDraft } from '../utils/rotation';

type ConfirmRotationModalProps = ConfirmModalProps & {
  open?: boolean;
  index: number;
  current: MemberDto;
  next: SlotDraft;
};

const ConfirmRotationModal: FC<ConfirmRotationModalProps> = ({
  open,
  index,
  current,
  next,
  onConfirm,
  onReject,
}) => {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <FormModalShell
      open={open}
      onClose={onReject}
      title="You are submitting cluster member rotation"
      subtitle="Please review the changes below before confirming"
      data-testid="confirmRotationModal"
    >
      <Stack gap={24}>
        <Stack gap={8} align="center">
          <Card style={{ width: '100%' }}>
            <MemberSummary
              title={`Current cluster member #${index + 1}`}
              member={current}
            />
          </Card>
          <IconChevronDown aria-hidden />
          <Card style={{ width: '100%' }}>
            <MemberSummary
              title={`New cluster member #${index + 1}`}
              member={{
                address: next.newAddress,
                discordHandle: next.discordHandle,
                telegramUsername: next.telegramUsername,
              }}
            />
          </Card>
        </Stack>

        <CheckboxRow
          checked={confirmed}
          onChange={() => setConfirmed((v) => !v)}
          label={<Body>New participant confirms that:</Body>}
          description={
            <Description as="div" color="secondary">
              <ConfirmationList>
                <li>
                  They understand the requirements and eligibility criteria
                </li>
                <li>
                  They agree to enroll in monitoring via DVT provider specific
                  tooling (e.g. Obol Grafana metrics or automatic SSV Network
                  metrics)
                </li>
              </ConfirmationList>
            </Description>
          }
          dataTestId={{ input: 'confirmRotationCheckbox' }}
        />

        <Stack direction={{ base: 'row', sm: 'column' }} gap={12}>
          <Button
            fullWidth
            disabled={!confirmed}
            onClick={onConfirm}
            dataTestId={{ root: 'submitRotationRequestButton' }}
          >
            Submit rotation request
          </Button>
          <Button fullWidth variant="outline" onClick={onReject}>
            Back
          </Button>
        </Stack>
      </Stack>
    </FormModalShell>
  );
};

export const useConfirmRotationModal = getUseConfirmModal(ConfirmRotationModal);
